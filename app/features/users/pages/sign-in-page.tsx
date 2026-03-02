import { useState } from "react";
import { Form, Link } from "react-router";
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
  const errors = getFormErrors(formData);

  if (errors) {
    return {
      ok: false,
      errors,
      values: {
        email: formData.get("email"),
      },
    };
  }

  // TODO: authenticate user (e.g. Supabase auth signInWithPassword)
  return {
    ok: true,
    message: "Signed in successfully.",
  };
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
