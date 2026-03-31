"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { CONTRACTS } from "@/config/contracts";
import CommunityNFTABI from "@/lib/contracts/CommunityNFT.json";
import NFTMarketplaceABI from "@/lib/contracts/NFTMarketplace.json";

export function useMintNFT() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const mint = (to: `0x${string}`, tokenURI: string) => {
    writeContract({
      address: CONTRACTS.COMMUNITY_NFT,
      abi: CommunityNFTABI,
      functionName: "mintNFT",
      args: [to, tokenURI],
    });
  };

  return { mint, isPending, isConfirming, isSuccess, hash };
}

export function useNFTBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACTS.COMMUNITY_NFT,
    abi: CommunityNFTABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });
}

export function useTokenOfOwnerByIndex(owner: `0x${string}` | undefined, index: number) {
  return useReadContract({
    address: CONTRACTS.COMMUNITY_NFT,
    abi: CommunityNFTABI,
    functionName: "tokenOfOwnerByIndex",
    args: owner ? [owner, BigInt(index)] : undefined,
  });
}

export function useTokenURI(tokenId: number) {
  return useReadContract({
    address: CONTRACTS.COMMUNITY_NFT,
    abi: CommunityNFTABI,
    functionName: "tokenURI",
    args: [BigInt(tokenId)],
  });
}

export function useTokenCreator(tokenId: number) {
  return useReadContract({
    address: CONTRACTS.COMMUNITY_NFT,
    abi: CommunityNFTABI,
    functionName: "tokenCreator",
    args: [BigInt(tokenId)],
  });
}

// Marketplace hooks
export function useListNFT() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const listNFT = (tokenId: number, priceInKaia: string) => {
    writeContract({
      address: CONTRACTS.NFT_MARKETPLACE,
      abi: NFTMarketplaceABI,
      functionName: "listNFT",
      args: [CONTRACTS.COMMUNITY_NFT, BigInt(tokenId), parseEther(priceInKaia)],
    });
  };

  return { listNFT, isPending, isConfirming, isSuccess, hash };
}

export function useBuyNFT() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const buyNFT = (listingId: number, price: bigint) => {
    writeContract({
      address: CONTRACTS.NFT_MARKETPLACE,
      abi: NFTMarketplaceABI,
      functionName: "buyNFT",
      args: [BigInt(listingId)],
      value: price,
    });
  };

  return { buyNFT, isPending, isConfirming, isSuccess, hash };
}

export function useCancelListing() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const cancelListing = (listingId: number) => {
    writeContract({
      address: CONTRACTS.NFT_MARKETPLACE,
      abi: NFTMarketplaceABI,
      functionName: "cancelListing",
      args: [BigInt(listingId)],
    });
  };

  return { cancelListing, isPending, isConfirming, isSuccess, hash };
}

export function useApproveNFT() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = () => {
    writeContract({
      address: CONTRACTS.COMMUNITY_NFT,
      abi: CommunityNFTABI,
      functionName: "setApprovalForAll",
      args: [CONTRACTS.NFT_MARKETPLACE, true],
    });
  };

  return { approve, isPending, isConfirming, isSuccess, hash };
}

export function useListing(listingId: number) {
  return useReadContract({
    address: CONTRACTS.NFT_MARKETPLACE,
    abi: NFTMarketplaceABI,
    functionName: "getListing",
    args: [BigInt(listingId)],
  });
}

export function useListingCount() {
  return useReadContract({
    address: CONTRACTS.NFT_MARKETPLACE,
    abi: NFTMarketplaceABI,
    functionName: "listingCount",
  });
}
