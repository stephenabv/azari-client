import { Helmet } from "react-helmet-async";
import type { PageMeta } from "./types";
import { SITE_NAME, SITE_URL } from "./types";

interface SeoHeadProps {
  meta: PageMeta;
}

export function SeoHead({ meta }: SeoHeadProps) {
  const fullTitle = meta.title.includes(SITE_NAME)
    ? meta.title
    : `${meta.title} | ${SITE_NAME}`;

  const canonical = meta.canonical
    ? (meta.canonical.startsWith("http") ? meta.canonical : `${SITE_URL}${meta.canonical}`)
    : undefined;

  const og = meta.og ?? {};
  const tw = meta.twitter ?? {};

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={meta.description} />
      <meta name="robots" content={meta.robots} />

      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={og.title ?? fullTitle} />
      <meta property="og:description" content={og.description ?? meta.description} />
      <meta property="og:type" content={og.type ?? "website"} />
      {canonical && <meta property="og:url" content={og.url ?? canonical} />}
      {og.image && <meta property="og:image" content={og.image} />}
      {og.imageAlt && <meta property="og:image:alt" content={og.imageAlt} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content={tw.card ?? "summary_large_image"} />
      <meta name="twitter:title" content={tw.title ?? fullTitle} />
      <meta name="twitter:description" content={tw.description ?? meta.description} />
      {tw.image && <meta name="twitter:image" content={tw.image} />}
      {tw.imageAlt && <meta name="twitter:image:alt" content={tw.imageAlt} />}

      {/* JSON-LD blocks */}
      {meta.jsonLd?.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
