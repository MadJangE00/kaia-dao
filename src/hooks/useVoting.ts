"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import VotingABI from "@/lib/contracts/Voting.json";

export function useProposalCount() {
  return useReadContract({
    address: CONTRACTS.VOTING,
    abi: VotingABI,
    functionName: "proposalCount",
  });
}

export function useProposal(proposalId: number) {
  return useReadContract({
    address: CONTRACTS.VOTING,
    abi: VotingABI,
    functionName: "getProposal",
    args: [BigInt(proposalId)],
  });
}

export function useCreateProposal() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createProposal = (
    groupId: number,
    title: string,
    description: string,
    durationInSeconds: number
  ) => {
    writeContract({
      address: CONTRACTS.VOTING,
      abi: VotingABI,
      functionName: "createProposal",
      args: [BigInt(groupId), title, description, BigInt(durationInSeconds)],
    });
  };

  return { createProposal, isPending, isConfirming, isSuccess, hash };
}

export function useCastVote() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const castVote = (proposalId: number, voteType: 0 | 1 | 2) => {
    writeContract({
      address: CONTRACTS.VOTING,
      abi: VotingABI,
      functionName: "castVote",
      args: [BigInt(proposalId), voteType],
    });
  };

  return { castVote, isPending, isConfirming, isSuccess, hash };
}

export function useFinalizeProposal() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const finalizeProposal = (proposalId: number) => {
    writeContract({
      address: CONTRACTS.VOTING,
      abi: VotingABI,
      functionName: "finalizeProposal",
      args: [BigInt(proposalId)],
    });
  };

  return { finalizeProposal, isPending, isConfirming, isSuccess, hash };
}
