import { db } from "@/lib/db";

// user avatar
interface UserAvatarProps {
  userId: string;
  url: string;
  key: string;
}

export async function uploadUserAvatar({ userId, url, key }: UserAvatarProps) {
  await db.post(`/user-avatar/${userId}`, { url, key });
}

export async function updateUserAvatar({ userId, url, key }: UserAvatarProps) {
  await db.put(`/user-avatar/${userId}`, { url, key });
}
