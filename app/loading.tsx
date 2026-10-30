import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <main className="flex items-center justify-center w-full min-h-screen text-primary">
      <Spinner className="size-8" />
    </main>
  );
}
