import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard",
        "/communities",
        "/explore",
        "/settings",
        "/c/",
        "/invite/",
        "/login",
      ],
    },
    sitemap: new URL("/sitemap.xml", env.BETTER_AUTH_URL).toString(),
  };
}
