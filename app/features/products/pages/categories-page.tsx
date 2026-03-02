import { Link } from "react-router";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { PageHero } from "~/common/components/page-hero";

import type { Route } from "./+types/categories-page";

const CATEGORIES = [
  { slug: "technology", name: "Technology", description: "Apps and dev tools" },
  { slug: "design", name: "Design", description: "UI/UX and design tools" },
  { slug: "marketing", name: "Marketing", description: "Growth and analytics" },
];

export function loader({}: Route.LoaderArgs) {
  return {};
}

export function action({}: Route.ActionArgs) {
  return null;
}

export function meta(_args: Parameters<Route.MetaFunction>[0]): ReturnType<Route.MetaFunction> {
  return [
    { title: "Categories | wemake" },
    { name: "description", content: "Browse products by category" },
  ];
}

export default function CategoriesPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-10">
      <PageHero
        title="Categories"
        description="Browse products by category"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto px-4">
        {CATEGORIES.map((category) => (
          <Link key={category.slug} to={`/products/categories/${category.slug}`}>
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
