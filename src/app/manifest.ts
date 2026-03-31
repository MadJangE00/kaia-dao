import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KAIA DAO - Web3 Community Platform",
    short_name: "KAIA DAO",
    description:
      "A blockchain-based DAO community platform on Kaia Network. Vote, mint tokens, trade NFTs, and predict outcomes.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#7c3aed",
    orientation: "portrait-primary",
    categories: ["finance", "social"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
