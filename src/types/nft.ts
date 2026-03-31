export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
}

export interface NFTItem {
  tokenId: number;
  owner: string;
  creator: string;
  tokenURI: string;
  metadata?: NFTMetadata;
}

export interface NFTListing {
  listingId: number;
  seller: string;
  nftContract: string;
  tokenId: number;
  price: bigint;
  active: boolean;
}
