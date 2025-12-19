import { getGlobalTag, getIdTag } from "@/lib/data-cache";

export function getUsersGlobalTag() {
  return getGlobalTag("users");
}

export function getUsersIdTag(userId: string) {
  return getIdTag(userId, "users");
}

export function getUsersUsernameTag(username: string) {
  return getIdTag(username, "users");
}
