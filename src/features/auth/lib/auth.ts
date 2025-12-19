import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { getUserById } from "@/features/users/db/queries";
import { env } from "@/data/env/client";
import { ExtendedUser } from "../../../../next-auth";

export const { auth, signIn, signOut, handlers } = NextAuth({
  pages: {
    error: "/error",
    signIn: "/sign-in",
    signOut: "/sign-up",
  },
  callbacks: {
    signIn: ({ user, account }) => {
      if (user.id == null) return false;
      if (account?.provider === "credentials") return true;
      return true;
    },

    session: async ({ session, token }) => {
      if (session.user == null) {
        return session;
      }

      if (token.sub) {
        const user = token.user as ExtendedUser;
        session.user.id = user.id;
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.password = user.password;
        session.user.avatar = user.avatar;
        session.user.bg = user.bg;
        session.user.isVerified = user.isVerified;
        session.user.active = user.active;
        session.user.created_at = user.created_at;

        // TODO: Ask ali about the relations and other requests need more or less data
      }

      return session;
    },

    jwt: async ({ token }) => {
      if (token.sub == null) return token;

      const { user } = await getUserById(token.sub);
      if (user == null) return token;

      token.user = { ...user };

      return token;
    },
  },
  secret: env.NEXT_PUBLIC_AUTH_SECRET!,
  session: { strategy: "jwt" },
  ...authConfig,
});
