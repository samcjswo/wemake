import { DateTime } from "luxon";
import type { Route } from "./+types/monthly-leaderboards-page";
import { data, isRouteErrorResponse, Link } from "react-router";
import { z } from "zod";
import { PageHero } from "~/common/components/page-hero";
import { ProductCard } from "../components/product-cards";
import { Button } from "~/common/components/ui/button";
import ProductPagination from "~/common/components/product-pagination";

const paramsSchema = z.object({
  year: z.coerce.number().min(2000).max(2100),
  month: z.coerce.number().min(1).max(12),
});

export function loader({ params, request }: Route.LoaderArgs) {
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
  const monthStart = DateTime.fromObject(
    { year: parsedData.year, month: parsedData.month, day: 1 },
    { zone: "Asia/Seoul" }
  );
  if (!monthStart.isValid) {
    throw data(
      {
        error_code: "INVALID_DATE",
        message: "Invalid date",
      },
      { status: 400 }
    );
  }
  const currentMonthStart = DateTime.now()
    .setZone("Asia/Seoul")
    .startOf("month");
  if (monthStart > currentMonthStart) {
    throw data(
      {
        error_code: "FUTURE_MONTH",
        message: "Future month",
      },
      { status: 400 }
    );
  }
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page");
  const rawPage = pageParam === null ? 1 : Number(pageParam);
  const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  return {
    ...parsedData,
    page,
  };
}

export function action({}: Route.ActionArgs) {
  return null;
}

export function meta(args: Route.MetaFunction) {
  const params = (args as { params?: { year?: string; month?: string } })
    .params ?? {};
  const year = Number(params.year);
  const month = Number(params.month);
  const monthStart = DateTime.fromObject(
    { year, month, day: 1 },
    { zone: "Asia/Seoul" }
  );
  const periodLabel = monthStart.isValid
    ? monthStart.toLocaleString({ month: "long", year: "numeric" })
    : "";
  return [
    { title: `The best products of ${periodLabel} | wemake` },
    { name: "description", content: `Monthly product leaderboard for ${periodLabel}` },
  ];
}

export default function MonthlyLeaderboardsPage({
  loaderData,
}: Route.ComponentProps) {
  const monthStart = DateTime.fromObject(
    { year: loaderData.year, month: loaderData.month, day: 1 },
    { zone: "Asia/Seoul" }
  );
  const previousMonth = monthStart.minus({ months: 1 });
  const nextMonth = monthStart.plus({ months: 1 });
  const currentMonthStart = DateTime.now()
    .setZone("Asia/Seoul")
    .startOf("month");
  const isCurrentMonth = monthStart.hasSame(currentMonthStart, "month");

  const titleMonth = monthStart.toLocaleString({ month: "long", year: "numeric" });

  return (
    <div className="space-y-10">
      <PageHero
        title={`The best products of ${titleMonth}`}
      />
      <div className="flex items-center justify-center gap-2">
        <Button asChild variant="secondary">
          <Link
            to={`/products/leaderboards/monthly/${previousMonth.year}/${previousMonth.month}`}
          >
            &larr; {previousMonth.toLocaleString({ month: "long", year: "numeric" })}
          </Link>
        </Button>
        {!isCurrentMonth ? (
          <Button asChild variant="secondary">
            <Link
              to={`/products/leaderboards/monthly/${nextMonth.year}/${nextMonth.month}`}
            >
              {nextMonth.toLocaleString({ month: "long", year: "numeric" })} &rarr;
            </Link>
          </Button>
        ) : null}
      </div>
      <div className="space-y-5 w-full max-w-3xl mx-auto">
        {Array.from({ length: 5 }).map((_, index) => (
          <ProductCard
            id={`productId-${index}`}
            name="Product Name"
            description="Product Description"
            commentCount={12}
            viewCount={4}
            voteCount={120}
          />
        ))}
      </div>
      <ProductPagination totalPages={10} />
      <p className="text-center text-muted-foreground text-sm">
        Page {loaderData.page} of 10
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
