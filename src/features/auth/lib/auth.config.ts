import Credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "@/features/users/db/queries";
import { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import { LoginSchema } from "../actions/schemas";

export default {
  providers: [
    Credentials({
      authorize: async (unsafeData) => {
        const { data, success } = LoginSchema.safeParse(unsafeData);
        if (!success) return null;

        const { user } = await getUserByEmail(data.email);
        if (user == null || user.password == null) return null;

        const match = await bcrypt.compare(data.password, user.password);
        if (!match) return null;

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
