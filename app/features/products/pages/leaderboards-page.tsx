import { Button } from "~/common/components/ui/button";
import type { Route } from "./+types/leaderboards-page";
import { PageHero } from "~/common/components/page-hero";
import { Link } from "react-router";
import { ProductCard } from "../components/product-cards";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Leaderboards | wemake" },
    { name: "description", content: "Product leaderboards" },
  ];
}

export default function LeaderboardsPage() {
  return (
    <><PageHero
      title="Leaderboards"
      description="Browse product leaderboards by time period." />
      
      {/* Daily Leaderboard */}
      <div className="py-10 grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold">
            Daily Leaderboard
          </h2>
          <p className="text-xl font-light text-foreground">
            The most popular products made by our community today.
          </p>
        </div>
        {Array.from({ length: 7 }).map((_, index) => (
          <ProductCard
            id={`productId-${index}`}
            name="Product Name"
            description="Product Description"
            commentCount={12}
            viewCount={4}
            voteCount={120} />))}
        <Button variant="link" asChild className="text-lg self-center">
          <Link to="/products/leaderboards/daily">
            View all products &rarr;
          </Link>
        </Button>
      </div>

      {/* Weekly Leaderboard */}
      <div className="py-10 grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold">
            Weekly Leaderboard
          </h2>
          <p className="text-xl font-light text-foreground">
            The most popular products made by week.
          </p>
        </div>
        {Array.from({ length: 7 }).map((_, index) => (
          <ProductCard
            id={`productId-${index}`}
            name="Product Name"
            description="Product Description"
            commentCount={12}
            viewCount={4}
            voteCount={120} />))}
        <Button variant="link" asChild className="text-lg self-center">
          <Link to="/products/leaderboards/weekly">
            View all products &rarr;
          </Link>
        </Button>
      </div>

      {/* Monthly Leaderboard */}
      <div className="py-10 grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold">
            Monthly Leaderboard
          </h2>
          <p className="text-xl font-light text-foreground">
            The most popular products made by month.
          </p>
        </div>
        {Array.from({ length: 7 }).map((_, index) => (
          <ProductCard
            id={`productId-${index}`}
            name="Product Name"
            description="Product Description"
            commentCount={12}
            viewCount={4}
            voteCount={120} />))}
        <Button variant="link" asChild className="text-lg self-center">
          <Link to="/products/leaderboards/monthly">
            View all products &rarr;
          </Link>
        </Button>
      </div>

      {/* Yearly Leaderboard */}
      <div className="py-10 grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold">
            Yearly Leaderboard
          </h2>
          <p className="text-xl font-light text-foreground">
            The most popular products made by year.
          </p>
        </div>
        {Array.from({ length: 7 }).map((_, index) => (
          <ProductCard
            id={`productId-${index}`}
            name="Product Name"
            description="Product Description"
            commentCount={12}
            viewCount={4}
            voteCount={120} />))}
        <Button variant="link" asChild className="text-lg self-center">
          <Link to="/products/leaderboards/yearly">
            View all products &rarr;
          </Link>
        </Button>
      </div>
    </>
    
  );
}
