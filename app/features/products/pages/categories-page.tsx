import type { Route } from "./+types/categories-page";

export function loader({}: Route.LoaderArgs) {
  return {};
}

export function action({}: Route.ActionArgs) {
  return null;
}

export function meta({}: Route.MetaFunction) {
  return [
    { title: "Categories | wemake" },
    { name: "description", content: "Browse products by category" },
  ];
}

export default function CategoriesPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="px-20">
      <h1 className="text-3xl font-bold">Categories</h1>
      <p className="text-muted-foreground">Browse products by category.</p>
    </div>
  );
}
