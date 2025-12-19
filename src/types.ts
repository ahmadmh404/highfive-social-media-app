import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { enums } from "./data/enums";

export type ACTIVE = (typeof enums.ACTIVE)[number];

export type IconType = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

export interface IMedia {
  type: string;
  files: FileList;
}

export interface BackendPagination<T> {
  data: T;
  next_cursor: string | null;
}

export type FeedPrivacy = (typeof enums.POST_PRIVACY)[number];

// users
export type AccountType = (typeof enums.ACCOUNT_TYPE)[number];
export type AccountVisibility = (typeof enums.ACCOUNT_VISIBILITY)[number];
export type PublishPrivacy = Omit<AccountVisibility, "friends">;

export type AccountStats = {
  posts: number;
  stories: number;
  members: number;
  followers: number;
  likes: number;
};

export type UserSettings = {
  profile_visibility: AccountVisibility;
  show_email: ACTIVE;
  show_phone: ACTIVE;
  show_friends: ACTIVE;
  allow_messages: ACTIVE;
};

export type PublishSettings = {
  member_approval: ACTIVE;
  allow_member_invites: ACTIVE;
  show_member_list: ACTIVE;
  allow_posts: ACTIVE;
  post_approval: ACTIVE;
};

type AccountSettings = UserSettings & PublishSettings;

export interface IUser {
  // basic
  id: string;
  name: string;
  email: string;

  // TODO: For Special Cases
  password: string;

  type: AccountType;
  bg: string;
  avatar: string;
  created_at: Date;

  // optional
  bio?: string;
  website?: string;
  phone?: string;
  location?: string;
  isVerified: Date | null;

  // relations
  stats: AccountStats;
  settings: AccountSettings;

  // authentication
  token: string;
  active: ACTIVE;
}
