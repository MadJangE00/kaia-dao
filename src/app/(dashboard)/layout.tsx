import AuthGuard from "@/components/auth/AuthGuard";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="ml-64 flex-1 p-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
