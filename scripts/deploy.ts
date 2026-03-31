import { network } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const { ethers } = await network.connect();
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "KAIA");
  console.log("");

  // 1. GroupManager
  console.log("Deploying GroupManager...");
  const groupManager = await ethers.deployContract("GroupManager");
  const groupManagerAddr = await groupManager.getAddress();
  console.log("  GroupManager:", groupManagerAddr);

  // 2. Voting (depends on GroupManager)
  console.log("Deploying Voting...");
  const voting = await ethers.deployContract("Voting", [groupManagerAddr]);
  const votingAddr = await voting.getAddress();
  console.log("  Voting:", votingAddr);

  // 3. PredictionMarket (treasury = deployer)
  console.log("Deploying PredictionMarket...");
  const predictionMarket = await ethers.deployContract("PredictionMarket", [deployer.address]);
  const predictionMarketAddr = await predictionMarket.getAddress();
  console.log("  PredictionMarket:", predictionMarketAddr);

  // 4. TokenFactory
  console.log("Deploying TokenFactory...");
  const tokenFactory = await ethers.deployContract("TokenFactory");
  const tokenFactoryAddr = await tokenFactory.getAddress();
  console.log("  TokenFactory:", tokenFactoryAddr);

  // 5. CommunityNFT
  console.log("Deploying CommunityNFT...");
  const communityNFT = await ethers.deployContract("CommunityNFT");
  const communityNFTAddr = await communityNFT.getAddress();
  console.log("  CommunityNFT:", communityNFTAddr);

  // 6. NFTMarketplace (feeRecipient = deployer)
  console.log("Deploying NFTMarketplace...");
  const nftMarketplace = await ethers.deployContract("NFTMarketplace", [deployer.address]);
  const nftMarketplaceAddr = await nftMarketplace.getAddress();
  console.log("  NFTMarketplace:", nftMarketplaceAddr);

  console.log("\n--- All contracts deployed ---\n");

  // Generate .env.local content
  const envContent = `# Smart Contract Addresses (deployed ${new Date().toISOString()})
NEXT_PUBLIC_GROUP_MANAGER_ADDRESS=${groupManagerAddr}
NEXT_PUBLIC_VOTING_ADDRESS=${votingAddr}
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=${predictionMarketAddr}
NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS=${tokenFactoryAddr}
NEXT_PUBLIC_COMMUNITY_NFT_ADDRESS=${communityNFTAddr}
NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS=${nftMarketplaceAddr}
`;

  const envPath = path.join(__dirname, "..", ".env.contracts");
  fs.writeFileSync(envPath, envContent);
  console.log("Contract addresses saved to .env.contracts");
  console.log("Copy these to your .env.local or Vercel environment variables.");
  console.log(envContent);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
