import type { Metadata } from "next";
import { Montserrat, Roboto_Slab } from "next/font/google";
import { AnalyticsEvents } from "@/components/analytics-events";
import { DeferredSiteChrome } from "@/components/deferred-site-chrome";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { legalServiceSchema, jsonLd } from "@/lib/schema";
import { site } from "@/lib/site";
import "./globals.css";

const headingFont = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-heading"
});

const bodyFont = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body"
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`
  },
  description: site.description,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${site.name} | ${site.tagline}`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/og-image.jpg"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        {jsonLd(legalServiceSchema())}
        <AnalyticsEvents />
        <DeferredSiteChrome />
        <div className="site-shell">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
