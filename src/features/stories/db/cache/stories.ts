import { getGlobalTag, getIdTag } from "@/lib/data-cache";

export function getStoriesGlobalTag() {
  return getGlobalTag("stories");
}

export function getStoriesIdTAg(stroyId: string) {
  return getIdTag(stroyId, "stories");
}
