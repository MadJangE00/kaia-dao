"use client";

import { use, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useTokenInfo, useTokenBalance, useTransferToken } from "@/hooks/useTokenFactory";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { shortenAddress, formatKaia } from "@/lib/utils";

export default function TokenDetailPage({
  params,
}: {
  params: Promise<{ tokenAddress: string }>;
}) {
  const { tokenAddress } = use(params);
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;

  const { name, symbol, totalSupply } = useTokenInfo(tokenAddress as `0x${string}`);
  const { data: balance } = useTokenBalance(
    tokenAddress as `0x${string}`,
    walletAddress as `0x${string}`
  );
  const { transfer, isPending, isConfirming, isSuccess } = useTransferToken();

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  if (!name) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        로딩중...
      </div>
    );
  }

  const isLoading = isPending || isConfirming;

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !amount) return;
    transfer(tokenAddress as `0x${string}`, to as `0x${string}`, BigInt(amount) * BigInt(10 ** 18));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-6 rounded-xl border border-gray-800 bg-gray-900 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold">{name}</h1>
          <Badge>{symbol}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-lg bg-gray-800">
            <p className="text-gray-400 mb-1">총 발행량</p>
            <p className="text-lg font-semibold">{totalSupply ? formatKaia(totalSupply) : "0"}</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-800">
            <p className="text-gray-400 mb-1">내 잔액</p>
            <p className="text-lg font-semibold">
              {balance !== undefined ? formatKaia(balance as bigint) : "0"}
            </p>
          </div>
          <div className="col-span-2 p-4 rounded-lg bg-gray-800">
            <p className="text-gray-400 mb-1">컨트랙트 주소</p>
            <p className="font-mono text-sm">{tokenAddress}</p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl border border-gray-800 bg-gray-900">
        <h2 className="text-lg font-semibold mb-4">토큰 전송</h2>
        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">받는 주소</label>
            <Input
              placeholder="0x..."
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">수량</label>
            <Input
              type="number"
              placeholder="전송할 수량"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
            />
          </div>
          {isSuccess && (
            <p className="text-sm text-green-400">전송이 완료되었습니다!</p>
          )}
          <button
            type="submit"
            disabled={!to || !amount || isLoading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isPending ? "승인 대기중..." : isConfirming ? "전송 처리중..." : "전송"}
          </button>
        </form>
      </div>
    </div>
  );
}
