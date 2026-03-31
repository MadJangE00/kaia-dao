// Update these addresses after deployment
export const CONTRACTS = {
  GROUP_MANAGER: process.env.NEXT_PUBLIC_GROUP_MANAGER_ADDRESS as `0x${string}`,
  VOTING: process.env.NEXT_PUBLIC_VOTING_ADDRESS as `0x${string}`,
  PREDICTION_MARKET: process.env.NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS as `0x${string}`,
  TOKEN_FACTORY: process.env.NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS as `0x${string}`,
  COMMUNITY_NFT: process.env.NEXT_PUBLIC_COMMUNITY_NFT_ADDRESS as `0x${string}`,
  NFT_MARKETPLACE: process.env.NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS as `0x${string}`,
} as const;
