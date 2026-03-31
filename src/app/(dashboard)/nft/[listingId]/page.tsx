"use client";

import { use } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useListing, useBuyNFT, useCancelListing, useTokenURI } from "@/hooks/useNFT";
import { Badge } from "@/components/ui/badge";
import { shortenAddress, formatKaia } from "@/lib/utils";

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = use(params);
  const id = parseInt(listingId);
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address?.toLowerCase();

  const { data } = useListing(id);
  const listing = data as [string, string, bigint, bigint, boolean] | undefined;
  const { buyNFT, isPending: buyPending, isConfirming: buyConfirming, isSuccess: buySuccess } = useBuyNFT();
  const { cancelListing, isPending: cancelPending, isConfirming: cancelConfirming, isSuccess: cancelSuccess } = useCancelListing();

  if (!listing) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        로딩중...
      </div>
    );
  }

  const [seller, nftContract, tokenId, price, active] = listing;
  const isSeller = walletAddress === seller?.toLowerCase();
  const isBuyLoading = buyPending || buyConfirming;
  const isCancelLoading = cancelPending || cancelConfirming;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-6 rounded-xl border border-gray-800 bg-gray-900">
        <div className="aspect-square rounded-lg bg-gray-800 flex items-center justify-center mb-6">
          <span className="text-6xl">🖼️</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Token #{tokenId?.toString()}</h1>
          <Badge variant={active ? "success" : "danger"}>
            {active ? "판매중" : buySuccess ? "구매완료" : cancelSuccess ? "취소됨" : "종료"}
          </Badge>
        </div>

        <div className="space-y-3 text-sm mb-6">
          <div className="flex justify-between p-3 rounded-lg bg-gray-800">
            <span className="text-gray-400">판매자</span>
            <span>{shortenAddress(seller)}</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-gray-800">
            <span className="text-gray-400">NFT 컨트랙트</span>
            <span>{shortenAddress(nftContract)}</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-gray-800">
            <span className="text-gray-400">가격</span>
            <span className="text-purple-400 font-semibold text-lg">
              {formatKaia(price as bigint)} KAIA
            </span>
          </div>
        </div>

        {active && !isSeller && (
          <button
            onClick={() => buyNFT(id, price as bigint)}
            disabled={isBuyLoading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {buyPending ? "승인 대기중..." : buyConfirming ? "구매 처리중..." : "구매하기"}
          </button>
        )}

        {active && isSeller && (
          <button
            onClick={() => cancelListing(id)}
            disabled={isCancelLoading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {cancelPending ? "승인 대기중..." : cancelConfirming ? "취소 처리중..." : "판매 취소"}
          </button>
        )}
      </div>
    </div>
  );
}
