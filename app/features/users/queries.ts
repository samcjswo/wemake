import { makeServerClient } from "~/supa-client";

type ServerClient = ReturnType<typeof makeServerClient>["client"];

export const getNotifications = async (profileId: string, serverClient: ServerClient) => {
    const { data, error } = await serverClient
        .from("notifications")
        .select(`
            notification_id,
            type,
            seen_at,
            created_at,
            source:profiles!notifications_source_id_profiles_profile_id_fk(name, avatar)
        `)
        .eq("target_id", profileId)
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
};

export const getHasUnseenNotifications = async (profileId: string, serverClient: ServerClient) => {
    const { count } = await serverClient
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("target_id", profileId)
        .is("seen_at", null);
    return (count ?? 0) > 0;
};

export const markNotificationSeen = async (notificationId: number, serverClient: ServerClient) => {
    await serverClient
        .from("notifications")
        .update({ seen_at: new Date().toISOString() })
        .eq("notification_id", notificationId);
};

export const markAllNotificationsSeen = async (profileId: string, serverClient: ServerClient) => {
    await serverClient
        .from("notifications")
        .update({ seen_at: new Date().toISOString() })
        .eq("target_id", profileId)
        .is("seen_at", null);
};
