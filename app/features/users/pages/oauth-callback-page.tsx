import { redirect } from "react-router";
import { makeServerClient } from "~/supa-client";
import type { Route } from "./+types/oauth-callback-page";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return redirect("/sign-in");
  }

  const { client, headers } = makeServerClient(request);
  const { error } = await client.auth.exchangeCodeForSession(code);

  if (error) {
    return redirect("/sign-in");
  }

  return redirect("/", { headers });
}
