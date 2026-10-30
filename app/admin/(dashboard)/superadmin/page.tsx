import { redirect } from "next/navigation";

async function getUserRole() {
  return "manager"; // Mocked active user role
}

export default async function SuperAdminPage() {
  const role = await getUserRole();

  // Route-Level Authorization Guard
  if (role !== "superadmin") {
    redirect("/dashboard?error=unauthorized"); // Safe bounce
  }

  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <h1 className="text-2xl font-bold text-red-800">
        Superadmin Control Panel
      </h1>
      <p className="mt-2 text-red-600">
        This content is exclusively visible to system administrators.
      </p>
    </div>
  );
}
