# Putting Cloudflare in front of azari.solar

Not done yet. These are the steps for whoever owns the domain and DNS. The goal
is to cut time to first byte (about 1 s from the origin today) by serving
static files, and optionally HTML, from Cloudflare's edge close to visitors.

Nothing in the app has to change: nginx and the app already send the cache
headers Cloudflare follows.

| Response | Cache-Control (set by) |
| --- | --- |
| `/assets/*`, `/fonts/*`, `/preview.jpg` | `public, max-age=31536000, immutable` (nginx) |
| Prerendered pages (`/solar-calculator`, legal pages) | `public, max-age=0, must-revalidate` (nginx) |
| Server-rendered pages | `public, max-age=0, must-revalidate` (app `headers` in `app/root.tsx`) |
| `/admin` | `no-store` (app) |
| `/api/*` | `no-store, no-cache` (nginx); `/api/media/*` one year immutable (backend) |

## 1. Add the site and move DNS

1. In Cloudflare, add `azari.solar` (the Free plan is enough).
2. Check the imported DNS records against the current provider: the apex `A`
   record, `www`, and any `MX`/`TXT` records (mail, Search Console verification).
3. Set the apex and `www` records to **Proxied** (orange cloud). Leave mail
   records DNS-only.
4. At the registrar, change the nameservers to the two Cloudflare gives you.
   Wait until Cloudflare shows the zone as Active.

## 2. TLS

1. SSL/TLS → Overview: set the mode to **Full (strict)**. The origin already
   has a valid certificate, so this keeps the whole path encrypted and verified.
   Never use Flexible: it would make Cloudflare talk to the origin over HTTP.
2. Certbot renewal keeps working as long as port 80 stays reachable through
   Cloudflare (HTTP-01). If renewals fail, switch Certbot to the DNS-01
   challenge with a Cloudflare API token, or install a Cloudflare Origin CA
   certificate on the origin instead.
3. Edge Certificates: turn on **Always Use HTTPS**. Leave HSTS off in Cloudflare;
   nginx already sends it.

## 3. Lock the origin to Cloudflare

Once traffic flows through Cloudflare, stop the origin from answering anyone
else, so the edge cannot be bypassed:

1. Allow ports 80/443 only from Cloudflare's published ranges
   (https://www.cloudflare.com/ips/) in the VM firewall or cloud security group.
2. In nginx, restore the real visitor IP for logs and the backend rate limiter:
   `set_real_ip_from <each Cloudflare range>;` plus
   `real_ip_header CF-Connecting-IP;` in the http context. Without this, every
   request appears to come from a Cloudflare IP and the API rate limit would
   throttle all visitors together.

## 4. Caching

1. Caching → Configuration: Browser Cache TTL **Respect Existing Headers**.
2. Static files are cached at the edge by default from the headers above.
3. Optional, for the biggest TTFB win: a Cache Rule for HTML.
   - When: hostname is `azari.solar` AND the URI path does not start with
     `/api/` or `/admin`.
   - Then: Eligible for cache; Edge TTL: **ignore cache-control, 60 seconds**,
     applied to status code 200 only (add a status-code TTL so 404/5xx are not
     cached); Browser TTL: respect origin.
   - Effect: a CMS edit shows up within about a minute. Purge the cache
     (Caching → Purge Everything, or by URL) after an urgent content change.
4. Do not enable Rocket Loader or Auto Minify: they rewrite scripts and would
   conflict with the Content-Security-Policy and React hydration.

## 5. Compression and protocol

- Brotli is on by default at Cloudflare's edge, whether or not the origin has it.
- Speed → Optimization: HTTP/3 (QUIC) on; Early Hints optional.

## 6. Check

```sh
curl -sI https://azari.solar/ | grep -iE 'cf-cache-status|cache-control|server'
curl -sI https://azari.solar/assets/<any hashed file> | grep -i cf-cache-status   # HIT on the second request
```

Then re-run Lighthouse and compare TTFB and LCP with the numbers before the
switch.

## Rolling back

Set the DNS records back to DNS-only (grey cloud) to send traffic straight to
the origin again, or restore the old nameservers at the registrar. If the
origin firewall was locked to Cloudflare ranges (step 3), reopen it first.
