import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentRenderer } from "@/components/content-renderer";
import { PhoneCta } from "@/components/phone-cta";
import { getCollection, getPage, type ContentPage } from "@/lib/content";
import { blogPostingSchema, breadcrumbSchema, faqSchema, jsonLd } from "@/lib/schema";
import { site } from "@/lib/site";
import styles from "./slug.module.css";

type PageProps = {
 params: Promise<{ slug: string }>;
};

type RelatedPage = {
 href: string;
 page: ContentPage;
};

function findPage(slug: string): ContentPage | null {
 return getPage("pages", slug) ?? getPage("blog", slug);
}

function findPageByHref(href: string): ContentPage | null {
 const slug = href.replace(/^\//, "");

 return getPage("pages", slug) ?? getPage("blog", slug);
}

export async function generateStaticParams() {
 return [...getCollection("pages"), ...getCollection("blog")].map((page) => ({
 slug: page.slug
 }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
 const { slug } = await params;
 const page = findPage(slug);

 if (!page) {
 return {};
 }

 return {
 title: page.title,
 description: page.description,
 alternates: {
 canonical: `/${page.slug}`
 }
 };
}

export default async function ContentRoute({ params }: PageProps) {
 const { slug } = await params;
 const page = findPage(slug);

 if (!page) {
 notFound();
 }

 const isBlogPost = page.collection === "blog";
 const relatedPages = page.relatedPages
 .map((href) => ({ href, page: findPageByHref(href) }))
 .filter((related): related is RelatedPage => related.page !== null);
 const heroStyle = page.heroImage
 ? ({ "--hero-image": `url("${page.heroImage}")` } as CSSProperties)
 : undefined;

 return (
 <>
 {jsonLd(faqSchema(page))}
 {isBlogPost && jsonLd(blogPostingSchema(page))}
 {jsonLd(
 breadcrumbSchema(
 isBlogPost
 ? [
 { name: "Home", url: site.url },
 { name: "Blog", url: `${site.url}/blog` },
 { name: page.title, url: `${site.url}/${page.slug}` }
 ]
 : [
 { name: "Home", url: site.url },
 { name: page.title, url: `${site.url}/${page.slug}` }
 ]
 )
 )}
 <section
 className={`${styles.hero} ${page.heroImage ? styles.heroWithImage : ""}`}
 style={heroStyle}
 >
 <div className="container">
 <p className="eyebrow">
 {page.practiceArea ?? (isBlogPost ? "Blog" : site.name)}
 </p>
 <h1>{page.title}</h1>
 <p className="lead">{page.description}</p>
 {isBlogPost && <p className={styles.updated}>Last updated {page.lastUpdated}</p>}
 <div className="button-row">
 <PhoneCta label={page.heroCta ?? `Call ${site.phone}`} />
 </div>
 </div>
 </section>
 <section className="section">
 <div className={`container ${styles.layout}`}>
 <article className="prose">
 <ContentRenderer source={page.body} />
 </article>
 <aside className={styles.aside}>
 <div className="card">
 <h2>A helping hand is a call away.</h2>
 <p>
 Talk with our team about your situation and the options that fit
 your family or business.
 </p>
 <PhoneCta />
 </div>
 {relatedPages.length > 0 && (
 <div className={`card ${styles.relatedCard}`}>
 <h2>Related pages</h2>
 <ul>
 {relatedPages.map((related) => (
 <li key={related.href}>
 <Link href={related.href}>{related.page.title}</Link>
 </li>
 ))}
 </ul>
 </div>
 )}
 <p className="disclaimer">
 This page is general information, not legal advice. Every
 situation depends on its own facts.
 </p>
 </aside>
 </div>
 </section>
 </>
 );
}
