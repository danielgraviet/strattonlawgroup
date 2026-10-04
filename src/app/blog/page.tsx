import type { Metadata } from "next";
import Link from "next/link";
import { PhoneCta } from "@/components/phone-cta";
import { getBlogPosts } from "@/lib/content";
import { breadcrumbSchema, jsonLd } from "@/lib/schema";
import { site } from "@/lib/site";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description: `Legal guides and updates from ${site.name}.`,
  alternates: {
    canonical: "/blog"
  }
};

export default function BlogIndexRoute() {
  const posts = getBlogPosts();

  return (
    <>
      {jsonLd(
        breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Blog", url: `${site.url}/blog` }
        ])
      )}
      <section className="section">
        <div className="container">
          <div className={styles.heroGrid}>
            <div>
              <p className="eyebrow">{site.name}</p>
              <h1>Blog</h1>
              <p className="lead">
                Plain-language guides on the legal questions our clients ask most.
              </p>
            </div>
            <aside className={styles.ctaCard}>
              <h2>Have a question about your situation?</h2>
              <p>
                A short call can help you understand your options and what to
                do next.
              </p>
              <PhoneCta label={`Call ${site.phone}`} />
            </aside>
          </div>
          <ul className={styles.list}>
            {posts.map((post) => (
              <li key={post.slug} className={styles.item}>
                <Link href={`/${post.slug}`} className={styles.title}>
                  {post.title}
                </Link>
                <p className={styles.description}>{post.description}</p>
                <p className={styles.date}>Last updated {post.lastUpdated}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
