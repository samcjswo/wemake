import client from "~/supa-client";

export async function getProductById(productId: number) {
  const { data, error } = await client
    .from("products")
    .select("id, name, tagline, description, how_it_works, icon, url, stats")
    .eq("id", productId)
    .single();
  if (error) throw error;
  return data;
}

export async function getProductReviews(productId: number) {
  const { data, error } = await client
    .from("reviews")
    .select("review_id, rating, createdAt, profiles(name, avatar)")
    .eq("product_id", productId)
    .order("createdAt", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function searchProducts(query: string) {
  if (!query.trim()) return [];
  const { data, error } = await client
    .from("products")
    .select("id, name, tagline")
    .or(`name.ilike.%${query}%,tagline.ilike.%${query}%`)
    .limit(10);
  if (error) throw error;
  return data ?? [];
}
