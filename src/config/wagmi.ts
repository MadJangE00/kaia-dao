import { createConfig } from "@privy-io/wagmi";
import { http } from "wagmi";
import { kaia, kairos } from "./chains";

export const wagmiConfig = createConfig({
  chains: [kairos, kaia],
  transports: {
    [kairos.id]: http(),
    [kaia.id]: http(),
  },
});
