export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="text-6xl mb-6">📡</div>
      <h1 className="text-2xl font-bold mb-3">오프라인 상태입니다</h1>
      <p className="text-muted-foreground max-w-md">
        인터넷 연결을 확인한 후 다시 시도해주세요.
        KAIA DAO는 온라인 상태에서 사용할 수 있습니다.
      </p>
    </div>
  );
}
