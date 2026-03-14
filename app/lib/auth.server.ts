import { redirect } from "react-router";
import { makeServerClient } from "~/supa-client";

export async function requireAuth(request: Request) {
  const { client, headers } = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    throw redirect("/sign-in", { headers });
  }

  return { user, headers };
}
