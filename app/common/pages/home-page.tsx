import { Link, type MetaFunction } from "react-router";
import { IdeaCard } from "~/features/ideas/components/idea-cards";
import { JobCard } from "~/features/jobs/components/job-card";
import { PostCard } from "~/features/community/components/post-cards";
import { ProductCard } from "~/features/products/components/product-cards";
import { TeamCard } from "~/features/teams/components/team-card";
import { Button } from "../components/ui/button";
import type { Route } from "./+types/home-page";
import {
  getHomeProducts,
  getHomePosts,
  getHomeIdeas,
  getHomeJobs,
  getHomeTeams,
} from "../queries";

export const meta: MetaFunction = () => {
  return [
    { title: "Home | wemake" },
    { name: "description", content: "Welcome to Wemake" },
  ];
};

function formatPostedAt(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) return diffHours <= 1 ? "1 hour ago" : `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
}

export async function loader(_: Route.LoaderArgs) {
  const [rawProducts, rawPosts, rawIdeas, rawJobs, rawTeams] = await Promise.all([
    getHomeProducts(),
    getHomePosts(),
    getHomeIdeas(),
    getHomeJobs(),
    getHomeTeams(),
  ]);
  return { rawProducts, rawPosts, rawIdeas, rawJobs, rawTeams };
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const { rawProducts, rawPosts, rawIdeas, rawJobs, rawTeams } = loaderData;

  return (
    <div className="px-20 space-y-40">
      {/* Products Section */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Today's Products</h2>
          <p className="text-xl font-light text-foreground">
            The best products made by our community today.
          </p>
          <Button variant="link" asChild className="text-lg font-light pl-0">
            <Link to="/products/leaderboards">Explore all products &rarr;</Link>
          </Button>
        </div>
        {rawProducts.map((p) => {
          const stats = p.stats as { views?: number; reviews?: number } | null;
          return (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              description={p.tagline}
              commentCount={stats?.reviews ?? 0}
              viewCount={stats?.views ?? 0}
              voteCount={0}
            />
          );
        })}
      </div>

      {/* Discussion Section */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Latest Discussions</h2>
          <p className="text-xl font-light text-foreground">
            The latest discussions from our community.
          </p>
          <Button variant="link" asChild className="text-lg font-light pl-0">
            <Link to="/community">Explore all discussions &rarr;</Link>
          </Button>
        </div>
        {rawPosts.map((post) => (
          <PostCard
            key={post.post_id}
            postId={String(post.post_id)}
            title={post.title}
            authorName={post.author_name ?? "Anonymous"}
            category={post.topic_name ?? "General"}
            timeAgo={formatPostedAt(post.createdAt)}
            footerVariant="reply"
            avatarSrc={post.author_avatar ?? undefined}
            avatarFallback={(post.author_name ?? "A").charAt(0).toUpperCase()}
          />
        ))}
      </div>

      {/* Idea Section */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold">IdeasGPT</h2>
          <p className="text-xl font-light text-foreground">
            Find ideas for your next project.
          </p>
          <Button variant="link" asChild className="text-lg font-light pl-0">
            <Link to="/ideas">Explore all ideas &rarr;</Link>
          </Button>
        </div>
        {rawIdeas.map((idea) => (
          <IdeaCard
            key={idea.id}
            ideaId={String(idea.id)}
            title={idea.title}
            viewCount={idea.view_count}
            timeAgo={formatPostedAt(idea.created_at)}
            likeCount={idea.like_count}
            claimed={idea.claimed_at !== null}
          />
        ))}
      </div>

      {/* Jobs Section */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Latest Jobs</h2>
          <p className="text-xl font-light text-foreground">Find your dream job.</p>
          <Button variant="link" asChild className="text-lg font-light pl-0">
            <Link to="/jobs">Explore all jobs &rarr;</Link>
          </Button>
        </div>
        {rawJobs.map((job) => (
          <JobCard
            key={job.id}
            jobId={String(job.id)}
            companyName={job.company_name}
            companyLogoUrl={job.company_logo_url}
            postedAt={formatPostedAt(job.created_at)}
            title={job.title}
            jobType={job.job_type}
            positionLocation={job.position_location}
            salaryRange={job.salary_range}
            location={job.location}
          />
        ))}
      </div>

      {/* Team Section */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Find a team mate</h2>
          <p className="text-xl font-light text-foreground">
            Join a team looking for a new member.
          </p>
          <Button variant="link" asChild className="text-lg font-light pl-0">
            <Link to="/teams">Explore all teams &rarr;</Link>
          </Button>
        </div>
        {rawTeams.map((team) => (
          <TeamCard
            key={team.team_id}
            teamId={String(team.team_id)}
            leaderUserName="Team Lead"
            leaderAvatarFallback="TL"
            roles={team.roles.split(",").map((r: string) => r.trim()).filter(Boolean)}
            projectDescription={team.product_description}
          />
        ))}
      </div>
    </div>
  );
}
