import { ChevronUpIcon } from "lucide-react";
import { Form, Link } from "react-router";
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
import type { Route } from "./+types/post-detail-page";

type AuthorProfile = {
  name: string;
  username?: string;
  avatarFallback: string;
  avatarSrc?: string;
  /** When the user joined (e.g. "Jan 2024" or "March 2023"). */
  joinedAt: string;
  /** Number of products they have launched. */
  productsLaunched: number;
};

type PostData = {
  title: string;
  authorName: string;
  category: string;
  timeAgo: string;
  avatarFallback: string;
  avatarSrc?: string;
  upvoteCount: number;
  content: string;
  author?: AuthorProfile;
};

type PostReply = {
  replyId: string;
  parentReplyId?: string;
  authorName: string;
  avatarFallback: string;
  avatarSrc?: string;
  timeAgo: string;
  content: string;
};

/** Mock replies; replace with getRepliesByPostId(postId) from queries. */
function getRepliesByPostId(postId: string): PostReply[] {
  const replies: PostReply[] = [
    {
      replyId: "1",
      authorName: "Alex",
      avatarFallback: "A",
      timeAgo: "2 hours ago",
      content: "Great post! Looking forward to more discussions here.",
    },
    {
      replyId: "1-1",
      parentReplyId: "1",
      authorName: "Jordan",
      avatarFallback: "J",
      timeAgo: "1 hour ago",
      content: "Same here, Alex. Glad this thread exists.",
    },
    {
      replyId: "2",
      authorName: "Jordan",
      avatarFallback: "J",
      timeAgo: "1 hour ago",
      content: "I had the same question. Thanks for starting this thread.",
    },
  ];
  if (postId === "1") {
    return replies;
  }
  return replies.slice(0, 1);
}

/** Mock post data; replace with getPost(postId) from queries. */
function getPostById(postId: string): PostData | null {
  const author: AuthorProfile = {
    name: "wemake",
    username: "wemake",
    avatarFallback: "W",
    joinedAt: "Jan 2024",
    productsLaunched: 12,
  };
  const posts: Record<string, PostData> = {
    "1": {
      title: "Welcome to the community",
      authorName: "wemake",
      category: "Announcements",
      timeAgo: "1 day ago",
      avatarFallback: "W",
      upvoteCount: 3,
      content: "Welcome! This is a place to share ideas, ask questions, and connect with others. Feel free to start a new post or join the conversation.",
      author,
    },
  };
  for (let i = 2; i <= 12; i++) {
    posts[String(i)] = {
      title: `Community post ${i}`,
      authorName: "wemake",
      category: "Announcements",
      timeAgo: `${i} days ago`,
      avatarFallback: "W",
      upvoteCount: i * 3,
      content: `This is the full content for community post ${i}. Replace this with real content from your database when you wire up the loader to fetch the post by ID.`,
      author,
    };
  }
  return posts[postId] ?? null;
}

export function loader({ params }: Route.LoaderArgs) {
  const post = getPostById(params.postId);
  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }
  const replies = getRepliesByPostId(params.postId);
  return { post, replies };
}

export async function action({ request, params }: Route.ActionArgs) {
  if (request.method !== "POST") return null;
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "reply") {
    const content = (formData.get("reply") as string | null)?.trim() ?? "";
    if (!content) {
      return { error: "Reply cannot be empty.", newReply: null };
    }
    const parentReplyId = (formData.get("parentReplyId") as string | null) || undefined;
    // TODO: get current user from session; insert into community_post_replies via Supabase
    const newReply: PostReply = {
      replyId: `new-${Date.now()}`,
      parentReplyId: parentReplyId || undefined,
      authorName: "You",
      avatarFallback: "Y",
      timeAgo: "Just now",
      content,
    };
    return { newReply, error: null };
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

function ReplyItem({
  reply,
  allReplies,
}: {
  reply: PostReply;
  allReplies: PostReply[];
}) {
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
      <div className="ml-14">
        <Form method="post" className="space-y-2">
          <input type="hidden" name="intent" value="reply" />
          <input type="hidden" name="parentReplyId" value={reply.replyId} />
          <div className="space-y-2">
            <Textarea
              name="reply"
              placeholder={`Reply to ${reply.authorName}...`}
              rows={2}
              className="w-full resize-y text-sm"
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm">
                Reply
              </Button>
            </div>
          </div>
        </Form>
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
  const data = loaderData as { post: PostData; replies: PostReply[] } | undefined;
  const post = data?.post;
  const loaderReplies = data?.replies ?? [];
  const actionReply = (actionData as { newReply?: PostReply } | undefined)?.newReply;
  const replies = actionReply
    ? [...loaderReplies, actionReply]
    : loaderReplies;
  if (!post) return null;
  const {
    title,
    authorName,
    category,
    timeAgo,
    avatarFallback,
    avatarSrc,
    upvoteCount,
    content,
    author,
  } = post;

  const profile = author ?? {
    name: authorName,
    avatarFallback,
    avatarSrc,
    joinedAt: "—",
    productsLaunched: 0,
  };

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
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <article className="space-y-6">
            <header className="flex flex-row items-start gap-4">
              <Avatar className="size-14 shrink-0">
                <AvatarFallback>{avatarFallback}</AvatarFallback>
                <AvatarImage src={avatarSrc} />
              </Avatar>
              <div className="min-w-0 flex-1 space-y-2">
                <h1 className="text-2xl font-semibold">{title}</h1>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span>{authorName}</span>
                  <span>·</span>
                  <span>{category}</span>
                  <span>·</span>
                  <span>{timeAgo}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  // TODO: submit upvote
                }}
              >
                <ChevronUpIcon className="size-4" />
                <span>{upvoteCount}</span>
              </Button>
            </header>
            <div className="whitespace-pre-wrap text-foreground">{content}</div>
          </article>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Reply</h2>
            <Form method="post" className="space-y-3">
              <input type="hidden" name="intent" value="reply" />
              <div className="space-y-2">
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
              </div>
              {(actionData as { error?: string } | undefined)?.error && (
                <p className="text-sm text-destructive">
                  {(actionData as { error?: string } | undefined)?.error}
                </p>
              )}
            </Form>
          </section>

          {replies.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-lg font-medium">
                Replies ({replies.length})
              </h2>
              <ul className="space-y-6 list-none pl-0">
                {replies
                  .filter((r) => !r.parentReplyId)
                  .map((reply) => (
                    <ReplyItem
                      key={reply.replyId}
                      reply={reply}
                      allReplies={replies}
                    />
                  ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="w-64 shrink-0">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="mx-auto size-20">
                <AvatarFallback>{profile.avatarFallback}</AvatarFallback>
                <AvatarImage src={profile.avatarSrc} />
              </Avatar>
              <CardTitle className="text-lg">{profile.name}</CardTitle>
              {"username" in profile && profile.username && (
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <p className="text-sm text-muted-foreground">
                Joined {profile.joinedAt}
              </p>
              <p className="text-sm text-muted-foreground">
                {profile.productsLaunched} {profile.productsLaunched === 1 ? "product" : "products"} launched
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  // TODO: submit follow
                }}
              >
                Follow
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
