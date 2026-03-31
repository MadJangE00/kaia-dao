"use client";

import { useListingCount, useListing, useBuyNFT, useTokenURI } from "@/hooks/useNFT";
import { Badge } from "@/components/ui/badge";
import { shortenAddress, formatKaia } from "@/lib/utils";
import Link from "next/link";

function ListingCard({ listingId }: { listingId: number }) {
  const { data } = useListing(listingId);
  const listing = data as [string, string, bigint, bigint, boolean] | undefined;

  if (!listing || !listing[4]) return null;

  const [seller, nftContract, tokenId, price, active] = listing;

  return (
    <Link
      href={`/nft/${listingId}`}
      className="block p-5 rounded-xl border border-gray-800 bg-gray-900 hover:border-purple-500/40 transition-colors"
    >
      <div className="aspect-square rounded-lg bg-gray-800 flex items-center justify-center mb-4">
        <span className="text-4xl">🖼️</span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Token #{tokenId?.toString()}</span>
        <Badge variant="success">판매중</Badge>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">판매자</span>
        <span>{shortenAddress(seller)}</span>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
        <span className="text-gray-400 text-sm">가격</span>
        <span className="text-purple-400 font-semibold">{formatKaia(price as bigint)} KAIA</span>
      </div>
    </Link>
  );
}

export default function NFTMarketPage() {
  const { data: count } = useListingCount();
  const listingCount = Number(count || 0);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">NFT 마켓플레이스</h1>
          <p className="text-gray-400 text-sm mt-1">커뮤니티 NFT를 사고 팔 수 있습니다</p>
        </div>
        <Link
          href="/gallery"
          className="px-4 py-2 border border-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors"
        >
          내 갤러리에서 판매
        </Link>
      </div>

      {listingCount === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">🏪</div>
          <p className="text-lg font-medium mb-1">등록된 NFT가 없습니다</p>
          <p className="text-sm">갤러리에서 NFT를 발행하고 마켓에 등록해보세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: listingCount }, (_, i) => (
            <ListingCard key={i} listingId={i} />
          ))}
        </div>
      )}
    </div>
  );
}
