import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function DashboardLayout({ children, params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect(`/${params.locale}/login`);
  }

  return <DashboardShell>{children}</DashboardShell>;
}
