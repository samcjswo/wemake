import type { Route } from "./+types/weekly-leaderboards-page";

export function loader({ params }: Route.LoaderArgs) {
  return { year: params.year, week: params.week };
}

export function action({}: Route.ActionArgs) {
  return null;
}

export function meta({ params }: Route.MetaFunction) {
  return [
    {
      title: `Leaderboards ${params.year} W${params.week} | wemake`,
    },
    {
      name: "description",
      content: `Product leaderboards for ${params.year} week ${params.week}`,
    },
  ];
}

export default function WeeklyLeaderboardsPage({
  loaderData,
}: Route.ComponentProps) {
  return (
    <div className="px-20">
      <h1 className="text-3xl font-bold">
        Leaderboards — {loaderData.year} Week {loaderData.week}
      </h1>
      <p className="text-muted-foreground">Weekly product leaderboard.</p>
    </div>
  );
}
