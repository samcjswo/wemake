import { formatDistanceToNow } from "date-fns";
import { BellIcon, CheckCheckIcon } from "lucide-react";
import { Form, Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";
import { Button } from "~/common/components/ui/button";
import { PageHero } from "~/common/components/page-hero";
import { makeServerClient } from "~/supa-client";
import { requireAuth } from "~/lib/auth.server";
import { getNotifications, markAllNotificationsSeen, markNotificationSeen } from "../queries";
import type { Route } from "./+types/notifications-page";

function formatTimeAgo(date: string) {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return "";
  }
}

function getNotificationMessage(type: string, sourceName: string) {
  switch (type) {
    case "upvote": return `${sourceName} upvoted your product`;
    case "reply": return `${sourceName} replied to your post`;
    case "follow": return `${sourceName} started following you`;
    default: return `${sourceName} interacted with you`;
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const { user, headers } = await requireAuth(request);
  const { client } = makeServerClient(request);

  const notifications = await getNotifications(user.id, client);

  return {
    headers,
    notifications: notifications.map((n) => {
      const source = n.source as { name: string; avatar: string | null } | null;
      const sourceName = source?.name ?? "Someone";
      return {
        notificationId: n.notification_id,
        type: n.type,
        message: getNotificationMessage(n.type, sourceName),
        timeAgo: formatTimeAgo(n.created_at),
        seen: n.seen_at !== null,
        avatarFallback: sourceName.slice(0, 1).toUpperCase(),
        avatarSrc: source?.avatar ?? undefined,
      };
    }),
  };
}

export async function action({ request }: Route.ActionArgs) {
  const { user } = await requireAuth(request);
  const { client } = makeServerClient(request);

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "mark-all-seen") {
    await markAllNotificationsSeen(user.id, client);
  } else if (intent === "mark-seen") {
    const notificationId = Number(formData.get("notificationId"));
    await markNotificationSeen(notificationId, client);
  }

  return null;
}

export function meta(): ReturnType<Route.MetaFunction> {
  return [
    { title: "Notifications | wemake" },
    { name: "description", content: "Your notifications" },
  ];
}

export default function NotificationsPage({ loaderData }: Route.ComponentProps) {
  const { notifications } = loaderData;
  const unseenCount = notifications.filter((n) => !n.seen).length;

  return (
    <div className="space-y-10">
      <PageHero
        title="Notifications"
        description="Stay up to date with your activity."
      />
      <div className="w-full max-w-2xl mx-auto space-y-4">
        {unseenCount > 0 && (
          <div className="flex justify-end">
            <Form method="post">
              <input type="hidden" name="intent" value="mark-all-seen" />
              <Button type="submit" variant="outline" size="sm" className="gap-2">
                <CheckCheckIcon className="size-4" />
                Mark all as seen
              </Button>
            </Form>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
            <BellIcon className="size-12 opacity-30" />
            <p>No notifications yet.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {notifications.map((n) => (
              <li
                key={n.notificationId}
                className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                  n.seen ? "bg-background" : "bg-primary/5 border-primary/20"
                }`}
              >
                <Avatar className="size-10 shrink-0">
                  <AvatarFallback>{n.avatarFallback}</AvatarFallback>
                  <AvatarImage src={n.avatarSrc} />
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${n.seen ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.timeAgo}</p>
                </div>
                {!n.seen && (
                  <Form method="post" className="shrink-0">
                    <input type="hidden" name="intent" value="mark-seen" />
                    <input type="hidden" name="notificationId" value={n.notificationId} />
                    <Button type="submit" variant="ghost" size="sm">
                      Mark seen
                    </Button>
                  </Form>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
