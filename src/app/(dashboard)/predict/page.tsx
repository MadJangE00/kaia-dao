"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMarketCount, useMarket } from "@/hooks/usePrediction";
import { formatKaia } from "@/lib/utils";
import { Plus, TrendingUp } from "lucide-react";

function MarketCard({ marketId }: { marketId: number }) {
  const { data } = useMarket(marketId);
  if (!data) return null;

  const [creator, question, options, deadline, totalPool, winningOption, resolved] =
    data as [string, string, string[], bigint, bigint, bigint, boolean];

  const deadlineDate = new Date(Number(deadline) * 1000);
  const isActive = Date.now() < deadlineDate.getTime() && !resolved;

  return (
    <Link href={`/predict/${marketId}`}>
      <Card className="hover:border-purple-600/50 transition-colors cursor-pointer">
        <CardContent>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold">{question}</h3>
            <Badge variant={isActive ? "success" : resolved ? "default" : "warning"}>
              {isActive ? "진행중" : resolved ? "종료" : "마감"}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {options.map((opt, i) => (
              <Badge key={i} variant="default">{opt}</Badge>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
            <span>총 상금: {formatKaia(totalPool)} KAIA</span>
            <span>마감: {deadlineDate.toLocaleDateString("ko-KR")}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function PredictPage() {
  const { data: count } = useMarketCount();
  const marketCount = count ? Number(count) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">승부 예측</h1>
        <Link href="/predict/create">
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            마켓 생성
          </Button>
        </Link>
      </div>

      {marketCount === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <TrendingUp className="h-12 w-12 mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400">아직 예측 마켓이 없습니다</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {Array.from({ length: marketCount }, (_, i) => (
            <MarketCard key={i} marketId={i} />
          ))}
        </div>
      )}
    </div>
  );
}
