import { createClient } from "@supabase/supabase-js";
import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import type { Database } from "database.types";

// Browser / anon client — used for public data queries
const client = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export default client;

// Per-request server client — use in loaders and actions
// Returns the client and a headers object that carries Set-Cookie back to the browser
export function makeServerClient(request: Request) {
  const headers = new Headers();

  const serverClient = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("cookie") ?? "")
            .map(({ name, value }) => ({ name, value: value ?? "" }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options),
            );
          });
        },
      },
    },
  );

  return { client: serverClient, headers };
}
