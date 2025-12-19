import { enums } from "@/data/enums";
import {
  checkUsernameExists,
  getUserByEmail,
} from "@/features/users/db/queries";
import z from "zod";

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(15),
});

export const SignupSchema = z
  .object({
    user_type: z.enum(enums.USER_TYPES),

    name: z
      .string()
      .min(2, "Name is required")
      .max(50, "Name must be less than 100 characters"),

    username: z
      .string()
      .min(4, {
        message: "username too short",
      })
      .max(30, {
        message: "username too long",
      })
      .refine(async (username) => {
        if (username.trim().length == 0) return true;
        const { exists } = await checkUsernameExists(username);
        return exists === false;
      }, "Username Taken"),

    password: z
      .string()
      .min(8, "Password too short")
      .max(20, "Password too long"),
    password_confirmation: z.string(),

    // Shared
    email: z.email().refine(async (email) => {
      if (email.trim().length == 0) return true;
      const { user } = await getUserByEmail(email);
      return user != null;
    }, "Email already taken"),

    phone: z
      .string()
      .nullable()
      .transform((val) => (val?.trim() === "" ? null : val)),

    location: z
      .string()
      .nullable()
      .transform((val) => (val?.trim() === "" ? null : val)),

    website: z
      .string()
      .url()
      .nullable()
      .transform((val) => (val?.trim() === "" ? null : val)),

    bio: z
      .string()
      .nullable()
      .transform((val) => (val?.trim() === "" ? null : val)),

    // Avatar
    avatar: z.url(),
    sharable: z.enum(enums.ACTIVE),

    // only users fields
    dob: z.string({
      message: "Please enter a valid birth date!",
    }),

    security: z.enum(enums.ACCOUNT_PRIVACY).nullable(),
    categories: z
      .array(z.string())
      .nullable()
      .transform((val) => (val?.length === 0 ? null : val)),

    // in case creation inside the app
    from_user_id: z.string().nullable(),
  })

  // password refine
  .refine(
    (data) => {
      return data.password === data.password_confirmation;
    },
    { path: ["password"], error: "Password must be identical" }
  );
