import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";

export type TeamCardProps = {
  teamId: string;
  leaderUserName: string;
  leaderAvatarSrc?: string;
  leaderAvatarFallback: string;
  roles: string[];
  projectDescription: string;
};

export function TeamCard({
  teamId,
  leaderUserName,
  leaderAvatarSrc,
  leaderAvatarFallback,
  roles,
  projectDescription,
}: TeamCardProps) {
  return (
    <Link to={`/teams/${teamId}`} className="block h-full">
      <Card className="h-full flex flex-col min-h-[140px] bg-transparent hover:bg-card/50 transition-colors">
        <CardHeader className="flex-1 min-h-0">
          <CardTitle className="text-base leading-loose flex flex-wrap items-baseline gap-x-1 gap-y-1">
            <Badge
              variant="secondary"
              className="inline-flex shadow-sm items-center text-base"
            >
              <span>{leaderUserName}</span>
              <Avatar className="size-4">
                <AvatarFallback>{leaderAvatarFallback}</AvatarFallback>
                <AvatarImage src={leaderAvatarSrc} alt={leaderUserName} />
              </Avatar>
            </Badge>
            <span> is looking for </span>
            {roles.map((role, index) => (
              <span key={role}>
                {index > 0 && " "}
                <Badge className="text-base">{role}</Badge>
              </span>
            ))}
            <span> to build </span>
            <span className="line-clamp-2 wrap-break-word">{projectDescription}</span>
          </CardTitle>
        </CardHeader>
        <CardFooter className="justify-end shrink-0">
          <Button variant="link">
            Join Team &rarr;
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
