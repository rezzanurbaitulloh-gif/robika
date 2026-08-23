import type { MetadataRoute } from "next";

const STATIC_ROUTES = [
  "",
  "/login",
  "/register",
  "/academy",
  "/codelab",
  "/leaderboard",
  "/shop",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const now = new Date();
  return STATIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
