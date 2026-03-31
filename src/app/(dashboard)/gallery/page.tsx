"use client";

import { useRef, useState } from "react";
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

function NFTImage({ tokenURI }: { tokenURI: unknown }) {
  const [metadata, setMetadata] = useState<{
    name?: string;
    image?: string;
  } | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Parse metadata from tokenURI
  if (!loaded && tokenURI) {
    const uri = tokenURI as string;
    try {
      if (uri.startsWith("data:application/json")) {
        const json = JSON.parse(atob(uri.split(",")[1]));
        setMetadata(json);
      } else if (uri.startsWith("http") || uri.startsWith("ipfs")) {
        fetch(uri.replace("ipfs://", `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/`))
          .then((r) => r.json())
          .then(setMetadata)
          .catch(() => {});
      }
    } catch {}
    setLoaded(true);
  }

  if (metadata?.image) {
    return (
      <img
        src={metadata.image}
        alt={metadata.name || "NFT"}
        className="w-full h-full object-cover"
      />
    );
  }

  return <span className="text-4xl">{tokenURI ? "🎨" : "🖼️"}</span>;
}

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
        <NFTImage tokenURI={tokenURI} />
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mint, isPending: mintPending, isConfirming: mintConfirming, isSuccess: mintSuccess } = useMintNFT();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintName || !walletAddress) return;

    let tokenURI: string;

    if (imageFile) {
      // Upload to Pinata IPFS
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("name", mintName);
        formData.append("description", mintDesc);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        tokenURI = data.metadataUrl;
      } catch (err) {
        console.error("IPFS upload failed:", err);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    } else {
      // Fallback: data URI without image
      const metadata = JSON.stringify({ name: mintName, description: mintDesc, image: "" });
      tokenURI = `data:application/json;base64,${btoa(metadata)}`;
    }

    mint(walletAddress as `0x${string}`, tokenURI);
  };

  const isMintLoading = isUploading || mintPending || mintConfirming;

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

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">이미지</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-64 object-contain rounded-lg border border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 w-7 h-7 bg-gray-900/80 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    X
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-gray-700 rounded-lg text-gray-500 hover:border-purple-500/50 hover:text-gray-300 transition-colors"
                >
                  클릭하여 이미지 선택
                </button>
              )}
              <p className="text-xs text-gray-500 mt-1">
                이미지는 Pinata IPFS에 업로드됩니다 (선택사항)
              </p>
            </div>

            {mintSuccess && (
              <p className="text-sm text-green-400">NFT가 발행되었습니다!</p>
            )}
            <button
              type="submit"
              disabled={!mintName || isMintLoading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {isUploading
                ? "IPFS 업로드중..."
                : mintPending
                  ? "승인 대기중..."
                  : mintConfirming
                    ? "발행 처리중..."
                    : "발행하기"}
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
