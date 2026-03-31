import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("CommunityNFT", function () {
  async function deploy() {
    const [owner, user1, user2] = await ethers.getSigners();
    const nft = await ethers.deployContract("CommunityNFT");
    return { nft, owner, user1, user2 };
  }

  describe("mintNFT", function () {
    it("should mint NFT with correct URI and creator", async function () {
      const { nft, owner, user1 } = await deploy();

      await nft.mintNFT(user1.address, "ipfs://metadata1");

      expect(await nft.ownerOf(0)).to.equal(user1.address);
      expect(await nft.tokenURI(0)).to.equal("ipfs://metadata1");
      expect(await nft.tokenCreator(0)).to.equal(owner.address);
    });

    it("should increment token IDs", async function () {
      const { nft, user1 } = await deploy();

      await nft.mintNFT(user1.address, "uri1");
      await nft.mintNFT(user1.address, "uri2");

      expect(await nft.balanceOf(user1.address)).to.equal(2n);
      expect(await nft.tokenOfOwnerByIndex(user1.address, 0)).to.equal(0n);
      expect(await nft.tokenOfOwnerByIndex(user1.address, 1)).to.equal(1n);
    });

    it("should emit NFTMinted event", async function () {
      const { nft, owner, user1 } = await deploy();

      await expect(nft.mintNFT(user1.address, "ipfs://test"))
        .to.emit(nft, "NFTMinted")
        .withArgs(0n, owner.address, "ipfs://test");
    });
  });
});
