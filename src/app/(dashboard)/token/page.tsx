"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useUserTokens, useTokenInfo, useTokenBalance } from "@/hooks/useTokenFactory";
import { Badge } from "@/components/ui/badge";
import { shortenAddress, formatKaia } from "@/lib/utils";
import Link from "next/link";

function TokenCard({ tokenAddress, userAddress }: { tokenAddress: string; userAddress: string }) {
  const { name, symbol, totalSupply } = useTokenInfo(tokenAddress as `0x${string}`);
  const { data: balance } = useTokenBalance(tokenAddress as `0x${string}`, userAddress as `0x${string}`);

  if (!name) return null;

  return (
    <div className="p-5 rounded-xl border border-gray-800 bg-gray-900 hover:border-purple-500/40 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{name}</h3>
        <Badge>{symbol}</Badge>
      </div>
      <div className="space-y-2 text-sm text-gray-400">
        <div className="flex justify-between">
          <span>총 발행량</span>
          <span className="text-white">{totalSupply ? formatKaia(totalSupply) : "0"}</span>
        </div>
        <div className="flex justify-between">
          <span>내 잔액</span>
          <span className="text-white">
            {balance !== undefined ? formatKaia(balance as bigint) : "0"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>컨트랙트</span>
          <span className="text-white">{shortenAddress(tokenAddress)}</span>
        </div>
      </div>
      <Link
        href={`/token/${tokenAddress}`}
        className="mt-4 block text-center text-sm py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
      >
        상세 보기
      </Link>
    </div>
  );
}

export default function TokenPage() {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const { data: tokens } = useUserTokens(walletAddress as `0x${string}`);

  const tokenList = (tokens as string[]) || [];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">나의 토큰</h1>
          <p className="text-gray-400 text-sm mt-1">직접 발행한 ERC20 토큰을 관리합니다</p>
        </div>
        <Link
          href="/token/create"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          토큰 발행
        </Link>
      </div>

      {tokenList.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">🪙</div>
          <p className="text-lg font-medium mb-1">발행한 토큰이 없습니다</p>
          <p className="text-sm">나만의 커뮤니티 토큰을 발행해보세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokenList.map((addr: string) => (
            <TokenCard key={addr} tokenAddress={addr} userAddress={walletAddress!} />
          ))}
        </div>
      )}
    </div>
  );
}
