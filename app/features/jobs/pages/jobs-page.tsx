import { useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { BriefcaseIcon } from "lucide-react";
import type { Route } from "./+types/jobs-page";
import { Button } from "~/common/components/ui/button";
import { Label } from "~/common/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/common/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/common/components/ui/select";
import { JobCard } from "../components/job-card";
import { cn } from "~/lib/utils";
import { getJobs } from "../queries";

const JOBS_PER_PAGE = 9;

function derivesSalaryRangeId(salaryRange: string): string {
  const match = salaryRange.replace(/[^0-9,]/g, "").split(",")[0];
  const minK = Math.floor(Number(match.replace(/,/g, "")) / 1000);
  if (minK < 50) return "under-50";
  if (minK < 100) return "50-100";
  if (minK < 150) return "100-150";
  if (minK < 200) return "150-200";
  return "200-plus";
}

function formatPostedAt(createdAt: string): string {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) return diffHours <= 1 ? "1 hour ago" : `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
}

function getPageUrl(
  pathname: string,
  searchParams: URLSearchParams,
  page: number
): string {
  const next = new URLSearchParams(searchParams);
  next.set("page", String(page));
  const search = next.toString();
  return search ? `${pathname}?${search}` : pathname;
}

const JOB_TYPES = [
  { id: "full-time", label: "Full-time" },
  { id: "part-time", label: "Part-time" },
  { id: "contract", label: "Contract" },
  { id: "internship", label: "Internship" },
  { id: "remote", label: "Remote" },
  { id: "freelance", label: "Freelance" },
] as const;

const SALARY_RANGES = [
  { id: "any", label: "Any" },
  { id: "under-50", label: "Under $50k" },
  { id: "50-100", label: "$50k – $100k" },
  { id: "100-150", label: "$100k – $150k" },
  { id: "150-200", label: "$150k – $200k" },
  { id: "200-plus", label: "$200k+" },
] as const;

interface JobListing {
  id: string;
  companyName: string;
  companyLogoUrl: string;
  postedAt: string;
  title: string;
  jobType: string;
  positionLocation: string;
  salaryRange: string;
  location: string;
  salaryRangeId: string;
}

function parseArrayParam(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const types = parseArrayParam(url.searchParams.get("type"));
  const salaryRange = url.searchParams.get("salary") ?? "any";
  const rawJobs = await getJobs();
  const jobs: JobListing[] = rawJobs.map((j) => ({
    id: String(j.id),
    companyName: j.company_name,
    companyLogoUrl: j.company_logo_url,
    postedAt: formatPostedAt(j.created_at),
    title: j.title,
    jobType: j.job_type,
    positionLocation: j.position_location,
    salaryRange: j.salary_range,
    location: j.location,
    salaryRangeId: derivesSalaryRangeId(j.salary_range),
  }));
  return { types, salaryRange, jobs };
}

export function action(_args: Route.ActionArgs) {
  return null;
}

export function meta(_args: Parameters<Route.MetaFunction>[0]): ReturnType<Route.MetaFunction> {
  return [
    { title: "Jobs | wemake" },
    { name: "description", content: "Find your dream job" },
  ];
}

export default function JobsPage({ loaderData }: Route.ComponentProps) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTypes = loaderData?.types ?? [];
  const initialSalary = loaderData?.salaryRange ?? "any";
  const allJobs = loaderData?.jobs ?? [];

  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    () => new Set(initialTypes)
  );
  const [salaryRange, setSalaryRange] = useState(initialSalary);

  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const jobTypeSlug = job.jobType.toLowerCase().replace(/\s+/g, "-");
      const typeMatch =
        selectedTypes.size === 0 ||
        selectedTypes.has(jobTypeSlug);
      const salaryMatch =
        salaryRange === "any" || job.salaryRangeId === salaryRange;
      return typeMatch && salaryMatch;
    });
  }, [selectedTypes, salaryRange]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE));
  const rawPage = Number(searchParams.get("page"));
  const page =
    Number.isNaN(rawPage) || rawPage < 1
      ? 1
      : Math.min(rawPage, totalPages);

  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(start, start + JOBS_PER_PAGE);
  }, [filteredJobs, page]);

  const prevUrl = page > 1 ? getPageUrl(location.pathname, searchParams, page - 1) : undefined;
  const nextUrl = page < totalPages ? getPageUrl(location.pathname, searchParams, page + 1) : undefined;

  const handleTypeToggle = (id: string) => {
    const next = new Set(selectedTypes);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedTypes(next);
    const typeParam = next.size > 0 ? Array.from(next).join(",") : null;
    const params = new URLSearchParams(searchParams);
    if (typeParam) params.set("type", typeParam);
    else params.delete("type");
    params.delete("page");
    setSearchParams(params, { replace: true });
  };

  const handleSalaryChange = (value: string) => {
    setSalaryRange(value);
    const params = new URLSearchParams(searchParams);
    if (value && value !== "any") params.set("salary", value);
    else params.delete("salary");
    params.delete("page");
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
      <header className="flex flex-row items-start gap-6">
        <div className="shrink-0 w-32 h-32 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden shadow-md">
          <BriefcaseIcon className="size-16 text-primary/60" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Jobs
          </h1>
          <p className="text-muted-foreground text-base font-normal">
            Find your next opportunity. Browse by type and salary range.
          </p>
        </div>
        <div className="shrink-0 flex flex-row items-center gap-2">
          <Button asChild variant="default">
            <Link to="/jobs/submit">Post a job</Link>
          </Button>
        </div>
      </header>

      <div className="mt-12 pt-12 border-t border-border flex gap-10">
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedJobs.map((job) => (
              <JobCard
                key={job.id}
                jobId={job.id}
                companyName={job.companyName}
                companyLogoUrl={job.companyLogoUrl}
                postedAt={job.postedAt}
                title={job.title}
                jobType={job.jobType}
                positionLocation={job.positionLocation}
                salaryRange={job.salaryRange}
                location={job.location}
              />
            ))}
          </div>
          {filteredJobs.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No jobs match your filters. Try adjusting the filters.
            </p>
          ) : totalPages > 1 ? (
            <Pagination className="mt-2">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={prevUrl ?? "#"}
                    aria-disabled={!prevUrl}
                    className={!prevUrl ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
                {page > 1 && (
                  <PaginationItem>
                    <PaginationLink href={getPageUrl(location.pathname, searchParams, page - 1)}>
                      {page - 1}
                    </PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    href={getPageUrl(location.pathname, searchParams, page)}
                    isActive
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
                {page < totalPages && (
                  <PaginationItem>
                    <PaginationLink href={getPageUrl(location.pathname, searchParams, page + 1)}>
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    href={nextUrl ?? "#"}
                    aria-disabled={!nextUrl}
                    className={!nextUrl ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </div>

        <aside className="w-64 shrink-0">
          <div className="sticky top-4 space-y-6 rounded-lg border border-border bg-card p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Filters</h2>

            <div className="space-y-3">
              <Label className="text-muted-foreground">Job type</Label>
              <div className="flex flex-col gap-2">
                {JOB_TYPES.map((type) => (
                  <label
                    key={type.id}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer text-sm",
                      "hover:text-foreground"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.has(type.id)}
                      onChange={() => handleTypeToggle(type.id)}
                      className="rounded border-input size-4"
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary-range" className="text-muted-foreground">
                Salary range
              </Label>
              <Select value={salaryRange} onValueChange={handleSalaryChange}>
                <SelectTrigger id="salary-range" className="w-full">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  {SALARY_RANGES.map((range) => (
                    <SelectItem key={range.id} value={range.id}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                setSelectedTypes(new Set());
                setSalaryRange("any");
                setSearchParams({}, { replace: true });
              }}
            >
              Clear filters
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
