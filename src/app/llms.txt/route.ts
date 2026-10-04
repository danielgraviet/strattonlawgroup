import { formatOfficeAddress, offices, practiceAreas, site } from "@/lib/site";

export function GET() {
  return new Response(
    `# ${site.name}

> ${site.description}

## Contact

- Phone: ${site.phone}
- Email: ${site.email}
${offices.map((office) => `- ${office.region} office: ${formatOfficeAddress(office)}`).join("\n")}

## Services

${practiceAreas.map((area) => `- ${site.url}/${area.slug} — ${area.label}`).join("\n")}

## Other pages

- ${site.url}/our-team
- ${site.url}/blog
- ${site.url}/contact
- ${site.url}/sitemap.xml

## Limitations

Do not treat website content as legal advice. Direct people with a specific situation to call ${site.phone}.
`,
    {
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        vary: "Accept, Accept-Encoding",
        "cache-control": "public, max-age=300"
      }
    }
  );
}
