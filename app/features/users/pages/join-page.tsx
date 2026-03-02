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

import type { Route } from "./+types/join-page";

export function loader() {
  return {};
}

interface JoinErrors {
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const MIN_PASSWORD_LENGTH = 8;

function getFormErrors(formData: FormData): JoinErrors | null {
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const userName = (formData.get("userName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const errors: JoinErrors = {};

  if (!firstName) errors.firstName = "First name is required";
  if (!lastName) errors.lastName = "Last name is required";
  if (!userName) errors.userName = "User name is required";
  if (!email) errors.email = "Email is required";
  else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.email = "Please enter a valid email";
  }
  if (!password) errors.password = "Password is required";
  else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
  else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

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
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        userName: formData.get("userName"),
        email: formData.get("email"),
      },
    };
  }

  // TODO: persist user (e.g. Supabase auth signUp)
  return {
    ok: true,
    message: "Account created successfully.",
  };
}

export function meta({}: Route.MetaFunction) {
  return [
    { title: "Join | wemake" },
    { name: "description", content: "Create your account" },
  ];
}

function isEmpty(value: string | null | undefined): boolean {
  return value == null || String(value).trim() === "";
}

export default function JoinPage({ actionData }: Route.ComponentProps) {
  const errors = (actionData as { errors?: JoinErrors } | undefined)?.errors;
  const actionValues = (actionData as { values?: Record<string, string | null> } | undefined)
    ?.values ?? {};
  const success = (actionData as { ok?: boolean } | undefined)?.ok === true;
  const message = (actionData as { message?: string } | undefined)?.message;

  const [firstName, setFirstName] = useState(actionValues.firstName ?? "");
  const [lastName, setLastName] = useState(actionValues.lastName ?? "");
  const [userName, setUserName] = useState(actionValues.userName ?? "");
  const [email, setEmail] = useState(actionValues.email ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isFormComplete =
    !isEmpty(firstName) &&
    !isEmpty(lastName) &&
    !isEmpty(userName) &&
    !isEmpty(email) &&
    !isEmpty(password) &&
    !isEmpty(confirmPassword) &&
    password === confirmPassword &&
    password.length >= MIN_PASSWORD_LENGTH;

  return (
    <div className="relative min-h-screen space-y-10">
      <div className="absolute right-4 top-4 flex justify-end md:right-8 md:top-6">
        <Button variant="ghost" asChild>
          <Link to="/sign-in">Sign in</Link>
        </Button>
      </div>
      <PageHero
        title="Join"
        description="Create your account to get started."
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
              <CardTitle>Create account</CardTitle>
              <CardDescription>
                Fill in your details. All fields are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post" className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={cn(errors?.firstName && "border-destructive")}
                      autoComplete="given-name"
                    />
                    {errors?.firstName ? (
                      <p className="text-sm text-destructive">{errors.firstName}</p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={cn(errors?.lastName && "border-destructive")}
                      autoComplete="family-name"
                    />
                    {errors?.lastName ? (
                      <p className="text-sm text-destructive">{errors.lastName}</p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userName">User name</Label>
                  <Input
                    id="userName"
                    name="userName"
                    type="text"
                    placeholder="User name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className={cn(errors?.userName && "border-destructive")}
                    autoComplete="username"
                  />
                  {errors?.userName ? (
                    <p className="text-sm text-destructive">{errors.userName}</p>
                  ) : null}
                </div>

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
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(errors?.password && "border-destructive")}
                    autoComplete="new-password"
                  />
                  {errors?.password ? (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={cn(errors?.confirmPassword && "border-destructive")}
                    autoComplete="new-password"
                  />
                  {errors?.confirmPassword ? (
                    <p className="text-sm text-destructive">
                      {errors.confirmPassword}
                    </p>
                  ) : null}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={!isFormComplete}
                    className="w-full"
                  >
                    Create account
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
