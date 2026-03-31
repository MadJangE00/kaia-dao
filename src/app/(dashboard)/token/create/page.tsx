"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateToken } from "@/hooks/useTokenFactory";
import { Input } from "@/components/ui/input";

export default function CreateTokenPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState("");

  const { createToken, isPending, isConfirming, isSuccess } = useCreateToken();

  useEffect(() => {
    if (isSuccess) router.push("/token");
  }, [isSuccess, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !symbol || !initialSupply) return;
    createToken(name, symbol, Number(initialSupply));
  };

  const isLoading = isPending || isConfirming;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2">토큰 발행</h1>
      <p className="text-gray-400 text-sm mb-8">나만의 ERC20 토큰을 생성합니다</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">토큰 이름</label>
          <Input
            placeholder="예: My Community Token"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">심볼</label>
          <Input
            placeholder="예: MCT"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            maxLength={10}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">초기 발행량</label>
          <Input
            type="number"
            placeholder="예: 1000000"
            value={initialSupply}
            onChange={(e) => setInitialSupply(e.target.value)}
            min="1"
          />
          <p className="text-xs text-gray-500 mt-1">발행된 토큰은 모두 내 지갑으로 전송됩니다</p>
        </div>

        <button
          type="submit"
          disabled={!name || !symbol || !initialSupply || isLoading}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          {isPending ? "승인 대기중..." : isConfirming ? "트랜잭션 처리중..." : "토큰 발행"}
        </button>
      </form>
    </div>
  );
}
