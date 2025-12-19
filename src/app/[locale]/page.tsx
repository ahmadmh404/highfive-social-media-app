import { currentUser } from "@/lib/current-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

function HomagPage() {
  return (
    <Suspense>
      <SuspensedHomePage />
    </Suspense>
  );
}

async function SuspensedHomePage() {
  const user = await currentUser();
  if (user == null) redirect("/sign-in");

  return null;
}

export default HomagPage;
