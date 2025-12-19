import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { uploadthing } from "./client";
import { currentUser } from "@/lib/current-auth";
import { getUserAvatarKey } from "@/features/users/db/queries";
import { updateUserAvatar } from "@/features/users/db/mutations";

const f = createUploadthing();

export const customFileRouter = {
  avatarUploader: f(
    {
      image: {
        maxFileSize: "4MB",
        maxFileCount: 1,
      },
    },
    { awaitServerData: true }
  )
    .middleware(async () => {
      const user = await currentUser();
      if (user == null) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { userId } = metadata;
      const { key } = await getUserAvatarKey(userId);

      await updateUserAvatar({ userId, url: file.ufsUrl, key: file.key });

      if (key != null) {
        await uploadthing.deleteFiles(key);
      }

      return { message: "Avatar uploaded successfully" };
    }),
} satisfies FileRouter;

export type CustomFileRouter = typeof customFileRouter;
