import { useState, useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import type { DateRange } from "react-day-picker";
import { differenceInCalendarDays, startOfDay } from "date-fns";
import { SearchIcon, XIcon } from "lucide-react";
import { PageHero } from "~/common/components/page-hero";
import { Calendar } from "~/common/components/ui/calendar";
import { Button } from "~/common/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/common/components/ui/card";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";

import type { Route } from "./+types/promote-page";
import { searchProducts } from "../queries";
import { requireAuth } from "~/lib/auth.server";

const PRICE_PER_DAY = 20;
const MIN_PROMOTION_DAYS = 3;
const SEARCH_DEBOUNCE_MS = 300;

export interface ProductOption {
  id: string;
  name: string;
  description: string;
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const raw = await searchProducts(q);
  const products: ProductOption[] = raw.map((p) => ({
    id: String(p.id),
    name: p.name,
    description: p.tagline,
  }));
  return { products };
}

export function action({}: Route.ActionArgs) {
  return null;
}

export function meta({}: Route.MetaFunction) {
  return [
    { title: "Promote Product | wemake" },
    { name: "description", content: "Promote your product" },
  ];
}

function getDayCount(range: DateRange | undefined): number {
  if (!range?.from || !range?.to) return 0;
  const from = startOfDay(range.from);
  const to = startOfDay(range.to);
  return differenceInCalendarDays(to, from) + 1;
}

function isValidPromotionRange(range: DateRange | undefined): boolean {
  if (!range?.from || !range?.to) return false;
  return getDayCount(range) >= MIN_PROMOTION_DAYS;
}

export default function PromotePage({ loaderData }: Route.ComponentProps) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchFetcher = useFetcher<typeof loader>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const dayCount = getDayCount(range);
  const totalCost = dayCount * PRICE_PER_DAY;
  const hasValidPeriod = isValidPromotionRange(range);
  const hasProduct = selectedProduct !== null;
  const canCheckout = hasValidPeriod && hasProduct;
  const amountToShow = hasValidPeriod ? totalCost : 0;
  const today = startOfDay(new Date());
  const searchResults = searchFetcher.data?.products ?? [];

  const handleRangeSelect = (newRange: DateRange | undefined) => {
    setRange(newRange);
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchQuery.trim()) {
      searchFetcher.load(`/products/promote?q=`);
      return;
    }
    debounceRef.current = setTimeout(() => {
      searchFetcher.load(`/products/promote?q=${encodeURIComponent(searchQuery.trim())}`);
      debounceRef.current = null;
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current?.contains(event.target as Node)) return;
      setIsSearchOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-10">
      <PageHero
        title="Promote Product"
        description={`Promote your product to the community. Select a start and end date below. Minimum promotion period is ${MIN_PROMOTION_DAYS} days ($${PRICE_PER_DAY} per day).`}
      />
      <div className="flex flex-col items-center w-full">
        <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Product to promote</CardTitle>
          <CardDescription>
            Search and select the product you want to promote.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div ref={searchContainerRef} className="relative space-y-2">
            <Label htmlFor="product-search">Search products</Label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="product-search"
                type="search"
                placeholder="Type to search products..."
                value={selectedProduct ? selectedProduct.name : searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (selectedProduct) setSelectedProduct(null);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setIsSearchOpen(false);
                    if (!selectedProduct) setSearchQuery("");
                  }
                }}
                className="pl-9 pr-9"
              />
              {selectedProduct && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProduct(null);
                    setSearchQuery("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear selection"
                >
                  <XIcon className="size-4" />
                </button>
              )}
            </div>
            {isSearchOpen && !selectedProduct && (
              <ul
                className="absolute z-10 mt-1 w-full rounded-md border bg-popover py-1 text-popover-foreground shadow-md max-h-60 overflow-auto"
                role="listbox"
              >
                {searchFetcher.state === "loading" && searchQuery ? (
                  <li className="px-3 py-2 text-sm text-muted-foreground">Searching...</li>
                ) : searchResults.length === 0 ? (
                  <li className="px-3 py-2 text-sm text-muted-foreground">
                    {searchQuery.trim() ? "No products found." : "Type to search products."}
                  </li>
                ) : (
                  searchResults.map((product) => (
                    <li
                      key={product.id}
                      role="option"
                      tabIndex={0}
                      className="cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground outline-none"
                      onClick={() => {
                        setSelectedProduct(product);
                        setSearchQuery("");
                        setIsSearchOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedProduct(product);
                          setSearchQuery("");
                          setIsSearchOpen(false);
                        }
                      }}
                    >
                      <span className="font-medium">{product.name}</span>
                      <span className="block text-xs text-muted-foreground truncate">
                        {product.description}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          <div className="space-y-2">
            <CardTitle className="text-lg">Promotion period</CardTitle>
            <CardDescription>
              Choose the start and end date for your promotion. Each day costs ${PRICE_PER_DAY}.
            </CardDescription>
          </div>
          <Calendar
            mode="range"
            selected={range}
            onSelect={handleRangeSelect}
            disabled={{ before: today }}
            numberOfMonths={2}
          />

          {range?.from && (
            <p className="text-sm text-muted-foreground">
              {range.to ? (
                <>
                  {dayCount} day{dayCount !== 1 ? "s" : ""} selected · Total: <span className="font-semibold text-foreground">${totalCost}</span>
                  {dayCount < MIN_PROMOTION_DAYS && (
                    <span className="block mt-1 text-destructive">
                      Select at least {MIN_PROMOTION_DAYS} days to continue.
                    </span>
                  )}
                </>
              ) : (
                "Select an end date to complete the range."
              )}
            </p>
          )}

          <Button size="lg" disabled={!canCheckout} className="w-full sm:w-auto">
            Checkout — ${amountToShow}
          </Button>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
