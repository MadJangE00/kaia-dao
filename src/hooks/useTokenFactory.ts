"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import TokenFactoryABI from "@/lib/contracts/TokenFactory.json";
import CustomTokenABI from "@/lib/contracts/CustomToken.json";

export function useCreateToken() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createToken = (name: string, symbol: string, initialSupply: number) => {
    writeContract({
      address: CONTRACTS.TOKEN_FACTORY,
      abi: TokenFactoryABI,
      functionName: "createToken",
      args: [name, symbol, BigInt(initialSupply)],
    });
  };

  return { createToken, isPending, isConfirming, isSuccess, hash };
}

export function useUserTokens(creator: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACTS.TOKEN_FACTORY,
    abi: TokenFactoryABI,
    functionName: "getTokensByCreator",
    args: creator ? [creator] : undefined,
  });
}

export function useTokenBalance(tokenAddress: `0x${string}`, account: `0x${string}` | undefined) {
  return useReadContract({
    address: tokenAddress,
    abi: CustomTokenABI,
    functionName: "balanceOf",
    args: account ? [account] : undefined,
  });
}

export function useTokenInfo(tokenAddress: `0x${string}`) {
  const { data: name } = useReadContract({
    address: tokenAddress,
    abi: CustomTokenABI,
    functionName: "name",
  });
  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: CustomTokenABI,
    functionName: "symbol",
  });
  const { data: totalSupply } = useReadContract({
    address: tokenAddress,
    abi: CustomTokenABI,
    functionName: "totalSupply",
  });

  return { name: name as string | undefined, symbol: symbol as string | undefined, totalSupply: totalSupply as bigint | undefined };
}

export function useTransferToken() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const transfer = (tokenAddress: `0x${string}`, to: `0x${string}`, amount: bigint) => {
    writeContract({
      address: tokenAddress,
      abi: CustomTokenABI,
      functionName: "transfer",
      args: [to, amount],
    });
  };

  return { transfer, isPending, isConfirming, isSuccess, hash };
}
