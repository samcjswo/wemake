import client from "~/supa-client";

export async function getJobs() {
  const { data, error } = await client
    .from("jobs")
    .select("id, company_name, company_logo_url, created_at, title, job_type, position_location, salary_range, location")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getJobById(jobId: number) {
  const { data, error } = await client
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error) throw error;
  return data;
}
