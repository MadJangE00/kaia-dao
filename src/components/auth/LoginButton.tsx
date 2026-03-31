"use client";

import { useLogin, usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { shortenAddress } from "@/lib/utils";

export default function LoginButton() {
  const { ready, authenticated, user } = usePrivy();
  const { login } = useLogin();

  if (!ready) return null;

  if (authenticated && user?.wallet?.address) {
    return (
      <div className="text-sm text-gray-400">
        {shortenAddress(user.wallet.address)}
      </div>
    );
  }

  return (
    <Button onClick={() => login()} size="lg">
      Connect Wallet
    </Button>
  );
}
