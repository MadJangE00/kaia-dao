"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useBalance } from "wagmi";
import { useNFTBalance } from "@/hooks/useNFT";
import { useUserTokens } from "@/hooks/useTokenFactory";
import { useGroupCount } from "@/hooks/useGroups";
import { formatKaia } from "@/lib/utils";
import { kairos } from "@/config/chains";
import Link from "next/link";

function StatCard({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value: string | number;
  icon: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="p-5 rounded-xl border border-gray-800 bg-gray-900 hover:border-purple-500/40 transition-colors"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </Link>
  );
}

export default function ProfilePage() {
  const { user, logout } = usePrivy();
  const walletAddress = user?.wallet?.address;

  const { data: balanceData } = useBalance({
    address: walletAddress as `0x${string}`,
    chainId: kairos.id,
  });
  const { data: nftBalance } = useNFTBalance(walletAddress as `0x${string}`);
  const { data: tokens } = useUserTokens(walletAddress as `0x${string}`);
  const { data: groupCount } = useGroupCount();

  const kaiaBalance = balanceData?.value ? formatKaia(balanceData.value) : "0";
  const nftCount = Number(nftBalance || 0);
  const tokenCount = (tokens as string[])?.length || 0;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">프로필</h1>

      {/* Wallet Info */}
      <div className="p-6 rounded-xl border border-gray-800 bg-gray-900 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-purple-600/20 flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <p className="text-sm text-gray-400">지갑 주소</p>
            <p className="font-mono text-sm break-all">{walletAddress}</p>
          </div>
        </div>

        {user?.google?.email && (
          <div className="p-3 rounded-lg bg-gray-800 mb-4">
            <p className="text-sm text-gray-400">Google 계정</p>
            <p className="text-sm">{user.google.email}</p>
          </div>
        )}

        <div className="p-4 rounded-lg bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20">
          <p className="text-sm text-gray-400 mb-1">KAIA 잔액</p>
          <p className="text-3xl font-bold text-purple-300">{kaiaBalance} KAIA</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="보유 NFT" value={nftCount} icon="🖼️" href="/gallery" />
        <StatCard label="발행 토큰" value={tokenCount} icon="🪙" href="/token" />
        <StatCard label="전체 그룹" value={Number(groupCount || 0)} icon="👥" href="/groups" />
      </div>

      {/* Quick Links */}
      <div className="p-6 rounded-xl border border-gray-800 bg-gray-900 mb-6">
        <h2 className="text-lg font-semibold mb-4">바로가기</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: "/gallery", label: "NFT 갤러리", icon: "🖼️" },
            { href: "/token/create", label: "토큰 발행", icon: "🪙" },
            { href: "/nft", label: "NFT 마켓", icon: "🏪" },
            { href: "/vote", label: "투표 참여", icon: "🗳️" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <span className="text-xl">{link.icon}</span>
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full py-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg font-medium transition-colors"
      >
        로그아웃
      </button>
    </div>
  );
}
