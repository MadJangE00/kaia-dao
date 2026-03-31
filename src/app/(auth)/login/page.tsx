"use client";

import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin({
    onComplete: () => router.push("/feed"),
  });
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/feed");
    }
  }, [ready, authenticated, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <div className="text-center">
        <div className="mb-4 mx-auto h-16 w-16 rounded-2xl bg-purple-600 flex items-center justify-center text-2xl font-bold">
          D
        </div>
        <h1 className="text-3xl font-bold">DAO Community</h1>
        <p className="mt-2 text-gray-400">
          블록체인 기반 커뮤니티에 참여하세요
        </p>
      </div>

      <div className="flex flex-col gap-3 w-72">
        <Button onClick={() => login()} size="lg" className="w-full">
          Google로 시작하기
        </Button>
        <Button onClick={() => login()} variant="outline" size="lg" className="w-full">
          MetaMask 연결
        </Button>
      </div>

      <p className="text-xs text-gray-500">
        Kaia Network 기반 | Powered by Privy
      </p>
    </div>
  );
}
