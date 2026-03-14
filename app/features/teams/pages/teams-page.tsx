import { Link } from "react-router";
import { UsersIcon } from "lucide-react";
import { Button } from "~/common/components/ui/button";
import { TeamCard } from "../components/team-card";
import type { Route } from "./+types/teams-page";
import { getTeams } from "../queries";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const rawPage = Number(url.searchParams.get("page") ?? "1");
  const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const { teams: rawTeams, total, perPage } = await getTeams(page);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const clampedPage = Math.min(page, totalPages);

  const teams = rawTeams.map((t) => ({
    teamId: String(t.team_id),
    leaderUserName: "Team Lead",
    leaderAvatarSrc: undefined as string | undefined,
    leaderAvatarFallback: "TL",
    roles: t.roles.split(",").map((r: string) => r.trim()).filter(Boolean),
    projectDescription: t.product_description,
  }));

  return { page: clampedPage, totalPages, teams };
}

export function action(_args: Route.ActionArgs) {
  return null;
}

export function meta(
  _args: Parameters<Route.MetaFunction>[0]
): ReturnType<Route.MetaFunction> {
  return [
    { title: "Find a team mate | wemake" },
    { name: "description", content: "Join a team looking for a new member." },
  ];
}

export default function TeamsPage({ loaderData }: Route.ComponentProps) {
  const { page, totalPages, teams } = loaderData;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10 space-y-12">
      <header className="flex flex-row items-start gap-6">
        <div className="shrink-0 w-32 h-32 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden shadow-md">
          <UsersIcon className="size-16 text-primary/60" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Find a team mate
          </h1>
          <p className="text-muted-foreground text-base font-normal">
            Join a team looking for a new member.
          </p>
        </div>
        <div className="shrink-0 flex flex-row items-center gap-2">
          <Button asChild variant="default">
            <Link to="/teams/new">Post a team</Link>
          </Button>
        </div>
      </header>

      <div className="pt-12 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {teams.map((team) => (
            <TeamCard
              key={team.teamId}
              teamId={team.teamId}
              leaderUserName={team.leaderUserName}
              leaderAvatarSrc={team.leaderAvatarSrc}
              leaderAvatarFallback={team.leaderAvatarFallback}
              roles={team.roles}
              projectDescription={team.projectDescription}
            />
          ))}
        </div>
        {totalPages > 1 ? (
          <nav className="flex justify-center gap-2 mt-8" aria-label="Teams pagination">
            {page > 1 ? (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/teams?page=${page - 1}`}>Previous</Link>
              </Button>
            ) : null}
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            {page < totalPages ? (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/teams?page=${page + 1}`}>Next</Link>
              </Button>
            ) : null}
          </nav>
        ) : null}
      </div>
    </div>
  );
}
