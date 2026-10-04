import type { MetadataRoute } from "next";
import { getAllContentPages } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const contentUrls = getAllContentPages().map((page) => ({
    url: `${site.url}/${page.slug}`,
    lastModified: page.lastUpdated
  }));

  return [
    { url: site.url },
    { url: `${site.url}/our-services` },
    { url: `${site.url}/our-team` },
    { url: `${site.url}/blog` },
    ...contentUrls
  ];
}
