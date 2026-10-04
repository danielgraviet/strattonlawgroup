import { attorneys, offices, practiceAreas, site } from "@/lib/site";
import type { ContentPage } from "@/lib/content";

export function legalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: site.name,
    legalName: site.name,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    slogan: site.tagline,
    areaServed: { "@type": "State", name: "Utah" },
    knowsAbout: practiceAreas.map((area) => area.label),
    location: offices.map((office) => ({
      "@type": "Place",
      name: `${site.name} ${office.city}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: office.street,
        addressLocality: office.city,
        addressRegion: "UT",
        postalCode: office.postalCode,
        addressCountry: "US"
      }
    })),
    employee: attorneys.map((attorney) => ({
      "@type": "Person",
      name: attorney.name,
      jobTitle: attorney.title
    })),
    sameAs: [site.facebookUrl]
  };
}

export function faqSchema(page: ContentPage) {
  if (!page.faqs.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

export function blogPostingSchema(page: ContentPage) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: page.title,
    description: page.description,
    dateModified: page.lastUpdated,
    author: {
      "@type": "Person",
      name: page.reviewedBy
    },
    publisher: {
      "@type": "LegalService",
      name: site.name,
      url: site.url
    },
    mainEntityOfPage: `${site.url}/${page.slug}`
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function jsonLd(schema: unknown) {
  if (!schema) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
