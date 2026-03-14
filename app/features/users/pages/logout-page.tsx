import { redirect } from "react-router";
import type { Route } from "./+types/logout-page";
import { makeServerClient } from "~/supa-client";

export async function loader({ request }: Route.LoaderArgs) {
  const { client, headers } = makeServerClient(request);
  await client.auth.signOut();
  return redirect("/", { headers });
}
