import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("NFTMarketplace", function () {
  async function deploy() {
    const [owner, seller, buyer, feeRecipient] = await ethers.getSigners();

    const nft = await ethers.deployContract("CommunityNFT");
    const marketplace = await ethers.deployContract("NFTMarketplace", [
      feeRecipient.address,
    ]);

    // Mint NFT to seller
    await nft.mintNFT(seller.address, "ipfs://test");
    // Approve marketplace
    await nft.connect(seller).setApprovalForAll(await marketplace.getAddress(), true);

    return { nft, marketplace, owner, seller, buyer, feeRecipient };
  }

  describe("listNFT", function () {
    it("should list an NFT for sale", async function () {
      const { nft, marketplace, seller } = await deploy();

      const price = ethers.parseEther("1");
      await marketplace.connect(seller).listNFT(await nft.getAddress(), 0, price);

      const listing = await marketplace.getListing(0);
      expect(listing.seller).to.equal(seller.address);
      expect(listing.price).to.equal(price);
      expect(listing.active).to.be.true;
    });

    it("should revert if not the owner", async function () {
      const { nft, marketplace, buyer } = await deploy();

      await expect(
        marketplace.connect(buyer).listNFT(await nft.getAddress(), 0, 1000n)
      ).to.be.revertedWith("Not the owner");
    });

    it("should revert if price is zero", async function () {
      const { nft, marketplace, seller } = await deploy();

      await expect(
        marketplace.connect(seller).listNFT(await nft.getAddress(), 0, 0)
      ).to.be.revertedWith("Price must be > 0");
    });
  });

  describe("buyNFT", function () {
    it("should transfer NFT and distribute payments", async function () {
      const { nft, marketplace, seller, buyer, feeRecipient } = await deploy();

      const price = ethers.parseEther("1");
      await marketplace.connect(seller).listNFT(await nft.getAddress(), 0, price);

      const sellerBefore = await ethers.provider.getBalance(seller.address);
      const feeBefore = await ethers.provider.getBalance(feeRecipient.address);

      await marketplace.connect(buyer).buyNFT(0, { value: price });

      // NFT transferred
      expect(await nft.ownerOf(0)).to.equal(buyer.address);

      // Listing deactivated
      const listing = await marketplace.getListing(0);
      expect(listing.active).to.be.false;

      // Seller received 97.5%
      const sellerAfter = await ethers.provider.getBalance(seller.address);
      const expectedSeller = (price * 9750n) / 10000n;
      expect(sellerAfter - sellerBefore).to.equal(expectedSeller);

      // Fee recipient received 2.5%
      const feeAfter = await ethers.provider.getBalance(feeRecipient.address);
      const expectedFee = (price * 250n) / 10000n;
      expect(feeAfter - feeBefore).to.equal(expectedFee);
    });

    it("should revert if buyer is seller", async function () {
      const { nft, marketplace, seller } = await deploy();

      const price = ethers.parseEther("1");
      await marketplace.connect(seller).listNFT(await nft.getAddress(), 0, price);

      await expect(
        marketplace.connect(seller).buyNFT(0, { value: price })
      ).to.be.revertedWith("Cannot buy own NFT");
    });

    it("should revert if insufficient payment", async function () {
      const { nft, marketplace, seller, buyer } = await deploy();

      const price = ethers.parseEther("1");
      await marketplace.connect(seller).listNFT(await nft.getAddress(), 0, price);

      await expect(
        marketplace.connect(buyer).buyNFT(0, { value: ethers.parseEther("0.5") })
      ).to.be.revertedWith("Insufficient payment");
    });
  });

  describe("cancelListing", function () {
    it("should cancel a listing", async function () {
      const { nft, marketplace, seller } = await deploy();

      const price = ethers.parseEther("1");
      await marketplace.connect(seller).listNFT(await nft.getAddress(), 0, price);
      await marketplace.connect(seller).cancelListing(0);

      const listing = await marketplace.getListing(0);
      expect(listing.active).to.be.false;
    });

    it("should revert if not the seller", async function () {
      const { nft, marketplace, seller, buyer } = await deploy();

      const price = ethers.parseEther("1");
      await marketplace.connect(seller).listNFT(await nft.getAddress(), 0, price);

      await expect(marketplace.connect(buyer).cancelListing(0)).to.be.revertedWith(
        "Not the seller"
      );
    });
  });
});
