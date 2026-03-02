import { IdeaCard } from "~/features/ideas/components/idea-cards";
import { PageHero } from "~/common/components/page-hero";
import ProductPagination from "~/common/components/product-pagination";
import type { Route } from "./+types/ideas-page";

const IDEAS_PER_PAGE = 9;
const TOTAL_IDEAS = 27; // mock total for pagination

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page");
  const rawPage = pageParam === null ? 1 : Number(pageParam);
  const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const totalPages = Math.ceil(TOTAL_IDEAS / IDEAS_PER_PAGE);
  const clampedPage = Math.min(page, Math.max(1, totalPages));

  return { page: clampedPage, totalPages };
}

export function action(_args: Route.ActionArgs) {
  return null;
}

export function meta(
  _args: Parameters<Route.MetaFunction>[0]
): ReturnType<Route.MetaFunction> {
  return [
    { title: "IdeasGPT | wemake" },
    { name: "description", content: "Find ideas for your next project." },
  ];
}

export default function IdeasPage({ loaderData }: Route.ComponentProps) {
  const { page, totalPages } = loaderData;
  const startIndex = (page - 1) * IDEAS_PER_PAGE;
  const endIndex = startIndex + IDEAS_PER_PAGE;

  const ideaCards = Array.from({ length: TOTAL_IDEAS }, (_, index) => (
    <IdeaCard
      key={`ideaId-${index}`}
      ideaId={`ideaId-${index}`}
      title="A startup that creates an AI-powered generated personal trainers, delivering customized fitness recommendations and tracking of progess using a mobile app to track workouts and progress as well as a website to track progress and goals."
      viewCount={index * 2}
      timeAgo="12 hours ago"
      likeCount={index * 10}
      claimed={index % 2 === 0}
    />
  )).slice(startIndex, endIndex);

  return (
    <div className="space-y-10">
      <PageHero
        title="IdeasGPT"
        description="Find ideas for your next project."
      />
      <div className="px-20">
        <div className="grid grid-cols-3 gap-4">
          {ideaCards}
        </div>
        <ProductPagination totalPages={totalPages} />
      </div>
    </div>
  );
}
