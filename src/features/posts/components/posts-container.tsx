import { BackendPagination } from "@/types";
import { IPost } from "../types";

interface Props {
  posts: BackendPagination<IPost[]>;
}

export function PostsContainer({ posts }: Props) {
  if (posts.data.length === 0) {
    return (
      <div className="text-muted-foreground my-5 text-center">
        No posts yet, add, follow friends to see their content
      </div>
    );
  }

      
}
