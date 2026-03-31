import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("TokenFactory", function () {
  async function deploy() {
    const [owner, user1] = await ethers.getSigners();
    const tokenFactory = await ethers.deployContract("TokenFactory");
    return { tokenFactory, owner, user1 };
  }

  describe("createToken", function () {
    it("should deploy a new ERC20 token", async function () {
      const { tokenFactory, owner } = await deploy();

      await tokenFactory.createToken("MyToken", "MTK", 1000000n);

      const tokens = await tokenFactory.getTokensByCreator(owner.address);
      expect(tokens.length).to.equal(1);

      const CustomToken = await ethers.getContractFactory("CustomToken");
      const token = CustomToken.attach(tokens[0]);

      expect(await token.name()).to.equal("MyToken");
      expect(await token.symbol()).to.equal("MTK");
      expect(await token.owner()).to.equal(owner.address);
      expect(await token.totalSupply()).to.equal(1000000n * 10n ** 18n);
      expect(await token.balanceOf(owner.address)).to.equal(1000000n * 10n ** 18n);
    });

    it("should track multiple tokens per creator", async function () {
      const { tokenFactory } = await deploy();

      await tokenFactory.createToken("Token1", "TK1", 100n);
      await tokenFactory.createToken("Token2", "TK2", 200n);

      expect(await tokenFactory.getTokenCount()).to.equal(2n);
    });

    it("should revert if supply is zero", async function () {
      const { tokenFactory } = await deploy();

      await expect(tokenFactory.createToken("Bad", "BAD", 0n)).to.be.revertedWith(
        "Supply must be > 0"
      );
    });

    it("should allow token transfer", async function () {
      const { tokenFactory, owner, user1 } = await deploy();

      await tokenFactory.createToken("MyToken", "MTK", 1000n);
      const tokens = await tokenFactory.getTokensByCreator(owner.address);

      const CustomToken = await ethers.getContractFactory("CustomToken");
      const token = CustomToken.attach(tokens[0]);

      const amount = 100n * 10n ** 18n;
      await token.transfer(user1.address, amount);

      expect(await token.balanceOf(user1.address)).to.equal(amount);
    });
  });
});
