"use client";

import { use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProposal, useCastVote, useFinalizeProposal } from "@/hooks/useVoting";
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react";

export default function ProposalDetailPage({ params }: { params: Promise<{ proposalId: string }> }) {
  const { proposalId } = use(params);
  const id = parseInt(proposalId);
  const { data } = useProposal(id);
  const { castVote, isPending: votePending, isConfirming: voteConfirming } = useCastVote();
  const { finalizeProposal, isPending: finPending } = useFinalizeProposal();

  if (!data) return <div className="text-center text-gray-400 py-12">로딩중...</div>;

  const [groupId, creator, title, description, forVotes, againstVotes, abstainVotes, deadline, status, finalized] =
    data as [bigint, string, string, string, bigint, bigint, bigint, bigint, number, boolean];

  const deadlineDate = new Date(Number(deadline) * 1000);
  const isActive = Date.now() < deadlineDate.getTime() && !finalized;
  const canFinalize = Date.now() >= deadlineDate.getTime() && !finalized;
  const total = Number(forVotes) + Number(againstVotes) + Number(abstainVotes);

  const voteData = [
    { label: "찬성", count: Number(forVotes), color: "bg-green-500", pct: total > 0 ? (Number(forVotes) / total) * 100 : 0 },
    { label: "반대", count: Number(againstVotes), color: "bg-red-500", pct: total > 0 ? (Number(againstVotes) / total) * 100 : 0 },
    { label: "기권", count: Number(abstainVotes), color: "bg-gray-500", pct: total > 0 ? (Number(abstainVotes) / total) * 100 : 0 },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardContent>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold">{title}</h1>
            <Badge variant={isActive ? "success" : status === 1 ? "success" : "danger"}>
              {isActive ? "진행중" : finalized ? (status === 1 ? "통과" : "부결") : "마감"}
            </Badge>
          </div>
          <p className="text-gray-300 mb-4">{description}</p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>그룹 ID: {groupId.toString()}</p>
            <p>제안자: {creator.slice(0, 6)}...{creator.slice(-4)}</p>
            <p>마감: {deadlineDate.toLocaleString("ko-KR")}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="font-semibold mb-4">투표 결과</h2>
          <div className="space-y-3">
            {voteData.map((v) => (
              <div key={v.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{v.label}</span>
                  <span>{v.count}표 ({v.pct.toFixed(1)}%)</span>
                </div>
                <div className="h-3 rounded-full bg-gray-700 overflow-hidden">
                  <div className={`h-full rounded-full ${v.color}`} style={{ width: `${v.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3 text-right">총 {total}표</p>
        </CardContent>
      </Card>

      {isActive && (
        <Card>
          <CardContent>
            <h2 className="font-semibold mb-4">투표하기</h2>
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => castVote(id, 1)}
                disabled={votePending || voteConfirming}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                찬성
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={() => castVote(id, 0)}
                disabled={votePending || voteConfirming}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                반대
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => castVote(id, 2)}
                disabled={votePending || voteConfirming}
              >
                <Minus className="h-4 w-4 mr-1" />
                기권
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {canFinalize && (
        <Button
          className="w-full"
          onClick={() => finalizeProposal(id)}
          disabled={finPending}
        >
          투표 종료 및 결과 확정
        </Button>
      )}
    </div>
  );
}
