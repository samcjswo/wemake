import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { ChevronUpIcon, EyeIcon, MessageCircleIcon } from "lucide-react";

export type ProductCardProps = {
  id: string | number;
  name: string;
  description: string;
  commentCount: number;
  viewCount: number;
  voteCount: number;
};

export function ProductCard({
  id,
  name,
  description,
  commentCount,
  viewCount,
  voteCount,
}: ProductCardProps) {
  return (
    <Link to={`/products/${id}`} className="block">
      <Card className="w-full flex flex-row items-center justify-between gap-4 bg-transparent hover:bg-transparent">
        <CardHeader className="flex-1 min-w-0">
          <CardTitle className="text-2xl font-bold">{name}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircleIcon className="w-4 h-4" />
              <span>{commentCount}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <EyeIcon className="w-4 h-4" />
              <span>{viewCount}</span>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="py-0 shrink-0">
          <Button variant="outline" className="flex flex-col h-14">
            <ChevronUpIcon className="size-4 shrink-0" />
            <span>{voteCount}</span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
