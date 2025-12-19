import { ACTIVE, FeedPrivacy, IMedia, IUser } from "@/types";
import { enums } from "../../data/enums";

export interface ITag {
  id: number;
  tagged_id: number;
  tagger_id: number;
  user: IUser;
}

export type PollType = (typeof enums.POLL_TYPE)[number];
export type PostInteraction = (typeof enums.INTERACTIONS)[number];
export type PostType = (typeof enums.POST_TYPE)[number];
export type PostFeelingType = (typeof enums.FEELING_TYPE)[number];

export type PostReact = {
  likable_id: number;
  type: PostInteraction;
  user_id: number;
};

export interface IBookmark {
  id: number;
  bookmarks_count: number;
  created_at: string;
  name: string;
  user_id: number;
}

export interface IPost {
  id: number;
  user_id: number;

  // normal type
  postable: IUser & { shared_friends_id?: number };
  content: string;
  tags: ITag[];
  images: IMedia[];

  // poll type
  poll_for: PollType | null;
  poll_choices?: string[];
  final_poll_results: { [key: string]: number } | null;
  my_choice: string | null;

  privacy: FeedPrivacy;
  liked_by_users: PostReact[];
  shares: number[];
  watched: number;
  comments_count: number;
  from_member: IUser | null;
  post_likers: number[];
  shared_post_id: number | null;
  collection_info: IBookmark;
  posts_shared_this: number[];
  bookmarked_users: number[];
  created_at: string;
  post_type: PostType;
  classified_as: PostFeelingType;

  // for recommended posts
  recommended_from: ACTIVE;
}
