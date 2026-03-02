import { useLocation, useSearchParams } from "react-router";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "./ui/pagination";

type ProductPaginationProps = {
  totalPages: number;
};

function getPageUrl(
  pathname: string,
  searchParams: URLSearchParams,
  pageNum: number
): string {
  const next = new URLSearchParams(searchParams);
  next.set("page", String(pageNum));
  const search = next.toString();
  return search ? `${pathname}?${search}` : pathname;
}

export default function ProductPagination({
  totalPages,
}: ProductPaginationProps) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const rawPage = Number(searchParams.get("page"));
  const page =
    Number.isNaN(rawPage) || rawPage < 1
      ? 1
      : Math.min(rawPage, totalPages);

  const prevUrl = page > 1 ? getPageUrl(location.pathname, searchParams, page - 1) : undefined;
  const nextUrl = page < totalPages ? getPageUrl(location.pathname, searchParams, page + 1) : undefined;

  return (
    <div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={prevUrl ?? "#"}
              aria-disabled={!prevUrl}
              className={!prevUrl ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
          {page === 1 ? null : (
            <PaginationItem>
              <PaginationLink href={getPageUrl(location.pathname, searchParams, page - 1)}>
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
          </PaginationItem>
          {page === totalPages ? null : (
            <PaginationItem>
              <PaginationLink href={getPageUrl(location.pathname, searchParams, page + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={nextUrl ?? "#"}
              aria-disabled={!nextUrl}
              className={!nextUrl ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}