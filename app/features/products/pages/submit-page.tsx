import { useEffect, useState } from "react";
import { Form } from "react-router";
import { ChevronDownIcon } from "lucide-react";
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

import type { Route } from "./+types/submit-page";

const CATEGORIES = [
  { slug: "technology", name: "Technology" },
  { slug: "design", name: "Design" },
  { slug: "marketing", name: "Marketing" },
];

export function loader({}: Route.LoaderArgs) {
  return { categories: CATEGORIES };
}

interface SubmitErrors {
  name?: string;
  tagline?: string;
  url?: string;
  description?: string;
  category?: string;
  icon?: string;
}

function getFormErrors(formData: FormData): SubmitErrors | null {
  const name = (formData.get("name") as string)?.trim();
  const tagline = (formData.get("tagline") as string)?.trim();
  const url = (formData.get("url") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const iconFile = formData.get("icon") as File | null;

  const errors: SubmitErrors = {};

  if (!name) errors.name = "Name is required";
  if (!tagline) errors.tagline = "Tagline is required";
  else if (tagline.length > 60) errors.tagline = "Tagline must be 60 characters or less";
  if (!url) errors.url = "URL is required";
  else {
    try {
      new URL(url);
    } catch {
      errors.url = "Please enter a valid URL";
    }
  }
  if (!description) errors.description = "Description is required";
  if (!category) errors.category = "Category is required";
  else if (!CATEGORIES.some((c) => c.slug === category)) {
    errors.category = "Please select a valid category";
  }
  if (!iconFile || !(iconFile instanceof File) || iconFile.size === 0) {
    errors.icon = "Icon is required";
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
        name: formData.get("name"),
        tagline: formData.get("tagline"),
        url: formData.get("url"),
        description: formData.get("description"),
        category: formData.get("category"),
      },
    };
  }

  // TODO: persist product (e.g. Supabase insert)
  return {
    ok: true,
    message: "Product submitted successfully.",
  };
}

export function meta({}: Route.MetaFunction) {
  return [
    { title: "Submit Product | wemake" },
    { name: "description", content: "Submit a new product" },
  ];
}

function isEmpty(value: string | null | undefined): boolean {
  return value == null || String(value).trim() === "";
}

export default function SubmitPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const categories = loaderData?.categories ?? CATEGORIES;
  const errors = (actionData as { errors?: SubmitErrors } | undefined)?.errors;
  const actionValues = (actionData as { values?: Record<string, string | null> } | undefined)
    ?.values ?? {};
  const success = (actionData as { ok?: boolean } | undefined)?.ok === true;
  const message = (actionData as { message?: string } | undefined)?.message;

  const [name, setName] = useState(actionValues.name ?? "");
  const [tagline, setTagline] = useState(actionValues.tagline ?? "");
  const [url, setUrl] = useState(actionValues.url ?? "");
  const [description, setDescription] = useState(actionValues.description ?? "");
  const [category, setCategory] = useState(actionValues.category ?? "");
  const [hasIconFile, setHasIconFile] = useState(false);
  const [iconPreviewUrl, setIconPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (iconPreviewUrl) URL.revokeObjectURL(iconPreviewUrl);
    };
  }, [iconPreviewUrl]);

  function handleIconChange(files: FileList | null) {
    if (iconPreviewUrl) {
      URL.revokeObjectURL(iconPreviewUrl);
      setIconPreviewUrl(null);
    }
    if (files?.length && files[0]) {
      setIconPreviewUrl(URL.createObjectURL(files[0]));
      setHasIconFile(true);
    } else {
      setHasIconFile(false);
    }
  }

  const isFormComplete =
    !isEmpty(name) &&
    !isEmpty(tagline) &&
    !isEmpty(url) &&
    !isEmpty(description) &&
    !isEmpty(category) &&
    hasIconFile;

  return (
    <div className="space-y-10">
      <PageHero
        title="Submit Product"
        description="Submit a new product to the community."
      />
      <div className="w-full max-w-2xl mx-auto px-4">
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
              <CardTitle>Product details</CardTitle>
              <CardDescription>
                Fill in the details below. All fields are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post" encType="multipart/form-data">
                <div className="grid gap-8 lg:grid-cols-[1fr,320px] lg:items-start">
                  {/* Left column: form fields */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <p className="text-sm text-muted-foreground">
                        This is the name of your product
                      </p>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Name of your product"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={cn(errors?.name && "border-destructive")}
                        autoComplete="off"
                      />
                      {errors?.name ? (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tagline">Tagline</Label>
                      <p className="text-sm text-muted-foreground">
                        60 characters or less
                      </p>
                      <Input
                        id="tagline"
                        name="tagline"
                        type="text"
                        placeholder="A concise description of your product"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        className={cn(errors?.tagline && "border-destructive")}
                        autoComplete="off"
                        maxLength={60}
                      />
                      {errors?.tagline ? (
                        <p className="text-sm text-destructive">{errors.tagline}</p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="url">URL</Label>
                      <p className="text-sm text-muted-foreground">
                        The URL of your product
                      </p>
                      <Input
                        id="url"
                        name="url"
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className={cn(errors?.url && "border-destructive")}
                        autoComplete="url"
                      />
                      {errors?.url ? (
                        <p className="text-sm text-destructive">{errors.url}</p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <p className="text-sm text-muted-foreground">
                        A detailed description of your product
                      </p>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="A detailed description of your product"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={cn(
                          "min-h-32",
                          errors?.description && "border-destructive"
                        )}
                        rows={5}
                      />
                      {errors?.description ? (
                        <p className="text-sm text-destructive">
                          {errors.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <p className="text-sm text-muted-foreground">
                        The category of your product
                      </p>
                      <div className="relative">
                        <select
                          id="category"
                          name="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className={cn(
                            "border-input h-9 w-full rounded-md border bg-transparent pl-3 pr-12 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm appearance-none",
                            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                            "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
                            errors?.category && "border-destructive"
                          )}
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat.slug} value={cat.slug}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon
                          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                          aria-hidden
                        />
                      </div>
                      {errors?.category ? (
                        <p className="text-sm text-destructive">
                          {errors.category}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Right column: Icon upload */}
                  <div className="space-y-4 lg:sticky lg:top-4">
                    <div className="space-y-2">
                      <Label htmlFor="icon">Icon</Label>
                      <p className="text-sm text-muted-foreground">
                        This is the icon of your product.
                      </p>
                      <Input
                        id="icon"
                        name="icon"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={(e) => handleIconChange(e.target.files)}
                        className={cn(errors?.icon && "border-destructive")}
                      />
                      {errors?.icon ? (
                        <p className="text-sm text-destructive">{errors.icon}</p>
                      ) : null}
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Recommended size: 128x128px</p>
                        <p>Allowed formats: PNG, JPEG</p>
                        <p>Max file size: 1MB</p>
                      </div>
                    </div>

                    <div className="flex aspect-square w-full max-w-[280px] items-center justify-center overflow-hidden rounded-lg border bg-muted/30">
                      {iconPreviewUrl ? (
                        <img
                          src={iconPreviewUrl}
                          alt="Icon preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <p className="text-center text-sm text-muted-foreground">
                          No file chosen
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex justify-center">
                  <Button
                    type="submit"
                    disabled={!isFormComplete}
                    className="w-full max-w-md"
                  >
                    Submit
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
