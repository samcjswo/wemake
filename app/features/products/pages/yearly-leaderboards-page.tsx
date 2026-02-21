import type { Route } from "./+types/yearly-leaderboards-page";

export function loader({ params }: Route.LoaderArgs) {
  return { year: params.year };
}

export function action({}: Route.ActionArgs) {
  return null;
}

export function meta({ params }: Route.MetaFunction) {
  return [
    { title: `Leaderboards ${params.year} | wemake` },
    { name: "description", content: `Product leaderboards for ${params.year}` },
  ];
}

export default function YearlyLeaderboardsPage({
  loaderData,
}: Route.ComponentProps) {
  return (
    <div className="px-20">
      <h1 className="text-3xl font-bold">Leaderboards — {loaderData.year}</h1>
      <p className="text-muted-foreground">Yearly product leaderboard.</p>
    </div>
  );
}
