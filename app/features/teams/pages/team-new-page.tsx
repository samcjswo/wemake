import { useEffect, useState } from "react";
import { Form, Link } from "react-router";
import { requireAuth } from "~/lib/auth.server";
import { PlusIcon, Trash2Icon } from "lucide-react";
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
import { Textarea } from "~/common/components/ui/textarea";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/team-new-page";

interface SubmitErrors {
  productName?: string;
  productDescription?: string;
  roles?: string;
  teamSize?: string;
  equitySplit?: string;
}

interface SubmitValues {
  productName?: string | null;
  productDescription?: string | null;
  roles?: string[];
  teamSize?: string | null;
  equitySplit?: string | null;
}

function getFormErrors(formData: FormData): SubmitErrors | null {
  const productName = (formData.get("productName") as string)?.trim();
  const productDescription = (formData.get("productDescription") as string)?.trim();
  const roles = (formData.getAll("roles") as string[]).map((s) => s.trim()).filter(Boolean);
  const teamSizeRaw = (formData.get("teamSize") as string)?.trim();
  const equitySplitRaw = (formData.get("equitySplit") as string)?.trim();

  const errors: SubmitErrors = {};

  if (!productName) errors.productName = "Project name is required";
  if (!productDescription) errors.productDescription = "Project description is required";
  if (roles.length === 0) errors.roles = "Add at least one role you're looking for";

  const teamSize = teamSizeRaw === "" ? NaN : Number(teamSizeRaw);
  if (teamSizeRaw === "" || Number.isNaN(teamSize)) {
    errors.teamSize = "Team size is required";
  } else if (teamSize < 1 || teamSize > 100) {
    errors.teamSize = "Team size must be between 1 and 100";
  }

  const equitySplit = equitySplitRaw === "" ? NaN : Number(equitySplitRaw);
  if (equitySplitRaw === "" || Number.isNaN(equitySplit)) {
    errors.equitySplit = "Equity split is required";
  } else if (equitySplit < 1 || equitySplit > 100) {
    errors.equitySplit = "Equity split must be between 1 and 100";
  }

  if (Object.keys(errors).length === 0) return null;
  return errors;
}

function getValuesFromFormData(formData: FormData): SubmitValues {
  const roles = (formData.getAll("roles") as string[]).map((s) => s.trim()).filter(Boolean);
  return {
    productName: formData.get("productName") as string | null,
    productDescription: formData.get("productDescription") as string | null,
    roles: roles.length > 0 ? roles : undefined,
    teamSize: formData.get("teamSize") as string | null,
    equitySplit: formData.get("equitySplit") as string | null,
  };
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);
  return {};
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") return null;

  const formData = await request.formData();
  const errors = getFormErrors(formData);

  if (errors) {
    return {
      ok: false,
      errors,
      values: getValuesFromFormData(formData),
    };
  }

  // TODO: get leader from session, persist team (e.g. Supabase insert)
  return {
    ok: true,
    message: "Team created successfully.",
  };
}

export function meta(
  _args: Parameters<Route.MetaFunction>[0]
): ReturnType<Route.MetaFunction> {
  return [
    { title: "Create a Team | wemake" },
    { name: "description", content: "Post a team looking for new members." },
  ];
}

function isEmpty(value: string | null | undefined): boolean {
  return value == null || String(value).trim() === "";
}

export default function TeamNewPage({
  loaderData: _loaderData,
  actionData,
}: Route.ComponentProps) {
  const errors = (actionData as { errors?: SubmitErrors } | undefined)?.errors;
  const actionValues = (actionData as { values?: SubmitValues } | undefined)?.values ?? {};
  const success = (actionData as { ok?: boolean } | undefined)?.ok === true;
  const message = (actionData as { message?: string } | undefined)?.message;

  const [productName, setProductName] = useState(actionValues.productName ?? "");
  const [productDescription, setProductDescription] = useState(
    actionValues.productDescription ?? ""
  );
  const [roles, setRoles] = useState<string[]>(
    actionValues.roles?.length ? actionValues.roles : [""]
  );
  const [teamSize, setTeamSize] = useState(actionValues.teamSize ?? "");
  const [equitySplit, setEquitySplit] = useState(actionValues.equitySplit ?? "");

  useEffect(() => {
    if (!actionData || typeof actionData !== "object" || !("values" in actionData)) return;
    const v = (actionData as { values?: SubmitValues }).values;
    if (!v) return;
    if (v.productName !== undefined) setProductName(v.productName ?? "");
    if (v.productDescription !== undefined) setProductDescription(v.productDescription ?? "");
    if (v.roles?.length) setRoles(v.roles);
    if (v.teamSize !== undefined) setTeamSize(v.teamSize ?? "");
    if (v.equitySplit !== undefined) setEquitySplit(v.equitySplit ?? "");
  }, [actionData]);

  function addRole() {
    setRoles((prev) => [...prev, ""]);
  }

  function removeRole(index: number) {
    setRoles((prev) => prev.filter((_, i) => i !== index));
  }

  function updateRole(index: number, value: string) {
    setRoles((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  const hasRoles = roles.some((s) => s.trim() !== "");
  const isFormComplete =
    !isEmpty(productName) &&
    !isEmpty(productDescription) &&
    hasRoles &&
    !isEmpty(teamSize) &&
    !isEmpty(equitySplit) &&
    Number(teamSize) >= 1 &&
    Number(teamSize) <= 100 &&
    Number(equitySplit) >= 1 &&
    Number(equitySplit) <= 100;

  return (
    <div className="space-y-10">
      <PageHero
        title="Create a Team"
        description="Post a team looking for new members."
      />
      <div className="w-full max-w-2xl mx-auto px-4">
        {success && message ? (
          <Card className="border-green-500/50 bg-green-500/5">
            <CardContent className="pt-6">
              <p className="text-green-700 dark:text-green-400 font-medium">
                {message}
              </p>
              <Button asChild variant="link" className="mt-2 pl-0">
                <Link to="/teams">Back to teams</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Team details</CardTitle>
              <CardDescription>
                Describe your project and the roles you need. This will appear on
                the team listing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Project name</Label>
                    <Input
                      id="productName"
                      name="productName"
                      type="text"
                      placeholder="e.g. My Startup"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className={cn(errors?.productName && "border-destructive")}
                      autoComplete="off"
                    />
                    {errors?.productName ? (
                      <p className="text-sm text-destructive">
                        {errors.productName}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productDescription">
                      What you&apos;re building
                    </Label>
                    <Textarea
                      id="productDescription"
                      name="productDescription"
                      placeholder="e.g. a new social media platform"
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      className={cn(
                        "min-h-24 resize-y",
                        errors?.productDescription && "border-destructive"
                      )}
                      rows={3}
                    />
                    {errors?.productDescription ? (
                      <p className="text-sm text-destructive">
                        {errors.productDescription}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label>Roles you&apos;re looking for</Label>
                    <p className="text-sm text-muted-foreground">
                      Add at least one. Use the + button to add more.
                    </p>
                    <div className="space-y-2">
                      {roles.map((value, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <Input
                            name="roles"
                            value={value}
                            onChange={(e) => updateRole(index, e.target.value)}
                            placeholder={`e.g. React Developer, Backend Developer`}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRole(index)}
                            disabled={roles.length <= 1}
                            aria-label="Remove role"
                          >
                            <Trash2Icon className="size-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addRole}
                        className="gap-1"
                      >
                        <PlusIcon className="size-4" />
                        Add role
                      </Button>
                    </div>
                    {errors?.roles ? (
                      <p className="text-sm text-destructive">{errors.roles}</p>
                    ) : null}
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="teamSize">Team size (1–100)</Label>
                      <Input
                        id="teamSize"
                        name="teamSize"
                        type="number"
                        min={1}
                        max={100}
                        placeholder="e.g. 5"
                        value={teamSize}
                        onChange={(e) => setTeamSize(e.target.value)}
                        className={cn(errors?.teamSize && "border-destructive")}
                      />
                      {errors?.teamSize ? (
                        <p className="text-sm text-destructive">
                          {errors.teamSize}
                        </p>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="equitySplit">Equity split % (1–100)</Label>
                      <Input
                        id="equitySplit"
                        name="equitySplit"
                        type="number"
                        min={1}
                        max={100}
                        placeholder="e.g. 20"
                        value={equitySplit}
                        onChange={(e) => setEquitySplit(e.target.value)}
                        className={cn(errors?.equitySplit && "border-destructive")}
                      />
                      {errors?.equitySplit ? (
                        <p className="text-sm text-destructive">
                          {errors.equitySplit}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-col items-center gap-4">
                  <Button
                    type="submit"
                    disabled={!isFormComplete}
                    className="w-full max-w-md"
                  >
                    Create team
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full max-w-md"
                  >
                    <Link to="/teams">Cancel</Link>
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
