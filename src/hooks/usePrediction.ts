"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { CONTRACTS } from "@/config/contracts";
import PredictionMarketABI from "@/lib/contracts/PredictionMarket.json";

export function useMarketCount() {
  return useReadContract({
    address: CONTRACTS.PREDICTION_MARKET,
    abi: PredictionMarketABI,
    functionName: "marketCount",
  });
}

export function useMarket(marketId: number) {
  return useReadContract({
    address: CONTRACTS.PREDICTION_MARKET,
    abi: PredictionMarketABI,
    functionName: "getMarket",
    args: [BigInt(marketId)],
  });
}

export function useOptionPool(marketId: number, optionIndex: number) {
  return useReadContract({
    address: CONTRACTS.PREDICTION_MARKET,
    abi: PredictionMarketABI,
    functionName: "getOptionPool",
    args: [BigInt(marketId), BigInt(optionIndex)],
  });
}

export function useUserBet(marketId: number, user: `0x${string}` | undefined, optionIndex: number) {
  return useReadContract({
    address: CONTRACTS.PREDICTION_MARKET,
    abi: PredictionMarketABI,
    functionName: "getUserBet",
    args: user ? [BigInt(marketId), user, BigInt(optionIndex)] : undefined,
  });
}

export function useCreateMarket() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createMarket = (question: string, options: string[], deadline: number) => {
    writeContract({
      address: CONTRACTS.PREDICTION_MARKET,
      abi: PredictionMarketABI,
      functionName: "createMarket",
      args: [question, options, BigInt(deadline)],
    });
  };

  return { createMarket, isPending, isConfirming, isSuccess, hash };
}

export function usePlaceBet() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const placeBet = (marketId: number, optionIndex: number, amountInKaia: string) => {
    writeContract({
      address: CONTRACTS.PREDICTION_MARKET,
      abi: PredictionMarketABI,
      functionName: "placeBet",
      args: [BigInt(marketId), BigInt(optionIndex)],
      value: parseEther(amountInKaia),
    });
  };

  return { placeBet, isPending, isConfirming, isSuccess, hash };
}

export function useResolveMarket() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const resolveMarket = (marketId: number, winningOption: number) => {
    writeContract({
      address: CONTRACTS.PREDICTION_MARKET,
      abi: PredictionMarketABI,
      functionName: "resolveMarket",
      args: [BigInt(marketId), BigInt(winningOption)],
    });
  };

  return { resolveMarket, isPending, isConfirming, isSuccess, hash };
}

export function useClaimReward() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claimReward = (marketId: number) => {
    writeContract({
      address: CONTRACTS.PREDICTION_MARKET,
      abi: PredictionMarketABI,
      functionName: "claimReward",
      args: [BigInt(marketId)],
    });
  };

  return { claimReward, isPending, isConfirming, isSuccess, hash };
}
