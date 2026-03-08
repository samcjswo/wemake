import { ChevronUpIcon } from "lucide-react";
import { Link } from "react-router";
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
  avatarSrc,
  avatarFallback,
}: PostCardProps) {
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
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // TODO: submit upvote
              }}
            >
              <ChevronUpIcon className="size-4" />
              <span>{upvoteCount}</span>
            </Button>
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
