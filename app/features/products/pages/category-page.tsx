import { Link } from "react-router";
import type { Route } from "./+types/category-page";
import { PageHero } from "~/common/components/page-hero";
import { ProductCard } from "../components/product-cards";

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

export function loader({ params }: Route.LoaderArgs) {
  return { category: params.category };
}

export function action({}: Route.ActionArgs) {
  return null;
}

export function meta(args: Route.MetaFunction) {
  const params = (args as { params?: { category?: string } }).params ?? {};
  const category = params.category ?? "";
  return [
    { title: `${category} | wemake` },
    {
      name: "description",
      content: `Products in category: ${category}`,
    },
  ];
}

export default function CategoryPage({ loaderData }: Route.ComponentProps) {
  const categoryName =
    loaderData.category.charAt(0).toUpperCase() + loaderData.category.slice(1);

  return (
    <div className="space-y-10">
      <PageHero
        title={categoryName}
        description={`Products in ${categoryName.toLowerCase()}`}
      />
      <div className="space-y-5 w-full max-w-3xl mx-auto px-4">
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
      </div>
    </div>
  );
}
