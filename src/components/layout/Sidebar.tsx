"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Vote,
  TrendingUp,
  Coins,
  Image,
  LayoutGrid,
  User,
} from "lucide-react";

const navItems = [
  { href: "/feed", label: "피드", icon: Home },
  { href: "/groups", label: "그룹", icon: Users },
  { href: "/vote", label: "투표", icon: Vote },
  { href: "/predict", label: "승부예측", icon: TrendingUp },
  { href: "/token", label: "토큰", icon: Coins },
  { href: "/nft", label: "NFT 마켓", icon: Image },
  { href: "/gallery", label: "갤러리", icon: LayoutGrid },
  { href: "/profile", label: "프로필", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-gray-800 bg-gray-950 p-4 overflow-y-auto">
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-purple-600/20 text-purple-300"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
