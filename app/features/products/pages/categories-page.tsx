import { Link } from "react-router";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { PageHero } from "~/common/components/page-hero";
import type { Route } from "./+types/categories-page";
import client from "~/supa-client";

export async function loader({}: Route.LoaderArgs) {
  const { data, error } = await client
    .from("categories")
    .select("category_id, name, description")
    .order("name");

  if (error) throw error;
  return { categories: data ?? [] };
}

export function meta(_args: Parameters<Route.MetaFunction>[0]): ReturnType<Route.MetaFunction> {
  return [
    { title: "Categories | wemake" },
    { name: "description", content: "Browse products by category" },
  ];
}

export default function CategoriesPage({ loaderData }: Route.ComponentProps) {
  const { categories } = loaderData;

  return (
    <div className="space-y-10">
      <PageHero
        title="Categories"
        description="Browse products by category"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto px-4">
        {categories.map((category) => (
          <Link key={category.category_id} to={`/products/categories/${category.category_id}`}>
            <Card className="h-full transition-colors hover:bg-accent/50">
              <CardHeader>
                <CardTitle className="text-xl">{category.name}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {category.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
