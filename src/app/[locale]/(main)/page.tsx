import { PostsContainer } from "@/features/posts/components/posts-container";
import { getPostsGlobalTag } from "@/features/posts/db/cache/posts";
import { IPost } from "@/features/posts/types";
import { getStoriesGlobalTag } from "@/features/stories/db/cache/stories";
import { IStory } from "@/features/stories/db/cache/types";
import { currentToken } from "@/lib/current-auth";
import { db } from "@/lib/db";
import { BackendPagination } from "@/types";
import { Loader2 } from "lucide-react";
import { cacheTag } from "next/cache";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function MainPage() {
  return (
    <div className="relative w-full flex flex-col lg:flex-row gap-5">
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <Suspense
          fallback={<Loader2 className="size-5 animate-spin my-5 mx-auto" />}
        >
          <SuspendedFeed />
        </Suspense>

        <Suspense
          fallback={<Loader2 className="size-5 animate-spin my-5 mx-auto" />}
        >
          <SuspendedStories />
        </Suspense>
      </div>

      <Suspense
        fallback={<Loader2 className="size-5 animate-spin my-5 mx-auto" />}
      >
        <SuspendedSidebar />
      </Suspense>
    </div>
  );
}

async function SuspendedFeed() {
  const token = await currentToken();
  if (token == null) redirect("/sign-in");

  const { posts } = await getFeedInitialData(token);

  return <PostsContainer posts={posts} />;
}

async function SuspendedStories() {
  const token = await currentToken();
  if (token == null) redirect("/sign-in");

  const { full_stories } = await getStoriesInitialData(token);

  // TODO: stories
  return null;
}

async function SuspendedSidebar() {
  return null;
}

async function getFeedInitialData(token: string) {
  "use cache";
  cacheTag(getPostsGlobalTag());

  const response = await db.get<{ posts: BackendPagination<IPost[]> }>(
    "/posts/filter",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
}

async function getStoriesInitialData(token: string) {
  "use cache";
  cacheTag(getStoriesGlobalTag());

  const response = await db.get<{ full_stories: BackendPagination<IStory[]> }>(
    "/stories/showStories",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
}
