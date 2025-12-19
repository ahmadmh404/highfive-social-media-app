import { IUser } from "@/types";
import { User } from "next-auth";

export type ExtendedUser = IUser & User;

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
