import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { z } from "zod";

const root = process.cwd();
const contentRoot = path.join(root, "content");

const faqSchema = z.object({
 question: z.string(),
 answer: z.string()
});

const contentSchema = z.object({
 title: z.string(),
 description: z.string(),
 practiceArea: z.string().optional(),
 location: z.string().optional(),
 heroImage: z.string().optional(),
 heroCta: z.string().optional(),
 faqs: z.array(faqSchema).default([]),
 schema: z.array(z.string()).default([]),
 relatedPages: z.array(z.string()).default([]),
 reviewedBy: z.string().default("Stratton Law Group"),
 lastUpdated: z.string()
});

export type ContentPage = z.infer<typeof contentSchema> & {
 slug: string;
 collection: string;
 body: string;
};

export function getCollection(collection: string): ContentPage[] {
 const dir = path.join(contentRoot, collection);

 if (!fs.existsSync(dir)) {
 return [];
 }

 return listMdxFiles(dir)
 .map((file) => {
 const relative = path.relative(dir, file).replace(/\.mdx$/, "");
 return readContentFile(collection, relative);
 })
 .sort((a, b) => a.title.localeCompare(b.title));
}

export function getPage(collection: string, slug: string): ContentPage | null {
 const file = path.join(contentRoot, collection, `${slug}.mdx`);

 if (!fs.existsSync(file)) {
 return null;
 }

 return readContentFile(collection, slug);
}

function readContentFile(collection: string, slug: string): ContentPage {
 const file = path.join(contentRoot, collection, `${slug}.mdx`);
 const source = fs.readFileSync(file, "utf8");
 const parsed = parseFrontmatter(source);
 const data = contentSchema.parse(parsed.data);

 return {
 ...data,
 heroImage: data.heroImage ?? getDefaultHeroImage(collection, slug),
 slug,
 collection,
 body: parsed.content.trim()
 };
}

const sharedHeroImages = [
 "/home/utah-court.jpg",
 "/home/state-of-utah-columns.jpg",
 "/home/utah-tree-mountain-road.jpg"
];

const practiceHeroSlugs = new Set([
 "estate-planning",
 "business",
 "h-2a-h-2b-visas",
 "copyrights-trademarks",
 "bankruptcy",
 "real-estate",
 "personal-injury",
 "non-profit"
]);

function getDefaultHeroImage(collection: string, slug: string): string {
 if (collection === "pages" && practiceHeroSlugs.has(slug)) {
 return `/services/${slug}.jpg`;
 }

 // Stable per slug so server rendering and builds always choose the same image.
 let hash = collection.length;
 for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
 return sharedHeroImages[hash % sharedHeroImages.length];
}

function parseFrontmatter(source: string): { data: unknown; content: string } {
 if (!source.startsWith("---")) {
 return { data: {}, content: source };
 }

 const close = source.indexOf("\n---", 3);

 if (close === -1) {
 throw new Error("Missing closing frontmatter delimiter.");
 }

 const rawData = source.slice(3, close).trim();
 const content = source.slice(close + 4);

 return {
 data: parse(rawData) ?? {},
 content
 };
}

function listMdxFiles(dir: string): string[] {
 return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
 const file = path.join(dir, entry.name);

 if (entry.isDirectory()) {
 return listMdxFiles(file);
 }

 return entry.isFile() && entry.name.endsWith(".mdx") ? [file] : [];
 });
}

export function getAllContentPages() {
 return ["pages", "blog"].flatMap((collection) => getCollection(collection));
}

export function getBlogPosts(): ContentPage[] {
 return [...getCollection("blog")].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
}
