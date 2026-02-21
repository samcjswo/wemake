import type { Route } from "./+types/search-page";

export function loader({}: Route.LoaderArgs) {
  return {};
}

export function action({}: Route.ActionArgs) {
  return null;
}

export function meta({}: Route.MetaFunction) {
  return [
    { title: "Search Products | wemake" },
    { name: "description", content: "Search products" },
  ];
}

export default function SearchPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="px-20">
      <h1 className="text-3xl font-bold">Search Products</h1>
      <p className="text-muted-foreground">Search for products.</p>
    </div>
  );
}
