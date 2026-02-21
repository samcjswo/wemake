import type { Route } from "./+types/category-page";

export function loader({ params }: Route.LoaderArgs) {
  return { category: params.category };
}

export function action({}: Route.ActionArgs) {
  return null;
}

export function meta({ params }: Route.MetaFunction) {
  return [
    { title: `${params.category} | wemake` },
    {
      name: "description",
      content: `Products in category: ${params.category}`,
    },
  ];
}

export default function CategoryPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="px-20">
      <h1 className="text-3xl font-bold">Category: {loaderData.category}</h1>
      <p className="text-muted-foreground">
        Products in this category.
      </p>
    </div>
  );
}
