import type { Route } from "./+types/monthly-leaderboards-page";

export function loader({ params }: Route.LoaderArgs) {
  return { year: params.year, month: params.month };
}

export function action({}: Route.ActionArgs) {
  return null;
}

export function meta({ params }: Route.MetaFunction) {
  return [
    {
      title: `Leaderboards ${params.year}/${params.month} | wemake`,
    },
    {
      name: "description",
      content: `Product leaderboards for ${params.year}-${params.month}`,
    },
  ];
}

export default function MonthlyLeaderboardsPage({
  loaderData,
}: Route.ComponentProps) {
  return (
    <div className="px-20">
      <h1 className="text-3xl font-bold">
        Leaderboards — {loaderData.year}/{loaderData.month}
      </h1>
      <p className="text-muted-foreground">Monthly product leaderboard.</p>
    </div>
  );
}
