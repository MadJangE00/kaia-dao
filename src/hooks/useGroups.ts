"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import GroupManagerABI from "@/lib/contracts/GroupManager.json";

export function useGroupCount() {
  return useReadContract({
    address: CONTRACTS.GROUP_MANAGER,
    abi: GroupManagerABI,
    functionName: "groupCount",
  });
}

export function useGroup(groupId: number) {
  return useReadContract({
    address: CONTRACTS.GROUP_MANAGER,
    abi: GroupManagerABI,
    functionName: "getGroup",
    args: [BigInt(groupId)],
  });
}

export function useIsMember(groupId: number, address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACTS.GROUP_MANAGER,
    abi: GroupManagerABI,
    functionName: "isMember",
    args: address ? [BigInt(groupId), address] : undefined,
  });
}

export function useCreateGroup() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createGroup = (name: string) => {
    writeContract({
      address: CONTRACTS.GROUP_MANAGER,
      abi: GroupManagerABI,
      functionName: "createGroup",
      args: [name],
    });
  };

  return { createGroup, isPending, isConfirming, isSuccess, hash };
}

export function useJoinGroup() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const joinGroup = (groupId: number) => {
    writeContract({
      address: CONTRACTS.GROUP_MANAGER,
      abi: GroupManagerABI,
      functionName: "joinGroup",
      args: [BigInt(groupId)],
    });
  };

  return { joinGroup, isPending, isConfirming, isSuccess, hash };
}

export function useLeaveGroup() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const leaveGroup = (groupId: number) => {
    writeContract({
      address: CONTRACTS.GROUP_MANAGER,
      abi: GroupManagerABI,
      functionName: "leaveGroup",
      args: [BigInt(groupId)],
    });
  };

  return { leaveGroup, isPending, isConfirming, isSuccess, hash };
}
