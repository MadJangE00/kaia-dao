"use client";

import { use, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMarket, usePlaceBet, useResolveMarket, useClaimReward } from "@/hooks/usePrediction";
import { usePrivy } from "@privy-io/react-auth";
import { formatKaia } from "@/lib/utils";

export default function MarketDetailPage({ params }: { params: Promise<{ marketId: string }> }) {
  const { marketId } = use(params);
  const id = parseInt(marketId);
  const { user } = usePrivy();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState("");

  const { data } = useMarket(id);
  const { placeBet, isPending: betPending, isConfirming: betConfirming } = usePlaceBet();
  const { resolveMarket, isPending: resolvePending } = useResolveMarket();
  const { claimReward, isPending: claimPending } = useClaimReward();

  if (!data) return <div className="text-center text-gray-400 py-12">로딩중...</div>;

  const [creator, question, options, deadline, totalPool, winningOption, resolved] =
    data as [string, string, string[], bigint, bigint, bigint, boolean];

  const deadlineDate = new Date(Number(deadline) * 1000);
  const isActive = Date.now() < deadlineDate.getTime() && !resolved;
  const canResolve = Date.now() >= deadlineDate.getTime() && !resolved &&
    user?.wallet?.address?.toLowerCase() === creator.toLowerCase();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardContent>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold">{question}</h1>
            <Badge variant={isActive ? "success" : resolved ? "default" : "warning"}>
              {isActive ? "진행중" : resolved ? "종료" : "마감"}
            </Badge>
          </div>
          <div className="text-sm text-gray-400 space-y-1">
            <p>총 상금 풀: {formatKaia(totalPool)} KAIA</p>
            <p>마감: {deadlineDate.toLocaleString("ko-KR")}</p>
            <p>생성자: {creator.slice(0, 6)}...{creator.slice(-4)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="font-semibold mb-4">선택지</h2>
          <div className="space-y-3">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => isActive && setSelectedOption(i)}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  selectedOption === i
                    ? "border-purple-500 bg-purple-600/20"
                    : resolved && Number(winningOption) === i
                    ? "border-green-500 bg-green-600/20"
                    : "border-gray-700 hover:border-gray-600"
                }`}
                disabled={!isActive}
              >
                <div className="flex items-center justify-between">
                  <span>{opt}</span>
                  {resolved && Number(winningOption) === i && (
                    <Badge variant="success">승리</Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {isActive && (
        <Card>
          <CardContent>
            <h2 className="font-semibold mb-4">베팅하기</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">베팅 금액 (KAIA)</label>
                <Input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="0.0"
                  min="0"
                  step="0.01"
                />
              </div>
              <Button
                className="w-full"
                onClick={() => selectedOption !== null && placeBet(id, selectedOption, betAmount)}
                disabled={selectedOption === null || !betAmount || betPending || betConfirming}
              >
                {betPending ? "승인 대기중..." : betConfirming ? "확인중..." : "베팅하기"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {canResolve && (
        <Card>
          <CardContent>
            <h2 className="font-semibold mb-4">결과 확정</h2>
            <div className="space-y-3">
              {options.map((opt, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="w-full"
                  onClick={() => resolveMarket(id, i)}
                  disabled={resolvePending}
                >
                  &quot;{opt}&quot; 승리로 확정
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {resolved && (
        <Button className="w-full" onClick={() => claimReward(id)} disabled={claimPending}>
          {claimPending ? "처리중..." : "보상 수령"}
        </Button>
      )}
    </div>
  );
}
