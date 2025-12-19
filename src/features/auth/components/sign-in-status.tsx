import { currentUser } from "@/lib/current-auth";
import { ReactNode, Suspense } from "react";

export function AuthStatus({
  children,
  status,
}: {
  children: ReactNode;
  status: "sign-in" | "sign-out";
}) {
  return (
    <Suspense>
      <AuthStatusContent status={status}>{children}</AuthStatusContent>
    </Suspense>
  );
}

async function AuthStatusContent({
  children,
  status,
}: {
  children: ReactNode;
  status: "sign-in" | "sign-out";
}) {
  const user = await currentUser();

  if (status === "sign-in") {
    return user != null ? children : null;
  }

  if (status === "sign-out") {
    return user == null ? children : null;
  }
}
