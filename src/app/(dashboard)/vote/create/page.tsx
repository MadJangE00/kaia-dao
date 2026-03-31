"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateProposal } from "@/hooks/useVoting";

export default function CreateProposalPage() {
  const [groupId, setGroupId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("72"); // hours
  const { createProposal, isPending, isConfirming, isSuccess } = useCreateProposal();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) router.push("/vote");
  }, [isSuccess, router]);

  const handleSubmit = () => {
    const durationSecs = parseInt(duration) * 3600;
    createProposal(parseInt(groupId), title, description, durationSecs);
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">새 안건 제출</h1>
      <Card>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">그룹 ID</label>
            <Input
              type="number"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              placeholder="그룹 ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">제목</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="안건 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="안건에 대한 설명을 작성하세요"
              className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">투표 기간 (시간)</label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="72"
              min="1"
              max="720"
            />
          </div>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!title || !groupId || isPending || isConfirming}
          >
            {isPending ? "승인 대기중..." : isConfirming ? "확인중..." : "안건 제출"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
