"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/app/Providers/AuthProvider";
import { ConfirmButton } from "@/components/common/confirm-button";
import { api } from "@/lib/api";
import { Section } from "./section";

export function DeleteAccount() {
  const { logout } = useAuth();
  const router = useRouter();

  const remove = useMutation({
    mutationFn: () => api.delete("users/me"),
    onSuccess: async () => {
      await logout(); // backend already ended all sessions; this clears our cookies
      router.replace("/");
      router.refresh();
    },
    meta: { success: "Your account was deleted" },
  });

  return (
    <Section title="Delete account" description="This deactivates your account and signs you out everywhere.">
      <ConfirmButton
        variant="destructive"
        size="lg"
        title="Delete your account?"
        description="You will be logged out on all devices. This cannot be undone from here."
        confirmLabel="Delete account"
        pending={remove.isPending}
        onConfirm={() => remove.mutateAsync()}
      >
        Delete my account
      </ConfirmButton>
    </Section>
  );
}
