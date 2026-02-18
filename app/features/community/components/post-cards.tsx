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
  avatarSrc?: string;
  avatarFallback: string;
};

export function PostCard({
  postId,
  title,
  authorName,
  category,
  timeAgo,
  avatarSrc,
  avatarFallback,
}: PostCardProps) {
  return (
    <Link to={`/community/${postId}`}>
      <Card className="bg-transparent hover:bg-card/50">
        <CardHeader className="flex flex-row items-center gap-2">
          <Avatar className="size-14">
            <AvatarFallback>{avatarFallback}</AvatarFallback>
            <AvatarImage src={avatarSrc} />
          </Avatar>
          <div className="space-y-2">
            <CardTitle>{title}</CardTitle>
            <div className="flex gap-2 text-sm leading-tight text-muted-foreground">
              <span>{authorName}</span>
              <span>{category}</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="justify-end">
          <Button variant="link">
            Reply &rarr;
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
