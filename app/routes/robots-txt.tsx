export function loader() {
  const content = [
    "User-agent: *",
    "Allow: /",
    "",
    "Sitemap: https://azari.solar/sitemap.xml",
  ].join("\n");

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
