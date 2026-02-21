import type { Route } from "./+types/leaderboards-page";

export function loader({}: Route.LoaderArgs) {
  return {};
}

export function action({}: Route.ActionArgs) {
  return null;
}

export function meta({}: Route.MetaFunction) {
  return [
    { title: "Leaderboards | wemake" },
    { name: "description", content: "Product leaderboards" },
  ];
}

export default function LeaderboardsPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="px-20">
      <h1 className="text-3xl font-bold">Leaderboards</h1>
      <p className="text-muted-foreground">Browse product leaderboards by time period.</p>
    </div>
  );
}
