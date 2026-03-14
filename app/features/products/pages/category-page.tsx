import type { Route } from "./+types/category-page";
import { PageHero } from "~/common/components/page-hero";
import { ProductCard } from "../components/product-cards";
import client from "~/supa-client";
import { data } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const categoryId = Number(params.category);
  if (Number.isNaN(categoryId)) {
    throw data({ message: "Invalid category" }, { status: 400 });
  }

  const [categoryResult, productsResult] = await Promise.all([
    client
      .from("categories")
      .select("name, description")
      .eq("category_id", categoryId)
      .single(),
    client
      .from("products")
      .select(`id, name, description, stats, product_upvotes(count)`)
      .eq("category_id", categoryId),
  ]);

  if (categoryResult.error || !categoryResult.data) {
    throw data({ message: "Category not found" }, { status: 404 });
  }
  if (productsResult.error) throw productsResult.error;

  const products = (productsResult.data ?? []).map((p) => {
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

  return {
    category: categoryResult.data,
    products,
  };
}

export function meta(args: Route.MetaFunction) {
  const params = (args as { params?: { category?: string } }).params ?? {};
  return [
    { title: `Category ${params.category ?? ""} | wemake` },
    { name: "description", content: `Products in this category` },
  ];
}

export default function CategoryPage({ loaderData }: Route.ComponentProps) {
  const { category, products } = loaderData;

  return (
    <div className="space-y-10">
      <PageHero
        title={category.name}
        description={category.description}
      />
      <div className="space-y-5 w-full max-w-3xl mx-auto px-4">
        {products.length === 0 ? (
          <p className="text-center text-muted-foreground">No products in this category yet.</p>
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
