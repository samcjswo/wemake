import { ChevronUpIcon } from "lucide-react";
import { Link, useFetcher } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";

export type PostCardProps = {
  postId: string;
  title: string;
  authorName: string;
  category: string;
  timeAgo: string;
  /** Use "reply" for homepage (Reply button), "upvote" for community page (Upvote + count). */
  footerVariant: "reply" | "upvote";
  upvoteCount?: number;
  isUpvoted?: boolean;
  isLoggedIn?: boolean;
  avatarSrc?: string;
  avatarFallback: string;
};

export function PostCard({
  postId,
  title,
  authorName,
  category,
  timeAgo,
  footerVariant,
  upvoteCount = 0,
  isUpvoted = false,
  isLoggedIn = false,
  avatarSrc,
  avatarFallback,
}: PostCardProps) {
  const fetcher = useFetcher();

  const optimisticUpvoted =
    fetcher.state !== "idle"
      ? fetcher.formData?.get("intent") === "upvote"
        ? !isUpvoted
        : isUpvoted
      : isUpvoted;

  const optimisticCount =
    fetcher.state !== "idle"
      ? optimisticUpvoted
        ? upvoteCount + 1
        : upvoteCount - 1
      : upvoteCount;

  return (
    <Link to={`/community/${postId}`}>
      <Card className="bg-transparent hover:bg-card/50">
        <CardHeader className="flex flex-row items-center gap-2">
          <Avatar className="size-14 shrink-0">
            <AvatarFallback>{avatarFallback}</AvatarFallback>
            <AvatarImage src={avatarSrc} />
          </Avatar>
          <div className="min-w-0 flex-1 space-y-2">
            <CardTitle>{title}</CardTitle>
            <div className="flex gap-2 text-sm leading-tight text-muted-foreground">
              <span>{authorName}</span>
              <span>{category}</span>
              <span>{timeAgo}</span>
            </div>
          </div>
          {footerVariant === "upvote" && (
            isLoggedIn ? (
              <fetcher.Form
                method="post"
                action="/community"
                onClick={(e) => e.stopPropagation()}
              >
                <input type="hidden" name="intent" value="upvote" />
                <input type="hidden" name="postId" value={postId} />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className={`shrink-0 gap-1.5 ${
                    optimisticUpvoted
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ChevronUpIcon className="size-4" />
                  <span>{optimisticCount}</span>
                </Button>
              </fetcher.Form>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground"
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <Link to="/sign-in">
                  <ChevronUpIcon className="size-4" />
                  <span>{upvoteCount}</span>
                </Link>
              </Button>
            )
          )}
        </CardHeader>
        {footerVariant === "reply" && (
          <CardFooter className="justify-end">
            <Button variant="link">Reply &rarr;</Button>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
