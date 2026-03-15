import { type RouteConfig, index, route, prefix } from "@react-router/dev/routes";

export default [
    index("common/pages/home-page.tsx"),
    route("join", "features/users/pages/join-page.tsx"),
    route("sign-in", "features/users/pages/sign-in-page.tsx"),
    route("auth/logout", "features/users/pages/logout-page.tsx"),
    route("auth/callback", "features/users/pages/oauth-callback-page.tsx"),
    route("my/notifications", "features/users/pages/notifications-page.tsx"),
    route("ideas", "features/ideas/pages/ideas-page.tsx"),
    ...prefix("community", [
        index("features/community/pages/community-page.tsx"),
        route("new", "features/community/pages/post-new-page.tsx"),
        route(":postId", "features/community/pages/post-detail-page.tsx"),
    ]),
    ...prefix("jobs", [
        index("features/jobs/pages/jobs-page.tsx"),
        route("submit", "features/jobs/pages/job-submit-page.tsx"),
        route(":jobId", "features/jobs/pages/job-detail-page.tsx"),
    ]),
    ...prefix("teams", [
        index("features/teams/pages/teams-page.tsx"),
        route("new", "features/teams/pages/team-new-page.tsx"),
        route(":teamId", "features/teams/pages/team-detail-page.tsx"),
    ]),
    ...prefix("products", [
        index("features/products/pages/products-page.tsx"),
        ...prefix("leaderboards", [
            index("features/products/pages/leaderboards-page.tsx"),
            route("/yearly/:year", "features/products/pages/yearly-leaderboards-page.tsx"),
            route("/monthly/:year/:month", "features/products/pages/monthly-leaderboards-page.tsx"),
            route("/weekly/:year/:week", "features/products/pages/weekly-leaderboards-page.tsx"),
            route("/daily/:year/:month/:day", "features/products/pages/daily-leaderboards-page.tsx"),
            route("/:period", "features/products/pages/leaderboards-redirection-page.tsx"),
        ]),
        ...prefix("categories", [
            index("features/products/pages/categories-page.tsx"),
            route("/:category", "features/products/pages/category-page.tsx"),
        ]),
        route("/search", "features/products/pages/search-page.tsx"),
        route("/submit", "features/products/pages/submit-page.tsx"),
        route("/promote", "features/products/pages/promote-page.tsx"),
        route("/:productId", "features/products/pages/product-overview-page.tsx"),
    ])
] satisfies RouteConfig;
