import type { PrivyClientConfig } from "@privy-io/react-auth";
import { kairos, kaia } from "./chains";

export const privyConfig: PrivyClientConfig = {
  loginMethods: ["google", "wallet"],
  appearance: {
    theme: "dark",
    accentColor: "#7C3AED",
    logo: "/logo.svg",
  },
  embeddedWallets: {
    ethereum: {
      createOnLogin: "users-without-wallets",
    },
  },
  defaultChain: kairos,
  supportedChains: [kaia, kairos],
};
