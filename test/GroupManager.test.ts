import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("GroupManager", function () {
  async function deploy() {
    const [owner, user1, user2] = await ethers.getSigners();
    const groupManager = await ethers.deployContract("GroupManager");
    return { groupManager, owner, user1, user2 };
  }

  describe("createGroup", function () {
    it("should create a group and set creator as member", async function () {
      const { groupManager, owner } = await deploy();

      await groupManager.createGroup("Test Group");
      const [gOwner, name, memberCount] = await groupManager.getGroup(0);

      expect(gOwner).to.equal(owner.address);
      expect(name).to.equal("Test Group");
      expect(memberCount).to.equal(1n);
    });

    it("should increment groupCount", async function () {
      const { groupManager } = await deploy();

      await groupManager.createGroup("Group 1");
      await groupManager.createGroup("Group 2");

      expect(await groupManager.groupCount()).to.equal(2n);
    });

    it("should emit GroupCreated and MemberJoined events", async function () {
      const { groupManager, owner } = await deploy();

      await expect(groupManager.createGroup("Test"))
        .to.emit(groupManager, "GroupCreated")
        .withArgs(0n, owner.address, "Test")
        .and.to.emit(groupManager, "MemberJoined")
        .withArgs(0n, owner.address);
    });
  });

  describe("joinGroup", function () {
    it("should allow a non-member to join", async function () {
      const { groupManager, user1 } = await deploy();

      await groupManager.createGroup("Test");
      await groupManager.connect(user1).joinGroup(0);

      expect(await groupManager.isMember(0, user1.address)).to.be.true;
      const [, , memberCount] = await groupManager.getGroup(0);
      expect(memberCount).to.equal(2n);
    });

    it("should revert if already a member", async function () {
      const { groupManager } = await deploy();

      await groupManager.createGroup("Test");
      await expect(groupManager.joinGroup(0)).to.be.revertedWith("Already a member");
    });

    it("should revert for non-existent group", async function () {
      const { groupManager, user1 } = await deploy();

      await expect(groupManager.connect(user1).joinGroup(99)).to.be.revertedWith(
        "Group does not exist"
      );
    });
  });

  describe("leaveGroup", function () {
    it("should allow a member to leave", async function () {
      const { groupManager, user1 } = await deploy();

      await groupManager.createGroup("Test");
      await groupManager.connect(user1).joinGroup(0);
      await groupManager.connect(user1).leaveGroup(0);

      expect(await groupManager.isMember(0, user1.address)).to.be.false;
      const [, , memberCount] = await groupManager.getGroup(0);
      expect(memberCount).to.equal(1n);
    });

    it("should revert if owner tries to leave", async function () {
      const { groupManager } = await deploy();

      await groupManager.createGroup("Test");
      await expect(groupManager.leaveGroup(0)).to.be.revertedWith("Owner cannot leave");
    });

    it("should revert if not a member", async function () {
      const { groupManager, user1 } = await deploy();

      await groupManager.createGroup("Test");
      await expect(groupManager.connect(user1).leaveGroup(0)).to.be.revertedWith(
        "Not a member"
      );
    });
  });
});
