import { data } from "react-router";
import { Link } from "react-router";
import type { Route } from "./+types/job-detail-page";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import { getJobById } from "../queries";

interface JobDetail {
  id: string;
  companyName: string;
  companyLogoUrl: string;
  postedAt: string;
  title: string;
  jobType: string;
  positionLocation: string;
  salaryRange: string;
  location: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  applyUrl?: string;
}

function formatPostedAt(createdAt: string): string {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) return diffHours <= 1 ? "1 hour ago" : `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
}

export async function loader({ params }: Route.LoaderArgs) {
  const jobId = params.jobId;
  if (!jobId || isNaN(Number(jobId))) {
    throw data({ message: "Job not found" }, { status: 404 });
  }
  try {
    const raw = await getJobById(Number(jobId));
    const job: JobDetail = {
      id: String(raw.id),
      companyName: raw.company_name,
      companyLogoUrl: raw.company_logo_url,
      postedAt: formatPostedAt(raw.created_at),
      title: raw.title,
      jobType: raw.job_type,
      positionLocation: raw.position_location,
      salaryRange: raw.salary_range,
      location: raw.location,
      description: raw.description,
      responsibilities: raw.responsibilities,
      requirements: raw.requirements,
      applyUrl: raw.apply_url ?? undefined,
    };
    return { job };
  } catch {
    throw data({ message: "Job not found" }, { status: 404 });
  }
}

export function action(_args: Route.ActionArgs) {
  return null;
}

type MetaArgs = { data?: { job?: { title?: string; companyName?: string } } };

export function meta(args: Parameters<Route.MetaFunction>[0]) {
  const { data } = args as MetaArgs;
  const title = data?.job?.title ?? "Job";
  const company = data?.job?.companyName ?? "";
  return [
    { title: `${title}${company ? ` at ${company}` : ""} | wemake` },
    { name: "description", content: `Job listing: ${title}` },
  ];
}

export default function JobDetailPage({ loaderData }: Route.ComponentProps) {
  const job = loaderData?.job as JobDetail | undefined;

  if (!job) return null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10">
      <header className="flex flex-row items-start gap-6">
        <div className="shrink-0 w-32 h-32 rounded-xl bg-muted overflow-hidden flex items-center justify-center shadow-md">
          <img
            src={job.companyLogoUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {job.title}
          </h1>
          <p className="text-lg text-muted-foreground">{job.companyName}</p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge variant="outline">{job.jobType}</Badge>
            <Badge variant="outline">{job.positionLocation}</Badge>
            <span className="text-sm text-muted-foreground">{job.location}</span>
            <span className="text-sm font-medium">{job.salaryRange}</span>
            <span className="text-sm text-muted-foreground">· {job.postedAt}</span>
          </div>
        </div>
        <div className="shrink-0 flex flex-row items-center gap-2">
          <Button asChild variant="default">
            {job.applyUrl ? (
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply now
              </a>
            ) : (
              <a href="mailto:jobs@example.com?subject=Application">Apply now</a>
            )}
          </Button>
          <Button asChild variant="outline">
            <Link to="/jobs">Back to jobs</Link>
          </Button>
        </div>
      </header>

      <div className="mt-12 pt-12 border-t border-border space-y-10">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            About the role
          </h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Responsibilities
          </h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
            {job.responsibilities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Requirements
          </h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
            {job.requirements.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <div className="pt-4">
          <Button asChild variant="default" size="lg">
            {job.applyUrl ? (
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply now
              </a>
            ) : (
              <a href="mailto:jobs@example.com?subject=Application">Apply now</a>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
