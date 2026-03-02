import { useMemo, useState } from "react";
import { data } from "react-router";
import { StarIcon } from "lucide-react";
import type { Route } from "./+types/product-overview-page";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/common/components/ui/dialog";
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
import { Textarea } from "~/common/components/ui/textarea";
import { Label } from "~/common/components/ui/label";
import { cn } from "~/lib/utils";

const REVIEWS_PER_PAGE = 5;

const DEFAULT_LONG_DESCRIPTION =
  "This is a longer description of the product. It provides more detail about what the product does, who it is for, and what problems it solves. You can include multiple paragraphs here to give visitors a comprehensive understanding before they decide to try it or visit the website.";

const DEFAULT_HOW_IT_WORKS =
  "1. Sign up or create an account on the product website.\n2. Complete the onboarding flow to set up your workspace or preferences.\n3. Explore the main features from the dashboard—start with the quick tour if available.\n4. Use the product regularly; most features unlock or become clearer as you go.\n5. Check the help center or support if you need assistance.";

interface ProductOverview {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  howItWorks: string;
  faviconUrl?: string | null;
  websiteUrl?: string | null;
  reviewCount: number;
  /** Rating from 0 to 5 */
  rating: number;
}

const MOCK_PRODUCTS: Record<string, ProductOverview> = {
  "productId-0": {
    id: "productId-0",
    name: "Product Name",
    description: "Product Description",
    longDescription: DEFAULT_LONG_DESCRIPTION,
    howItWorks: DEFAULT_HOW_IT_WORKS,
    faviconUrl: null,
    websiteUrl: "https://example.com",
    reviewCount: 24,
    rating: 4.2,
  },
  "productId-1": {
    id: "productId-1",
    name: "Product Name",
    description: "Product Description",
    longDescription: DEFAULT_LONG_DESCRIPTION,
    howItWorks: DEFAULT_HOW_IT_WORKS,
    faviconUrl: null,
    websiteUrl: "https://example.com",
    reviewCount: 12,
    rating: 4.8,
  },
  "productId-2": {
    id: "productId-2",
    name: "Product Name",
    description: "Product Description",
    longDescription: DEFAULT_LONG_DESCRIPTION,
    howItWorks: DEFAULT_HOW_IT_WORKS,
    faviconUrl: null,
    websiteUrl: "https://example.com",
    reviewCount: 56,
    rating: 3.5,
  },
  "productId-3": {
    id: "productId-3",
    name: "Product Name",
    description: "Product Description",
    longDescription: DEFAULT_LONG_DESCRIPTION,
    howItWorks: DEFAULT_HOW_IT_WORKS,
    faviconUrl: null,
    websiteUrl: "https://example.com",
    reviewCount: 8,
    rating: 5,
  },
};

for (let i = 4; i <= 10; i++) {
  MOCK_PRODUCTS[`productId-${i}`] = {
    id: `productId-${i}`,
    name: "Product Name",
    description: "Product Description",
    longDescription: DEFAULT_LONG_DESCRIPTION,
    howItWorks: DEFAULT_HOW_IT_WORKS,
    faviconUrl: null,
    websiteUrl: "https://example.com",
    reviewCount: 10 + i * 3,
    rating: 3 + (i % 3) * 0.5,
  };
}

interface ProductReview {
  id: string;
  authorName: string;
  authorAvatarUrl?: string | null;
  rating: number;
  body: string;
  createdAt: string;
}

const MOCK_REVIEWS: Record<string, ProductReview[]> = {};
function getReviewsForProduct(productId: string): ProductReview[] {
  if (!MOCK_REVIEWS[productId]) {
    MOCK_REVIEWS[productId] = [
      {
        id: `${productId}-review-1`,
        authorName: "Alex",
        authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        rating: 5,
        body: "Great product. Exactly what I needed and easy to set up.",
        createdAt: "2024-01-15",
      },
      {
        id: `${productId}-review-2`,
        authorName: "Jordan",
        authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
        rating: 4,
        body: "Solid experience overall. A few small features could be improved.",
        createdAt: "2024-01-10",
      },
      {
        id: `${productId}-review-3`,
        authorName: "Sam",
        authorAvatarUrl: null,
        rating: 5,
        body: "Highly recommend. The team was responsive and the product delivers.",
        createdAt: "2024-01-05",
      },
      {
        id: `${productId}-review-4`,
        authorName: "Taylor",
        authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
        rating: 4,
        body: "Good value. Would use again.",
        createdAt: "2024-01-02",
      },
      {
        id: `${productId}-review-5`,
        authorName: "Casey",
        authorAvatarUrl: null,
        rating: 5,
        body: "Exactly what we needed. Setup was straightforward.",
        createdAt: "2023-12-28",
      },
      {
        id: `${productId}-review-6`,
        authorName: "Morgan",
        authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan",
        rating: 3,
        body: "Decent. Some room for improvement.",
        createdAt: "2023-12-20",
      },
    ];
  }
  return MOCK_REVIEWS[productId];
}

function getProductById(productId: string): ProductOverview | null {
  return MOCK_PRODUCTS[productId] ?? null;
}

export function loader({ params }: Route.LoaderArgs) {
  const productId = params.productId;
  if (!productId) {
    throw data({ message: "Product not found" }, { status: 404 });
  }
  const product = getProductById(productId);
  if (!product) {
    throw data({ message: "Product not found" }, { status: 404 });
  }
  const reviews = getReviewsForProduct(productId);
  return { product, reviews };
}

export function action({}: Route.ActionArgs) {
  return null;
}

type MetaArgs = { data?: { product?: { name?: string; description?: string } } };

export function meta(args: Parameters<Route.MetaFunction>[0]) {
  const { data } = args as MetaArgs;
  const name = data?.product?.name ?? "Product";
  return [
    { title: `${name} | wemake` },
    { name: "description", content: data?.product?.description ?? "" },
  ];
}

interface LoaderData {
  product: ProductOverview;
  reviews: ProductReview[];
}

type TabId = "overview" | "review";
type ReviewSortOrder = "newest" | "oldest";

export default function ProductOverviewPage({ loaderData }: Route.ComponentProps) {
  const data = loaderData as LoaderData | undefined;
  const product = data?.product;
  const reviews = data?.reviews ?? [];
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [reviewSortOrder, setReviewSortOrder] = useState<ReviewSortOrder>("newest");
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewFormRating, setReviewFormRating] = useState(0);
  const [reviewFormBody, setReviewFormBody] = useState("");

  const sortedReviews = useMemo(() => {
    const copy = [...reviews];
    copy.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return reviewSortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    return copy;
  }, [reviews, reviewSortOrder]);

  const totalReviewPages = Math.max(1, Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE));
  const paginatedReviews = useMemo(() => {
    const start = (reviewPage - 1) * REVIEWS_PER_PAGE;
    return sortedReviews.slice(start, start + REVIEWS_PER_PAGE);
  }, [sortedReviews, reviewPage]);

  // Reset to page 1 when sort order changes
  const handleReviewSortChange = (value: ReviewSortOrder) => {
    setReviewSortOrder(value);
    setReviewPage(1);
  };

  const openReviewDialog = () => {
    setReviewFormRating(0);
    setReviewFormBody("");
    setReviewDialogOpen(true);
  };

  const closeReviewDialog = () => {
    setReviewDialogOpen(false);
    setReviewFormRating(0);
    setReviewFormBody("");
  };

  const handleSubmitReview = () => {
    // TODO: submit to server; for now just close
    closeReviewDialog();
  };

  if (!product) return null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10">
      <header className="flex flex-row items-start gap-6">
        <div className="shrink-0 w-32 h-32 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden shadow-md">
          {product.faviconUrl ? (
            <img
              src={product.faviconUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-5xl font-bold text-primary/60">
              {product.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {product.name}
          </h1>
          <p className="text-muted-foreground text-base font-normal">
            {product.description}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <div
              className="flex items-center gap-0.5 shrink-0"
              aria-label={`Rating: ${product.rating} out of 5 stars`}
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const fillPercent = Math.min(1, Math.max(0, product.rating - (star - 1)));
                return (
                  <span key={star} className="relative inline-block size-5">
                    <StarIcon className="size-5 text-muted-foreground/30 fill-muted-foreground/20" />
                    <span
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: fillPercent <= 0 ? "0%" : `${fillPercent * 100}%` }}
                    >
                      <StarIcon className="size-5 fill-yellow-500 text-yellow-500" />
                    </span>
                  </span>
                );
              })}
            </div>
            <span className="text-foreground text-sm font-normal">
              {product.reviewCount} {product.reviewCount === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>
        <div className="shrink-0 flex flex-row items-center gap-2">
          {product.websiteUrl ? (
            <Button asChild variant="default">
              <a
                href={product.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit website
              </a>
            </Button>
          ) : null}
          <Button variant="outline">Rate</Button>
        </div>
      </header>

      <div className="mt-12 pt-12 border-t border-border">
        <div className="flex gap-2 mb-8">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("overview")}
            className={cn(
              activeTab === "overview" && "bg-primary text-primary-foreground"
            )}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "review" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("review")}
            className={cn(
              activeTab === "review" && "bg-primary text-primary-foreground"
            )}
          >
            Review
          </Button>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-30">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                What is this product?
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.longDescription}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                How does it work?
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.howItWorks}
              </p>
            </section>
          </div>
        )}

        {activeTab === "review" && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Reviews{" "}
                <span className="text-muted-foreground font-normal">
                  ({product.reviewCount} {product.reviewCount === 1 ? "review" : "reviews"})
                </span>
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="default" size="sm" onClick={openReviewDialog}>
                  Add review
                </Button>
                {reviews.length > 0 && (
                <Select
                  value={reviewSortOrder}
                  onValueChange={(value) => handleReviewSortChange(value as ReviewSortOrder)}
                >
                  <SelectTrigger className="w-fit min-w-0 justify-start gap-1 px-2.5" size="default">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                  </SelectContent>
                </Select>
                )}
              </div>
            </div>

            <Dialog open={reviewDialogOpen} onOpenChange={(open) => !open && closeReviewDialog()}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Write a review</DialogTitle>
                  <DialogDescription>
                    Share your experience with {product.name}. Your rating and comment will help others.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label>Rating</Label>
                    <div className="flex items-center gap-1" role="group" aria-label="Rate from 1 to 5 stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewFormRating(star)}
                          className="rounded p-0.5 transition-colors hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label={`${star} star${star === 1 ? "" : "s"}`}
                        >
                          <StarIcon
                            className={cn(
                              "size-9",
                              star <= reviewFormRating
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-muted-foreground/30"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="review-body">Your review</Label>
                    <Textarea
                      id="review-body"
                      placeholder="Tell others what you think..."
                      value={reviewFormBody}
                      onChange={(e) => setReviewFormBody(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={closeReviewDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitReview}
                    disabled={reviewFormRating === 0 || !reviewFormBody.trim()}
                  >
                    Submit review
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {reviews.length === 0 ? (
              <p className="text-muted-foreground">No reviews yet.</p>
            ) : (
              <>
              <ul className="space-y-6 list-none p-0 m-0">
                {paginatedReviews.map((review) => (
                  <li
                    key={review.id}
                    className="border-b border-border pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar size="default" className="size-10">
                        {review.authorAvatarUrl ? (
                          <AvatarImage
                            src={review.authorAvatarUrl}
                            alt={review.authorName}
                          />
                        ) : null}
                        <AvatarFallback>
                          {review.authorName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-wrap items-center gap-2 min-w-0">
                        <span className="font-medium text-foreground">
                          {review.authorName}
                        </span>
                        <div className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className={cn(
                                "size-4",
                                star <= review.rating
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-muted-foreground/30"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-muted-foreground text-sm">
                          {review.createdAt}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {review.body}
                    </p>
                  </li>
                ))}
              </ul>
              {totalReviewPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setReviewPage((p) => Math.max(1, p - 1));
                        }}
                        aria-disabled={reviewPage <= 1}
                        className={reviewPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalReviewPages }, (_, i) => i + 1).map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setReviewPage(pageNum);
                          }}
                          isActive={reviewPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setReviewPage((p) => Math.min(totalReviewPages, p + 1));
                        }}
                        aria-disabled={reviewPage >= totalReviewPages}
                        className={reviewPage >= totalReviewPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
