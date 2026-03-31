"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePrivy } from "@privy-io/react-auth";
import { shortenAddress } from "@/lib/utils";
import { Image as ImageIcon, Send } from "lucide-react";

interface Post {
  id: string;
  author: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

export default function FeedPage() {
  const { user } = usePrivy();
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "0x1234...5678",
      content: "DAO 커뮤니티에 오신 것을 환영합니다! 함께 블록체인 생태계를 만들어갑시다.",
      createdAt: new Date().toISOString(),
    },
  ]);

  const handlePost = () => {
    if (!content.trim()) return;
    const newPost: Post = {
      id: Date.now().toString(),
      author: user?.wallet?.address || "unknown",
      content,
      createdAt: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
    setContent("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">피드</h1>

      <Card>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="무슨 생각을 하고 계신가요?"
                className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
              />
              <div className="mt-2 flex items-center justify-between">
                <button className="text-gray-400 hover:text-purple-400 transition-colors">
                  <ImageIcon className="h-5 w-5" />
                </button>
                <Button size="sm" onClick={handlePost} disabled={!content.trim()}>
                  <Send className="h-4 w-4 mr-1" />
                  게시
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-full bg-purple-600/30 flex items-center justify-center text-xs">
                  {post.author.slice(2, 4)}
                </div>
                <span className="text-sm font-medium">
                  {shortenAddress(post.author)}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
              <p className="text-sm text-gray-300">{post.content}</p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt=""
                  className="mt-3 rounded-lg max-h-64 object-cover"
                />
              )}
              <div className="mt-3 flex gap-2">
                <Button variant="ghost" size="sm">
                  NFT로 발행
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
