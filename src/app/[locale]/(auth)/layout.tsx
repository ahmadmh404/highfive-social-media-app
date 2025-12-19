import { currentUser } from "@/lib/current-auth";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="md:max-w-4xl px-5 flex
          items-center justify-center
          h-screen mx-auto bg-background
        "
    >
      {/* Static / Left side */}
      <div className="hidden sm:block flex-1">
        <h1 className="text-primary text-5xl font-bold mb-3">HighFive</h1>

        {/* TODO: Typing Indicator */}
      </div>

      <Suspense>
        <SuspenseLayout>{children}</SuspenseLayout>
      </Suspense>
    </div>
  );
}

async function SuspenseLayout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  if (user != null) redirect("/");

  return <div className="flex-1">{children}</div>;
}
