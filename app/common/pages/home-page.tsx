import { Link, type MetaFunction } from "react-router";
import { IdeaCard } from "~/features/ideas/components/idea-cards";
import { JobCard } from "~/features/jobs/components/job-card";
import { PostCard } from "~/features/community/components/post-cards";
import { ProductCard } from "~/features/products/components/product-cards";
import { TeamCard } from "~/features/teams/components/team-card";
import { Button } from "../components/ui/button";
import type { Route } from "./+types/home-page";

export const meta: MetaFunction = () => {
  return [
    { title: "Home | wemake" },
    { name: "description", content: "Welcome to Wemake" }
  ];
};

export default function HomePage() {
  return (
    <div className="px-20 space-y-40">
      {/* Products Section */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold">
            Today's Products
          </h2>
          <p className="text-xl font-light text-foreground">
            The best products made by our community today.
          </p>
          <Button variant="link" asChild className="text-lg font-light pl-0">
            <Link to="/products/leaderboards">
              Explore all products &rarr;
            </Link>
          </Button>
        </div>
          {Array.from({ length: 11 }).map((_, index) => (
            <ProductCard
              id={`productId-${index}`}
              name="Product Name"
              description="Product Description"
              commentCount={12}
              viewCount={4}
              voteCount={120}
          />))}
      </div>

      {/* Discussion Section */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold">
            Latest Discussions
          </h2>
          <p className="text-xl font-light text-foreground">
            The latest discussions from our community.
          </p>
          <Button variant="link" asChild className="text-lg font-light pl-0">
            <Link to="/community">
              Explore all discussions &rarr;
            </Link>
          </Button>
        </div> 
        {Array.from({ length: 11 }).map((_, index) => (
          <PostCard
            postId={`postId-${index}`}
            title="What is the best productivity tool?"
            authorName="Justin"
            category="Productivity"
            timeAgo="12 hours ago" 
            avatarFallback={"N"} 
            avatarSrc={"https://github.com/apple.png"}         
          />
          ))}
      </div>

      {/* Idea Section */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold">
            IdeasGPT
          </h2>
          <p className="text-xl font-light text-foreground">
            Find ideas for your next project.
          </p>
          <Button variant="link" asChild className="text-lg font-light pl-0">
            <Link to="/community">
              Explore all ideas &rarr;
            </Link>
          </Button>
        </div> 
        {Array.from({ length: 11 }).map((_, index) => (
          <IdeaCard
            ideaId={`ideaId-${index}`}
            title="A startup that creates an AI-powered generated personal trainers, delivering customized fitness recommendations and tracking of progess using a mobile app to track workouts and progress as well as a website to track progress and goals."
            viewCount={index * 2}
            timeAgo="12 hours ago"
            likeCount={index * 10} 
            claimed={index % 2 === 0}
          />
        ))}
      </div>

      {/* Jobs Section */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold">
            Latest Jobs
          </h2>
          <p className="text-xl font-light text-foreground">
            Find your dream job.
          </p>
          <Button variant="link" asChild className="text-lg font-light pl-0">
            <Link to="/jobs">
              Explore all jobs &rarr;
            </Link>
          </Button>
        </div> 
        {Array.from({ length: 5 }).map((_, index) => (
          <JobCard
            jobId={`jobId-${index}`}
            companyName="Meta"
            companyLogoUrl="https://github.com/facebook.png"
            postedAt="12 hours ago"
            title="Software Engineer"
            jobType="Full-time"
            positionLocation="Remote"
            salaryRange="$100,000 - $120,000"
            location="San Francisco, CA"
          />
        ))}
      </div>

      {/* Team */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold">
            Find a team mate
          </h2>
          <p className="text-xl font-light text-foreground">
            Join a team looking for a new member.
          </p>
          <Button variant="link" asChild className="text-lg font-light pl-0">
            <Link to="/teams">
              Explore all teams &rarr;
            </Link>
          </Button>
        </div> 
        {Array.from({ length: 5 }).map((_, index) => (
          <TeamCard
            teamId={`teamId-${index}`}
            leaderUserName={`User ${index + 1}`}
            leaderAvatarSrc={`https://github.com/user${index + 1}.png`}
            leaderAvatarFallback={`U${index + 1}`}
            roles={["React Developer", "Backend Developer", "Product Manager"]}
            projectDescription="a new social media platform"
          />
        ))}
      </div>
    </div>
    );
  }
