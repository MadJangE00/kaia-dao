"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGroupCount, useGroup } from "@/hooks/useGroups";
import { Plus, Users } from "lucide-react";

function GroupCard({ groupId }: { groupId: number }) {
  const { data } = useGroup(groupId);

  if (!data) return null;
  const [owner, name, memberCount] = data as [string, string, bigint];

  return (
    <Link href={`/groups/${groupId}`}>
      <Card className="hover:border-purple-600/50 transition-colors cursor-pointer">
        <CardContent>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className="text-sm text-gray-400 mt-1">
                생성자: {owner.slice(0, 6)}...{owner.slice(-4)}
              </p>
            </div>
            <Badge>
              <Users className="h-3 w-3 mr-1" />
              {memberCount.toString()}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function GroupsPage() {
  const { data: count } = useGroupCount();
  const groupCount = count ? Number(count) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">그룹</h1>
        <Link href="/groups/create">
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            그룹 만들기
          </Button>
        </Link>
      </div>

      {groupCount === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400">아직 그룹이 없습니다</p>
            <p className="text-sm text-gray-500 mt-1">첫 번째 그룹을 만들어보세요!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: groupCount }, (_, i) => (
            <GroupCard key={i} groupId={i} />
          ))}
        </div>
      )}
    </div>
  );
}
