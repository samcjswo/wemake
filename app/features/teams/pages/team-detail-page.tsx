import { data } from "react-router";
import { Form, Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Label } from "~/common/components/ui/label";
import { Textarea } from "~/common/components/ui/textarea";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/common/components/ui/breadcrumb";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/team-detail-page";

interface TeamDetail {
  teamId: string;
  leaderUserName: string;
  leaderAvatarSrc?: string;
  leaderAvatarFallback: string;
  roles: string[];
  projectDescription: string;
  productName: string;
  teamSize: number;
  equitySplit: number;
}

const MOCK_TEAMS: TeamDetail[] = Array.from({ length: 18 }, (_, index) => ({
  teamId: `teamId-${index}`,
  leaderUserName: `User ${index + 1}`,
  leaderAvatarSrc: `https://github.com/user${index + 1}.png`,
  leaderAvatarFallback: `U${index + 1}`,
  roles: ["React Developer", "Backend Developer", "Product Manager"].slice(
    0,
    1 + (index % 3)
  ),
  projectDescription:
    index % 3 === 0
      ? "a new social media platform"
      : index % 3 === 1
        ? "an AI-powered productivity tool"
        : "a community-driven marketplace",
  productName: `Project ${index + 1}`,
  teamSize: 3 + (index % 5),
  equitySplit: 10 + (index % 20),
}));

function getTeamById(teamId: string): TeamDetail | null {
  return MOCK_TEAMS.find((t) => t.teamId === teamId) ?? null;
}

interface SubmitErrors {
  introduction?: string;
  whyJoin?: string;
}

interface SubmitValues {
  introduction?: string | null;
  whyJoin?: string | null;
}

function getFormErrors(formData: FormData): SubmitErrors | null {
  const introduction = (formData.get("introduction") as string)?.trim();
  const whyJoin = (formData.get("whyJoin") as string)?.trim();

  const errors: SubmitErrors = {};

  if (!introduction) errors.introduction = "Introduction is required";
  if (!whyJoin) errors.whyJoin = "Please tell us why you want to join";

  if (Object.keys(errors).length === 0) return null;
  return errors;
}

function getValuesFromFormData(formData: FormData): SubmitValues {
  return {
    introduction: formData.get("introduction") as string | null,
    whyJoin: formData.get("whyJoin") as string | null,
  };
}

export function loader({ params }: Route.LoaderArgs) {
  const teamId = params.teamId;
  if (!teamId) {
    throw data({ message: "Team not found" }, { status: 404 });
  }
  const team = getTeamById(teamId);
  if (!team) {
    throw data({ message: "Team not found" }, { status: 404 });
  }
  return { team };
}

export async function action({ request, params }: Route.ActionArgs) {
  if (request.method !== "POST") return null;

  const formData = await request.formData();
  const errors = getFormErrors(formData);

  if (errors) {
    return {
      ok: false,
      errors,
      values: getValuesFromFormData(formData),
    };
  }

  // TODO: persist application (e.g. team_applications table, link to team_id and user)
  return {
    ok: true,
    message: "Your application has been submitted. The team lead will review it shortly.",
  };
}

export function meta(args: Parameters<Route.MetaFunction>[0]) {
  const loaderData = (args as { data?: { team?: TeamDetail } }).data;
  const team = loaderData?.team;
  const title = team?.productName ?? "Team";
  return [
    { title: `Join ${title} | wemake` },
    { name: "description", content: team?.projectDescription ?? "Join this team" },
  ];
}

export default function TeamDetailPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const team = loaderData?.team as TeamDetail | undefined;
  const errors = (actionData as { errors?: SubmitErrors } | undefined)?.errors;
  const actionValues = (actionData as { values?: SubmitValues } | undefined)?.values ?? {};
  const success = (actionData as { ok?: boolean } | undefined)?.ok === true;
  const message = (actionData as { message?: string } | undefined)?.message;

  if (!team) return null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10 space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/teams">Teams</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{team.productName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{team.productName}</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            <span className="font-medium text-foreground">{team.leaderUserName}</span>
            {" is looking for "}
            {team.roles.map((role, index) => (
              <span key={role}>
                {index > 0 && ", "}
                <Badge variant="secondary" className="text-sm">
                  {role}
                </Badge>
              </span>
            ))}
            {" to build "}
            {team.projectDescription}
          </CardDescription>
          <div className="flex items-center gap-4 pt-2">
            <Avatar className="size-10">
              <AvatarFallback>{team.leaderAvatarFallback}</AvatarFallback>
              <AvatarImage src={team.leaderAvatarSrc} alt={team.leaderUserName} />
            </Avatar>
            <div className="text-sm text-muted-foreground">
              Team size: {team.teamSize} · Equity split: {team.equitySplit}%
            </div>
          </div>
        </CardHeader>
      </Card>

      {success && message ? (
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="pt-6">
            <p className="text-green-700 dark:text-green-400 font-medium">
              {message}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <Button asChild variant="link" className="pl-0">
                <Link to="/teams">Back to teams</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to={`/teams/${team.teamId}`}>View team again</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Request to join</CardTitle>
            <CardDescription>
              Introduce yourself and explain why you want to join this team. The
              team lead will review your application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="introduction">Introduction</Label>
                  <Textarea
                    id="introduction"
                    name="introduction"
                    placeholder="Tell the team about yourself: your background, skills, and what you bring to the project..."
                    defaultValue={actionValues.introduction ?? ""}
                    className={cn(
                      "min-h-28 resize-y",
                      errors?.introduction && "border-destructive"
                    )}
                    rows={4}
                  />
                  {errors?.introduction ? (
                    <p className="text-sm text-destructive">
                      {errors.introduction}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whyJoin">Why do you want to join?</Label>
                  <Textarea
                    id="whyJoin"
                    name="whyJoin"
                    placeholder="Why are you interested in this project? What role are you most interested in?"
                    defaultValue={actionValues.whyJoin ?? ""}
                    className={cn(
                      "min-h-28 resize-y",
                      errors?.whyJoin && "border-destructive"
                    )}
                    rows={4}
                  />
                  {errors?.whyJoin ? (
                    <p className="text-sm text-destructive">{errors.whyJoin}</p>
                  ) : null}
                </div>
              </div>
              <div className="mt-8 flex flex-col items-center gap-3">
                <Button type="submit" className="w-full max-w-md">
                  Submit application
                </Button>
                <Button asChild variant="ghost" className="w-full max-w-md">
                  <Link to="/teams">Cancel</Link>
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
