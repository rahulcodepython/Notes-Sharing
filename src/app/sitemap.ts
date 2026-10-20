import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { publicRoutes } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map(({ path, priority }) => ({
    url: new URL(path, env.BETTER_AUTH_URL).toString(),
    changeFrequency: "monthly",
    priority,
  }));
}
