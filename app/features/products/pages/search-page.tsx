import { Form } from "react-router";
import { PageHero } from "~/common/components/page-hero";
import { ProductCard } from "../components/product-cards";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import type { Route } from "./+types/search-page";
import client from "~/supa-client";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";

  let query = client
    .from("products")
    .select(`id, name, description, stats, product_upvotes(count)`);

  if (q) {
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const { data, error } = await query.limit(20);
  if (error) throw error;

  const products = (data ?? []).map((p) => {
    const stats = p.stats as { views?: number; reviews?: number } | null;
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      viewCount: stats?.views ?? 0,
      commentCount: stats?.reviews ?? 0,
      voteCount: Number((p.product_upvotes as { count: number }[])?.[0]?.count ?? 0),
    };
  });

  return { query: q, products };
}

export function meta(_args: Parameters<Route.MetaFunction>[0]): ReturnType<Route.MetaFunction> {
  return [
    { title: "Search Products | wemake" },
    { name: "description", content: "Search products" },
  ];
}

export default function SearchPage({ loaderData }: Route.ComponentProps) {
  const { query, products } = loaderData;

  return (
    <div className="space-y-10">
      <PageHero
        title="Search Products"
        description="Find products by name or description"
      />
      <Form
        method="get"
        action="/products/search"
        className="flex w-full max-w-2xl mx-auto gap-2 px-4"
      >
        <Input
          type="search"
          name="q"
          placeholder="Search products..."
          defaultValue={query}
          className="flex-1"
          autoFocus
        />
        <Button type="submit">Search</Button>
      </Form>
      <div className="space-y-5 w-full max-w-3xl mx-auto px-4">
        {query && (
          <p className="text-center text-muted-foreground px-4">
            Search results for &quot;{query}&quot;
          </p>
        )}
        {products.length === 0 ? (
          <p className="text-center text-muted-foreground">No products found.</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              commentCount={product.commentCount}
              viewCount={product.viewCount}
              voteCount={product.voteCount}
            />
          ))
        )}
      </div>
    </div>
  );
}
