import { DateTime } from "luxon";
import type { Route } from "./+types/weekly-leaderboards-page";
import { data, isRouteErrorResponse, Link } from "react-router";
import { z } from "zod";
import { PageHero } from "~/common/components/page-hero";
import { ProductCard } from "../components/product-cards";
import { Button } from "~/common/components/ui/button";
import ProductPagination from "~/common/components/product-pagination";

const paramsSchema = z.object({
  year: z.coerce.number(),
  week: z.coerce.number().min(1).max(53),
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
  const weekStart = DateTime.fromObject(
    { weekYear: parsedData.year, weekNumber: parsedData.week },
    { zone: "Asia/Seoul" }
  );
  if (!weekStart.isValid) {
    throw data(
      {
        error_code: "INVALID_WEEK",
        message: "Invalid week",
      },
      { status: 400 }
    );
  }
  const currentWeekStart = DateTime.now()
    .setZone("Asia/Seoul")
    .startOf("week");
  if (weekStart > currentWeekStart) {
    throw data(
      {
        error_code: "FUTURE_WEEK",
        message: "Future week",
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
  const params = (args as { params?: { year?: string; week?: string } }).params ?? {};
  const year = Number(params.year);
  const week = Number(params.week);
  const weekStart = DateTime.fromObject(
    { weekYear: year, weekNumber: week },
    { zone: "Asia/Seoul" }
  );
  const weekEnd = weekStart.plus({ days: 6 });
  const periodLabel = weekStart.isValid
    ? `${weekStart.toLocaleString(DateTime.DATE_MED)} – ${weekEnd.toLocaleString(DateTime.DATE_MED)}`
    : "";
  return [
    { title: `The best products of ${periodLabel} | wemake` },
    { name: "description", content: `Weekly product leaderboard for ${periodLabel}` },
  ];
}

function formatWeekRange(weekStart: DateTime) {
  const weekEnd = weekStart.plus({ days: 6 });
  return `${weekStart.toLocaleString(DateTime.DATE_MED)} – ${weekEnd.toLocaleString(DateTime.DATE_MED)}`;
}

export default function WeeklyLeaderboardsPage({
  loaderData,
}: Route.ComponentProps) {
  const weekStart = DateTime.fromObject(
    { weekYear: loaderData.year, weekNumber: loaderData.week },
    { zone: "Asia/Seoul" }
  );
  const previousWeek = weekStart.minus({ weeks: 1 });
  const nextWeek = weekStart.plus({ weeks: 1 });
  const currentWeekStart = DateTime.now()
    .setZone("Asia/Seoul")
    .startOf("week");
  const isCurrentWeek = weekStart.hasSame(currentWeekStart, "week");

  return (
    <div className="space-y-10">
      <PageHero
        title={`The best products of ${formatWeekRange(weekStart)}`}
      />
      <div className="flex items-center justify-center gap-2">
        <Button asChild variant="secondary">
          <Link
            to={`/products/leaderboards/weekly/${previousWeek.weekYear}/${previousWeek.weekNumber}`}
          >
            &larr; Week {previousWeek.weekNumber}, {previousWeek.year}
          </Link>
        </Button>
        {!isCurrentWeek ? (
          <Button asChild variant="secondary">
            <Link
              to={`/products/leaderboards/weekly/${nextWeek.weekYear}/${nextWeek.weekNumber}`}
            >
              Week {nextWeek.weekNumber}, {nextWeek.year} &rarr;
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
