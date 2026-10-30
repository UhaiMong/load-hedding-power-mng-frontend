// app/(dashboard)/layout.tsx
import { redirect } from "next/navigation";
// import SidebarSelector from "@/components/SidebarSelector";

async function getUserSession() {
  return { id: "123", role: "manager" };
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserSession();

  // 1. Authentication Guard: Bounce anonymous users
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 2. Layout Mutation: Render a completely different sidebar based on user role */}
      <aside className="w-64 bg-white border-r border-gray-200">
        {/* <SidebarSelector role={session.role} /> */}
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <span className="font-semibold text-gray-700">App Dashboard</span>
        </header>
        <main className="p-6 grow">{children}</main>
      </div>
    </div>
  );
}
