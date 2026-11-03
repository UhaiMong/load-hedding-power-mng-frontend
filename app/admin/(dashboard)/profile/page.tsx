"use client";

import { useAuth } from "@/app/Providers/AuthProvider";
import { PageHeader } from "@/components/common/page-header";
import { ChangePassword } from "./_components/change-password";
import { DeleteAccount } from "./_components/delete-account";
import { ProfileCard } from "./_components/profile-card";
import { ProfileForm } from "./_components/profile-form";

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader title="My profile" description="Manage your account details and security." />
      <ProfileCard user={user} />
      <ProfileForm key={user.id} user={user} />
      <ChangePassword />
      {user.role !== "ADMIN" && <DeleteAccount />}
    </div>
  );
}
