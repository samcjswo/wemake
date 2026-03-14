import { Button } from "~/common/components/ui/button";
import type { Route } from "./+types/leaderboards-page";
import { PageHero } from "~/common/components/page-hero";
import { Link } from "react-router";
import { ProductCard } from "../components/product-cards";
import { DateTime } from "luxon";
import client from "~/supa-client";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Leaderboards | wemake" },
    { name: "description", content: "Product leaderboards" },
  ];
};

async function getTopProducts(startDate: string) {
  const { data, error } = await client
    .from("products")
    .select(`
      id,
      name,
      description,
      stats,
      product_upvotes(count)
    `)
    .gte("createdAt", startDate)
    .limit(100);

  if (error) throw error;

  return (data ?? [])
    .map((p) => {
      const stats = p.stats as { views?: number; reviews?: number } | null;
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        viewCount: stats?.views ?? 0,
        commentCount: stats?.reviews ?? 0,
        voteCount: Number((p.product_upvotes as { count: number }[])?.[0]?.count ?? 0),
      };
    })
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, 7);
}

export const loader = async () => {
  const now = DateTime.now().setZone("Asia/Seoul");

  const [daily, weekly, monthly, yearly] = await Promise.all([
    getTopProducts(now.startOf("day").toISO()!),
    getTopProducts(now.startOf("week").toISO()!),
    getTopProducts(now.startOf("month").toISO()!),
    getTopProducts(now.startOf("year").toISO()!),
  ]);

  return { daily, weekly, monthly, yearly };
};

export default function LeaderboardsPage({ loaderData }: Route.ComponentProps) {
  const { daily, weekly, monthly, yearly } = loaderData;

  return (
    <><PageHero
      title="Leaderboards"
      description="Browse product leaderboards by time period." />

      {/* Daily Leaderboard */}
      <div className="py-10 grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Daily Leaderboard</h2>
          <p className="text-xl font-light text-foreground">
            The most popular products made by our community today.
          </p>
        </div>
        {daily.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            commentCount={product.commentCount}
            viewCount={product.viewCount}
            voteCount={product.voteCount} />
        ))}
        <Button variant="link" asChild className="text-lg self-center">
          <Link to="/products/leaderboards/daily">
            View all products &rarr;
          </Link>
        </Button>
      </div>

      {/* Weekly Leaderboard */}
      <div className="py-10 grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Weekly Leaderboard</h2>
          <p className="text-xl font-light text-foreground">
            The most popular products made by week.
          </p>
        </div>
        {weekly.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            commentCount={product.commentCount}
            viewCount={product.viewCount}
            voteCount={product.voteCount} />
        ))}
        <Button variant="link" asChild className="text-lg self-center">
          <Link to="/products/leaderboards/weekly">
            View all products &rarr;
          </Link>
        </Button>
      </div>

      {/* Monthly Leaderboard */}
      <div className="py-10 grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Monthly Leaderboard</h2>
          <p className="text-xl font-light text-foreground">
            The most popular products made by month.
          </p>
        </div>
        {monthly.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            commentCount={product.commentCount}
            viewCount={product.viewCount}
            voteCount={product.voteCount} />
        ))}
        <Button variant="link" asChild className="text-lg self-center">
          <Link to="/products/leaderboards/monthly">
            View all products &rarr;
          </Link>
        </Button>
      </div>

      {/* Yearly Leaderboard */}
      <div className="py-10 grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Yearly Leaderboard</h2>
          <p className="text-xl font-light text-foreground">
            The most popular products made by year.
          </p>
        </div>
        {yearly.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            commentCount={product.commentCount}
            viewCount={product.viewCount}
            voteCount={product.voteCount} />
        ))}
        <Button variant="link" asChild className="text-lg self-center">
          <Link to="/products/leaderboards/yearly">
            View all products &rarr;
          </Link>
        </Button>
      </div>
    </>
  );
}
