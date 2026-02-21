import type { Route } from "./+types/daily-leaderboards-page";

export function loader({ params }: Route.LoaderArgs) {
  return {
    year: params.year,
    month: params.month,
    day: params.day,
  };
}

export function action({}: Route.ActionArgs) {
  return null;
}

export function meta({ params }: Route.MetaFunction) {
  return [
    {
      title: `Leaderboards ${params.year}/${params.month}/${params.day} | wemake`,
    },
    {
      name: "description",
      content: `Product leaderboards for ${params.year}-${params.month}-${params.day}`,
    },
  ];
}

export default function DailyLeaderboardsPage({
  loaderData,
}: Route.ComponentProps) {
  return (
    <div className="px-20">
      <h1 className="text-3xl font-bold">
        Leaderboards — {loaderData.year}/{loaderData.month}/{loaderData.day}
      </h1>
      <p className="text-muted-foreground">Daily product leaderboard.</p>
    </div>
  );
}
