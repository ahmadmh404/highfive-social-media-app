"use server";

import {
  getUsersIdTag,
  getUsersUsernameTag,
} from "@/features/users/db/cache/users";
import { db } from "@/lib/db";
import { IUser } from "@/types";

export async function getUserById(userId: string) {
  "use cache";
  getUsersIdTag(userId);

  const response = await db.get<{ user: IUser | null }>(`/users/${userId}`);
  return response.data;
}

export async function getUserByEmail(email: string) {
  const response = await db.get<{ user: IUser | null }>(
    `/users/getUserByEmail/${email}`
  );
  return response.data;
}

export async function getUserAvatarKey(userId: string) {
  const response = await db.get<{ key: string | null }>(
    `/users/getUserAvatarKey/${userId}`
  );
  return response.data;
}

export async function getUserByUsername(username: string) {
  "use cache";
  getUsersUsernameTag(username);

  const response = await db.get<{ user: IUser | null }>(
    `/users/getUserByUsername/${username}`
  );

  return response.data;
}

export async function checkUsernameExists(username: string) {
  const response = await db.get<{ exists: boolean }>(
    `/users/checkUsernameExists/${username}`
  );

  return response.data;
}
