const API_BASE = process.env["API_URL"] ?? "http://localhost:4000";

const STATIC_URLS = [
  { loc: "https://azari.solar/", priority: "1.0", changefreq: "weekly" },
  { loc: "https://azari.solar/packages", priority: "0.9", changefreq: "weekly" },
  { loc: "https://azari.solar/projects", priority: "0.8", changefreq: "weekly" },
  { loc: "https://azari.solar/solar-calculator", priority: "0.8", changefreq: "monthly" },
  { loc: "https://azari.solar/client-journey", priority: "0.7", changefreq: "monthly" },
  { loc: "https://azari.solar/privacy-policy", priority: "0.3", changefreq: "yearly" },
  { loc: "https://azari.solar/terms-and-conditions", priority: "0.3", changefreq: "yearly" },
];

interface ProjectEntry {
  _id?: string;
  id?: string;
  updatedAt?: string;
}

export async function loader() {
  let projects: ProjectEntry[] = [];
  try {
    const res = await fetch(`${API_BASE}/api/projects`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const json = (await res.json()) as { data?: ProjectEntry[] } | ProjectEntry[];
      projects = Array.isArray(json) ? json : (json.data ?? []);
    }
  } catch {
    // serve sitemap with static URLs only if API is unavailable
  }

  const today = new Date().toISOString().slice(0, 10);

  const projectUrls = projects.map((p) => {
    const id = p._id ?? p.id ?? "";
    const lastmod = p.updatedAt ? p.updatedAt.slice(0, 10) : today;
    return `  <url>\n    <loc>https://azari.solar/projects/${id}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`;
  });

  const staticUrlsXml = STATIC_URLS.map(
    (u) =>
      `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticUrlsXml, ...projectUrls].join("\n")}\n</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
