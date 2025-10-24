import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("routes/_layouts.tsx", [
        index("routes/home.tsx"),
        route("create-campaign", "routes/create-campaign.tsx"),
        route("manage-campaign", "routes/manage-campaign.tsx"),
    ])
] satisfies RouteConfig;
