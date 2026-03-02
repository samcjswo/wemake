import { Form, useSearchParams } from "react-router";
import { Fragment } from "react";
import { PageHero } from "~/common/components/page-hero";
import { ProductCard } from "../components/product-cards";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";

import type { Route } from "./+types/search-page";

const DEFAULT_PRODUCTS = [
  {
    id: "productId-1",
    name: "Product Name",
    description: "Product Description",
    commentCount: 12,
    viewCount: 4,
    voteCount: 120,
  },
  {
    id: "productId-2",
    name: "Product Name",
    description: "Product Description",
    commentCount: 12,
    viewCount: 4,
    voteCount: 120,
  },
  {
    id: "productId-3",
    name: "Product Name",
    description: "Product Description",
    commentCount: 12,
    viewCount: 4,
    voteCount: 120,
  },
];

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  return { query: q };
}

export function action({}: Route.ActionArgs) {
  return null;
}

export function meta(_args: Parameters<Route.MetaFunction>[0]): ReturnType<Route.MetaFunction> {
  return [
    { title: "Search Products | wemake" },
    { name: "description", content: "Search products" },
  ];
}

export default function SearchPage({ loaderData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const query = loaderData?.query ?? "";

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
        {query ? (
          <p className="text-center text-muted-foreground px-4">
            Search results for &quot;{query}&quot;
          </p>
        ) : (
          <Fragment>
            {DEFAULT_PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                commentCount={product.commentCount}
                viewCount={product.viewCount}
                voteCount={product.voteCount}
              />
            ))}
          </Fragment>
        )}
      </div>
    </div>
  );
}
