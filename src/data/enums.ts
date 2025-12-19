export const enums = {
  ACTIVE: ["0", "1"],

  // users
  USER_TYPES: ["user", "page", "group"],
  ACCOUNT_TYPE: ["page", "group", "user", "admin"],
  ACCOUNT_VISIBILITY: ["public", "private", "friends"],
  ACCOUNT_PRIVACY: ["public", "private"],

  // posts
  POST_TYPE: ["normal", "poll"],
  POLL_TYPE: ["nature", "politics", "olympics", "wars"],
  POST_PRIVACY: ["public", "friends", "me", "off"],
  INTERACTIONS: ["like", "love", "haha", "sad", "angry"],
  FEELING_TYPE: ["haha", "sad", "love", "angry", "useful", "none"],

  // stories
  STORY_TYPE: ["TEXT", "IMAGE", "IMG-Text"],
} as const;
