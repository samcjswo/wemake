
import client from "~/supa-client";

export const getTopics = async () => {
    const { data, error } = await client.from("community_topics").select("name, slug");
    if (error) throw new Error(error.message);
    return data;
};

export const getPosts = async () => {
    const { data, error } = await client.from("community_posts").select(`
        post_id,
        title,
        createdAt,
        topics (
            name
        ),
        profiles (
            name,
            username,
            avatar
        )
    `);
    if (error) throw new Error(error.message);
    return data;
};

export const getPostReplies = async () => {
    await client.from("community_post_replies").select("reply, createdAt, updatedAt, profile_id");
};

export const getPostUpvotes = async () => {
    await client.from("community_post_upvotes").select("createdAt, updatedAt, profile_id");
};
