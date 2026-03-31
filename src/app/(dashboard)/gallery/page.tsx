"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import {
  useNFTBalance,
  useTokenOfOwnerByIndex,
  useTokenURI,
  useTokenCreator,
  useMintNFT,
  useListNFT,
  useApproveNFT,
} from "@/hooks/useNFT";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { shortenAddress } from "@/lib/utils";

function NFTCard({ owner, index }: { owner: string; index: number }) {
  const { data: tokenId } = useTokenOfOwnerByIndex(owner as `0x${string}`, index);
  const { data: tokenURI } = useTokenURI(Number(tokenId));
  const { data: creator } = useTokenCreator(Number(tokenId));

  const [showSell, setShowSell] = useState(false);
  const [price, setPrice] = useState("");
  const { listNFT, isPending: listPending, isConfirming: listConfirming, isSuccess: listSuccess } = useListNFT();
  const { approve: approveNFT, isPending: approvePending } = useApproveNFT();

  const handleList = () => {
    if (!price || tokenId === undefined) return;
    listNFT(Number(tokenId), price);
  };

  return (
    <div className="p-4 rounded-xl border border-gray-800 bg-gray-900">
      <div className="aspect-square rounded-lg bg-gray-800 flex items-center justify-center mb-3 overflow-hidden">
        {tokenURI ? (
          <span className="text-4xl">🎨</span>
        ) : (
          <span className="text-4xl">🖼️</span>
        )}
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">#{tokenId?.toString()}</span>
        <Badge>NFT</Badge>
      </div>
      {creator ? (
        <p className="text-xs text-gray-400 mb-3">
          발행자: {shortenAddress(creator as string)}
        </p>
      ) : null}

      {listSuccess ? (
        <p className="text-sm text-green-400 text-center py-2">마켓에 등록되었습니다!</p>
      ) : showSell ? (
        <div className="space-y-2">
          <Input
            type="number"
            placeholder="가격 (KAIA)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0.01"
            step="0.01"
          />
          <div className="flex gap-2">
            <button
              onClick={() => approveNFT()}
              disabled={approvePending}
              className="flex-1 py-2 text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {approvePending ? "승인중..." : "승인"}
            </button>
            <button
              onClick={handleList}
              disabled={!price || listPending || listConfirming}
              className="flex-1 py-2 text-xs bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {listPending ? "대기중..." : listConfirming ? "처리중..." : "등록"}
            </button>
          </div>
          <button
            onClick={() => setShowSell(false)}
            className="w-full py-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            취소
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowSell(true)}
          className="w-full py-2 text-sm border border-gray-700 hover:bg-gray-800 rounded-lg transition-colors"
        >
          판매 등록
        </button>
      )}
    </div>
  );
}

export default function GalleryPage() {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const { data: balance } = useNFTBalance(walletAddress as `0x${string}`);
  const nftCount = Number(balance || 0);

  const [showMint, setShowMint] = useState(false);
  const [mintName, setMintName] = useState("");
  const [mintDesc, setMintDesc] = useState("");
  const { mint, isPending: mintPending, isConfirming: mintConfirming, isSuccess: mintSuccess } = useMintNFT();

  const handleMint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintName || !walletAddress) return;
    // 간단한 JSON metadata URI (추후 Pinata IPFS 업로드로 교체)
    const metadata = JSON.stringify({ name: mintName, description: mintDesc, image: "" });
    const dataUri = `data:application/json;base64,${btoa(metadata)}`;
    mint(walletAddress as `0x${string}`, dataUri);
  };

  const isMintLoading = mintPending || mintConfirming;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">NFT 갤러리</h1>
          <p className="text-gray-400 text-sm mt-1">
            보유한 NFT {nftCount}개
          </p>
        </div>
        <button
          onClick={() => setShowMint(!showMint)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          NFT 발행
        </button>
      </div>

      {showMint && (
        <div className="p-6 rounded-xl border border-gray-800 bg-gray-900 mb-8">
          <h2 className="text-lg font-semibold mb-4">새 NFT 발행</h2>
          <form onSubmit={handleMint} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">이름</label>
              <Input
                placeholder="NFT 이름"
                value={mintName}
                onChange={(e) => setMintName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">설명</label>
              <Input
                placeholder="NFT 설명 (선택)"
                value={mintDesc}
                onChange={(e) => setMintDesc(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500">
              * 이미지 업로드는 추후 Pinata IPFS 연동 시 지원됩니다
            </p>
            {mintSuccess && (
              <p className="text-sm text-green-400">NFT가 발행되었습니다!</p>
            )}
            <button
              type="submit"
              disabled={!mintName || isMintLoading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {mintPending ? "승인 대기중..." : mintConfirming ? "발행 처리중..." : "발행하기"}
            </button>
          </form>
        </div>
      )}

      {nftCount === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">🖼️</div>
          <p className="text-lg font-medium mb-1">보유한 NFT가 없습니다</p>
          <p className="text-sm">NFT를 발행하거나 마켓에서 구매해보세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: nftCount }, (_, i) => (
            <NFTCard key={i} owner={walletAddress!} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
