import { useState } from "react";
import { Form, Link, redirect } from "react-router";
import { makeServerClient } from "~/supa-client";
import { PageHero } from "~/common/components/page-hero";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { cn } from "~/lib/utils";

import type { Route } from "./+types/sign-in-page";

export function loader() {
  return {};
}

interface SignInErrors {
  email?: string;
  password?: string;
}

function getFormErrors(formData: FormData): SignInErrors | null {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  const errors: SignInErrors = {};

  if (!email) errors.email = "Email is required";
  else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.email = "Please enter a valid email";
  }
  if (!password) errors.password = "Password is required";

  if (Object.keys(errors).length === 0) return null;
  return errors;
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") return null;

  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  // Google OAuth
  if (intent === "google") {
    const { client, headers } = makeServerClient(request);
    const callbackUrl = new URL("/auth/callback", new URL(request.url).origin).toString();
    const { data, error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl },
    });
    if (error || !data.url) {
      return { ok: false, errors: { email: "Google sign-in failed. Try again." }, values: {} };
    }
    return redirect(data.url, { headers });
  }

  // Email/password
  const errors = getFormErrors(formData);
  const email = formData.get("email") as string;

  if (errors) {
    return { ok: false, errors, values: { email } };
  }

  const { client, headers } = makeServerClient(request);
  const { error } = await client.auth.signInWithPassword({
    email,
    password: formData.get("password") as string,
  });

  if (error) {
    return { ok: false, errors: { email: error.message }, values: { email } };
  }

  return redirect("/", { headers });
}

export function meta({}: Route.MetaFunction) {
  return [
    { title: "Sign in | wemake" },
    { name: "description", content: "Sign in to your account" },
  ];
}

function isEmpty(value: string | null | undefined): boolean {
  return value == null || String(value).trim() === "";
}

export default function SignInPage({ actionData }: Route.ComponentProps) {
  const errors = (actionData as { errors?: SignInErrors } | undefined)?.errors;
  const actionValues = (actionData as { values?: Record<string, string | null> } | undefined)
    ?.values ?? {};
  const success = (actionData as { ok?: boolean } | undefined)?.ok === true;
  const message = (actionData as { message?: string } | undefined)?.message;

  const [email, setEmail] = useState(actionValues.email ?? "");
  const [password, setPassword] = useState("");

  const isFormComplete = !isEmpty(email) && !isEmpty(password);

  return (
    <div className="relative min-h-screen space-y-10">
      <div className="absolute right-4 top-4 flex justify-end md:right-8 md:top-6">
        <Button variant="ghost" asChild>
          <Link to="/join">Join</Link>
        </Button>
      </div>
      <PageHero
        title="Sign in"
        description="Sign in to your account to continue."
      />
      <div className="w-full max-w-xl mx-auto px-4">
        {success && message ? (
          <Card className="border-green-500/50 bg-green-500/5">
            <CardContent className="pt-6">
              <p className="text-green-700 dark:text-green-400 font-medium">
                {message}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>
                Enter your email and password to sign in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post">
                <input type="hidden" name="intent" value="google" />
                <Button type="submit" variant="outline" className="w-full gap-2">
                  <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </Button>
              </Form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Form method="post" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(errors?.email && "border-destructive")}
                    autoComplete="email"
                  />
                  {errors?.email ? (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(errors?.password && "border-destructive")}
                    autoComplete="current-password"
                  />
                  {errors?.password ? (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  ) : null}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={!isFormComplete}
                    className="w-full"
                  >
                    Sign in
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
