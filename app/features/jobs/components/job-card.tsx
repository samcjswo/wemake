import { Link } from "react-router";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";

export type JobCardProps = {
  jobId: string;
  companyName: string;
  companyLogoUrl: string;
  postedAt: string;
  title: string;
  jobType: string;
  positionLocation: string;
  salaryRange: string;
  location: string;
};

export function JobCard({
  jobId,
  companyName,
  companyLogoUrl,
  postedAt,
  title,
  jobType,
  positionLocation,
  salaryRange,
  location,
}: JobCardProps) {
  return (
    <Link to={`/jobs/${jobId}`}>
      <Card className="bg-transparent hover:bg-card/50">
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={companyLogoUrl}
              alt={`${companyName} logo`}
              className="size-10 rounded-full"
            />
            <div className="space-x-2">
              <span className="text-lg font-medium">{companyName}</span>
              <span className="text-sm text-muted-foreground">{postedAt}</span>
            </div>
          </div>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="outline">
            {jobType}
          </Badge>
          <Badge variant="outline">
            {positionLocation}
          </Badge>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium">{salaryRange}</span>
            <span className="text-sm text-muted-foreground">{location}</span>
          </div>
          <Button variant="secondary" size="sm">
            Apply Now &rarr;
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
