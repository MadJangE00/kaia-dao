import { defineChain } from "viem";

export const kaia = defineChain({
  id: 8217,
  name: "Kaia",
  nativeCurrency: {
    name: "KAIA",
    symbol: "KAIA",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://public-en.node.kaia.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "KaiaScan",
      url: "https://kaiascan.io",
    },
  },
});

export const kairos = defineChain({
  id: 1001,
  name: "Kaia Kairos",
  nativeCurrency: {
    name: "KAIA",
    symbol: "KAIA",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://public-en-kairos.node.kaia.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "KaiaScan Kairos",
      url: "https://kairos.kaiascan.io",
    },
  },
  testnet: true,
});
