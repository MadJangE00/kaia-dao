"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProposalCount, useProposal } from "@/hooks/useVoting";
import { Plus, Vote } from "lucide-react";

function ProposalCard({ proposalId }: { proposalId: number }) {
  const { data } = useProposal(proposalId);
  if (!data) return null;

  const [groupId, creator, title, description, forVotes, againstVotes, abstainVotes, deadline, status, finalized] =
    data as [bigint, string, string, string, bigint, bigint, bigint, bigint, number, boolean];

  const deadlineDate = new Date(Number(deadline) * 1000);
  const isActive = Date.now() < deadlineDate.getTime() && !finalized;
  const total = Number(forVotes) + Number(againstVotes) + Number(abstainVotes);
  const forPercent = total > 0 ? (Number(forVotes) / total) * 100 : 0;

  return (
    <Link href={`/vote/${proposalId}`}>
      <Card className="hover:border-purple-600/50 transition-colors cursor-pointer">
        <CardContent>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold">{title}</h3>
            <Badge variant={isActive ? "success" : status === 1 ? "success" : "danger"}>
              {isActive ? "진행중" : status === 1 ? "통과" : "부결"}
            </Badge>
          </div>
          <p className="text-sm text-gray-400 line-clamp-2">{description}</p>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>찬성 {forPercent.toFixed(0)}%</span>
              <span>총 {total}표</span>
            </div>
            <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${forPercent}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            마감: {deadlineDate.toLocaleDateString("ko-KR")}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function VotePage() {
  const { data: count } = useProposalCount();
  const proposalCount = count ? Number(count) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">투표</h1>
        <Link href="/vote/create">
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            안건 제출
          </Button>
        </Link>
      </div>

      {proposalCount === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Vote className="h-12 w-12 mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400">아직 투표가 없습니다</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {Array.from({ length: proposalCount }, (_, i) => (
            <ProposalCard key={i} proposalId={i} />
          ))}
        </div>
      )}
    </div>
  );
}
