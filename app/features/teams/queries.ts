import client from "~/supa-client";

const TEAMS_PER_PAGE = 9;

export async function getTeams(page: number) {
  const from = (page - 1) * TEAMS_PER_PAGE;
  const to = from + TEAMS_PER_PAGE - 1;
  const { data, error, count } = await client
    .from("teams")
    .select("team_id, product_name, roles, product_description", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw error;
  return { teams: data ?? [], total: count ?? 0, perPage: TEAMS_PER_PAGE };
}

export async function getTeamById(teamId: number) {
  const { data, error } = await client
    .from("teams")
    .select("*")
    .eq("team_id", teamId)
    .single();
  if (error) throw error;
  return data;
}
