import { getBlogPosts, getPage } from "@/lib/content";
import { formatOfficeAddress, offices, practiceAreas, site } from "@/lib/site";

export function markdownForPath(pathname: string): { body: string; status: number } {
  const path = pathname.replace(/^\/+|\/+$/g, "");

  if (!path) {
    return {
      status: 200,
      body: [
        `# ${site.name}`,
        site.description,
        "## Contact",
        `Call ${site.phone} or email ${site.email}.`,
        "## Offices",
        ...offices.map((office) => `- ${office.region}: ${formatOfficeAddress(office)}`),
        "## Services",
        ...practiceAreas.map((area) => `- [${area.label}](${site.url}/${area.slug}) — ${area.summary}`),
        "## Other pages",
        `- [Our team](${site.url}/our-team)\n- [Blog](${site.url}/blog)\n- [Contact](${site.url}/contact)\n- [Sitemap](${site.url}/sitemap.xml)`,
        "This information is general information, not legal advice."
      ].join("\n\n")
    };
  }

  if (path === "blog") {
    const posts = getBlogPosts();
    return {
      status: 200,
      body: `# Blog\n\nLegal guides and updates from ${site.name}.\n\n${posts
        .map((post) => `- [${post.title}](${site.url}/${post.slug}) — ${post.description}`)
        .join("\n")}`
    };
  }

  const page = getPage("pages", path) ?? getPage("blog", path);
  if (page) {
    return {
      status: 200,
      body: `# ${page.title}\n\n${page.description}\n\n${stripMdxOnlySyntax(page.body)}\n\n---\n\n[Contact ${site.name}](${site.url}/contact) · [Sitemap](${site.url}/sitemap.xml)`
    };
  }

  return {
    status: 404,
    body: `# Page not found\n\nThat page does not exist. Try the [site map](${site.url}/sitemap.xml), [agent index](${site.url}/llms.txt), or [home page](${site.url}/).`
  };
}

function stripMdxOnlySyntax(source: string): string {
  return source
    .replace(/<[^>]+\/?>(?:\s*)/g, "")
    .replace(/\{[^\n]+\}/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
