import { type MetaFunction } from "react-router";
import { ProductCard } from "~/features/products/components/product-cards";

export const meta: MetaFunction = () => {
  return [
    { title: "Home | wemake" },
    { name: "description", content: "Welcome to Wemake" }
  ];
};

export default function HomePage() {
  return (
    <div className="px-20">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold">
            Today's Products
          </h2>
          <p className="text-xl font-light text-foreground">The best products made by our community today.</p>
        </div>
          {Array.from({ length: 10 }).map((_, index) => (
            <ProductCard
              id={`productId-${index}`}
              name="Product Name"
              description="Product Description"
              commentCount={12}
              viewCount={4}
              voteCount={120}
          />))}
      </div>
    </div>
  );
}
