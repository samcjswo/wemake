import { DateTime } from "luxon";
import type { Route } from "./+types/yearly-leaderboards-page";
import { data, isRouteErrorResponse, Link } from "react-router";
import { z } from "zod";
import { PageHero } from "~/common/components/page-hero";
import { ProductCard } from "../components/product-cards";
import { Button } from "~/common/components/ui/button";
import ProductPagination from "~/common/components/product-pagination";
import client from "~/supa-client";

const paramsSchema = z.object({
  year: z.coerce.number().min(2000).max(2100),
});

const PAGE_SIZE = 10;

export async function loader({ params, request }: Route.LoaderArgs) {
  const { success, data: parsedData } = paramsSchema.safeParse(params);
  if (!success) {
    throw data(
      {
        error_code: "INVALID_PARAMS",
        message: "Invalid parameters",
      },
      { status: 400 }
    );
  }
  const currentYear = DateTime.now().setZone("Asia/Seoul").year;
  if (parsedData.year > currentYear) {
    throw data(
      {
        error_code: "FUTURE_YEAR",
        message: "Future year",
      },
      { status: 400 }
    );
  }
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page");
  const rawPage = pageParam === null ? 1 : Number(pageParam);
  const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const yearStart = DateTime.fromObject({ year: parsedData.year }, { zone: "Asia/Seoul" }).startOf("year");
  const startDate = yearStart.toISO()!;
  const endDate = yearStart.plus({ years: 1 }).toISO()!;

  const { data: rows, error } = await client
    .from("products")
    .select(`id, name, description, stats, product_upvotes(count)`)
    .gte("createdAt", startDate)
    .lt("createdAt", endDate);

  if (error) throw error;

  const sorted = (rows ?? [])
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
    .sort((a, b) => b.voteCount - a.voteCount);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const products = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return {
    ...parsedData,
    page: safePage,
    products,
    totalPages,
  };
}

export function action({}: Route.ActionArgs) {
  return null;
}

export function meta(args: Route.MetaFunction) {
  const params = (args as { params?: { year?: string } }).params ?? {};
  const year = params.year ?? "";
  return [
    { title: `The best products of ${year} | wemake` },
    { name: "description", content: `Yearly product leaderboard for ${year}` },
  ];
}

export default function YearlyLeaderboardsPage({
  loaderData,
}: Route.ComponentProps) {
  const currentYear = DateTime.now().setZone("Asia/Seoul").year;
  const previousYear = loaderData.year - 1;
  const nextYear = loaderData.year + 1;
  const isCurrentYear = loaderData.year === currentYear;

  return (
    <div className="space-y-10">
      <PageHero
        title={`The best products of ${loaderData.year}`}
      />
      <div className="flex items-center justify-center gap-2">
        <Button asChild variant="secondary">
          <Link to={`/products/leaderboards/yearly/${previousYear}`}>
            &larr; {previousYear}
          </Link>
        </Button>
        {!isCurrentYear ? (
          <Button asChild variant="secondary">
            <Link to={`/products/leaderboards/yearly/${nextYear}`}>
              {nextYear} &rarr;
            </Link>
          </Button>
        ) : null}
      </div>
      <div className="space-y-5 w-full max-w-3xl mx-auto">
        {loaderData.products.map((product) => (
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
      <ProductPagination totalPages={loaderData.totalPages} />
      <p className="text-center text-muted-foreground text-sm">
        Page {loaderData.page} of {loaderData.totalPages}
      </p>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        {error.data.message} / {error.data.error_code}
      </div>
    );
  }
  return <div>Unknown Error</div>;
}
