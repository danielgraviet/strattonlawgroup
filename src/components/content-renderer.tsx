import type { ImgHTMLAttributes } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ContactForm } from "@/components/contact-form";
import { OfficeList } from "@/components/office-list";
import { PhoneCta } from "@/components/phone-cta";

/* eslint-disable @next/next/no-img-element */
function MdxImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  return <img loading="lazy" decoding="async" {...props} alt={props.alt ?? ""} />;
}

function YoutubeShort({ id, title }: { id: string; title: string }) {
  return (
    <figure style={{ margin: "2rem 0", maxWidth: 420 }}>
      <div style={{ aspectRatio: "9 / 16", overflow: "hidden", borderRadius: 16, background: "#111" }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: 0 }}
        />
      </div>
      <figcaption style={{ marginTop: 8 }}>
        <a href={`https://www.youtube.com/shorts/${encodeURIComponent(id)}`} target="_blank" rel="noreferrer">
          Watch: {title}
        </a>
      </figcaption>
    </figure>
  );
}

const components = {
  img: MdxImage,
  PhoneCta,
  ContactForm,
  OfficeList,
  YoutubeShort
};

export async function ContentRenderer({ source }: { source: string }) {
  const { content } = await compileMDX({
    source,
    components,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm]
      }
    }
  });

  return content;
}
