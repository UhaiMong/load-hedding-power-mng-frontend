import { Metadata } from "next";
import { redirect } from "next/navigation";
export const metaData: Metadata = {
  title: "Profile",
  description: "Control your profile",
  alternates: { canonical: "/profile" },
};
// Profile now lives in the dashboard
export default function ProfilePage() {
  redirect("/admin/profile");
}
