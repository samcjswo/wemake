import type { Route } from "./+types/products-page";

export function loader({}: Route.LoaderArgs) {
  return {};
}

export function action({}: Route.ActionArgs) {
  return null;
}

export function meta({}: Route.MetaFunction) {
  return [
    { title: "Products | wemake" },
    { name: "description", content: "Explore products" },
  ];
}

export default function ProductsPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="px-20">
      <h1 className="text-3xl font-bold">Products</h1>
      <p className="text-muted-foreground">Explore products from our community.</p>
    </div>
  );
}
