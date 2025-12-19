import { auth } from "@/features/auth/lib/auth";

export async function currentUser() {
  const session = await auth();

  return session?.user ?? null;
}

export async function currentToken() {
  const user = await currentUser();
  return user?.token || null;
}
