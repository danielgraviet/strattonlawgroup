import Link from "next/link";
import { PhoneCta } from "@/components/phone-cta";
import { navItems } from "@/lib/site";

export default function NotFound() {
 return (
 <section className="section">
 <div className="container">
 <p className="eyebrow">Page not found</p>
 <h1>That page moved or no longer exists.</h1>
 <p className="lead">
 The link you followed may be out of date. Here are a few places to
 find what you were looking for, or call directly if you need help
 now.
 </p>
 <p>
  Agents and link checkers can also use the <Link href="/llms.txt">agent index</Link> or <Link href="/sitemap.xml">XML sitemap</Link> to find valid pages.
 </p>
 <div style={{ marginBottom: "2rem" }}>
 <PhoneCta />
 </div>
 <div className="grid grid-3">
 {navItems.map((item) => (
 <Link className="card" href={item.href} key={item.href}>
 <h3>{item.label}</h3>
 </Link>
 ))}
 </div>
 </div>
 </section>
 );
}
