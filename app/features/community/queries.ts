
import client from "~/supa-client";

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

export const getPostReplies = async () => {
    await client.from("community_post_replies").select("reply, createdAt, updatedAt, profile_id");
};

export const getPostUpvotes = async () => {
    await client.from("community_post_upvotes").select("createdAt, updatedAt, profile_id");
};
