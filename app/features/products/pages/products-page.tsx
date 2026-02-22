import { redirect } from "react-router";
import type { Route } from "./+types/products-page";

export function loader() {
  return redirect("/products/leaderboards");
} 