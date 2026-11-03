import { redirect } from "next/navigation";

// Profile now lives in the dashboard
export default function ProfilePage() {
  redirect("/admin/profile");
}
