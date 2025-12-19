import { enums } from "@/data/enums";
import { FeedPrivacy, IMedia, IUser } from "@/types";

type StroyType = (typeof enums.STORY_TYPE)[number];

export interface IStory {
  id: number;
  storable_id: number;
  content_tags: string;
  images: IMedia[];
  thereel: string | null;
  privacy: FeedPrivacy;
  type: StroyType;
  updated_at: string;
  watches: number;
  your_story_watchers: IUser[];
  //   story_replies: IChatMessage[];
  created_at: string;
}
