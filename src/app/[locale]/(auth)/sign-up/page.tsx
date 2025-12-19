import { SignInForm } from "@/features/auth/components/sign-up-form";
import { db } from "@/lib/db";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <Suspense
      fallback={<Loader2 className="size-5 mx-auto my-5 animate-spin" />}
    >
      <SuspensedPage />
    </Suspense>
  );
}

async function SuspensedPage() {
  const { categories } = await getContentCategories();

  return <SignInForm categories={categories} />;
}

async function getContentCategories() {
  const response = await db.get<{ categories: string[] }>("/categories");
  return response.data ?? [];
}
