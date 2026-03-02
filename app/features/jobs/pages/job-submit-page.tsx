import { useEffect, useState } from "react";
import { Form, Link } from "react-router";
import { ChevronDownIcon, PlusIcon, Trash2Icon } from "lucide-react";
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

import type { Route } from "./+types/job-submit-page";

const JOB_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "remote", label: "Remote" },
  { value: "freelance", label: "Freelance" },
] as const;

const POSITION_LOCATIONS = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "on-site", label: "On-site" },
] as const;

export function loader(_args: Route.LoaderArgs) {
  return {};
}

interface SubmitErrors {
  companyName?: string;
  companyLogoUrl?: string;
  title?: string;
  jobType?: string;
  positionLocation?: string;
  salaryRange?: string;
  location?: string;
  description?: string;
  responsibilities?: string;
  requirements?: string;
  applyUrl?: string;
}

interface SubmitValues {
  companyName?: string | null;
  companyLogoUrl?: string | null;
  title?: string | null;
  jobType?: string | null;
  positionLocation?: string | null;
  salaryRange?: string | null;
  location?: string | null;
  description?: string | null;
  responsibilities?: string[];
  requirements?: string[];
  applyUrl?: string | null;
}

function getFormErrors(formData: FormData): SubmitErrors | null {
  const companyName = (formData.get("companyName") as string)?.trim();
  const companyLogoUrl = (formData.get("companyLogoUrl") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const jobType = (formData.get("jobType") as string)?.trim();
  const positionLocation = (formData.get("positionLocation") as string)?.trim();
  const salaryRange = (formData.get("salaryRange") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const responsibilities = formData.getAll("responsibilities") as string[];
  const requirements = formData.getAll("requirements") as string[];
  const applyUrl = (formData.get("applyUrl") as string)?.trim();

  const errors: SubmitErrors = {};

  if (!companyName) errors.companyName = "Company name is required";
  if (!companyLogoUrl) errors.companyLogoUrl = "Company logo URL is required";
  else {
    try {
      new URL(companyLogoUrl);
    } catch {
      errors.companyLogoUrl = "Please enter a valid URL";
    }
  }
  if (!title) errors.title = "Job title is required";
  if (!jobType) errors.jobType = "Job type is required";
  else if (!JOB_TYPES.some((t) => t.value === jobType)) {
    errors.jobType = "Please select a valid job type";
  }
  if (!positionLocation) errors.positionLocation = "Work location is required";
  else if (!POSITION_LOCATIONS.some((p) => p.value === positionLocation)) {
    errors.positionLocation = "Please select a valid location type";
  }
  if (!salaryRange) errors.salaryRange = "Salary range is required";
  if (!location) errors.location = "Location is required";
  if (!description) errors.description = "Job description is required";
  const filteredResponsibilities = responsibilities.map((s) => s.trim()).filter(Boolean);
  if (filteredResponsibilities.length === 0) {
    errors.responsibilities = "Add at least one responsibility";
  }
  const filteredRequirements = requirements.map((s) => s.trim()).filter(Boolean);
  if (filteredRequirements.length === 0) {
    errors.requirements = "Add at least one requirement";
  }
  if (applyUrl) {
    try {
      new URL(applyUrl);
    } catch {
      errors.applyUrl = "Please enter a valid URL";
    }
  }

  if (Object.keys(errors).length === 0) return null;
  return errors;
}

function getValuesFromFormData(formData: FormData): SubmitValues {
  return {
    companyName: formData.get("companyName") as string | null,
    companyLogoUrl: formData.get("companyLogoUrl") as string | null,
    title: formData.get("title") as string | null,
    jobType: formData.get("jobType") as string | null,
    positionLocation: formData.get("positionLocation") as string | null,
    salaryRange: formData.get("salaryRange") as string | null,
    location: formData.get("location") as string | null,
    description: formData.get("description") as string | null,
    responsibilities: (formData.getAll("responsibilities") as string[]).map((s) => s.trim()).filter(Boolean),
    requirements: (formData.getAll("requirements") as string[]).map((s) => s.trim()).filter(Boolean),
    applyUrl: formData.get("applyUrl") as string | null,
  };
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

  // TODO: persist job (e.g. Supabase insert)
  return {
    ok: true,
    message: "Job submitted successfully.",
  };
}

export function meta(_args: Parameters<Route.MetaFunction>[0]) {
  return [
    { title: "Submit a Job | wemake" },
    { name: "description", content: "Submit a new job listing" },
  ];
}

function isEmpty(value: string | null | undefined): boolean {
  return value == null || String(value).trim() === "";
}

export default function JobSubmitPage({
  loaderData: _loaderData,
  actionData,
}: Route.ComponentProps) {
  const errors = (actionData as { errors?: SubmitErrors } | undefined)?.errors;
  const actionValues = (actionData as { values?: SubmitValues } | undefined)?.values ?? {};
  const success = (actionData as { ok?: boolean } | undefined)?.ok === true;
  const message = (actionData as { message?: string } | undefined)?.message;

  const [companyName, setCompanyName] = useState(actionValues.companyName ?? "");
  const [companyLogoUrl, setCompanyLogoUrl] = useState(actionValues.companyLogoUrl ?? "");
  const [title, setTitle] = useState(actionValues.title ?? "");
  const [jobType, setJobType] = useState(actionValues.jobType ?? "");
  const [positionLocation, setPositionLocation] = useState(
    actionValues.positionLocation ?? ""
  );
  const [salaryRange, setSalaryRange] = useState(actionValues.salaryRange ?? "");
  const [location, setLocation] = useState(actionValues.location ?? "");
  const [description, setDescription] = useState(actionValues.description ?? "");
  const [responsibilities, setResponsibilities] = useState<string[]>(
    actionValues.responsibilities?.length
      ? actionValues.responsibilities
      : [""]
  );
  const [requirements, setRequirements] = useState<string[]>(
    actionValues.requirements?.length ? actionValues.requirements : [""]
  );
  const [applyUrl, setApplyUrl] = useState(actionValues.applyUrl ?? "");

  useEffect(() => {
    if (!actionData || typeof actionData !== "object" || !("values" in actionData)) return;
    const v = (actionData as { values?: SubmitValues }).values;
    if (!v) return;
    if (v.companyName !== undefined) setCompanyName(v.companyName ?? "");
    if (v.companyLogoUrl !== undefined) setCompanyLogoUrl(v.companyLogoUrl ?? "");
    if (v.title !== undefined) setTitle(v.title ?? "");
    if (v.jobType !== undefined) setJobType(v.jobType ?? "");
    if (v.positionLocation !== undefined) setPositionLocation(v.positionLocation ?? "");
    if (v.salaryRange !== undefined) setSalaryRange(v.salaryRange ?? "");
    if (v.location !== undefined) setLocation(v.location ?? "");
    if (v.description !== undefined) setDescription(v.description ?? "");
    if (v.applyUrl !== undefined) setApplyUrl(v.applyUrl ?? "");
    if (v.responsibilities?.length) setResponsibilities(v.responsibilities);
    if (v.requirements?.length) setRequirements(v.requirements);
  }, [actionData]);

  function addResponsibility() {
    setResponsibilities((prev) => [...prev, ""]);
  }

  function removeResponsibility(index: number) {
    setResponsibilities((prev) => prev.filter((_, i) => i !== index));
  }

  function updateResponsibility(index: number, value: string) {
    setResponsibilities((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function addRequirement() {
    setRequirements((prev) => [...prev, ""]);
  }

  function removeRequirement(index: number) {
    setRequirements((prev) => prev.filter((_, i) => i !== index));
  }

  function updateRequirement(index: number, value: string) {
    setRequirements((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  const hasResponsibilities = responsibilities.some((s) => s.trim() !== "");
  const hasRequirements = requirements.some((s) => s.trim() !== "");
  const isFormComplete =
    !isEmpty(companyName) &&
    !isEmpty(companyLogoUrl) &&
    !isEmpty(title) &&
    !isEmpty(jobType) &&
    !isEmpty(positionLocation) &&
    !isEmpty(salaryRange) &&
    !isEmpty(location) &&
    !isEmpty(description) &&
    hasResponsibilities &&
    hasRequirements;

  return (
    <div className="space-y-10">
      <PageHero
        title="Submit a Job"
        description="Post a new job listing. Fill in all fields that will appear on the job detail page."
      />
      <div className="w-full max-w-2xl mx-auto px-4">
        {success && message ? (
          <Card className="border-green-500/50 bg-green-500/5">
            <CardContent className="pt-6">
              <p className="text-green-700 dark:text-green-400 font-medium">
                {message}
              </p>
              <Button asChild variant="link" className="mt-2 pl-0">
                <Link to="/jobs">Back to jobs</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Job details</CardTitle>
              <CardDescription>
                All fields below are required except &quot;Apply URL&quot;. These
                match what is shown on the job detail page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      placeholder="e.g. Acme Inc."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className={cn(errors?.companyName && "border-destructive")}
                      autoComplete="organization"
                    />
                    {errors?.companyName ? (
                      <p className="text-sm text-destructive">
                        {errors.companyName}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyLogoUrl">Company logo URL</Label>
                    <Input
                      id="companyLogoUrl"
                      name="companyLogoUrl"
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={companyLogoUrl}
                      onChange={(e) => setCompanyLogoUrl(e.target.value)}
                      className={cn(
                        errors?.companyLogoUrl && "border-destructive"
                      )}
                      autoComplete="url"
                    />
                    {errors?.companyLogoUrl ? (
                      <p className="text-sm text-destructive">
                        {errors.companyLogoUrl}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Job title</Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="e.g. Software Engineer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={cn(errors?.title && "border-destructive")}
                      autoComplete="off"
                    />
                    {errors?.title ? (
                      <p className="text-sm text-destructive">{errors.title}</p>
                    ) : null}
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="jobType">Job type</Label>
                      <div className="relative">
                        <select
                          id="jobType"
                          name="jobType"
                          value={jobType}
                          onChange={(e) => setJobType(e.target.value)}
                          className={cn(
                            "border-input h-9 w-full rounded-md border bg-transparent pl-3 pr-12 py-1 text-base shadow-xs outline-none md:text-sm appearance-none",
                            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                            errors?.jobType && "border-destructive"
                          )}
                        >
                          <option value="">Select type</option>
                          {JOB_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon
                          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                          aria-hidden
                        />
                      </div>
                      {errors?.jobType ? (
                        <p className="text-sm text-destructive">
                          {errors.jobType}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="positionLocation">Work location</Label>
                      <div className="relative">
                        <select
                          id="positionLocation"
                          name="positionLocation"
                          value={positionLocation}
                          onChange={(e) => setPositionLocation(e.target.value)}
                          className={cn(
                            "border-input h-9 w-full rounded-md border bg-transparent pl-3 pr-12 py-1 text-base shadow-xs outline-none md:text-sm appearance-none",
                            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                            errors?.positionLocation && "border-destructive"
                          )}
                        >
                          <option value="">Select location</option>
                          {POSITION_LOCATIONS.map((p) => (
                            <option key={p.value} value={p.value}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon
                          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                          aria-hidden
                        />
                      </div>
                      {errors?.positionLocation ? (
                        <p className="text-sm text-destructive">
                          {errors.positionLocation}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salaryRange">Salary range</Label>
                    <Input
                      id="salaryRange"
                      name="salaryRange"
                      type="text"
                      placeholder="e.g. $100,000 - $120,000"
                      value={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.value)}
                      className={cn(
                        errors?.salaryRange && "border-destructive"
                      )}
                      autoComplete="off"
                    />
                    {errors?.salaryRange ? (
                      <p className="text-sm text-destructive">
                        {errors.salaryRange}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      placeholder="e.g. San Francisco, CA or Remote"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={cn(errors?.location && "border-destructive")}
                      autoComplete="address-level1"
                    />
                    {errors?.location ? (
                      <p className="text-sm text-destructive">
                        {errors.location}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Job description (About the role)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe the role, team, and what the candidate will work on..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={cn(
                        "min-h-32",
                        errors?.description && "border-destructive"
                      )}
                      rows={6}
                    />
                    {errors?.description ? (
                      <p className="text-sm text-destructive">
                        {errors.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label>Responsibilities</Label>
                    <p className="text-sm text-muted-foreground">
                      Add at least one. Use the + button to add more.
                    </p>
                    <div className="space-y-2">
                      {responsibilities.map((value, index) => (
                        <div
                          key={index}
                          className="flex gap-2 items-start"
                        >
                          <Input
                            name="responsibilities"
                            value={value}
                            onChange={(e) =>
                              updateResponsibility(index, e.target.value)
                            }
                            placeholder={`Responsibility ${index + 1}`}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeResponsibility(index)}
                            disabled={responsibilities.length <= 1}
                            aria-label="Remove responsibility"
                          >
                            <Trash2Icon className="size-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addResponsibility}
                        className="gap-1"
                      >
                        <PlusIcon className="size-4" />
                        Add responsibility
                      </Button>
                    </div>
                    {errors?.responsibilities ? (
                      <p className="text-sm text-destructive">
                        {errors.responsibilities}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label>Requirements</Label>
                    <p className="text-sm text-muted-foreground">
                      Add at least one. Use the + button to add more.
                    </p>
                    <div className="space-y-2">
                      {requirements.map((value, index) => (
                        <div
                          key={index}
                          className="flex gap-2 items-start"
                        >
                          <Input
                            name="requirements"
                            value={value}
                            onChange={(e) =>
                              updateRequirement(index, e.target.value)
                            }
                            placeholder={`Requirement ${index + 1}`}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRequirement(index)}
                            disabled={requirements.length <= 1}
                            aria-label="Remove requirement"
                          >
                            <Trash2Icon className="size-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addRequirement}
                        className="gap-1"
                      >
                        <PlusIcon className="size-4" />
                        Add requirement
                      </Button>
                    </div>
                    {errors?.requirements ? (
                      <p className="text-sm text-destructive">
                        {errors.requirements}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="applyUrl">Apply URL (optional)</Label>
                    <Input
                      id="applyUrl"
                      name="applyUrl"
                      type="url"
                      placeholder="https://company.com/careers/apply"
                      value={applyUrl}
                      onChange={(e) => setApplyUrl(e.target.value)}
                      className={cn(errors?.applyUrl && "border-destructive")}
                      autoComplete="url"
                    />
                    {errors?.applyUrl ? (
                      <p className="text-sm text-destructive">
                        {errors.applyUrl}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-10 flex flex-col gap-4">
                  <Button
                    type="submit"
                    disabled={!isFormComplete}
                    className="w-full max-w-md mx-auto"
                  >
                    Submit job
                  </Button>
                  <Button asChild variant="ghost" className="w-full max-w-md mx-auto">
                    <Link to="/jobs">Cancel</Link>
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
