import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("PredictionMarket", function () {
  async function deploy() {
    const [treasury, creator, bettor1, bettor2] = await ethers.getSigners();

    const market = await ethers.deployContract("PredictionMarket", [treasury.address]);

    const block = await ethers.provider.getBlock("latest");
    const deadline = block!.timestamp + 7200; // 2 hours from now

    return { market, treasury, creator, bettor1, bettor2, deadline };
  }

  describe("createMarket", function () {
    it("should create a market with options", async function () {
      const { market, creator, deadline } = await deploy();

      await market.connect(creator).createMarket("Who wins?", ["Team A", "Team B"], deadline);

      const m = await market.getMarket(0);
      expect(m.creator).to.equal(creator.address);
      expect(m.question).to.equal("Who wins?");
      expect(m.options.length).to.equal(2);
      expect(m.resolved).to.be.false;
    });

    it("should revert with fewer than 2 options", async function () {
      const { market, creator, deadline } = await deploy();

      await expect(
        market.connect(creator).createMarket("Q?", ["Only One"], deadline)
      ).to.be.revertedWith("Need at least 2 options");
    });

    it("should revert if deadline too soon", async function () {
      const { market, creator } = await deploy();

      const block = await ethers.provider.getBlock("latest");
      const soon = block!.timestamp + 60;
      await expect(
        market.connect(creator).createMarket("Q?", ["A", "B"], soon)
      ).to.be.revertedWith("Deadline too soon");
    });
  });

  describe("placeBet", function () {
    it("should accept bets and update pools", async function () {
      const { market, creator, bettor1, bettor2, deadline } = await deploy();

      await market.connect(creator).createMarket("Who wins?", ["A", "B"], deadline);

      const bet1 = ethers.parseEther("1");
      const bet2 = ethers.parseEther("2");

      await market.connect(bettor1).placeBet(0, 0, { value: bet1 });
      await market.connect(bettor2).placeBet(0, 1, { value: bet2 });

      expect(await market.getOptionPool(0, 0)).to.equal(bet1);
      expect(await market.getOptionPool(0, 1)).to.equal(bet2);
      expect(await market.getUserBet(0, bettor1.address, 0)).to.equal(bet1);

      const m = await market.getMarket(0);
      expect(m.totalPool).to.equal(bet1 + bet2);
    });

    it("should revert if bet amount is zero", async function () {
      const { market, creator, bettor1, deadline } = await deploy();

      await market.connect(creator).createMarket("Q?", ["A", "B"], deadline);

      await expect(
        market.connect(bettor1).placeBet(0, 0, { value: 0 })
      ).to.be.revertedWith("Bet amount must be > 0");
    });

    it("should revert after deadline", async function () {
      const { market, creator, bettor1, deadline } = await deploy();

      await market.connect(creator).createMarket("Q?", ["A", "B"], deadline);

      await ethers.provider.send("evm_increaseTime", [7201]);
      await ethers.provider.send("evm_mine", []);

      await expect(
        market.connect(bettor1).placeBet(0, 0, { value: 1000n })
      ).to.be.revertedWith("Betting closed");
    });
  });

  describe("resolveMarket", function () {
    it("should resolve market and send fee to treasury", async function () {
      const { market, treasury, creator, bettor1, deadline } = await deploy();

      await market.connect(creator).createMarket("Q?", ["A", "B"], deadline);
      await market.connect(bettor1).placeBet(0, 0, { value: ethers.parseEther("10") });

      await ethers.provider.send("evm_increaseTime", [7201]);
      await ethers.provider.send("evm_mine", []);

      const treasuryBefore = await ethers.provider.getBalance(treasury.address);
      await market.connect(creator).resolveMarket(0, 0);
      const treasuryAfter = await ethers.provider.getBalance(treasury.address);

      const m = await market.getMarket(0);
      expect(m.resolved).to.be.true;
      expect(m.winningOption).to.equal(0n);

      // 2% fee of 10 KAIA = 0.2 KAIA
      const expectedFee = ethers.parseEther("0.2");
      expect(treasuryAfter - treasuryBefore).to.equal(expectedFee);
    });

    it("should revert if not creator", async function () {
      const { market, creator, bettor1, deadline } = await deploy();

      await market.connect(creator).createMarket("Q?", ["A", "B"], deadline);

      await ethers.provider.send("evm_increaseTime", [7201]);
      await ethers.provider.send("evm_mine", []);

      await expect(
        market.connect(bettor1).resolveMarket(0, 0)
      ).to.be.revertedWith("Only creator can resolve");
    });

    it("should revert before deadline", async function () {
      const { market, creator, deadline } = await deploy();

      await market.connect(creator).createMarket("Q?", ["A", "B"], deadline);

      await expect(
        market.connect(creator).resolveMarket(0, 0)
      ).to.be.revertedWith("Betting not closed yet");
    });
  });

  describe("claimReward", function () {
    it("should distribute rewards proportionally to winners", async function () {
      const { market, creator, bettor1, bettor2, deadline } = await deploy();

      await market.connect(creator).createMarket("Q?", ["A", "B"], deadline);

      // bettor1: 3 KAIA on A (winner), bettor2: 7 KAIA on B (loser)
      await market.connect(bettor1).placeBet(0, 0, { value: ethers.parseEther("3") });
      await market.connect(bettor2).placeBet(0, 1, { value: ethers.parseEther("7") });

      await ethers.provider.send("evm_increaseTime", [7201]);
      await ethers.provider.send("evm_mine", []);

      await market.connect(creator).resolveMarket(0, 0);

      const before = await ethers.provider.getBalance(bettor1.address);
      const tx = await market.connect(bettor1).claimReward(0);
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      const after = await ethers.provider.getBalance(bettor1.address);

      // totalPool=10, fee=0.2, rewardPool=9.8, bettor1 is sole winner → 9.8 KAIA
      const expectedReward = ethers.parseEther("9.8");
      expect(after - before + gasUsed).to.equal(expectedReward);
    });

    it("should revert if no winning bet", async function () {
      const { market, creator, bettor2, deadline } = await deploy();

      await market.connect(creator).createMarket("Q?", ["A", "B"], deadline);
      await market.connect(bettor2).placeBet(0, 1, { value: ethers.parseEther("5") });

      await ethers.provider.send("evm_increaseTime", [7201]);
      await ethers.provider.send("evm_mine", []);

      await market.connect(creator).resolveMarket(0, 0);

      await expect(
        market.connect(bettor2).claimReward(0)
      ).to.be.revertedWith("No winning bet");
    });

    it("should revert if already claimed", async function () {
      const { market, creator, bettor1, deadline } = await deploy();

      await market.connect(creator).createMarket("Q?", ["A", "B"], deadline);
      await market.connect(bettor1).placeBet(0, 0, { value: ethers.parseEther("1") });

      await ethers.provider.send("evm_increaseTime", [7201]);
      await ethers.provider.send("evm_mine", []);

      await market.connect(creator).resolveMarket(0, 0);
      await market.connect(bettor1).claimReward(0);

      await expect(
        market.connect(bettor1).claimReward(0)
      ).to.be.revertedWith("Already claimed");
    });
  });
});
