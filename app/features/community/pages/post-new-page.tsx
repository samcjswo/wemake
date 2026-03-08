import { Form } from "react-router";
import { PageHero } from "~/common/components/page-hero";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { Textarea } from "~/common/components/ui/textarea";
import type { Route } from "./+types/post-new-page";

/** Matches community page categories; value is slug for topic_id lookup. */
const CATEGORY_OPTIONS = [
  { value: "ai-tools", label: "AI tools" },
  { value: "design-tools", label: "Design tools" },
  { value: "dev-tools", label: "Dev tools" },
  { value: "productivity-tools", label: "Productivity tools" },
] as const;

export function loader(_args: Route.LoaderArgs) {
  return {};
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") return null;
  const formData = await request.formData();
  const title = formData.get("title");
  const category = formData.get("category");
  const content = formData.get("content");
  // TODO: validate, get profile_id from session, resolve topic_id from category slug, insert post, redirect to /community or post detail
  console.log({ title, category, content });
  return null;
}

export function meta(
  _args: Parameters<Route.MetaFunction>[0]
): ReturnType<Route.MetaFunction> {
  return [
    { title: "New post | Community | wemake" },
    { name: "description", content: "Create a new community post." },
  ];
}

export default function PostNewPage({ loaderData: _loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-10">
      <PageHero
        title="New post"
        description="Share your thoughts with the community."
      />
      <div className="px-20">
        <Form method="post" className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="What's your post about?"
            required
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            required
            className="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
          >
            <option value="">Choose a category</option>
            {CATEGORY_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            placeholder="Share your thoughts..."
            required
            rows={8}
            className="w-full resize-y"
          />
        </div>
        <div className="flex gap-3">
          <Button type="submit">Publish</Button>
          <Button type="reset" variant="outline">
            Clear
          </Button>
        </div>
        </Form>
      </div>
    </div>
  );
}
