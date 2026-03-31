"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateMarket } from "@/hooks/usePrediction";
import { Plus, X } from "lucide-react";

export default function CreateMarketPage() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [deadlineHours, setDeadlineHours] = useState("48");
  const { createMarket, isPending, isConfirming, isSuccess } = useCreateMarket();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) router.push("/predict");
  }, [isSuccess, router]);

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (i: number) => setOptions(options.filter((_, idx) => idx !== i));
  const updateOption = (i: number, v: string) => {
    const newOpts = [...options];
    newOpts[i] = v;
    setOptions(newOpts);
  };

  const handleSubmit = () => {
    const deadline = Math.floor(Date.now() / 1000) + parseInt(deadlineHours) * 3600;
    createMarket(question, options.filter(Boolean), deadline);
  };

  const isValid = question.trim() && options.filter(Boolean).length >= 2;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">승부 예측 마켓 생성</h1>
      <Card>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">질문</label>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="예: 이번 경기 승리팀은?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">선택지</label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    placeholder={`선택지 ${i + 1}`}
                  />
                  {options.length > 2 && (
                    <Button variant="ghost" size="sm" onClick={() => removeOption(i)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 10 && (
              <Button variant="outline" size="sm" className="mt-2" onClick={addOption}>
                <Plus className="h-4 w-4 mr-1" />
                선택지 추가
              </Button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">마감 시간 (시간 후)</label>
            <Input
              type="number"
              value={deadlineHours}
              onChange={(e) => setDeadlineHours(e.target.value)}
              min="2"
              max="720"
            />
          </div>

          <div className="rounded-lg bg-gray-800 p-3 text-sm text-gray-400">
            <p>보상 분배 방식:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>총 베팅 풀에서 2% 플랫폼 수수료 차감</li>
              <li>승리 선택지에 베팅한 사용자가 비례 배분으로 보상 수령</li>
              <li>보상 = (내 베팅 / 승리 풀) x 보상 풀</li>
            </ul>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!isValid || isPending || isConfirming}
          >
            {isPending ? "승인 대기중..." : isConfirming ? "확인중..." : "마켓 생성"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
