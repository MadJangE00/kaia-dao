"use client";

import { use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGroup, useIsMember, useJoinGroup, useLeaveGroup } from "@/hooks/useGroups";
import { usePrivy } from "@privy-io/react-auth";
import { Users, LogIn, LogOut } from "lucide-react";

export default function GroupDetailPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = use(params);
  const id = parseInt(groupId);
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address as `0x${string}` | undefined;

  const { data: groupData } = useGroup(id);
  const { data: isMember } = useIsMember(id, walletAddress);
  const { joinGroup, isPending: joinPending, isConfirming: joinConfirming } = useJoinGroup();
  const { leaveGroup, isPending: leavePending, isConfirming: leaveConfirming } = useLeaveGroup();

  if (!groupData) {
    return <div className="text-center text-gray-400 py-12">로딩중...</div>;
  }

  const [owner, name, memberCount] = groupData as [string, string, bigint];
  const isOwner = walletAddress?.toLowerCase() === owner.toLowerCase();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{name}</h1>
              <p className="text-sm text-gray-400 mt-1">
                생성자: {owner.slice(0, 6)}...{owner.slice(-4)}
              </p>
            </div>
            <Badge>
              <Users className="h-3 w-3 mr-1" />
              {memberCount.toString()} 멤버
            </Badge>
          </div>

          <div className="mt-6">
            {isMember ? (
              <div className="flex items-center gap-3">
                <Badge variant="success">멤버</Badge>
                {!isOwner && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => leaveGroup(id)}
                    disabled={leavePending || leaveConfirming}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    {leavePending ? "승인 대기중..." : leaveConfirming ? "확인중..." : "탈퇴"}
                  </Button>
                )}
                {isOwner && <Badge variant="warning">관리자</Badge>}
              </div>
            ) : (
              <Button
                onClick={() => joinGroup(id)}
                disabled={joinPending || joinConfirming}
              >
                <LogIn className="h-4 w-4 mr-1" />
                {joinPending ? "승인 대기중..." : joinConfirming ? "확인중..." : "그룹 참여"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
