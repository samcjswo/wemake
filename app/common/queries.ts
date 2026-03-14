import client from "~/supa-client";

export async function getHomeProducts() {
  const { data, error } = await client
    .from("products")
    .select("id, name, tagline, stats")
    .order("createdAt", { ascending: false })
    .limit(11);
  if (error) throw error;
  return data ?? [];
}

export async function getHomePosts() {
  const { data, error } = await client
    .from("community_post_list_view")
    .select("post_id, title, topic_name, author_name, author_avatar, createdAt")
    .order("createdAt", { ascending: false })
    .limit(11);
  if (error) throw error;
  return data ?? [];
}

export async function getHomeIdeas() {
  const { data, error } = await client
    .from("ideas")
    .select("id, title, view_count, like_count, created_at, claimed_at")
    .order("created_at", { ascending: false })
    .limit(11);
  if (error) throw error;
  return data ?? [];
}

export async function getHomeJobs() {
  const { data, error } = await client
    .from("jobs")
    .select("id, company_name, company_logo_url, created_at, title, job_type, position_location, salary_range, location")
    .order("created_at", { ascending: false })
    .limit(5);
  if (error) throw error;
  return data ?? [];
}

export async function getHomeTeams() {
  const { data, error } = await client
    .from("teams")
    .select("team_id, product_name, roles, product_description")
    .order("created_at", { ascending: false })
    .limit(5);
  if (error) throw error;
  return data ?? [];
}
