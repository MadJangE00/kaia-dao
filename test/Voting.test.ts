import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Voting", function () {
  async function deploy() {
    const [owner, voter1, voter2, nonMember] = await ethers.getSigners();

    const groupManager = await ethers.deployContract("GroupManager");
    const voting = await ethers.deployContract("Voting", [
      await groupManager.getAddress(),
    ]);

    // Create group and add members
    await groupManager.createGroup("Test DAO");
    await groupManager.connect(voter1).joinGroup(0);
    await groupManager.connect(voter2).joinGroup(0);

    return { groupManager, voting, owner, voter1, voter2, nonMember };
  }

  describe("createProposal", function () {
    it("should create a proposal by group member", async function () {
      const { voting } = await deploy();

      await voting.createProposal(0, "Proposal 1", "Description", 3600);
      expect(await voting.proposalCount()).to.equal(1n);
    });

    it("should revert if not a group member", async function () {
      const { voting, nonMember } = await deploy();

      await expect(
        voting.connect(nonMember).createProposal(0, "Title", "Desc", 3600)
      ).to.be.revertedWith("Not a group member");
    });

    it("should revert if duration too short", async function () {
      const { voting } = await deploy();

      await expect(
        voting.createProposal(0, "Title", "Desc", 60)
      ).to.be.revertedWith("Duration too short");
    });

    it("should revert if duration too long", async function () {
      const { voting } = await deploy();

      await expect(
        voting.createProposal(0, "Title", "Desc", 31 * 24 * 3600)
      ).to.be.revertedWith("Duration too long");
    });
  });

  describe("castVote", function () {
    it("should cast a For vote", async function () {
      const { voting, voter1 } = await deploy();

      await voting.createProposal(0, "Title", "Desc", 3600);
      await voting.connect(voter1).castVote(0, 1);

      const proposal = await voting.getProposal(0);
      expect(proposal.forVotes).to.equal(1n);
    });

    it("should cast Against and Abstain votes", async function () {
      const { voting, owner, voter1, voter2 } = await deploy();

      await voting.createProposal(0, "Title", "Desc", 3600);
      await voting.connect(owner).castVote(0, 0);
      await voting.connect(voter1).castVote(0, 1);
      await voting.connect(voter2).castVote(0, 2);

      const proposal = await voting.getProposal(0);
      expect(proposal.againstVotes).to.equal(1n);
      expect(proposal.forVotes).to.equal(1n);
      expect(proposal.abstainVotes).to.equal(1n);
    });

    it("should revert if already voted", async function () {
      const { voting } = await deploy();

      await voting.createProposal(0, "Title", "Desc", 3600);
      await voting.castVote(0, 1);

      await expect(voting.castVote(0, 0)).to.be.revertedWith("Already voted");
    });

    it("should revert if not a group member", async function () {
      const { voting, nonMember } = await deploy();

      await voting.createProposal(0, "Title", "Desc", 3600);

      await expect(voting.connect(nonMember).castVote(0, 1)).to.be.revertedWith(
        "Not a group member"
      );
    });
  });

  describe("finalizeProposal", function () {
    it("should pass proposal when forVotes > againstVotes", async function () {
      const { voting, voter1 } = await deploy();

      await voting.createProposal(0, "Title", "Desc", 3600);
      await voting.castVote(0, 1);
      await voting.connect(voter1).castVote(0, 1);

      // Advance time past deadline
      await ethers.provider.send("evm_increaseTime", [3601]);
      await ethers.provider.send("evm_mine", []);

      await voting.finalizeProposal(0);

      const proposal = await voting.getProposal(0);
      expect(proposal.status).to.equal(1n); // Passed
      expect(proposal.finalized).to.be.true;
    });

    it("should fail proposal when againstVotes >= forVotes", async function () {
      const { voting, voter1 } = await deploy();

      await voting.createProposal(0, "Title", "Desc", 3600);
      await voting.castVote(0, 0);
      await voting.connect(voter1).castVote(0, 0);

      await ethers.provider.send("evm_increaseTime", [3601]);
      await ethers.provider.send("evm_mine", []);

      await voting.finalizeProposal(0);

      const proposal = await voting.getProposal(0);
      expect(proposal.status).to.equal(2n); // Failed
    });

    it("should revert if voting not ended", async function () {
      const { voting } = await deploy();

      await voting.createProposal(0, "Title", "Desc", 3600);

      await expect(voting.finalizeProposal(0)).to.be.revertedWith("Voting not ended");
    });

    it("should revert if already finalized", async function () {
      const { voting } = await deploy();

      await voting.createProposal(0, "Title", "Desc", 3600);

      await ethers.provider.send("evm_increaseTime", [3601]);
      await ethers.provider.send("evm_mine", []);

      await voting.finalizeProposal(0);

      await expect(voting.finalizeProposal(0)).to.be.revertedWith("Already finalized");
    });
  });
});
