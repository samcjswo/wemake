import { DateTime } from "luxon";
import type { Route } from "./+types/daily-leaderboards-page";
import { data, isRouteErrorResponse, Link } from "react-router";
import { z } from "zod";
import { PageHero } from "~/common/components/page-hero";
import { ProductCard } from "../components/product-cards";
import { Button } from "~/common/components/ui/button";
import ProductPagination from "~/common/components/product-pagination";
import client from "~/supa-client";

const paramsSchema = z.object({
  year: z.coerce.number(),
  month: z.coerce.number(),
  day: z.coerce.number(),
});

const PAGE_SIZE = 10;

export async function loader({ params, request }: Route.LoaderArgs) {
  const { success, data: parsedData } = paramsSchema.safeParse(params);
  if (!success) {
    throw data({
      error_code: "INVALID_PARAMS",
      message: "Invalid parameters"},
      {
        status: 400
      }
    );
  }
  const date = DateTime.fromObject(parsedData).setZone("Asia/Seoul");
  if (!date.isValid) {
    throw data({
      error_code: "INVALID_DATE",
      message: "Invalid date"},
      {
        status: 400
      }
    );
  }
  const today = DateTime.now().setZone("Asia/Seoul").startOf("day");
  if (date > today) {
    throw data({
      error_code: "FUTURE_DATE",
      message: "Future date"},
      {
        status: 400
      }
    );
  }
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page");
  const rawPage = pageParam === null ? 1 : Number(pageParam);
  const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const startDate = date.startOf("day").toISO()!;
  const endDate = date.plus({ days: 1 }).startOf("day").toISO()!;

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

export function meta(args: Route.MetaFunction) {
  const params = (args as { params?: { year?: string; month?: string; day?: string } }).params ?? {};
  const year = Number(params.year);
  const month = Number(params.month);
  const day = Number(params.day);
  const date = DateTime.fromObject({ year, month, day }).setZone("Asia/Seoul");
  const dateLabel = date.isValid ? date.toLocaleString(DateTime.DATE_MED) : "";
  return [
    { title: `The best products of ${dateLabel} | wemake` },
    { name: "description", content: `Daily product leaderboard for ${dateLabel}` },
  ];
}

export default function DailyLeaderboardsPage({loaderData}: Route.ComponentProps) {
  const urlDate = DateTime.fromObject({
    year: loaderData.year,
    month: loaderData.month,
    day: loaderData.day,
  });
  const previousDay = urlDate.minus({ days: 1 });
  const nextDay = urlDate.plus({ days: 1 });
  const isToday = urlDate.equals(DateTime.now().startOf("day"));


  return (
    <div className="space-y-10">
      <PageHero title={`The best products of ${urlDate.toLocaleString(DateTime.DATE_MED)}`} />
      <div className="flex items-center justify-center gap-2">
        <Button asChild variant="secondary">
          <Link to={`/products/leaderboards/daily/${previousDay.year}/${previousDay.month}/${previousDay.day}`}>
            &larr; {previousDay.toLocaleString(DateTime.DATE_MED)} 
          </Link>
        </Button>
        {!isToday ? <Button asChild variant="secondary">
          <Link to={`/products/leaderboards/daily/${nextDay.year}/${nextDay.month}/${nextDay.day}`}>
            {nextDay.toLocaleString(DateTime.DATE_MED)} &rarr; 
          </Link>
        </Button>: null}
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
              voteCount={product.voteCount} />
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
    return <div>{error.data.message} / {error.data.error_code}</div>
  }
  return <div> Unknown Error </div>
}
