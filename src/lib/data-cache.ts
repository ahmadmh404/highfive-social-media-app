export type CacheTag = "users" | "posts" | "stories";

export function getGlobalTag(tag: CacheTag) {
  return `global${tag}`;
}

export function getIdTag(id: string, tag: CacheTag) {
  return `id:${id}-${tag}`;
}
