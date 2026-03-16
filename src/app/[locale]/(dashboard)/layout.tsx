import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function DashboardLayout({ children, params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect(`/${params.locale}/login`);
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar />
      <main className="flex-1 ml-60 min-h-screen flex justify-center">
        <div className="w-full max-w-5xl px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
