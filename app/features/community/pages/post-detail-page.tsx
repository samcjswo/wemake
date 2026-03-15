import { ChevronUpIcon } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Link, redirect, useFetcher } from "react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/common/components/ui/breadcrumb";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Textarea } from "~/common/components/ui/textarea";
import { makeServerClient } from "~/supa-client";
import type { Route } from "./+types/post-detail-page";
import {
  getPostById,
  getPostReplies,
  getPostUpvoteCount,
  getUserUpvotedPostIds,
  togglePostUpvote,
} from "../queries";

function formatTimeAgo(date: string) {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return "";
  }
}

function formatJoinedAt(date: string) {
  try {
    return format(new Date(date), "MMM yyyy");
  } catch {
    return "";
  }
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const postId = Number(params.postId);
  if (Number.isNaN(postId)) throw new Response("Not found", { status: 404 });

  const { client } = makeServerClient(request);
  const { data: { user } } = await client.auth.getUser();

  const [post, replies, upvoteCount] = await Promise.all([
    getPostById(postId),
    getPostReplies(postId),
    getPostUpvoteCount(postId),
  ]);

  const isUpvoted = user
    ? (await getUserUpvotedPostIds(user.id, [postId], client)).includes(postId)
    : false;

  const author = post.profiles as { name: string; username: string; avatar: string | null; createdAt: string } | null;
  const topic = post.community_topics as { name: string } | null;

  return {
    isLoggedIn: !!user,
    isUpvoted,
    post: {
      postId: String(post.post_id),
      title: post.title,
      content: post.content,
      authorName: author?.name ?? "Anonymous",
      authorUsername: author?.username ?? "",
      avatarFallback: (author?.name ?? "A").slice(0, 1).toUpperCase(),
      avatarSrc: author?.avatar ?? undefined,
      category: topic?.name ?? "General",
      timeAgo: formatTimeAgo(post.createdAt),
      upvoteCount,
      joinedAt: author?.createdAt ? formatJoinedAt(author.createdAt) : "—",
    },
    replies: replies.map((r) => {
      const rAuthor = r.profiles as { name: string; avatar: string | null } | null;
      const name = rAuthor?.name ?? "Anonymous";
      return {
        replyId: String(r.post_reply_id),
        parentReplyId: r.parent_reply_id ? String(r.parent_reply_id) : undefined,
        authorName: name,
        avatarFallback: name.slice(0, 1).toUpperCase(),
        avatarSrc: rAuthor?.avatar ?? undefined,
        timeAgo: formatTimeAgo(r.createdAt),
        content: r.reply,
      };
    }),
  };
}

export async function action({ request, params }: Route.ActionArgs) {
  if (request.method !== "POST") return null;

  const { client, headers } = makeServerClient(request);
  const { data: { user } } = await client.auth.getUser();

  if (!user) return redirect("/sign-in", { headers });

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "upvote") {
    const postId = Number(params.postId);
    await togglePostUpvote(postId, user.id, client);
    return null;
  }

  if (intent === "reply") {
    const content = (formData.get("reply") as string | null)?.trim() ?? "";
    if (!content) return { error: "Reply cannot be empty." };
    // TODO: insert reply into community_post_replies
    return null;
  }

  return null;
}

export function meta(
  args: Parameters<Route.MetaFunction>[0]
): ReturnType<Route.MetaFunction> {
  const data = (args as { data?: { post: { title: string } } }).data;
  const title = data?.post?.title;
  return [
    { title: title ? `${title} | Community | wemake` : "Post | Community | wemake" },
    { name: "description", content: "View community post." },
  ];
}

type Reply = {
  replyId: string;
  parentReplyId?: string;
  authorName: string;
  avatarFallback: string;
  avatarSrc?: string;
  timeAgo: string;
  content: string;
};

function ReplyItem({ reply, allReplies }: { reply: Reply; allReplies: Reply[] }) {
  const children = allReplies.filter((r) => r.parentReplyId === reply.replyId);
  return (
    <li className="space-y-3">
      <div className="flex gap-4">
        <Avatar className="size-10 shrink-0">
          <AvatarFallback>{reply.avatarFallback}</AvatarFallback>
          <AvatarImage src={reply.avatarSrc} />
        </Avatar>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{reply.authorName}</span>
            <span>·</span>
            <span>{reply.timeAgo}</span>
          </div>
          <p className="whitespace-pre-wrap text-foreground">{reply.content}</p>
        </div>
      </div>
      {children.length > 0 && (
        <ul className="ml-14 list-none space-y-6 border-l-2 border-muted pl-4">
          {children.map((child) => (
            <ReplyItem key={child.replyId} reply={child} allReplies={allReplies} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function PostDetailPage({ loaderData, actionData }: Route.ComponentProps) {
  const { post, replies, isLoggedIn, isUpvoted } = loaderData;
  const fetcher = useFetcher();

  const optimisticUpvoted =
    fetcher.state !== "idle"
      ? fetcher.formData?.get("intent") === "upvote"
        ? !isUpvoted
        : isUpvoted
      : isUpvoted;

  const optimisticCount =
    fetcher.state !== "idle"
      ? optimisticUpvoted ? post.upvoteCount + 1 : post.upvoteCount - 1
      : post.upvoteCount;

  return (
    <div className="px-20 py-8">
      <div className="flex gap-32">
        <div className="min-w-0 flex-1 space-y-10">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/community">Community</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{post.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <article className="space-y-6">
            <header className="flex flex-row items-start gap-4">
              <Avatar className="size-14 shrink-0">
                <AvatarFallback>{post.avatarFallback}</AvatarFallback>
                <AvatarImage src={post.avatarSrc} />
              </Avatar>
              <div className="min-w-0 flex-1 space-y-2">
                <h1 className="text-2xl font-semibold">{post.title}</h1>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span>{post.authorName}</span>
                  <span>·</span>
                  <span>{post.category}</span>
                  <span>·</span>
                  <span>{post.timeAgo}</span>
                </div>
              </div>
              {isLoggedIn ? (
                <fetcher.Form method="post">
                  <input type="hidden" name="intent" value="upvote" />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className={`shrink-0 gap-1.5 ${
                      optimisticUpvoted
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ChevronUpIcon className="size-4" />
                    <span>{optimisticCount}</span>
                  </Button>
                </fetcher.Form>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground"
                  asChild
                >
                  <Link to="/sign-in">
                    <ChevronUpIcon className="size-4" />
                    <span>{post.upvoteCount}</span>
                  </Link>
                </Button>
              )}
            </header>
            <div className="whitespace-pre-wrap text-foreground">{post.content}</div>
          </article>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Reply</h2>
            <fetcher.Form method="post" className="space-y-3">
              <input type="hidden" name="intent" value="reply" />
              <Textarea
                name="reply"
                placeholder="Write your reply..."
                rows={4}
                className="w-full resize-y"
                required
              />
              <div className="flex justify-end">
                <Button type="submit">Post reply</Button>
              </div>
              {(actionData as { error?: string } | undefined)?.error && (
                <p className="text-sm text-destructive">
                  {(actionData as { error?: string } | undefined)?.error}
                </p>
              )}
            </fetcher.Form>
          </section>

          {replies.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-lg font-medium">Replies ({replies.length})</h2>
              <ul className="space-y-6 list-none pl-0">
                {replies
                  .filter((r) => !r.parentReplyId)
                  .map((reply) => (
                    <ReplyItem key={reply.replyId} reply={reply} allReplies={replies} />
                  ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="w-64 shrink-0">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="mx-auto size-20">
                <AvatarFallback>{post.avatarFallback}</AvatarFallback>
                <AvatarImage src={post.avatarSrc} />
              </Avatar>
              <CardTitle className="text-lg">{post.authorName}</CardTitle>
              {post.authorUsername && (
                <p className="text-sm text-muted-foreground">@{post.authorUsername}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <p className="text-sm text-muted-foreground">
                Joined {post.joinedAt}
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Follow
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
