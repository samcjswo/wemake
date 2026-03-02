import { DateTime } from "luxon";
import type { Route } from "./+types/yearly-leaderboards-page";
import { data, isRouteErrorResponse, Link } from "react-router";
import { z } from "zod";
import { PageHero } from "~/common/components/page-hero";
import { ProductCard } from "../components/product-cards";
import { Button } from "~/common/components/ui/button";
import ProductPagination from "~/common/components/product-pagination";

const paramsSchema = z.object({
  year: z.coerce.number().min(2000).max(2100),
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

  return {
    ...parsedData,
    page,
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
