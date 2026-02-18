import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { DotIcon, EyeIcon, HeartIcon, LockIcon } from "lucide-react";
import { cn } from "~/lib/utils";

export type IdeaCardProps = {
  ideaId: string;
  title: string;
  viewCount: number;
  timeAgo: string;
  likeCount: number;
  claimed: boolean;
};

export function IdeaCard({
  ideaId,
  title,
  viewCount,
  timeAgo,
  likeCount,
  claimed,
}: IdeaCardProps) {
  return (
    <Card className="bg-transparent hover:bg-card/50">
      <CardHeader>
        <Link to={`/ideas/${ideaId}`}>
          <CardTitle className="text-xl">
            <span className={cn(claimed ? "bg-muted-foreground selection:bg-muted-foreground text-muted-foreground": "")}>
              {title}
            </span>
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="flex items-center text-sm">
        <div className="flex gap-2 text-sm leading-tight text-muted-foreground">
          <EyeIcon className="size-4" />
          <span>{viewCount}</span>
        </div>
        <DotIcon className="size-4" />
        <span>{timeAgo}</span>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">
          <HeartIcon className="size-4" />
          <span>{likeCount}</span>
        </Button>
        {!claimed ? (
          <Button variant="default" asChild>
            <Link to={`/ideas/${ideaId}/claim`}>
              Claim idea &rarr;
            </Link>
          </Button>
        ): (
          <Button variant="outline" disabled className="cursor-not-allowed">
            <LockIcon className="size-4" />
            Claimed
          </Button>
          )
        }
      </CardFooter>
    </Card>
  );
}
