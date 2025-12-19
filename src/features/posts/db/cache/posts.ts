import { getGlobalTag, getIdTag } from "@/lib/data-cache";

export function getPostsGlobalTag() {
  return getGlobalTag("posts");
}

export function getPostsIdTag(postId: string) {
  return getIdTag(postId, "posts");
}
