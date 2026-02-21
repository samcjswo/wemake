import type { Route } from "./+types/promote-page";

export function loader({}: Route.LoaderArgs) {
  return {};
}

export function action({}: Route.ActionArgs) {
  return null;
}

export function meta({}: Route.MetaFunction) {
  return [
    { title: "Promote Product | wemake" },
    { name: "description", content: "Promote your product" },
  ];
}

export default function PromotePage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="px-20">
      <h1 className="text-3xl font-bold">Promote Product</h1>
      <p className="text-muted-foreground">Promote your product to the community.</p>
    </div>
  );
}
