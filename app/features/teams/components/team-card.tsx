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
    <Link to={`/teams/${teamId}`}>
      <Card className="bg-transparent hover:bg-card/50 transition-colors">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="text-base leading-loose">
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
            <span>{projectDescription}</span>
          </CardTitle>
        </CardHeader>
        <CardFooter className="justify-end">
          <Button variant="link">
            Join Team &rarr;
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
