export const site = {
  name: "Stratton Law Group",
  tagline: "A helping hand for life.",
  phone: "(801) 225-3570",
  phoneHref: "tel:+18012253570",
  url: "https://www.strattonlawgroup.com",
  description:
    "Utah law firm offering estate planning, business, visa, intellectual property, bankruptcy, real estate, personal injury, and non-profit legal services from offices in Pleasant Grove, St. George, and South Jordan.",
  email: "info@strattonlawgroup.com",
  clientPortalUrl: "https://mycase.com/login",
  facebookUrl: "https://www.facebook.com/StrattonLawGroup"
} as const;

export const offices = [
  {
    region: "Utah County",
    city: "Pleasant Grove",
    street: "754 W 700 S",
    postalCode: "84062"
  },
  {
    region: "Southern Utah",
    city: "St. George",
    street: "4617 S. Pioneer Road, Suite 101",
    postalCode: "84790"
  },
  {
    region: "Salt Lake County",
    city: "South Jordan",
    street: "10808 S. River Front Parkway, Suite 3029",
    postalCode: "84095"
  }
] as const;

export type Office = (typeof offices)[number];

export function formatOfficeAddress(office: Office) {
  return `${office.street}, ${office.city}, UT ${office.postalCode}`;
}

// Order and titles match the firm's current team page. Headshot-to-name
// mapping follows that page's image order and should be confirmed by the firm.
export const attorneys = [
  { name: "Keven J. Stratton Jr.", title: "Managing Partner", photo: "/team/keven-stratton-jr.jpg" },
  { name: "Keven J. Stratton Sr.", title: "Senior Partner", photo: "/team/keven-stratton-sr.jpg" },
  { name: "Scott Stratton", title: "Founding Partner", photo: "/team/scott-stratton.jpg" },
  { name: "Ken Ivory", title: "Partner", photo: "/team/ken-ivory.jpg" },
  { name: "Kevin K. Goertzen", title: "Partner", photo: "/team/kevin-goertzen.jpg" }
] as const;

// Each slug has a matching MDX page in content/pages.
export const practiceAreas = [
  {
    slug: "estate-planning",
    label: "Estate Planning",
    summary: "Wills, trusts, and plans that protect your family and what you've built."
  },
  {
    slug: "business",
    label: "Business",
    summary: "Formation, contracts, and counsel for businesses at every stage."
  },
  {
    slug: "h-2a-h-2b-visas",
    label: "H-2A and H-2B Visas",
    summary: "Help for employers bringing seasonal agricultural and non-agricultural workers."
  },
  {
    slug: "copyrights-trademarks",
    label: "Copyrights & Trademarks",
    summary: "Protect your brand, creative work, and intellectual property."
  },
  {
    slug: "bankruptcy",
    label: "Bankruptcy",
    summary: "Guidance through debt relief options and a fresh financial start."
  },
  {
    slug: "real-estate",
    label: "Real Estate",
    summary: "Transactions, title questions, and property disputes."
  },
  {
    slug: "personal-injury",
    label: "Personal Injury",
    summary: "Support after an accident or injury caused by someone else."
  },
  {
    slug: "non-profit",
    label: "Non-Profit",
    summary: "Formation, governance, and compliance for mission-driven organizations."
  }
] as const;

export const navItems = [
  { href: "/our-services", label: "Our Services" },
  { href: "/our-team", label: "Our Team" },
  { href: "/contact", label: "Contact Us" },
  { href: "/blog", label: "Blog" }
];

export const footerLinks = [
  ...practiceAreas.map((area) => ({ href: `/${area.slug}`, label: area.label })),
  { href: "/our-team", label: "Our Team" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: site.clientPortalUrl, label: "Client Portal" }
];
