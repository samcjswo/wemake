import { formatDistanceToNow } from "date-fns";
import { Form, Link, redirect, useSearchParams } from "react-router";
import { makeServerClient } from "~/supa-client";
import { PageHero } from "~/common/components/page-hero";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Input } from "~/common/components/ui/input";
import ProductPagination from "~/common/components/product-pagination";
import { PostCard } from "~/features/community/components/post-cards";
import type { Tables } from "database.types";
import type { Route } from "./+types/community-page";
import { getPosts, getTopics, getUserUpvotedPostIds, togglePostUpvote } from "../queries";

type CommunityPostListItem = Tables<"community_post_list_view">;

const POSTS_PER_PAGE = 5;

const COMMUNITY_CATEGORIES = [
  "AI tools",
  "Design tools",
  "Dev tools",
  "Productivity tools",
] as const;

const SORT_OPTIONS = ["Newest", "Popular"] as const;
const PERIOD_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
] as const;

function buildSearchParams(
  params: URLSearchParams,
  updates: { sort?: string; period?: string; category?: string | null; page?: number }
): string {
  const next = new URLSearchParams(params);
  if (updates.sort !== undefined) next.set("sort", updates.sort);
  if (updates.period !== undefined) next.set("period", updates.period);
  if (updates.category !== undefined) {
    if (updates.category === null) next.delete("category");
    else next.set("category", updates.category);
  }
  if (updates.page !== undefined) {
    if (updates.page <= 1) next.delete("page");
    else next.set("page", String(updates.page));
  }
  const q = next.toString();
  return q ? `?${q}` : "";
}

function formatTimeAgo(createdAt: string): string {
  try {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  } catch {
    return "";
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page");
  const rawPage = pageParam === null ? 1 : Number(pageParam);
  const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const { client } = makeServerClient(request);
  const { data: { user } } = await client.auth.getUser();

  const [topics, { posts: rawPosts, totalCount }] = await Promise.all([
    getTopics(),
    getPosts({ page, limit: POSTS_PER_PAGE }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / POSTS_PER_PAGE));
  const clampedPage = Math.min(page, totalPages);

  const postsToMap =
    clampedPage !== page && totalCount > 0
      ? (await getPosts({ page: clampedPage, limit: POSTS_PER_PAGE })).posts
      : rawPosts ?? [];

  const postIds = (postsToMap as CommunityPostListItem[])
    .map((p) => p.post_id)
    .filter((id): id is number => id !== null);

  const upvotedPostIds = user
    ? await getUserUpvotedPostIds(user.id, postIds, client)
    : [];

  const posts = (postsToMap as CommunityPostListItem[]).map((p) => {
    const authorName = p.author_name ?? p.author_username ?? "Anonymous";
    const category = p.topic_name ?? "General";
    return {
      postId: String(p.post_id),
      title: p.title,
      authorName,
      category,
      timeAgo: formatTimeAgo(p.createdAt ?? ""),
      avatarFallback: authorName.slice(0, 1).toUpperCase(),
      avatarSrc: p.author_avatar ?? undefined,
      upvoteCount: p.upvote_count ?? 0,
      isUpvoted: upvotedPostIds.includes(p.post_id as number),
    };
  });

  return { page: clampedPage, totalPages, topics, posts, isLoggedIn: !!user };
}

export async function action({ request }: Route.ActionArgs) {
  const { client, headers } = makeServerClient(request);
  const { data: { user } } = await client.auth.getUser();

  if (!user) {
    return redirect("/sign-in", { headers });
  }

  const formData = await request.formData();
  const postId = Number(formData.get("postId"));

  await togglePostUpvote(postId, user.id, client);
  return null;
}

export function meta(
  _args: Parameters<Route.MetaFunction>[0]
): ReturnType<Route.MetaFunction> {
  return [
    { title: "Community | wemake" },
    { name: "description", content: "Discuss and share with the community." },
  ];
}

export default function CommunityPage({ loaderData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const { page, totalPages, posts: postsForPage, isLoggedIn } = loaderData;
  const activeCategory = searchParams.get("category") ?? null;
  const activeSort = (searchParams.get("sort") ?? "newest").toLowerCase();
  const activePeriod = (searchParams.get("period") ?? "all").toLowerCase();
  const searchQuery = searchParams.get("q") ?? "";

  return (
    <div className="space-y-10">
      <PageHero
        title="Community"
        description="Discuss and share with the community."
      />
      <div className="px-20 flex gap-8">
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 rounded-md border bg-muted/30 p-0.5">
              <span className="px-2 py-1 text-xs font-medium text-muted-foreground">Sort</span>
              {SORT_OPTIONS.map((label) => {
                const value = label.toLowerCase();
                const isActive = activeSort === value;
                return (
                  <Link
                    key={label}
                    to={`/community${buildSearchParams(searchParams, { sort: value })}`}
                    className={`rounded px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "bg-background font-medium shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
            {activeSort !== "newest" && (
              <div className="flex items-center gap-1 rounded-md border bg-muted/30 p-0.5">
                <span className="px-2 py-1 text-xs font-medium text-muted-foreground">Period</span>
                {PERIOD_OPTIONS.map(({ value, label }) => {
                  const isActive = activePeriod === value;
                  return (
                    <Link
                      key={value}
                      to={`/community${buildSearchParams(searchParams, { period: value })}`}
                      className={`rounded px-3 py-1.5 text-sm transition-colors ${
                        isActive
                          ? "bg-background font-medium shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Form method="get" action="/community" className="flex-1 min-w-[200px] flex gap-2">
              {activeCategory && (
                <input type="hidden" name="category" value={activeCategory} />
              )}
              <input type="hidden" name="sort" value={activeSort} />
              {activeSort !== "newest" && (
                <input type="hidden" name="period" value={activePeriod} />
              )}
              <Input
                type="search"
                name="q"
                placeholder="Search posts..."
                defaultValue={searchQuery}
                className="max-w-md"
                aria-label="Search posts"
              />
              <Button type="submit" variant="secondary" size="sm">
                Search
              </Button>
            </Form>
            <Button asChild>
              <Link to="/community/new">New post</Link>
            </Button>
          </div>
          <div className="grid gap-4">
            {postsForPage.map((post) => (
              <PostCard
                key={post.postId}
                postId={post.postId}
                title={post.title ?? ""}
                authorName={post.authorName}
                category={post.category}
                timeAgo={post.timeAgo}
                footerVariant="upvote"
                upvoteCount={post.upvoteCount}
                avatarFallback={post.avatarFallback}
                avatarSrc={post.avatarSrc}
                isUpvoted={post.isUpvoted}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
          <ProductPagination totalPages={totalPages} />
        </div>
        <aside className="w-56 shrink-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <Link
                to={`/community${buildSearchParams(searchParams, { category: null })}`}
                className={`rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted ${
                  activeCategory === null ? "bg-muted font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </Link>
              {COMMUNITY_CATEGORIES.map((category) => {
                const slug = category.toLowerCase().replace(/\s+/g, "-");
                const isActive = activeCategory === slug;
                return (
                  <Link
                    key={category}
                    to={`/community${buildSearchParams(searchParams, { category: slug })}`}
                    className={`rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted ${
                      isActive ? "bg-muted font-medium" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {category}
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
