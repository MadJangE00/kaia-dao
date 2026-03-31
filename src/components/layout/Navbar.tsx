"use client";

import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";

export default function Navbar() {
  const { login, logout, authenticated, user } = usePrivy();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
                D
              </div>
              <span className="text-xl font-bold tracking-tight">KAIA DAO</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 text-sm font-medium">
              <Link href="/dashboard" className="px-3 py-2 hover:text-accent transition-colors">Dashboard</Link>
              <Link href="/proposals" className="px-3 py-2 hover:text-accent transition-colors">Proposals</Link>
              <Link href="/gallery" className="px-3 py-2 hover:text-accent transition-colors">Gallery</Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {authenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs text-muted-foreground font-mono">
                  {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-full text-xs font-semibold transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="px-6 py-2 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs font-semibold transition-all shadow-lg shadow-purple-500/20"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
