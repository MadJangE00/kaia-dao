"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateGroup } from "@/hooks/useGroups";
import { useEffect } from "react";

export default function CreateGroupPage() {
  const [name, setName] = useState("");
  const { createGroup, isPending, isConfirming, isSuccess } = useCreateGroup();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      router.push("/groups");
    }
  }, [isSuccess, router]);

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">새 그룹 만들기</h1>
      <Card>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">그룹 이름</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="그룹 이름을 입력하세요"
            />
          </div>
          <Button
            className="w-full"
            onClick={() => createGroup(name)}
            disabled={!name.trim() || isPending || isConfirming}
          >
            {isPending ? "승인 대기중..." : isConfirming ? "트랜잭션 확인중..." : "그룹 생성"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
