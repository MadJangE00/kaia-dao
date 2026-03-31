"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useBalance } from "wagmi";
import { shortenAddress, formatKaia } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";

export default function Header() {
  const { user, logout, ready } = usePrivy();
  const walletAddress = user?.wallet?.address as `0x${string}` | undefined;

  const { data: balance } = useBalance({
    address: walletAddress,
  });

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-sm">
            D
          </div>
          <h1 className="text-lg font-bold">DAO Community</h1>
        </div>

        {ready && user && (
          <div className="flex items-center gap-4">
            {balance && (
              <span className="text-sm text-gray-400">
                {formatKaia(balance.value)} KAIA
              </span>
            )}
            {walletAddress && (
              <div className="flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-1.5 text-sm">
                <Wallet className="h-4 w-4 text-purple-400" />
                {shortenAddress(walletAddress)}
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
