
import client, { makeServerClient } from "~/supa-client";

type ServerClient = ReturnType<typeof makeServerClient>["client"];

export const getTopics = async () => {
    const { data, error } = await client.from("community_topics").select("name, slug");
    if (error) throw new Error(error.message);
    return data;
};

export interface GetPostsOptions {
    page?: number;
    limit?: number;
}

export const getPosts = async (options?: GetPostsOptions) => {
    const { page = 1, limit = 10 } = options ?? {};
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await client
        .from("community_post_list_view")
        .select(`*`);

    if (error) throw new Error(error.message);
    return { posts: data ?? [], totalCount: count ?? 0 };
};

export const getUserUpvotedPostIds = async (
    profileId: string,
    postIds: number[],
    serverClient: ServerClient
) => {
    if (postIds.length === 0) return [];
    const { data } = await serverClient
        .from("community_post_upvotes")
        .select("post_id")
        .eq("profile_id", profileId)
        .in("post_id", postIds);
    return (data ?? []).map((r) => r.post_id);
};

export const getPostById = async (postId: number) => {
    const { data, error } = await client
        .from("community_posts")
        .select(`
            post_id, title, content, createdAt,
            community_topics!community_posts_topic_id_community_topics_topic_id_fk(name),
            profiles!community_posts_profile_id_profiles_profile_id_fk(name, username, avatar, createdAt)
        `)
        .eq("post_id", postId)
        .single();
    if (error) throw new Error(error.message);
    return data;
};

export const getPostUpvoteCount = async (postId: number) => {
    const { count } = await client
        .from("community_post_upvotes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);
    return count ?? 0;
};

export const getPostReplies = async (postId: number) => {
    const { data, error } = await client
        .from("community_post_replies")
        .select(`
            post_reply_id, reply, createdAt, parent_reply_id,
            profiles!community_post_replies_profile_id_profiles_profile_id_fk(name, username, avatar)
        `)
        .eq("post_id", postId)
        .order("createdAt", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
};

export const togglePostUpvote = async (
    postId: number,
    profileId: string,
    serverClient: ServerClient
) => {
    const { data: existing } = await serverClient
        .from("community_post_upvotes")
        .select("post_id")
        .eq("post_id", postId)
        .eq("profile_id", profileId)
        .maybeSingle();

    if (existing) {
        await serverClient
            .from("community_post_upvotes")
            .delete()
            .eq("post_id", postId)
            .eq("profile_id", profileId);
    } else {
        await serverClient
            .from("community_post_upvotes")
            .insert({ post_id: postId, profile_id: profileId });
    }
};
