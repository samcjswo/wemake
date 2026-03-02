import { data } from "react-router";
import { Link } from "react-router";
import type { Route } from "./+types/job-detail-page";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";

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

const DEFAULT_DESCRIPTION = `We are looking for a talented and motivated professional to join our team. You will work on meaningful projects, collaborate with cross-functional teams, and have a direct impact on our product and users.

This role offers the opportunity to grow your skills, take ownership of features, and contribute to a culture of quality and innovation.`;

const MOCK_JOB_DETAILS: Record<string, JobDetail> = {
  "jobId-0": {
    id: "jobId-0",
    companyName: "Meta",
    companyLogoUrl: "https://github.com/facebook.png",
    postedAt: "2 hours ago",
    title: "Software Engineer",
    jobType: "Full-time",
    positionLocation: "Remote",
    salaryRange: "$100,000 - $120,000",
    location: "San Francisco, CA",
    description: DEFAULT_DESCRIPTION,
    responsibilities: [
      "Design, build, and maintain scalable systems and services",
      "Collaborate with product and design to ship new features",
      "Write clear documentation and conduct code reviews",
      "Participate in on-call rotation and incident response",
    ],
    requirements: [
      "2+ years of experience in software development",
      "Proficiency in one or more of: JavaScript/TypeScript, Python, Go, or Java",
      "Experience with relational databases and distributed systems",
      "Strong communication and problem-solving skills",
    ],
    applyUrl: "https://meta.com/careers",
  },
  "jobId-1": {
    id: "jobId-1",
    companyName: "Stripe",
    companyLogoUrl: "https://github.com/stripe.png",
    postedAt: "5 hours ago",
    title: "Frontend Engineer",
    jobType: "Full-time",
    positionLocation: "Remote",
    salaryRange: "$130,000 - $160,000",
    location: "New York, NY",
    description: DEFAULT_DESCRIPTION,
    responsibilities: [
      "Build and ship user-facing features with React and TypeScript",
      "Improve performance, accessibility, and developer experience",
      "Work with designers to implement pixel-perfect UIs",
      "Mentor junior engineers and share best practices",
    ],
    requirements: [
      "3+ years of frontend development experience",
      "Deep knowledge of React, TypeScript, and modern CSS",
      "Experience with testing (unit, integration, e2e)",
      "Familiarity with build tools (Vite, Webpack, or similar)",
    ],
    applyUrl: "https://stripe.com/jobs",
  },
  "jobId-2": {
    id: "jobId-2",
    companyName: "Vercel",
    companyLogoUrl: "https://github.com/vercel.png",
    postedAt: "1 day ago",
    title: "DevOps Engineer",
    jobType: "Contract",
    positionLocation: "Remote",
    salaryRange: "$80,000 - $100,000",
    location: "Remote",
    description: DEFAULT_DESCRIPTION,
    responsibilities: [
      "Manage CI/CD pipelines and deployment automation",
      "Maintain and improve observability (logging, metrics, tracing)",
      "Ensure security and compliance of infrastructure",
      "Support development teams with tooling and environments",
    ],
    requirements: [
      "Experience with Kubernetes, Docker, and cloud providers (AWS/GCP)",
      "Proficiency in Terraform or similar IaC tools",
      "Strong scripting skills (Bash, Python, or Go)",
      "Understanding of networking and security best practices",
    ],
  },
  "jobId-3": {
    id: "jobId-3",
    companyName: "Linear",
    companyLogoUrl: "https://github.com/linear.png",
    postedAt: "1 day ago",
    title: "Product Designer",
    jobType: "Full-time",
    positionLocation: "Hybrid",
    salaryRange: "$120,000 - $150,000",
    location: "San Francisco, CA",
    description: DEFAULT_DESCRIPTION,
    responsibilities: [
      "Create end-to-end flows, wireframes, and high-fidelity mockups",
      "Conduct user research and usability testing",
      "Collaborate with engineering to ship polished experiences",
      "Contribute to design system and component library",
    ],
    requirements: [
      "4+ years of product design experience",
      "Portfolio demonstrating strong UI/UX and interaction design",
      "Proficiency in Figma or similar design tools",
      "Experience working in agile or iterative environments",
    ],
  },
  "jobId-4": {
    id: "jobId-4",
    companyName: "Notion",
    companyLogoUrl: "https://github.com/notion.png",
    postedAt: "2 days ago",
    title: "Backend Engineer",
    jobType: "Full-time",
    positionLocation: "Remote",
    salaryRange: "$150,000 - $180,000",
    location: "Remote",
    description: DEFAULT_DESCRIPTION,
    responsibilities: [
      "Develop and scale APIs and data pipelines",
      "Optimize database queries and storage systems",
      "Implement real-time features and event-driven architecture",
      "Ensure high availability and disaster recovery",
    ],
    requirements: [
      "4+ years of backend or full-stack experience",
      "Experience with Node.js, Python, or Go in production",
      "Knowledge of PostgreSQL, Redis, or similar",
      "Comfort with distributed systems and microservices",
    ],
  },
  "jobId-5": {
    id: "jobId-5",
    companyName: "Figma",
    companyLogoUrl: "https://github.com/figma.png",
    postedAt: "3 days ago",
    title: "Engineering Intern",
    jobType: "Internship",
    positionLocation: "On-site",
    salaryRange: "$45,000 - $55,000",
    location: "San Francisco, CA",
    description: DEFAULT_DESCRIPTION,
    responsibilities: [
      "Work on a real project with guidance from a mentor",
      "Participate in code reviews and team rituals",
      "Learn best practices in software development",
      "Present your work at the end of the internship",
    ],
    requirements: [
      "Currently pursuing a degree in CS or related field",
      "Some experience with programming (any language)",
      "Available for a 12-week summer internship",
      "Strong curiosity and eagerness to learn",
    ],
  },
  "jobId-6": {
    id: "jobId-6",
    companyName: "OpenAI",
    companyLogoUrl: "https://github.com/openai.png",
    postedAt: "3 days ago",
    title: "ML Engineer",
    jobType: "Full-time",
    positionLocation: "Remote",
    salaryRange: "$200,000 - $250,000",
    location: "Remote",
    description: DEFAULT_DESCRIPTION,
    responsibilities: [
      "Train, evaluate, and deploy large-scale ML models",
      "Improve inference latency and cost efficiency",
      "Collaborate with research and product teams",
      "Stay current with latest advances in ML/AI",
    ],
    requirements: [
      "MS or PhD in ML, CS, or related field (or equivalent experience)",
      "Strong experience with PyTorch or TensorFlow",
      "Experience with distributed training and GPU clusters",
      "Publication record or open-source contributions a plus",
    ],
  },
  "jobId-7": {
    id: "jobId-7",
    companyName: "Vercel",
    companyLogoUrl: "https://github.com/vercel.png",
    postedAt: "4 days ago",
    title: "Part-time React Developer",
    jobType: "Part-time",
    positionLocation: "Remote",
    salaryRange: "$60,000 - $80,000",
    location: "Remote",
    description: DEFAULT_DESCRIPTION,
    responsibilities: [
      "Implement new features and fix bugs in React applications",
      "Work ~20 hours per week with flexible scheduling",
      "Participate in code reviews and team syncs",
      "Document components and patterns for the team",
    ],
    requirements: [
      "2+ years of React experience",
      "Comfort with TypeScript and modern tooling",
      "Ability to work independently and communicate async",
      "Part-time availability for at least 6 months",
    ],
  },
  "jobId-8": {
    id: "jobId-8",
    companyName: "Resend",
    companyLogoUrl: "https://github.com/resend.png",
    postedAt: "5 days ago",
    title: "Full-stack Engineer",
    jobType: "Freelance",
    positionLocation: "Remote",
    salaryRange: "$90,000 - $110,000",
    location: "Remote",
    description: DEFAULT_DESCRIPTION,
    responsibilities: [
      "Build and ship features across the stack (React + Node)",
      "Integrate with third-party APIs and services",
      "Write tests and maintain documentation",
      "Deliver on agreed milestones and timelines",
    ],
    requirements: [
      "3+ years of full-stack development",
      "Experience with React and Node.js (or similar)",
      "Self-directed and comfortable with remote work",
      "Available for contract (3–6 months, extendable)",
    ],
  },
};

function getJobById(jobId: string): JobDetail | null {
  return MOCK_JOB_DETAILS[jobId] ?? null;
}

export function loader({ params }: Route.LoaderArgs) {
  const jobId = params.jobId;
  if (!jobId) {
    throw data({ message: "Job not found" }, { status: 404 });
  }
  const job = getJobById(jobId);
  if (!job) {
    throw data({ message: "Job not found" }, { status: 404 });
  }
  return { job };
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

interface LoaderData {
  job: JobDetail;
}

export default function JobDetailPage({ loaderData }: Route.ComponentProps) {
  const data = loaderData as LoaderData | undefined;
  const job = data?.job;

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
