import { DateTime } from "luxon";
import type { Route } from "./+types/daily-leaderboards-page";
import { data, isRouteErrorResponse, Link } from "react-router";
import { z } from "zod";
import { PageHero } from "~/common/components/page-hero";
import { ProductCard } from "../components/product-cards";
import { Button } from "~/common/components/ui/button";
import ProductPagination from "~/common/components/product-pagination";

const paramsSchema = z.object({
  year: z.coerce.number(),
  month: z.coerce.number(),
  day: z.coerce.number(),
});

export function loader({ params }: Route.LoaderArgs) {
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
  return {
    ...parsedData
  };
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
          {Array.from({ length: 5 }).map((_, index) => (
            <ProductCard
              id={`productId-${index}`}
              name="Product Name"
              description="Product Description"
              commentCount={12}
              viewCount={4}
              voteCount={120} />))}
        </div>
        <ProductPagination
          totalPages={10}
        />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return <div>{error.data.message} / {error.data.error_code}</div>
  }
  return <div> Unknown Error </div>
}
