import z from "zod";
import { LoginSchema, SignupSchema } from "./schemas";
import { getUserByEmail } from "@/features/users/db/queries";

import bcrypt from "bcryptjs";
import { signIn } from "../lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function login(
  unsafeData: z.infer<typeof LoginSchema>,
  callbackUrl: string | null
) {
  const { data, success } = LoginSchema.safeParse(unsafeData);
  if (!success) {
    return { error: true, message: "Invalid Fields" };
  }

  const { user } = await getUserByEmail(data.email);
  if (user == null) {
    return { error: true, message: "Invalid Credentials" };
  }

  const match = await bcrypt.compare(data.password, user.password);
  if (!match) {
    return { error: true, message: "Invalid Credentials" };
  }

  try {
    await signIn("credentials", {
      ...data,
      redirect: true,
      redirectTo: `/${callbackUrl ?? ""}`,
    });

    return { error: false, message: "Logging in..." };
  } catch {
    return {
      error: true,
      message: "Something went wrong",
    };
  }
}

export async function register(unsafeData: z.infer<typeof SignupSchema>) {
  const { data, success } = SignupSchema.safeParse(unsafeData);
  if (!success) {
    return { error: true, message: "Invalid Fields" };
  }

  const { user } = await getUserByEmail(data.email);
  if (user != null) {
    return { error: true, message: "Email Already Exist" };
  }

  try {
    await db.post("/register", data);
    redirect("/sign-in");
  } catch {
    return {
      error: true,
      message: "Something went wrong",
    };
  }
}
