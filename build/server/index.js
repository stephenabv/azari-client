import { createReadableStreamFromReadable } from "@react-router/node";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, useLocation, useNavigate, useOutletContext, useParams, useRouteError } from "react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { createPortal } from "react-dom";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region app/entry.server.tsx
var entry_server_exports = /* @__PURE__ */ __exportAll({ default: () => handleRequest });
var ABORT_DELAY = 1e4;
async function handleRequest(request, responseStatusCode, responseHeaders, routerContext) {
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			onShellReady() {
				shellRendered = true;
				responseHeaders.set("Content-Type", "text/html; charset=utf-8");
				const body = new PassThrough();
				const stream = createReadableStreamFromReadable(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
				pipe(body);
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
		setTimeout(abort, ABORT_DELAY);
	});
}
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary,
	Layout: () => Layout,
	default: () => root_default,
	links: () => links
});
var links = () => [
	{
		rel: "icon",
		type: "image/png",
		sizes: "96x96",
		href: "/favicon.png"
	},
	{
		rel: "icon",
		type: "image/svg+xml",
		href: "/favicon.svg",
		sizes: "any"
	},
	{
		rel: "icon",
		href: "/favicon.ico",
		sizes: "any"
	},
	{
		rel: "apple-touch-icon",
		sizes: "180x180",
		href: "/apple-touch-icon.png"
	},
	{
		rel: "manifest",
		href: "/site.webmanifest"
	},
	{
		rel: "preconnect",
		href: "https://fonts.googleapis.com"
	},
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous"
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Outfit:wght@100..900&display=swap"
	}
];
var THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark-theme':'light-theme');document.body.classList.add(t);}catch(e){}})();`;
var SITE_JSONLD = JSON.stringify({
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "WebSite",
			"@id": "https://azari.solar/#website",
			name: "Azari Solar",
			url: "https://azari.solar/"
		},
		{
			"@type": ["LocalBusiness", "Electrician"],
			"@id": "https://azari.solar/#business",
			name: "Azari Solar",
			url: "https://azari.solar",
			logo: {
				"@type": "ImageObject",
				url: "https://azari.solar/favicon-96x96.png",
				width: 96,
				height: 96
			},
			image: "https://azari.solar/preview.jpg",
			description: "Azari Solar installs affordable solar panel systems for residential and commercial properties in Bohol and across the Philippines.",
			telephone: "+63-961-618-3465",
			address: {
				"@type": "PostalAddress",
				addressLocality: "Tagbilaran City",
				addressRegion: "Bohol",
				addressCountry: "PH"
			},
			geo: {
				"@type": "GeoCoordinates",
				latitude: 9.6571,
				longitude: 123.8543
			},
			areaServed: [
				{
					"@type": "City",
					name: "Tagbilaran City"
				},
				{
					"@type": "AdministrativeArea",
					name: "Bohol"
				},
				{
					"@type": "AdministrativeArea",
					name: "Visayas"
				},
				{
					"@type": "Country",
					name: "Philippines"
				}
			],
			openingHoursSpecification: [{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: [
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
					"Saturday",
					"Sunday"
				],
				opens: "00:00",
				closes: "23:59"
			}],
			priceRange: "₱₱",
			currenciesAccepted: "PHP",
			paymentAccepted: "Cash, Bank Transfer, GCash",
			sameAs: []
		},
		{
			"@type": "Service",
			"@id": "https://azari.solar/#solar-installation",
			name: "Solar Panel Installation",
			serviceType: "Solar Panel Installation",
			provider: { "@id": "https://azari.solar/#business" },
			areaServed: [{
				"@type": "AdministrativeArea",
				name: "Bohol"
			}, {
				"@type": "Country",
				name: "Philippines"
			}],
			description: "Professional solar panel installation for residential and commercial properties. We offer hybrid, grid-tie, and off-grid solar systems with full after-sales support.",
			url: "https://azari.solar/packages"
		},
		{
			"@type": "FAQPage",
			mainEntity: [
				{
					"@type": "Question",
					name: "Does Azari Solar offer installation across the Philippines?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Azari Solar is based in Tagbilaran City, Bohol, and primarily serves Bohol and the Visayas region. We also take on projects nationwide across the Philippines."
					}
				},
				{
					"@type": "Question",
					name: "What types of solar systems does Azari Solar install?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "We install hybrid solar systems, grid-tied (on-grid) solar systems, and off-grid solar systems for both residential and commercial customers."
					}
				},
				{
					"@type": "Question",
					name: "How do I get a quote for solar installation in Bohol?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Use our free Solar Savings Calculator at azari.solar/solar-calculator or browse our packages at azari.solar/packages. You can submit an inquiry directly from any package page."
					}
				},
				{
					"@type": "Question",
					name: "How long does solar installation take?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "A typical residential solar installation takes 1–3 days depending on system size and site conditions. Our team handles everything from design to commissioning."
					}
				},
				{
					"@type": "Question",
					name: "Do your solar packages include installation?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Yes. All Azari Solar packages are supply-and-install — the quoted price covers the solar equipment and professional installation by our certified technicians."
					}
				}
			]
		}
	]
});
function Layout({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en-PH",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1.0"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "geo.region",
				content: "PH-BOH"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "geo.placename",
				content: "Tagbilaran City, Bohol, Philippines"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "geo.position",
				content: "9.6571;123.8543"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "ICBM",
				content: "9.6571, 123.8543"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "theme-color",
				content: "#0f172a"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "author",
				content: "Azari Solar"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "google-site-verification",
				content: "WAIKncjPdupwkR3Gq8LFWOko2B_5dwlGkjAM0xVBbzs"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {}),
			/* @__PURE__ */ jsx("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: SITE_JSONLD }
			}),
			/* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: THEME_SCRIPT } })
		] }), /* @__PURE__ */ jsxs("body", {
			suppressHydrationWarning: true,
			children: [
				children,
				/* @__PURE__ */ jsx(ScrollRestoration, {}),
				/* @__PURE__ */ jsx(Scripts, {})
			]
		})]
	});
}
var root_default = UNSAFE_withComponentProps(function App() {
	return /* @__PURE__ */ jsx(Outlet, {});
});
var ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useRouteError();
	if (isRouteErrorResponse(error) && error.status === 404) return /* @__PURE__ */ jsxs("html", {
		lang: "en-PH",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("title", { children: "Page Not Found — Azari Solar" }),
			/* @__PURE__ */ jsx("meta", {
				name: "robots",
				content: "noindex"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [/* @__PURE__ */ jsxs("div", {
			style: {
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "100vh",
				fontFamily: "sans-serif",
				textAlign: "center",
				padding: "2rem"
			},
			children: [
				/* @__PURE__ */ jsx("h1", { children: "404 — Page Not Found" }),
				/* @__PURE__ */ jsx("p", { children: "The page you are looking for does not exist." }),
				/* @__PURE__ */ jsx("a", {
					href: "/",
					children: "Return to Home"
				})
			]
		}), /* @__PURE__ */ jsx(Scripts, {})] })]
	});
	return /* @__PURE__ */ jsxs("html", {
		lang: "en-PH",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("title", { children: "Error — Azari Solar" }),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [/* @__PURE__ */ jsxs("div", {
			style: {
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "100vh",
				fontFamily: "sans-serif",
				textAlign: "center",
				padding: "2rem"
			},
			children: [
				/* @__PURE__ */ jsx("h1", { children: "Something went wrong" }),
				/* @__PURE__ */ jsx("p", { children: "Please try again later." }),
				/* @__PURE__ */ jsx("a", {
					href: "/",
					children: "Return to Home"
				})
			]
		}), /* @__PURE__ */ jsx(Scripts, {})] })]
	});
});
//#endregion
//#region src/config/firebase.ts
var app = initializeApp({
	apiKey: "AIzaSyDoDrW4HV04xX1UgghOTPyVfg7z66oaN08",
	authDomain: "azari-solar-fb3e7.firebaseapp.com",
	projectId: "azari-solar-fb3e7",
	storageBucket: "azari-solar-fb3e7.firebasestorage.app",
	messagingSenderId: "400363778126",
	appId: "1:400363778126:web:ac2307343b0257e308131f",
	measurementId: "G-EHHQ45EHLF"
});
var analytics = null;
if (typeof window !== "undefined") isSupported().then((yes) => {
	if (yes) analytics = getAnalytics(app);
});
//#endregion
//#region src/services/ASAnalytics.ts
function trackPageView(path) {
	if (!analytics) return;
	logEvent(analytics, "page_view", { page_path: path });
}
//#endregion
//#region src/services/ASContent.ts
var API_BASE$2 = "/api";
var _rlSubs = /* @__PURE__ */ new Set();
function subscribeRateLimit(fn) {
	_rlSubs.add(fn);
	return () => _rlSubs.delete(fn);
}
function notifyRateLimit(res) {
	const sec = parseInt(res.headers.get("Retry-After") ?? "60", 10);
	_rlSubs.forEach((fn) => fn({
		retryAfterSec: sec,
		resetAt: Date.now() + sec * 1e3
	}));
	throw new Error(`rate_limited:${sec}`);
}
async function apiFetch(url, init) {
	const res = await fetch(url, init);
	if (res.status === 429) notifyRateLimit(res);
	return res;
}
async function fetchContent(key) {
	try {
		const res = await apiFetch(`${API_BASE$2}/content/${key}`, { headers: { Accept: "application/json" } });
		if (!res.ok) return null;
		return (await res.json()).data ?? null;
	} catch {
		return null;
	}
}
async function adminGetAllContent(apiKey) {
	const res = await apiFetch(`${API_BASE$2}/admin/content`, { headers: {
		"x-admin-api-key": apiKey,
		Accept: "application/json"
	} });
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Failed to load content: ${res.status}`);
	return await res.json();
}
async function adminUpsertContent(apiKey, key, data) {
	const res = await apiFetch(`${API_BASE$2}/admin/content/${key}`, {
		method: "PUT",
		headers: {
			"x-admin-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({ data })
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) {
		const body = await res.json().catch(() => ({ message: "Unknown error" }));
		throw new Error(body.message ?? `Save failed: ${res.status}`);
	}
	return res.json();
}
async function adminResetContent(apiKey, key) {
	const res = await apiFetch(`${API_BASE$2}/admin/content/${key}`, {
		method: "DELETE",
		headers: {
			"x-admin-api-key": apiKey,
			Accept: "application/json"
		}
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Reset failed: ${res.status}`);
	return res.json();
}
async function adminGetStats(apiKey) {
	const res = await apiFetch(`${API_BASE$2}/admin/stats`, { headers: {
		"x-admin-api-key": apiKey,
		Accept: "application/json"
	} });
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Failed to load stats: ${res.status}`);
	return res.json();
}
async function adminGetTalkInquiries(apiKey, params = {}) {
	const qs = new URLSearchParams();
	if (params.limit != null) qs.set("limit", String(params.limit));
	if (params.offset != null) qs.set("offset", String(params.offset));
	if (params.status) qs.set("status", params.status);
	if (params.search) qs.set("search", params.search);
	const res = await apiFetch(`${API_BASE$2}/admin/talk-inquiries?${qs}`, { headers: {
		"x-admin-api-key": apiKey,
		Accept: "application/json"
	} });
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Failed to load inquiries: ${res.status}`);
	return res.json();
}
async function adminGetQuotations(apiKey, params = {}) {
	const qs = new URLSearchParams();
	if (params.limit != null) qs.set("limit", String(params.limit));
	if (params.offset != null) qs.set("offset", String(params.offset));
	if (params.status) qs.set("status", params.status);
	if (params.search) qs.set("search", params.search);
	const res = await apiFetch(`${API_BASE$2}/admin/quotation-requests?${qs}`, { headers: {
		"x-admin-api-key": apiKey,
		Accept: "application/json"
	} });
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Failed to load quotations: ${res.status}`);
	return res.json();
}
async function adminUpdateTalkStatus(apiKey, id, status) {
	const res = await apiFetch(`${API_BASE$2}/admin/talk-inquiries/${id}/status`, {
		method: "PATCH",
		headers: {
			"x-admin-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({ status })
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Update failed: ${res.status}`);
	return res.json();
}
async function adminUpdateQuotationStatus(apiKey, id, status) {
	const res = await apiFetch(`${API_BASE$2}/admin/quotation-requests/${id}/status`, {
		method: "PATCH",
		headers: {
			"x-admin-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({ status })
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Update failed: ${res.status}`);
	return res.json();
}
async function adminUpdateTalkProjectStatus(apiKey, id, projectStatus) {
	const res = await apiFetch(`${API_BASE$2}/admin/talk-inquiries/${id}/project-status`, {
		method: "PATCH",
		headers: {
			"x-admin-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({ projectStatus })
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Update failed: ${res.status}`);
	return res.json();
}
async function adminUpdateQuotationProjectStatus(apiKey, id, projectStatus) {
	const res = await apiFetch(`${API_BASE$2}/admin/quotation-requests/${id}/project-status`, {
		method: "PATCH",
		headers: {
			"x-admin-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({ projectStatus })
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Update failed: ${res.status}`);
	return res.json();
}
async function adminRetryTalkEmail(apiKey, id) {
	const res = await apiFetch(`${API_BASE$2}/admin/talk-inquiries/${id}/retry-email`, {
		method: "POST",
		headers: {
			"x-admin-api-key": apiKey,
			Accept: "application/json"
		}
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Email retry failed: ${res.status}`);
	return res.json();
}
async function adminRetryQuotationEmail(apiKey, id) {
	const res = await apiFetch(`${API_BASE$2}/admin/quotation-requests/${id}/retry-email`, {
		method: "POST",
		headers: {
			"x-admin-api-key": apiKey,
			Accept: "application/json"
		}
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Email retry failed: ${res.status}`);
	return res.json();
}
async function adminDeleteTalkInquiry(apiKey, id) {
	const res = await apiFetch(`${API_BASE$2}/admin/talk-inquiries/${id}`, {
		method: "DELETE",
		headers: {
			"x-admin-api-key": apiKey,
			Accept: "application/json"
		}
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
	return res.json();
}
async function adminUpdateTalkInquiry(apiKey, id, data) {
	const res = await apiFetch(`${API_BASE$2}/admin/talk-inquiries/${id}`, {
		method: "PUT",
		headers: {
			"x-admin-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(data)
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Update failed: ${res.status}`);
	return res.json();
}
async function adminDeleteQuotation(apiKey, id) {
	const res = await apiFetch(`${API_BASE$2}/admin/quotation-requests/${id}`, {
		method: "DELETE",
		headers: {
			"x-admin-api-key": apiKey,
			Accept: "application/json"
		}
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
	return res.json();
}
async function adminUpdateQuotation(apiKey, id, data) {
	const res = await apiFetch(`${API_BASE$2}/admin/quotation-requests/${id}`, {
		method: "PUT",
		headers: {
			"x-admin-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(data)
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Update failed: ${res.status}`);
	return res.json();
}
async function fetchProjects() {
	try {
		const res = await apiFetch(`${API_BASE$2}/projects`, { headers: { Accept: "application/json" } });
		if (!res.ok) return [];
		return (await res.json()).data ?? [];
	} catch {
		return [];
	}
}
async function fetchProjectById(id) {
	try {
		const res = await apiFetch(`${API_BASE$2}/projects/${id}`, { headers: { Accept: "application/json" } });
		if (!res.ok) return null;
		return (await res.json()).data ?? null;
	} catch {
		return null;
	}
}
async function adminGetProjects(apiKey) {
	const res = await apiFetch(`${API_BASE$2}/admin/projects`, { headers: {
		"x-admin-api-key": apiKey,
		Accept: "application/json"
	} });
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Failed to load projects: ${res.status}`);
	return await res.json();
}
function buildProjectFormData(data) {
	const fd = new FormData();
	fd.append("title", data.title);
	if (data.subtitle !== void 0) fd.append("subtitle", data.subtitle);
	fd.append("category", data.category);
	if (data.categoryColor !== void 0) fd.append("categoryColor", data.categoryColor);
	fd.append("system", data.system);
	fd.append("savings", data.savings);
	if (data.videoUrl !== void 0) fd.append("videoUrl", data.videoUrl);
	fd.append("isRecent", String(data.isRecent));
	if (data.sortOrder !== void 0) fd.append("sortOrder", String(data.sortOrder));
	fd.append("stats", JSON.stringify(data.stats ?? []));
	fd.append("performanceMetrics", JSON.stringify(data.performanceMetrics ?? []));
	fd.append("technicalBreakdown", JSON.stringify(data.technicalBreakdown ?? []));
	fd.append("galleryImages", JSON.stringify(data.galleryImages ?? []));
	fd.append("galleryImageNames", JSON.stringify(data.galleryImageNames ?? []));
	fd.append("heroCards", JSON.stringify(data.heroCards ?? []));
	fd.append("testimonial", data.testimonial ? JSON.stringify(data.testimonial) : "");
	if (data.systemCardSubtext !== void 0) fd.append("systemCardSubtext", data.systemCardSubtext);
	if (data.savingsCardSubtext !== void 0) fd.append("savingsCardSubtext", data.savingsCardSubtext);
	if (data.electricalSystem !== void 0) fd.append("electricalSystem", data.electricalSystem);
	if (data.loadKw !== void 0) fd.append("loadKw", String(data.loadKw));
	if (data.productionKwp !== void 0) fd.append("productionKwp", String(data.productionKwp));
	if (data.storageKwh !== void 0) fd.append("storageKwh", String(data.storageKwh));
	if (data.imageFile) fd.append("image", data.imageFile);
	return fd;
}
async function adminCreateProject(apiKey, data) {
	const res = await apiFetch(`${API_BASE$2}/admin/projects`, {
		method: "POST",
		headers: { "x-admin-api-key": apiKey },
		body: buildProjectFormData(data)
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) {
		const body = await res.json().catch(() => ({ message: "Unknown error" }));
		throw new Error(body.message ?? `Create failed: ${res.status}`);
	}
	return res.json();
}
async function adminUpdateProject(apiKey, id, data) {
	const res = await apiFetch(`${API_BASE$2}/admin/projects/${id}`, {
		method: "PUT",
		headers: { "x-admin-api-key": apiKey },
		body: buildProjectFormData(data)
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) {
		const body = await res.json().catch(() => ({ message: "Unknown error" }));
		throw new Error(body.message ?? `Update failed: ${res.status}`);
	}
	return res.json();
}
async function adminDeleteProject(apiKey, id) {
	const res = await apiFetch(`${API_BASE$2}/admin/projects/${id}`, {
		method: "DELETE",
		headers: {
			"x-admin-api-key": apiKey,
			Accept: "application/json"
		}
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
	return res.json();
}
async function adminPublishProject(apiKey, id, isPublished) {
	const res = await apiFetch(`${API_BASE$2}/admin/projects/${id}/publish`, {
		method: "PATCH",
		headers: {
			"x-admin-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({ isPublished })
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Publish toggle failed: ${res.status}`);
	return res.json();
}
function computeMonthlySavings(productionKwp) {
	const raw = productionKwp * 4 * 30 * 12 * .8;
	const savings = Math.floor(raw / 500) * 500;
	return {
		savings,
		min: Math.max(0, savings - 1e3),
		max: savings + 1e3
	};
}
async function fetchPublicPackages() {
	try {
		const res = await apiFetch(`${API_BASE$2}/packages`, { headers: { Accept: "application/json" } });
		if (!res.ok) return [];
		return (await res.json()).data ?? [];
	} catch {
		return [];
	}
}
async function adminGetPackages(apiKey) {
	const res = await apiFetch(`${API_BASE$2}/admin/packages`, { headers: {
		"x-admin-api-key": apiKey,
		Accept: "application/json"
	} });
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Failed to load packages: ${res.status}`);
	return await res.json();
}
async function adminCreatePackage(apiKey, data) {
	const res = await apiFetch(`${API_BASE$2}/admin/packages`, {
		method: "POST",
		headers: {
			"x-admin-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(data)
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) {
		const body = await res.json().catch(() => ({ message: "Unknown error" }));
		throw new Error(body.message ?? `Create failed: ${res.status}`);
	}
	return res.json();
}
async function adminUpdatePackage(apiKey, id, data) {
	const res = await apiFetch(`${API_BASE$2}/admin/packages/${id}`, {
		method: "PUT",
		headers: {
			"x-admin-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(data)
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) {
		const body = await res.json().catch(() => ({ message: "Unknown error" }));
		throw new Error(body.message ?? `Update failed: ${res.status}`);
	}
	return res.json();
}
async function adminDeletePackage(apiKey, id) {
	const res = await apiFetch(`${API_BASE$2}/admin/packages/${id}`, {
		method: "DELETE",
		headers: {
			"x-admin-api-key": apiKey,
			Accept: "application/json"
		}
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
	return res.json();
}
async function adminGetComponents(apiKey) {
	const res = await apiFetch(`${API_BASE$2}/admin/components`, { headers: {
		"x-admin-api-key": apiKey,
		Accept: "application/json"
	} });
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Failed to load components: ${res.status}`);
	return await res.json();
}
async function adminCreateComponent(apiKey, data) {
	const res = await apiFetch(`${API_BASE$2}/admin/components`, {
		method: "POST",
		headers: {
			"x-admin-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(data)
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) {
		const body = await res.json().catch(() => ({ message: "Unknown error" }));
		throw new Error(body.message ?? `Create failed: ${res.status}`);
	}
	return res.json();
}
async function adminUpdateComponent(apiKey, id, data) {
	const res = await apiFetch(`${API_BASE$2}/admin/components/${id}`, {
		method: "PUT",
		headers: {
			"x-admin-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(data)
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) {
		const body = await res.json().catch(() => ({ message: "Unknown error" }));
		const firstFieldError = body.errors?.fieldErrors ? Object.values(body.errors.fieldErrors).flat()[0] : null;
		const firstFormError = body.errors?.formErrors?.[0];
		throw new Error(firstFieldError ?? firstFormError ?? body.message ?? `Update failed: ${res.status}`);
	}
	return res.json();
}
async function adminGetComponentUsage(apiKey, id) {
	const res = await apiFetch(`${API_BASE$2}/admin/components/${id}/usage`, { headers: {
		"x-admin-api-key": apiKey,
		Accept: "application/json"
	} });
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Failed to check usage: ${res.status}`);
	return res.json();
}
async function adminDeleteComponent(apiKey, id) {
	const res = await apiFetch(`${API_BASE$2}/admin/components/${id}`, {
		method: "DELETE",
		headers: {
			"x-admin-api-key": apiKey,
			Accept: "application/json"
		}
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
	return res.json();
}
async function submitPackageInquiry(data) {
	const res = await apiFetch(`${API_BASE$2}/packages/inquiries`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(data)
	});
	if (!res.ok) {
		const body = await res.json().catch(() => ({ message: "Unknown error" }));
		throw new Error(body.message ?? `Submit failed: ${res.status}`);
	}
	return res.json();
}
async function adminGetPackageInquiries(apiKey) {
	const res = await apiFetch(`${API_BASE$2}/admin/packages/inquiries`, { headers: {
		"x-admin-api-key": apiKey,
		Accept: "application/json"
	} });
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Failed to load inquiries: ${res.status}`);
	return await res.json();
}
async function adminUpdatePackageInquiry(apiKey, id, data) {
	const res = await apiFetch(`${API_BASE$2}/admin/packages/inquiries/${id}/status`, {
		method: "PATCH",
		headers: {
			"x-admin-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(data)
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Update failed: ${res.status}`);
	return res.json();
}
async function adminDeletePackageInquiry(apiKey, id) {
	const res = await apiFetch(`${API_BASE$2}/admin/packages/inquiries/${id}`, {
		method: "DELETE",
		headers: {
			"x-admin-api-key": apiKey,
			Accept: "application/json"
		}
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
	return res.json();
}
async function adminGetIpRatings(apiKey) {
	const res = await apiFetch(`${API_BASE$2}/admin/ip-ratings`, { headers: {
		"x-admin-api-key": apiKey,
		Accept: "application/json"
	} });
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Failed to load IP ratings: ${res.status}`);
	return await res.json();
}
async function adminCreateIpRating(apiKey, data) {
	const res = await apiFetch(`${API_BASE$2}/admin/ip-ratings`, {
		method: "POST",
		headers: {
			"x-admin-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(data)
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) {
		const body = await res.json().catch(() => ({ message: "Unknown error" }));
		throw new Error(body.message ?? `Create failed: ${res.status}`);
	}
	return res.json();
}
async function adminUpdateIpRating(apiKey, id, data) {
	const res = await apiFetch(`${API_BASE$2}/admin/ip-ratings/${id}`, {
		method: "PUT",
		headers: {
			"x-admin-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(data)
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) {
		const body = await res.json().catch(() => ({ message: "Unknown error" }));
		throw new Error(body.message ?? `Update failed: ${res.status}`);
	}
	return res.json();
}
async function adminDeleteIpRating(apiKey, id) {
	const res = await apiFetch(`${API_BASE$2}/admin/ip-ratings/${id}`, {
		method: "DELETE",
		headers: {
			"x-admin-api-key": apiKey,
			Accept: "application/json"
		}
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
	return res.json();
}
async function adminUploadPackageImage(apiKey, id, imageFile) {
	const fd = new FormData();
	fd.append("image", imageFile);
	const res = await apiFetch(`${API_BASE$2}/admin/packages/${id}/image`, {
		method: "PUT",
		headers: { "x-admin-api-key": apiKey },
		body: fd
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) {
		const body = await res.json().catch(() => ({ message: "Unknown error" }));
		throw new Error(body.message ?? `Upload failed: ${res.status}`);
	}
	return res.json();
}
async function fetchClientJourney() {
	try {
		const res = await apiFetch(`${API_BASE$2}/client-journey`, { headers: { Accept: "application/json" } });
		if (!res.ok) return [];
		return (await res.json()).data ?? [];
	} catch {
		return [];
	}
}
async function adminGetJourneySteps(apiKey) {
	const res = await apiFetch(`${API_BASE$2}/admin/client-journey/steps`, { headers: {
		"x-admin-api-key": apiKey,
		Accept: "application/json"
	} });
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Failed to load steps: ${res.status}`);
	return await res.json();
}
async function adminCreateJourneyStep(apiKey, data) {
	const res = await apiFetch(`${API_BASE$2}/admin/client-journey/steps`, {
		method: "POST",
		headers: {
			"x-admin-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(data)
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) {
		const body = await res.json().catch(() => ({ message: "Unknown error" }));
		throw new Error(body.message ?? `Create failed: ${res.status}`);
	}
	return res.json();
}
async function adminUpdateJourneyStep(apiKey, id, data) {
	const res = await apiFetch(`${API_BASE$2}/admin/client-journey/steps/${id}`, {
		method: "PUT",
		headers: {
			"x-admin-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(data)
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) {
		const body = await res.json().catch(() => ({ message: "Unknown error" }));
		throw new Error(body.message ?? `Update failed: ${res.status}`);
	}
	return res.json();
}
async function adminDeleteJourneyStep(apiKey, id) {
	const res = await apiFetch(`${API_BASE$2}/admin/client-journey/steps/${id}`, {
		method: "DELETE",
		headers: {
			"x-admin-api-key": apiKey,
			Accept: "application/json"
		}
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
	return res.json();
}
async function adminReorderJourneySteps(apiKey, steps) {
	const res = await apiFetch(`${API_BASE$2}/admin/client-journey/steps/reorder`, {
		method: "PATCH",
		headers: {
			"x-admin-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({ steps })
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Reorder failed: ${res.status}`);
	return res.json();
}
async function adminPatchJourneyStepStatus(apiKey, id, status) {
	const res = await apiFetch(`${API_BASE$2}/admin/client-journey/steps/${id}/status`, {
		method: "PATCH",
		headers: {
			"x-admin-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({ status })
	});
	if (res.status === 401) throw new Error("Invalid API key.");
	if (!res.ok) throw new Error(`Status update failed: ${res.status}`);
	return res.json();
}
//#endregion
//#region src/hooks/useContent.ts
function useContent(key, defaultValue) {
	const [value, setValue] = useState(defaultValue);
	useEffect(() => {
		let cancelled = false;
		fetchContent(key).then((data) => {
			if (!cancelled && data != null) setValue(data);
		});
		return () => {
			cancelled = true;
		};
	}, [key]);
	return value;
}
//#endregion
//#region src/assets/images/light-toggle-v2.png
var light_toggle_v2_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABMCAYAAADz7pA3AAAN1klEQVR4AeRdXVLcuBaW3EDlkjxAVQjkjV7BkBVcWMGFh1s1SW7VNDMLgKyAsAJgBXheSN5gVtDcFcCsgH4LCUnBVAJJEbo136e2hCzsbrvbNoHpsixZP0fnfD46R5KNCcQt/I6OjiZOTk7mP336tPLhw4ft9+/f7yI+ioJCnDmAzinqHyA0j4+PN0kTefPs4xZEE5UBSiEpMAV/+PDhqVKq2W63NyF0Q0q5iHg2CoiyH6AzgdpzCPNBEKyQJvKa7AN9HbBP9o3ySo5SAX337t0shFlD0ABSYEg1j1DVMcc+CTDA5QjYJk9ldl4KoABwHgI0a7XaEYR5jUAt8uU4REaIsIryJWhWneHJkycyT2Ab0HiGeAHxaqfT2UJM2ohiB0dAgzzRxJDHWGlBF4UCSiYJJABqgj9fE88oLAU/Pz+fBGjPEJYRtqanp/eePn3aYkC7XAfbgMYh4n3EWzMzM6uIn7EP8LGE8DtCyyVKE4O8JnktWmMLAZQOAGBukEkw7gO5TxAh5CSFpeD1ev0M9Uo92AdvFEIDoQ7elgDkntfpPDUWwBZmCoYGFMNn8dGjRxzaqx6zIYCsA8gFguiVVX4JUPempqa0aQG4v3sM0BQ0P378+IuXn/tyYECNVuKu74JB10ZSIwnkMoCMDbXc3JXQgDwB3AZvNvh2gZ2FSQo50ijboF0PBCjtDqYlB2DIaiXSLTC5EGnkDwekD5ABFvnL5B2xPpBepWyUUWfkPOUGFPZmDnaHTodeU3eHO7t1cXHxDEzu64w7dIIChGNjY88AZExbKSNlzStKLkDZAYa4CyY99ys6GzqBvJ3/KPUnJyfPaAagGK8cnqgwnAlw0eBk905mBtSAiTup7SViDusFgMnVTu9e7khpJAu1lbKRa8qaC9RMgHpgCoKJu0l7mTSBJiN3NsAEHFI2yhgJkQvUvoBGxtl6cnbEDmEvzV2M+r0/EWWjjJQ1koqg7kZYRFnJUU9Aj7ArROOMprQnVjPZIfLu9UEZPVBniQUx6SV4T0AxYV9DYw0mYgGHtMSOmP4nBMpKmSGrWdnNRpggK/lIBRR2swGVt/NM3K1XtC/JZMrLvfrt+S9Xyy9Pr5ZfHF0tPx96JZOXU8oM2ddNO2LC1aG59uNEQCNbQe009cPIA5rr6uKOfC2Eog3DSJG3MqOIZOculpYbWrudNvQTAcUeIoQQEACiKNXCzo07PxMV/zQfUZ8ENkpWG42OjnIb0jjiibShfwNQaifugB1aSL++y5P2omDn5B9Df9nQ49DHut/fWbv5CASebNs0QhzChrhLMmQNdqjGz7OqsXgrGsa+B+M63gpOiktrBl0AUNd0wjnFNBTaScQZdBVsdlhjrDMGPLV/fbnRlsFRW47DuVTnWHgD4cia7JtO7bLx31zLyCRxgYnVUpTP+1oaA3RkZGQFlcwR4o4Ym2HycsdfqZlK2dmCEDKEkNakiP4/M2VBTZWZH4LZkePYd5BGQWZrYtSVD/TyH8QEmmlHLdJrLhULKLRzFoWLphB3ohDtfCAeEBAGQxqxzAxqR3XoEAnkWUepTDwZMJUQMY3sCPWXKOAHW0qnbSjNEztzYQGNPLvOR4M/eCf0xZAnGYYAokNQPEoy/N742WiPV3Z9ORa+DUe2d+oIk0xfl6SnqJk+mFKIwxHx1QUinUCfkggba0uBXcM0CUwC3vzfJo2h7zomkz1wTCA6quPaHk0rEEGeoa/b9DtpE+NpJsEM1MWCDPe8kdKPWnq5O4KBnTUlGlCoLDVFz/cw7FuPHz/+I53UYCVJoCqp7F12qarG4kT71xdrsLVNOhME1Q0v6dSa7cb/VhRss9vGpH0TUwaY7AtaSt7NDdJvwjBfA4qpkrWdQJsVWVZ4IKjYYVmSSoRKifWR7TfWuLMzahdB5GwA5Rie0t5olgu9YpLzSnY26bkB+rYPLE3Md9XhnuYWaKwXrZldPuzZ8g+N1RhqQFFshzvswR6uSztGwjd7tXBneTTcee120v7txcqorB0IoUEUWX4ArAFgDy4bz51ZhBD/Ct+2RsM3q6PoQxY4zH2eAKLFCrj9xPLg9PSUk23rDT9//vx/FlQZoGlrqiOwTlfkReT8TQRSbpBGznZDV3/w4MGhQ0S/oBZ8+/bNgonCw6qXmdRMaFpMW8FH7oM0fE3NTSRnAy5H0cSCivX9XACPHgMUFSo7aDOV3k0qpkto6ppvU4uhnE4FTvxPUwoTMBcgQ3t3ZmL+aQt5XXaoSQnNHGiYp7E20Zay0ClfWkcmH7bTaijSP9EpaWPKCvD2tpDXZQZqZyBk4fNQAafGaZeo6Acl5CpO94b0ZICUdQTQVjOvQna5R03IxbJ6uBLjMa9fVj+kCxCtEhoNtUMeNqAyQAMp/kOGyghSKjsNLIN+L5oxDcXs36pvr0a9yq6unwFFq5sXJvaeCUnXGSaRHCJPWiXJzs9g3XmYzRLQwSiltdJeO9HRQEiJuaZtaE2NzSkugb4iYtn5iRoMFxUPqBA9gFKVmRRx/auUn8IBxa4St+qSTAe28dT6tZwiqY4o6GdvXA5+CumagFrBsOt0PVQGJM8NkJHu/qVE7AZvP1PZfgfsKr2ZUtbzZucnnVyvEg+zMwLaq35pZUrJ0vYMOkIUvv2YBgRmRq5JaQVSSns38ezZTvLTCBSVPyLGXAdVFFlNZ1QouwukM0o8YTHkAnoWYGJqn7NcXV3VS+w7Rpr7ltjfLHzvVWKvVWL7LtZZiRfuXgiw/BOT+8BqKC4q01DK+F0pPhaxDoR5QwbYsI7r+IYk1785Vpeu32kF0EoLKJqXONkGde/gRnAn45NMr2niJWlVqZ0RE3ZVhuF/GHibpHNpL0FFjQuPxsI3mwqPQ4YlTBqkNSydPO39zfkvX74cBtEmqbVl3CTNQ7SIunxUAe3i/HWQ4c/57SvSKIKXPDQuLy/5zMs00ZvzQXRl90ExDShtFyjqSyRtAlO7vuPhGoC1D75M/dRYqf0a2rBtVMdG7KOCbTyLFRySngZqQAGinWbAMZWwR9mVkwJ2n2oG2Ch5cXTpvWtEmwpwGgC2Dm+9KgAYWl5rrRIt5nF419TFJB744Vn72xsLhHZF71JhyunaT42hBhQ7JhzyhnH7jFkU+COYfKNDYANYdH+p7xoR2Fq4s0XAsNqaROiuuMKdOvM4vNOeZnLjGp7X2Q+VmV/76bKV7Ry9xaw9PPprTU1NEcPr1xmRad/QRXotG9lstQyYynujoyOUnQNno9S/lv+iQ7eFLBxUdyRDUzWY7EtrKBOwAfwYAJMMsRegmDFMoGb6YEohMr1r5Oxnwkz0fxWSC4ZO9wUzj+Vs71J5jRIvuX6H0i2aQpjMdZMOTALDnrbIIo051ZopGybWQ9DTTIKZ+Y2O6/1MDC+ZabnKDRGAykVDjPVAFPMuFbQTDxe7pKGIsRfrLKAsdpHGdYN3AvFQhz8EJTQzM5jdngFkN4Gzu27GZfqRBKpKeZcqncrNEmKCIW4dNxQvdpNjgEJLqaEMmhIqb+vEECcOQXjtqt41inFKUDErSH2XKlY544WrnWiyb5wR0vqIAcocT0tvvPLMOnkDvfZoBe8aJfGFWUHiu1RJdfvl8W+3XO0EVglmxaMSaanr8VP/Jsdreq8voyW561cSX5m/oaFEBfuiNLpmXtr3z/HYpsRg+EAXio4TcfXH+Pg4baW25/Dw/HqF9ewuN4mAcn2PRladkV49Pj52JssuiXLT8NZc4xNIrtkThSiXAyH4+Td3qCP9GiOZPN3oOhFQ1pqenuZSyg59GOM12JBKt/fIBx0LVkq53rFnuxyhZ1XKDFtJ7dT1ME3a6vW3W6mAsjWHPrTT3AlOWTL9zTjb3ofAKRLk2EXQB7H4+rX3Hz70BJRDH3dkgYQ0RSH034xHHUVZ9zOijJg2NiGdtZvEot/7sz0BBTFBWwGbsYS0cQ73HlQfTMpODIgF0j2PvoCyNWzGIWJ+rC8GKu0L8u/VQZlczYRwlDnz91UyAQqiIglU5PP7nLfi/dF34Ufkze0wRwe5wET96+07XvQLBlTHpgp4/w3c1Ts9+eek/eTkZIPeHLJNEAfEdMaZNZNtGDJrKCszEFQa56hDZjE0+HmzIj7GR2JVBgA5T94hjx1pSLcoI2XNy0tuQNkBjTM/b4a0nacirT/GR22lUcf1D32QR/DaBHjuEBcA0nx2jhqaW4aBAGUvnFLhDvKuLoMpt3N+OrKSz/OSj7yBQOLxRQjHc4S27lPLM8ixNDMzs9pvaoR2qcfAgBqKADXEXeVc1X9aqYEF87sIdnfbtKs65tCmRhJITIHsfib5AP9b5+fn9Wh1yKyBw9CAsmeaADCjv8mJa7ufirQA84sIuxBGay3BpRNgWZmBfRBE7EFsItYf1UZ/rkbiUuzDEfH7fUNpJQmZUAighhiBhcYukEmAyL0AU8SYK44G8nfhBPS35ykspyoQmB/BnuNwZMU8gW0YeKNICzduG+GAfWAINzELWUGsPbdDVwNJXsFzTAGcOr2SqWWFAmp6IZPYybaf54VAro011fQn0QH+JsrpGA44HAFG5n8KwLpsw8AbRVogzo8BJG3i0Eauow6/vlvaZ4xLARRC6QPAtmgKEPhJ9QXaKhRw1YWokmOffQJEzicnwUfqtltR3JQKqMskwN2nB8Uw059Ep5AoN9+d57Aj0FyZIDvXQe1vQUNpYvgofJW04WT4aXdtH9l3LopDVP4bAAD//+/r1+EAAAAGSURBVAMAQALOgng9//EAAAAASUVORK5CYII=";
//#endregion
//#region src/assets/images/dark-toggle-v2.png
var dark_toggle_v2_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABMCAYAAADz7pA3AAAM9klEQVR4AeRd3W4TSRauajsNiTDrJJCQZCN5xGDEaNCC9gWYJ1jmYiVgVhpnXwDegOQN4AnivQlIezHsE8ALrIbVIEUyyuJVQgIJIV5llWDHdu33VVw17X+X43Ycj9UnVV1dVeecr0+d+unuiidO4aeUiuzs7MQ+fPgwtbW1lfj48ePVz58/f0tC+h9daHt7+9anT59uoEzy/fv386wT8Rh5nIJqom+AUkkqjDAJAG5B2WQkEpmPRqOTnufFS6XSORLSnQ4pZQTgjaFQzPf9KdaJuOYBPjcqPGNI68sRKqBQ1AeAM7QiaJOkwgj7phz4j1V4JmG5N9kakOZDhtCOUAAFiDEQreQmJJ+lFSGsOpB2UCwWd8+fP78OK13L5XJvSJcvX/6nC7HM0dHRKirPsK5CobDNunFedcByffCZhNXepIuBfKHc2J4CSiFBSWhCqhIYyhSpLK5lLl269Bq0OjMzk43FYtvj4+O5a9eu5Um47nSwzOzs7AFuwj7rmpubW2fdoNfgucabBjDzwUrpYnCepKy9ttieAAqhIru7u7+nkKAqIHG+D8oAtH9RWSoOCyohLdSDPMAzx5s2MTHxhuCWy+VcDdMYLbaXruDEgL579y6OO30Twk4HhaVlwEp+AYAZEEENXu57nOBOT0+vUSbKFhQAYE/CDVzf2NiYDKZ3E+8aUGOVFy5cuApriASY71NoWgbSC4H0gYhSJspGGYPAwi34586dS3BUQN26FbYrQMHQxx39JmiVEIh+itaYodDdCtSvcpSRwALEbEV2zZqjAupGHXWC4x9nQMFoFAyvQwg7/ICTZ8eyOghN21F/cfHixV24g9Vaa6WOm5ubHN86VekEKMGEv7RgwvcUYaUbk5OT67jjoXc0Tpo5ZKbstFYOu0wxGgz0S7qC2jGgBkww1/4SDPPxeDwDR//RCHHWQw67OKalbtSFurqC2hGgNWAKMkQzoa88JONhIo5pqRt1pF6uoLYFFGCyA/qaFZMBGZEhzgeuB6d8vSDqRh2pK+vDeQT9xFViwfNW1BJQVBChc0bFugNCmCcjMBhaMA1Y1JG6UmemIaRhXScmPG9GLQHFctoMKzKFwWCNjMz5sIfU9cuXL/8GiLrDJRbopGZb6d0UUM4a0IPb2Q/iG2AwdD6zFTi8Rp86Ojq6yTiJ49S9vb04442oIaC4I1yZsXeCY7Rh6s0bAdEqjb1/ZWFHZ8NIIAGM9GhHJwT+NAQUa4ezNG/mQ5i/cuXKOuO/ZYKlbhILYoCWGmnW9OsABfK0TrtIgHHYFirQPoSV9YMKqT/fKqQepI4W7j8p/fXBcpCOUg8Wi6n7d1XqXqIfshgexABPFP5jztn0McmpXVmrfwSC5SwrKJs6p2amkjDDo9S9OwSwuPDDnidHfvakWJZCPlRKpIIkpXgspPypJL13xYX7L5H/x36BW5laB1fOZmoxqbLQCuIWdTR164xrC/bqnEASGCm9lwRQCNXU4dfzlHeQPw1wX8KKH/cDWKxSZQNy8MmExYvpVYCiJ59iIonWKaUMfbwZFSILN7MklXhUVupv4B0UGKcdHegkxCKBpcV2VKLLTMSE2ASKV1mpBRRK+ZgNWOvoh3VSKJl+nh1JP38VSa889dPPUtHlla+EUt+DXvG6I8FdqTSt1bGcU/YabPjIWk98WIkFlD07E0iw1BzvBOM9IqdqoulnL0DflVV5AQWdLRY+d7GIzgxlQzkq2Fhfin7HduIWUGSyvgA92G4okjhW6qefpyPKv10+dgVupdGZhQkqhNkC6QOt206ANKDsjDDG0maLkPP12odZuuBp/JHpdI6uAFa35MwfoIbV/NnjA0g9nIQx6jdhKJ8GFL7zdzwh5fP5/zEcNBpJrywqJZ66yoUyixxJuJbrJD+M75PJZzDUgAJp29yxaj0w1mmENSFAfSSEcu6spPSWTR29DNHX/NfUh7h+XOIBzAhIn/AiVuGts+X5oNGRUuyoXG96gjOsXuuCMelBoE729hEPPZQFE77gAKT9QiDjQEVHMcxCM3Zu+lKKh71WREpZAllQiaWH+emoYYRVlDOxPBcV/hPI7Gql8TB8KfyoBZRYeiMjIz6E00cQbZ0woH/Y88NKOatyktAT3o9OBTrIjE7cGiFdp2ecKcsCbXuR54NN5Reu8ikp7ooe/w4PD+30HD19xINVRgwPONmiiQ96GBXnXwshnJt9rxdQEomEbfLGQs+JX38D3SH9KqYQbPZSSOdpqZDeH0SIvyoLlX1YXXLQpW1WJcvOgJaUGG9bsUOGIGZwmb4e2DuUH6is5bKwA+tOBVNCYEVKhPY704CGhsoJKj7TgHqesGsQnWIghXB2E8Lhx4G97fbRS9kxqUMdp5ZVKs+5+Srh7ndbKRjEDPGS1yrzoF9TQt1ylVGJkutQqx0LO+z0PC/PXt6Oo3K5nJ3Xt6vltK93N41UWT/9d45feyY+5u94LHZcnbZQ3/eLx6dCYBp1Zpq8kjJl5O40lEo6L/21q5vzd5MHFnrgAcRDkwCEz4SFHqbuJTwh/2Tk7jT0pHCeroo2v+BaCBaXCh4GoxZQXLQrT23qOdXLeDzLRY64mxAqK5dX/uFWpn1uGKFdnCeWHubv1ofi4hjIOtn21fU/B60TK02LXXDupkxLNsQKZFs1sfQwdSqhlF2lh5O1GZA+cIcvvZ/chVLZ6PIz5+W+dnyy2ay1TuCoF+c9FqIzZUhC3HmwzHL9ID7BVEK0GiqJRj9YER+bNLp0ojQ8f7NuB4Bqo9SAYk3UzonRa106EZeQCmswlXButnAPSyPp5z3v3QV+ANFaqMFQA9rsGTPKnPqhUnfjfGEBwDiDyRck8KTUuVwnSvMbV3RCepiJME8MWU4DygjQDn5vVPUCFK+fBh2l7t0pybGfhRLOY06CyRckREi/sbEx+/oNhp72XQYLKHqo4Os3fCSq0Q9JnpbVEkjziiMyus/XlVgKE0z4ZIzcPOs/gy+PeRBYH7BQLpJox8qE4MtjPA+L+EiCAJZSf3kIP7lcXPhhT0rvpRDyjnD+qaxS5e/CauZGnCA28J1VL9ZZQCuZ7QtQ0Wh0UikVupV+AWMp5GOsvj+Bn0TTVvbO41KnRw5llyLq8HZYHZARhJgQG3OOUdG2iTOsArTiWK2VYkzq3NxYqQvxxYXjVxeFecuu8/VKpV5JJR5F1MFXtEqZftHrlaQ6VYLWiYv7FcwQPT6qAD1OEtZKcV73yjPSQjn89Mprv/LCbVmJ2wQK1vAUYTpItESh1PcAcZw3IpJeedoPIKk0v90KWif6nbqbXwcoEQ9+k4NxaQKK9XU66gNcAjWSfvYI4UKQRtIriwDyRb9AJJAkYgAwq77dqvQ7vGypDlBe4Tc5qKDEOMZYfrNvcnj9t0Jo6vPEgvoi5Ldbm4zXUkNAgXwJK0/WnLFmOoUK7QcNtZUM+zl1h3XacSfi/HaLo6I61RsCylzj4+O5YNNHbzYLSx3ohRPK3QW1LIKWOgqLnDeZgMN2q2+3mgLKCtj0URk3ZxGw2ggq6+ibcZYdBgKY/KT7a6MLsZiYmGjY1E2eloACxBIsNcOKWAAhGfCb8dDHp+R3mlQB0+6vAt357QF3sdB9SzPZWgLKQgC1UPvNODclIENeH0aibtQRIGrDgc8swrA62iugLaAEDE2fG/9lwEjfHTIiw2H0qdCxahslghmPx2mZ9lERMWlGHQHKwo1AxUjgBntAXh8Goi47Ozu2mbuCSQw6BpSZDaiwUN1RMQ3x+cpmfH0d/JN3rwhWqTdDpC5wcVoPxPMulmlkcQKUhQgq/IntqJiGO8nN+L7h1IznZ4lgkTG4r7pt56gjwO2omQf1dQaUhcGoAIarwXEq7qjejK9irdqZM++gEqySu+8mIR+3LrbyYmiot52jjrjmfHQFKLmAYWlubm69djM+WitWqfqyPS/lcCUCyZtOGVHWPhOC3EXQ2km3nesaUAijD84aYK2Zmm/IBYSz2/O22kVGV9KHP2zaIL2NMWULsqRVwl++gR4nXv47MaAUDNZa4GZ8WM76Bed2PRVxAWHjAPsqelBttQQXVqIdP6+HReQBAGPcD9Rsqg1e1iIR50FZMye1SlZkqCeAmsoILJb/MjjP8NEAQnvQx9IyCC6am957nsoC6CkqzjHt27dvgx9Q2LKtIixD4o1iXZXmfIM8UE7vTA65am+gBpKyghhHVqejaeaeAmq4UMjpwPa8ANMOs0weWNAYV7FwjQsPSY5p0ey+BbhO/xiAZUi8UayLN411Gz4mRDrfMtxiK4J83Di2p0AaPqEAaiqHZWhXgAWFN0jLcFSANPsuFdLCPvbJE0z0ptoAchP8Gy67IU9PjlABDUoIZfY5KoCFrIL40qvddx759qHoQcWKcNr5AavMk+hiYKV6X3yUzpAHeGbIE2Eo1gg+dcf/AQAA///GVc9QAAAABklEQVQDADN3cxgSPPCXAAAAAElFTkSuQmCC";
//#endregion
//#region src/components/ASNavbar.tsx
function ASNavbar({ theme, toggleTheme }) {
	const [activeTab, setActiveTab] = useState("");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const navbarRef = useRef(null);
	const [indicatorStyle, setIndicatorStyle] = useState({
		left: 0,
		width: 0
	});
	const navigate = useNavigate();
	const location = useLocation();
	const navMenuRef = useRef(null);
	const tabRefs = useRef({});
	const tabs = [
		"Home",
		"Client Journey",
		"Projects",
		...useContent("section-visibility", { packages: true }).packages !== false ? ["Packages"] : [],
		"System Calculator"
	];
	const tabRoutes = {
		Home: "/",
		Projects: "/projects",
		Packages: "/packages",
		"Client Journey": "/client-journey",
		"System Calculator": "/solar-calculator"
	};
	const updateIndicator = (tab) => {
		if (!tab) return;
		const activeEl = tabRefs.current[tab];
		const menuEl = navMenuRef.current;
		if (activeEl && menuEl) {
			const menuRect = menuEl.getBoundingClientRect();
			const activeRect = activeEl.getBoundingClientRect();
			const width = activeRect.width + 4;
			setIndicatorStyle({
				left: activeRect.left - menuRect.left + activeRect.width / 2 - width / 2,
				width
			});
		}
	};
	useEffect(() => {
		const currentPath = location.pathname;
		const matchedEntry = Object.entries(tabRoutes).find(([_, path]) => {
			if (path === "/") return currentPath === "/";
			return currentPath.startsWith(path);
		});
		if (matchedEntry) setActiveTab(matchedEntry[0]);
		else setActiveTab("");
	}, [location.pathname]);
	useEffect(() => {
		if (!activeTab) return;
		updateIndicator(activeTab);
	}, [activeTab]);
	useEffect(() => {
		const handleResize = () => {
			if (!activeTab) return;
			updateIndicator(activeTab);
			if (window.innerWidth > 768) setIsMobileMenuOpen(false);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [activeTab]);
	useEffect(() => {
		if (location.pathname === "/" && location.hash === "#calculator") {
			setActiveTab("");
			setTimeout(() => {
				const calculatorSection = document.getElementById("calculator");
				if (calculatorSection) calculatorSection.scrollIntoView({
					behavior: "smooth",
					block: "start"
				});
			}, 100);
		}
	}, [location.pathname, location.hash]);
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (navbarRef.current && !navbarRef.current.contains(event.target)) setIsMobileMenuOpen(false);
		};
		const handleEscapeKey = (event) => {
			if (event.key === "Escape") setIsMobileMenuOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);
		document.addEventListener("keydown", handleEscapeKey);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
			document.removeEventListener("keydown", handleEscapeKey);
		};
	}, []);
	const handleTabClick = (tab) => {
		setIsMobileMenuOpen(false);
		setActiveTab(tab);
		navigate(tabRoutes[tab]);
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
	return /* @__PURE__ */ jsxs("nav", {
		className: "ASNavbar",
		ref: navbarRef,
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "nav-logo",
				onClick: () => {
					setActiveTab("Home");
					navigate("/");
					window.scrollTo({
						top: 0,
						behavior: "smooth"
					});
				},
				role: "button",
				tabIndex: 0,
				onKeyDown: (event) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						setActiveTab("Home");
						navigate("/");
						window.scrollTo({
							top: 0,
							behavior: "smooth"
						});
					}
				}
			}),
			/* @__PURE__ */ jsxs("ul", {
				className: "nav-menu",
				ref: navMenuRef,
				children: [tabs.map((tab) => /* @__PURE__ */ jsx("li", {
					ref: (el) => {
						tabRefs.current[tab] = el;
					},
					className: activeTab === tab ? "active" : "",
					onClick: () => handleTabClick(tab),
					children: /* @__PURE__ */ jsx("span", {
						className: "nav-link-text",
						children: tab
					})
				}, tab)), activeTab && /* @__PURE__ */ jsx("span", {
					className: "nav-indicator",
					style: {
						left: `${indicatorStyle.left}px`,
						width: `${indicatorStyle.width}px`
					}
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "nav-actions",
				children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "theme-toggle-btn",
					onClick: toggleTheme,
					"aria-label": theme === "dark-theme" ? "Switch to light mode" : "Switch to dark mode",
					children: /* @__PURE__ */ jsx("img", {
						src: theme === "dark-theme" ? dark_toggle_v2_default : light_toggle_v2_default,
						alt: "Theme toggle",
						className: "theme-toggle-img"
					})
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: `mobile-menu-btn ${isMobileMenuOpen ? "open" : ""}`,
					onClick: () => setIsMobileMenuOpen((prev) => !prev),
					"aria-label": "Toggle navigation menu",
					"aria-expanded": isMobileMenuOpen,
					children: [
						/* @__PURE__ */ jsx("span", {}),
						/* @__PURE__ */ jsx("span", {}),
						/* @__PURE__ */ jsx("span", {})
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: `mobile-nav-menu ${isMobileMenuOpen ? "open" : ""}`,
				children: tabs.map((tab) => /* @__PURE__ */ jsx("button", {
					type: "button",
					className: activeTab === tab ? "active" : "",
					onClick: () => handleTabClick(tab),
					children: tab
				}, tab))
			})
		]
	});
}
//#endregion
//#region src/components/ASFooter.tsx
var DEFAULT_FOOTER = {
	id: "",
	phone: "+63 961 618 3436",
	email: "sales@azari.solar",
	socials: {
		facebook: {
			name: "Facebook",
			url: "https://www.facebook.com"
		},
		Instagram: {
			name: "Instagram",
			url: "https://www.instagram.com"
		},
		TikTok: {
			name: "TikTok",
			url: "https://www.tiktok.com"
		}
	},
	footer_text: {
		credits: "Designed by Orland Developed by Stephen & Adriel",
		privacy_policy: {
			name: "Privacy Policy",
			url: "https://azari.solar/privacy-terms"
		},
		terms_conditions: {
			name: "Terms and Conditions",
			url: "https://azari.solar/terms-and-conditions"
		}
	}
};
function ASFooter() {
	const footerRef = useRef(null);
	const hasAnimated = useRef(false);
	const [isShown, setIsShown] = useState(false);
	const resolvedFooter = useContent("footer", DEFAULT_FOOTER);
	const socials = useMemo(() => {
		return Object.values(resolvedFooter.socials ?? {});
	}, [resolvedFooter.socials]);
	useEffect(() => {
		const el = footerRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting || hasAnimated.current) return;
			hasAnimated.current = true;
			setIsShown(true);
			observer.disconnect();
		}, { threshold: .25 });
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ jsxs("footer", {
		ref: footerRef,
		className: `as-footer ${isShown ? "is-shown" : ""}`,
		children: [
			/* @__PURE__ */ jsx("div", { className: "as-footer-bg as-footer-bg-logo" }),
			/* @__PURE__ */ jsx("div", { className: "as-footer-bg as-footer-bg-shape" }),
			/* @__PURE__ */ jsxs("div", {
				className: "as-footer-content",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "as-footer-middle",
					children: [
						/* @__PURE__ */ jsx("a", {
							href: `mailto:${resolvedFooter.email}`,
							className: "as-footer-link",
							children: resolvedFooter.email
						}),
						/* @__PURE__ */ jsx("a", {
							href: `tel:${resolvedFooter.phone}`,
							className: "as-footer-link",
							children: resolvedFooter.phone
						}),
						/* @__PURE__ */ jsx("div", {
							className: "as-footer-socials",
							children: socials.map((item) => /* @__PURE__ */ jsx("a", {
								href: item.url,
								className: "as-footer-link",
								target: "_blank",
								rel: "noreferrer",
								children: item.name
							}, item.name))
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "as-footer-bottom",
					children: [/* @__PURE__ */ jsx("span", { children: resolvedFooter.footer_text?.credits }), /* @__PURE__ */ jsxs("div", {
						className: "as-footer-bottom-links",
						children: [
							/* @__PURE__ */ jsx("a", {
								href: resolvedFooter.footer_text?.privacy_policy?.url,
								target: "_blank",
								rel: "noreferrer",
								children: resolvedFooter.footer_text?.privacy_policy?.name
							}),
							/* @__PURE__ */ jsx("a", {
								href: resolvedFooter.footer_text?.terms_conditions?.url,
								target: "_blank",
								rel: "noreferrer",
								children: resolvedFooter.footer_text?.terms_conditions?.name
							}),
							/* @__PURE__ */ jsxs("span", { children: [
								"© ",
								(/* @__PURE__ */ new Date()).getFullYear(),
								" Azari.Solar. All Rights Reserved."
							] })
						]
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/ASRateLimitBanner.tsx
var RADIUS = 54;
var CIRCUMFERENCE = 2 * Math.PI * RADIUS;
function ASRateLimitWall() {
	const [info, setInfo] = useState(null);
	const [remaining, setRemaining] = useState(0);
	const timerRef = useRef(null);
	useEffect(() => {
		return subscribeRateLimit((incoming) => {
			setInfo(incoming);
			setRemaining(incoming.retryAfterSec);
		});
	}, []);
	useEffect(() => {
		if (!info) return;
		if (timerRef.current) clearInterval(timerRef.current);
		timerRef.current = setInterval(() => {
			const left = Math.ceil((info.resetAt - Date.now()) / 1e3);
			if (left <= 0) {
				clearInterval(timerRef.current);
				setInfo(null);
				setRemaining(0);
			} else setRemaining(left);
		}, 500);
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [info]);
	if (!info) return null;
	const pct = Math.min(100, remaining / info.retryAfterSec * 100);
	const offset = CIRCUMFERENCE * (1 - pct / 100);
	return /* @__PURE__ */ jsx("div", {
		className: "as-rl-wall",
		role: "alertdialog",
		"aria-modal": "true",
		"aria-label": "Rate limit exceeded",
		children: /* @__PURE__ */ jsxs("div", {
			className: "as-rl-card",
			children: [
				/* @__PURE__ */ jsxs("p", {
					className: "as-rl-logo",
					children: ["azari", /* @__PURE__ */ jsx("span", { children: ".solar" })]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "as-rl-ring-wrap",
					children: [/* @__PURE__ */ jsxs("svg", {
						className: "as-rl-ring-svg",
						viewBox: "0 0 120 120",
						"aria-hidden": "true",
						children: [/* @__PURE__ */ jsx("circle", {
							className: "as-rl-ring-track",
							cx: "60",
							cy: "60",
							r: RADIUS
						}), /* @__PURE__ */ jsx("circle", {
							className: "as-rl-ring-fill",
							cx: "60",
							cy: "60",
							r: RADIUS,
							strokeDasharray: CIRCUMFERENCE,
							strokeDashoffset: offset
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "as-rl-ring-center",
						"aria-live": "polite",
						children: [/* @__PURE__ */ jsx("span", {
							className: "as-rl-ring-count",
							children: remaining
						}), /* @__PURE__ */ jsx("span", {
							className: "as-rl-ring-unit",
							children: "seconds"
						})]
					})]
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "as-rl-heading",
					children: "Too Many Requests"
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "as-rl-desc",
					children: [
						"You've been temporarily throttled due to too many requests. Access will automatically resume in",
						" ",
						/* @__PURE__ */ jsxs("strong", { children: [
							remaining,
							" second",
							remaining !== 1 ? "s" : ""
						] }),
						"."
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "as-rl-bar-track",
					"aria-hidden": "true",
					children: /* @__PURE__ */ jsx("div", {
						className: "as-rl-bar-fill",
						style: { width: `${pct}%` }
					})
				})
			]
		})
	});
}
//#endregion
//#region src/layout/ASMainLayout.tsx
function ASMainLayout() {
	const location = useLocation();
	const isHeroPage = location.pathname === "/";
	const isProjectDetail = /^\/projects\/.+/.test(location.pathname);
	const [theme, setTheme] = useState("dark-theme");
	useEffect(() => {
		const saved = localStorage.getItem("theme");
		const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark-theme" : "light-theme";
		setTheme(saved ?? system);
	}, []);
	useEffect(() => {
		document.body.classList.remove("light-theme", "dark-theme");
		document.body.classList.add(theme);
		localStorage.setItem("theme", theme);
	}, [theme]);
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);
	useEffect(() => {
		trackPageView(location.pathname);
	}, [location.pathname]);
	const toggleTheme = () => {
		setTheme((prev) => prev === "dark-theme" ? "light-theme" : "dark-theme");
	};
	return /* @__PURE__ */ jsxs("main", {
		className: "app-main",
		children: [
			/* @__PURE__ */ jsx(ASRateLimitWall, {}),
			/* @__PURE__ */ jsx("header", {
				className: "navbar-section",
				children: /* @__PURE__ */ jsx("div", {
					className: "navbar-inner",
					children: /* @__PURE__ */ jsx(ASNavbar, {
						theme,
						toggleTheme
					})
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "layout-content",
				children: [/* @__PURE__ */ jsx("div", {
					className: "layout-page-body",
					children: /* @__PURE__ */ jsx("div", {
						className: `page-container ${isHeroPage || isProjectDetail ? "no-offset" : ""}`,
						children: /* @__PURE__ */ jsx("div", {
							className: "route-page",
							children: /* @__PURE__ */ jsx(Outlet, { context: { theme } })
						}, location.pathname)
					})
				}), /* @__PURE__ */ jsx(ASFooter, {})]
			})
		]
	});
}
//#endregion
//#region app/layouts/main-layout.tsx
var main_layout_exports = /* @__PURE__ */ __exportAll({ default: () => ASMainLayout });
//#endregion
//#region src/hooks/useSeoMeta.ts
var BRAND = "Azari Solar";
var BASE_URL = "https://azari.solar";
function setMeta(selector, attr, value) {
	let el = document.querySelector(selector);
	if (!el) {
		el = document.createElement("meta");
		const [attrName, attrValue] = attr.split("=");
		el[attrName] = attrValue;
		document.head.appendChild(el);
	}
	el.content = value;
}
function useSeoMeta({ title, description, canonical }) {
	useEffect(() => {
		const fullTitle = title.includes(BRAND) ? title : `${title} | ${BRAND}`;
		const canon = canonical ?? `${BASE_URL}${window.location.pathname}`;
		document.title = fullTitle;
		if (description) {
			setMeta("meta[name=\"description\"]", "name=description", description);
			setMeta("meta[property=\"og:description\"]", "property=og:description", description);
			setMeta("meta[name=\"twitter:description\"]", "name=twitter:description", description);
		}
		setMeta("meta[property=\"og:title\"]", "property=og:title", fullTitle);
		setMeta("meta[property=\"og:url\"]", "property=og:url", canon);
		setMeta("meta[name=\"twitter:title\"]", "name=twitter:title", fullTitle);
		let link = document.querySelector("link[rel=\"canonical\"]");
		if (!link) {
			link = document.createElement("link");
			link.rel = "canonical";
			document.head.appendChild(link);
		}
		link.href = canon;
		return () => {
			document.title = `${BRAND} — Solar Panel Installer in Bohol, Philippines`;
		};
	}, [
		title,
		description,
		canonical
	]);
}
//#endregion
//#region src/assets/videos/solar_light.mp4
var solar_light_default = "/assets/solar_light-B-p4Gdsu.mp4";
//#endregion
//#region src/assets/icons/icon-durability.svg
var icon_durability_default = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M29.1081%206.94523C29.0686%206.60648%2028.9389%206.28453%2028.7327%206.01291C28.5264%205.74129%2028.2511%205.52993%2027.9355%205.40085L16.7536%200.659352C16.5137%200.555023%2016.2549%200.501117%2015.9933%200.500977C15.7317%200.500837%2015.4729%200.554467%2015.2328%200.658539L3.88285%205.45791C3.5236%205.60518%203.21748%205.85798%203.00494%206.1829C2.79239%206.50781%202.68342%206.88957%202.69241%207.27773C2.75428%2012.3932%202.95278%2017.3277%204.67791%2021.4678C6.5051%2025.8527%209.87791%2028.9882%2015.2923%2031.3352C15.5353%2031.4429%2015.798%2031.4991%2016.0638%2031.5002C16.2769%2031.4993%2016.4885%2031.4637%2016.6901%2031.3947C20.8984%2029.9794%2024.48%2026.498%2026.7752%2021.5919C28.8808%2017.0912%2029.7313%2011.7527%2029.1081%206.94523ZM25.8695%2021.1682C23.6912%2025.8245%2020.318%2029.1196%2016.3713%2030.4469C16.1493%2030.5269%2015.9046%2030.5165%2015.6901%2030.4179C4.73066%2025.6669%203.82428%2018.1663%203.69228%207.2656C3.68628%207.07616%203.73872%206.88945%203.84248%206.73084C3.94624%206.57222%204.0963%206.44937%204.27228%206.37898L15.6223%201.5796C15.7389%201.5275%2015.8651%201.5006%2015.9928%201.50067C16.1205%201.50073%2016.2467%201.52776%2016.3632%201.57998L27.545%206.32154C27.6995%206.38332%2027.8343%206.48598%2027.935%206.6185C28.0356%206.75102%2028.0983%206.90843%2028.1163%207.07385C28.7157%2011.6977%2027.8967%2016.8349%2025.8695%2021.1682ZM25.4834%207.35891L16.6501%203.61316C16.4425%203.52286%2016.2186%203.47621%2015.9922%203.47609C15.7658%203.47597%2015.5418%203.52239%2015.3341%203.61248L6.5071%207.34498C6.19415%207.4729%205.92777%207.69341%205.74365%207.97696C5.55953%208.26051%205.46646%208.59355%205.47691%208.93148C5.55978%2013.24%205.87328%2017.7099%207.59053%2021.2124C9.08278%2024.2561%2011.5701%2026.5277%2015.4182%2028.3613C15.6379%2028.4695%2015.8792%2028.5272%2016.1241%2028.5301C16.3691%2028.533%2016.6116%2028.481%2016.8339%2028.378C17.2445%2028.1938%2017.6442%2027.9864%2018.0312%2027.7567C20.8545%2026.0825%2023.1562%2023.2258%2024.6868%2019.4954C26.0561%2016.1586%2026.7035%2012.3674%2026.5097%208.82035C26.4963%208.50413%2026.3924%208.19838%2026.2105%207.93936C26.0286%207.68034%2025.7763%207.4789%2025.4834%207.35891ZM17.5212%2026.8969C17.1669%2027.107%2016.801%2027.2969%2016.4252%2027.4656C16.3349%2027.5088%2016.236%2027.5307%2016.136%2027.5295C16.0359%2027.5283%2015.9375%2027.5042%2015.8483%2027.4589C12.2148%2025.7276%209.8761%2023.6026%208.48841%2020.7724C6.85716%2017.445%206.55716%2013.1059%206.47666%208.91248C6.47119%208.77456%206.5086%208.63835%206.58375%208.52258C6.6589%208.40681%206.76809%208.31718%206.89628%208.26604L15.7232%204.53348C15.8074%204.49525%2015.8988%204.4755%2015.9913%204.47555C16.0838%204.47561%2016.1751%204.49546%2016.2593%204.53379L25.093%208.2796C25.213%208.3276%2025.3164%208.40948%2025.3907%208.51524C25.4649%208.621%2025.5068%208.74608%2025.5112%208.87523C25.8605%2015.269%2023.2281%2023.5127%2017.5212%2026.8969Z'%20fill='white'/%3e%3c/svg%3e";
//#endregion
//#region src/assets/icons/icon-bulb.svg
var icon_bulb_default = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M11.9915%209.4714L13.6569%209.48021L11.5108%2015.5183C11.4131%2015.78%2011.4105%2016.0676%2011.5035%2016.3309C11.5965%2016.5943%2011.7792%2016.8165%2012.0195%2016.9587C12.2443%2017.0964%2012.5108%2017.1493%2012.771%2017.1079C13.0313%2017.0665%2013.2682%2016.9335%2013.4391%2016.7328L20.8489%208.43652C21.004%208.2613%2021.1053%208.04498%2021.1404%207.81357C21.1756%207.58217%2021.1431%207.34554%2021.0469%207.13215C20.9591%206.92772%2020.8133%206.75351%2020.6276%206.63107C20.4418%206.50863%2020.2242%206.44334%2020.0017%206.44327H18.1144L19.6327%202.64677C19.7067%202.46275%2019.7345%202.26343%2019.7138%202.06618C19.6931%201.86893%2019.6245%201.67974%2019.5139%201.51509C19.4107%201.35991%2019.2711%201.23234%2019.1073%201.14348C18.9435%201.05462%2018.7604%201.00717%2018.574%201.00527L14.4477%200.983398C14.2159%200.983389%2013.9896%201.05357%2013.7985%201.18469C13.6074%201.31581%2013.4605%201.50173%2013.3772%201.71796L10.933%207.8299C10.859%208.01393%2010.8311%208.21327%2010.8519%208.41054C10.8726%208.6078%2010.9412%208.797%2011.0519%208.96165C11.1551%209.1168%2011.2946%209.24436%2011.4584%209.33321C11.6222%209.42206%2011.8052%209.4695%2011.9915%209.4714ZM14.5172%202.23377L18.4434%202.25459L16.611%206.83621C16.5731%206.93104%2016.559%207.03373%2016.5699%207.13528C16.5809%207.23683%2016.6165%207.33416%2016.6738%207.41873C16.7311%207.50331%2016.8082%207.57257%2016.8984%207.62044C16.9886%207.66831%2017.0892%207.69334%2017.1914%207.69334H19.8367L12.8305%2015.5376L15.1296%209.06915C15.163%208.97512%2015.1735%208.87445%2015.16%208.77557C15.1465%208.67668%2015.1096%208.58246%2015.0523%208.50078C14.9949%208.41909%2014.9189%208.35233%2014.8305%208.30606C14.7421%208.25979%2014.6438%208.23537%2014.544%208.23484L12.1223%208.22196L14.5172%202.23377ZM19.0249%2026.539H12.9749C12.8091%2026.539%2012.6501%2026.6049%2012.5329%2026.7221C12.4157%2026.8393%2012.3499%2026.9983%2012.3499%2027.164C12.3499%2029.2882%2013.9872%2031.0165%2015.9999%2031.0165C18.0125%2031.0165%2019.6499%2029.2882%2019.6499%2027.164C19.6499%2026.9983%2019.584%2026.8393%2019.4668%2026.7221C19.3496%2026.6049%2019.1906%2026.539%2019.0249%2026.539ZM15.9999%2029.7665C14.8751%2029.7665%2013.9286%2028.9231%2013.6699%2027.789H18.3299C18.0711%2028.9231%2017.1246%2029.7665%2015.9999%2029.7665Z'%20fill='white'/%3e%3cpath%20d='M25.3097%2013.1968C25.2611%2011.2256%2024.5808%209.32215%2023.3689%207.76679C23.3188%207.70148%2023.2564%207.6467%2023.1852%207.60557C23.1139%207.56445%2023.0353%207.53779%2022.9537%207.52713C22.8721%207.51647%2022.7893%207.52202%2022.7099%207.54346C22.6304%207.56489%2022.556%207.60179%2022.4909%207.65205C22.4258%207.7023%2022.3712%207.76492%2022.3303%207.8363C22.2895%207.90769%2022.2631%207.98644%2022.2527%208.06805C22.2423%208.14965%2022.2482%208.2325%2022.2699%208.31184C22.2916%208.39119%2022.3288%208.46546%2022.3792%208.53041C23.4282%209.8755%2024.0174%2011.5219%2024.0601%2013.2271C24.1354%2016.3376%2022.4595%2019.0328%2019.5771%2020.4368C19.1889%2020.62%2018.8606%2020.9093%2018.6301%2021.2714C18.3996%2021.6335%2018.2764%2022.0534%2018.2747%2022.4826V24.1868H13.7254V22.4818C13.724%2022.0532%2013.6012%2021.6337%2013.3713%2021.272C13.1413%2020.9103%2012.8135%2020.6212%2012.4259%2020.4382C9.61543%2019.0705%207.93755%2016.4498%207.93755%2013.4282C7.93136%2011.6443%208.5226%209.90974%209.61699%208.50104C9.6677%208.43615%209.70508%208.36188%209.72699%208.2825C9.7489%208.20311%209.7549%208.12018%209.74466%208.03847C9.73442%207.95676%209.70813%207.87788%209.6673%207.80636C9.62648%207.73485%209.57192%207.6721%209.50677%207.62174C9.44162%207.57137%209.36715%207.53438%209.28766%207.51288C9.20816%207.49138%209.1252%207.48581%209.04355%207.49648C8.96189%207.50715%208.88315%207.53385%208.81184%207.57504C8.74054%207.61624%208.67808%207.67112%208.62805%207.73654C7.36368%209.36376%206.68054%2011.3675%206.68755%2013.4282C6.68755%2016.9395%208.62824%2019.9802%2011.8789%2021.5623C12.0551%2021.6436%2012.2046%2021.7731%2012.3101%2021.9359C12.4157%2022.0986%2012.473%2022.2879%2012.4754%2022.4819V24.8118C12.4754%2024.9775%2012.5413%2025.1365%2012.6585%2025.2537C12.7757%2025.3709%2012.9347%2025.4368%2013.1004%2025.4368H18.8997C19.0655%2025.4368%2019.2245%2025.3709%2019.3417%2025.2537C19.4589%2025.1365%2019.5247%2024.9775%2019.5247%2024.8118V22.4825C19.5275%2022.2879%2019.5853%2022.0981%2019.6914%2021.9349C19.7975%2021.7718%2019.9476%2021.642%2020.1244%2021.5607C23.4588%2019.9365%2025.3972%2016.8098%2025.3097%2013.1968Z'%20fill='white'/%3e%3c/svg%3e";
//#endregion
//#region src/assets/icons/icon-leaf.svg
var icon_leaf_default = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_67_14202)'%3e%3cpath%20d='M31.9441%200.449455C31.8891%200.316458%2031.7959%200.202761%2031.6763%200.122754C31.5567%200.0427466%2031.416%202.63678e-05%2031.2721%200C3.04719%200%200%2011.6974%200%2016.7273C0%2023.2523%204.96865%2027.6364%2012.3634%2027.6364C21.7028%2027.6364%2023.6591%2018.7491%2024.7108%2013.9752C26.1246%207.5476%2029.2358%203.79487%2031.787%201.24214C31.8888%201.14047%2031.9581%201.01083%2031.9861%200.869686C32.0141%200.728543%2031.9994%200.582269%2031.9441%200.449455ZM23.2897%2013.6626C21.9559%2019.7193%2019.9036%2026.1818%2012.3634%2026.1818C5.83842%2026.1818%201.45449%2022.3825%201.45449%2016.7273C1.45449%2012.2341%204.2355%201.91414%2029.5557%201.46905C27.1514%204.11491%2024.5668%207.85162%2023.2897%2013.6626Z'%20fill='white'/%3e%3cpath%20d='M20.2905%207.6828C20.1145%207.32205%2019.6796%207.17225%2019.3189%207.34537C7.498%2013.0734%200%2026.9483%200%2031.2726C0%2031.6741%200.325834%2031.9999%200.72728%2031.9999C1.12873%2031.9999%201.45456%2031.6741%201.45456%2031.2726C1.45456%2027.8734%208.0159%2014.4391%2019.9531%208.65446C20.3137%208.47848%2020.465%208.04355%2020.2905%207.6828Z'%20fill='white'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_67_14202'%3e%3crect%20width='32'%20height='32'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
//#endregion
//#region src/assets/icons/icon-peace.svg
var icon_peace_default = "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_67_14208)'%3e%3cpath%20d='M6.3734%2031.375V27.4272C6.3734%2023.9775%205.54509%2020.5803%203.9659%2017.505C3.17528%2015.9571%202.72196%2014.2052%202.69984%2012.3509C2.63428%205.91425%207.77459%200.676624%2014.211%200.625374C20.6675%200.574186%2025.9178%205.78956%2025.9178%2012.2309C25.9178%2013.2517%2026.1654%2014.2576%2026.6461%2015.1613L29.1763%2019.2126C29.5445%2019.9001%2029.0513%2020.7344%2028.2703%2020.7479L25.9203%2020.7854V23.9121C25.9203%2025.2561%2024.8216%2026.3546%2023.478%2026.3546H20.1172V31.375H6.3734Z'%20stroke='white'%20stroke-width='1.5'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M14.3054%2012.7367C15.2626%2012.7367%2016.0385%2010.7278%2016.0385%208.2497C16.0385%205.77159%2015.2626%203.7627%2014.3054%203.7627C13.3482%203.7627%2012.5723%205.77159%2012.5723%208.2497C12.5723%2010.7278%2013.3482%2012.7367%2014.3054%2012.7367Z'%20stroke='white'%20stroke-width='1.5'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M18.4733%2011.0104C18.5517%2010.9383%2018.6286%2010.8647%2018.7039%2010.7895C20.06%209.43339%2020.7499%207.7572%2020.6512%206.39114C19.2851%206.29239%2017.6089%206.98233%2016.2528%208.33839C16.1777%208.41373%2016.104%208.4906%2016.032%208.56895C15.969%2010.1153%2015.4521%2011.4776%2014.6782%2012.3639C15.5645%2011.59%2016.927%2011.0733%2018.4733%2011.0104Z'%20stroke='white'%20stroke-width='1.5'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M18.7927%2014.4702C21.2708%2014.4702%2023.2797%2013.6942%2023.2797%2012.737C23.2797%2011.7799%2021.2708%2011.0039%2018.7927%2011.0039C16.3146%2011.0039%2014.3057%2011.7799%2014.3057%2012.737C14.3057%2013.6942%2016.3146%2014.4702%2018.7927%2014.4702Z'%20stroke='white'%20stroke-width='1.5'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M10.1378%2011.0104C11.6841%2011.0733%2013.0467%2011.59%2013.933%2012.3639C13.159%2011.4776%2012.6422%2010.1153%2012.5792%208.56895C12.5072%208.4906%2012.4335%208.41373%2012.3583%208.33839C11.0022%206.98233%209.32605%206.29239%207.95999%206.39114C7.86124%207.7572%208.55117%209.43339%209.90724%2010.7895C9.98256%2010.8647%2010.0594%2010.9383%2010.1378%2011.0104Z'%20stroke='white'%20stroke-width='1.5'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M9.81854%2014.4702C12.2966%2014.4702%2014.3055%2013.6942%2014.3055%2012.737C14.3055%2011.7799%2012.2966%2011.0039%209.81854%2011.0039C7.34044%2011.0039%205.33154%2011.7799%205.33154%2012.737C5.33154%2013.6942%207.34044%2014.4702%209.81854%2014.4702Z'%20stroke='white'%20stroke-width='1.5'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_67_14208'%3e%3crect%20width='32'%20height='32'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
//#endregion
//#region src/components/ASBenefits.tsx
var DEFAULT_BENEFITS_CONTENT = { items: [
	{
		title: "Long-Term Durability",
		description: "25-YEAR WARRANTY",
		order: 1
	},
	{
		title: "Lower Monthly Bills",
		description: "CUT YOUR ENERGY COSTS",
		order: 2
	},
	{
		title: "Monitoring",
		description: "TRACK YOUR ENERGY & SAVINGS",
		order: 3
	},
	{
		title: "Peace of Mind",
		description: "WORRY-FREE ENERGY SINCE DAY ONE",
		order: 4
	}
] };
var BENEFIT_VISUALS = [
	{
		icon: icon_durability_default,
		className: "benefit-one"
	},
	{
		icon: icon_bulb_default,
		className: "benefit-two"
	},
	{
		icon: icon_leaf_default,
		className: "benefit-three"
	},
	{
		icon: icon_peace_default,
		className: "benefit-four"
	}
];
function ASBenefitsBanner() {
	const sectionRef = useRef(null);
	const hasAnimated = useRef(false);
	const [visibleItems, setVisibleItems] = useState(-1);
	const [isVideoShown, setIsVideoShown] = useState(false);
	const benefitsData = [...useContent("benefits", DEFAULT_BENEFITS_CONTENT).items].sort((a, b) => a.order - b.order).map((item, index) => ({
		...item,
		icon: BENEFIT_VISUALS[index]?.icon ?? "data:image/svg+xml,%3csvg%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M29.1081%206.94523C29.0686%206.60648%2028.9389%206.28453%2028.7327%206.01291C28.5264%205.74129%2028.2511%205.52993%2027.9355%205.40085L16.7536%200.659352C16.5137%200.555023%2016.2549%200.501117%2015.9933%200.500977C15.7317%200.500837%2015.4729%200.554467%2015.2328%200.658539L3.88285%205.45791C3.5236%205.60518%203.21748%205.85798%203.00494%206.1829C2.79239%206.50781%202.68342%206.88957%202.69241%207.27773C2.75428%2012.3932%202.95278%2017.3277%204.67791%2021.4678C6.5051%2025.8527%209.87791%2028.9882%2015.2923%2031.3352C15.5353%2031.4429%2015.798%2031.4991%2016.0638%2031.5002C16.2769%2031.4993%2016.4885%2031.4637%2016.6901%2031.3947C20.8984%2029.9794%2024.48%2026.498%2026.7752%2021.5919C28.8808%2017.0912%2029.7313%2011.7527%2029.1081%206.94523ZM25.8695%2021.1682C23.6912%2025.8245%2020.318%2029.1196%2016.3713%2030.4469C16.1493%2030.5269%2015.9046%2030.5165%2015.6901%2030.4179C4.73066%2025.6669%203.82428%2018.1663%203.69228%207.2656C3.68628%207.07616%203.73872%206.88945%203.84248%206.73084C3.94624%206.57222%204.0963%206.44937%204.27228%206.37898L15.6223%201.5796C15.7389%201.5275%2015.8651%201.5006%2015.9928%201.50067C16.1205%201.50073%2016.2467%201.52776%2016.3632%201.57998L27.545%206.32154C27.6995%206.38332%2027.8343%206.48598%2027.935%206.6185C28.0356%206.75102%2028.0983%206.90843%2028.1163%207.07385C28.7157%2011.6977%2027.8967%2016.8349%2025.8695%2021.1682ZM25.4834%207.35891L16.6501%203.61316C16.4425%203.52286%2016.2186%203.47621%2015.9922%203.47609C15.7658%203.47597%2015.5418%203.52239%2015.3341%203.61248L6.5071%207.34498C6.19415%207.4729%205.92777%207.69341%205.74365%207.97696C5.55953%208.26051%205.46646%208.59355%205.47691%208.93148C5.55978%2013.24%205.87328%2017.7099%207.59053%2021.2124C9.08278%2024.2561%2011.5701%2026.5277%2015.4182%2028.3613C15.6379%2028.4695%2015.8792%2028.5272%2016.1241%2028.5301C16.3691%2028.533%2016.6116%2028.481%2016.8339%2028.378C17.2445%2028.1938%2017.6442%2027.9864%2018.0312%2027.7567C20.8545%2026.0825%2023.1562%2023.2258%2024.6868%2019.4954C26.0561%2016.1586%2026.7035%2012.3674%2026.5097%208.82035C26.4963%208.50413%2026.3924%208.19838%2026.2105%207.93936C26.0286%207.68034%2025.7763%207.4789%2025.4834%207.35891ZM17.5212%2026.8969C17.1669%2027.107%2016.801%2027.2969%2016.4252%2027.4656C16.3349%2027.5088%2016.236%2027.5307%2016.136%2027.5295C16.0359%2027.5283%2015.9375%2027.5042%2015.8483%2027.4589C12.2148%2025.7276%209.8761%2023.6026%208.48841%2020.7724C6.85716%2017.445%206.55716%2013.1059%206.47666%208.91248C6.47119%208.77456%206.5086%208.63835%206.58375%208.52258C6.6589%208.40681%206.76809%208.31718%206.89628%208.26604L15.7232%204.53348C15.8074%204.49525%2015.8988%204.4755%2015.9913%204.47555C16.0838%204.47561%2016.1751%204.49546%2016.2593%204.53379L25.093%208.2796C25.213%208.3276%2025.3164%208.40948%2025.3907%208.51524C25.4649%208.621%2025.5068%208.74608%2025.5112%208.87523C25.8605%2015.269%2023.2281%2023.5127%2017.5212%2026.8969Z'%20fill='white'/%3e%3c/svg%3e",
		className: BENEFIT_VISUALS[index]?.className ?? "benefit-one"
	}));
	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting || hasAnimated.current) return;
			hasAnimated.current = true;
			setIsVideoShown(true);
			benefitsData.forEach((_, index) => {
				window.setTimeout(() => {
					setVisibleItems(index);
				}, 1800 + (index + 1) * 350);
			});
			observer.disconnect();
		}, { threshold: .35 });
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ jsxs("section", {
		ref: sectionRef,
		className: `ASBenefitsBanner${isVideoShown ? " is-video-shown" : ""}`,
		children: [
			/* @__PURE__ */ jsx("video", {
				className: `as-benefits-video ${isVideoShown ? "is-video-shown" : ""}`,
				autoPlay: true,
				muted: true,
				loop: true,
				playsInline: true,
				children: /* @__PURE__ */ jsx("source", {
					src: solar_light_default,
					type: "video/mp4"
				})
			}),
			/* @__PURE__ */ jsx("div", { className: `as-benefits-overlay${isVideoShown ? " is-shown" : ""}` }),
			/* @__PURE__ */ jsx("div", {
				className: "as-benefits-content",
				children: benefitsData.map((item, index) => /* @__PURE__ */ jsxs("div", {
					className: `as-benefit-item ${item.className} ${index <= visibleItems ? "is-shown" : ""}`,
					children: [/* @__PURE__ */ jsx("div", {
						className: "as-benefit-icon",
						children: /* @__PURE__ */ jsx("img", {
							src: item.icon,
							alt: item.title
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "as-benefit-text",
						children: [/* @__PURE__ */ jsx("p", {
							className: "as-benefit-header",
							children: item.title
						}), /* @__PURE__ */ jsx("p", {
							className: "as-benefit-description",
							children: item.description
						})]
					})]
				}, `${item.title}-${index}`))
			})
		]
	});
}
//#endregion
//#region src/models/calculation.ts
var SOLAR_CONSTANTS = {
	averageSolarProductionPerKwp: 120,
	estimatedSavingsRate: .87,
	calculatorProjectionMonths: 12,
	projectionMonths: 144,
	systemEfficiency: .9,
	inverterSafetyFactor: 1.25,
	peakSunHours: 4,
	daysPerMonth: 30,
	zeroBillStorageRatio: 3,
	loadUsageFactor: .7
};
var ELECTRIC_RATE_CONFIG = {
	min: 8,
	max: 20,
	step: .01,
	defaultValue: 11.25
};
var MONTHLY_BILL_CONFIG = {
	min: 3e3,
	max: 2e5,
	step: .1,
	defaultValue: 3e3
};
var INVERTER_STEPS = [
	3.6,
	5,
	6,
	8,
	10,
	12,
	16
];
var DAY_BOUNDARY = {
	startMinutes: 480,
	endMinutes: 1080
};
function minutesOverlapWithDay(startMin, endMin) {
	return Math.max(0, Math.min(endMin, DAY_BOUNDARY.endMinutes) - Math.max(startMin, DAY_BOUNDARY.startMinutes));
}
function calculateDayNightHours(from, to) {
	if (!from || !to) return {
		dayHours: 0,
		nightHours: 0
	};
	const [fh, fm] = from.split(":").map(Number);
	const [th, tm] = to.split(":").map(Number);
	const fromMin = fh * 60 + fm;
	let toMin = th * 60 + tm;
	if (toMin <= fromMin) toMin += 1440;
	const totalMin = toMin - fromMin;
	let dayMin;
	if (toMin <= 1440) dayMin = minutesOverlapWithDay(fromMin, toMin);
	else dayMin = minutesOverlapWithDay(fromMin, 1440) + minutesOverlapWithDay(0, toMin - 1440);
	return {
		dayHours: dayMin / 60,
		nightHours: (totalMin - dayMin) / 60
	};
}
function computeDailyLoadMetrics(appliances) {
	let duec = 0;
	let nwec = 0;
	let totalDailyUsageWh = 0;
	for (const a of appliances) {
		duec += a.watts * a.quantity * a.dayHours * SOLAR_CONSTANTS.loadUsageFactor / 1e3;
		nwec += a.watts * a.quantity * a.nightHours * SOLAR_CONSTANTS.loadUsageFactor / 1e3;
		totalDailyUsageWh += a.usage;
	}
	return {
		duec,
		nwec,
		totalDailyUsageWh
	};
}
function formatSystemSize(kWp, precision = 1) {
	if (kWp >= 1e3) return {
		value: (kWp / 1e3).toFixed(precision),
		unit: "MWp"
	};
	return {
		value: kWp.toFixed(precision),
		unit: "kWp"
	};
}
function getProjectionMonths(formula) {
	return formula.projectionYears > 0 ? formula.projectionYears : SOLAR_CONSTANTS.calculatorProjectionMonths;
}
function formatProjectionDescription(projectionMonths) {
	if (projectionMonths <= 1) return "1-month";
	if (projectionMonths < 12) return `${projectionMonths}-month`;
	const years = projectionMonths / 12;
	if (years === 1) return "1-year";
	return `${Number.isInteger(years) ? years : years.toFixed(1)}-year`;
}
function calculateSolarEstimate({ mode, monthlyBill, electricRate, totalDailyUsageWh, formula }) {
	const safeElectricRate = electricRate > 0 ? electricRate : 0;
	const monthlyKwh = mode === "with-bill" ? safeElectricRate > 0 ? monthlyBill / safeElectricRate : 0 : totalDailyUsageWh * SOLAR_CONSTANTS.daysPerMonth / 1e3;
	const rawSystemSize = formula.averageSolarProductionPerKwp > 0 ? monthlyKwh / formula.averageSolarProductionPerKwp : 0;
	const systemSize = rawSystemSize > 0 ? Number(rawSystemSize.toFixed(1)) : 0;
	const estimatedMonthlySavings = monthlyKwh * safeElectricRate * formula.estimatedSavingsRate;
	const projectionMonths = getProjectionMonths(formula);
	const projectedSavings = estimatedMonthlySavings * projectionMonths;
	return {
		monthlyKwh: Math.round(monthlyKwh),
		systemSize,
		estimatedMonthlySavings: Math.round(estimatedMonthlySavings),
		projectedSavings: Math.round(projectedSavings),
		projectionMonths
	};
}
function roundInverterSize(rawKw) {
	if (rawKw <= 0) return INVERTER_STEPS[0];
	if (rawKw >= 20) return Math.ceil(rawKw / 10) * 10;
	for (const step of INVERTER_STEPS) if (step >= rawKw) return step;
	return Math.ceil(rawKw / 10) * 10;
}
function roundStorageCapacity(rawKwh) {
	if (rawKwh <= 0) return 5;
	return Math.ceil(rawKwh / 5) * 5;
}
function computeDpt(amountPhp, electricRate) {
	if (electricRate <= 0) return 0;
	return amountPhp / electricRate / SOLAR_CONSTANTS.daysPerMonth;
}
function solarFromDpt(dpt) {
	return Math.round(dpt / SOLAR_CONSTANTS.peakSunHours * 100) / 100;
}
function calculateMonthlySavingsHybrid(dpt, duec = 0) {
	const solarKwp = dpt < duec ? dpt / SOLAR_CONSTANTS.peakSunHours : solarFromDpt(Math.max(dpt, duec));
	const storageKwh = dpt < duec ? roundStorageCapacity(0) : roundStorageCapacity((dpt - duec) / SOLAR_CONSTANTS.systemEfficiency);
	return {
		solarKwp,
		inverterKw: roundInverterSize(solarKwp),
		storageKwh,
		systemType: "hybrid"
	};
}
function calculateMonthlySavingsGridTied(dpt, duec = 0) {
	const solarKwp = dpt < duec ? dpt / SOLAR_CONSTANTS.peakSunHours : (dpt - duec) / 2 + duec / SOLAR_CONSTANTS.peakSunHours;
	return {
		solarKwp,
		inverterKw: roundInverterSize(solarKwp),
		storageKwh: 0,
		systemType: "grid-tied"
	};
}
function calculatePeakShaving(peakPower, allowedGridPower, peakDuration) {
	const inverterKw = roundInverterSize(SOLAR_CONSTANTS.inverterSafetyFactor * (peakPower - allowedGridPower));
	const storageKwh = roundStorageCapacity(inverterKw * peakDuration / SOLAR_CONSTANTS.systemEfficiency);
	return {
		solarKwp: Math.round(storageKwh / SOLAR_CONSTANTS.peakSunHours * 100) / 100,
		inverterKw,
		storageKwh,
		systemType: "hybrid"
	};
}
function calculateZeroBillBillOnly(monthlyBill, electricRate) {
	const solarKwp = solarFromDpt(computeDpt(monthlyBill, electricRate));
	return {
		solarKwp,
		inverterKw: roundInverterSize(solarKwp),
		storageKwh: roundStorageCapacity(solarKwp * SOLAR_CONSTANTS.zeroBillStorageRatio),
		systemType: "hybrid"
	};
}
function calculateZeroBillWithLoadProfile(monthlyBill, electricRate, nwec) {
	const dpt = computeDpt(monthlyBill, electricRate);
	const storageKwh = roundStorageCapacity(nwec / SOLAR_CONSTANTS.systemEfficiency);
	const solarKwp = dpt >= storageKwh ? solarFromDpt(Math.max(dpt, nwec)) : storageKwh / SOLAR_CONSTANTS.peakSunHours;
	return {
		solarKwp,
		inverterKw: roundInverterSize(solarKwp),
		storageKwh,
		systemType: "hybrid"
	};
}
function calculateZeroBillLoadOnly(duec, nwec) {
	const totalDaily = duec + nwec;
	const solarKwp = Math.round(totalDaily / SOLAR_CONSTANTS.peakSunHours * 100) / 100;
	return {
		solarKwp,
		inverterKw: roundInverterSize(solarKwp),
		storageKwh: roundStorageCapacity(nwec / SOLAR_CONSTANTS.systemEfficiency),
		systemType: "hybrid"
	};
}
//#endregion
//#region src/components/ASCalculator.tsx
var DEFAULT_CONFIG$1 = {
	monthlyBill: MONTHLY_BILL_CONFIG,
	electricRate: ELECTRIC_RATE_CONFIG,
	formula: {
		averageSolarProductionPerKwp: SOLAR_CONSTANTS.averageSolarProductionPerKwp,
		estimatedSavingsRate: SOLAR_CONSTANTS.estimatedSavingsRate,
		projectionYears: SOLAR_CONSTANTS.calculatorProjectionMonths,
		monthsPerYear: 0
	},
	labels: {
		monthlyBillMin: "₱3k",
		monthlyBillMax: "₱100k+",
		electricRateMin: `₱${ELECTRIC_RATE_CONFIG.min}`,
		electricRateMax: `₱${ELECTRIC_RATE_CONFIG.max}`
	},
	animation: { duration: 1200 }
};
function normalizeDecimalInput$2(value) {
	let cleaned = value.replace(/[^\d.]/g, "");
	cleaned = cleaned.replace(/(\..*?)\..*/g, "$1");
	cleaned = cleaned.replace(/^0+(?=\d)/, "");
	const dot = cleaned.indexOf(".");
	if (dot !== -1) cleaned = cleaned.slice(0, dot + 3);
	return cleaned;
}
function useInitialRollingNumber(targetValue, shouldAnimate, duration) {
	const [displayValue, setDisplayValue] = useState(0);
	const hasRolled = useRef(false);
	useEffect(() => {
		if (!shouldAnimate) return;
		if (hasRolled.current) {
			setDisplayValue(targetValue);
			return;
		}
		hasRolled.current = true;
		let animationFrame;
		const startTime = performance.now();
		const startValue = 0;
		const difference = targetValue - startValue;
		const animate = (currentTime) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			setDisplayValue(startValue + difference * (1 - Math.pow(1 - progress, 3)));
			if (progress < 1) animationFrame = requestAnimationFrame(animate);
			else setDisplayValue(targetValue);
		};
		animationFrame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationFrame);
	}, [
		targetValue,
		shouldAnimate,
		duration
	]);
	return displayValue;
}
function ASImpactCalculator() {
	const navigate = useNavigate();
	const sectionRef = useRef(null);
	const hasAnimated = useRef(false);
	const [isShown, setIsShown] = useState(false);
	const [monthlyBillError, setMonthlyBillError] = useState("");
	const [electricRateError, setElectricRateError] = useState("");
	const [config] = useState(DEFAULT_CONFIG$1);
	const [monthlyBill, setMonthlyBill] = useState(DEFAULT_CONFIG$1.monthlyBill.defaultValue);
	const [electricRate, setElectricRate] = useState(DEFAULT_CONFIG$1.electricRate.defaultValue);
	const [monthlyBillInput, setMonthlyBillInput] = useState(String(DEFAULT_CONFIG$1.monthlyBill.defaultValue));
	const [electricRateInput, setElectricRateInput] = useState(String(DEFAULT_CONFIG$1.electricRate.defaultValue));
	const clampValue = (value, min, max) => {
		return Math.min(max, Math.max(min, value));
	};
	const handleMonthlyBillInput = (value) => {
		const cleaned = normalizeDecimalInput$2(value);
		setMonthlyBillInput(cleaned);
		if (cleaned === "" || cleaned === ".") {
			setMonthlyBill(0);
			setMonthlyBillError("");
			return;
		}
		const num = Number(cleaned);
		setMonthlyBill(num);
		if (num < config.monthlyBill.min) setMonthlyBillError(`Minimum value is ₱${config.monthlyBill.min.toLocaleString()}`);
		else if (num > config.monthlyBill.max) setMonthlyBillError(`Maximum value is ₱${config.monthlyBill.max.toLocaleString()}`);
		else setMonthlyBillError("");
	};
	const handleMonthlyBillBlur = () => {
		const clamped = clampValue(monthlyBill, config.monthlyBill.min, config.monthlyBill.max);
		setMonthlyBill(clamped);
		setMonthlyBillInput(String(parseFloat(clamped.toFixed(2))));
		setMonthlyBillError("");
	};
	const handleElectricRateInput = (value) => {
		const cleaned = normalizeDecimalInput$2(value);
		setElectricRateInput(cleaned);
		if (cleaned === "" || cleaned === ".") {
			setElectricRate(0);
			setElectricRateError("");
			return;
		}
		const num = Number(cleaned);
		setElectricRate(num);
		if (num < config.electricRate.min) setElectricRateError(`Minimum value is ₱${config.electricRate.min}`);
		else if (num > config.electricRate.max) setElectricRateError(`Maximum value is ₱${config.electricRate.max}`);
		else setElectricRateError("");
	};
	const handleElectricRateBlur = () => {
		const clamped = clampValue(electricRate, config.electricRate.min, config.electricRate.max);
		setElectricRate(clamped);
		setElectricRateInput(String(parseFloat(clamped.toFixed(2))));
		setElectricRateError("");
	};
	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting || hasAnimated.current) return;
			hasAnimated.current = true;
			setIsShown(true);
			observer.disconnect();
		}, { threshold: .3 });
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	const results = useMemo(() => {
		return calculateSolarEstimate({
			mode: "with-bill",
			monthlyBill,
			electricRate,
			totalDailyUsageWh: 0,
			formula: config.formula
		});
	}, [
		monthlyBill,
		electricRate,
		config
	]);
	const formattedSystemSize = formatSystemSize(useInitialRollingNumber(results.systemSize, isShown, config.animation.duration));
	const monthlyBillProgress = (monthlyBill - config.monthlyBill.min) / (config.monthlyBill.max - config.monthlyBill.min) * 100;
	const electricRateProgress = (electricRate - config.electricRate.min) / (config.electricRate.max - config.electricRate.min) * 100;
	const projectionMonths = getProjectionMonths(config.formula);
	const projectionDescription = formatProjectionDescription(projectionMonths);
	const handleGetQuote = () => {
		navigate("/solar-calculator", { state: {
			monthlyBill,
			electricRate,
			monthlyKwh: results.monthlyKwh,
			systemSize: results.systemSize,
			estimatedMonthlySavings: results.estimatedMonthlySavings,
			projectedSavings: results.projectedSavings,
			projectionMonths
		} });
	};
	return /* @__PURE__ */ jsxs("section", {
		ref: sectionRef,
		className: `as-impact ${isShown ? "is-shown" : ""}`,
		children: [/* @__PURE__ */ jsx("div", { className: "as-impact-overlay" }), /* @__PURE__ */ jsxs("div", {
			className: "as-impact-content",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "as-impact-heading",
				children: [/* @__PURE__ */ jsx("h2", { children: "Calculate Your Savings" }), /* @__PURE__ */ jsxs("p", { children: [
					"See how much you could save over the ",
					projectionDescription,
					" projected lifespan of your system."
				] })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "as-impact-card",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "as-slider-group as-delay-1",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "as-slider-question",
								children: "What is your average monthly electric bill?"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "as-slider-labels",
								children: [/* @__PURE__ */ jsx("span", { children: config.labels.monthlyBillMin }), /* @__PURE__ */ jsx("span", { children: config.labels.monthlyBillMax })]
							}),
							/* @__PURE__ */ jsx("input", {
								type: "range",
								min: config.monthlyBill.min,
								max: config.monthlyBill.max,
								step: config.monthlyBill.step,
								value: clampValue(monthlyBill, config.monthlyBill.min, config.monthlyBill.max),
								onChange: (e) => {
									const value = Number(e.target.value);
									setMonthlyBill(value);
									setMonthlyBillInput(String(value));
									setMonthlyBillError("");
								},
								className: "as-range",
								style: { "--progress": `${monthlyBillProgress}%` }
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "as-current-value",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "as-current-row",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "as-prefix",
											children: "₱"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "as-current-input-box",
											children: /* @__PURE__ */ jsx("input", {
												type: "text",
												inputMode: "decimal",
												value: monthlyBillInput,
												onChange: (e) => handleMonthlyBillInput(e.target.value),
												onBlur: handleMonthlyBillBlur
											})
										}),
										/* @__PURE__ */ jsx("span", {
											className: "as-suffix",
											children: "/ month"
										})
									]
								}), monthlyBillError && /* @__PURE__ */ jsx("p", {
									className: "as-current-error",
									children: monthlyBillError
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "as-slider-group as-delay-2",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "as-slider-question",
								children: "What is your typical residential rate?"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "as-slider-labels",
								children: [/* @__PURE__ */ jsx("span", { children: config.labels.electricRateMin }), /* @__PURE__ */ jsx("span", { children: config.labels.electricRateMax })]
							}),
							/* @__PURE__ */ jsx("input", {
								type: "range",
								min: config.electricRate.min,
								max: config.electricRate.max,
								step: config.electricRate.step,
								value: clampValue(electricRate, config.electricRate.min, config.electricRate.max),
								onChange: (e) => {
									const value = Number(e.target.value);
									setElectricRate(value);
									setElectricRateInput(String(value));
									setElectricRateError("");
								},
								className: "as-range",
								style: { "--progress": `${electricRateProgress}%` }
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "as-current-value",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "as-current-row",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "as-prefix",
											children: "₱"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "as-current-input-box",
											children: /* @__PURE__ */ jsx("input", {
												type: "text",
												inputMode: "decimal",
												value: electricRateInput,
												onChange: (e) => handleElectricRateInput(e.target.value),
												onBlur: handleElectricRateBlur
											})
										}),
										/* @__PURE__ */ jsx("span", {
											className: "as-suffix",
											children: "/ kWh"
										})
									]
								}), electricRateError && /* @__PURE__ */ jsx("p", {
									className: "as-current-error",
									children: electricRateError
								})]
							})
						]
					}),
					/* @__PURE__ */ jsx("div", { className: "as-impact-divider as-delay-3" }),
					/* @__PURE__ */ jsx("div", {
						className: "as-impact-results as-delay-4",
						children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "as-result-label",
							children: "ESTIMATED SYSTEM SIZE"
						}), /* @__PURE__ */ jsxs("p", {
							className: "as-system-size",
							children: [
								formattedSystemSize.value,
								" ",
								/* @__PURE__ */ jsx("span", { children: formattedSystemSize.unit })
							]
						})] })
					}),
					/* @__PURE__ */ jsx("button", {
						className: "as-impact-button as-delay-5",
						onClick: handleGetQuote,
						children: "Get This System Quote"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "as-impact-note as-delay-6",
						children: "*Estimates are based on the selected electricity rate and average Philippine solar irradiance. Actual results may vary."
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/modules/system-error/ASSystemError.tsx
function ASSystemError({ onClose }) {
	return /* @__PURE__ */ jsx("div", {
		className: "as-system-error-overlay",
		children: /* @__PURE__ */ jsxs("div", {
			className: "as-system-error-modal",
			role: "dialog",
			"aria-modal": "true",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "as-system-error-icon",
					children: "!"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "as-system-error-eyebrow",
					children: "Request failed"
				}),
				/* @__PURE__ */ jsx("h2", { children: "Something went wrong" }),
				/* @__PURE__ */ jsx("p", { children: "We couldn’t process your request right now. Please try again in a moment." }),
				/* @__PURE__ */ jsxs("div", {
					className: "as-system-error-notes",
					children: [
						/* @__PURE__ */ jsx("span", { children: "Check your connection" }),
						/* @__PURE__ */ jsx("span", { children: "Verify the form data" }),
						/* @__PURE__ */ jsx("span", { children: "Try submitting again" })
					]
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onClose,
					children: "Close"
				})
			]
		})
	});
}
//#endregion
//#region src/components/ASLocationAutocomplete.tsx
function formatSuggestion(displayName) {
	return displayName.replace(/,\s*Philippines$/i, "").trim();
}
function LocationAutocompleteInput({ value, onChange, onSelect, extractValue, placeholder, inputClassName, wrapperStyle }) {
	const [suggestions, setSuggestions] = useState([]);
	const [open, setOpen] = useState(false);
	const [activeIdx, setActiveIdx] = useState(-1);
	const debounceRef = useRef(null);
	const abortRef = useRef(null);
	const containerRef = useRef(null);
	useEffect(() => {
		const handler = (e) => {
			if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);
	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
			if (abortRef.current) abortRef.current.abort();
		};
	}, []);
	const search = useCallback((query) => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		if (!query.trim() || query.trim().length < 2) {
			setSuggestions([]);
			setOpen(false);
			return;
		}
		debounceRef.current = setTimeout(async () => {
			if (abortRef.current) abortRef.current.abort();
			abortRef.current = new AbortController();
			try {
				const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ph&limit=5&addressdetails=1`;
				const data = await (await fetch(url, {
					signal: abortRef.current.signal,
					headers: { "Accept-Language": "en" }
				})).json();
				setSuggestions(data);
				setOpen(data.length > 0);
				setActiveIdx(-1);
			} catch (e) {
				if (e.name !== "AbortError") {
					setSuggestions([]);
					setOpen(false);
				}
			}
		}, 400);
	}, []);
	const handleInput = (e) => {
		onChange(e.target.value);
		search(e.target.value);
	};
	const select = (result) => {
		onChange(extractValue ? extractValue(result) : formatSuggestion(result.display_name));
		onSelect?.(result);
		setSuggestions([]);
		setOpen(false);
		setActiveIdx(-1);
	};
	const handleKeyDown = (e) => {
		if (!open || suggestions.length === 0) return;
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActiveIdx((i) => Math.max(i - 1, -1));
		} else if (e.key === "Enter" && activeIdx >= 0) {
			e.preventDefault();
			select(suggestions[activeIdx]);
		} else if (e.key === "Escape") setOpen(false);
	};
	return /* @__PURE__ */ jsxs("div", {
		ref: containerRef,
		className: "as-location-ac",
		style: wrapperStyle,
		children: [/* @__PURE__ */ jsx("input", {
			type: "text",
			value,
			onChange: handleInput,
			onKeyDown: handleKeyDown,
			onFocus: () => suggestions.length > 0 && setOpen(true),
			placeholder,
			className: inputClassName,
			autoComplete: "off",
			spellCheck: false
		}), open && suggestions.length > 0 && /* @__PURE__ */ jsx("ul", {
			className: "as-location-ac-list",
			role: "listbox",
			children: suggestions.map((s, i) => /* @__PURE__ */ jsx("li", {
				role: "option",
				"aria-selected": i === activeIdx,
				className: `as-location-ac-item${i === activeIdx ? " is-active" : ""}`,
				onMouseDown: (e) => {
					e.preventDefault();
					select(s);
				},
				children: formatSuggestion(s.display_name)
			}, s.place_id))
		})]
	});
}
//#endregion
//#region src/models/talk-to-expert.ts
var emailRegex$1 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var mobileRegex = /^(09|\+639)\d{9}$/;
function sanitizeTalkToExpertForm(form) {
	return {
		name: form.name.trim(),
		email: form.email.trim().toLowerCase(),
		phone: form.phone.trim().replace(/\s/g, ""),
		inquiryType: form.inquiryType,
		message: form.message.trim()
	};
}
function validateTalkToExpertField(field, value, province, city) {
	switch (field) {
		case "name": return value.trim() ? "" : "Please enter your name.";
		case "email":
			if (!value.trim()) return "Please enter your email address.";
			if (!emailRegex$1.test(value.trim())) return "Please enter a valid email address.";
			return "";
		case "phone": {
			const cleanPhone = value.replace(/\s/g, "");
			if (!cleanPhone) return "Please enter your mobile number.";
			if (!mobileRegex.test(cleanPhone)) return "Please enter a valid Philippine mobile number.";
			return "";
		}
		case "province": return province ? "" : "Please select a province.";
		case "city": return city ? "" : "Please select a city.";
		case "message":
			if (!value.trim()) return "Please enter your message.";
			if (value.trim().length < 10) return "Message must be at least 10 characters.";
			return "";
		default: return "";
	}
}
function validateTalkToExpertForm(form, province, city) {
	const errors = {
		name: validateTalkToExpertField("name", form.name, province, city),
		email: validateTalkToExpertField("email", form.email, province, city),
		phone: validateTalkToExpertField("phone", form.phone, province, city),
		province: validateTalkToExpertField("province", "", province, city),
		city: validateTalkToExpertField("city", "", province, city),
		message: validateTalkToExpertField("message", form.message, province, city)
	};
	Object.keys(errors).forEach((key) => {
		const typedKey = key;
		if (!errors[typedKey]) delete errors[typedKey];
	});
	return errors;
}
function buildTalkToExpertPayload(form, province, city) {
	const sanitized = sanitizeTalkToExpertForm(form);
	return {
		name: sanitized.name,
		email: sanitized.email,
		phone: sanitized.phone,
		city,
		province,
		inquiryType: sanitized.inquiryType,
		message: sanitized.message
	};
}
//#endregion
//#region src/modules/talk-to-expert-modal/ASTalkToAnExpert.tsx
var DEFAULT_CONFIG = {
	contact_email: "sales@azari.solar",
	headline: "Let's Connect.",
	intro: "Have questions about solar? Whether you're curious about savings or just want to know if your roof is ready, we're here to help. No technical jargon, just honest advice.",
	subheadline: "Simple. Tough. Reliable.",
	subtext: "Bringing the power of the sun to every Filipino home. We handle the hard parts—the permits, the engineering, and the utility sync—so you can just enjoy the savings."
};
var EMPTY_FORM = {
	name: "",
	email: "",
	phone: "",
	inquiryType: "general",
	message: ""
};
function ASTalkToAnExpert({ isOpen, onClose }) {
	const [isClosing, setIsClosing] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const config = DEFAULT_CONFIG;
	const [selectedProvince, setSelectedProvince] = useState("");
	const [selectedCity, setSelectedCity] = useState("");
	const [form, setForm] = useState(EMPTY_FORM);
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSystemError, setShowSystemError] = useState(false);
	const resetForm = () => {
		setForm(EMPTY_FORM);
		setSelectedProvince("");
		setSelectedCity("");
		setErrors({});
		setShowSystemError(false);
		setSubmitSuccess(false);
	};
	useEffect(() => {
		if (isOpen) return;
		const timer = window.setTimeout(resetForm, 260);
		return () => window.clearTimeout(timer);
	}, [isOpen]);
	const handleFieldChange = (field, value) => {
		setForm((prev) => ({
			...prev,
			[field]: field === "inquiryType" ? value : value
		}));
		setErrors((prev) => ({
			...prev,
			[field]: field === "inquiryType" ? "" : validateTalkToExpertField(field, value, selectedProvince, selectedCity)
		}));
	};
	const validateForm = () => {
		const newErrors = validateTalkToExpertForm(form, selectedProvince, selectedCity);
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	useEffect(() => {
		if (!isOpen) return;
		const scrollY = window.scrollY;
		const original = {
			overflow: document.body.style.overflow,
			position: document.body.style.position,
			top: document.body.style.top,
			width: document.body.style.width
		};
		document.body.style.overflow = "hidden";
		document.body.style.position = "fixed";
		document.body.style.top = `-${scrollY}px`;
		document.body.style.width = "100%";
		return () => {
			document.body.style.overflow = original.overflow;
			document.body.style.position = original.position;
			document.body.style.top = original.top;
			document.body.style.width = original.width;
			window.scrollTo(0, scrollY);
		};
	}, [isOpen]);
	const handleClose = () => {
		setIsClosing(true);
		window.setTimeout(() => {
			setIsClosing(false);
			onClose();
		}, 220);
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (isSubmitting) return;
		if (!validateForm()) return;
		try {
			setIsSubmitting(true);
			setShowSystemError(false);
			const response = await fetch("/api/talk/send", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(buildTalkToExpertPayload(form, selectedProvince, selectedCity))
			});
			const data = await response.json().catch(() => null);
			if (!response.ok || data?.success === false) {
				console.error("API failed:", {
					status: response.status,
					message: data?.message,
					systemError: data?.error
				});
				setShowSystemError(true);
				return;
			}
			setSubmitSuccess(true);
			window.setTimeout(() => handleClose(), 4e3);
		} catch (error) {
			console.error("System error:", error);
			setShowSystemError(true);
		} finally {
			setIsSubmitting(false);
		}
	};
	if (!isOpen) return null;
	return createPortal(/* @__PURE__ */ jsxs("div", {
		className: `as-talk-overlay ${isClosing ? "is-closing" : ""}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: `as-talk-modal ${isClosing ? "is-closing" : ""}`,
			role: "dialog",
			"aria-modal": "true",
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "as-talk-close",
				onClick: handleClose,
				"aria-label": "Close modal",
				children: "×"
			}), submitSuccess ? /* @__PURE__ */ jsxs("div", {
				className: "as-talk-success",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "as-talk-success-icon",
						children: /* @__PURE__ */ jsx("svg", {
							width: "36",
							height: "36",
							viewBox: "0 0 36 36",
							fill: "none",
							xmlns: "http://www.w3.org/2000/svg",
							children: /* @__PURE__ */ jsx("path", {
								d: "M7 18.5L14.5 26L29 11",
								stroke: "#22c55e",
								strokeWidth: "3",
								strokeLinecap: "round",
								strokeLinejoin: "round"
							})
						})
					}),
					/* @__PURE__ */ jsx("h3", { children: "Message Sent!" }),
					/* @__PURE__ */ jsx("p", { children: "Thank you for reaching out. Our team will get back to you within 24 hours." }),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "as-talk-send as-talk-success-btn",
						onClick: handleClose,
						children: "Done"
					})
				]
			}) : /* @__PURE__ */ jsxs("div", {
				className: "as-talk-content",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "as-talk-info",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("h2", { children: config.headline?.includes("Connect") ? /* @__PURE__ */ jsxs(Fragment, { children: [
							config.headline.replace("Connect", ""),
							/* @__PURE__ */ jsx("span", { children: "Connect" }),
							"."
						] }) : config.headline }),
						/* @__PURE__ */ jsx("p", {
							className: "as-talk-intro",
							children: config.intro
						}),
						/* @__PURE__ */ jsx("a", {
							href: `mailto:${config.contact_email}`,
							className: "as-talk-email",
							children: config.contact_email
						})
					] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", { children: config.subheadline }), /* @__PURE__ */ jsx("p", {
						className: "as-talk-subtext",
						children: config.subtext
					})] })]
				}), /* @__PURE__ */ jsxs("form", {
					className: "as-talk-form",
					onSubmit: handleSubmit,
					noValidate: true,
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "as-talk-row",
							children: [/* @__PURE__ */ jsxs("label", {
								className: "as-talk-field",
								children: [
									/* @__PURE__ */ jsx("span", { children: "How should we address you?" }),
									/* @__PURE__ */ jsx("input", {
										type: "text",
										value: form.name,
										onChange: (event) => handleFieldChange("name", event.target.value),
										className: errors.name ? "has-warning" : ""
									}),
									errors.name && /* @__PURE__ */ jsx("small", {
										className: "as-talk-warning",
										children: errors.name
									})
								]
							}), /* @__PURE__ */ jsxs("label", {
								className: "as-talk-field",
								children: [
									/* @__PURE__ */ jsx("span", { children: "Email Address" }),
									/* @__PURE__ */ jsx("input", {
										type: "email",
										value: form.email,
										onChange: (event) => handleFieldChange("email", event.target.value),
										className: errors.email ? "has-warning" : ""
									}),
									errors.email && /* @__PURE__ */ jsx("small", {
										className: "as-talk-warning",
										children: errors.email
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "as-talk-row",
							children: [/* @__PURE__ */ jsxs("label", {
								className: "as-talk-field",
								children: [
									/* @__PURE__ */ jsx("span", { children: "Mobile Number" }),
									/* @__PURE__ */ jsx("input", {
										type: "tel",
										value: form.phone,
										onChange: (event) => handleFieldChange("phone", event.target.value),
										className: errors.phone ? "has-warning" : ""
									}),
									errors.phone && /* @__PURE__ */ jsx("small", {
										className: "as-talk-warning",
										children: errors.phone
									})
								]
							}), /* @__PURE__ */ jsxs("label", {
								className: "as-talk-field",
								children: [
									/* @__PURE__ */ jsx("span", { children: "Province" }),
									/* @__PURE__ */ jsx(LocationAutocompleteInput, {
										value: selectedProvince,
										onChange: (val) => {
											setSelectedProvince(val);
											setErrors((prev) => ({
												...prev,
												province: validateTalkToExpertField("province", "", val, selectedCity)
											}));
										},
										extractValue: (result) => result.address?.county || result.address?.state || result.address?.province || result.display_name.replace(/,\s*Philippines$/i, "").split(",")[0].trim(),
										onSelect: (result) => {
											const city = result.address?.city || result.address?.town || result.address?.municipality || result.address?.city_district || "";
											if (city && !selectedCity) {
												setSelectedCity(city);
												setErrors((prev) => ({
													...prev,
													city: validateTalkToExpertField("city", "", selectedProvince, city)
												}));
											}
										},
										placeholder: "e.g., Metro Manila",
										inputClassName: errors.province ? "has-warning" : ""
									}),
									errors.province && /* @__PURE__ */ jsx("small", {
										className: "as-talk-warning",
										children: errors.province
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "as-talk-row",
							children: [/* @__PURE__ */ jsxs("label", {
								className: "as-talk-field",
								children: [
									/* @__PURE__ */ jsx("span", { children: "City" }),
									/* @__PURE__ */ jsx(LocationAutocompleteInput, {
										value: selectedCity,
										onChange: (val) => {
											setSelectedCity(val);
											setErrors((prev) => ({
												...prev,
												city: validateTalkToExpertField("city", "", selectedProvince, val)
											}));
										},
										extractValue: (result) => result.address?.city || result.address?.town || result.address?.municipality || result.address?.city_district || result.display_name.replace(/,\s*Philippines$/i, "").split(",")[0].trim(),
										onSelect: (result) => {
											const province = result.address?.county || result.address?.state || result.address?.province || "";
											if (province && !selectedProvince) {
												setSelectedProvince(province);
												setErrors((prev) => ({
													...prev,
													province: validateTalkToExpertField("province", "", province, selectedCity)
												}));
											}
										},
										placeholder: "e.g., Cebu City",
										inputClassName: errors.city ? "has-warning" : ""
									}),
									errors.city && /* @__PURE__ */ jsx("small", {
										className: "as-talk-warning",
										children: errors.city
									})
								]
							}), /* @__PURE__ */ jsxs("label", {
								className: "as-talk-field",
								children: [/* @__PURE__ */ jsx("span", { children: "How can we help?" }), /* @__PURE__ */ jsxs("select", {
									value: form.inquiryType,
									onChange: (event) => handleFieldChange("inquiryType", event.target.value),
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "general",
											children: "General inquiry"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "quote",
											children: "Request quotation"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "consultation",
											children: "Consultation"
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "as-talk-field",
							children: [
								/* @__PURE__ */ jsx("span", { children: "Message" }),
								/* @__PURE__ */ jsx("textarea", {
									value: form.message,
									onChange: (event) => handleFieldChange("message", event.target.value),
									className: errors.message ? "has-warning" : ""
								}),
								errors.message && /* @__PURE__ */ jsx("small", {
									className: "as-talk-warning",
									children: errors.message
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "as-talk-actions",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								className: "as-talk-cancel",
								onClick: handleClose,
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								className: "as-talk-send",
								disabled: isSubmitting,
								children: isSubmitting ? "Sending..." : "Send Message"
							})]
						})
					]
				})]
			})]
		}), showSystemError && /* @__PURE__ */ jsx(ASSystemError, { onClose: () => setShowSystemError(false) })]
	}), document.body);
}
//#endregion
//#region src/components/ASCallToAction.tsx
var DEFAULT_CTA = {
	title: "Ready to engineer your energy independence?",
	description: "Take control of your energy bills. Get a free quote or talk to an expert",
	primaryCta: "Get a free Quote",
	secondaryCta: "Talk to an Expert"
};
function ASCallToAction() {
	const navigate = useNavigate();
	const sectionRef = useRef(null);
	const hasAnimated = useRef(false);
	const [isShown, setIsShown] = useState(false);
	const cta = useContent("cta", DEFAULT_CTA);
	const titlePrefix = cta.title.includes("energy independence") ? cta.title.split("energy independence")[0].trimEnd() : "Ready to engineer your";
	const titleHighlight = cta.title.includes("energy independence") ? "energy independence?" : "energy independence?";
	const [isModalOpen, setIsModalOpen] = useState(false);
	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting || hasAnimated.current) return;
			hasAnimated.current = true;
			setIsShown(true);
			observer.disconnect();
		}, { threshold: .3 });
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("section", {
		ref: sectionRef,
		className: `as-cta-section ${isShown ? "is-shown" : ""}`,
		children: [
			/* @__PURE__ */ jsxs("h2", {
				className: "as-cta-title",
				children: [
					titlePrefix,
					" ",
					/* @__PURE__ */ jsx("br", {}),
					/* @__PURE__ */ jsx("span", { children: titleHighlight })
				]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "as-cta-description",
				children: cta.description
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "as-cta-actions",
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "as-cta-primary",
					onClick: () => navigate("/solar-calculator"),
					children: [cta.primaryCta.replace(/\s*↗\s*$/, ""), /* @__PURE__ */ jsxs("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						width: "16",
						height: "16",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2.5",
						strokeLinecap: "square",
						strokeLinejoin: "miter",
						"aria-hidden": "true",
						style: { flexShrink: 0 },
						children: [/* @__PURE__ */ jsx("line", {
							x1: "5",
							y1: "19",
							x2: "19",
							y2: "5"
						}), /* @__PURE__ */ jsx("polyline", { points: "5 5 19 5 19 19" })]
					})]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "as-cta-secondary",
					onClick: () => setIsModalOpen(true),
					children: cta.secondaryCta
				})]
			})
		]
	}), /* @__PURE__ */ jsx(ASTalkToAnExpert, {
		isOpen: isModalOpen,
		onClose: () => setIsModalOpen(false)
	})] });
}
//#endregion
//#region src/assets/icons/icon-prev.svg
var icon_prev_default = "data:image/svg+xml,%3csvg%20width='42'%20height='42'%20viewBox='0%200%2042%2042'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='42'%20height='42'%20rx='16'%20transform='matrix(-1%200%200%201%2042%200)'%20fill='white'%20fill-opacity='0.05'/%3e%3crect%20x='-0.5'%20y='0.5'%20width='41'%20height='41'%20rx='15.5'%20transform='matrix(-1%200%200%201%2041%200)'%20stroke='%23E3E3E3'%20stroke-opacity='0.2'/%3e%3cpath%20d='M24.4661%2013.9709C24.6737%2013.967%2024.8774%2014.0278%2025.0489%2014.1448C25.2205%2014.2618%2025.3514%2014.4292%2025.4237%2014.6239C25.4959%2014.8186%2025.5058%2015.0309%2025.4521%2015.2315C25.3984%2015.4321%2025.2836%2015.611%2025.1237%2015.7435L19.0047%2020.9819L25.1275%2026.2203C25.2393%2026.3019%2025.3331%2026.4057%2025.4028%2026.5253C25.4725%2026.6449%2025.5167%2026.7776%2025.5325%2026.9152C25.5483%2027.0527%2025.5355%2027.192%2025.4948%2027.3243C25.454%2027.4566%2025.3863%2027.579%2025.2959%2027.6838C25.2055%2027.7887%2025.0944%2027.8736%2024.9695%2027.9333C24.8446%2027.993%2024.7087%2028.0262%2024.5703%2028.0307C24.432%2028.0352%2024.2942%2028.0111%2024.1657%2027.9597C24.0371%2027.9083%2023.9206%2027.8308%2023.8236%2027.7321L16.8239%2021.7491C16.7138%2021.6551%2016.6254%2021.5383%2016.5648%2021.4069C16.5042%2021.2754%2016.4728%2021.1323%2016.4728%2020.9876C16.4728%2020.8428%2016.5042%2020.6997%2016.5648%2020.5683C16.6254%2020.4368%2016.7138%2020.32%2016.8239%2020.226L23.8236%2014.2241C24.0009%2014.0662%2024.2287%2013.9764%2024.4661%2013.9709Z'%20fill='white'/%3e%3c/svg%3e";
//#endregion
//#region src/assets/icons/icon-next.svg
var icon_next_default = "data:image/svg+xml,%3csvg%20width='42'%20height='42'%20viewBox='0%200%2042%2042'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='42'%20height='42'%20rx='16'%20fill='white'%20fill-opacity='0.05'/%3e%3crect%20x='0.5'%20y='0.5'%20width='41'%20height='41'%20rx='15.5'%20stroke='%23E3E3E3'%20stroke-opacity='0.2'/%3e%3cpath%20d='M17.5339%2013.9709C17.3263%2013.967%2017.1226%2014.0278%2016.9511%2014.1448C16.7795%2014.2618%2016.6486%2014.4292%2016.5763%2014.6239C16.5041%2014.8186%2016.4942%2015.0309%2016.5479%2015.2315C16.6016%2015.4321%2016.7164%2015.611%2016.8763%2015.7435L22.9953%2020.9819L16.8725%2026.2203C16.7607%2026.3019%2016.6669%2026.4057%2016.5972%2026.5253C16.5275%2026.6449%2016.4833%2026.7776%2016.4675%2026.9152C16.4517%2027.0527%2016.4645%2027.192%2016.5052%2027.3243C16.546%2027.4566%2016.6137%2027.579%2016.7041%2027.6838C16.7945%2027.7887%2016.9056%2027.8736%2017.0305%2027.9333C17.1554%2027.993%2017.2913%2028.0262%2017.4297%2028.0307C17.568%2028.0352%2017.7058%2028.0111%2017.8343%2027.9597C17.9629%2027.9083%2018.0794%2027.8308%2018.1764%2027.7321L25.1761%2021.7491C25.2862%2021.6551%2025.3746%2021.5383%2025.4352%2021.4069C25.4958%2021.2754%2025.5272%2021.1323%2025.5272%2020.9876C25.5272%2020.8428%2025.4958%2020.6997%2025.4352%2020.5683C25.3746%2020.4368%2025.2862%2020.32%2025.1761%2020.226L18.1764%2014.2241C17.9991%2014.0662%2017.7713%2013.9764%2017.5339%2013.9709Z'%20fill='white'/%3e%3c/svg%3e";
//#endregion
//#region src/assets/icons/icon-watch-video.svg
var icon_watch_video_default = "/assets/icon-watch-video-DsB-kzBA.svg";
//#endregion
//#region src/components/ASClientJourney.tsx
var DEFAULT_JOURNEY = { entries: [
	{
		id: "1",
		name: "Santos Family",
		location: "Quezon City, Metro Manila",
		testimonial: "Our Meralco bill dropped by 87% in the first month. The team handled the entire Net-Metering application perfectly, and now we literally earn credits while we sleep. It's the best investment we've made for our home's future.",
		videoUrl: "",
		coords: [121.05, 14.68]
	},
	{
		id: "2",
		name: "Cruz Commercial",
		location: "Cebu City, Cebu",
		testimonial: "Operating costs dropped significantly since we installed our solar array. The team handled everything from permits to final inspection. Our system gives us enough buffer even through the peak season.",
		videoUrl: "",
		coords: [123.9, 10.32]
	},
	{
		id: "3",
		name: "Reyes Residence",
		location: "Davao City, Davao del Sur",
		testimonial: "We were skeptical at first, but the numbers don't lie. Within 18 months we recovered a significant portion of our investment. The monitoring app lets us see exactly how much we save in real time.",
		videoUrl: "",
		coords: [125.61, 7.07]
	},
	{
		id: "4",
		name: "De Leon Residence",
		location: "Angeles City, Pampanga",
		testimonial: "Professional installation completed in just two days. Our home now runs entirely on solar during daytime hours. We highly recommend Azari to anyone considering the switch to renewable energy.",
		videoUrl: "",
		coords: [120.59, 15.15]
	},
	{
		id: "5",
		name: "Garcia Business",
		location: "Iloilo City, Iloilo",
		testimonial: "As a business owner, the ROI was clear from the start. Our electricity expenses went from our highest operating cost to nearly negligible. The after-sales support has been exceptional as well.",
		videoUrl: "",
		coords: [122.57, 10.72]
	},
	{
		id: "6",
		name: "Torres Family",
		location: "Batangas City, Batangas",
		testimonial: "Consistent monthly savings since day one. The process from quotation to installation was seamless, and the monitoring app keeps us informed about our energy generation at all times.",
		videoUrl: "",
		coords: [121.05, 13.76]
	},
	{
		id: "7",
		name: "Chua Enterprise",
		location: "Cagayan de Oro, Misamis Oriental",
		testimonial: "We installed a 50kWp commercial system across our warehouse rooftops. The project was completed on schedule and within budget. We're already planning to expand to our other facilities.",
		videoUrl: "",
		coords: [124.63, 8.48]
	}
] };
var SVG_W = 200;
var SVG_H = 370;
var _cachedPathD = null;
var _cachedProj = null;
function usePhilippinesMap() {
	const [state, setState] = useState(_cachedPathD && _cachedProj ? {
		pathD: _cachedPathD,
		proj: _cachedProj
	} : null);
	useEffect(() => {
		if (_cachedPathD && _cachedProj) return;
		fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json").then((r) => r.json()).then((world) => {
			const ph = feature(world, world.objects.countries).features.find((f) => String(f.id) === "608");
			if (!ph) return;
			const proj = geoMercator().fitExtent([[18, 18], [SVG_W - 18, SVG_H - 18]], ph);
			const pathD = geoPath().projection(proj)(ph) ?? "";
			_cachedPathD = pathD;
			_cachedProj = proj;
			setState({
				pathD,
				proj
			});
		}).catch((err) => console.error("Failed to load Philippines map:", err));
	}, []);
	return state;
}
function getYouTubeThumbnail$2(url) {
	if (!url) return null;
	const ytWatch = url.match(/youtube\.com\/watch\?.*v=([\w-]+)/);
	if (ytWatch) return `https://img.youtube.com/vi/${ytWatch[1]}/hqdefault.jpg`;
	const ytShort = url.match(/youtu\.be\/([\w-]+)/);
	if (ytShort) return `https://img.youtube.com/vi/${ytShort[1]}/hqdefault.jpg`;
	return null;
}
function getVideoEmbedUrl$1(url) {
	if (!url.trim()) return null;
	const ytWatch = url.match(/youtube\.com\/watch\?.*v=([\w-]+)/);
	if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}?autoplay=1`;
	const ytShort = url.match(/youtu\.be\/([\w-]+)/);
	if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}?autoplay=1`;
	return url;
}
function VideoModal$1({ url, onClose }) {
	const isDirectVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(url);
	const embedUrl = getVideoEmbedUrl$1(url);
	const iframeRef = useRef(null);
	const videoRef = useRef(null);
	const handleClose = useCallback(() => {
		if (iframeRef.current) iframeRef.current.src = "";
		if (videoRef.current) videoRef.current.pause();
		onClose();
	}, [onClose]);
	useEffect(() => {
		const onKey = (e) => {
			if (e.key === "Escape") handleClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [handleClose]);
	return createPortal(/* @__PURE__ */ jsx("div", {
		className: "as-video-backdrop",
		onClick: handleClose,
		children: /* @__PURE__ */ jsxs("div", {
			className: "as-video-container",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ jsx("button", {
				className: "as-video-close",
				onClick: handleClose,
				"aria-label": "Close video",
				children: "×"
			}), isDirectVideo ? /* @__PURE__ */ jsx("video", {
				ref: videoRef,
				src: url,
				autoPlay: true,
				controls: true,
				className: "as-video-player"
			}) : embedUrl ? /* @__PURE__ */ jsx("iframe", {
				ref: iframeRef,
				src: embedUrl,
				className: "as-video-frame",
				allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
				allowFullScreen: true,
				title: "Client testimonial video"
			}) : null]
		})
	}), document.body);
}
function PhilippinesMap({ entries, activeIndex, onMarkerClick }) {
	const map = usePhilippinesMap();
	return /* @__PURE__ */ jsxs("svg", {
		className: "as-journey-map",
		viewBox: `0 0 ${SVG_W} ${SVG_H}`,
		xmlns: "http://www.w3.org/2000/svg",
		role: "img",
		"aria-label": "Philippines map showing client locations",
		focusable: "false",
		children: [
			/* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("pattern", {
				id: "ph-dot-grid",
				x: "0",
				y: "0",
				width: "8",
				height: "8",
				patternUnits: "userSpaceOnUse",
				children: [/* @__PURE__ */ jsx("rect", {
					width: "8",
					height: "8",
					style: { fill: "var(--map-grout)" }
				}), /* @__PURE__ */ jsx("rect", {
					x: "0.75",
					y: "0.75",
					width: "6.5",
					height: "6.5",
					rx: "0.5",
					style: { fill: "var(--map-tile)" }
				})]
			}) }),
			map && /* @__PURE__ */ jsx("path", {
				d: map.pathD,
				fill: "url(#ph-dot-grid)",
				stroke: "none"
			}),
			map && entries.map((entry, i) => {
				const point = map.proj(entry.coords);
				if (!point) return null;
				const [x, y] = point;
				const active = i === activeIndex;
				return /* @__PURE__ */ jsxs("g", {
					transform: `translate(${x},${y})`,
					className: `as-ph-marker${active ? " is-active" : ""}`,
					onClick: () => onMarkerClick(i),
					role: "button",
					tabIndex: -1,
					"aria-label": `${entry.name} – ${entry.location}`,
					children: [active && /* @__PURE__ */ jsx("image", {
						href: "data:image/svg+xml,%3csvg%20width='41'%20height='41'%20viewBox='0%200%2041%2041'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M28.6611%200.5H34.8415C37.6029%200.5%2039.8415%202.73858%2039.8415%205.5V11.6803'%20stroke='%23FFD701'%20stroke-linecap='round'/%3e%3cpath%20d='M11.6807%200.5H5.50033C2.7389%200.5%200.500324%202.73858%200.500324%205.5V11.6803'%20stroke='%23FFD701'%20stroke-linecap='round'/%3e%3cpath%20d='M29.3213%2040.5H35.5016C38.263%2040.5%2040.5016%2038.2614%2040.5016%2035.5V29.3197'%20stroke='%23FFD701'%20stroke-linecap='round'/%3e%3cpath%20d='M12.3408%2040.5H6.16048C3.39906%2040.5%201.16048%2038.2614%201.16048%2035.5V29.3197'%20stroke='%23FFD701'%20stroke-linecap='round'/%3e%3c/svg%3e",
						x: "-9",
						y: "-9",
						width: "18",
						height: "18",
						className: "as-ph-marker-ring",
						pointerEvents: "none"
					}), /* @__PURE__ */ jsx("image", {
						href: "data:image/svg+xml,%3csvg%20width='24'%20height='29'%20viewBox='0%200%2024%2029'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M12.5303%2028.0446L14.1166%2027.1231V26.0938L12.5303%2027.0149V28.0446Z'%20fill='%23A2A2A2'/%3e%3cpath%20d='M5.10254%2022.7513L12.5301%2027.0144L14.1165%2026.0933L6.68879%2021.8301L5.10254%2022.7513Z'%20fill='%23E7E6E6'/%3e%3cpath%20d='M5.10254%2023.7815L12.5301%2028.0447V27.015L5.10254%2022.752V23.7815Z'%20fill='%23CCCCCC'/%3e%3cpath%20d='M8.66113%2024.3699C8.66113%2024.5106%208.75413%2024.6513%208.94001%2024.7587C9.31195%2024.9735%209.91513%2024.9735%2010.2869%2024.7587C10.4728%2024.6513%2010.5659%2024.5106%2010.5659%2024.3699V17.2988H8.66113V24.3699Z'%20fill='url(%23paint0_linear_67_23086)'/%3e%3cpath%20d='M8.34912%200.396484L0%2016.2058L0.344313%2016.6026L15.3527%2025.2469L23.376%209.06242L23.0317%208.66555L8.34912%200.396484Z'%20fill='%23A2A2A2'/%3e%3cpath%20d='M0%2016.2062L15.0084%2024.8504L23.0317%208.66594L8.00481%200L0%2016.2062Z'%20fill='%23E7E6E6'/%3e%3cpath%20d='M14.2147%207.26236L17.7139%209.33173L18.8303%207.00611L15.3167%204.97748L14.2147%207.26236ZM10.4255%205.02155L13.9338%207.09623L15.0344%204.81448L11.4877%202.76686L10.4255%205.02155ZM9.16848%207.68992L12.6534%209.75092L13.863%207.24305L10.356%205.16911L9.16848%207.68992ZM5.93441%205.77742L9.04866%207.61911L10.2362%205.0983L7.14854%203.27236L5.93441%205.77742ZM4.64916%208.42911L7.7916%2010.2875L8.97916%207.76673L5.86335%205.92405L4.64916%208.42911ZM11.654%2012.5716L15.1622%2014.6464L16.3675%2012.136L12.8635%2010.0639L11.654%2012.5716ZM5.39723%2015.6952L8.81235%2017.7149L10.0219%2015.207L6.58473%2013.1744L5.39723%2015.6952ZM7.91141%2010.3584L11.3731%2012.4055L12.5826%209.8978L9.09891%207.83755L7.91141%2010.3584ZM12.9344%209.91705L16.438%2011.989L17.6432%209.47867L14.1439%207.40917L12.9344%209.91705ZM10.3736%2015.2263L13.8865%2017.3037L15.0917%2014.7934L11.5832%2012.7185L10.3736%2015.2263ZM3.36385%2011.0809L6.53454%2012.9559L7.7221%2010.4351L4.57804%208.5758L3.36385%2011.0809ZM6.65429%2013.0268L10.0927%2015.0602L11.3023%2012.5524L7.84185%2010.506L6.65429%2013.0268ZM15.282%2014.7172L18.4245%2016.5755L19.6387%2014.0706L16.4872%2012.2069L15.282%2014.7172ZM7.21966%203.12567L10.3057%204.95067L11.3674%202.6973L8.28879%200.919922L7.21966%203.12567ZM16.5578%2012.0599L19.7098%2013.9239L20.924%2011.4187L17.763%209.54948L16.5578%2012.0599ZM17.8336%209.40248L20.995%2011.2721L22.1373%208.91536L18.9507%207.07561L17.8336%209.40248ZM0.985352%2015.988L4.22498%2017.8584L5.20785%2015.7719L2.00754%2013.8792L0.985352%2015.988ZM11.7016%2022.1751L14.8339%2023.9835L15.7829%2022.0258L12.6599%2020.1789L11.7016%2022.1751ZM8.04135%2020.0619L11.5812%2022.1055L12.5402%2020.108L9.02241%2018.0278L8.04135%2020.0619ZM4.34541%2017.9279L7.75898%2019.8989L8.74154%2017.8617L5.32766%2015.8428L4.34541%2017.9279ZM14.0062%2017.3746L17.1392%2019.2274L18.3534%2016.7223L15.2115%2014.8642L14.0062%2017.3746ZM2.0786%2013.7325L5.27748%2015.6243L6.46498%2013.1035L3.29279%2011.2276L2.0786%2013.7325ZM12.7305%2020.032L15.8539%2021.8791L17.0681%2019.374L13.9357%2017.5216L12.7305%2020.032ZM9.09323%2017.8809L12.6107%2019.9611L13.8159%2017.4507L10.3028%2015.3732L9.09323%2017.8809Z'%20fill='%231D589C'/%3e%3cpath%20d='M5.491%206.69314L4.91644%207.87852L13.7899%204.09633L12.8009%203.52539L5.491%206.69314ZM4.64938%208.42958L2.57031%2012.719L17.2225%206.07814L14.3246%204.40508L4.64938%208.42958Z'%20fill='%2392AFD0'%20fill-opacity='0.188235'/%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear_67_23086'%20x1='8.78913'%20y1='21.1093'%20x2='10.5051'%20y2='21.1093'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%23E0E0E0'/%3e%3cstop%20offset='0.28'%20stop-color='%23DADADA'/%3e%3cstop%20offset='0.569'%20stop-color='%23CECECE'/%3e%3cstop%20offset='1'%20stop-color='%23CCCCCC'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e",
						x: "-5",
						y: "-7",
						width: "10",
						height: "12",
						pointerEvents: "none"
					})]
				}, entry.id);
			})
		]
	});
}
function ASClientJourney() {
	const content = useContent("clientJourney", DEFAULT_JOURNEY);
	const entries = content.entries?.length ? content.entries : DEFAULT_JOURNEY.entries;
	const [activeIndex, setActiveIndex] = useState(0);
	const [slideWidth, setSlideWidth] = useState(420);
	const [videoUrl, setVideoUrl] = useState(null);
	const sectionRef = useRef(null);
	const firstSlideRef = useRef(null);
	const hasAnimated = useRef(false);
	const [isVisible, setIsVisible] = useState(false);
	const touchStartRef = useRef(null);
	const CARD_GAP = 20;
	useEffect(() => {
		setActiveIndex(0);
	}, [entries.length]);
	useEffect(() => {
		const el = firstSlideRef.current;
		if (!el) return;
		const ro = new ResizeObserver(([entry]) => {
			setSlideWidth(entry.contentRect.width);
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);
	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const io = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting || hasAnimated.current) return;
			hasAnimated.current = true;
			setIsVisible(true);
			io.disconnect();
		}, { threshold: .2 });
		io.observe(el);
		return () => io.disconnect();
	}, []);
	const goTo = useCallback((index) => {
		setActiveIndex(Math.max(0, Math.min(index, entries.length - 1)));
	}, [entries.length]);
	const handleTouchStart = useCallback((e) => {
		touchStartRef.current = {
			x: e.touches[0].clientX,
			y: e.touches[0].clientY
		};
	}, []);
	const handleTouchEnd = useCallback((e) => {
		if (!touchStartRef.current) return;
		const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
		const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
		touchStartRef.current = null;
		if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
		goTo(dx < 0 ? activeIndex + 1 : activeIndex - 1);
	}, [activeIndex, goTo]);
	return /* @__PURE__ */ jsxs("section", {
		ref: sectionRef,
		id: "client-journey",
		className: `ASClientJourney${isVisible ? " is-visible" : ""}`,
		children: [
			videoUrl && /* @__PURE__ */ jsx(VideoModal$1, {
				url: videoUrl,
				onClose: () => setVideoUrl(null)
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "as-journey-left",
				children: [
					/* @__PURE__ */ jsxs("h2", {
						className: "as-journey-title",
						children: [
							"Our clients journey to",
							/* @__PURE__ */ jsx("br", {}),
							"Energy Independence"
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "as-journey-carousel-wrapper",
						onTouchStart: handleTouchStart,
						onTouchEnd: handleTouchEnd,
						children: /* @__PURE__ */ jsx("div", {
							className: "as-journey-track",
							style: { transform: `translateX(-${activeIndex * (slideWidth + CARD_GAP)}px)` },
							children: entries.map((entry, i) => /* @__PURE__ */ jsxs("div", {
								ref: i === 0 ? firstSlideRef : void 0,
								className: "as-journey-slide",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "as-journey-card-image",
									children: [/* @__PURE__ */ jsx("div", {
										className: "as-journey-img-placeholder",
										style: getYouTubeThumbnail$2(entry.videoUrl) ? {
											backgroundImage: `url(${getYouTubeThumbnail$2(entry.videoUrl)})`,
											backgroundSize: "cover",
											backgroundPosition: "center"
										} : void 0
									}), /* @__PURE__ */ jsx("button", {
										className: "as-journey-watch-btn",
										onClick: () => {
											if (entry.videoUrl) setVideoUrl(entry.videoUrl);
										},
										style: entry.videoUrl ? void 0 : {
											opacity: .4,
											cursor: "default"
										},
										children: /* @__PURE__ */ jsx("img", {
											src: icon_watch_video_default,
											alt: "Watch the video",
											draggable: false
										})
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "as-journey-info",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "as-journey-name-row",
										children: [/* @__PURE__ */ jsx("strong", {
											className: "as-journey-name",
											children: entry.name
										}), /* @__PURE__ */ jsx("span", {
											className: "as-journey-location",
											children: entry.location
										})]
									}), /* @__PURE__ */ jsx("p", {
										className: "as-journey-testimonial",
										children: entry.testimonial
									})]
								})]
							}, entry.id))
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "as-journey-nav",
						children: [
							/* @__PURE__ */ jsx("button", {
								className: "as-journey-nav-btn",
								onClick: () => goTo(activeIndex - 1),
								disabled: activeIndex === 0,
								"aria-label": "Previous",
								children: /* @__PURE__ */ jsx("img", {
									src: icon_prev_default,
									alt: "",
									"aria-hidden": "true",
									draggable: false
								})
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "as-journey-counter",
								children: [
									activeIndex + 1,
									"/",
									entries.length
								]
							}),
							/* @__PURE__ */ jsx("button", {
								className: "as-journey-nav-btn",
								onClick: () => goTo(activeIndex + 1),
								disabled: activeIndex === entries.length - 1,
								"aria-label": "Next",
								children: /* @__PURE__ */ jsx("img", {
									src: icon_next_default,
									alt: "",
									"aria-hidden": "true",
									draggable: false
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "as-journey-right",
				children: /* @__PURE__ */ jsx(PhilippinesMap, {
					entries,
					activeIndex,
					onMarkerClick: goTo
				})
			})
		]
	});
}
//#endregion
//#region src/components/ASEngineeredExcellence.tsx
var DEFAULT_EXCELLENCE_CONTENT = { items: [
	{
		number: "01",
		title: "Zero-Bill Future",
		description: "Eliminate your dependency on fluctuating grid prices. Our net-metering optimized systems turn your roof into a revenue-generating asset that pays you back."
	},
	{
		number: "02",
		title: "Global Tier-1 Standards",
		description: "We exclusively deploy Tier-1 components like SMA inverters and mounting structures tested for typhoons up to 280kph. Built to last 25+ years."
	},
	{
		number: "03",
		title: "Full Compliance",
		description: "Navigating local bureaucracy is our headache, not yours. We handle all permits, ERC compliance, and utility interconnection paperwork end-to-end."
	},
	{
		number: "04",
		title: "Smart Monitoring",
		description: "Real-time data visualization of your energy harvest and consumption. Control your home's power flow from anywhere in the world."
	}
] };
function ASEngineeredExcellence() {
	const sectionRef = useRef(null);
	const hasAnimated = useRef(false);
	const [showLeft, setShowLeft] = useState(false);
	const [visibleCards, setVisibleCards] = useState(-1);
	const content = useContent("excellence", DEFAULT_EXCELLENCE_CONTENT);
	const excellenceItems = useMemo(() => [...content.items ?? []].sort((a, b) => Number(a.number) - Number(b.number)), [content.items]);
	useEffect(() => {
		const el = sectionRef.current;
		if (!el || !excellenceItems.length) return;
		const timeouts = [];
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting || hasAnimated.current) return;
			hasAnimated.current = true;
			setShowLeft(true);
			excellenceItems.forEach((_, index) => {
				timeouts.push(window.setTimeout(() => {
					setVisibleCards(index);
				}, (index + 1) * 250));
			});
			observer.disconnect();
		}, {
			threshold: .2,
			rootMargin: "0px 0px -8% 0px"
		});
		observer.observe(el);
		return () => {
			observer.disconnect();
			timeouts.forEach(clearTimeout);
		};
	}, [excellenceItems]);
	return /* @__PURE__ */ jsxs("section", {
		ref: sectionRef,
		className: "as-engineered",
		children: [/* @__PURE__ */ jsxs("div", {
			className: `as-engineered-left ${showLeft ? "is-shown" : ""}`,
			children: [/* @__PURE__ */ jsxs("h2", {
				className: "as-engineered-title",
				children: [
					"Engineered for ",
					/* @__PURE__ */ jsx("br", {}),
					"Excellence."
				]
			}), /* @__PURE__ */ jsx("p", {
				className: "as-engineered-description",
				children: "We don't just install panels; we integrate intelligent energy systems designed for the unique challenges of the Philippine grid infrastructure."
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "as-engineered-grid",
			children: excellenceItems.map((item, index) => /* @__PURE__ */ jsxs("div", {
				className: `as-engineered-card ${index <= visibleCards ? "is-shown" : ""}`,
				children: [/* @__PURE__ */ jsxs("div", {
					className: "as-engineered-head",
					children: [/* @__PURE__ */ jsx("span", {
						className: "as-engineered-number",
						children: item.number
					}), /* @__PURE__ */ jsx("p", {
						className: "as-engineered-card-title",
						children: item.title
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "as-engineered-body",
					children: [/* @__PURE__ */ jsx("div", { className: "as-engineered-line" }), /* @__PURE__ */ jsx("p", {
						className: "as-engineered-card-description",
						children: item.description
					})]
				})]
			}, item.number))
		})]
	});
}
//#endregion
//#region src/assets/videos/bg_hero_section_dark.mp4
var bg_hero_section_dark_default = "/assets/bg_hero_section_dark-DU3k_VJo.mp4";
//#endregion
//#region src/assets/videos/bg_hero_section_light.mp4
var bg_hero_section_light_default = "/assets/bg_hero_section_light-Gx9Z8Mxc.mp4";
//#endregion
//#region src/components/ASHero.tsx
var DEFAULT_HERO = {
	headerPart1: "Affordable",
	headerPart2: "Solar Power for Every Filipino Home and Business",
	highlightWords: "Affordable",
	subtext: "We Provide Solar Solutions Tailored For Your Home And Business",
	primaryCta: "Calculate Your Savings",
	secondaryCta: "View Projects",
	primaryCtaUrl: "#calculator",
	secondaryCtaUrl: "/projects"
};
function renderHighlighted(text, highlights) {
	const words = highlights.split(",").map((w) => w.trim()).filter(Boolean);
	if (!words.length) return text;
	const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
	const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
	const parts = text.split(pattern);
	const lower = words.map((w) => w.toLowerCase());
	return parts.map((part, i) => lower.includes(part.toLowerCase()) ? /* @__PURE__ */ jsx("span", { children: part }, i) : part);
}
function ASHero() {
	const [show, setShow] = useState(false);
	const navigate = useNavigate();
	const { theme } = useOutletContext();
	const hero = useContent("hero", DEFAULT_HERO);
	useEffect(() => {
		const timeout = setTimeout(() => {
			setShow(true);
		}, 300);
		return () => clearTimeout(timeout);
	}, []);
	const handleCtaClick = (url) => {
		if (url.startsWith("#")) {
			const el = document.getElementById(url.slice(1));
			if (el) el.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		} else navigate(url);
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "ASHero",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: `hero_video ${show ? "animate-video" : ""}`,
				children: /* @__PURE__ */ jsx("video", {
					autoPlay: true,
					muted: true,
					loop: true,
					playsInline: true,
					preload: "auto",
					children: /* @__PURE__ */ jsx("source", {
						src: theme === "light-theme" ? bg_hero_section_light_default : bg_hero_section_dark_default,
						type: "video/mp4"
					})
				}, theme)
			}),
			/* @__PURE__ */ jsx("div", { className: "hero_overlay_dark" }),
			/* @__PURE__ */ jsx("div", {
				className: "hero_banner_overlay",
				children: /* @__PURE__ */ jsxs("div", {
					className: "hero_text",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: `hero_header_text ${show ? "animate-in delay-1" : ""}`,
							children: renderHighlighted(`${hero.headerPart1} ${hero.headerPart2}`, hero.highlightWords ?? hero.headerPart1)
						}),
						/* @__PURE__ */ jsx("p", {
							className: `hero_subtext ${show ? "animate-in delay-2" : ""}`,
							children: hero.subtext
						}),
						/* @__PURE__ */ jsxs("div", {
							className: `hero_action_buttons ${show ? "animate-in delay-3" : ""}`,
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-primary",
								onClick: () => handleCtaClick(hero.primaryCtaUrl ?? "#calculator"),
								children: hero.primaryCta
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-outline view_projects",
								onClick: () => handleCtaClick(hero.secondaryCtaUrl ?? "/projects"),
								children: hero.secondaryCta
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
//#region src/modules/rolling-card/ASRollingCard.tsx
function parseAnimatedValue(value) {
	const match = value.match(/^(.*?)(\d[\d,.]*)(.*)$/);
	if (!match) return null;
	return {
		prefix: match[1],
		numeric: match[2],
		suffix: match[3]
	};
}
function countDecimals(numStr) {
	return numStr.replace(/,/g, "").replace(/\+/g, "").split(".")[1]?.length ?? 0;
}
function extractNumericTarget(numericText) {
	const clean = numericText.replace(/[,+]/g, "");
	const parsed = parseFloat(clean);
	return Number.isNaN(parsed) ? 0 : parsed;
}
function formatAnimatedValue(current, template) {
	const hasComma = template.includes(",");
	const decimals = countDecimals(template);
	const hasPlus = template.includes("+");
	let formatted = current.toLocaleString("en-US", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	});
	if (!hasComma) formatted = formatted.replace(/,/g, "");
	if (hasPlus) formatted += "+";
	return formatted;
}
function StatCard({ value, label, duration = 1800 }) {
	const cardRef = useRef(null);
	const frameRef = useRef(null);
	const [hasStarted, setHasStarted] = useState(false);
	const [animatedValue, setAnimatedValue] = useState(0);
	const parsed = useMemo(() => parseAnimatedValue(value), [value]);
	const target = useMemo(() => {
		if (!parsed) return 0;
		return extractNumericTarget(parsed.numeric);
	}, [parsed]);
	useEffect(() => {
		const el = cardRef.current;
		if (!el || hasStarted) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setHasStarted(true);
				observer.disconnect();
			}
		}, { threshold: .35 });
		observer.observe(el);
		return () => observer.disconnect();
	}, [hasStarted]);
	useEffect(() => {
		if (!hasStarted || !parsed) return;
		let startTime = null;
		const animate = (time) => {
			if (startTime === null) startTime = time;
			const progress = Math.min((time - startTime) / duration, 1);
			setAnimatedValue(target * (1 - Math.pow(1 - progress, 3)));
			if (progress < 1) frameRef.current = requestAnimationFrame(animate);
		};
		frameRef.current = requestAnimationFrame(animate);
		return () => {
			if (frameRef.current) cancelAnimationFrame(frameRef.current);
		};
	}, [
		hasStarted,
		target,
		duration,
		parsed
	]);
	return /* @__PURE__ */ jsxs("div", {
		ref: cardRef,
		className: "stat-card",
		children: [/* @__PURE__ */ jsx("p", {
			className: "stat-card-value",
			children: useMemo(() => {
				if (!parsed) return value;
				const formattedNumeric = hasStarted ? formatAnimatedValue(animatedValue, parsed.numeric) : formatAnimatedValue(0, parsed.numeric);
				return `${parsed.prefix}${formattedNumeric}${parsed.suffix}`;
			}, [
				animatedValue,
				hasStarted,
				parsed,
				value
			])
		}), /* @__PURE__ */ jsx("p", {
			className: "stat-card-label",
			children: label
		})]
	});
}
//#endregion
//#region src/components/ASMetrics.tsx
var DEFAULT_METRICS_CONTENT = { items: [
	{
		value: "0",
		label: "INSTALLED",
		order: 1
	},
	{
		value: "0",
		label: "ACTIVE CLIENTS",
		order: 2
	},
	{
		value: "0",
		label: "CERTIFIED COMPLIANT",
		order: 3
	},
	{
		value: "0",
		label: "PERFORMANCE WARRANTY",
		order: 4
	}
] };
function ASMetrics() {
	const sectionRef = useRef(null);
	const hasAnimated = useRef(false);
	const [visibleCards, setVisibleCards] = useState(-1);
	const metrics = [...useContent("metrics", DEFAULT_METRICS_CONTENT).items].filter((item) => item?.label && item?.value).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting || hasAnimated.current) return;
			hasAnimated.current = true;
			metrics.forEach((_, index) => {
				window.setTimeout(() => {
					setVisibleCards(index);
				}, (index + 1) * 220);
			});
			observer.disconnect();
		}, {
			threshold: .2,
			rootMargin: "0px 0px -8% 0px"
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, [metrics]);
	return /* @__PURE__ */ jsx("section", {
		ref: sectionRef,
		className: "stats-card-section",
		children: metrics.map((item, index) => /* @__PURE__ */ jsx("div", {
			className: `stats-card-wrapper ${index <= visibleCards ? "is-shown" : ""}`,
			children: index <= visibleCards && /* @__PURE__ */ jsx(StatCard, {
				value: item.value,
				label: item.label,
				duration: 1800
			})
		}, `${item.value}-${item.label}-${index}`))
	});
}
//#endregion
//#region src/components/ASProcess.tsx
var DEFAULT_PROCESS_CONTENT = {
	stepsDelay: 800,
	steps: [
		{
			number: "01",
			title: "Consumption Audit",
			description: "We don't guess; we calculate. Our engineers analyze your historical electricity bill data to build a custom ROI map tailored to your specific energy habits. You'll know exactly how much you'll save before we even touch your roof."
		},
		{
			number: "02",
			title: "Resilient Engineering",
			description: "A Licensed Professional Electrical Engineer (PEE) conducts a 100-point structural and shading audit. We design your system to withstand 250 kph winds and maintain peak yield in 40°C+ tropical heat using Global Tier-1 components."
		},
		{
			number: "03",
			title: "Turnkey Activation",
			description: "From Barangay clearances to energy providers Net-Metering permits, we handle the bureaucracy. Our certified in-house teams manage the full installation and grid interconnection, leaving you with nothing to do but flip the switch."
		}
	]
};
function ASProcessSection() {
	const sectionRef = useRef(null);
	const hasAnimated = useRef(false);
	const [activeStep, setActiveStep] = useState(-1);
	const [showFooter, setShowFooter] = useState(false);
	const content = useContent("process", DEFAULT_PROCESS_CONTENT);
	const navigate = useNavigate();
	const steps = useMemo(() => [...content.steps ?? []].sort((a, b) => Number(a.number) - Number(b.number)), [content.steps]);
	const stepsDelay = useMemo(() => content.stepsDelay ?? 800, [content.stepsDelay]);
	useEffect(() => {
		const el = sectionRef.current;
		if (!el || !steps.length) return;
		const timeouts = [];
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting || hasAnimated.current) return;
			hasAnimated.current = true;
			steps.forEach((_, index) => {
				timeouts.push(window.setTimeout(() => {
					setActiveStep(index);
				}, (index + 1) * stepsDelay));
			});
			timeouts.push(window.setTimeout(() => {
				setShowFooter(true);
			}, (steps.length + 1) * stepsDelay));
			observer.disconnect();
		}, {
			threshold: .2,
			rootMargin: "0px 0px -8% 0px"
		});
		observer.observe(el);
		return () => {
			observer.disconnect();
			timeouts.forEach(clearTimeout);
		};
	}, [steps, stepsDelay]);
	const progressWidth = activeStep < 0 ? 0 : (activeStep + 1) / steps.length * 100;
	return /* @__PURE__ */ jsxs("section", {
		ref: sectionRef,
		className: "as-process",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "as-process-desktop",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "as-process-steps",
						children: steps.map((step, index) => /* @__PURE__ */ jsxs("div", {
							className: `as-process-step ${index <= activeStep ? "is-shown" : ""}`,
							children: [/* @__PURE__ */ jsx("span", {
								className: "as-process-number",
								children: step.number
							}), /* @__PURE__ */ jsx("p", {
								className: "as-process-title",
								children: step.title
							})]
						}, step.number))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "as-process-line",
						children: [
							/* @__PURE__ */ jsx("div", { className: "as-process-line-track" }),
							/* @__PURE__ */ jsx("div", {
								className: "as-process-line-bar",
								style: { width: `${progressWidth}%` }
							}),
							/* @__PURE__ */ jsx("div", {
								className: "as-process-line-dot",
								style: {
									left: `${progressWidth}%`,
									opacity: activeStep < 0 ? 0 : 1
								}
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "as-process-content",
						children: steps.map((step, index) => /* @__PURE__ */ jsxs("div", {
							className: `as-process-card ${index <= activeStep ? "is-shown" : ""}`,
							children: [/* @__PURE__ */ jsx("p", {
								className: "as-process-card-title",
								children: step.title
							}), /* @__PURE__ */ jsx("p", {
								className: "as-process-card-description",
								children: step.description
							})]
						}, step.number))
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "as-process-mobile",
				children: steps.map((step, index) => /* @__PURE__ */ jsxs("div", {
					className: `as-process-mobile-item ${index <= activeStep ? "is-shown" : ""}`,
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "as-process-mobile-head",
							children: [/* @__PURE__ */ jsx("span", {
								className: "as-process-number",
								children: step.number
							}), /* @__PURE__ */ jsx("p", {
								className: "as-process-title",
								children: step.title
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "as-process-mobile-line",
							children: /* @__PURE__ */ jsx("span", {})
						}),
						/* @__PURE__ */ jsx("p", {
							className: "as-process-card-description",
							children: step.description
						})
					]
				}, step.number))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: `as-process-footer ${showFooter ? "is-shown" : ""}`,
				children: [/* @__PURE__ */ jsx("div", {
					className: "as-process-video",
					children: /* @__PURE__ */ jsx("video", {
						src: bg_hero_section_light_default,
						autoPlay: true,
						muted: true,
						loop: true,
						playsInline: true,
						preload: "auto",
						"aria-hidden": "true"
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "as-process-cta",
					children: [/* @__PURE__ */ jsx("p", { children: "Your Path to Energy Independence" }), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => navigate("/client-journey"),
						children: "Get Started"
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/ASTropicsCards.tsx
var cards = [
	{
		type: "climate",
		title: "Climate Resilience",
		tags: ["TYPHOON-RATED RACKING", "HIGH-HEAT OPTIMIZATION"],
		image: "/assets/climate_bg_dark-BGnYzuoL.png"
	},
	{
		type: "solar",
		subtitle: "SOLAR ASSETS DEPLOYED",
		image: "/assets/assets_deployed_dark-BZYbhfx1.png"
	},
	{
		type: "performance",
		title: "Performance Guarantee",
		subtitle: "AVERAGE ELECTRICITY BILL REDUCTION FOR OUR CLIENTS",
		image: "/images/performance-bg.jpg"
	}
];
function useCountUp(target, isActive, duration = 1500, decimals = 0) {
	const [value, setValue] = useState(0);
	useEffect(() => {
		if (!isActive) return;
		const start = performance.now();
		let rafId;
		function step(now) {
			const progress = Math.min((now - start) / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			setValue(Number((target * eased).toFixed(decimals)));
			if (progress < 1) rafId = requestAnimationFrame(step);
			else setValue(target);
		}
		rafId = requestAnimationFrame(step);
		return () => cancelAnimationFrame(rafId);
	}, [
		isActive,
		target,
		duration,
		decimals
	]);
	return value;
}
function ASTropicsCards({ isVisible, assetsDeployed, performanceRating }) {
	const assetsNumber = parseFloat(assetsDeployed);
	const assetsUnit = assetsDeployed.replace(/[\d.]/g, "");
	const rolledAssets = useCountUp(assetsNumber, isVisible, 1600, 2);
	const rolledPerformance = useCountUp(performanceRating, isVisible, 1400, 0);
	const totalBars = 12;
	const activeBars = useMemo(() => {
		return Math.max(0, Math.ceil(Math.min(Math.max(performanceRating, 0), 100) / 100 * totalBars) - 2);
	}, [performanceRating]);
	const maxBarsHeight = 140;
	const barGap = 4;
	const barHeight = (maxBarsHeight - (totalBars - 1) * barGap) / totalBars;
	return /* @__PURE__ */ jsxs("div", {
		className: "as-tropics-cards",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: `as-tropics-card as-climate-card ${isVisible ? "is-shown" : ""}`,
				style: { backgroundImage: `url(${cards[0].image})` },
				children: [
					/* @__PURE__ */ jsx("div", { className: "as-card-overlay" }),
					/* @__PURE__ */ jsx("p", {
						className: "as-climate-title",
						children: cards[0].title
					}),
					/* @__PURE__ */ jsx("div", {
						className: "as-climate-tags",
						children: cards[0].tags?.map((tag) => /* @__PURE__ */ jsx("span", { children: tag }, tag))
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: `as-tropics-card as-solar-card ${isVisible ? "is-shown" : ""}`,
				style: { backgroundImage: `url(${cards[1].image})` },
				children: [/* @__PURE__ */ jsx("div", { className: "as-card-overlay as-solar-overlay" }), /* @__PURE__ */ jsxs("div", {
					className: "as-solar-content",
					children: [/* @__PURE__ */ jsxs("p", {
						className: "as-solar-title",
						children: [rolledAssets.toFixed(2), assetsUnit]
					}), /* @__PURE__ */ jsx("p", {
						className: "as-solar-description",
						children: cards[1].subtitle
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: `as-tropics-card as-performance-card ${isVisible ? "is-shown" : ""}`,
				style: { backgroundImage: `url(${cards[2].image})` },
				children: /* @__PURE__ */ jsxs("div", {
					className: "as-performance-card-container",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "as-performance-title",
							children: cards[2].title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "as-performance-description",
							children: cards[2].subtitle
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "as-performance-content",
							children: [/* @__PURE__ */ jsx("div", {
								className: `as-performance-bars ${isVisible ? "is-animated" : ""}`,
								style: {
									"--bar-height": `${barHeight}px`,
									"--bar-gap": `${barGap}px`
								},
								children: Array.from({ length: totalBars }).map((_, index) => {
									const isActive = index >= totalBars - activeBars;
									return /* @__PURE__ */ jsx("span", {
										className: isActive ? "active" : "inactive",
										style: { "--bar-delay": isActive ? `${(totalBars - 1 - index) * .07}s` : "0s" }
									}, index);
								})
							}), /* @__PURE__ */ jsxs("p", {
								className: "as-performance-percentage",
								children: [Math.round(rolledPerformance), "%"]
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
//#region src/components/ASTropics.tsx
var DEFAULT_TROPICS = {
	header: "Solar Energy for the Tropics",
	subtext: "Standard solar systems are often not equipped to handle the unique challenges of the tropics. At azari.solar we bridge the Trust Gap with resilient design for the philippine archipelago.",
	performanceRating: 87
};
var DEFAULT_METRICS = { items: [{
	value: "0",
	label: "INSTALLED",
	order: 1
}] };
function ASTropicsSection() {
	const sectionRef = useRef(null);
	const hasAnimated = useRef(false);
	const [isVisible, setIsVisible] = useState(false);
	const [showText, setShowText] = useState(false);
	const tropics = useContent("tropics", DEFAULT_TROPICS);
	const installedValue = useContent("metrics", DEFAULT_METRICS).items.find((i) => i.label === "INSTALLED")?.value ?? "0";
	const headerParts = tropics.header.split(/\n|<br\s*\/?\s*>/i).map((part) => part.trim()).filter(Boolean);
	const headerTop = headerParts[0] ?? "Solar Energy for the";
	const headerBottom = headerParts[1] ?? "Tropics";
	const [subtextBeforeBrand, subtextAfterBrand] = (tropics.subtext.includes("azari.solar") ? tropics.subtext : "Standard solar systems are often not equipped to handle the unique challenges of the tropics. At azari.solar we bridge the Trust Gap with resilient design for the philippine archipelago.").split("azari.solar");
	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const timeouts = [];
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting || hasAnimated.current) return;
			hasAnimated.current = true;
			timeouts.push(window.setTimeout(() => setIsVisible(true), 200), window.setTimeout(() => setShowText(true), 600));
			observer.disconnect();
		}, { threshold: .25 });
		observer.observe(el);
		return () => {
			observer.disconnect();
			timeouts.forEach(clearTimeout);
		};
	}, []);
	return /* @__PURE__ */ jsxs("section", {
		ref: sectionRef,
		className: "as-tropics-section",
		children: [/* @__PURE__ */ jsx(ASTropicsCards, {
			isVisible,
			assetsDeployed: installedValue,
			performanceRating: tropics.performanceRating ?? 87
		}), /* @__PURE__ */ jsxs("div", {
			className: `as-tropics-text ${showText ? "is-shown" : ""}`,
			children: [/* @__PURE__ */ jsxs("p", {
				className: "header",
				children: [
					headerTop,
					" ",
					/* @__PURE__ */ jsx("br", {}),
					headerBottom
				]
			}), /* @__PURE__ */ jsxs("p", {
				className: "subtext",
				children: [
					subtextBeforeBrand,
					/* @__PURE__ */ jsx("span", { children: "azari.solar" }),
					subtextAfterBrand
				]
			})]
		})]
	});
}
//#endregion
//#region src/pages/ASDashboard.tsx
var DEFAULT_VISIBILITY$1 = {
	hero: true,
	metrics: true,
	benefits: true,
	excellence: true,
	tropics: true,
	process: true,
	clientJourney: true,
	calculator: true,
	callToAction: true,
	packages: true
};
function ASDashboard() {
	useSeoMeta({
		title: "Azari Solar — Solar Panel Installer in Bohol, Philippines",
		description: "Affordable solar packages and professional installation for homes & businesses in Tagbilaran, Bohol. Hybrid, grid-tie, and off-grid systems. Get a free quote.",
		canonical: "https://azari.solar/"
	});
	const vis = useContent("section-visibility", DEFAULT_VISIBILITY$1);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		vis.hero && /* @__PURE__ */ jsx("section", {
			className: "_asHero",
			id: "hero",
			children: /* @__PURE__ */ jsx(ASHero, {})
		}),
		vis.metrics && /* @__PURE__ */ jsx("section", {
			className: "_asMetrics",
			id: "metrics",
			children: /* @__PURE__ */ jsx(ASMetrics, {})
		}),
		vis.benefits && /* @__PURE__ */ jsx("section", {
			className: "_asBenefitsBanner",
			id: "benefits",
			children: /* @__PURE__ */ jsx(ASBenefitsBanner, {})
		}),
		vis.excellence && /* @__PURE__ */ jsx("section", {
			className: "_asEngineeredExcellence",
			id: "excellence",
			children: /* @__PURE__ */ jsx(ASEngineeredExcellence, {})
		}),
		vis.tropics && /* @__PURE__ */ jsx("section", {
			className: "_asTropicsSection",
			id: "tropics",
			children: /* @__PURE__ */ jsx(ASTropicsSection, {})
		}),
		vis.process && /* @__PURE__ */ jsx("section", {
			className: "_asProcessSection",
			id: "process",
			children: /* @__PURE__ */ jsx(ASProcessSection, {})
		}),
		vis.clientJourney && /* @__PURE__ */ jsx("section", {
			className: "_asClientJourney",
			id: "client-journey",
			children: /* @__PURE__ */ jsx(ASClientJourney, {})
		}),
		vis.calculator && /* @__PURE__ */ jsx("section", {
			className: "_asImpactCalculator",
			id: "calculator",
			children: /* @__PURE__ */ jsx(ASImpactCalculator, {})
		}),
		vis.callToAction && /* @__PURE__ */ jsx("section", {
			className: "_asCallToAction",
			id: "call-to-action",
			children: /* @__PURE__ */ jsx(ASCallToAction, {})
		})
	] });
}
//#endregion
//#region app/routes/_index.tsx
var _index_exports = /* @__PURE__ */ __exportAll({
	default: () => _index_default,
	meta: () => meta$7
});
var meta$7 = () => [
	{ title: "Azari Solar — Solar Panel Installer in Bohol, Philippines" },
	{
		name: "description",
		content: "Affordable solar packages and professional installation for homes & businesses in Tagbilaran, Bohol. Hybrid, grid-tie, and off-grid systems. Get a free quote."
	},
	{
		name: "robots",
		content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
	},
	{
		tagName: "link",
		rel: "canonical",
		href: "https://azari.solar/"
	},
	{
		property: "og:type",
		content: "website"
	},
	{
		property: "og:url",
		content: "https://azari.solar/"
	},
	{
		property: "og:title",
		content: "Azari Solar — Solar Panel Installer in Bohol, Philippines"
	},
	{
		property: "og:description",
		content: "Affordable solar packages and professional installation for homes and businesses in Bohol. Hybrid, grid-tie, and off-grid systems."
	},
	{
		property: "og:image",
		content: "https://azari.solar/preview.jpg"
	},
	{
		property: "og:image:width",
		content: "1200"
	},
	{
		property: "og:image:height",
		content: "630"
	},
	{
		property: "og:image:alt",
		content: "Azari Solar — Solar Panel Installation in Bohol, Philippines"
	},
	{
		property: "og:locale",
		content: "en_PH"
	},
	{
		property: "og:site_name",
		content: "Azari Solar"
	},
	{
		name: "twitter:card",
		content: "summary_large_image"
	},
	{
		name: "twitter:title",
		content: "Azari Solar — Solar Panel Installer in Bohol, Philippines"
	},
	{
		name: "twitter:description",
		content: "Affordable solar packages and professional installation for homes and businesses in Bohol, Philippines."
	},
	{
		name: "twitter:image",
		content: "https://azari.solar/preview.jpg"
	}
];
var _index_default = UNSAFE_withComponentProps(function Index() {
	return /* @__PURE__ */ jsx(ASDashboard, {});
});
//#endregion
//#region src/assets/animations/logo-animated.svg
var logo_animated_default = "/assets/logo-animated-h9JNLCMM.svg";
//#endregion
//#region src/components/ASImgLoader.tsx
function ASImgLoader({ wrapClassName, onLoad, onError, ...imgProps }) {
	const [loaded, setLoaded] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: `as-img-loader${wrapClassName ? ` ${wrapClassName}` : ""}`,
		children: [/* @__PURE__ */ jsx("img", {
			...imgProps,
			onLoad: (e) => {
				setLoaded(true);
				onLoad?.(e);
			},
			onError: (e) => {
				setLoaded(true);
				onError?.(e);
			}
		}), !loaded && /* @__PURE__ */ jsx("div", {
			className: "as-img-loader-overlay",
			"aria-hidden": "true",
			children: /* @__PURE__ */ jsx("img", {
				src: "/assets/logo-animated-h9JNLCMM.svg",
				alt: "",
				className: "as-img-loader-logo"
			})
		})]
	});
}
//#endregion
//#region src/components/ASProjects.tsx
var filters = [
	"All Projects",
	"Recent Projects",
	"Residential Projects",
	"Commercial Projects",
	"Industrial Projects"
];
function getYouTubeThumbnail$1(url) {
	if (!url) return null;
	const ytWatch = url.match(/youtube\.com\/watch\?.*v=([\w-]+)/);
	if (ytWatch) return `https://img.youtube.com/vi/${ytWatch[1]}/maxresdefault.jpg`;
	const ytShort = url.match(/youtu\.be\/([\w-]+)/);
	if (ytShort) return `https://img.youtube.com/vi/${ytShort[1]}/maxresdefault.jpg`;
	return null;
}
function getYouTubeFallbackThumbnail(src) {
	if (!src.includes("img.youtube.com")) return null;
	if (src.includes("maxresdefault")) return src.replace("maxresdefault", "mqdefault");
	return null;
}
function apiToProject(p) {
	const filter = ["All Projects", `${p.category} Projects`];
	if (p.isRecent) filter.push("Recent Projects");
	const thumbnail = getYouTubeThumbnail$1(p.videoUrl);
	return {
		id: p.id,
		title: p.title,
		category: p.category,
		system: p.system,
		savings: p.savings,
		image: thumbnail ?? p.imageUrl,
		filter
	};
}
function ASProjects() {
	useSeoMeta({
		title: "Solar Projects in Bohol, Philippines",
		description: "See completed residential and commercial solar installations by Azari Solar across Bohol and the Philippines. Real projects, real energy savings.",
		canonical: "https://azari.solar/projects"
	});
	const navigate = useNavigate();
	const [activeFilter, setActiveFilter] = useState("All Projects");
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		fetchProjects().then((data) => setProjects(data.map(apiToProject))).finally(() => setLoading(false));
	}, []);
	const activeIndex = filters.indexOf(activeFilter);
	const filterRefs = useRef([]);
	const [indicatorStyle, setIndicatorStyle] = useState({
		width: 0,
		x: 0
	});
	useLayoutEffect(() => {
		const activeButton = filterRefs.current[activeIndex];
		if (!activeButton) return;
		setIndicatorStyle({
			width: activeButton.offsetWidth,
			x: activeButton.offsetLeft
		});
	}, [activeIndex]);
	const filteredProjects = useMemo(() => {
		return projects.filter((project) => project.filter.includes(activeFilter));
	}, [projects, activeFilter]);
	const hasProjectData = projects.length > 0;
	const emptyTitle = hasProjectData ? "Nothing in this view yet" : "Portfolio updates incoming";
	const emptyDescription = hasProjectData ? "Try a different filter to see other completed installations, savings snapshots, and system details." : "Project records have not been published yet. When the portfolio is available, this section will show completed installations, estimated savings, and system details.";
	return /* @__PURE__ */ jsxs("section", {
		className: "as-projects-section",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "as-projects-header",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "as-projects-title",
					children: "Our Solar Installations Portfolio"
				}), /* @__PURE__ */ jsx("p", {
					className: "as-projects-description",
					children: "Proven Resilience. Quantifiable Savings. Explore our nationwide portfolio of engineering excellence—built for the tropics and designed for maximum ROI."
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "as-projects-filters",
				children: [/* @__PURE__ */ jsx("span", {
					className: "as-projects-filter-indicator",
					style: {
						width: `${indicatorStyle.width}px`,
						transform: `translateX(${indicatorStyle.x}px)`
					}
				}), filters.map((filter, index) => /* @__PURE__ */ jsx("button", {
					ref: (el) => {
						filterRefs.current[index] = el;
					},
					className: `as-projects-filter ${activeFilter === filter ? "active" : ""}`,
					onClick: () => setActiveFilter(filter),
					children: filter
				}, filter))]
			}),
			loading ? /* @__PURE__ */ jsx("div", {
				className: "as-projects-grid",
				children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxs("div", {
					className: "as-project-card-skeleton",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ jsx("div", {
						className: "as-project-skeleton-image",
						children: /* @__PURE__ */ jsx("img", {
							src: logo_animated_default,
							alt: "",
							className: "as-project-skeleton-logo"
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "as-project-skeleton-body",
						children: [
							/* @__PURE__ */ jsx("div", { className: "as-project-skeleton-line as-project-skeleton-line--short" }),
							/* @__PURE__ */ jsx("div", { className: "as-project-skeleton-line" }),
							/* @__PURE__ */ jsx("div", { className: "as-project-skeleton-line as-project-skeleton-line--med" })
						]
					})]
				}, i))
			}) : filteredProjects.length > 0 ? /* @__PURE__ */ jsx("div", {
				className: "as-projects-grid",
				children: filteredProjects.map((project, index) => /* @__PURE__ */ jsxs("article", {
					className: "as-project-card",
					style: {
						animationDelay: `${index * 90}ms`,
						cursor: "pointer"
					},
					role: "button",
					tabIndex: 0,
					onClick: () => navigate(`/projects/${project.id}`),
					onKeyDown: (e) => {
						if (e.key === "Enter") navigate(`/projects/${project.id}`);
					},
					children: [
						/* @__PURE__ */ jsx(ASImgLoader, {
							src: project.image,
							alt: project.title,
							wrapClassName: "as-img-loader-fill",
							onError: (e) => {
								const fallback = getYouTubeFallbackThumbnail(e.currentTarget.src);
								if (fallback) e.currentTarget.src = fallback;
							}
						}),
						/* @__PURE__ */ jsx("div", { className: "as-project-card-shade" }),
						/* @__PURE__ */ jsxs("div", {
							className: "as-project-card-content",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "as-project-card-top",
									children: [/* @__PURE__ */ jsx("p", { children: project.category }), /* @__PURE__ */ jsxs("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "18",
										height: "18",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2.5",
										strokeLinecap: "square",
										strokeLinejoin: "miter",
										"aria-hidden": "true",
										children: [/* @__PURE__ */ jsx("line", {
											x1: "5",
											y1: "19",
											x2: "19",
											y2: "5"
										}), /* @__PURE__ */ jsx("polyline", { points: "5 5 19 5 19 19" })]
									})]
								}),
								/* @__PURE__ */ jsx("h3", { children: project.title }),
								/* @__PURE__ */ jsxs("div", {
									className: "as-project-card-stats",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", { children: "System" }), /* @__PURE__ */ jsx("strong", { children: project.system })] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", { children: "Estimated Savings" }), /* @__PURE__ */ jsxs("strong", { children: [
										project.savings,
										" ",
										/* @__PURE__ */ jsx("small", { children: "(10-Year)" })
									] })] })]
								})
							]
						})
					]
				}, project.id))
			}) : /* @__PURE__ */ jsxs("div", {
				className: "as-projects-empty",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "as-projects-empty-visual",
						"aria-hidden": "true",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "as-projects-empty-sun",
								children: /* @__PURE__ */ jsx("span", {})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "as-projects-empty-line",
								children: /* @__PURE__ */ jsx("span", { className: "as-projects-empty-line-pulse" })
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "as-projects-empty-panels",
								children: [
									/* @__PURE__ */ jsx("i", {}),
									/* @__PURE__ */ jsx("i", {}),
									/* @__PURE__ */ jsx("i", {})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "as-projects-empty-storage",
								children: [/* @__PURE__ */ jsx("span", { className: "as-projects-empty-storage-cap" }), /* @__PURE__ */ jsx("span", { className: "as-projects-empty-storage-level" })]
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "as-projects-empty-eyebrow",
						children: "Azari Solar"
					}),
					/* @__PURE__ */ jsx("h3", { children: emptyTitle }),
					/* @__PURE__ */ jsx("p", { children: emptyDescription }),
					hasProjectData && activeFilter !== "All Projects" && /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "as-projects-empty-action",
						onClick: () => setActiveFilter("All Projects"),
						children: "Show all projects"
					})
				]
			})
		]
	});
}
//#endregion
//#region app/routes/projects._index.tsx
var projects__index_exports = /* @__PURE__ */ __exportAll({
	default: () => projects__index_default,
	meta: () => meta$6
});
var meta$6 = () => [
	{ title: "Solar Installation Projects — Azari Solar" },
	{
		name: "description",
		content: "Browse completed solar panel installations by Azari Solar in Bohol and across the Philippines. See real projects with system specs and performance data."
	},
	{
		name: "robots",
		content: "index, follow"
	},
	{
		tagName: "link",
		rel: "canonical",
		href: "https://azari.solar/projects"
	},
	{
		property: "og:type",
		content: "website"
	},
	{
		property: "og:url",
		content: "https://azari.solar/projects"
	},
	{
		property: "og:title",
		content: "Solar Installation Projects — Azari Solar"
	},
	{
		property: "og:description",
		content: "Browse completed solar panel installations by Azari Solar in Bohol and across the Philippines."
	},
	{
		property: "og:image",
		content: "https://azari.solar/preview.jpg"
	},
	{
		name: "twitter:card",
		content: "summary_large_image"
	},
	{
		name: "twitter:title",
		content: "Solar Installation Projects — Azari Solar"
	},
	{
		name: "twitter:description",
		content: "Browse completed solar panel installations by Azari Solar in Bohol and across the Philippines."
	},
	{
		name: "twitter:image",
		content: "https://azari.solar/preview.jpg"
	}
];
var projects__index_default = UNSAFE_withComponentProps(function Projects() {
	return /* @__PURE__ */ jsx(ASProjects, {});
});
//#endregion
//#region src/assets/icons/icon-go-back.svg
var icon_go_back_default = "/assets/icon-go-back-D63bHqyr.svg";
//#endregion
//#region src/components/ASBentoCard.tsx
function HeroBentoCardView({ item, staticMetric: _sm }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "as-pd-bento-hero",
		style: { "--bento-hero-accent": item.accent ?? "#c84020" },
		children: [
			item.imageUrl && /* @__PURE__ */ jsx("img", {
				src: item.imageUrl,
				alt: item.title,
				className: "as-pd-bento-hero-img"
			}),
			item.badge && /* @__PURE__ */ jsx("span", {
				className: "as-pd-bento-hero-badge",
				children: item.badge
			}),
			/* @__PURE__ */ jsx("div", {
				className: "as-pd-bento-hero-content",
				children: /* @__PURE__ */ jsx("h3", {
					className: "as-pd-bento-title",
					children: item.title
				})
			}),
			item.tag && /* @__PURE__ */ jsx("span", {
				className: "as-pd-bento-pill",
				children: item.tag
			})
		]
	});
}
function FeatureBentoCardView({ item, staticMetric: _sm }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "as-pd-bento-feature",
		children: [
			item.imageUrl && /* @__PURE__ */ jsx("img", {
				src: item.imageUrl,
				alt: item.title,
				className: "as-pd-bento-feature-img"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "as-pd-bento-feature-content",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "as-pd-bento-title",
					children: item.title
				}), item.description && /* @__PURE__ */ jsx("p", {
					className: "as-pd-bento-subtitle",
					children: item.description
				})]
			}),
			item.tag && /* @__PURE__ */ jsx("span", {
				className: "as-pd-bento-pill",
				children: item.tag
			})
		]
	});
}
var CARD_REGISTRY = {
	hero: HeroBentoCardView,
	feature: FeatureBentoCardView
};
function coerceLegacy(raw) {
	if (!raw || typeof raw !== "object") return {
		cardType: "feature",
		title: ""
	};
	const r = raw;
	const ct = r.cardType;
	if (ct === "hero") return raw;
	if (ct === "feature") return raw;
	if (ct === "stat") return {
		cardType: "feature",
		title: String(r.statLabel ?? r.title ?? ""),
		description: r.statValue != null ? `${r.statValue}${r.statUnit ?? ""}` : void 0
	};
	if (ct === "featured" || r.featured === true) return {
		cardType: "hero",
		title: String(r.title ?? ""),
		badge: r.badge,
		imageUrl: r.imageUrl
	};
	if (ct === "metric") return {
		cardType: "feature",
		title: String(r.title ?? ""),
		description: r.metricValue != null ? `${r.metricValue}%` : void 0
	};
	return {
		cardType: "feature",
		title: String(r.title ?? ""),
		description: r.subtitle,
		imageUrl: r.imageUrl
	};
}
function BentoCard({ item: rawItem, staticMetric = false }) {
	const item = coerceLegacy(rawItem);
	return /* @__PURE__ */ jsx(CARD_REGISTRY[item.cardType] ?? CARD_REGISTRY.feature, {
		item,
		staticMetric
	});
}
//#endregion
//#region src/pages/ASProjectDetail.tsx
function getVideoEmbedUrl(url) {
	if (!url.trim()) return null;
	const ytWatch = url.match(/youtube\.com\/watch\?.*v=([\w-]+)/);
	if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}?autoplay=1`;
	const ytShort = url.match(/youtu\.be\/([\w-]+)/);
	if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}?autoplay=1`;
	return url;
}
function VideoModal({ url, onClose }) {
	const isDirectVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(url);
	const embedUrl = getVideoEmbedUrl(url);
	const iframeRef = useRef(null);
	const videoRef = useRef(null);
	const handleClose = useCallback(() => {
		if (iframeRef.current) iframeRef.current.src = "";
		if (videoRef.current) videoRef.current.pause();
		onClose();
	}, [onClose]);
	useEffect(() => {
		const onKey = (e) => {
			if (e.key === "Escape") handleClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [handleClose]);
	return createPortal(/* @__PURE__ */ jsx("div", {
		className: "as-video-backdrop",
		onClick: handleClose,
		children: /* @__PURE__ */ jsxs("div", {
			className: "as-video-container",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ jsx("button", {
				className: "as-video-close",
				onClick: handleClose,
				"aria-label": "Close video",
				children: "×"
			}), isDirectVideo ? /* @__PURE__ */ jsx("video", {
				ref: videoRef,
				src: url,
				autoPlay: true,
				playsInline: true,
				className: "as-video-player"
			}) : embedUrl ? /* @__PURE__ */ jsx("iframe", {
				ref: iframeRef,
				src: embedUrl,
				className: "as-video-frame",
				allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
				allowFullScreen: true,
				title: "Project video"
			}) : null]
		})
	}), document.body);
}
var YT_ID_PATTERNS = [
	/youtube\.com\/watch\?.*v=([\w-]+)/,
	/youtu\.be\/([\w-]+)/,
	/youtube\.com\/embed\/([\w-]+)/
];
function getYouTubeId(url) {
	if (!url) return null;
	for (const re of YT_ID_PATTERNS) {
		const match = url.match(re);
		if (match) return match[1];
	}
	return null;
}
function getYouTubeThumbnail(url, quality = "maxres") {
	const id = getYouTubeId(url);
	if (!id) return null;
	return `https://img.youtube.com/vi/${id}/${quality === "maxres" ? "maxresdefault.jpg" : "hqdefault.jpg"}`;
}
function resolveHeroChips(project) {
	const cards = project.heroCards ?? [];
	if (cards.length > 0) return cards.slice(0, 5).flatMap((card) => {
		if (card.type === "custom") {
			if (!card.value && !card.label) return [];
			return [{
				value: card.value,
				label: card.label
			}];
		}
		const label = card.label ?? systemFieldDefaultLabel(card.field);
		const value = resolveSystemField(project, card.field);
		if (!value) return [];
		return [{
			value,
			label
		}];
	});
	return buildHeroChips(project);
}
function systemFieldDefaultLabel(field) {
	return {
		loadKw: "Load Capacity",
		storageKwh: "Storage Capacity",
		productionKwp: "Production Capacity",
		savings: "Estimated Savings",
		electricalSystem: "Electrical System"
	}[field] ?? field;
}
function resolveSystemField(project, field) {
	switch (field) {
		case "loadKw": return project.loadKw != null && project.loadKw > 0 ? `${project.loadKw}kW` : null;
		case "storageKwh": {
			const val = project.storageKwh != null && project.storageKwh > 0 ? project.storageKwh : (() => {
				const m = project.system?.match(/\(([\d.]+)\s*kWh/i);
				return m ? parseFloat(m[1]) : 0;
			})();
			return val > 0 ? `${val}kWh` : null;
		}
		case "productionKwp":
			if (project.productionKwp != null && project.productionKwp > 0) return `${project.productionKwp}kWp`;
			{
				const m = project.system?.match(/^([\d.]+)\s*kWp/i);
				return m ? `${m[1]}kWp` : null;
			}
		case "savings": return project.savings || null;
		case "electricalSystem":
			if (project.electricalSystem) return project.electricalSystem;
			if (project.system) return /3-phase|three.phase/i.test(project.system) ? "Three-Phase" : "Single-Phase";
			return null;
		default: return null;
	}
}
function buildHeroChips(project) {
	const chips = [];
	if (project.loadKw != null && project.loadKw > 0) chips.push({
		value: `${project.loadKw}kW`,
		label: "Load Capacity"
	});
	const storageVal = project.storageKwh != null && project.storageKwh > 0 ? project.storageKwh : (() => {
		const m = project.system?.match(/\(([\d.]+)\s*kWh/i);
		return m ? parseFloat(m[1]) : 0;
	})();
	if (storageVal > 0) chips.push({
		value: `${storageVal}kWh`,
		label: "Storage Capacity"
	});
	if (project.productionKwp != null && project.productionKwp > 0) chips.push({
		value: `${project.productionKwp}kWp`,
		label: "Production Capacity"
	});
	else {
		const m = project.system?.match(/^([\d.]+)\s*kWp/i);
		if (m) chips.push({
			value: `${m[1]}kWp`,
			label: "Production Capacity"
		});
	}
	if (project.savings) chips.push({
		value: project.savings,
		label: "Estimated Savings"
	});
	if (project.electricalSystem) chips.push({
		value: project.electricalSystem,
		label: "Electrical System"
	});
	else if (project.system) {
		const isThree = /3-phase|three.phase/i.test(project.system);
		chips.push({
			value: isThree ? "Three-Phase" : "Single-Phase",
			label: "Electrical System"
		});
	}
	const seen = /* @__PURE__ */ new Set();
	return chips.filter((c) => {
		if (seen.has(c.label)) return false;
		seen.add(c.label);
		return true;
	});
}
function HeroSection({ project }) {
	const [videoOpen, setVideoOpen] = useState(false);
	const bottomRef = useRef(null);
	const hasAnimated = useRef(false);
	const [isShown, setIsShown] = useState(false);
	const navigate = useNavigate();
	const chips = resolveHeroChips(project);
	const heroSrc = getYouTubeThumbnail(project.videoUrl) ?? project.imageUrl;
	const heroFallback = getYouTubeThumbnail(project.videoUrl, "hq") ?? project.imageUrl;
	const handleHeroError = useCallback((e) => {
		const img = e.currentTarget;
		if (img.dataset.fallbackApplied === "true") return;
		img.dataset.fallbackApplied = "true";
		img.src = heroFallback;
	}, [heroFallback]);
	const handleHeroLoad = useCallback((e) => {
		const img = e.currentTarget;
		if (img.naturalWidth <= 120 && img.dataset.fallbackApplied !== "true") {
			img.dataset.fallbackApplied = "true";
			img.src = heroFallback;
		}
	}, [heroFallback]);
	useEffect(() => {
		const el = bottomRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting || hasAnimated.current) return;
			hasAnimated.current = true;
			setIsShown(true);
			observer.disconnect();
		}, { threshold: .1 });
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		className: "as-pd-hero",
		children: [
			videoOpen && project.videoUrl && /* @__PURE__ */ jsx(VideoModal, {
				url: project.videoUrl,
				onClose: () => setVideoOpen(false)
			}),
			/* @__PURE__ */ jsx(ASImgLoader, {
				src: heroSrc,
				alt: project.title,
				className: "as-pd-hero-img",
				wrapClassName: "as-img-loader-fill",
				onError: handleHeroError,
				onLoad: handleHeroLoad
			}),
			/* @__PURE__ */ jsx("div", { className: "as-pd-hero-overlay" }),
			/* @__PURE__ */ jsx("button", {
				className: "as-pd-back-btn as-pd-back-btn--mobile",
				onClick: () => navigate(-1),
				"aria-label": "Go back",
				children: /* @__PURE__ */ jsx("img", {
					src: icon_go_back_default,
					alt: ""
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				ref: bottomRef,
				className: `as-pd-hero-bottom${isShown ? " is-shown" : ""}`,
				children: [
					/* @__PURE__ */ jsx("button", {
						className: "as-pd-back-btn as-pd-back-btn--desktop",
						onClick: () => navigate(-1),
						"aria-label": "Go back",
						children: /* @__PURE__ */ jsx("img", {
							src: icon_go_back_default,
							alt: ""
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "as-pd-hero-content",
						children: /* @__PURE__ */ jsxs("div", {
							className: "as-pd-hero-left",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "as-pd-category-badge",
									style: { color: project.categoryColor || "#ffffff" },
									children: project.category.toUpperCase()
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "as-pd-hero-title",
									children: project.title
								}),
								project.subtitle && /* @__PURE__ */ jsx("p", {
									className: "as-pd-hero-subtitle",
									children: project.subtitle
								}),
								chips.length > 0 && /* @__PURE__ */ jsx("div", {
									className: "as-pd-hero-stats",
									children: chips.map((chip) => /* @__PURE__ */ jsxs("div", {
										className: "as-pd-hero-stat",
										children: [/* @__PURE__ */ jsx("span", {
											className: "as-pd-hero-stat-value",
											children: chip.value
										}), /* @__PURE__ */ jsx("span", {
											className: "as-pd-hero-stat-label",
											children: chip.label
										})]
									}, chip.label))
								})
							]
						})
					}),
					project.videoUrl && /* @__PURE__ */ jsx("button", {
						className: "as-pd-hero-play",
						onClick: () => setVideoOpen(true),
						"aria-label": "Watch the video",
						children: /* @__PURE__ */ jsx("img", {
							src: "/assets/icon-play-8mYz7Yj0.svg",
							alt: "",
							draggable: false
						})
					})
				]
			})
		]
	});
}
var PERF_PAGE_SIZE = 3;
function PerformanceSection({ metrics }) {
	const sectionRef = useRef(null);
	const hasAnimated = useRef(false);
	const [isShown, setIsShown] = useState(false);
	const [showAll, setShowAll] = useState(false);
	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting || hasAnimated.current) return;
			hasAnimated.current = true;
			setIsShown(true);
			observer.disconnect();
		}, {
			threshold: .2,
			rootMargin: "0px 0px -8% 0px"
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	if (!metrics || metrics.length === 0) return null;
	const hasMore = metrics.length > PERF_PAGE_SIZE;
	const visible = showAll ? metrics : metrics.slice(0, PERF_PAGE_SIZE);
	return /* @__PURE__ */ jsx("section", {
		ref: sectionRef,
		className: `as-pd-section as-pd-performance${isShown ? " is-shown" : ""}`,
		children: /* @__PURE__ */ jsxs("div", {
			className: "as-pd-container",
			children: [
				/* @__PURE__ */ jsx("h2", {
					className: "as-pd-section-title",
					children: "Performance & Resilience Summary"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "as-pd-perf-grid",
					children: visible.map((m, i) => /* @__PURE__ */ jsxs("div", {
						className: "as-pd-perf-item",
						children: [/* @__PURE__ */ jsx("div", {
							className: "as-pd-perf-title",
							children: m.title
						}), /* @__PURE__ */ jsx("div", {
							className: "as-pd-perf-desc",
							children: m.description
						})]
					}, i))
				}),
				hasMore && /* @__PURE__ */ jsx("button", {
					className: "as-pd-perf-show-more",
					onClick: () => setShowAll((v) => !v),
					children: showAll ? "Show less" : "Show more"
				})
			]
		})
	});
}
function isEmptyBentoCard(item) {
	if (item.cardType === "hero" || item.cardType === "feature") {
		if (item.titleSource?.type === "system") return false;
		return !item.title?.trim();
	}
	return true;
}
function resolveBentoTitle(item, project) {
	if (item.cardType !== "hero" && item.cardType !== "feature") return item;
	if (item.titleSource?.type !== "system") return item;
	const resolved = resolveSystemField(project, item.titleSource.field);
	return resolved ? {
		...item,
		title: resolved
	} : item;
}
function TechnicalBreakdownSection({ items, project }) {
	const sectionRef = useRef(null);
	const hasAnimated = useRef(false);
	const [isShown, setIsShown] = useState(false);
	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting || hasAnimated.current) return;
			hasAnimated.current = true;
			setIsShown(true);
			observer.disconnect();
		}, {
			threshold: .2,
			rootMargin: "0px 0px -8% 0px"
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	const filtered = (items ?? []).filter((item) => !isEmptyBentoCard(item)).map((item) => resolveBentoTitle(item, project)).slice(0, 5);
	if (filtered.length === 0) return null;
	return /* @__PURE__ */ jsx("section", {
		ref: sectionRef,
		className: `as-pd-section as-pd-breakdown${isShown ? " is-shown" : ""}`,
		children: /* @__PURE__ */ jsxs("div", {
			className: "as-pd-container",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "as-pd-section-title",
				children: "Technical Breakdown"
			}), /* @__PURE__ */ jsx("div", {
				className: "as-pd-breakdown-bento",
				"data-count": filtered.length,
				children: filtered.map((item, i) => /* @__PURE__ */ jsx(BentoCard, { item }, i))
			})]
		})
	});
}
function GallerySection({ images }) {
	const sectionRef = useRef(null);
	const hasAnimated = useRef(false);
	const [isShown, setIsShown] = useState(false);
	const [visibleItems, setVisibleItems] = useState(-1);
	const [modalOpen, setModalOpen] = useState(false);
	const [navbarBottom, setNavbarBottom] = useState(91);
	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting || hasAnimated.current) return;
			hasAnimated.current = true;
			setIsShown(true);
			const count = Math.min(images.length, 8);
			Array.from({ length: count }).forEach((_, index) => {
				window.setTimeout(() => setVisibleItems(index), (index + 1) * 180);
			});
			observer.disconnect();
		}, {
			threshold: .2,
			rootMargin: "0px 0px -8% 0px"
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, [images.length]);
	useEffect(() => {
		if (!modalOpen) return;
		const navbar = document.querySelector("header.navbar-section");
		setNavbarBottom(navbar ? Math.round(navbar.getBoundingClientRect().bottom) : 91);
		const onKey = (e) => {
			if (e.key === "Escape") setModalOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [modalOpen]);
	if (!images || images.length === 0) return null;
	const displayImages = images.slice(0, 8);
	const extraImages = images.slice(8);
	const remaining = extraImages.length;
	return /* @__PURE__ */ jsxs("section", {
		ref: sectionRef,
		className: `as-pd-section as-pd-gallery${isShown ? " is-shown" : ""}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "as-pd-container",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "as-pd-section-title",
				children: "Project Installation Gallery"
			}), /* @__PURE__ */ jsx("div", {
				className: "as-pd-gallery-grid",
				children: displayImages.map((src, i) => {
					const isLast = i === displayImages.length - 1 && remaining > 0;
					return /* @__PURE__ */ jsxs("div", {
						className: `as-pd-gallery-item${isLast ? " as-pd-gallery-item--more" : ""}${i <= visibleItems ? " is-shown" : ""}`,
						onClick: isLast ? () => setModalOpen(true) : void 0,
						children: [/* @__PURE__ */ jsx(ASImgLoader, {
							src,
							alt: `Gallery photo ${i + 1}`,
							className: "as-pd-gallery-img",
							wrapClassName: "as-img-loader-block"
						}), isLast && /* @__PURE__ */ jsx("div", {
							className: "as-pd-gallery-more",
							children: /* @__PURE__ */ jsxs("span", { children: ["+", remaining] })
						})]
					}, i);
				})
			})]
		}), modalOpen && createPortal(/* @__PURE__ */ jsx("div", {
			className: "as-pd-gallery-modal-backdrop",
			style: { top: `${navbarBottom}px` },
			onClick: () => setModalOpen(false),
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "More photos",
			children: /* @__PURE__ */ jsxs("div", {
				className: "as-pd-gallery-modal",
				style: { maxHeight: `calc(100vh - ${navbarBottom}px - 32px)` },
				onClick: (e) => e.stopPropagation(),
				children: [/* @__PURE__ */ jsxs("div", {
					className: "as-pd-gallery-modal-header",
					children: [/* @__PURE__ */ jsxs("h3", {
						className: "as-pd-gallery-modal-title",
						children: ["More Photos", /* @__PURE__ */ jsx("span", {
							className: "as-pd-gallery-modal-count",
							children: extraImages.length
						})]
					}), /* @__PURE__ */ jsx("button", {
						className: "as-pd-gallery-modal-close",
						onClick: () => setModalOpen(false),
						"aria-label": "Close gallery",
						children: /* @__PURE__ */ jsxs("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2.5",
							strokeLinecap: "round",
							width: "18",
							height: "18",
							children: [/* @__PURE__ */ jsx("line", {
								x1: "18",
								y1: "6",
								x2: "6",
								y2: "18"
							}), /* @__PURE__ */ jsx("line", {
								x1: "6",
								y1: "6",
								x2: "18",
								y2: "18"
							})]
						})
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "as-pd-gallery-modal-grid",
					children: extraImages.map((src, i) => /* @__PURE__ */ jsx("div", {
						className: "as-pd-gallery-modal-item",
						children: /* @__PURE__ */ jsx(ASImgLoader, {
							src,
							alt: `Gallery photo ${i + 9}`,
							className: "as-pd-gallery-modal-img",
							wrapClassName: "as-img-loader-block"
						})
					}, i))
				})]
			})
		}), document.body)]
	});
}
function TestimonialSection({ testimonial }) {
	const sectionRef = useRef(null);
	const hasAnimated = useRef(false);
	const [isShown, setIsShown] = useState(false);
	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting || hasAnimated.current) return;
			hasAnimated.current = true;
			setIsShown(true);
			observer.disconnect();
		}, {
			threshold: .2,
			rootMargin: "0px 0px -8% 0px"
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ jsx("section", {
		ref: sectionRef,
		className: `as-pd-section as-pd-testimonial-section${isShown ? " is-shown" : ""}`,
		children: /* @__PURE__ */ jsxs("div", {
			className: "as-pd-container",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "as-pd-section-title",
				children: "What our clients say"
			}), /* @__PURE__ */ jsxs("div", {
				className: "as-pd-testimonial-layout",
				children: [/* @__PURE__ */ jsx("div", {
					className: "as-pd-testimonial-author",
					children: /* @__PURE__ */ jsxs("div", {
						className: "as-pd-testimonial-name-role",
						children: [/* @__PURE__ */ jsx("span", {
							className: "as-pd-testimonial-name",
							children: testimonial.clientName
						}), /* @__PURE__ */ jsx("span", {
							className: "as-pd-testimonial-role",
							children: testimonial.clientRole
						})]
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "as-pd-testimonial-quote-container",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "as-pd-testimonial-open-quote",
							"aria-hidden": "true",
							children: "“"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "as-pd-testimonial-quote-inner-container",
							children: /* @__PURE__ */ jsx("p", {
								className: "as-pd-testimonial-quote",
								children: testimonial.quote
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "as-pd-testimonial-close-quote",
							"aria-hidden": "true",
							children: "”"
						})
					]
				})]
			})]
		})
	});
}
function SkeletonLoader() {
	return /* @__PURE__ */ jsxs("div", {
		className: "as-pd-skeleton",
		children: [/* @__PURE__ */ jsx("div", {
			className: "as-pd-skeleton-hero",
			children: /* @__PURE__ */ jsx("img", {
				src: logo_animated_default,
				alt: "",
				className: "as-pd-skeleton-hero-logo"
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "as-pd-container",
			children: [
				/* @__PURE__ */ jsx("div", { className: "as-pd-skeleton-line as-pd-skeleton-line--wide" }),
				/* @__PURE__ */ jsx("div", {
					className: "as-pd-skeleton-perf-grid",
					children: [
						0,
						1,
						2
					].map((i) => /* @__PURE__ */ jsxs("div", {
						className: "as-pd-skeleton-perf-item",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "as-pd-skeleton-line",
								style: {
									width: "55%",
									height: 20,
									marginBottom: 12
								}
							}),
							/* @__PURE__ */ jsx("div", {
								className: "as-pd-skeleton-line",
								style: {
									width: "90%",
									marginBottom: 6
								}
							}),
							/* @__PURE__ */ jsx("div", {
								className: "as-pd-skeleton-line",
								style: {
									width: "75%",
									marginBottom: 6
								}
							}),
							/* @__PURE__ */ jsx("div", {
								className: "as-pd-skeleton-line",
								style: { width: "60%" }
							})
						]
					}, i))
				}),
				/* @__PURE__ */ jsx("div", {
					className: "as-pd-skeleton-line",
					style: {
						width: "40%",
						height: 28,
						marginTop: 60
					}
				}),
				/* @__PURE__ */ jsx("div", { className: "as-pd-skeleton-line as-pd-skeleton-line--short" })
			]
		})]
	});
}
function ASProjectDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [project, setProject] = useState(null);
	const [loading, setLoading] = useState(true);
	useSeoMeta({
		title: project ? project.title : "Projects",
		description: project ? `${project.title} — a solar installation by Azari Solar. ${project.subtitle ?? ""}`.trim() : "Browse completed solar installation projects by Azari Solar.",
		canonical: project ? `https://azari.solar/projects/${id}` : "https://azari.solar/projects"
	});
	const [notFound, setNotFound] = useState(false);
	useEffect(() => {
		if (!id) {
			setNotFound(true);
			setLoading(false);
			return;
		}
		setLoading(true);
		fetchProjectById(id).then((data) => {
			if (!data) setNotFound(true);
			else setProject(data);
			setLoading(false);
		});
	}, [id]);
	if (loading) return /* @__PURE__ */ jsx(SkeletonLoader, {});
	if (notFound || !project) return /* @__PURE__ */ jsx("div", {
		className: "as-pd-not-found",
		children: /* @__PURE__ */ jsxs("div", {
			className: "as-pd-not-found-inner",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "as-pd-not-found-code",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "as-pd-not-found-title",
					children: "Project Not Found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "as-pd-not-found-desc",
					children: "This project may have been removed or the link is incorrect."
				}),
				/* @__PURE__ */ jsx("button", {
					className: "as-pd-not-found-btn",
					onClick: () => navigate("/projects"),
					children: "Back to Projects"
				})
			]
		})
	});
	const metrics = project.performanceMetrics ?? [];
	const breakdown = project.technicalBreakdown ?? [];
	const gallery = project.galleryImages ?? [];
	const testimonial = project.testimonial;
	return /* @__PURE__ */ jsxs("div", {
		className: "as-pd-page",
		children: [
			/* @__PURE__ */ jsx(HeroSection, { project }),
			/* @__PURE__ */ jsx(PerformanceSection, { metrics }),
			/* @__PURE__ */ jsx(TechnicalBreakdownSection, {
				items: breakdown,
				project
			}),
			/* @__PURE__ */ jsx(GallerySection, { images: gallery }),
			testimonial && /* @__PURE__ */ jsx(TestimonialSection, { testimonial }),
			/* @__PURE__ */ jsx(ASCallToAction, {})
		]
	});
}
//#endregion
//#region app/routes/projects.$id.tsx
var projects_$id_exports = /* @__PURE__ */ __exportAll({
	default: () => projects_$id_default,
	loader: () => loader$2,
	meta: () => meta$5
});
var API_BASE$1 = process.env["API_URL"] ?? "http://localhost:4000";
async function loader$2({ params }) {
	try {
		const res = await fetch(`${API_BASE$1}/api/projects/${params["id"]}`, { headers: { Accept: "application/json" } });
		if (!res.ok) return null;
		return (await res.json()).data ?? null;
	} catch {
		return null;
	}
}
var meta$5 = ({ data, params }) => {
	if (!data) return [{ title: "Project Not Found — Azari Solar" }, {
		name: "robots",
		content: "noindex"
	}];
	const project = data;
	const title = `${project.title ?? "Solar Project"} — Azari Solar`;
	const description = project.subtitle ?? `${project.title ?? "Solar project"} by Azari Solar in Bohol, Philippines.`;
	const url = `https://azari.solar/projects/${params["id"]}`;
	const image = project.imageUrl ?? "https://azari.solar/preview.jpg";
	return [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			name: "robots",
			content: "index, follow"
		},
		{
			tagName: "link",
			rel: "canonical",
			href: url
		},
		{
			property: "og:type",
			content: "article"
		},
		{
			property: "og:url",
			content: url
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:image",
			content: image
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "twitter:title",
			content: title
		},
		{
			name: "twitter:description",
			content: description
		},
		{
			name: "twitter:image",
			content: image
		}
	];
};
var projects_$id_default = UNSAFE_withComponentProps(function ProjectDetail() {
	return /* @__PURE__ */ jsx(ASProjectDetails, {});
});
//#endregion
//#region src/lib/units.ts
var UNITS = {
	power: {
		canonical: "kW",
		units: [
			{
				code: "W",
				factorToCanonical: .001
			},
			{
				code: "kW",
				factorToCanonical: 1
			},
			{
				code: "MW",
				factorToCanonical: 1e3
			},
			{
				code: "Wp",
				factorToCanonical: .001
			},
			{
				code: "kWp",
				factorToCanonical: 1
			}
		]
	},
	energy: {
		canonical: "kWh",
		units: [
			{
				code: "Wh",
				factorToCanonical: .001
			},
			{
				code: "kWh",
				factorToCanonical: 1
			},
			{
				code: "MWh",
				factorToCanonical: 1e3
			}
		]
	}
};
var CATEGORY_SPEC = {
	"Solar Panel": {
		field: "productionCapacityKwp",
		dimension: "power",
		offer: ["Wp", "kWp"],
		default: "Wp",
		label: "Production Capacity",
		helper: "Per-panel output",
		canonicalLabel: "kWp",
		example: .62
	},
	"Inverter": {
		field: "loadCapacityKw",
		dimension: "power",
		offer: ["W", "kW"],
		default: "kW",
		label: "Load Capacity",
		helper: "Maximum power conversion",
		canonicalLabel: "kW",
		example: 6
	},
	"Battery": {
		field: "storageCapacityKwh",
		dimension: "energy",
		offer: ["Wh", "kWh"],
		default: "kWh",
		label: "Storage Capacity",
		helper: "Total energy storage",
		canonicalLabel: "kWh",
		example: 5.12
	}
};
var round = (n, dp = 6) => Math.round(n * 10 ** dp) / 10 ** dp;
var unitFactor = (dimension, code) => UNITS[dimension].units.find((u) => u.code === code)?.factorToCanonical ?? 1;
var toCanonical = (displayVal, dimension, code) => round(displayVal * unitFactor(dimension, code));
var fromCanonical = (canonicalVal, dimension, code) => round(canonicalVal / unitFactor(dimension, code));
function formatCapacity(canonicalValue, dimension, opts) {
	if (!Number.isFinite(canonicalValue)) return "";
	const dp = opts?.dp ?? 6;
	if (opts?.humanize) {
		const sorted = [...UNITS[dimension].units].sort((a, b) => a.factorToCanonical - b.factorToCanonical);
		for (const u of sorted) {
			const v = fromCanonical(canonicalValue, dimension, u.code);
			if (Math.abs(v) >= 1 && Math.abs(v) < 1e3) return `${String(round(v, dp))} ${u.code}`;
		}
	}
	const code = opts?.unit ?? UNITS[dimension].canonical;
	const value = fromCanonical(canonicalValue, dimension, code);
	return `${String(round(value, dp))} ${code}`;
}
//#endregion
//#region src/modules/package-inquiry/ASPackageInquiry.tsx
function validate(f) {
	const e = {};
	if (!f.name.trim()) e.name = "Name is required.";
	if (!f.location.trim()) e.location = "Location is required.";
	if (!f.email.trim()) e.email = "Email is required.";
	else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Enter a valid email address.";
	if (!f.phone.trim()) e.phone = "Phone number is required.";
	else if (!/^9\d{9}$/.test(f.phone.trim())) e.phone = "Enter a valid 10-digit number starting with 9.";
	return e;
}
var EMPTY = {
	name: "",
	location: "",
	email: "",
	phone: ""
};
function ASPackageInquiry({ isOpen, pkg, selection, onClose }) {
	const [isClosing, setIsClosing] = useState(false);
	const [form, setForm] = useState(EMPTY);
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);
	const [submitError, setSubmitError] = useState("");
	useEffect(() => {
		if (isOpen) return;
		const t = window.setTimeout(() => {
			setForm(EMPTY);
			setErrors({});
			setSuccess(false);
			setSubmitError("");
		}, 260);
		return () => clearTimeout(t);
	}, [isOpen]);
	useEffect(() => {
		if (!isOpen) return;
		const y = window.scrollY;
		const o = {
			overflow: document.body.style.overflow,
			position: document.body.style.position,
			top: document.body.style.top,
			width: document.body.style.width
		};
		document.body.style.overflow = "hidden";
		document.body.style.position = "fixed";
		document.body.style.top = `-${y}px`;
		document.body.style.width = "100%";
		return () => {
			document.body.style.overflow = o.overflow;
			document.body.style.position = o.position;
			document.body.style.top = o.top;
			document.body.style.width = o.width;
			window.scrollTo(0, y);
		};
	}, [isOpen]);
	const handleClose = () => {
		setIsClosing(true);
		window.setTimeout(() => {
			setIsClosing(false);
			onClose();
		}, 220);
	};
	const setField = (key, val) => {
		setForm((prev) => ({
			...prev,
			[key]: val
		}));
		if (errors[key]) setErrors((prev) => ({
			...prev,
			[key]: void 0
		}));
	};
	const handleSubmit = async () => {
		if (!pkg) return;
		const errs = validate(form);
		if (Object.keys(errs).length > 0) {
			setErrors(errs);
			return;
		}
		setIsSubmitting(true);
		setSubmitError("");
		try {
			const savings = selection ? {
				min: selection.savings.min,
				max: selection.savings.max
			} : computeMonthlySavings(pkg.solarKwp);
			await submitPackageInquiry({
				name: form.name.trim(),
				email: form.email.trim().toLowerCase(),
				phone: `+63${form.phone.trim()}`,
				location: form.location.trim(),
				packageId: pkg.id,
				packageName: pkg.name,
				packageDetails: {
					solarKwp: selection ? selection.solarKwp : pkg.solarKwp,
					inverterKw: selection ? selection.inverterKw : pkg.inverterKw,
					storageKwh: selection ? selection.storageKwh : pkg.storageKwh,
					phase: pkg.phase,
					billRangeMin: savings.min,
					billRangeMax: savings.max,
					totalPrice: selection ? selection.price : pkg.totalPrice,
					qty: selection?.qty,
					components: selection?.components
				}
			});
			setSuccess(true);
		} catch (err) {
			setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};
	if (!isOpen) return null;
	return createPortal(/* @__PURE__ */ jsx("div", {
		className: `as-inq-overlay${isClosing ? " is-closing" : ""}`,
		onClick: handleClose,
		children: /* @__PURE__ */ jsxs("div", {
			className: `as-inq-modal${isClosing ? " is-closing" : ""}${success ? " is-success" : ""}`,
			role: "dialog",
			"aria-modal": "true",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "as-inq-close",
				onClick: handleClose,
				"aria-label": "Close",
				children: "×"
			}), success && pkg ? /* @__PURE__ */ jsxs("div", {
				className: "as-inq-success",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "as-inq-success-icon",
						children: /* @__PURE__ */ jsx("svg", {
							width: "34",
							height: "34",
							viewBox: "0 0 34 34",
							fill: "none",
							children: /* @__PURE__ */ jsx("path", {
								d: "M6 17.5L13.5 25L28 10",
								stroke: "white",
								strokeWidth: "3",
								strokeLinecap: "round",
								strokeLinejoin: "round"
							})
						})
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "as-inq-success-title",
						children: "Inquiry Submitted"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "as-inq-success-desc",
						children: "Thank you! We've received your inquiry. One of our solar experts will get back to you within 1–2 business days."
					}),
					(() => {
						const systemName = (pkg.components?.find((pc) => pc.component.category === "Inverter"))?.component.model ?? pkg.name;
						const inverterKw = selection?.inverterKw ?? pkg.inverterKw;
						const savings = selection?.savings ?? computeMonthlySavings(pkg.solarKwp);
						const comps = selection?.components ?? pkg.components?.map((pc) => ({
							brand: pc.component.brand,
							name: pc.component.name,
							category: pc.component.category,
							quantity: pc.quantity,
							unitPrice: pc.component.unitPrice
						}));
						return /* @__PURE__ */ jsxs("div", {
							className: "as-inq-success-pkg",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "as-inq-success-pkg-name",
									children: systemName
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "as-inq-success-detail-row",
									children: ["Load Capacity: ", formatCapacity(inverterKw, "power", { unit: "kW" })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "as-inq-success-detail-row",
									children: [
										"Monthly Saving: ₱",
										savings.min.toLocaleString(),
										" – ₱",
										savings.max.toLocaleString()
									]
								}),
								comps && comps.length > 0 && /* @__PURE__ */ jsx("ul", {
									className: "as-inq-success-components",
									children: comps.map((c, i) => /* @__PURE__ */ jsxs("li", { children: [
										c.quantity,
										"pc",
										c.quantity > 1 ? "s" : "",
										" ",
										c.brand,
										" ",
										c.name
									] }, i))
								})
							]
						});
					})(),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "as-inq-success-close-btn",
						onClick: handleClose,
						children: "Close"
					})
				]
			}) : /* @__PURE__ */ jsxs("div", {
				className: "as-inq-form-panel",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "as-inq-title",
						children: "Inquire this System"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "as-inq-intro",
						children: "You're almost there! Provide your details below. Our team will reach out to schedule your free site assessment."
					}),
					pkg && (() => {
						const systemName = (pkg.components?.find((pc) => pc.component.category === "Inverter"))?.component.model ?? pkg.name;
						const inverterKw = selection?.inverterKw ?? pkg.inverterKw;
						const savings = selection?.savings ?? computeMonthlySavings(pkg.solarKwp);
						return /* @__PURE__ */ jsxs("div", {
							className: "as-inq-pkg-summary",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "as-inq-pkg-summary-label",
									children: "System"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "as-inq-pkg-summary-name",
									children: systemName
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "as-inq-detail-row",
									children: ["Load Capacity: ", formatCapacity(inverterKw, "power", { unit: "kW" })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "as-inq-detail-row",
									children: [
										"Monthly Saving: ₱",
										savings.min.toLocaleString(),
										" – ₱",
										savings.max.toLocaleString()
									]
								})
							]
						});
					})(),
					/* @__PURE__ */ jsxs("div", {
						className: "as-inq-field",
						children: [
							/* @__PURE__ */ jsx("label", {
								className: "as-inq-label",
								children: "Name"
							}),
							/* @__PURE__ */ jsx("input", {
								className: `as-inq-input${errors.name ? " has-error" : ""}`,
								type: "text",
								value: form.name,
								onChange: (e) => setField("name", e.target.value),
								placeholder: "Juan dela Cruz",
								autoComplete: "name"
							}),
							errors.name && /* @__PURE__ */ jsx("span", {
								className: "as-inq-field-error",
								children: errors.name
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "as-inq-field",
						children: [
							/* @__PURE__ */ jsx("label", {
								className: "as-inq-label",
								children: "Location"
							}),
							/* @__PURE__ */ jsx(LocationAutocompleteInput, {
								value: form.location,
								onChange: (v) => setField("location", v),
								placeholder: "Ex. Tagbilaran City",
								inputClassName: `as-inq-input${errors.location ? " has-error" : ""}`
							}),
							errors.location && /* @__PURE__ */ jsx("span", {
								className: "as-inq-field-error",
								children: errors.location
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "as-inq-field",
						children: [
							/* @__PURE__ */ jsx("label", {
								className: "as-inq-label",
								children: "Email address"
							}),
							/* @__PURE__ */ jsx("input", {
								className: `as-inq-input${errors.email ? " has-error" : ""}`,
								type: "email",
								value: form.email,
								onChange: (e) => setField("email", e.target.value),
								placeholder: "juandelacruz@gmail.com",
								autoComplete: "email"
							}),
							errors.email && /* @__PURE__ */ jsx("span", {
								className: "as-inq-field-error",
								children: errors.email
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "as-inq-field",
						children: [
							/* @__PURE__ */ jsx("label", {
								className: "as-inq-label",
								children: "Phone number"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: `as-inq-phone-wrap${errors.phone ? " has-error" : ""}`,
								children: [/* @__PURE__ */ jsx("span", {
									className: "as-inq-phone-prefix",
									children: "+63"
								}), /* @__PURE__ */ jsx("input", {
									className: "as-inq-phone-input",
									type: "tel",
									value: form.phone,
									onChange: (e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10)),
									placeholder: "9123456789",
									inputMode: "numeric",
									autoComplete: "tel-local"
								})]
							}),
							errors.phone && /* @__PURE__ */ jsx("span", {
								className: "as-inq-field-error",
								children: errors.phone
							})
						]
					}),
					submitError && /* @__PURE__ */ jsx("div", {
						className: "as-inq-submit-error",
						children: submitError
					}),
					/* @__PURE__ */ jsx("p", {
						className: "as-inq-privacy",
						children: "We value your privacy. Your information is only used for your solar assessment & inquiries."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "as-inq-actions",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "as-inq-cancel-btn",
							onClick: handleClose,
							children: "Cancel"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "as-inq-submit-btn",
							onClick: () => void handleSubmit(),
							disabled: isSubmitting,
							children: isSubmitting ? "Submitting…" : "Submit Inquiry"
						})]
					})
				]
			})]
		})
	}), document.body);
}
//#endregion
//#region src/assets/logos/packages/check-bullet.svg
var check_bullet_default = "data:image/svg+xml,%3csvg%20width='16'%20height='12'%20viewBox='0%200%2016%2012'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M13.385%200.458368C13.9392%20-0.11003%2014.8877%20-0.156108%2015.5034%200.35545C16.1192%200.867008%2016.1691%201.74249%2015.6149%202.31088L6.61494%2011.5416C6.04003%2012.1313%205.04702%2012.1554%204.43934%2011.5945L0.439339%207.90215C-0.146447%207.36142%20-0.146447%206.48474%200.439339%205.94401C1.02513%205.40329%201.97487%205.40329%202.56066%205.94401L5.4427%208.60436L13.385%200.458368Z'%20fill='%23FC615A'/%3e%3c/svg%3e";
//#endregion
//#region src/pages/ASPackages.tsx
var ctaMobileStyles = `
  @media (max-width: 767px) {
    .as-packages-cta {
      position: relative !important;
      overflow: hidden !important;
    }
    .as-packages-cta-visual {
      position: absolute !important;
      top: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      left: 0 !important;
      display: flex !important;
      align-items: flex-end !important;
      justify-content: flex-end !important;
      z-index: 0 !important;
      pointer-events: none !important;
      width: 100% !important;
      height: 100% !important;
    }
    .as-packages-cta-visual img {
      width: 380px !important;
      height: auto !important;
      opacity: 0.2 !important;
      max-height: 100% !important;
    }
    .as-packages-cta-content {
      position: relative !important;
      z-index: 1 !important;
    }
  }
`;
var PAGE_SIZE = 3;
function getCoreComponents(pkg) {
	return {
		inverterLine: pkg.components?.find((pc) => pc.component.category === "Inverter") ?? null,
		batteryLine: pkg.components?.find((pc) => pc.component.category === "Battery") ?? null,
		panelLine: pkg.components?.find((pc) => pc.component.category === "Solar Panel") ?? null
	};
}
function defaultQty(pkg) {
	const { inverterLine, batteryLine, panelLine } = getCoreComponents(pkg);
	return {
		inverter: inverterLine?.quantity ?? 1,
		batteries: batteryLine?.quantity ?? 0,
		panels: panelLine?.quantity ?? 1
	};
}
function computeBounds(pkg, inverterCount) {
	const { inverterLine, batteryLine, panelLine } = getCoreComponents(pkg);
	const ic = inverterLine?.component;
	const bc = batteryLine?.component;
	const pc = panelLine?.component;
	const cfgI = inverterLine?.quantity ?? 1;
	const cfgB = batteryLine?.quantity ?? 0;
	const cfgP = panelLine?.quantity ?? 1;
	let pMin, pMax;
	if (ic?.pvMaxPower != null && pc != null && pc.productionCapacityKwp > 0) {
		const totalPvMin = (ic.pvMinPower ?? 0) * inverterCount;
		const totalPvMax = ic.pvMaxPower * inverterCount;
		pMin = totalPvMin > 0 ? Math.ceil(totalPvMin / pc.productionCapacityKwp) : 1;
		pMax = Math.floor(totalPvMax / pc.productionCapacityKwp);
	} else {
		const panelMaxPerInverter = ic && pc && pc.productionCapacityKwp > 0 ? Math.floor(ic.loadCapacityKw / pc.productionCapacityKwp) : cfgP;
		pMin = 1;
		pMax = Math.max(cfgP, panelMaxPerInverter * inverterCount);
	}
	let bMin, bMax;
	if (ic?.batteryMaxCapacity != null && bc != null && bc.storageCapacityKwh > 0) {
		const totalBattMax = ic.batteryMaxCapacity * inverterCount;
		bMin = 1;
		bMax = Math.max(1, Math.floor(totalBattMax / bc.storageCapacityKwh));
	} else {
		const batteryMaxPerInverter = ic && bc && bc.storageCapacityKwh > 0 ? Math.max(1, Math.floor(ic.loadCapacityKw / bc.storageCapacityKwh)) : cfgB;
		bMin = bc ? 1 : 0;
		bMax = Math.max(bc ? 1 : 0, bc ? batteryMaxPerInverter * inverterCount : 0);
	}
	return {
		iMin: cfgI,
		iMax: Math.max(cfgI, ic?.parallelMax ?? cfgI),
		bMin,
		bMax,
		pMin,
		pMax
	};
}
function clamp(v, min, max) {
	return Math.min(max, Math.max(min, v));
}
function coreQty(pc, qty) {
	const cat = pc.component.category;
	if (cat === "Inverter") return qty.inverter;
	if (cat === "Battery") return qty.batteries;
	if (cat === "Solar Panel") return qty.panels;
	return pc.quantity;
}
function effectiveQty(pc, allPcs, qty) {
	if (pc.baseComponentId) {
		const basePc = allPcs.find((p) => p.componentId === pc.baseComponentId && !p.baseComponentId);
		if (!basePc) return pc.quantity;
		return Math.max(1, Math.ceil(coreQty(basePc, qty) * (pc.multiplier ?? 1)));
	}
	return coreQty(pc, qty);
}
function buildFeatures(pkg, inverterKw, solarKwp, storageKwh) {
	const isHybrid = pkg.storageKwh > 0;
	if (pkg.mainFeatures?.length) return pkg.mainFeatures;
	const dailyKwh = Math.round(solarKwp * 4 * .8 * 10) / 10;
	const list = [
		`${isHybrid ? "Hybrid" : "Grid Tied"} System`,
		"Mobile Device Monitoring",
		`${formatCapacity(inverterKw, "power", { unit: "kW" })} ${isHybrid ? "Load Capacity" : "System Capacity"}`,
		`${dailyKwh} kWh/day Production Capacity`
	];
	if (isHybrid) list.push(`${formatCapacity(storageKwh, "energy", { unit: "kWh" })} Storage Capacity`);
	return list;
}
function pesoFmt(v) {
	return `₱${v.toLocaleString("en-PH", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	})}`;
}
function QuantityStepper({ label, sublabel, value, min, max, onBump }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "as-pkg-qty-row",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "as-pkg-qty-label",
			children: [/* @__PURE__ */ jsx("span", {
				className: "as-pkg-qty-name",
				children: label
			}), sublabel && /* @__PURE__ */ jsx("span", {
				className: "as-pkg-qty-sub",
				children: sublabel
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "as-pkg-qty-stepper",
			children: [
				/* @__PURE__ */ jsx("button", {
					className: "as-pkg-qty-btn",
					onClick: () => onBump(-1),
					disabled: value <= min,
					"aria-label": `Decrease ${label}`,
					children: "−"
				}),
				/* @__PURE__ */ jsx("span", {
					className: "as-pkg-qty-val",
					children: value
				}),
				/* @__PURE__ */ jsx("button", {
					className: "as-pkg-qty-btn",
					onClick: () => onBump(1),
					disabled: value >= max,
					"aria-label": `Increase ${label}`,
					children: "+"
				})
			]
		})]
	});
}
var TOOLTIP_MAX_W = 280;
var TOOLTIP_MARGIN = 8;
function IpRatingBadge({ code, description, offset }) {
	const [visible, setVisible] = useState(false);
	const badgeRef = useRef(null);
	const [tooltipPos, setTooltipPos] = useState({
		top: 0,
		left: 0,
		arrowLeft: TOOLTIP_MAX_W / 2
	});
	const handleMouseEnter = () => {
		if (badgeRef.current) {
			const rect = badgeRef.current.getBoundingClientRect();
			const badgeCenterX = rect.left + rect.width / 2;
			const vw = window.innerWidth;
			const idealLeft = badgeCenterX - TOOLTIP_MAX_W / 2;
			const clampedLeft = Math.max(TOOLTIP_MARGIN, Math.min(idealLeft, vw - TOOLTIP_MAX_W - TOOLTIP_MARGIN));
			const arrowLeft = Math.max(12, Math.min(badgeCenterX - clampedLeft, TOOLTIP_MAX_W - 12));
			setTooltipPos({
				top: rect.bottom,
				left: clampedLeft,
				arrowLeft
			});
		}
		setVisible(true);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: `as-pkg-ip-wrap${offset ? " is-offset" : ""}`,
		children: [/* @__PURE__ */ jsx("span", {
			ref: badgeRef,
			className: "as-pkg-ip-badge",
			onMouseEnter: handleMouseEnter,
			onMouseLeave: () => setVisible(false),
			children: code
		}), visible && createPortal(/* @__PURE__ */ jsxs("div", {
			className: "as-pkg-ip-tooltip",
			style: {
				top: tooltipPos.top,
				left: tooltipPos.left,
				["--ip-arrow-x"]: `${tooltipPos.arrowLeft}px`
			},
			role: "tooltip",
			children: [
				/* @__PURE__ */ jsx("strong", { children: code }),
				" — ",
				description
			]
		}), document.body)]
	});
}
function PackageCard({ pkg, onInquire, ipRating }) {
	const [qty, setQty] = useState(defaultQty(pkg));
	const [showModal, setShowModal] = useState(false);
	const [isClosingModal, setIsClosingModal] = useState(false);
	const [showOtherComponents, setShowOtherComponents] = useState(false);
	const [displayPrice, setDisplayPrice] = useState(null);
	const handleCloseModal = useCallback(() => {
		setIsClosingModal(true);
		window.setTimeout(() => {
			setIsClosingModal(false);
			setShowModal(false);
		}, 220);
	}, []);
	useEffect(() => {
		if (!showModal) return;
		const scrollY = window.scrollY;
		const original = {
			overflow: document.body.style.overflow,
			position: document.body.style.position,
			top: document.body.style.top,
			width: document.body.style.width
		};
		document.body.style.overflow = "hidden";
		document.body.style.position = "fixed";
		document.body.style.top = `-${scrollY}px`;
		document.body.style.width = "100%";
		const onKey = (e) => {
			if (e.key === "Escape") handleCloseModal();
		};
		window.addEventListener("keydown", onKey);
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = original.overflow;
			document.body.style.position = original.position;
			document.body.style.top = original.top;
			document.body.style.width = original.width;
			window.scrollTo(0, scrollY);
		};
	}, [showModal, handleCloseModal]);
	const { inverterLine, batteryLine, panelLine } = getCoreComponents(pkg);
	const isHybrid = pkg.storageKwh > 0;
	const displayName = inverterLine?.component.model ?? pkg.name;
	const liveInverterKw = Math.round((inverterLine?.component.loadCapacityKw ?? 0) * qty.inverter * 10) / 10;
	const liveSolarKwp = Math.round((panelLine?.component.productionCapacityKwp ?? 0) * qty.panels * 100) / 100;
	const liveStorageKwh = Math.round((batteryLine?.component.storageCapacityKwh ?? 0) * qty.batteries * 100) / 100;
	const savings = computeMonthlySavings(liveSolarKwp);
	const features = buildFeatures(pkg, liveInverterKw, liveSolarKwp, liveStorageKwh);
	const bounds = computeBounds(pkg, qty.inverter);
	const bumpInverter = (delta) => {
		setQty((prev) => {
			const newI = clamp(prev.inverter + delta, bounds.iMin, bounds.iMax);
			if (newI === prev.inverter) return prev;
			const nb = computeBounds(pkg, newI);
			const cfgI = inverterLine?.quantity ?? 1;
			const cfgB = batteryLine?.quantity ?? 0;
			const cfgP = panelLine?.quantity ?? 1;
			return {
				inverter: newI,
				batteries: batteryLine != null && cfgI > 0 ? clamp(Math.round(cfgB * newI / cfgI), nb.bMin, nb.bMax) : clamp(prev.batteries, nb.bMin, nb.bMax),
				panels: panelLine != null && cfgI > 0 ? clamp(Math.round(cfgP * newI / cfgI), nb.pMin, nb.pMax) : clamp(prev.panels, nb.pMin, nb.pMax)
			};
		});
	};
	const bumpBatteries = (delta) => setQty((prev) => ({
		...prev,
		batteries: clamp(prev.batteries + delta, bounds.bMin, bounds.bMax)
	}));
	const bumpPanels = (delta) => setQty((prev) => ({
		...prev,
		panels: clamp(prev.panels + delta, bounds.pMin, bounds.pMax)
	}));
	const calcPrice = () => {
		if (!pkg.components?.length) return {
			price: pkg.totalPrice,
			breakdown: []
		};
		const breakdown = [];
		let total = 0;
		let allPriced = true;
		pkg.components.forEach((pc) => {
			const comp = pc.component;
			if (!comp.pricingEnabled || comp.unitPrice === null) {
				allPriced = false;
				return;
			}
			const count = effectiveQty(pc, pkg.components ?? [], qty);
			const lineTotal = count * comp.unitPrice;
			total += lineTotal;
			breakdown.push({
				name: `${comp.name} (${comp.brand})`,
				qty: count,
				unitPrice: comp.unitPrice,
				total: lineTotal
			});
		});
		return {
			price: allPriced ? total : null,
			breakdown
		};
	};
	const { price: dynamicPrice } = calcPrice();
	useEffect(() => {
		if (dynamicPrice === null) {
			setDisplayPrice(null);
			return;
		}
		const start = displayPrice ?? pkg.totalPrice ?? dynamicPrice;
		const diff = dynamicPrice - start;
		const duration = 500;
		const t0 = Date.now();
		const tick = () => {
			const p = Math.min((Date.now() - t0) / duration, 1);
			const ease = 1 - Math.pow(1 - p, 3);
			setDisplayPrice(Math.round(start + diff * ease));
			if (p < 1) requestAnimationFrame(tick);
			else setDisplayPrice(dynamicPrice);
		};
		requestAnimationFrame(tick);
	}, [dynamicPrice]);
	const priceToDisplay = displayPrice ?? dynamicPrice ?? pkg.totalPrice;
	const buildSelection = () => ({
		qty,
		solarKwp: liveSolarKwp,
		inverterKw: liveInverterKw,
		storageKwh: liveStorageKwh,
		savings,
		price: dynamicPrice ?? pkg.totalPrice,
		components: pkg.components?.map((pc) => {
			const count = effectiveQty(pc, pkg.components ?? [], qty);
			return {
				brand: pc.component.brand,
				name: pc.component.name,
				category: pc.component.category,
				quantity: count,
				unitPrice: pc.component.pricingEnabled ? pc.component.unitPrice : null
			};
		}) ?? []
	});
	return /* @__PURE__ */ jsxs("div", {
		className: `as-pkg-card${pkg.isRecommended ? " is-recommended" : ""}`,
		children: [
			pkg.isRecommended && /* @__PURE__ */ jsx("div", {
				className: "as-pkg-recommended-badge",
				children: "Recommended"
			}),
			ipRating && /* @__PURE__ */ jsx(IpRatingBadge, {
				code: ipRating.code,
				description: ipRating.description,
				offset: !!pkg.isRecommended
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "as-pkg-top",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "as-pkg-name",
						children: displayName
					}),
					priceToDisplay != null && /* @__PURE__ */ jsx("div", {
						className: "as-pkg-price",
						children: pesoFmt(priceToDisplay)
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "as-pkg-size-label",
						children: [formatCapacity(liveInverterKw, "power", { unit: "kW" }), " System"]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "as-pkg-savings",
						children: [
							"Approx. Monthly Saving: ₱",
							savings.min.toLocaleString(),
							" – ₱",
							savings.max.toLocaleString()
						]
					}),
					/* @__PURE__ */ jsx("button", {
						className: `as-pkg-inquire${pkg.isRecommended ? " is-featured" : ""}`,
						onClick: () => onInquire(buildSelection()),
						children: "Inquire"
					})
				]
			}),
			/* @__PURE__ */ jsx("div", { className: "as-pkg-divider" }),
			/* @__PURE__ */ jsx("ul", {
				className: "as-pkg-features",
				children: features.map((f) => /* @__PURE__ */ jsxs("li", {
					className: "as-pkg-feature-row",
					children: [/* @__PURE__ */ jsx("img", {
						src: check_bullet_default,
						alt: "",
						"aria-hidden": "true",
						width: 14,
						style: {
							flexShrink: 0,
							marginTop: 2
						}
					}), /* @__PURE__ */ jsx("span", { children: f })]
				}, f))
			}),
			/* @__PURE__ */ jsx("p", {
				className: "as-pkg-customize-note",
				children: "*You can customize your system"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "as-pkg-qty-table",
				children: [
					/* @__PURE__ */ jsx(QuantityStepper, {
						label: "Inverter",
						sublabel: [[inverterLine?.component.brand, inverterLine?.component.model].filter(Boolean).join(" "), inverterLine?.component.loadCapacityKw ? formatCapacity(inverterLine.component.loadCapacityKw, "power", { unit: "kW" }) : void 0].filter(Boolean).join(" | ") || void 0,
						value: qty.inverter,
						min: bounds.iMin,
						max: bounds.iMax,
						onBump: bumpInverter
					}),
					isHybrid && /* @__PURE__ */ jsx(QuantityStepper, {
						label: "Battery",
						sublabel: [[batteryLine?.component.brand, batteryLine?.component.model].filter(Boolean).join(" "), batteryLine?.component.storageCapacityKwh ? formatCapacity(batteryLine.component.storageCapacityKwh, "energy", { unit: "kWh" }) : void 0].filter(Boolean).join(" | ") || void 0,
						value: qty.batteries,
						min: bounds.bMin,
						max: bounds.bMax,
						onBump: bumpBatteries
					}),
					/* @__PURE__ */ jsx(QuantityStepper, {
						label: "Solar Panel",
						sublabel: [[panelLine?.component.brand, panelLine?.component.model].filter(Boolean).join(" "), panelLine?.component.productionCapacityKwp ? `${Math.round(panelLine.component.productionCapacityKwp * 1e3)}W` : void 0].filter(Boolean).join(" | ") || void 0,
						value: qty.panels,
						min: bounds.pMin,
						max: bounds.pMax,
						onBump: bumpPanels
					})
				]
			}),
			/* @__PURE__ */ jsx("button", {
				className: "as-pkg-details-link",
				onClick: () => {
					setShowModal(true);
					setShowOtherComponents(false);
				},
				children: "See more details"
			}),
			showModal && createPortal(/* @__PURE__ */ jsx("div", {
				className: `as-pkg-modal-overlay${isClosingModal ? " is-closing" : ""}`,
				onClick: handleCloseModal,
				role: "dialog",
				"aria-modal": "true",
				"aria-label": `${displayName} details`,
				children: /* @__PURE__ */ jsxs("div", {
					className: `as-pkg-modal${isClosingModal ? " is-closing" : ""}`,
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ jsxs("div", {
						className: "as-pkg-modal-hero",
						children: [
							pkg.imageUrl && /* @__PURE__ */ jsx("div", {
								className: "as-pkg-modal-hero-bg",
								style: { backgroundImage: `url(${pkg.imageUrl})` }
							}),
							/* @__PURE__ */ jsx("div", { className: "as-pkg-modal-hero-gradient" }),
							/* @__PURE__ */ jsx("button", {
								className: "as-pkg-modal-close",
								onClick: handleCloseModal,
								"aria-label": "Close details",
								children: "✕"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "as-pkg-modal-hero-content",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "as-pkg-modal-hero-label",
										children: displayName
									}),
									priceToDisplay != null && /* @__PURE__ */ jsx("div", {
										className: "as-pkg-modal-hero-price",
										children: pesoFmt(priceToDisplay)
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "as-pkg-modal-hero-size",
										children: [formatCapacity(liveInverterKw, "power", { unit: "kW" }), " System"]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "as-pkg-modal-hero-savings",
										children: [
											"Approx. Monthly Saving: ₱",
											savings.min.toLocaleString(),
											" – ₱",
											savings.max.toLocaleString()
										]
									}),
									/* @__PURE__ */ jsx("button", {
										className: "as-pkg-modal-hero-inquire",
										onClick: () => {
											handleCloseModal();
											onInquire(buildSelection());
										},
										children: "Inquire"
									})
								]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "as-pkg-modal-body",
						children: [
							inverterLine && /* @__PURE__ */ jsxs("div", {
								className: "as-pkg-spec-section",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "as-pkg-spec-sec-header",
									children: [/* @__PURE__ */ jsx("span", {
										className: "as-pkg-spec-sec-title",
										children: "Inverter Specification"
									}), /* @__PURE__ */ jsx("a", {
										href: inverterLine.component.dataSheetUrl ?? void 0,
										target: "_blank",
										rel: "noopener noreferrer",
										className: `as-pkg-spec-datasheet${!inverterLine.component.dataSheetUrl ? " is-disabled" : ""}`,
										"aria-disabled": !inverterLine.component.dataSheetUrl,
										children: "Download Data Sheet"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "as-pkg-spec-rows",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "as-pkg-spec-row",
										children: ["Model Name", /* @__PURE__ */ jsxs("span", {
											className: "spec-value",
											children: [
												inverterLine.component.brand,
												" ",
												inverterLine.component.model
											]
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "as-pkg-spec-row",
										children: ["Inverter Capacity", /* @__PURE__ */ jsx("span", {
											className: "spec-value",
											children: formatCapacity(inverterLine.component.loadCapacityKw, "power", { unit: "kW" })
										})]
									})]
								})]
							}),
							isHybrid && batteryLine && /* @__PURE__ */ jsxs("div", {
								className: "as-pkg-spec-section",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "as-pkg-spec-sec-header",
									children: [/* @__PURE__ */ jsx("span", {
										className: "as-pkg-spec-sec-title",
										children: "Battery Specification"
									}), /* @__PURE__ */ jsx("a", {
										href: batteryLine.component.dataSheetUrl ?? void 0,
										target: "_blank",
										rel: "noopener noreferrer",
										className: `as-pkg-spec-datasheet${!batteryLine.component.dataSheetUrl ? " is-disabled" : ""}`,
										"aria-disabled": !batteryLine.component.dataSheetUrl,
										children: "Download Data Sheet"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "as-pkg-spec-rows",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "as-pkg-spec-row",
										children: ["Model Name", /* @__PURE__ */ jsxs("span", {
											className: "spec-value",
											children: [
												batteryLine.component.brand,
												" ",
												batteryLine.component.model
											]
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "as-pkg-spec-row",
										children: ["Battery Capacity", /* @__PURE__ */ jsx("span", {
											className: "spec-value",
											children: formatCapacity(batteryLine.component.storageCapacityKwh, "energy", { unit: "kWh" })
										})]
									})]
								})]
							}),
							panelLine && /* @__PURE__ */ jsxs("div", {
								className: "as-pkg-spec-section",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "as-pkg-spec-sec-header",
									children: [/* @__PURE__ */ jsx("span", {
										className: "as-pkg-spec-sec-title",
										children: "Solar Panel Specification"
									}), /* @__PURE__ */ jsx("a", {
										href: panelLine.component.dataSheetUrl ?? void 0,
										target: "_blank",
										rel: "noopener noreferrer",
										className: `as-pkg-spec-datasheet${!panelLine.component.dataSheetUrl ? " is-disabled" : ""}`,
										"aria-disabled": !panelLine.component.dataSheetUrl,
										children: "Download Data Sheet"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "as-pkg-spec-rows",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "as-pkg-spec-row",
										children: ["Model Name", /* @__PURE__ */ jsxs("span", {
											className: "spec-value",
											children: [
												panelLine.component.brand,
												" ",
												panelLine.component.model
											]
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "as-pkg-spec-row",
										children: ["Production Capacity", /* @__PURE__ */ jsxs("span", {
											className: "spec-value",
											children: [Math.round(panelLine.component.productionCapacityKwp * 1e3), "W"]
										})]
									})]
								})]
							}),
							(() => {
								const CORE = [
									"Inverter",
									"Battery",
									"Solar Panel"
								];
								const TYPE_ORDER = {
									"Mounting & Racking": 0,
									"Wiring & Protection": 1,
									"Monitoring": 2
								};
								const otherPcs = (pkg.components ?? []).filter((pc) => !CORE.includes(pc.component.category)).sort((a, b) => {
									return (TYPE_ORDER[a.component.category] ?? 3) - (TYPE_ORDER[b.component.category] ?? 3);
								});
								if (otherPcs.length === 0) return null;
								if (!showOtherComponents) return /* @__PURE__ */ jsx("div", {
									className: "as-pkg-modal-see-more",
									children: /* @__PURE__ */ jsx("button", {
										className: "as-pkg-modal-see-more-btn",
										onClick: () => setShowOtherComponents(true),
										children: "See more details"
									})
								});
								return /* @__PURE__ */ jsxs("div", {
									className: "as-pkg-spec-section",
									children: [/* @__PURE__ */ jsx("div", {
										className: "as-pkg-spec-sec-header",
										children: /* @__PURE__ */ jsx("span", {
											className: "as-pkg-spec-sec-title",
											children: "Components"
										})
									}), /* @__PURE__ */ jsx("div", {
										className: "as-pkg-spec-others-list",
										children: otherPcs.map((pc) => {
											const comp = pc.component;
											const capacityStr = comp.loadCapacityKw > 0 ? formatCapacity(comp.loadCapacityKw, "power", { unit: "kW" }) : comp.storageCapacityKwh > 0 ? formatCapacity(comp.storageCapacityKwh, "energy", { unit: "kWh" }) : comp.productionCapacityKwp > 0 ? `${Math.round(comp.productionCapacityKwp * 1e3)}W` : null;
											return /* @__PURE__ */ jsx("div", {
												className: "as-pkg-spec-other-item",
												children: /* @__PURE__ */ jsxs("span", {
													className: "other-name",
													children: [
														/* @__PURE__ */ jsxs("span", { children: [
															comp.brand,
															" ",
															comp.name
														] }),
														comp.model && /* @__PURE__ */ jsx("span", {
															className: "other-model",
															children: comp.model
														}),
														capacityStr && /* @__PURE__ */ jsx("span", {
															className: "other-cap",
															children: capacityStr
														})
													]
												})
											}, pc.componentId);
										})
									})]
								});
							})()
						]
					})]
				})
			}), document.body)
		]
	});
}
function groupByType(packages, phase) {
	const active = packages.filter((p) => p.phase === phase && p.isActive).sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0) || (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	const hybrid = active.filter((p) => p.storageKwh > 0);
	const gridTied = active.filter((p) => p.storageKwh === 0);
	const phaseLabel = phase === "three" ? "Three Phase" : "Single Phase";
	const groups = [];
	if (hybrid.length) groups.push({
		label: `${phaseLabel} · Hybrid`,
		packages: hybrid
	});
	if (gridTied.length) groups.push({
		label: `${phaseLabel} · Grid-Tied`,
		packages: gridTied
	});
	return groups;
}
function PkgCardSkeleton() {
	return /* @__PURE__ */ jsxs("div", {
		className: "as-pkg-card-skeleton",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "as-pkg-skeleton-top",
				children: [
					/* @__PURE__ */ jsx("div", { className: "as-pkg-skeleton-line as-pkg-skeleton-line--name" }),
					/* @__PURE__ */ jsx("div", { className: "as-pkg-skeleton-line as-pkg-skeleton-line--price" }),
					/* @__PURE__ */ jsx("div", { className: "as-pkg-skeleton-line as-pkg-skeleton-line--meta" }),
					/* @__PURE__ */ jsx("div", { className: "as-pkg-skeleton-line as-pkg-skeleton-line--meta" }),
					/* @__PURE__ */ jsx("div", { className: "as-pkg-skeleton-btn" })
				]
			}),
			/* @__PURE__ */ jsx("div", { className: "as-pkg-skeleton-divider" }),
			/* @__PURE__ */ jsxs("div", {
				className: "as-pkg-skeleton-features",
				children: [
					/* @__PURE__ */ jsx("div", { className: "as-pkg-skeleton-feature" }),
					/* @__PURE__ */ jsx("div", { className: "as-pkg-skeleton-feature" }),
					/* @__PURE__ */ jsx("div", { className: "as-pkg-skeleton-feature" }),
					/* @__PURE__ */ jsx("div", { className: "as-pkg-skeleton-feature as-pkg-skeleton-feature--short" })
				]
			}),
			/* @__PURE__ */ jsx("div", { className: "as-pkg-skeleton-line as-pkg-skeleton-line--note" }),
			/* @__PURE__ */ jsxs("div", {
				className: "as-pkg-skeleton-steppers",
				children: [
					/* @__PURE__ */ jsx("div", { className: "as-pkg-skeleton-stepper" }),
					/* @__PURE__ */ jsx("div", { className: "as-pkg-skeleton-stepper" }),
					/* @__PURE__ */ jsx("div", { className: "as-pkg-skeleton-stepper" })
				]
			})
		]
	});
}
function ASPackages() {
	useSeoMeta({
		title: "Affordable Solar Packages in Bohol, Philippines",
		description: "Browse affordable residential & commercial solar packages in Bohol. Hybrid, grid-tie & off-grid systems with full installation — single & three phase available.",
		canonical: "https://azari.solar/packages"
	});
	const navigate = useNavigate();
	const pageVis = useContent("section-visibility", { packages: true });
	useEffect(() => {
		if (pageVis.packages === false) navigate("/", { replace: true });
	}, [pageVis.packages, navigate]);
	useEffect(() => {
		const style = document.createElement("style");
		style.textContent = ctaMobileStyles;
		document.head.appendChild(style);
		return () => {
			document.head.removeChild(style);
		};
	}, []);
	const [phase, setPhase] = useState("single");
	const [packages, setPackages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [visibleCounts, setVisibleCounts] = useState({});
	const [loadingMoreGroups, setLoadingMoreGroups] = useState({});
	const [selectedPkg, setSelectedPkg] = useState(null);
	const [selectedSelection, setSelectedSelection] = useState(null);
	const [inquireOpen, setInquireOpen] = useState(false);
	const [ctaModalOpen, setCtaModalOpen] = useState(false);
	useEffect(() => {
		fetchPublicPackages().then(setPackages).finally(() => setLoading(false));
	}, []);
	const groups = groupByType(packages, phase);
	const showMore = (label, total) => {
		setLoadingMoreGroups((prev) => ({
			...prev,
			[label]: true
		}));
		window.setTimeout(() => {
			setVisibleCounts((prev) => ({
				...prev,
				[label]: Math.min((prev[label] ?? PAGE_SIZE) + PAGE_SIZE, total)
			}));
			setLoadingMoreGroups((prev) => ({
				...prev,
				[label]: false
			}));
		}, 350);
	};
	const showLess = (label) => {
		setVisibleCounts((prev) => ({
			...prev,
			[label]: PAGE_SIZE
		}));
	};
	const handlePhase = (p) => {
		setPhase(p);
		setVisibleCounts({});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "route-page",
		children: [
			/* @__PURE__ */ jsx("svg", {
				style: { display: "none" },
				width: "0",
				height: "0",
				children: /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("filter", {
					id: "pkg-ceo-sharpen",
					children: /* @__PURE__ */ jsx("feConvolveMatrix", {
						type: "matrix",
						kernelMatrix: "0 -0.5 0 -0.5 3 -0.5 0 -0.5 0",
						divisor: "1"
					})
				}) })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "ASPackages page-container",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "as-packages-header",
						children: [/* @__PURE__ */ jsx("h1", {
							className: "as-packages-title",
							children: "Our Residential Packages"
						}), /* @__PURE__ */ jsx("p", {
							className: "as-packages-subtitle",
							children: "We offer a variety of packages for your home needs"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: `as-packages-phase-toggle${phase === "three" ? " is-second" : ""}`,
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "as-pkg-phase-slider",
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ jsx("button", {
								className: `as-pkg-phase-btn${phase === "single" ? " is-active" : ""}`,
								onClick: () => handlePhase("single"),
								children: "Single Phase"
							}),
							/* @__PURE__ */ jsx("button", {
								className: `as-pkg-phase-btn${phase === "three" ? " is-active" : ""}`,
								onClick: () => handlePhase("three"),
								children: "Three Phase"
							})
						]
					}),
					loading ? /* @__PURE__ */ jsx("div", {
						className: "as-packages-skeleton",
						"aria-busy": "true",
						children: [0, 1].map((g) => /* @__PURE__ */ jsxs("div", {
							className: "as-pkg-skeleton-group",
							children: [/* @__PURE__ */ jsx("div", {
								className: "as-pkg-skeleton-group-label",
								"aria-hidden": "true"
							}), /* @__PURE__ */ jsx("div", {
								className: "as-packages-grid",
								children: [
									0,
									1,
									2
								].map((i) => /* @__PURE__ */ jsx(PkgCardSkeleton, {}, i))
							})]
						}, g))
					}) : groups.length === 0 ? /* @__PURE__ */ jsx("div", {
						className: "as-packages-empty",
						children: "No packages available for this phase."
					}) : groups.map((group) => {
						const total = group.packages.length;
						const visibleCount = visibleCounts[group.label] ?? PAGE_SIZE;
						const visible = group.packages.slice(0, visibleCount);
						const allShown = visibleCount >= total;
						const isLoadingMore = loadingMoreGroups[group.label] ?? false;
						const skeletonCount = Math.min(PAGE_SIZE, total - visibleCount);
						return /* @__PURE__ */ jsxs("div", {
							className: "as-packages-group",
							children: [
								/* @__PURE__ */ jsx("h2", {
									className: "as-packages-group-label",
									children: group.label
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "as-packages-grid",
									children: [visible.map((pkg) => /* @__PURE__ */ jsx(PackageCard, {
										pkg,
										onInquire: (sel) => {
											setSelectedPkg(pkg);
											setSelectedSelection(sel);
											setInquireOpen(true);
										},
										ipRating: pkg.ipRating ?? null
									}, pkg.id)), isLoadingMore && Array.from({ length: skeletonCount }).map((_, i) => /* @__PURE__ */ jsx(PkgCardSkeleton, {}, `more-skeleton-${i}`))]
								}),
								total > PAGE_SIZE && /* @__PURE__ */ jsx("button", {
									className: "as-packages-show-more",
									disabled: isLoadingMore,
									onClick: () => allShown ? showLess(group.label) : showMore(group.label, total),
									children: allShown ? "Show less" : "Show more"
								})
							]
						}, group.label);
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "as-packages-cta",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "as-packages-cta-content",
							children: [
								/* @__PURE__ */ jsxs("h2", {
									className: "as-packages-cta-title",
									children: [/* @__PURE__ */ jsx("span", {
										className: "as-packages-cta-accent",
										children: "Future-proof"
									}), " your business infrastructure."]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "as-packages-cta-tagline",
									children: "Turn your operational overhead into a strategic advantage."
								}),
								/* @__PURE__ */ jsx("p", {
									className: "as-packages-cta-sub",
									children: "Commercial and industrial energy demands require sophisticated, scalable engineering. Get in touch with our specialist team for a comprehensive energy audit, financial feasibility breakdown, and custom system design."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "as-packages-cta-actions",
									children: [/* @__PURE__ */ jsx("button", {
										className: "as-packages-cta-btn is-primary",
										onClick: () => setCtaModalOpen(true),
										children: "Contact Our C&I Team →"
									}), /* @__PURE__ */ jsx("button", {
										className: "as-packages-cta-btn is-secondary",
										onClick: () => setCtaModalOpen(true),
										children: "Schedule a Consultation"
									})]
								})
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "as-packages-cta-visual",
							"aria-hidden": "true"
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(ASPackageInquiry, {
				isOpen: inquireOpen,
				pkg: selectedPkg,
				selection: selectedSelection,
				onClose: () => {
					setInquireOpen(false);
					setSelectedPkg(null);
					setSelectedSelection(null);
				}
			}),
			/* @__PURE__ */ jsx(ASTalkToAnExpert, {
				isOpen: ctaModalOpen,
				onClose: () => setCtaModalOpen(false)
			})
		]
	});
}
//#endregion
//#region app/routes/packages.tsx
var packages_exports = /* @__PURE__ */ __exportAll({
	default: () => packages_default,
	meta: () => meta$4
});
var meta$4 = () => [
	{ title: "Solar Packages — Azari Solar" },
	{
		name: "description",
		content: "Browse Azari Solar's hybrid and grid-tie solar packages for homes and businesses in Bohol, Philippines. Professional supply-and-install at competitive prices."
	},
	{
		name: "robots",
		content: "index, follow"
	},
	{
		tagName: "link",
		rel: "canonical",
		href: "https://azari.solar/packages"
	},
	{
		property: "og:type",
		content: "website"
	},
	{
		property: "og:url",
		content: "https://azari.solar/packages"
	},
	{
		property: "og:title",
		content: "Solar Packages — Azari Solar"
	},
	{
		property: "og:description",
		content: "Browse Azari Solar's hybrid and grid-tie solar packages for homes and businesses in Bohol, Philippines."
	},
	{
		property: "og:image",
		content: "https://azari.solar/preview.jpg"
	},
	{
		name: "twitter:card",
		content: "summary_large_image"
	},
	{
		name: "twitter:title",
		content: "Solar Packages — Azari Solar"
	},
	{
		name: "twitter:description",
		content: "Browse Azari Solar's hybrid and grid-tie solar packages for homes and businesses in Bohol, Philippines."
	},
	{
		name: "twitter:image",
		content: "https://azari.solar/preview.jpg"
	}
];
var packages_default = UNSAFE_withComponentProps(function Packages() {
	return /* @__PURE__ */ jsx(ASPackages, {});
});
//#endregion
//#region src/assets/icons/icon-dropdown.svg
var icon_dropdown_default = "data:image/svg+xml,%3csvg%20width='14'%20height='9'%20viewBox='0%200%2014%209'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M6.92969%209L13.8579%200H0.00148439L6.92969%209Z'%20fill='%239CA3AF'/%3e%3c/svg%3e";
//#endregion
//#region src/modules/quotaion-modal/ASAddAppliance.tsx
var RATING_UNITS = [
	{
		value: "W",
		label: "Watts"
	},
	{
		value: "HP",
		label: "HP"
	},
	{
		value: "Ton",
		label: "Ton"
	}
];
var TO_WATTS = {
	W: 1,
	HP: 746,
	Ton: 3517
};
function timeToMinutes(time) {
	const [h, m] = time.split(":").map(Number);
	return h * 60 + m;
}
function schedulesOverlap(a, b) {
	if (!a.from || !a.to || !b.from || !b.to) return false;
	const aFrom = timeToMinutes(a.from);
	const aTo = timeToMinutes(a.to);
	const bFrom = timeToMinutes(b.from);
	const bTo = timeToMinutes(b.to);
	const aIntervals = aFrom < aTo ? [[aFrom, aTo]] : [[aFrom, 1440], [0, aTo]];
	const bIntervals = bFrom < bTo ? [[bFrom, bTo]] : [[bFrom, 1440], [0, bTo]];
	for (const [s1, e1] of aIntervals) for (const [s2, e2] of bIntervals) if (s1 < e2 && e1 > s2) return true;
	return false;
}
function normalizeDecimalInput$1(value) {
	let cleaned = value.replace(/[^\d.]/g, "");
	cleaned = cleaned.replace(/(\..*?)\..*/g, "$1");
	cleaned = cleaned.replace(/^0+(?=\d)/, "");
	return cleaned;
}
function formatTimeDisplay(value) {
	if (!value) return "--:-- --";
	const [hourRaw, minute] = value.split(":").map(Number);
	const period = hourRaw >= 12 ? "PM" : "AM";
	const hour = hourRaw % 12 || 12;
	return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
}
function AddApplianceModal({ onClose, onSubmit, initial }) {
	const isEditing = !!initial;
	const [name, setName] = useState(() => initial?.name ?? "");
	const [watts, setWatts] = useState(() => initial ? String(initial.watts) : "");
	const [ratingUnit, setRatingUnit] = useState("W");
	const [quantity, setQuantity] = useState(() => initial ? String(initial.quantity) : "");
	const [error, setError] = useState("");
	const [scheduleType, setScheduleType] = useState(() => initial?.usageType === "Estimated" ? "estimate" : "scheduled");
	const [schedules, setSchedules] = useState(() => initial?.scheduleItems?.length ? initial.scheduleItems : [{
		from: "08:30",
		to: "18:00"
	}]);
	const [dayEstimateHours, setDayEstimateHours] = useState(() => initial?.usageType === "Estimated" ? String(initial.dayHours) : "1");
	const [nightEstimateHours, setNightEstimateHours] = useState(() => initial?.usageType === "Estimated" ? String(initial.nightHours) : "1");
	const { totalHours, totalDayHours, totalNightHours } = useMemo(() => {
		if (scheduleType === "estimate") {
			const dayH = Math.max(0, Number(dayEstimateHours) || 0);
			const nightH = Math.max(0, Number(nightEstimateHours) || 0);
			return {
				totalHours: dayH + nightH,
				totalDayHours: dayH,
				totalNightHours: nightH
			};
		}
		let hours = 0;
		let dayH = 0;
		let nightH = 0;
		for (const item of schedules) {
			const { dayHours, nightHours } = calculateDayNightHours(item.from, item.to);
			dayH += dayHours;
			nightH += nightHours;
			hours += dayHours + nightHours;
		}
		return {
			totalHours: hours,
			totalDayHours: dayH,
			totalNightHours: nightH
		};
	}, [
		schedules,
		scheduleType,
		dayEstimateHours,
		nightEstimateHours
	]);
	const handleScheduleChange = (index, field, value) => {
		setSchedules((current) => current.map((item, i) => i === index ? {
			...item,
			[field]: value
		} : item));
		setError("");
	};
	const handleAddSchedule = () => {
		setSchedules((current) => [...current, {
			from: "",
			to: ""
		}]);
	};
	const handleRemoveSchedule = (index) => {
		setSchedules((current) => current.filter((_, i) => i !== index));
		setError("");
	};
	const handleSubmit = () => {
		const cleanName = name.trim();
		const wattsValue = Number(watts) * TO_WATTS[ratingUnit];
		const quantityValue = Number(quantity);
		if (!cleanName) {
			setError("Please enter an appliance name.");
			return;
		}
		if (cleanName.length > 80) {
			setError("Appliance name must not exceed 80 characters.");
			return;
		}
		if (Number.isNaN(wattsValue) || wattsValue <= 0) {
			setError("Please enter a valid watt rating.");
			return;
		}
		if (Number.isNaN(quantityValue) || quantityValue <= 0) {
			setError("Please enter a valid quantity.");
			return;
		}
		if (scheduleType === "estimate") {
			if (totalHours <= 0 || totalHours > 24) {
				setError("Total estimated usage must be between 1 and 24 hours.");
				return;
			}
			onSubmit({
				name: cleanName,
				watts: wattsValue,
				quantity: quantityValue,
				hours: Number(totalHours.toFixed(2)),
				dayHours: Number(totalDayHours.toFixed(2)),
				nightHours: Number(totalNightHours.toFixed(2)),
				schedule: "Estimated",
				scheduleItems: [],
				usageType: "Estimated"
			});
			return;
		}
		const validSchedules = schedules.filter((item) => item.from && item.to);
		if (!validSchedules.length) {
			setError("Please add at least one complete schedule usage.");
			return;
		}
		if (totalHours <= 0 || totalHours > 24) {
			setError("Total schedule usage must be between 1 and 24 hours.");
			return;
		}
		for (let i = 0; i < validSchedules.length; i++) for (let j = i + 1; j < validSchedules.length; j++) if (schedulesOverlap(validSchedules[i], validSchedules[j])) {
			setError(`Schedule entries overlap: ${formatTimeDisplay(validSchedules[i].from)}–${formatTimeDisplay(validSchedules[i].to)} conflicts with ${formatTimeDisplay(validSchedules[j].from)}–${formatTimeDisplay(validSchedules[j].to)}.`);
			return;
		}
		const scheduleText = validSchedules.map((item) => `${formatTimeDisplay(item.from)} - ${formatTimeDisplay(item.to)}`).join(", ");
		onSubmit({
			name: cleanName,
			watts: wattsValue,
			quantity: quantityValue,
			hours: Number(totalHours.toFixed(2)),
			dayHours: Number(totalDayHours.toFixed(2)),
			nightHours: Number(totalNightHours.toFixed(2)),
			schedule: scheduleText,
			scheduleItems: validSchedules,
			usageType: "Scheduled"
		});
	};
	return /* @__PURE__ */ jsx("div", {
		className: "as-modal-backdrop",
		children: /* @__PURE__ */ jsxs("div", {
			className: "as-modal as-appliance-modal",
			children: [
				/* @__PURE__ */ jsx("button", {
					className: "as-modal-close",
					onClick: onClose,
					type: "button",
					children: "×"
				}),
				/* @__PURE__ */ jsx("h2", { children: isEditing ? "Edit Appliance" : "Add Appliance" }),
				/* @__PURE__ */ jsx("p", { children: "Tell us about your appliances and how long you use them. This helps our engineers design a system sized perfectly to wipe out your monthly electricity bill." }),
				/* @__PURE__ */ jsxs("div", {
					className: "as-appliance-form",
					children: [
						/* @__PURE__ */ jsxs("label", {
							className: "as-appliance-field as-appliance-field-full",
							children: [/* @__PURE__ */ jsx("span", { children: "Appliance / Load Name" }), /* @__PURE__ */ jsx("input", {
								placeholder: "Ex. 1.5HP Inverter Aircon",
								value: name,
								onChange: (e) => {
									setName(e.target.value);
									setError("");
								}
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "as-appliance-grid",
							children: [/* @__PURE__ */ jsxs("label", {
								className: "as-appliance-field",
								children: [
									/* @__PURE__ */ jsx("span", { children: "Rating (Watts)" }),
									/* @__PURE__ */ jsxs("div", {
										className: "as-appliance-input-with-unit",
										children: [/* @__PURE__ */ jsx("input", {
											type: "text",
											inputMode: "decimal",
											placeholder: "0.00",
											value: watts,
											onChange: (e) => {
												setWatts(normalizeDecimalInput$1(e.target.value));
												setError("");
											}
										}), /* @__PURE__ */ jsxs("div", {
											className: "as-appliance-unit-select",
											children: [/* @__PURE__ */ jsx("select", {
												value: ratingUnit,
												onChange: (e) => {
													setRatingUnit(e.target.value);
													setError("");
												},
												children: RATING_UNITS.map((u) => /* @__PURE__ */ jsx("option", {
													value: u.value,
													children: u.label
												}, u.value))
											}), /* @__PURE__ */ jsx("img", {
												src: icon_dropdown_default,
												alt: "",
												"aria-hidden": "true",
												className: "as-appliance-unit-select-icon"
											})]
										})]
									}),
									/* @__PURE__ */ jsxs("em", { children: [
										ratingUnit === "W" && "Check the sticker on your unit.",
										ratingUnit === "HP" && "1 HP = 746 W. Common for motors and compressors.",
										ratingUnit === "Ton" && "1 Ton = 3,517 W. Common for AC cooling capacity."
									] })
								]
							}), /* @__PURE__ */ jsxs("label", {
								className: "as-appliance-field",
								children: [/* @__PURE__ */ jsx("span", { children: "Quantity" }), /* @__PURE__ */ jsx("input", {
									type: "text",
									inputMode: "decimal",
									placeholder: "0",
									value: quantity,
									onChange: (e) => {
										setQuantity(normalizeDecimalInput$1(e.target.value));
										setError("");
									}
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "as-appliance-schedule",
							children: [
								/* @__PURE__ */ jsx("p", { children: "SCHEDULE TYPES" }),
								/* @__PURE__ */ jsxs("div", {
									className: "as-schedule-type-selector",
									children: [/* @__PURE__ */ jsxs("label", {
										className: "as-schedule-type-option",
										children: [/* @__PURE__ */ jsx("input", {
											type: "radio",
											name: "scheduleType",
											checked: scheduleType === "scheduled",
											onChange: () => {
												setScheduleType("scheduled");
												setError("");
											}
										}), /* @__PURE__ */ jsx("span", { children: "Schedule Usage" })]
									}), /* @__PURE__ */ jsxs("label", {
										className: "as-schedule-type-option",
										children: [/* @__PURE__ */ jsx("input", {
											type: "radio",
											name: "scheduleType",
											checked: scheduleType === "estimate",
											onChange: () => {
												setScheduleType("estimate");
												setError("");
											}
										}), /* @__PURE__ */ jsx("span", { children: "Estimate Usage per day" })]
									})]
								}),
								scheduleType === "scheduled" ? /* @__PURE__ */ jsxs(Fragment, { children: [
									schedules.map((item, index) => /* @__PURE__ */ jsxs("div", {
										className: "as-schedule-row",
										children: [
											/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", { children: "From" }), /* @__PURE__ */ jsxs("div", {
												className: "as-appliance-time-select",
												children: [/* @__PURE__ */ jsx("input", {
													type: "time",
													value: item.from,
													onChange: (e) => handleScheduleChange(index, "from", e.target.value)
												}), /* @__PURE__ */ jsx("img", {
													src: icon_dropdown_default,
													alt: "",
													"aria-hidden": "true",
													className: "as-appliance-time-select-icon"
												})]
											})] }),
											/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", { children: "To" }), /* @__PURE__ */ jsxs("div", {
												className: "as-appliance-time-select",
												children: [/* @__PURE__ */ jsx("input", {
													type: "time",
													value: item.to,
													onChange: (e) => handleScheduleChange(index, "to", e.target.value)
												}), /* @__PURE__ */ jsx("img", {
													src: icon_dropdown_default,
													alt: "",
													"aria-hidden": "true",
													className: "as-appliance-time-select-icon"
												})]
											})] }),
											index > 0 && /* @__PURE__ */ jsx("button", {
												type: "button",
												className: "as-schedule-remove",
												onClick: () => handleRemoveSchedule(index),
												children: "×"
											})
										]
									}, index)),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										className: "as-add-schedule-btn",
										onClick: handleAddSchedule,
										children: "+ Add Schedule Usage"
									}),
									totalHours > 0 && /* @__PURE__ */ jsxs("div", {
										className: "as-schedule-summary",
										children: [
											/* @__PURE__ */ jsxs("span", { children: ["Day (08:00–18:00): ", /* @__PURE__ */ jsxs("strong", { children: [totalDayHours.toFixed(1), "h"] })] }),
											/* @__PURE__ */ jsxs("span", { children: ["Night (18:00–08:00): ", /* @__PURE__ */ jsxs("strong", { children: [totalNightHours.toFixed(1), "h"] })] }),
											/* @__PURE__ */ jsxs("span", { children: ["Total: ", /* @__PURE__ */ jsxs("strong", { children: [totalHours.toFixed(1), "h"] })] })
										]
									})
								] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
									className: "as-appliance-grid",
									children: [/* @__PURE__ */ jsxs("label", {
										className: "as-appliance-field",
										children: [/* @__PURE__ */ jsx("span", { children: "Day Time Usage" }), /* @__PURE__ */ jsxs("div", {
											className: "as-appliance-input-with-unit",
											children: [/* @__PURE__ */ jsx("input", {
												type: "text",
												inputMode: "decimal",
												placeholder: "0",
												value: dayEstimateHours,
												onChange: (e) => {
													setDayEstimateHours(normalizeDecimalInput$1(e.target.value));
													setError("");
												}
											}), /* @__PURE__ */ jsx("small", { children: "hour" })]
										})]
									}), /* @__PURE__ */ jsxs("label", {
										className: "as-appliance-field",
										children: [/* @__PURE__ */ jsx("span", { children: "Night Time Usage" }), /* @__PURE__ */ jsxs("div", {
											className: "as-appliance-input-with-unit",
											children: [/* @__PURE__ */ jsx("input", {
												type: "text",
												inputMode: "decimal",
												placeholder: "0",
												value: nightEstimateHours,
												onChange: (e) => {
													setNightEstimateHours(normalizeDecimalInput$1(e.target.value));
													setError("");
												}
											}), /* @__PURE__ */ jsx("small", { children: "hour" })]
										})]
									})]
								}), totalHours > 0 && /* @__PURE__ */ jsx("div", {
									className: "as-schedule-summary",
									children: /* @__PURE__ */ jsxs("span", { children: ["Total Hours: ", /* @__PURE__ */ jsxs("strong", { children: [totalHours.toFixed(1), "h"] })] })
								})] })
							]
						}),
						error && /* @__PURE__ */ jsx("small", {
							className: "as-field-error",
							children: error
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "as-modal-actions",
					children: [/* @__PURE__ */ jsx("button", {
						className: "as-btn-secondary",
						onClick: onClose,
						type: "button",
						children: "Cancel"
					}), /* @__PURE__ */ jsx("button", {
						className: "as-btn-primary",
						onClick: handleSubmit,
						type: "button",
						children: isEditing ? "Save Changes" : "Add Appliance"
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/models/quotation.ts
var blockedEmailDomains = [
	"mailinator.com",
	"tempmail.com",
	"10minutemail.com",
	"guerrillamail.com",
	"yopmail.com",
	"fakeinbox.com"
];
var nameRegex = /^[A-Za-z0-9 .-]+$/;
var emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
var locationRegex = /^[A-Za-z0-9Ññ .,'#/()-]+$/;
var phoneRegex = /^((\+63|0)9\d{9}|(\+63|0)?[2-8]\d{6,9})$/;
function formatFileSize$1(bytes) {
	return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
}
function sanitizeProposalRequestForm(formData) {
	return {
		fullName: formData.fullName.trim(),
		location: formData.location.trim(),
		email: formData.email.trim().toLowerCase(),
		phone: formData.phone.trim().replace(/[\s-]/g, ""),
		message: formData.message.trim()
	};
}
function validateProposalRequestField(field, value) {
	const trimmedValue = value.trim();
	if (field === "fullName") {
		if (!trimmedValue) return "Name is required.";
		if (trimmedValue.length < 2) return "Name must be at least 2 characters.";
		if (trimmedValue.length > 80) return "Name must not exceed 80 characters.";
		if (!nameRegex.test(trimmedValue)) return "Name can only contain letters, numbers, spaces, hyphen, and period.";
	}
	if (field === "location") {
		if (!trimmedValue) return "Location is required.";
		if (trimmedValue.length < 3) return "Location must be at least 3 characters.";
		if (trimmedValue.length > 160) return "Location must not exceed 160 characters.";
		if (!locationRegex.test(trimmedValue)) return "Location contains invalid characters.";
	}
	if (field === "email") {
		const email = trimmedValue.toLowerCase();
		const emailDomain = email.split("@")[1];
		if (!email) return "Email address is required.";
		if (email.length > 120) return "Email must not exceed 120 characters.";
		if (!emailRegex.test(email)) return "Please enter a valid email address.";
		if (emailDomain && blockedEmailDomains.includes(emailDomain)) return "Disposable or temporary email domains are not allowed.";
	}
	if (field === "phone") {
		const phone = trimmedValue.replace(/[\s-]/g, "");
		if (!phone) return "Phone number is required.";
		if (!phoneRegex.test(phone)) return "Enter a valid telephone or cellphone number. Example: +639123456789, 09123456789, or 0381234567.";
	}
	if (field === "message") {
		if (trimmedValue.length > 500) return "Additional notes must not exceed 500 characters.";
	}
	return "";
}
function validateProposalRequestForm(data) {
	const errors = {};
	Object.entries(data).forEach(([field, value]) => {
		const error = validateProposalRequestField(field, value);
		if (error) errors[field] = error;
	});
	return errors;
}
function configurationLabel(result) {
	const { value, unit } = formatSystemSize(result.solarKwp, 2);
	return `~${value} ${unit} ${result.systemType === "hybrid" ? "Hybrid" : "Grid-Tied"}`;
}
function buildQuotationRequestPayload(params) {
	const proposalForm = params.proposalForm ? sanitizeProposalRequestForm(params.proposalForm) : {
		fullName: "",
		location: "",
		email: "",
		phone: "",
		message: ""
	};
	const { engineResult } = params;
	const totalDailyUsageWh = params.appliances.reduce((s, a) => s + a.usage, 0);
	const totalDayUsageWh = params.appliances.reduce((s, a) => s + a.dayUsage, 0);
	const totalNightUsageWh = params.appliances.reduce((s, a) => s + a.nightUsage, 0);
	const sized = formatSystemSize(engineResult.solarKwp, 2);
	const estimatedMonthlySavingsPhp = params.systemPurpose === "monthly-savings" ? params.monthlySavingsTarget : params.systemPurpose === "zero-bill" ? params.monthlyBill : 0;
	return {
		type: "quotation_request",
		submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
		systemPurpose: params.systemPurpose,
		systemType: params.systemType,
		customer: proposalForm,
		property: { classification: params.selectedProperty },
		consumption: {
			averageMonthlyBillPhp: params.monthlyBill,
			monthlySavingsTargetPhp: params.monthlySavingsTarget,
			electricRatePhpPerKwh: params.electricRate,
			estimatedMonthlyKwh: Math.round(totalDailyUsageWh * SOLAR_CONSTANTS.daysPerMonth / 1e3),
			peakPowerKw: params.peakPower,
			allowedGridPowerKw: params.allowedGridPower,
			peakDurationHours: params.peakDuration
		},
		solarEstimate: {
			estimatedSystemSize: {
				rawKwp: engineResult.solarKwp,
				displayValue: sized.value,
				displayUnit: sized.unit,
				displayText: `${sized.value} ${sized.unit}`
			},
			inverterSizeKw: engineResult.inverterKw,
			storageCapacityKwh: engineResult.storageKwh,
			configuration: configurationLabel(engineResult),
			estimatedMonthlySavingsPhp,
			estimatedProjectedSavingsPhp: estimatedMonthlySavingsPhp * SOLAR_CONSTANTS.projectionMonths,
			projectionMonths: SOLAR_CONSTANTS.projectionMonths,
			totalDailyUsageWh,
			totalDayUsageWh,
			totalNightUsageWh
		},
		loadProfile: params.appliances.map((item) => ({
			name: item.name,
			watts: item.watts,
			quantity: item.quantity,
			hoursPerDay: item.hours,
			dayHoursPerDay: item.dayHours,
			nightHoursPerDay: item.nightHours,
			schedule: item.schedule,
			usageType: item.usageType,
			estimatedUsageWhPerDay: item.usage
		})),
		billAttachment: params.uploadedBill ? {
			fileName: params.uploadedBill.name,
			mimeType: params.uploadedBill.type,
			sizeBytes: params.uploadedBill.size,
			sizeDisplay: formatFileSize$1(params.uploadedBill.size)
		} : null
	};
}
function buildQuotationRequestFormData(params) {
	const payload = buildQuotationRequestPayload(params);
	const formData = new FormData();
	formData.append("payload", JSON.stringify(payload));
	if (params.uploadedBill?.file) formData.append("billAttachment", params.uploadedBill.file);
	return formData;
}
//#endregion
//#region src/modules/quotaion-modal/ASProposalRequest.tsx
function RequestProposalModal({ onClose, onSubmit, isSubmitting = false }) {
	const [formData, setFormData] = useState({
		fullName: "",
		location: "",
		email: "",
		phone: "",
		message: ""
	});
	const [errors, setErrors] = useState({});
	const handleChange = (field, value) => {
		if (field === "message" && value.length > 500) return;
		setFormData({
			...formData,
			[field]: value
		});
		setErrors((current) => ({
			...current,
			[field]: validateProposalRequestField(field, value)
		}));
	};
	const handleSubmit = async () => {
		const validationErrors = validateProposalRequestForm(formData);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		await onSubmit(sanitizeProposalRequestForm(formData));
	};
	return /* @__PURE__ */ jsx("div", {
		className: "as-modal-backdrop",
		children: /* @__PURE__ */ jsxs("div", {
			className: "as-modal",
			children: [
				/* @__PURE__ */ jsx("button", {
					className: "as-modal-close",
					onClick: onClose,
					type: "button",
					disabled: isSubmitting,
					children: "×"
				}),
				/* @__PURE__ */ jsx("h2", { children: "Request Proposal" }),
				/* @__PURE__ */ jsx("p", { children: "You're almost there! Provide your details below so our team can finalize your custom solar proposal and reach out to schedule your free site assessment." }),
				/* @__PURE__ */ jsxs("div", {
					className: "as-modal-form",
					children: [
						/* @__PURE__ */ jsxs("label", { children: [
							"Name",
							/* @__PURE__ */ jsx("input", {
								className: errors.fullName ? "as-input-error" : "",
								placeholder: "Juan Dela Cruz",
								value: formData.fullName,
								onChange: (e) => handleChange("fullName", e.target.value)
							}),
							errors.fullName && /* @__PURE__ */ jsx("small", {
								className: "as-field-error",
								children: errors.fullName
							})
						] }),
						/* @__PURE__ */ jsxs("label", { children: [
							"Location",
							/* @__PURE__ */ jsx(LocationAutocompleteInput, {
								value: formData.location,
								onChange: (val) => handleChange("location", val),
								placeholder: "Search map location or manually input address",
								inputClassName: errors.location ? "as-input-error" : ""
							}),
							errors.location && /* @__PURE__ */ jsx("small", {
								className: "as-field-error",
								children: errors.location
							})
						] }),
						/* @__PURE__ */ jsxs("label", { children: [
							"Email Address",
							/* @__PURE__ */ jsx("input", {
								className: errors.email ? "as-input-error" : "",
								type: "email",
								placeholder: "name@email.com",
								value: formData.email,
								onChange: (e) => handleChange("email", e.target.value)
							}),
							errors.email && /* @__PURE__ */ jsx("small", {
								className: "as-field-error",
								children: errors.email
							})
						] }),
						/* @__PURE__ */ jsxs("label", { children: [
							"Phone Number",
							/* @__PURE__ */ jsx("input", {
								className: errors.phone ? "as-input-error" : "",
								type: "tel",
								placeholder: "+63 912 345 6789",
								value: formData.phone,
								onChange: (e) => handleChange("phone", e.target.value)
							}),
							errors.phone && /* @__PURE__ */ jsx("small", {
								className: "as-field-error",
								children: errors.phone
							})
						] }),
						/* @__PURE__ */ jsxs("label", { children: [
							"Additional Notes",
							/* @__PURE__ */ jsx("textarea", {
								className: errors.message ? "as-input-error" : "",
								placeholder: "Tell us more about your property or energy requirements.",
								value: formData.message,
								maxLength: 500,
								onChange: (e) => handleChange("message", e.target.value)
							}),
							/* @__PURE__ */ jsx("small", {
								className: errors.message ? "as-field-error" : "as-character-count",
								children: errors.message || `${formData.message.length}/500 characters`
							})
						] })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "as-modal-actions",
					children: [/* @__PURE__ */ jsx("button", {
						className: "as-btn-secondary",
						onClick: onClose,
						type: "button",
						disabled: isSubmitting,
						children: "Cancel"
					}), /* @__PURE__ */ jsx("button", {
						className: "as-btn-primary",
						onClick: handleSubmit,
						type: "button",
						disabled: isSubmitting,
						children: isSubmitting ? "Submitting..." : "Request Proposal"
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/models/packages.ts
var SOLAR_PACKAGES = [
	{
		id: "sp-3.6",
		name: "3.72 kWp · 3.6 kW · 5.1 kWh",
		solarKwp: 3.72,
		inverterKw: 3.6,
		storageKwh: 5.1,
		phase: "single",
		totalPrice: 269393,
		monthlyBillRange: [3500, 5500]
	},
	{
		id: "sp-6",
		name: "6.2 kWp · 6 kW · 5.1 kWh",
		solarKwp: 6.2,
		inverterKw: 6,
		storageKwh: 5.1,
		phase: "single",
		totalPrice: 367378,
		monthlyBillRange: [7500, 9500]
	},
	{
		id: "sp-10",
		name: "11.16 kWp · 10 kW · 10.2 kWh",
		solarKwp: 11.16,
		inverterKw: 10,
		storageKwh: 10.2,
		phase: "single",
		totalPrice: 497798,
		monthlyBillRange: [15e3, 17e3]
	},
	{
		id: "sp-15",
		name: "18.6 kWp · 15 kW · 15.3 kWh",
		solarKwp: 18.6,
		inverterKw: 15,
		storageKwh: 15.3,
		phase: "single",
		totalPrice: 758289,
		monthlyBillRange: [22e3, 26e3]
	},
	{
		id: "tp-8",
		name: "8.68 kWp · 8 kW · 5.1 kWh",
		solarKwp: 8.68,
		inverterKw: 8,
		storageKwh: 5.1,
		phase: "three",
		totalPrice: 438721,
		monthlyBillRange: [12e3, 14e3]
	},
	{
		id: "tp-10",
		name: "11.16 kWp · 10 kW · 5.1 kWh",
		solarKwp: 11.16,
		inverterKw: 10,
		storageKwh: 5.1,
		phase: "three",
		totalPrice: 476573,
		monthlyBillRange: [15e3, 17e3]
	},
	{
		id: "tp-12",
		name: "12.4 kWp · 12 kW · 5.1 kWh",
		solarKwp: 12.4,
		inverterKw: 12,
		storageKwh: 5.1,
		phase: "three",
		totalPrice: 498886,
		monthlyBillRange: [15e3, 17e3]
	}
];
function findMatchingPackages(result, preferredPhase, catalog = SOLAR_PACKAGES) {
	const matches = catalog.filter((pkg) => {
		const solarOk = pkg.solarKwp >= result.solarKwp;
		const inverterOk = pkg.inverterKw >= result.inverterKw;
		const storageOk = result.storageKwh === 0 || pkg.storageKwh >= result.storageKwh;
		return solarOk && inverterOk && storageOk;
	});
	matches.sort((a, b) => {
		const aPref = a.phase === preferredPhase ? 0 : 1;
		const bPref = b.phase === preferredPhase ? 0 : 1;
		if (aPref !== bPref) return aPref - bPref;
		return a.totalPrice - b.totalPrice;
	});
	return matches.slice(0, 3);
}
async function fetchPackagesFromApi() {
	try {
		const res = await fetch("/api/packages", { headers: { Accept: "application/json" } });
		if (!res.ok) return SOLAR_PACKAGES;
		const json = await res.json();
		if (!json.data?.length) return SOLAR_PACKAGES;
		return json.data.map((p) => ({
			id: p.id,
			name: p.name,
			solarKwp: p.solarKwp,
			inverterKw: p.inverterKw,
			storageKwh: p.storageKwh,
			phase: p.phase,
			totalPrice: p.totalPrice,
			monthlyBillRange: [p.billRangeMin, p.billRangeMax]
		}));
	} catch {
		return SOLAR_PACKAGES;
	}
}
//#endregion
//#region src/modules/quotaion-modal/ASProposalSubmitted.tsx
function formatPeso(value) {
	return `₱${value.toLocaleString("en-PH")}`;
}
function phaseLabel(phase) {
	return phase === "single" ? "Single Phase" : "Three Phase";
}
function ProposalSubmittedModal({ onClose, engineResult, propertyType, catalog }) {
	const packages = engineResult ? findMatchingPackages(engineResult, propertyType === "Residential" ? "single" : "three", catalog) : [];
	const systemLabel = engineResult ? `${engineResult.solarKwp.toFixed(2)} kWp ${engineResult.systemType === "grid-tied" ? "Grid-Tied" : "Hybrid"}` : "Custom Solar System";
	return /* @__PURE__ */ jsx("div", {
		className: "as-modal-backdrop",
		children: /* @__PURE__ */ jsxs("div", {
			className: "as-modal as-submitted-modal",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "as-success-icon",
					children: "✓"
				}),
				/* @__PURE__ */ jsx("h2", { children: "Request Submitted" }),
				/* @__PURE__ */ jsx("p", { children: "Our renewable energy advisor will review your profile and reach out shortly with a tailored proposal." }),
				/* @__PURE__ */ jsxs("div", {
					className: "as-submitted-requirement",
					children: [/* @__PURE__ */ jsx("span", { children: "Your estimated system requirement" }), /* @__PURE__ */ jsxs("div", {
						className: "as-submitted-req-specs",
						children: [
							/* @__PURE__ */ jsxs("span", { children: [engineResult?.solarKwp.toFixed(2) ?? "—", " kWp Solar"] }),
							/* @__PURE__ */ jsxs("span", { children: [engineResult?.inverterKw ?? "—", " kW Inverter"] }),
							engineResult && engineResult.storageKwh > 0 && /* @__PURE__ */ jsxs("span", { children: [engineResult.storageKwh, " kWh Battery"] }),
							engineResult && engineResult.storageKwh === 0 && /* @__PURE__ */ jsx("span", { children: "No Battery (Grid-Tied)" })
						]
					})]
				}),
				packages.length > 0 && /* @__PURE__ */ jsxs("div", {
					className: "as-pkg-section",
					children: [
						/* @__PURE__ */ jsxs("p", {
							className: "as-pkg-section-label",
							children: ["Matching packages for your ", systemLabel]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "as-pkg-grid",
							children: packages.map((pkg, i) => /* @__PURE__ */ jsxs("div", {
								className: `as-pkg-card${i === 0 ? " is-recommended" : ""}`,
								children: [
									i === 0 && /* @__PURE__ */ jsx("span", {
										className: "as-pkg-badge",
										children: "Best Match"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "as-pkg-name",
										children: pkg.name
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "as-pkg-specs",
										children: [
											/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", { children: "Solar" }), /* @__PURE__ */ jsxs("strong", { children: [pkg.solarKwp, " kWp"] })] }),
											/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", { children: "Inverter" }), /* @__PURE__ */ jsxs("strong", { children: [pkg.inverterKw, " kW"] })] }),
											/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", { children: "Battery" }), /* @__PURE__ */ jsxs("strong", { children: [pkg.storageKwh, " kWh"] })] })
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "as-pkg-phase",
										children: [phaseLabel(pkg.phase), " · Hybrid"]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "as-pkg-price",
										children: [/* @__PURE__ */ jsx("span", { children: "Starting at" }), /* @__PURE__ */ jsx("strong", { children: formatPeso(pkg.totalPrice) })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "as-pkg-bill-range",
										children: [
											"For bills ",
											formatPeso(pkg.monthlyBillRange[0]),
											"–",
											formatPeso(pkg.monthlyBillRange[1]),
											"/mo"
										]
									})
								]
							}, pkg.id))
						}),
						/* @__PURE__ */ jsx("p", {
							className: "as-pkg-disclaimer",
							children: "Prices are indicative and based on standard configurations. Final pricing is subject to site survey and specific requirements."
						})
					]
				}),
				packages.length === 0 && engineResult && /* @__PURE__ */ jsx("div", {
					className: "as-pkg-custom",
					children: /* @__PURE__ */ jsxs("p", { children: [
						"Your system requirement (",
						/* @__PURE__ */ jsx("strong", { children: systemLabel }),
						") exceeds our standard catalog. Our engineers will design a custom solution for you."
					] })
				}),
				/* @__PURE__ */ jsx("div", {
					className: "as-modal-actions",
					children: /* @__PURE__ */ jsx("button", {
						className: "as-btn-primary",
						onClick: onClose,
						type: "button",
						children: "Close"
					})
				})
			]
		})
	});
}
//#endregion
//#region src/modules/quotationbuilder.ts
async function sendQuotationRequest(params) {
	const formData = buildQuotationRequestFormData(params);
	try {
		return {
			success: true,
			isRealSuccess: (await fetch("/api/quotation/request-proposal", {
				method: "POST",
				body: formData
			})).ok
		};
	} catch (error) {
		console.error(error);
		return {
			success: false,
			isRealSuccess: false
		};
	}
}
//#endregion
//#region src/assets/logos/quotation-page/residential.svg
var residential_default = "data:image/svg+xml,%3csvg%20width='48'%20height='48'%20viewBox='0%200%2048%2048'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='48'%20height='48'%20rx='16'%20fill='white'%20fill-opacity='0.05'/%3e%3crect%20x='0.5'%20y='0.5'%20width='47'%20height='47'%20rx='15.5'%20stroke='%23E3E3E3'%20stroke-opacity='0.2'/%3e%3cpath%20d='M21.9844%2032.5078H17.0156V24.4922H14.0156L24%2015.4922L33.9844%2024.4922H30.9844V32.5078H26.0156V26.5078H21.9844V32.5078Z'%20fill='%239CA3AF'/%3e%3c/svg%3e";
//#endregion
//#region src/assets/logos/quotation-page/residential-selected.svg
var residential_selected_default = "data:image/svg+xml,%3csvg%20width='48'%20height='48'%20viewBox='0%200%2048%2048'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='48'%20height='48'%20rx='16'%20fill='%23FC625A'%20fill-opacity='0.1'/%3e%3cpath%20d='M21.9844%2032.5078H17.0156V24.4922H14.0156L24%2015.4922L33.9844%2024.4922H30.9844V32.5078H26.0156V26.5078H21.9844V32.5078Z'%20fill='%23FC625A'/%3e%3c/svg%3e";
//#endregion
//#region src/assets/logos/quotation-page/commercial.svg
var commercial_default = "data:image/svg+xml,%3csvg%20width='48'%20height='48'%20viewBox='0%200%2048%2048'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%2016C0%207.16344%207.16344%200%2016%200H32C40.8366%200%2048%207.16344%2048%2016V32C48%2040.8366%2040.8366%2048%2032%2048H16C7.16344%2048%200%2040.8366%200%2032V16Z'%20fill='white'%20fill-opacity='0.05'/%3e%3cpath%20d='M16%200.5H32C40.5604%200.5%2047.5%207.43959%2047.5%2016V32C47.5%2040.5604%2040.5604%2047.5%2032%2047.5H16C7.43959%2047.5%200.5%2040.5604%200.5%2032V16C0.5%207.43959%207.43959%200.5%2016%200.5Z'%20stroke='%23E3E3E3'%20stroke-opacity='0.2'/%3e%3cpath%20d='M30%2027V29.0156H27.9844V27H30ZM30%2023.0156V24.9844H27.9844V23.0156H30ZM32.0156%2030.9844V21H24V23.0156H26.0156V24.9844H24V27H26.0156V29.0156H24V30.9844H32.0156ZM21.9844%2018.9844V17.0156H20.0156V18.9844H21.9844ZM21.9844%2023.0156V21H20.0156V23.0156H21.9844ZM21.9844%2027V24.9844H20.0156V27H21.9844ZM21.9844%2030.9844V29.0156H20.0156V30.9844H21.9844ZM18%2018.9844V17.0156H15.9844V18.9844H18ZM18%2023.0156V21H15.9844V23.0156H18ZM18%2027V24.9844H15.9844V27H18ZM18%2030.9844V29.0156H15.9844V30.9844H18ZM24%2018.9844H33.9844V33H14.0156V15H24V18.9844Z'%20fill='%239CA3AF'/%3e%3c/svg%3e";
//#endregion
//#region src/assets/logos/quotation-page/commercial-selected.svg
var commercial_selected_default = "data:image/svg+xml,%3csvg%20width='48'%20height='48'%20viewBox='0%200%2048%2048'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='48'%20height='48'%20rx='16'%20fill='%23FC625A'%20fill-opacity='0.1'/%3e%3cpath%20d='M30%2027V29.0156H27.9844V27H30ZM30%2023.0156V24.9844H27.9844V23.0156H30ZM32.0156%2030.9844V21H24V23.0156H26.0156V24.9844H24V27H26.0156V29.0156H24V30.9844H32.0156ZM21.9844%2018.9844V17.0156H20.0156V18.9844H21.9844ZM21.9844%2023.0156V21H20.0156V23.0156H21.9844ZM21.9844%2027V24.9844H20.0156V27H21.9844ZM21.9844%2030.9844V29.0156H20.0156V30.9844H21.9844ZM18%2018.9844V17.0156H15.9844V18.9844H18ZM18%2023.0156V21H15.9844V23.0156H18ZM18%2027V24.9844H15.9844V27H18ZM18%2030.9844V29.0156H15.9844V30.9844H18ZM24%2018.9844H33.9844V33H14.0156V15H24V18.9844Z'%20fill='%23FC625A'/%3e%3c/svg%3e";
//#endregion
//#region src/assets/logos/quotation-page/indurstrial.svg
var indurstrial_default = "data:image/svg+xml,%3csvg%20width='48'%20height='48'%20viewBox='0%200%2048%2048'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%2016C0%207.16344%207.16344%200%2016%200H32C40.8366%200%2048%207.16344%2048%2016V32C48%2040.8366%2040.8366%2048%2032%2048H16C7.16344%2048%200%2040.8366%200%2032V16Z'%20fill='white'%20fill-opacity='0.05'/%3e%3cpath%20d='M16%200.5H32C40.5604%200.5%2047.5%207.43959%2047.5%2016V32C47.5%2040.5604%2040.5604%2047.5%2032%2047.5H16C7.43959%2047.5%200.5%2040.5604%200.5%2032V16C0.5%207.43959%207.43959%200.5%2016%200.5Z'%20stroke='%23E3E3E3'%20stroke-opacity='0.2'/%3e%3cpath%20d='M33.9844%2021.9844V33.9844H14.0156V21.9844L21%2018.9844V21L26.0156%2018.9844V21.9844H33.9844ZM29.2031%2020.4844L30%2014.0156H33L33.7969%2020.4844H29.2031ZM23.0156%2030H24.9844V26.0156H23.0156V30ZM18.9844%2030H21V26.0156H18.9844V30ZM29.0156%2026.0156H27V30H29.0156V26.0156Z'%20fill='%239CA3AF'/%3e%3c/svg%3e";
//#endregion
//#region src/assets/logos/quotation-page/industrial-selected.svg
var industrial_selected_default = "data:image/svg+xml,%3csvg%20width='48'%20height='48'%20viewBox='0%200%2048%2048'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='48'%20height='48'%20rx='16'%20fill='%23FC625A'%20fill-opacity='0.1'/%3e%3cpath%20d='M33.9844%2021.9844V33.9844H14.0156V21.9844L21%2018.9844V21L26.0156%2018.9844V21.9844H33.9844ZM29.2031%2020.4844L30%2014.0156H33L33.7969%2020.4844H29.2031ZM23.0156%2030H24.9844V26.0156H23.0156V30ZM18.9844%2030H21V26.0156H18.9844V30ZM29.0156%2026.0156H27V30H29.0156V26.0156Z'%20fill='%23FC625A'/%3e%3c/svg%3e";
//#endregion
//#region src/components/ASQuotationEngine.tsx
var UPLOAD_CONFIG = {
	maxSizeInBytes: 10 * 1024 * 1024,
	allowedMimeTypes: [
		"application/pdf",
		"image/png",
		"image/jpeg"
	],
	allowedExtensions: [
		".pdf",
		".png",
		".jpg",
		".jpeg"
	]
};
var propertyTypes = [
	{
		title: "Residential",
		icon: residential_default,
		selectedIcon: residential_selected_default,
		description: "Standard detached housing or townhouses. Optimized for rooftop efficiency."
	},
	{
		title: "Commercial",
		icon: commercial_default,
		selectedIcon: commercial_selected_default,
		description: "Office buildings, retail spaces, and warehouses. Higher load capacity sizing."
	},
	{
		title: "Industrial",
		icon: indurstrial_default,
		selectedIcon: industrial_selected_default,
		description: "Manufacturing plants and large facilities. High-voltage integration focused."
	}
];
var systemPurposes = [
	{
		id: "zero-bill",
		label: "Zero Bill / Off-Grid",
		description: "Eliminate your electricity bill completely. Covers full day and night load with solar and battery."
	},
	{
		id: "monthly-savings",
		label: "Monthly Savings",
		description: "Target a specific monthly savings amount. Size the system to offset a portion of your electricity bill."
	},
	{
		id: "peak-shaving",
		label: "Peak Shaving",
		description: "Reduce peak demand charges. Battery discharges during peak hours to lower your maximum grid draw."
	}
];
function formatNumber(value) {
	return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
function formatFileSize(bytes) {
	return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
}
function normalizeDecimalInput(value) {
	let cleaned = value.replace(/[^\d.]/g, "");
	cleaned = cleaned.replace(/(\..*?)\..*/g, "$1");
	cleaned = cleaned.replace(/^0+(?=\d)/, "");
	const dot = cleaned.indexOf(".");
	if (dot !== -1) cleaned = cleaned.slice(0, dot + 3);
	return cleaned;
}
function isAllowedFileType(file) {
	const fileName = file.name.toLowerCase();
	return UPLOAD_CONFIG.allowedMimeTypes.includes(file.type) && UPLOAD_CONFIG.allowedExtensions.some((ext) => fileName.endsWith(ext));
}
function useNumericInput(initial) {
	const [num, setNum] = useState(initial);
	const [str, setStr] = useState(initial > 0 ? String(initial) : "");
	const handleChange = (value) => {
		const cleaned = normalizeDecimalInput(value);
		setStr(cleaned);
		const parsed = Number(cleaned);
		setNum(cleaned === "" || cleaned === "." || Number.isNaN(parsed) || parsed < 0 ? 0 : parsed);
	};
	return {
		num,
		str,
		handleChange,
		setNum,
		setStr
	};
}
function ElectricRateField({ num, str, onChange }) {
	const [error, setError] = useState("");
	const clampedNum = Math.min(ELECTRIC_RATE_CONFIG.max, Math.max(ELECTRIC_RATE_CONFIG.min, num || ELECTRIC_RATE_CONFIG.min));
	const handleTextChange = (value) => {
		const cleaned = normalizeDecimalInput(value);
		onChange(cleaned);
		if (cleaned === "" || cleaned === ".") {
			setError("");
			return;
		}
		const n = Number(cleaned);
		if (n < ELECTRIC_RATE_CONFIG.min) setError(`Minimum value is ₱${ELECTRIC_RATE_CONFIG.min} / kWh`);
		else if (n > ELECTRIC_RATE_CONFIG.max) setError(`Maximum value is ₱${ELECTRIC_RATE_CONFIG.max} / kWh`);
		else setError("");
	};
	const handleBlur = () => {
		const n = Number(str);
		const clamped = Math.min(ELECTRIC_RATE_CONFIG.max, Math.max(ELECTRIC_RATE_CONFIG.min, !n || n <= 0 ? ELECTRIC_RATE_CONFIG.min : n));
		onChange(String(parseFloat(clamped.toFixed(2))));
		setError("");
	};
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
		className: "as-rate-wrapper",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "as-rate-slider-area",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "as-rate-labels",
				children: [/* @__PURE__ */ jsxs("span", { children: ["₱", ELECTRIC_RATE_CONFIG.min] }), /* @__PURE__ */ jsxs("span", { children: ["₱", ELECTRIC_RATE_CONFIG.max] })]
			}), /* @__PURE__ */ jsx("input", {
				type: "range",
				min: ELECTRIC_RATE_CONFIG.min,
				max: ELECTRIC_RATE_CONFIG.max,
				step: ELECTRIC_RATE_CONFIG.step,
				value: clampedNum,
				onChange: (e) => {
					onChange(e.target.value);
					setError("");
				}
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "as-rate-input-group",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "as-rate-value",
				children: [/* @__PURE__ */ jsx("span", { children: "₱" }), /* @__PURE__ */ jsx("input", {
					type: "text",
					inputMode: "decimal",
					value: str,
					onChange: (e) => handleTextChange(e.target.value),
					onBlur: handleBlur
				})]
			}), /* @__PURE__ */ jsx("small", { children: "/ kWh" })]
		})]
	}), error && /* @__PURE__ */ jsx("p", {
		className: "as-rate-error",
		children: error
	})] });
}
function LoadProfileSection({ label, required, appliances, totalDailyUsageWh, onAdd, onRemove, onEdit }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "as-form-section",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "as-load-header",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "as-section-label",
				children: [/* @__PURE__ */ jsx("span", { children: label }), /* @__PURE__ */ jsxs("p", { children: [
					"Detailed Load Profile",
					" ",
					!required && /* @__PURE__ */ jsx("small", { children: "(Optional)" })
				] })]
			}), /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "as-add-btn",
				onClick: onAdd,
				children: "+ Add Appliance"
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "as-load-table",
			style: { fontFamily: "'Inter', sans-serif" },
			children: /* @__PURE__ */ jsxs("div", {
				className: "as-load-table-inner",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "as-load-row as-load-head",
					children: [
						/* @__PURE__ */ jsx("span", { children: "Appliance / Load Name" }),
						/* @__PURE__ */ jsx("span", { children: "Rating (Watts)" }),
						/* @__PURE__ */ jsx("span", { children: "Qty" }),
						/* @__PURE__ */ jsx("span", { children: "Hrs/Day" }),
						/* @__PURE__ */ jsx("span", { children: "Daily Wh" }),
						/* @__PURE__ */ jsx("span", {})
					]
				}), appliances.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "as-load-empty",
					children: "Add appliances to create a detailed load profile."
				}) : /* @__PURE__ */ jsxs(Fragment, { children: [appliances.map((item) => /* @__PURE__ */ jsxs("div", {
					className: "as-load-row",
					children: [
						/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: item.name }), /* @__PURE__ */ jsx("small", { children: item.schedule })] }),
						/* @__PURE__ */ jsx("span", { children: formatNumber(item.watts) }),
						/* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx("b", { children: item.quantity }) }),
						/* @__PURE__ */ jsx("span", { children: item.hours }),
						/* @__PURE__ */ jsx("span", { children: formatNumber(item.usage) }),
						/* @__PURE__ */ jsxs("span", {
							className: "as-load-actions",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								className: "as-load-edit-btn",
								onClick: () => onEdit(item),
								children: "✎"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								className: "as-load-remove-btn",
								onClick: () => onRemove(item.id),
								children: "×"
							})]
						})
					]
				}, item.id)), /* @__PURE__ */ jsxs("div", {
					className: "as-load-total",
					children: [/* @__PURE__ */ jsx("span", { children: "Total Watt-Hours" }), /* @__PURE__ */ jsx("strong", { children: formatNumber(totalDailyUsageWh) })]
				})] })]
			})
		})]
	});
}
function ASQuotationEngine() {
	useSeoMeta({
		title: "Free Solar Savings Calculator — Bohol, Philippines",
		description: "Estimate your solar system size and monthly savings with our free solar calculator. Enter your electricity bill to find the right package — serving Bohol & the Philippines.",
		canonical: "https://azari.solar/solar-calculator"
	});
	const quoteState = useLocation().state ?? {};
	const fileInputRef = useRef(null);
	const [hasBill, setHasBill] = useState(true);
	const [systemPurpose, setSystemPurpose] = useState("monthly-savings");
	const [systemType, setSystemType] = useState("hybrid");
	const [selectedProperty, setSelectedProperty] = useState("Residential");
	const [modal, setModal] = useState(null);
	const [formError, setFormError] = useState("");
	const [uploadError, setUploadError] = useState("");
	const [peakDurationError, setPeakDurationError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submittedResult, setSubmittedResult] = useState(null);
	const [packageCatalog, setPackageCatalog] = useState(SOLAR_PACKAGES);
	const [appliances, setAppliances] = useState([]);
	const [editingAppliance, setEditingAppliance] = useState(null);
	const [uploadedBill, setUploadedBill] = useState(null);
	const savingsTarget = useNumericInput(quoteState.estimatedMonthlySavings ?? 0);
	const electricRateMS = useNumericInput(quoteState.electricRate ?? ELECTRIC_RATE_CONFIG.min);
	const peakPower = useNumericInput(0);
	const allowedGridPower = useNumericInput(0);
	const peakDuration = useNumericInput(0);
	const monthlyBillZB = useNumericInput(quoteState.monthlyBill ?? 5e3);
	const electricRateZB = useNumericInput(quoteState.electricRate ?? ELECTRIC_RATE_CONFIG.defaultValue);
	const closeModal = () => setModal(null);
	useEffect(() => {
		if (systemPurpose === "zero-bill" && selectedProperty !== "Residential") setSystemPurpose("monthly-savings");
	}, [selectedProperty, systemPurpose]);
	useEffect(() => {
		if (!modal) return;
		const scrollY = window.scrollY;
		const prev = {
			overflow: document.body.style.overflow,
			position: document.body.style.position,
			top: document.body.style.top,
			width: document.body.style.width
		};
		document.body.style.overflow = "hidden";
		document.body.style.position = "fixed";
		document.body.style.top = `-${scrollY}px`;
		document.body.style.width = "100%";
		return () => {
			document.body.style.overflow = prev.overflow;
			document.body.style.position = prev.position;
			document.body.style.top = prev.top;
			document.body.style.width = prev.width;
			window.scrollTo(0, scrollY);
		};
	}, [modal]);
	useEffect(() => {
		fetchPackagesFromApi().then(setPackageCatalog).catch(() => {});
	}, []);
	const { duec, nwec, totalDailyUsageWh } = useMemo(() => computeDailyLoadMetrics(appliances), [appliances]);
	const engineResult = useMemo(() => {
		if (systemPurpose === "monthly-savings") {
			const dpt = computeDpt(savingsTarget.num, electricRateMS.num);
			if (dpt <= 0) return null;
			return systemType === "hybrid" ? calculateMonthlySavingsHybrid(dpt, duec) : calculateMonthlySavingsGridTied(dpt, duec);
		}
		if (systemPurpose === "peak-shaving") {
			const gap = peakPower.num - allowedGridPower.num;
			if (peakPower.num <= 0 || gap <= 0 || peakDuration.num <= 0 || peakDuration.num > 24) return null;
			return calculatePeakShaving(peakPower.num, allowedGridPower.num, peakDuration.num);
		}
		if (systemPurpose === "zero-bill") {
			const hasProfile = appliances.length > 0;
			if (hasBill && !hasProfile) {
				if (monthlyBillZB.num <= 0 || electricRateZB.num <= 0) return null;
				return calculateZeroBillBillOnly(monthlyBillZB.num, electricRateZB.num);
			}
			if (hasBill && hasProfile) {
				if (monthlyBillZB.num <= 0 || electricRateZB.num <= 0) return null;
				return calculateZeroBillWithLoadProfile(monthlyBillZB.num, electricRateZB.num, nwec);
			}
			if (!hasProfile) return null;
			return calculateZeroBillLoadOnly(duec, nwec);
		}
		return null;
	}, [
		systemPurpose,
		systemType,
		savingsTarget.num,
		electricRateMS.num,
		peakPower.num,
		allowedGridPower.num,
		peakDuration.num,
		hasBill,
		monthlyBillZB.num,
		electricRateZB.num,
		duec,
		nwec,
		appliances.length
	]);
	const handleApplianceSubmit = (item) => {
		const w = Number(item.watts);
		const q = Number(item.quantity);
		const h = Number(item.hours);
		if (!item.name?.trim() || w <= 0 || q <= 0 || h <= 0) return;
		const built = {
			id: editingAppliance?.id ?? crypto.randomUUID(),
			name: item.name.trim(),
			watts: w,
			quantity: q,
			hours: h,
			dayHours: item.dayHours,
			nightHours: item.nightHours,
			schedule: item.schedule,
			scheduleItems: item.scheduleItems,
			usageType: item.usageType,
			usage: w * q * h,
			dayUsage: w * q * item.dayHours,
			nightUsage: w * q * item.nightHours
		};
		if (editingAppliance) setAppliances((current) => current.map((a) => a.id === editingAppliance.id ? built : a));
		else setAppliances((current) => [...current, built]);
		setEditingAppliance(null);
		setFormError("");
		closeModal();
	};
	const handleRemoveAppliance = useCallback((id) => {
		setAppliances((current) => current.filter((a) => a.id !== id));
	}, []);
	const handleFileUpload = (file) => {
		setUploadError("");
		if (!file) return;
		if (!isAllowedFileType(file)) {
			setUploadedBill(null);
			setUploadError("Only PDF, PNG, JPG, and JPEG files are allowed.");
			return;
		}
		if (file.size > UPLOAD_CONFIG.maxSizeInBytes) {
			setUploadedBill(null);
			setUploadError("File must not exceed 10MB.");
			return;
		}
		setUploadedBill({
			file,
			name: file.name,
			type: file.type,
			size: file.size
		});
	};
	const handleDrop = (event) => {
		event.preventDefault();
		handleFileUpload(event.dataTransfer.files?.[0]);
	};
	const handleRemoveUploadedBill = () => {
		setUploadedBill(null);
		setUploadError("");
		if (fileInputRef.current) fileInputRef.current.value = "";
	};
	const validateBeforeProposal = () => {
		if (!selectedProperty) return "Please select a property classification.";
		if (systemPurpose === "monthly-savings") {
			if (savingsTarget.num <= 0) return "Please enter a monthly savings target.";
			if (electricRateMS.num <= 0) return "Please enter a valid electricity rate.";
			if (systemType === "hybrid" && appliances.length === 0) return "Add your appliances so we can size the battery for your night loads.";
		}
		if (systemPurpose === "peak-shaving") {
			if (peakPower.num <= 0) return "Please enter your peak power demand.";
			if (peakPower.num <= allowedGridPower.num) return "Peak power must be greater than the allowed grid power.";
			if (peakDuration.num <= 0 || peakDuration.num > 24) return "Please enter a valid peak duration (between 0 and 24 hours).";
		}
		if (systemPurpose === "zero-bill") {
			if (!hasBill && appliances.length === 0) return "Please enter a bill or add appliances to size the system.";
			if (hasBill) {
				if (monthlyBillZB.num <= 0) return "Please enter your monthly electricity bill.";
				if (electricRateZB.num <= 0) return "Please enter a valid electricity rate.";
			}
		}
		if (!engineResult) return "Unable to compute system size. Please check your inputs.";
		return "";
	};
	const handleOpenProposal = () => {
		const error = validateBeforeProposal();
		if (error) {
			setFormError(error);
			return;
		}
		setModal("request-proposal");
	};
	const resetForm = () => {
		setAppliances([]);
		setUploadedBill(null);
		setFormError("");
		savingsTarget.setStr("");
		savingsTarget.setNum(0);
	};
	const handleSubmitProposal = async (proposalForm) => {
		const error = validateBeforeProposal();
		if (error) {
			setFormError(error);
			return;
		}
		setIsSubmitting(true);
		try {
			if ((await sendQuotationRequest({
				systemPurpose,
				systemType: engineResult.systemType,
				selectedProperty,
				monthlySavingsTarget: savingsTarget.num,
				monthlyBill: hasBill ? monthlyBillZB.num : 0,
				electricRate: systemPurpose === "zero-bill" ? electricRateZB.num : electricRateMS.num,
				peakPower: peakPower.num,
				allowedGridPower: allowedGridPower.num,
				peakDuration: peakDuration.num,
				engineResult,
				appliances,
				uploadedBill,
				proposalForm
			})).isRealSuccess) {
				setSubmittedResult(engineResult);
				resetForm();
				setModal("submitted");
				return;
			}
			setModal("system-error");
		} finally {
			setIsSubmitting(false);
		}
	};
	const monthlySavingsContent = /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "as-form-section",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "as-section-label",
				children: [/* @__PURE__ */ jsx("span", { children: "03" }), /* @__PURE__ */ jsx("p", { children: "System Type" })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "as-quote-mode-toggle",
				"data-active": systemType === "hybrid" ? 0 : 1,
				children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					className: systemType === "hybrid" ? "is-active" : "",
					onClick: () => {
						setSystemType("hybrid");
						setFormError("");
					},
					children: "Hybrid (with Battery)"
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: systemType === "grid-tied" ? "is-active" : "",
					onClick: () => {
						setSystemType("grid-tied");
						setFormError("");
					},
					children: "Grid-Tied (No Battery)"
				})]
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "as-form-section",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "as-section-label",
				children: [/* @__PURE__ */ jsx("span", { children: "04" }), /* @__PURE__ */ jsx("p", { children: "Monthly Savings Target" })]
			}), /* @__PURE__ */ jsx("div", {
				className: "as-consumption-grid",
				style: { gridTemplateColumns: "1fr" },
				children: /* @__PURE__ */ jsxs("div", {
					className: "as-input-card",
					children: [
						/* @__PURE__ */ jsx("label", { children: "Target Monthly Savings" }),
						/* @__PURE__ */ jsxs("div", {
							className: "as-currency-input",
							children: [
								/* @__PURE__ */ jsx("span", { children: "₱" }),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									inputMode: "decimal",
									placeholder: "0.00",
									value: savingsTarget.str,
									onChange: (e) => {
										savingsTarget.handleChange(e.target.value);
										setFormError("");
									}
								}),
								/* @__PURE__ */ jsx("small", { children: "PHP / mo" })
							]
						}),
						/* @__PURE__ */ jsx("p", { children: "The amount you want to reduce from your monthly bill." })
					]
				})
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "as-form-section",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "as-section-label",
				children: [/* @__PURE__ */ jsx("span", { children: "05" }), /* @__PURE__ */ jsx("p", { children: "Electricity Rate" })]
			}), /* @__PURE__ */ jsx(ElectricRateField, {
				num: electricRateMS.num,
				str: electricRateMS.str,
				onChange: (v) => {
					electricRateMS.handleChange(v);
					setFormError("");
				}
			})]
		}),
		/* @__PURE__ */ jsx(LoadProfileSection, {
			label: "06",
			required: systemType === "hybrid",
			appliances,
			totalDailyUsageWh,
			onAdd: () => {
				setEditingAppliance(null);
				setModal("add-appliance");
			},
			onRemove: handleRemoveAppliance,
			onEdit: (a) => {
				setEditingAppliance(a);
				setModal("add-appliance");
			}
		})
	] });
	const peakShavingContent = /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", {
		className: "as-form-section",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "as-section-label",
			children: [/* @__PURE__ */ jsx("span", { children: "03" }), /* @__PURE__ */ jsx("p", { children: "Peak Shaving Parameters" })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "as-consumption-grid",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "as-input-card",
					children: [
						/* @__PURE__ */ jsx("label", { children: "Peak Power Demand" }),
						/* @__PURE__ */ jsxs("div", {
							className: "as-currency-input",
							children: [/* @__PURE__ */ jsx("input", {
								type: "text",
								inputMode: "decimal",
								placeholder: "0",
								value: peakPower.str,
								onChange: (e) => {
									peakPower.handleChange(e.target.value);
									setFormError("");
								}
							}), /* @__PURE__ */ jsx("small", { children: "kW" })]
						}),
						/* @__PURE__ */ jsx("p", { children: "Your facility's maximum power demand during peak hours." })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "as-input-card",
					children: [
						/* @__PURE__ */ jsx("label", { children: "Allowed Grid Power" }),
						/* @__PURE__ */ jsxs("div", {
							className: "as-currency-input",
							children: [/* @__PURE__ */ jsx("input", {
								type: "text",
								inputMode: "decimal",
								placeholder: "0",
								value: allowedGridPower.str,
								onChange: (e) => {
									allowedGridPower.handleChange(e.target.value);
									setFormError("");
								}
							}), /* @__PURE__ */ jsx("small", { children: "kW" })]
						}),
						/* @__PURE__ */ jsx("p", { children: "Maximum grid draw allowed. Battery covers the rest." })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "as-input-card",
					children: [
						/* @__PURE__ */ jsx("label", { children: "Peak Duration" }),
						/* @__PURE__ */ jsxs("div", {
							className: "as-currency-input",
							children: [/* @__PURE__ */ jsx("input", {
								type: "text",
								inputMode: "decimal",
								placeholder: "4",
								value: peakDuration.str,
								onChange: (e) => {
									peakDuration.handleChange(e.target.value);
									setFormError("");
									setPeakDurationError(e.target.value === "" || e.target.value === "." ? "" : Number(e.target.value) > 24 ? "Maximum is 24 hours." : Number(e.target.value) <= 0 ? "Must be greater than 0." : "");
								},
								onBlur: () => {
									if (peakDuration.num > 24) {
										peakDuration.handleChange("24");
										setPeakDurationError("");
									} else if (peakDuration.num <= 0 && peakDuration.str !== "") {
										peakDuration.handleChange("");
										setPeakDurationError("");
									}
								}
							}), /* @__PURE__ */ jsx("small", { children: "hrs" })]
						}),
						/* @__PURE__ */ jsx("p", { children: "Decimals count as minutes (e.g. 1.5 = 1h 30m). Max 24 hrs." }),
						peakDurationError && /* @__PURE__ */ jsx("p", {
							className: "as-rate-error",
							children: peakDurationError
						})
					]
				})
			]
		})]
	}) });
	const zeroBillContent = /* @__PURE__ */ jsxs(Fragment, { children: [hasBill && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		className: "as-form-section",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "as-section-label",
			children: [/* @__PURE__ */ jsx("span", { children: "03" }), /* @__PURE__ */ jsx("p", { children: "Consumption Data" })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "as-consumption-grid",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "as-upload-card",
				role: "button",
				tabIndex: 0,
				onClick: () => fileInputRef.current?.click(),
				onDrop: handleDrop,
				onDragOver: (e) => e.preventDefault(),
				onKeyDown: (e) => {
					if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
				},
				children: [
					/* @__PURE__ */ jsx("input", {
						ref: fileInputRef,
						type: "file",
						accept: ".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg",
						hidden: true,
						onChange: (e) => handleFileUpload(e.target.files?.[0])
					}),
					/* @__PURE__ */ jsx("div", {
						className: "as-upload-icon",
						children: "☁"
					}),
					uploadedBill ? /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsxs("p", { children: [
							uploadedBill.name,
							" ",
							/* @__PURE__ */ jsx("span", { children: formatFileSize(uploadedBill.size) })
						] }),
						/* @__PURE__ */ jsx("small", { children: "Click to replace uploaded bill" }),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: (e) => {
								e.stopPropagation();
								handleRemoveUploadedBill();
							},
							children: "Remove"
						})
					] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("p", { children: [
						/* @__PURE__ */ jsx("span", {
							className: "upload-highlight",
							children: "Upload your electricity bill"
						}),
						" ",
						"or drag and drop"
					] }), /* @__PURE__ */ jsx("small", { children: "PDF, PNG, JPG up to 10MB" })] }),
					uploadError && /* @__PURE__ */ jsx("small", {
						className: "as-form-error",
						children: uploadError
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "as-input-card",
				children: [
					/* @__PURE__ */ jsx("label", { children: "Average Monthly Bill" }),
					/* @__PURE__ */ jsxs("div", {
						className: "as-currency-input",
						children: [
							/* @__PURE__ */ jsx("span", { children: "₱" }),
							/* @__PURE__ */ jsx("input", {
								type: "text",
								inputMode: "decimal",
								placeholder: "0.00",
								value: monthlyBillZB.str,
								onChange: (e) => {
									monthlyBillZB.handleChange(e.target.value);
									setFormError("");
								}
							}),
							/* @__PURE__ */ jsx("small", { children: "PHP" })
						]
					}),
					/* @__PURE__ */ jsx("p", { children: "Based on your recent electricity bill." })
				]
			})]
		})]
	}), /* @__PURE__ */ jsxs("div", {
		className: "as-form-section",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "as-section-label",
			children: [/* @__PURE__ */ jsx("span", { children: "04" }), /* @__PURE__ */ jsx("p", { children: "Typical Electricity Rate" })]
		}), /* @__PURE__ */ jsx(ElectricRateField, {
			num: electricRateZB.num,
			str: electricRateZB.str,
			onChange: (v) => {
				electricRateZB.handleChange(v);
				setFormError("");
			}
		})]
	})] }), /* @__PURE__ */ jsx(LoadProfileSection, {
		label: hasBill ? "05" : "03",
		required: !hasBill,
		appliances,
		totalDailyUsageWh,
		onAdd: () => {
			setEditingAppliance(null);
			setModal("add-appliance");
		},
		onRemove: handleRemoveAppliance,
		onEdit: (a) => {
			setEditingAppliance(a);
			setModal("add-appliance");
		}
	})] });
	const modalLayer = modal && typeof document !== "undefined" ? createPortal(/* @__PURE__ */ jsxs(Fragment, { children: [
		modal === "add-appliance" && /* @__PURE__ */ jsx(AddApplianceModal, {
			onClose: () => {
				setEditingAppliance(null);
				closeModal();
			},
			onSubmit: handleApplianceSubmit,
			initial: editingAppliance ?? void 0
		}),
		modal === "request-proposal" && /* @__PURE__ */ jsx(RequestProposalModal, {
			onClose: closeModal,
			onSubmit: handleSubmitProposal,
			isSubmitting
		}),
		modal === "submitted" && /* @__PURE__ */ jsx(ProposalSubmittedModal, {
			onClose: closeModal,
			engineResult: submittedResult,
			propertyType: selectedProperty,
			catalog: packageCatalog
		}),
		modal === "system-error" && /* @__PURE__ */ jsx(ASSystemError, { onClose: closeModal })
	] }), document.body) : null;
	return /* @__PURE__ */ jsxs("section", {
		className: "as-quote-page",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "as-quote-container",
			children: [/* @__PURE__ */ jsxs("header", {
				className: "as-quote-header",
				children: [
					/* @__PURE__ */ jsx("h1", { children: "Solar Power System Calculator" }),
					/* @__PURE__ */ jsx("p", { children: "Configure your institutional-grade solar system." }),
					/* @__PURE__ */ jsxs("div", {
						className: "as-quote-mode-toggle as-bill-toggle",
						"data-active": hasBill ? 0 : 1,
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							className: hasBill ? "is-active" : "",
							onClick: () => {
								setHasBill(true);
								setFormError("");
							},
							children: "I have a bill"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: !hasBill ? "is-active" : "",
							onClick: () => {
								setHasBill(false);
								setFormError("");
							},
							children: "No bill yet"
						})]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "as-quote-layout",
				children: [/* @__PURE__ */ jsxs("main", {
					className: "as-quote-main",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "as-form-section",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "as-section-label",
								children: [/* @__PURE__ */ jsx("span", { children: "01" }), /* @__PURE__ */ jsx("p", { children: "Property Classification" })]
							}), /* @__PURE__ */ jsx("div", {
								className: "as-property-grid",
								children: propertyTypes.map((item) => /* @__PURE__ */ jsxs("button", {
									type: "button",
									className: `as-property-card ${selectedProperty === item.title ? "is-selected" : ""}`,
									onClick: () => {
										setSelectedProperty(item.title);
										if (item.title !== "Residential" && systemPurpose === "zero-bill") {
											setSystemPurpose("monthly-savings");
											setFormError("");
											setAppliances([]);
										}
									},
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "as-property-bg",
											children: [/* @__PURE__ */ jsx("span", {
												className: "as-property-icon",
												children: /* @__PURE__ */ jsx("img", {
													src: selectedProperty === item.title ? item.selectedIcon : item.icon,
													alt: item.title
												})
											}), /* @__PURE__ */ jsx("span", { className: "as-property-check" })]
										}),
										/* @__PURE__ */ jsx("h3", { children: item.title }),
										/* @__PURE__ */ jsx("p", { children: item.description })
									]
								}, item.title))
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "as-form-section",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "as-section-label",
								children: [/* @__PURE__ */ jsx("span", { children: "02" }), /* @__PURE__ */ jsx("p", { children: "System Purpose" })]
							}), /* @__PURE__ */ jsx("div", {
								className: "as-property-grid",
								children: systemPurposes.filter((item) => !(item.id === "zero-bill" && selectedProperty !== "Residential")).map((item) => /* @__PURE__ */ jsxs("button", {
									type: "button",
									className: `as-property-card ${systemPurpose === item.id ? "is-selected" : ""}`,
									onClick: () => {
										setSystemPurpose(item.id);
										setFormError("");
										setAppliances([]);
									},
									children: [
										/* @__PURE__ */ jsx("span", { className: "as-property-check" }),
										/* @__PURE__ */ jsx("h3", { children: item.label }),
										/* @__PURE__ */ jsx("p", { children: item.description })
									]
								}, item.id))
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: { display: "contents" },
							children: [
								systemPurpose === "monthly-savings" && monthlySavingsContent,
								systemPurpose === "peak-shaving" && peakShavingContent,
								systemPurpose === "zero-bill" && zeroBillContent
							]
						}, systemPurpose),
						formError && /* @__PURE__ */ jsx("div", {
							className: "as-page-error",
							children: formError
						})
					]
				}), /* @__PURE__ */ jsx("aside", {
					className: "as-quote-summary",
					children: /* @__PURE__ */ jsxs("div", {
						className: "as-summary-card",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "as-summary-title",
								children: "Recommended System Specifications"
							}),
							/* @__PURE__ */ jsx("p", { children: "Inverter Capacity and Types" }),
							/* @__PURE__ */ jsx("h2", { children: engineResult ? `${engineResult.inverterKw}kW ${engineResult.systemType === "grid-tied" ? "Grid-Tie" : "Hybrid"}` : "—" }),
							/* @__PURE__ */ jsx("p", { children: "Solar Panel Capacity" }),
							/* @__PURE__ */ jsx("h2", { children: engineResult ? `~${engineResult.solarKwp.toFixed(1)} kWp` : "—" }),
							/* @__PURE__ */ jsx("p", { children: "Storage Capacity" }),
							/* @__PURE__ */ jsx("h2", { children: engineResult ? engineResult.storageKwh > 0 ? `${engineResult.storageKwh} kWh` : "No Battery" : "—" }),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: handleOpenProposal,
								disabled: isSubmitting,
								children: isSubmitting ? "Submitting..." : "Request Proposal"
							})
						]
					})
				})]
			})]
		}), modalLayer]
	});
}
//#endregion
//#region app/routes/solar-calculator.tsx
var solar_calculator_exports = /* @__PURE__ */ __exportAll({
	default: () => solar_calculator_default,
	meta: () => meta$3
});
var meta$3 = () => [
	{ title: "Solar Savings Calculator — Azari Solar" },
	{
		name: "description",
		content: "Use our free solar savings calculator to estimate how much you can save on electricity bills with a solar system. Get a personalized quote for your home or business."
	},
	{
		name: "robots",
		content: "index, follow"
	},
	{
		tagName: "link",
		rel: "canonical",
		href: "https://azari.solar/solar-calculator"
	},
	{
		property: "og:type",
		content: "website"
	},
	{
		property: "og:url",
		content: "https://azari.solar/solar-calculator"
	},
	{
		property: "og:title",
		content: "Solar Savings Calculator — Azari Solar"
	},
	{
		property: "og:description",
		content: "Estimate your solar savings and get a personalized quote for your home or business in Bohol, Philippines."
	},
	{
		property: "og:image",
		content: "https://azari.solar/preview.jpg"
	},
	{
		name: "twitter:card",
		content: "summary_large_image"
	},
	{
		name: "twitter:title",
		content: "Solar Savings Calculator — Azari Solar"
	},
	{
		name: "twitter:description",
		content: "Estimate your solar savings and get a personalized quote for your home or business in Bohol, Philippines."
	},
	{
		name: "twitter:image",
		content: "https://azari.solar/preview.jpg"
	}
];
var solar_calculator_default = UNSAFE_withComponentProps(function SolarCalculator() {
	return /* @__PURE__ */ jsx(ASQuotationEngine, {});
});
//#endregion
//#region src/assets/icons/icon-default.svg
var icon_default_default = "data:image/svg+xml,%3csvg%20width='48'%20height='48'%20viewBox='0%200%2048%2048'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='48'%20height='48'%20rx='16'%20fill='%232C2C2C'/%3e%3crect%20x='0.5'%20y='0.5'%20width='47'%20height='47'%20rx='15.5'%20stroke='%23E3E3E3'%20stroke-opacity='0.2'/%3e%3cg%20clip-path='url(%23clip0_1665_26545)'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M24%2014C18.4772%2014%2014%2018.4772%2014%2024C14%2029.5228%2018.4772%2034%2024%2034C29.5228%2034%2034%2029.5228%2034%2024C34%2018.4772%2029.5228%2014%2024%2014ZM24%2015.6667C28.6024%2015.6667%2032.3333%2019.3976%2032.3333%2024C32.3333%2028.6024%2028.6024%2032.3333%2024%2032.3333C19.3976%2032.3333%2015.6667%2028.6024%2015.6667%2024C15.6667%2019.3976%2019.3976%2015.6667%2024%2015.6667Z'%20fill='%239CA3AF'/%3e%3cpath%20d='M24%2022.1667C24.4602%2022.1667%2024.8333%2022.5398%2024.8333%2023V28C24.8333%2028.4602%2024.4602%2028.8333%2024%2028.8333C23.5398%2028.8333%2023.1667%2028.4602%2023.1667%2028V23C23.1667%2022.5398%2023.5398%2022.1667%2024%2022.1667Z'%20fill='%239CA3AF'/%3e%3cpath%20d='M24%2019.1667C24.6443%2019.1667%2025.1667%2019.689%2025.1667%2020.3333C25.1667%2020.9777%2024.6443%2021.5%2024%2021.5C23.3557%2021.5%2022.8333%2020.9777%2022.8333%2020.3333C22.8333%2019.689%2023.3557%2019.1667%2024%2019.1667Z'%20fill='%239CA3AF'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_1665_26545'%3e%3crect%20width='20'%20height='20'%20fill='white'%20transform='translate(14%2014)'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
//#endregion
//#region src/pages/ASClientJourneyPage.tsx
function subscribeBodyClass(cb) {
	const mo = new MutationObserver(cb);
	mo.observe(document.body, {
		attributes: true,
		attributeFilter: ["class"]
	});
	return () => mo.disconnect();
}
function getIsLightTheme() {
	return document.body.classList.contains("light-theme");
}
function JourneyIcon({ iconUrl, iconUrlHighlighted, iconUrlLight, iconUrlLightHighlighted, isActive, isLight: isLightProp }) {
	const isLightBody = useSyncExternalStore(subscribeBodyClass, getIsLightTheme, () => false);
	const isLight = isLightProp !== void 0 ? isLightProp : isLightBody;
	let src;
	if (isActive) src = (isLight ? iconUrlLightHighlighted : null) ?? iconUrlHighlighted ?? (isLight ? iconUrlLight : null) ?? iconUrl;
	else src = (isLight ? iconUrlLight : null) ?? iconUrl;
	if (src) return /* @__PURE__ */ jsx("img", {
		src,
		alt: "",
		className: "as-cjp-icon-img",
		"aria-hidden": "true"
	});
	return /* @__PURE__ */ jsx("img", {
		src: icon_default_default,
		alt: "",
		className: "as-cjp-icon-img",
		"aria-hidden": "true"
	});
}
function HeadingRenderer({ block }) {
	return /* @__PURE__ */ jsx(`h${block.level}`, {
		className: "as-cjp-block-heading",
		children: block.text
	});
}
function ParagraphRenderer({ block }) {
	return /* @__PURE__ */ jsx("p", {
		className: "as-cjp-block-para",
		dangerouslySetInnerHTML: { __html: block.html }
	});
}
function renderBulletItem(item, depth = 0) {
	return /* @__PURE__ */ jsxs("li", {
		className: `as-cjp-bullet-item${depth > 0 ? " as-cjp-bullet-item--nested" : ""}`,
		children: [
			item.boldLead && /* @__PURE__ */ jsxs("strong", {
				className: "as-cjp-bullet-lead",
				children: [item.boldLead, " "]
			}),
			item.linkUrl ? /* @__PURE__ */ jsx("a", {
				href: item.linkUrl,
				target: item.linkExternal !== false ? "_blank" : "_self",
				rel: "noopener noreferrer",
				className: "as-cjp-inline-link",
				children: item.linkLabel ?? item.text
			}) : item.text,
			item.children && item.children.length > 0 && /* @__PURE__ */ jsx("ul", {
				className: "as-cjp-bullet-list as-cjp-bullet-list--nested",
				children: item.children.map((child) => renderBulletItem(child, depth + 1))
			})
		]
	}, item.text);
}
function BulletListRenderer({ block }) {
	return /* @__PURE__ */ jsx("ul", {
		className: "as-cjp-bullet-list",
		children: block.items.map((item) => renderBulletItem(item))
	});
}
function LinkGroupRenderer({ block }) {
	const navigate = useNavigate();
	return /* @__PURE__ */ jsx("div", {
		className: "as-cjp-link-group",
		children: block.links.map((link, i) => {
			const isButton = link.style === "button";
			const handleClick = () => {
				if (link.external) window.open(link.url, "_blank", "noopener,noreferrer");
				else navigate(link.url);
			};
			return /* @__PURE__ */ jsx("button", {
				className: isButton ? "as-cjp-btn as-cjp-btn--primary" : "as-cjp-inline-link as-cjp-text-link",
				onClick: handleClick,
				children: link.label
			}, i);
		})
	});
}
function ButtonRenderer({ block }) {
	const navigate = useNavigate();
	return /* @__PURE__ */ jsx("button", {
		className: "as-cjp-btn as-cjp-btn--primary",
		onClick: () => {
			if (block.external) window.open(block.url, "_blank", "noopener,noreferrer");
			else navigate(block.url);
		},
		children: block.label
	});
}
function ImageRenderer({ block }) {
	return /* @__PURE__ */ jsxs("figure", {
		className: "as-cjp-block-figure",
		children: [/* @__PURE__ */ jsx(ASImgLoader, {
			src: block.src,
			alt: block.alt,
			className: "as-cjp-block-img",
			wrapClassName: "as-cjp-block-img-loader",
			loading: "lazy"
		}), block.caption && /* @__PURE__ */ jsx("figcaption", {
			className: "as-cjp-block-caption",
			children: block.caption
		})]
	});
}
function PartnerGridRenderer({ block }) {
	return /* @__PURE__ */ jsx("div", {
		className: "as-cjp-partner-grid",
		children: block.items.map((item, i) => /* @__PURE__ */ jsxs("div", {
			className: "as-cjp-partner-item",
			children: [
				item.logoUrl && /* @__PURE__ */ jsx("img", {
					src: item.logoUrl,
					alt: item.name,
					className: "as-cjp-partner-logo"
				}),
				/* @__PURE__ */ jsx("span", {
					className: "as-cjp-partner-name",
					children: item.name
				}),
				item.downloadUrl && /* @__PURE__ */ jsx("a", {
					href: item.downloadUrl,
					target: item.external ? "_blank" : "_self",
					rel: "noopener noreferrer",
					className: "as-cjp-partner-dl",
					download: true,
					children: "Download"
				})
			]
		}, i))
	});
}
var CHANNEL_ICONS = {
	whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
	email: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
	phone: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
	facebook: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
	instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
	viber: "M11.4 0C5.9 0 1 4.6 1 10.2c0 3.1 1.5 5.9 3.9 7.7V21l3.5-1.9c.9.3 1.9.4 2.9.4 5.5 0 10.4-4.6 10.4-10.2C21.8 4.6 17 0 11.4 0zm1.1 13.7l-2.5-2.7-4.9 2.7 5.4-5.7 2.6 2.7 4.8-2.7-5.4 5.7z"
};
function ContactRenderer({ block }) {
	return /* @__PURE__ */ jsx("div", {
		className: "as-cjp-contact-channels",
		children: block.channels.map((ch, i) => /* @__PURE__ */ jsxs("a", {
			href: ch.url,
			target: "_blank",
			rel: "noopener noreferrer",
			className: `as-cjp-channel as-cjp-channel--${ch.kind}`,
			"aria-label": `${ch.kind}: ${ch.value}`,
			children: [/* @__PURE__ */ jsx("svg", {
				className: "as-cjp-channel-icon",
				viewBox: "0 0 24 24",
				fill: "currentColor",
				"aria-hidden": "true",
				children: /* @__PURE__ */ jsx("path", { d: CHANNEL_ICONS[ch.kind] ?? CHANNEL_ICONS.phone })
			}), /* @__PURE__ */ jsx("span", {
				className: "as-cjp-channel-value",
				children: ch.value
			})]
		}, i))
	});
}
var BLOCK_REGISTRY = {
	heading: ({ block }) => /* @__PURE__ */ jsx(HeadingRenderer, { block }),
	paragraph: ({ block }) => /* @__PURE__ */ jsx(ParagraphRenderer, { block }),
	bullet_list: ({ block }) => /* @__PURE__ */ jsx(BulletListRenderer, { block }),
	link_group: ({ block }) => /* @__PURE__ */ jsx(LinkGroupRenderer, { block }),
	button: ({ block }) => /* @__PURE__ */ jsx(ButtonRenderer, { block }),
	image: ({ block }) => /* @__PURE__ */ jsx(ImageRenderer, { block }),
	partner_grid: ({ block }) => /* @__PURE__ */ jsx(PartnerGridRenderer, { block }),
	contact_channels: ({ block }) => /* @__PURE__ */ jsx(ContactRenderer, { block }),
	divider: () => /* @__PURE__ */ jsx("hr", { className: "as-cjp-divider" })
};
function BlockRenderer({ block }) {
	return /* @__PURE__ */ jsx(BLOCK_REGISTRY[block.type] ?? (() => null), { block });
}
function StepContent({ step }) {
	const sorted = [...step.blocks].sort((a, b) => a.order - b.order);
	return /* @__PURE__ */ jsxs("div", {
		className: "as-cjp-panel-inner",
		children: [step.subheading && /* @__PURE__ */ jsx("h2", {
			className: "as-cjp-panel-subheading",
			children: step.subheading
		}), /* @__PURE__ */ jsx("div", {
			className: "as-cjp-blocks",
			children: sorted.map((block, i) => /* @__PURE__ */ jsx(BlockRenderer, { block }, i))
		})]
	});
}
function ASClientJourneyPage() {
	useSeoMeta({
		title: "Solar Installation Process in Bohol",
		description: "Learn how Azari Solar guides you from consultation to installation in Bohol. Transparent process, quality components, and full after-sales support across the Philippines.",
		canonical: "https://azari.solar/client-journey"
	});
	const [steps, setSteps] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openId, setOpenId] = useState(null);
	const [shownCount, setShownCount] = useState(0);
	const [spacerHeight, setSpacerHeight] = useState(0);
	const [panelTopOffset, setPanelTopOffset] = useState(0);
	const [connectorBottom, setConnectorBottom] = useState(34);
	const sectionRef = useRef(null);
	const stepsColRef = useRef(null);
	const mobileColRef = useRef(null);
	const hasAnimated = useRef(false);
	const alignRO = useRef(null);
	const connectorRO = useRef(null);
	const justOpenedRef = useRef(null);
	useEffect(() => {
		fetchClientJourney().then((data) => {
			setSteps(data);
			setLoading(false);
		});
	}, []);
	useEffect(() => {
		if (!steps.length) return;
		const el = sectionRef.current;
		if (!el) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setShownCount(steps.length);
			return;
		}
		if (hasAnimated.current) return;
		const timeouts = [];
		const triggerAnimation = () => {
			if (hasAnimated.current) return;
			hasAnimated.current = true;
			steps.forEach((_, i) => {
				timeouts.push(window.setTimeout(() => setShownCount(i + 1), (i + 1) * 800));
			});
		};
		const rect = el.getBoundingClientRect();
		const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
		let observer = null;
		if (inViewport) triggerAnimation();
		else {
			observer = new IntersectionObserver(([entry]) => {
				if (!entry.isIntersecting || hasAnimated.current) return;
				triggerAnimation();
				observer.disconnect();
				observer = null;
			}, {
				threshold: .1,
				rootMargin: "0px 0px -8% 0px"
			});
			observer.observe(el);
		}
		return () => {
			if (observer) observer.disconnect();
			timeouts.forEach(clearTimeout);
			hasAnimated.current = false;
		};
	}, [steps]);
	useEffect(() => {
		alignRO.current?.disconnect();
		alignRO.current = null;
		if (!openId) {
			setSpacerHeight(0);
			setPanelTopOffset(0);
			return;
		}
		let raf;
		raf = requestAnimationFrame(() => {
			const panelEl = document.getElementById(`cjp-panel-${openId}`);
			const stepEl = document.getElementById(`cjp-step-${openId}`);
			if (!panelEl || !stepEl) return;
			const update = () => {
				const rowH = stepEl.offsetHeight;
				let topOffset = 0;
				const colEl = stepsColRef.current;
				if (colEl) for (const row of colEl.querySelectorAll(".as-cjp-step-row")) {
					if (row.id === `cjp-step-${openId}`) break;
					topOffset += row.offsetHeight;
				}
				setPanelTopOffset(topOffset);
				setSpacerHeight(Math.max(0, panelEl.offsetHeight - rowH));
			};
			update();
			const ro = new ResizeObserver(update);
			ro.observe(panelEl);
			alignRO.current = ro;
		});
		return () => {
			cancelAnimationFrame(raf);
			alignRO.current?.disconnect();
			alignRO.current = null;
		};
	}, [openId]);
	useEffect(() => {
		connectorRO.current?.disconnect();
		connectorRO.current = null;
		if (!steps.length) return;
		const lastId = steps[steps.length - 1].id;
		const update = () => {
			const colEl = stepsColRef.current;
			const lastEl = document.getElementById(`cjp-step-${lastId}`);
			if (!colEl || !lastEl) return;
			const colRect = colEl.getBoundingClientRect();
			const iconCenterFromTop = lastEl.getBoundingClientRect().top - colRect.top + 34;
			setConnectorBottom(Math.max(0, colEl.offsetHeight - iconCenterFromTop));
		};
		const ro = new ResizeObserver(update);
		connectorRO.current = ro;
		const raf = requestAnimationFrame(() => {
			if (stepsColRef.current) {
				ro.observe(stepsColRef.current);
				update();
			}
		});
		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			connectorRO.current = null;
		};
	}, [steps]);
	const toggle = (id) => setOpenId((prev) => {
		if (prev === id) return null;
		justOpenedRef.current = id;
		return id;
	});
	useEffect(() => {
		if (!openId || justOpenedRef.current !== openId) return;
		justOpenedRef.current = null;
		const raf = requestAnimationFrame(() => {
			const desktopCol = stepsColRef.current;
			const mobileCol = mobileColRef.current;
			const col = desktopCol && desktopCol.offsetHeight > 0 ? desktopCol : mobileCol;
			if (!col) return;
			let offsetFromColTop = 0;
			for (const row of col.querySelectorAll(".as-cjp-step-row")) {
				if (row.id === `cjp-step-${openId}`) break;
				offsetFromColTop += row.offsetHeight;
			}
			const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--navbar-height")) || 75;
			const colTop = col.getBoundingClientRect().top + window.scrollY;
			const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			window.scrollTo({
				top: colTop + offsetFromColTop - navH,
				behavior: reduced ? "auto" : "smooth"
			});
		});
		return () => cancelAnimationFrame(raf);
	}, [openId]);
	const connectorPct = steps.length ? shownCount / steps.length * 100 : 0;
	const renderStepRow = (step, i, isActive, isShown) => {
		const idx = String(i + 1).padStart(2, "0");
		const accent = step.accentColor ?? "#fc615a";
		return /* @__PURE__ */ jsxs("button", {
			className: `as-cjp-step-row${isShown ? " is-shown" : ""}${isActive ? " is-active" : ""}`,
			style: isActive ? { "--step-accent": accent } : void 0,
			onClick: () => isShown && toggle(step.id),
			"aria-expanded": isActive,
			"aria-controls": `cjp-panel-${step.id}`,
			id: `cjp-step-${step.id}`,
			disabled: !isShown,
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "as-cjp-icon-chip",
					children: /* @__PURE__ */ jsx(JourneyIcon, {
						iconKey: step.iconKey,
						iconUrl: step.iconUrl,
						iconUrlHighlighted: step.iconUrlHighlighted,
						iconUrlLight: step.iconUrlLight,
						iconUrlLightHighlighted: step.iconUrlLightHighlighted,
						isActive
					})
				}),
				/* @__PURE__ */ jsx("span", {
					className: "as-cjp-step-index",
					children: idx
				}),
				/* @__PURE__ */ jsx("span", {
					className: "as-cjp-step-title",
					children: step.title
				}),
				/* @__PURE__ */ jsx("span", {
					className: "as-cjp-toggle",
					"aria-hidden": "true",
					children: isActive ? "−" : "+"
				})
			]
		}, step.id);
	};
	if (loading) return /* @__PURE__ */ jsx("section", {
		className: "as-cjp as-cjp--loading",
		children: /* @__PURE__ */ jsxs("div", {
			className: "as-cjp-container",
			children: [/* @__PURE__ */ jsx("div", { className: "as-cjp-skeleton-header" }), [...Array(7)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "as-cjp-skeleton-row" }, i))]
		})
	});
	return /* @__PURE__ */ jsxs("section", {
		ref: sectionRef,
		className: "as-cjp",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "as-cjp-container",
			children: [
				/* @__PURE__ */ jsxs("header", {
					className: "as-cjp-header",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "as-cjp-title",
						children: "Our Client Journey"
					}), /* @__PURE__ */ jsx("p", {
						className: "as-cjp-subtitle",
						children: "A streamlined step-by-step process designed to guide you from initial consultation to long-term energy independence."
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "as-cjp-desktop",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "as-cjp-steps-col",
						ref: stepsColRef,
						children: [/* @__PURE__ */ jsxs("div", {
							className: "as-cjp-connector",
							style: { bottom: connectorBottom },
							children: [/* @__PURE__ */ jsx("div", { className: "as-cjp-connector-track" }), /* @__PURE__ */ jsx("div", {
								className: "as-cjp-connector-bar",
								style: { height: `${connectorPct}%` }
							})]
						}), steps.map((step, i) => /* @__PURE__ */ jsxs("div", {
							className: "as-cjp-step-wrap",
							children: [renderStepRow(step, i, openId === step.id, i < shownCount), /* @__PURE__ */ jsx("div", {
								className: "as-cjp-row-spacer",
								style: { height: openId === step.id ? spacerHeight : 0 },
								"aria-hidden": "true"
							})]
						}, step.id))]
					}), /* @__PURE__ */ jsx("div", {
						className: "as-cjp-panel-col",
						style: { marginTop: panelTopOffset },
						children: steps.map((step) => /* @__PURE__ */ jsx("div", {
							id: `cjp-panel-${step.id}`,
							className: `as-cjp-panel${openId === step.id ? " is-active" : ""}`,
							role: "region",
							"aria-labelledby": `cjp-step-${step.id}`,
							children: /* @__PURE__ */ jsx(StepContent, { step })
						}, step.id))
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "as-cjp-mobile",
					ref: mobileColRef,
					children: steps.map((step, i) => {
						const isActive = openId === step.id;
						const isShown = i < shownCount;
						return /* @__PURE__ */ jsxs("div", {
							className: `as-cjp-mobile-item${isShown ? " is-shown" : ""}`,
							children: [renderStepRow(step, i, isActive, isShown), /* @__PURE__ */ jsx("div", {
								id: `cjp-panel-mob-${step.id}`,
								className: `as-cjp-mobile-panel${isActive ? " is-open" : ""}`,
								role: "region",
								"aria-labelledby": `cjp-step-${step.id}`,
								children: /* @__PURE__ */ jsx("div", {
									className: "as-cjp-mobile-panel-inner",
									children: /* @__PURE__ */ jsx(StepContent, { step })
								})
							})]
						}, step.id);
					})
				})
			]
		}), /* @__PURE__ */ jsx(ASCallToAction, {})]
	});
}
//#endregion
//#region app/routes/client-journey.tsx
var client_journey_exports = /* @__PURE__ */ __exportAll({
	default: () => client_journey_default,
	meta: () => meta$2
});
var meta$2 = () => [
	{ title: "Your Solar Journey — Azari Solar" },
	{
		name: "description",
		content: "Learn how Azari Solar guides you through every step of your solar journey — from consultation and design to installation and commissioning."
	},
	{
		name: "robots",
		content: "index, follow"
	},
	{
		tagName: "link",
		rel: "canonical",
		href: "https://azari.solar/client-journey"
	},
	{
		property: "og:type",
		content: "website"
	},
	{
		property: "og:url",
		content: "https://azari.solar/client-journey"
	},
	{
		property: "og:title",
		content: "Your Solar Journey — Azari Solar"
	},
	{
		property: "og:description",
		content: "Learn how Azari Solar guides you from consultation to installation."
	},
	{
		property: "og:image",
		content: "https://azari.solar/preview.jpg"
	},
	{
		name: "twitter:card",
		content: "summary_large_image"
	},
	{
		name: "twitter:title",
		content: "Your Solar Journey — Azari Solar"
	},
	{
		name: "twitter:description",
		content: "Learn how Azari Solar guides you from consultation to installation."
	},
	{
		name: "twitter:image",
		content: "https://azari.solar/preview.jpg"
	}
];
var client_journey_default = UNSAFE_withComponentProps(function ClientJourney() {
	return /* @__PURE__ */ jsx(ASClientJourneyPage, {});
});
//#endregion
//#region app/routes/sitemap-xml.tsx
var sitemap_xml_exports = /* @__PURE__ */ __exportAll({ loader: () => loader$1 });
var API_BASE = process.env["API_URL"] ?? "http://localhost:4000";
var STATIC_URLS = [
	{
		loc: "https://azari.solar/",
		priority: "1.0",
		changefreq: "weekly"
	},
	{
		loc: "https://azari.solar/packages",
		priority: "0.9",
		changefreq: "weekly"
	},
	{
		loc: "https://azari.solar/projects",
		priority: "0.8",
		changefreq: "weekly"
	},
	{
		loc: "https://azari.solar/solar-calculator",
		priority: "0.8",
		changefreq: "monthly"
	},
	{
		loc: "https://azari.solar/client-journey",
		priority: "0.7",
		changefreq: "monthly"
	}
];
async function loader$1() {
	let projects = [];
	try {
		const res = await fetch(`${API_BASE}/api/projects`, { headers: { Accept: "application/json" } });
		if (res.ok) {
			const json = await res.json();
			projects = Array.isArray(json) ? json : json.data ?? [];
		}
	} catch {}
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const projectUrls = projects.map((p) => {
		return `  <url>\n    <loc>https://azari.solar/projects/${p._id ?? p.id ?? ""}</loc>\n    <lastmod>${p.updatedAt ? p.updatedAt.slice(0, 10) : today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`;
	});
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...STATIC_URLS.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`), ...projectUrls].join("\n")}\n</urlset>`;
	return new Response(xml, {
		status: 200,
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600"
		}
	});
}
//#endregion
//#region src/components/ASNotFound.tsx
function ASNotFound() {
	const navigate = useNavigate();
	return /* @__PURE__ */ jsx("section", {
		className: "as-not-found",
		children: /* @__PURE__ */ jsxs("div", {
			className: "as-not-found-card",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "as-not-found-visual",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "as-not-found-sun",
							children: /* @__PURE__ */ jsx("span", {})
						}),
						/* @__PURE__ */ jsx("div", { className: "as-not-found-orbit as-not-found-orbit-one" }),
						/* @__PURE__ */ jsx("div", { className: "as-not-found-orbit as-not-found-orbit-two" }),
						/* @__PURE__ */ jsx("div", {
							className: "as-not-found-energy-path",
							children: /* @__PURE__ */ jsx("span", { className: "as-not-found-energy-dot" })
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "as-not-found-panel-array",
							children: [
								/* @__PURE__ */ jsx("i", {}),
								/* @__PURE__ */ jsx("i", {}),
								/* @__PURE__ */ jsx("i", {}),
								/* @__PURE__ */ jsx("i", {})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "as-not-found-storage-unit",
							children: [/* @__PURE__ */ jsx("span", { className: "as-not-found-storage-cap" }), /* @__PURE__ */ jsx("span", { className: "as-not-found-storage-level" })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "as-not-found-home-link",
							children: [
								/* @__PURE__ */ jsx("span", { className: "as-not-found-home-roof" }),
								/* @__PURE__ */ jsx("span", { className: "as-not-found-home-body" }),
								/* @__PURE__ */ jsx("span", { className: "as-not-found-home-window" })
							]
						})
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "as-not-found-eyebrow",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h1", { children: "Page not found" }),
				/* @__PURE__ */ jsx("p", { children: "The link you opened does not exist on this site. Go back home or use the navigation to continue browsing." }),
				/* @__PURE__ */ jsxs("div", {
					className: "as-not-found-actions",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => navigate("/"),
						children: "Back to Home"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "secondary",
						onClick: () => navigate("/projects"),
						children: "View Projects"
					})]
				})
			]
		})
	});
}
//#endregion
//#region app/routes/$.tsx
var $_exports = /* @__PURE__ */ __exportAll({
	default: () => $_default,
	meta: () => meta$1
});
var meta$1 = () => [{ title: "Page Not Found — Azari Solar" }, {
	name: "robots",
	content: "noindex"
}];
var $_default = UNSAFE_withComponentProps(function CatchAll() {
	return /* @__PURE__ */ jsx(ASNotFound, {});
});
//#endregion
//#region src/pages/ASAdmin.tsx
var DEFAULT_VISIBILITY = {
	hero: true,
	metrics: true,
	benefits: true,
	excellence: true,
	tropics: true,
	process: true,
	clientJourney: true,
	calculator: true,
	callToAction: true,
	packages: true
};
function fmt(iso) {
	return new Date(iso).toLocaleDateString("en-PH", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function statusClass(s) {
	if (s === "emailed") return "is-emailed";
	if (s === "email_failed") return "is-failed";
	if (s === "archived") return "is-archived";
	return "is-received";
}
function Toast({ msg }) {
	if (!msg) return null;
	const isSuccess = msg.startsWith("✓");
	const bgColor = isSuccess ? "rgba(34, 197, 94, 0.15)" : "rgba(252, 97, 90, 0.15)";
	const borderColor = isSuccess ? "rgba(34, 197, 94, 0.4)" : "rgba(252, 97, 90, 0.4)";
	const textColor = isSuccess ? "#22c55e" : "#fc615a";
	return /* @__PURE__ */ jsx("div", {
		style: {
			position: "fixed",
			top: "50%",
			left: "50%",
			transform: "translate(-50%, -50%)",
			zIndex: 1e4,
			background: bgColor,
			border: `1px solid ${borderColor}`,
			color: textColor,
			padding: "14px 20px",
			borderRadius: 8,
			fontSize: 14,
			fontWeight: 500,
			display: "flex",
			alignItems: "center",
			gap: 8,
			animation: "fadeIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
			maxWidth: "90vw",
			minWidth: "250px",
			textAlign: "center",
			justifyContent: "center",
			backdropFilter: "none"
		},
		children: msg
	});
}
function scrollToFirstError() {
	requestAnimationFrame(() => {
		const el = document.querySelector("[data-field-error]");
		if (el) el.scrollIntoView({
			behavior: "smooth",
			block: "center"
		});
	});
}
function ConfirmDeleteModal({ open, title, description, onConfirm, onCancel, confirming }) {
	useEffect(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") onCancel();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onCancel]);
	if (!open) return null;
	return createPortal(/* @__PURE__ */ jsx("div", {
		className: "ad-confirm-backdrop",
		onClick: onCancel,
		children: /* @__PURE__ */ jsxs("div", {
			className: "ad-confirm-panel",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "ad-confirm-icon",
					children: "🗑"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "ad-confirm-title",
					children: title
				}),
				description && /* @__PURE__ */ jsx("div", {
					className: "ad-confirm-desc",
					children: description
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "ad-confirm-actions",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: onCancel,
						className: "ad-btn ad-btn--ghost",
						children: "Cancel"
					}), /* @__PURE__ */ jsx("button", {
						onClick: onConfirm,
						disabled: confirming,
						className: "ad-btn ad-btn--danger",
						children: confirming ? "Deleting…" : "Delete"
					})]
				})
			]
		})
	}), document.body);
}
function AdminModal({ open, onClose, title, subtitle, children, maxWidth }) {
	useEffect(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);
	if (!open) return null;
	return createPortal(/* @__PURE__ */ jsx("div", {
		className: "ad-modal-backdrop",
		onClick: onClose,
		children: /* @__PURE__ */ jsxs("div", {
			className: "ad-modal-panel",
			style: { maxWidth: maxWidth ?? 640 },
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ jsxs("div", {
				className: "ad-modal-header",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "ad-modal-title",
					children: title
				}), subtitle && /* @__PURE__ */ jsx("div", {
					className: "ad-modal-subtitle",
					children: subtitle
				})] }), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "ad-modal-close",
					"aria-label": "Close",
					children: "✕"
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "ad-modal-body",
				children
			})]
		})
	}), document.body);
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ jsx("span", {
		className: `ad-badge ${statusClass(status)}`,
		children: status.replace(/_/g, " ")
	});
}
function LoginScreen({ onLogin, error }) {
	const [value, setValue] = useState("");
	const [localError, setLocalError] = useState("");
	const handleSubmit = (e) => {
		e.preventDefault();
		const trimmed = value.trim();
		if (!trimmed) {
			setLocalError("API key is required.");
			return;
		}
		onLogin(trimmed);
	};
	return /* @__PURE__ */ jsx("div", {
		className: "ad-login-wrap",
		children: /* @__PURE__ */ jsxs("div", {
			className: "ad-login-card",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "ad-login-logo",
					children: ["azari", /* @__PURE__ */ jsx("span", { children: ".solar" })]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "ad-login-sub",
					children: "Admin Panel"
				}),
				(localError || error) && /* @__PURE__ */ jsx("div", {
					className: "ad-login-error",
					children: localError || error
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					children: [
						/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Admin API Key"
						}),
						/* @__PURE__ */ jsx("input", {
							type: "password",
							className: "ad-input",
							value,
							onChange: (e) => {
								setValue(e.target.value);
								setLocalError("");
							},
							placeholder: "Enter your admin API key",
							style: { marginBottom: 20 }
						}),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "ad-btn",
							style: { width: "100%" },
							children: "Sign In"
						})
					]
				})
			]
		})
	});
}
function MiniBarChart({ data, color, label }) {
	const maxCount = Math.max(1, ...data.map((d) => d.count));
	const barHeight = 40;
	const barWidth = Math.max(2, 360 / Math.max(1, data.length));
	const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	return /* @__PURE__ */ jsxs("div", {
		style: { marginBottom: 24 },
		children: [/* @__PURE__ */ jsx("div", {
			style: {
				fontSize: 12,
				fontWeight: 600,
				color: "var(--ad-text)",
				marginBottom: 8
			},
			children: label
		}), /* @__PURE__ */ jsx("svg", {
			width: "100%",
			height: "80",
			viewBox: "0 0 380 80",
			style: {
				border: "1px solid var(--ad-border)",
				borderRadius: 8,
				padding: 8,
				background: "var(--ad-input-bg)"
			},
			children: data.map((d, i) => {
				const normalizedHeight = d.count / maxCount * barHeight;
				const x = i * barWidth + 2;
				const y = 60 - normalizedHeight;
				const isToday = d.day === today;
				return /* @__PURE__ */ jsx("g", { children: /* @__PURE__ */ jsx("rect", {
					x,
					y,
					width: Math.max(1, barWidth - 1),
					height: normalizedHeight,
					fill: isToday ? color : `${color}80`,
					rx: "2"
				}) }, d.day);
			})
		})]
	});
}
function OverviewTab({ stats }) {
	if (!stats) return /* @__PURE__ */ jsx("div", {
		style: {
			color: "var(--ad-text2)",
			padding: 24
		},
		children: "Loading stats…"
	});
	const emailFailures = (stats.talkInquiries.byStatus.email_failed ?? 0) + (stats.quotations.byStatus.email_failed ?? 0);
	const contacted = stats.packageInquiries.byStatus.contacted ?? 0;
	const converted = stats.packageInquiries.byStatus.converted ?? 0;
	const newPkgs = stats.packageInquiries.byStatus.new ?? 0;
	const pkgConversionRate = contacted + converted > 0 ? Math.round(converted / (newPkgs + contacted + converted) * 100) : 0;
	const recentAll = [
		...stats.recent.talkInquiries.map((r) => ({
			type: "TALK",
			name: r.name,
			email: r.email,
			meta: r.inquiryType,
			status: r.status,
			date: r.createdAt
		})),
		...stats.recent.quotations.map((r) => ({
			type: "QUOTE",
			name: r.fullName,
			email: r.email,
			meta: r.estimatedSystemSizeDisplayText,
			status: r.status,
			date: r.createdAt
		})),
		...stats.recent.packageInquiries.map((r) => ({
			type: "PKG",
			name: r.name,
			email: r.email,
			meta: r.packageName,
			status: r.status,
			date: r.createdAt
		}))
	].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx("div", {
			className: "ad-stats-grid",
			children: [
				{
					label: "Talk Inquiries",
					value: stats.totals.talkInquiries,
					cls: "is-accent"
				},
				{
					label: "Quotations",
					value: stats.totals.quotations,
					cls: ""
				},
				{
					label: "Package Inquiries",
					value: stats.totals.packageInquiries,
					cls: "is-accent"
				},
				{
					label: "Active Packages",
					value: stats.totals.activePackages,
					cls: ""
				},
				{
					label: "Projects",
					value: stats.totals.projects,
					cls: ""
				},
				{
					label: "Email Failures",
					value: emailFailures,
					cls: emailFailures > 0 ? "is-danger" : ""
				}
			].map((card) => /* @__PURE__ */ jsxs("div", {
				className: "ad-stat-card",
				children: [/* @__PURE__ */ jsx("div", {
					className: "ad-stat-label",
					children: card.label
				}), /* @__PURE__ */ jsx("div", {
					className: `ad-stat-value ${card.cls}`,
					children: card.value
				})]
			}, card.label))
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "ad-card",
			style: {
				marginTop: 24,
				padding: "20px"
			},
			children: [/* @__PURE__ */ jsx("div", {
				className: "ad-card-title",
				children: "30-Day Activity"
			}), /* @__PURE__ */ jsxs("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "1fr 1fr 1fr",
					gap: 20,
					marginTop: 20
				},
				children: [
					/* @__PURE__ */ jsx(MiniBarChart, {
						data: stats.trend30d.talk,
						color: "#3b82f6",
						label: "Talk Inquiries"
					}),
					/* @__PURE__ */ jsx(MiniBarChart, {
						data: stats.trend30d.quotations,
						color: "#f59e0b",
						label: "Quotations"
					}),
					/* @__PURE__ */ jsx(MiniBarChart, {
						data: stats.trend30d.packages,
						color: "#22c55e",
						label: "Package Inquiries"
					})
				]
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			style: {
				display: "grid",
				gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
				gap: 20,
				marginTop: 24
			},
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "ad-card",
					children: [/* @__PURE__ */ jsx("div", {
						className: "ad-card-title",
						children: "Talk Inquiries by Type"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							marginTop: 16,
							display: "flex",
							flexDirection: "column",
							gap: 12
						},
						children: Object.entries(stats.talkInquiries.byType).map(([type, count]) => {
							const total = stats.totals.talkInquiries || 1;
							const pct = Math.round(count / total * 100);
							return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								style: {
									fontSize: 12,
									color: "var(--ad-text3)",
									marginBottom: 4
								},
								children: [
									type,
									" (",
									count,
									")"
								]
							}), /* @__PURE__ */ jsx("div", {
								style: {
									height: 6,
									background: "var(--ad-border)",
									borderRadius: 3,
									overflow: "hidden"
								},
								children: /* @__PURE__ */ jsx("div", { style: {
									height: "100%",
									width: `${pct}%`,
									background: "#3b82f6"
								} })
							})] }, type);
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "ad-card",
					children: [/* @__PURE__ */ jsx("div", {
						className: "ad-card-title",
						children: "Quotations by Mode"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							marginTop: 16,
							display: "flex",
							flexDirection: "column",
							gap: 12
						},
						children: Object.entries(stats.quotations.byMode).map(([mode, count]) => {
							const total = stats.totals.quotations || 1;
							const pct = Math.round(count / total * 100);
							return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								style: {
									fontSize: 12,
									color: "var(--ad-text3)",
									marginBottom: 4
								},
								children: [
									mode === "with_bill" ? "With Bill" : "No Bill",
									" (",
									count,
									")"
								]
							}), /* @__PURE__ */ jsx("div", {
								style: {
									height: 6,
									background: "var(--ad-border)",
									borderRadius: 3,
									overflow: "hidden"
								},
								children: /* @__PURE__ */ jsx("div", { style: {
									height: "100%",
									width: `${pct}%`,
									background: "#f59e0b"
								} })
							})] }, mode);
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "ad-card",
					children: [/* @__PURE__ */ jsx("div", {
						className: "ad-card-title",
						children: "Package Inquiry Funnel"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							marginTop: 16,
							display: "flex",
							flexDirection: "column",
							gap: 12
						},
						children: [
							"new",
							"contacted",
							"converted"
						].map((stage) => {
							const count = stats.packageInquiries.byStatus[stage] ?? 0;
							const total = stats.totals.packageInquiries || 1;
							const pct = Math.round(count / total * 100);
							return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								style: {
									fontSize: 12,
									color: "var(--ad-text3)",
									marginBottom: 4
								},
								children: [
									stage.charAt(0).toUpperCase() + stage.slice(1),
									" (",
									count,
									") ",
									stage === "converted" && `${pkgConversionRate}%`
								]
							}), /* @__PURE__ */ jsx("div", {
								style: {
									height: 6,
									background: "var(--ad-border)",
									borderRadius: 3,
									overflow: "hidden"
								},
								children: /* @__PURE__ */ jsx("div", { style: {
									height: "100%",
									width: `${pct}%`,
									background: "#22c55e"
								} })
							})] }, stage);
						})
					})]
				})
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "ad-card",
			style: { marginTop: 24 },
			children: [/* @__PURE__ */ jsx("div", {
				className: "ad-card-title",
				children: "Recent Activity (All Sources)"
			}), /* @__PURE__ */ jsx("div", {
				style: { marginTop: 16 },
				children: recentAll.slice(0, 10).map((r, i) => /* @__PURE__ */ jsxs("div", {
					className: "ad-recent-row",
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							gap: 12,
							alignItems: "center",
							flex: 1
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: {
								fontSize: 10,
								fontWeight: 700,
								padding: "2px 8px",
								borderRadius: 4,
								background: r.type === "TALK" ? "#3b82f6" : r.type === "QUOTE" ? "#f59e0b" : "#22c55e",
								color: "white",
								minWidth: 40
							},
							children: r.type
						}), /* @__PURE__ */ jsxs("div", {
							style: { flex: 1 },
							children: [/* @__PURE__ */ jsx("div", {
								className: "ad-recent-name",
								children: r.name
							}), /* @__PURE__ */ jsxs("div", {
								className: "ad-recent-meta",
								children: [
									r.email,
									" · ",
									r.meta
								]
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "ad-recent-footer",
						children: [/* @__PURE__ */ jsx("span", {
							className: "ad-recent-date",
							children: fmt(r.date)
						}), /* @__PURE__ */ jsx(StatusBadge, { status: r.status })]
					})]
				}, i))
			})]
		})
	] });
}
function EmailStatusIndicator({ status, id, onRetry, retrying }) {
	if (status === "emailed") return /* @__PURE__ */ jsx("div", {
		className: "ad-email-status is-sent",
		children: "✓ Email sent"
	});
	if (status === "email_failed") return /* @__PURE__ */ jsxs("div", {
		className: "ad-email-status is-failed",
		style: {
			display: "flex",
			alignItems: "center",
			gap: 6
		},
		children: ["✗ Email failed", /* @__PURE__ */ jsx("button", {
			onClick: () => onRetry(id),
			disabled: retrying,
			className: "ad-btn ad-btn--sm ad-btn--secondary",
			children: retrying ? "…" : "Retry"
		})]
	});
	if (status === "received") return /* @__PURE__ */ jsx("div", {
		className: "ad-email-status is-pending",
		children: "Pending email"
	});
	return null;
}
var PROJECT_STATUS_OPTIONS = [
	{
		value: "new",
		label: "New"
	},
	{
		value: "site_assessment",
		label: "Site Assessment"
	},
	{
		value: "proposal_sent",
		label: "Proposal Sent"
	},
	{
		value: "ongoing",
		label: "Ongoing"
	},
	{
		value: "completed",
		label: "Completed"
	}
];
var PROJECT_STATUS_COLORS = {
	new: "var(--ad-text3)",
	site_assessment: "#f59e0b",
	proposal_sent: "#3b82f6",
	ongoing: "#a855f7",
	completed: "#22c55e"
};
function fmtRef(id, type) {
	return `${type === "talk" ? "INQ" : "QUO"}-${id.slice(0, 8).toUpperCase()}`;
}
function SubmissionsTable({ apiKey, type }) {
	const [data, setData] = useState([]);
	const [total, setTotal] = useState(0);
	const [offset, setOffset] = useState(0);
	const [statusFilter, setStatusFilter] = useState("");
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [loading, setLoading] = useState(false);
	const [updating, setUpdating] = useState(null);
	const [updatingProject, setUpdatingProject] = useState(null);
	const [retrying, setRetrying] = useState(null);
	const [deleting, setDeleting] = useState(null);
	const [editingRow, setEditingRow] = useState(null);
	const [editForm, setEditForm] = useState({});
	const [editSaving, setEditSaving] = useState(false);
	const [editMsg, setEditMsg] = useState("");
	const [editErrors, setEditErrors] = useState({});
	const clearEditErr = (f) => setEditErrors((p) => {
		const c = { ...p };
		delete c[f];
		return c;
	});
	const [previewRow, setPreviewRow] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const limit = 20;
	useEffect(() => {
		const t = window.setTimeout(() => setDebouncedSearch(search), 350);
		return () => clearTimeout(t);
	}, [search]);
	const load = async () => {
		setLoading(true);
		try {
			const res = await (type === "talk" ? adminGetTalkInquiries : adminGetQuotations)(apiKey, {
				limit,
				offset,
				status: statusFilter || void 0,
				search: debouncedSearch || void 0
			});
			setData(res.data);
			setTotal(res.total);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		load();
	}, [
		offset,
		statusFilter,
		debouncedSearch
	]);
	const handleStatusChange = async (id, status) => {
		setUpdating(id);
		try {
			await (type === "talk" ? adminUpdateTalkStatus : adminUpdateQuotationStatus)(apiKey, id, status);
			await load();
		} finally {
			setUpdating(null);
		}
	};
	const handleProjectStatusChange = async (id, projectStatus) => {
		setUpdatingProject(id);
		try {
			await (type === "talk" ? adminUpdateTalkProjectStatus : adminUpdateQuotationProjectStatus)(apiKey, id, projectStatus);
			setData((prev) => prev.map((r) => r.id === id ? {
				...r,
				projectStatus
			} : r));
		} catch (e) {
			setEditMsg(`Failed: ${e.message}`);
		} finally {
			setUpdatingProject(null);
		}
	};
	const handleRetryEmail = async (id) => {
		setRetrying(id);
		try {
			await (type === "talk" ? adminRetryTalkEmail : adminRetryQuotationEmail)(apiKey, id);
			await load();
		} finally {
			setRetrying(null);
		}
	};
	const handleDelete = async () => {
		if (!deleteTarget) return;
		setDeleting(deleteTarget);
		try {
			await (type === "talk" ? adminDeleteTalkInquiry : adminDeleteQuotation)(apiKey, deleteTarget);
			await load();
		} catch (e) {
			setEditMsg(`Delete failed: ${e.message}`);
		} finally {
			setDeleting(null);
			setDeleteTarget(null);
		}
	};
	const openEdit = (row) => {
		setEditingRow(row);
		setEditMsg("");
		if (type === "talk") setEditForm({
			name: String(row.name ?? ""),
			email: String(row.email ?? ""),
			phone: String(row.phone ?? ""),
			province: String(row.province ?? ""),
			city: String(row.city ?? ""),
			inquiryType: String(row.inquiryType ?? "general"),
			message: String(row.message ?? "")
		});
		else setEditForm({
			fullName: String(row.fullName ?? ""),
			email: String(row.email ?? ""),
			phone: String(row.phone ?? ""),
			location: String(row.location ?? ""),
			propertyClassification: String(row.propertyClassification ?? ""),
			message: String(row.message ?? "")
		});
	};
	const handleEditSave = async () => {
		if (!editingRow) return;
		const errs = {};
		const nameKey = type === "talk" ? "name" : "fullName";
		if (!editForm[nameKey]?.trim()) errs[nameKey] = "Name is required.";
		const email = editForm.email?.trim() ?? "";
		if (!email) errs.email = "Email is required.";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address.";
		if (Object.keys(errs).length > 0) {
			setEditErrors(errs);
			scrollToFirstError();
			return;
		}
		setEditErrors({});
		setEditSaving(true);
		setEditMsg("");
		try {
			await (type === "talk" ? adminUpdateTalkInquiry : adminUpdateQuotation)(apiKey, editingRow.id, editForm);
			setEditingRow(null);
			await load();
		} catch (e) {
			setEditMsg(`Error: ${e.message}`);
		} finally {
			setEditSaving(false);
		}
	};
	const STATUS_OPTIONS = [
		"received",
		"emailed",
		"email_failed",
		"archived"
	];
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "ad-filter-bar",
			children: [
				/* @__PURE__ */ jsx("input", {
					type: "search",
					className: "ad-input",
					style: {
						flex: 1,
						minWidth: 0,
						maxWidth: 280
					},
					placeholder: `Search by ref (${type === "talk" ? "INQ-" : "QUO-"}...), name or email`,
					value: search,
					onChange: (e) => {
						setSearch(e.target.value);
						setOffset(0);
					}
				}),
				/* @__PURE__ */ jsxs("select", {
					className: "ad-select",
					style: { width: "auto" },
					value: statusFilter,
					onChange: (e) => {
						setStatusFilter(e.target.value);
						setOffset(0);
					},
					children: [/* @__PURE__ */ jsx("option", {
						value: "",
						children: "All Email Statuses"
					}), STATUS_OPTIONS.map((s) => /* @__PURE__ */ jsx("option", {
						value: s,
						children: s.replace(/_/g, " ")
					}, s))]
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "ad-filter-count",
					children: [total, " records"]
				})
			]
		}),
		/* @__PURE__ */ jsx(ConfirmDeleteModal, {
			open: !!deleteTarget,
			title: "Delete this record?",
			description: "This will permanently remove the record and cannot be undone.",
			onConfirm: () => void handleDelete(),
			onCancel: () => setDeleteTarget(null),
			confirming: !!deleting
		}),
		/* @__PURE__ */ jsxs(AdminModal, {
			open: !!editingRow,
			onClose: () => {
				setEditingRow(null);
				setEditMsg("");
				setEditErrors({});
			},
			title: `Edit ${type === "talk" ? "Talk Inquiry" : "Quotation Request"}`,
			children: [/* @__PURE__ */ jsx("div", {
				className: "ad-form-grid",
				children: type === "talk" ? /* @__PURE__ */ jsxs(Fragment, { children: [
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Name *"
						}),
						/* @__PURE__ */ jsx("input", {
							className: `ad-input${editErrors.name ? " ad-input--error" : ""}`,
							value: editForm.name ?? "",
							onChange: (e) => {
								setEditForm((f) => ({
									...f,
									name: e.target.value
								}));
								clearEditErr("name");
							}
						}),
						editErrors.name && /* @__PURE__ */ jsx("span", {
							className: "ad-field-error",
							"data-field-error": true,
							children: editErrors.name
						})
					] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Email *"
						}),
						/* @__PURE__ */ jsx("input", {
							className: `ad-input${editErrors.email ? " ad-input--error" : ""}`,
							value: editForm.email ?? "",
							onChange: (e) => {
								setEditForm((f) => ({
									...f,
									email: e.target.value
								}));
								clearEditErr("email");
							}
						}),
						editErrors.email && /* @__PURE__ */ jsx("span", {
							className: "ad-field-error",
							"data-field-error": true,
							children: editErrors.email
						})
					] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Phone"
					}), /* @__PURE__ */ jsx("input", {
						className: "ad-input",
						value: editForm.phone ?? "",
						onChange: (e) => setEditForm((f) => ({
							...f,
							phone: e.target.value
						}))
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Inquiry Type"
					}), /* @__PURE__ */ jsxs("select", {
						className: "ad-select",
						value: editForm.inquiryType ?? "general",
						onChange: (e) => setEditForm((f) => ({
							...f,
							inquiryType: e.target.value
						})),
						children: [
							/* @__PURE__ */ jsx("option", {
								value: "general",
								children: "General"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "quote",
								children: "Quote"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "consultation",
								children: "Consultation"
							})
						]
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Province"
					}), /* @__PURE__ */ jsx("input", {
						className: "ad-input",
						value: editForm.province ?? "",
						onChange: (e) => setEditForm((f) => ({
							...f,
							province: e.target.value
						}))
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "City"
					}), /* @__PURE__ */ jsx("input", {
						className: "ad-input",
						value: editForm.city ?? "",
						onChange: (e) => setEditForm((f) => ({
							...f,
							city: e.target.value
						}))
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "ad-form-full",
						children: [/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Message"
						}), /* @__PURE__ */ jsx("textarea", {
							className: "ad-textarea",
							value: editForm.message ?? "",
							onChange: (e) => setEditForm((f) => ({
								...f,
								message: e.target.value
							}))
						})]
					})
				] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Full Name *"
						}),
						/* @__PURE__ */ jsx("input", {
							className: `ad-input${editErrors.fullName ? " ad-input--error" : ""}`,
							value: editForm.fullName ?? "",
							onChange: (e) => {
								setEditForm((f) => ({
									...f,
									fullName: e.target.value
								}));
								clearEditErr("fullName");
							}
						}),
						editErrors.fullName && /* @__PURE__ */ jsx("span", {
							className: "ad-field-error",
							"data-field-error": true,
							children: editErrors.fullName
						})
					] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Email *"
						}),
						/* @__PURE__ */ jsx("input", {
							className: `ad-input${editErrors.email ? " ad-input--error" : ""}`,
							value: editForm.email ?? "",
							onChange: (e) => {
								setEditForm((f) => ({
									...f,
									email: e.target.value
								}));
								clearEditErr("email");
							}
						}),
						editErrors.email && /* @__PURE__ */ jsx("span", {
							className: "ad-field-error",
							"data-field-error": true,
							children: editErrors.email
						})
					] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Phone"
					}), /* @__PURE__ */ jsx("input", {
						className: "ad-input",
						value: editForm.phone ?? "",
						onChange: (e) => setEditForm((f) => ({
							...f,
							phone: e.target.value
						}))
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Location"
					}), /* @__PURE__ */ jsx("input", {
						className: "ad-input",
						value: editForm.location ?? "",
						onChange: (e) => setEditForm((f) => ({
							...f,
							location: e.target.value
						}))
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "ad-form-full",
						children: [/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Property Classification"
						}), /* @__PURE__ */ jsx("input", {
							className: "ad-input",
							value: editForm.propertyClassification ?? "",
							onChange: (e) => setEditForm((f) => ({
								...f,
								propertyClassification: e.target.value
							}))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "ad-form-full",
						children: [/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Message"
						}), /* @__PURE__ */ jsx("textarea", {
							className: "ad-textarea",
							value: editForm.message ?? "",
							onChange: (e) => setEditForm((f) => ({
								...f,
								message: e.target.value
							}))
						})]
					})
				] })
			}), /* @__PURE__ */ jsxs("div", {
				className: "ad-form-actions",
				children: [/* @__PURE__ */ jsx("button", {
					onClick: () => void handleEditSave(),
					disabled: editSaving,
					className: "ad-btn",
					children: editSaving ? "Saving…" : "Save Changes"
				}), editMsg && /* @__PURE__ */ jsx(Toast, { msg: editMsg })]
			})]
		}),
		previewRow && /* @__PURE__ */ jsx(AdminModal, {
			open: !!previewRow,
			onClose: () => setPreviewRow(null),
			title: type === "talk" ? "Talk Inquiry Details" : "Quotation Request Details",
			subtitle: fmtRef(previewRow.id, type),
			children: type === "talk" ? /* @__PURE__ */ jsxs("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: "12px 20px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Reference"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)",
							fontFamily: "monospace"
						},
						children: fmtRef(previewRow.id, type)
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Date"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: fmt(previewRow.createdAt)
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Name"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewRow.name
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Email"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)",
							wordBreak: "break-all"
						},
						children: previewRow.email
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Phone"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewRow.phone || "—"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Location"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: [previewRow.city, previewRow.province].filter(Boolean).join(", ") || "—"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Inquiry Type"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewRow.inquiryType
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Email Status"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: /* @__PURE__ */ jsx(StatusBadge, { status: previewRow.status })
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Project Status"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: PROJECT_STATUS_COLORS[previewRow.projectStatus ?? "new"] ?? "var(--ad-text)"
						},
						children: PROJECT_STATUS_OPTIONS.find((o) => o.value === (previewRow.projectStatus ?? "new"))?.label ?? "New"
					})] }),
					/* @__PURE__ */ jsxs("div", {
						style: { gridColumn: "1 / -1" },
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontSize: 11,
								fontWeight: 700,
								color: "var(--ad-text3)",
								textTransform: "uppercase",
								letterSpacing: "0.07em",
								marginBottom: 3
							},
							children: "Message"
						}), /* @__PURE__ */ jsx("div", {
							style: {
								fontSize: 14,
								color: "var(--ad-text)",
								lineHeight: 1.6,
								whiteSpace: "pre-wrap"
							},
							children: previewRow.message || "—"
						})]
					})
				]
			}) : /* @__PURE__ */ jsxs("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: "12px 20px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Reference"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)",
							fontFamily: "monospace"
						},
						children: fmtRef(previewRow.id, type)
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Date"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: fmt(previewRow.createdAt)
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Name"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewRow.fullName
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Email"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)",
							wordBreak: "break-all"
						},
						children: previewRow.email
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Phone"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewRow.phone || "—"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Location"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewRow.location || "—"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Property Classification"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewRow.propertyClassification || "—"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "System Size"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewRow.estimatedSystemSizeDisplayText || "—"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Monthly Bill"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewRow.monthlyBill != null ? `₱${previewRow.monthlyBill.toLocaleString("en-PH")}` : "—"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Estimated Savings"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewRow.estimatedSavings || "—"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Configuration"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewRow.configuration || "—"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Email Status"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: /* @__PURE__ */ jsx(StatusBadge, { status: previewRow.status })
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Project Status"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: PROJECT_STATUS_COLORS[previewRow.projectStatus ?? "new"] ?? "var(--ad-text)"
						},
						children: PROJECT_STATUS_OPTIONS.find((o) => o.value === (previewRow.projectStatus ?? "new"))?.label ?? "New"
					})] }),
					/* @__PURE__ */ jsxs("div", {
						style: { gridColumn: "1 / -1" },
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontSize: 11,
								fontWeight: 700,
								color: "var(--ad-text3)",
								textTransform: "uppercase",
								letterSpacing: "0.07em",
								marginBottom: 3
							},
							children: "Message"
						}), /* @__PURE__ */ jsx("div", {
							style: {
								fontSize: 14,
								color: "var(--ad-text)",
								lineHeight: 1.6,
								whiteSpace: "pre-wrap"
							},
							children: previewRow.message || "—"
						})]
					})
				]
			})
		}),
		loading ? /* @__PURE__ */ jsx("div", {
			style: {
				color: "var(--ad-text2)",
				padding: 24
			},
			children: "Loading…"
		}) : /* @__PURE__ */ jsx("div", {
			className: "ad-table-wrap",
			children: /* @__PURE__ */ jsxs("table", {
				className: "ad-table",
				children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", { children: "Reference" }),
					type === "talk" ? /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsx("th", { children: "Name" }),
						/* @__PURE__ */ jsx("th", { children: "Email" }),
						/* @__PURE__ */ jsx("th", { children: "Location" }),
						/* @__PURE__ */ jsx("th", { children: "Type" })
					] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsx("th", { children: "Name" }),
						/* @__PURE__ */ jsx("th", { children: "Email" }),
						/* @__PURE__ */ jsx("th", { children: "System Size" }),
						/* @__PURE__ */ jsx("th", { children: "Property" })
					] }),
					/* @__PURE__ */ jsx("th", { children: "Date" }),
					/* @__PURE__ */ jsx("th", { children: "Email Status" }),
					/* @__PURE__ */ jsx("th", { children: "Project Status" }),
					/* @__PURE__ */ jsx("th", { children: "Actions" })
				] }) }), /* @__PURE__ */ jsx("tbody", { children: data.map((row) => /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", {
						style: {
							fontFamily: "monospace",
							fontSize: 12,
							background: "var(--ad-surface)",
							border: "1px solid var(--ad-border)",
							borderRadius: 5,
							padding: "2px 7px",
							color: "var(--ad-accent)",
							fontWeight: 700,
							letterSpacing: "0.06em",
							whiteSpace: "nowrap"
						},
						children: fmtRef(row.id, type)
					}) }),
					type === "talk" ? /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsx("td", { children: row.name }),
						/* @__PURE__ */ jsx("td", {
							style: { fontSize: 12 },
							children: row.email
						}),
						/* @__PURE__ */ jsx("td", {
							style: { fontSize: 12 },
							children: [row.city, row.province].filter(Boolean).join(", ")
						}),
						/* @__PURE__ */ jsx("td", { children: row.inquiryType })
					] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsx("td", { children: row.fullName }),
						/* @__PURE__ */ jsx("td", {
							style: { fontSize: 12 },
							children: row.email
						}),
						/* @__PURE__ */ jsx("td", { children: row.estimatedSystemSizeDisplayText }),
						/* @__PURE__ */ jsx("td", { children: row.propertyClassification })
					] }),
					/* @__PURE__ */ jsx("td", {
						style: { fontSize: 12 },
						children: fmt(row.createdAt)
					}),
					/* @__PURE__ */ jsxs("td", { children: [/* @__PURE__ */ jsx("select", {
						className: "ad-status-select",
						value: row.status,
						disabled: updating === row.id || retrying === row.id,
						onChange: (e) => void handleStatusChange(row.id, e.target.value),
						children: STATUS_OPTIONS.map((s) => /* @__PURE__ */ jsx("option", {
							value: s,
							children: s.replace(/_/g, " ")
						}, s))
					}), /* @__PURE__ */ jsx(EmailStatusIndicator, {
						status: row.status,
						id: row.id,
						onRetry: (id) => void handleRetryEmail(id),
						retrying: retrying === row.id
					})] }),
					/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("select", {
						className: "ad-status-select",
						value: row.projectStatus ?? "new",
						disabled: updatingProject === row.id,
						onChange: (e) => void handleProjectStatusChange(row.id, e.target.value),
						style: { color: PROJECT_STATUS_COLORS[row.projectStatus ?? "new"] ?? "inherit" },
						children: PROJECT_STATUS_OPTIONS.map((o) => /* @__PURE__ */ jsx("option", {
							value: o.value,
							style: { color: PROJECT_STATUS_COLORS[o.value] },
							children: o.label
						}, o.value))
					}) }),
					/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", {
						className: "ad-table-actions",
						children: [
							/* @__PURE__ */ jsx("button", {
								onClick: () => setPreviewRow(row),
								className: "ad-btn ad-btn--ghost ad-btn--sm",
								children: "View"
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: () => openEdit(row),
								disabled: !!editingRow || deleting === row.id,
								className: "ad-btn ad-btn--ghost ad-btn--sm",
								children: "Edit"
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: () => setDeleteTarget(row.id),
								disabled: deleting === row.id || !!editingRow,
								className: "ad-btn ad-btn--danger ad-btn--sm",
								style: { opacity: deleting === row.id ? .5 : 1 },
								children: deleting === row.id ? "…" : "Delete"
							})
						]
					}) })
				] }, row.id)) })]
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "ad-pagination",
			children: [
				/* @__PURE__ */ jsx("button", {
					onClick: () => setOffset(Math.max(0, offset - limit)),
					disabled: offset === 0,
					className: "ad-btn ad-btn--ghost ad-btn--sm",
					children: "← Prev"
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "ad-pagination-info",
					children: [
						Math.floor(offset / limit) + 1,
						" / ",
						Math.max(1, Math.ceil(total / limit))
					]
				}),
				/* @__PURE__ */ jsx("button", {
					onClick: () => setOffset(offset + limit),
					disabled: offset + limit >= total,
					className: "ad-btn ad-btn--ghost ad-btn--sm",
					children: "Next →"
				})
			]
		})
	] });
}
async function compressImageClient(file, maxW = 1200, maxH = 900, quality = .82) {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement("canvas");
				let { width, height } = img;
				const ratio = Math.min(1, maxW / width, maxH / height);
				canvas.width = Math.round(width * ratio);
				canvas.height = Math.round(height * ratio);
				canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
				resolve(canvas.toDataURL("image/webp", quality));
			};
			img.src = e.target.result;
		};
		reader.readAsDataURL(file);
	});
}
function emptySlotItem(index) {
	if (index === 0) return {
		cardType: "hero",
		title: "",
		accent: "#c84020"
	};
	return {
		cardType: "feature",
		title: ""
	};
}
function reindexSlots(items) {
	return items.map((item, i) => {
		if (i === 0 && item.cardType !== "hero") {
			const f = item;
			return {
				cardType: "hero",
				title: f.title,
				titleSource: f.titleSource,
				tag: f.tag,
				imageUrl: f.imageUrl,
				accent: "#c84020"
			};
		}
		if (i > 0 && item.cardType !== "feature") {
			const h = item;
			return {
				cardType: "feature",
				title: h.title,
				titleSource: h.titleSource,
				tag: h.tag,
				imageUrl: h.imageUrl
			};
		}
		return item;
	});
}
function isSlotEmpty(raw) {
	const title = String(raw.title ?? "").trim();
	const hasSystemSource = raw.titleSource?.type === "system";
	return !title && !hasSystemSource && !raw.imageUrl;
}
function normalizeBreakdownItems(items) {
	return reindexSlots(items.filter((raw) => raw["cardType"] !== "stat" && !isSlotEmpty(raw)).map((raw, i) => {
		if (i === 0) return {
			cardType: "hero",
			title: String(raw.title ?? ""),
			titleSource: raw.titleSource,
			badge: raw.badge,
			tag: raw.tag,
			imageUrl: raw.imageUrl,
			accent: raw.accent ?? "#c84020"
		};
		return {
			cardType: "feature",
			title: String(raw.title ?? ""),
			titleSource: raw.titleSource,
			description: raw.description,
			tag: raw.tag,
			imageUrl: raw.imageUrl
		};
	}));
}
function ColorInput({ value, onChange, defaultHex }) {
	const hex = value ?? defaultHex;
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "flex",
			gap: 6,
			alignItems: "center"
		},
		children: [/* @__PURE__ */ jsx("input", {
			type: "color",
			value: hex,
			onChange: (e) => onChange(e.target.value),
			style: {
				width: 36,
				height: 36,
				padding: 2,
				borderRadius: 6,
				border: "1px solid var(--ad-border)",
				cursor: "pointer",
				flexShrink: 0,
				background: "none"
			}
		}), /* @__PURE__ */ jsx("input", {
			className: "ad-input",
			value: hex,
			onChange: (e) => onChange(e.target.value),
			placeholder: defaultHex,
			style: { flex: 1 }
		})]
	});
}
function BentoImageUpload({ slotIndex, imageUrl, onUpload, onRemove }) {
	const id = `bd-img-${slotIndex}`;
	const ALLOWED = new Set([
		"image/jpeg",
		"image/png",
		"image/webp",
		"image/gif"
	]);
	const handle = (file) => {
		if (ALLOWED.has(file.type)) compressImageClient(file).then(onUpload);
	};
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "flex",
			gap: 10,
			alignItems: "center"
		},
		children: [/* @__PURE__ */ jsxs("div", {
			className: "ad-image-drop",
			style: {
				flex: 1,
				minHeight: 52,
				padding: "10px 14px",
				fontSize: 12
			},
			onClick: () => document.getElementById(id)?.click(),
			onDragOver: (e) => e.preventDefault(),
			onDrop: (e) => {
				e.preventDefault();
				const f = e.dataTransfer.files?.[0];
				if (f) handle(f);
			},
			children: [/* @__PURE__ */ jsx("input", {
				id,
				type: "file",
				accept: "image/jpeg,image/png,image/webp,image/gif",
				hidden: true,
				onChange: (e) => {
					const f = e.target.files?.[0];
					if (f) handle(f);
				}
			}), imageUrl ? "Image set — click to replace" : "Click or drop card image (optional)"]
		}), imageUrl && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("img", {
			src: imageUrl,
			alt: "Preview",
			style: {
				width: 52,
				height: 52,
				objectFit: "cover",
				borderRadius: 6,
				border: "1px solid var(--ad-border)",
				flexShrink: 0
			}
		}), /* @__PURE__ */ jsx("button", {
			className: "ad-btn ad-btn--ghost ad-btn--sm",
			onClick: onRemove,
			children: "Remove"
		})] })]
	});
}
var BENTO_SYSTEM_FIELD_LABELS = {
	loadKw: "Load Capacity",
	storageKwh: "Storage Capacity",
	productionKwp: "Production Capacity",
	savings: "Estimated Savings",
	electricalSystem: "Electrical System"
};
var BENTO_SYSTEM_FIELDS = Object.keys(BENTO_SYSTEM_FIELD_LABELS);
function BentoTitleSourcePicker({ item, onPatch, titlePlaceholder }) {
	const sourceType = item.titleSource?.type ?? "custom";
	const systemField = item.titleSource?.type === "system" ? item.titleSource.field : "productionKwp";
	return /* @__PURE__ */ jsxs("div", {
		style: { marginBottom: 8 },
		children: [/* @__PURE__ */ jsxs("div", {
			style: {
				display: "flex",
				alignItems: "center",
				gap: 6,
				marginBottom: 6
			},
			children: [/* @__PURE__ */ jsxs("label", {
				className: "ad-label",
				style: {
					margin: 0,
					flex: 1
				},
				children: ["Title ", /* @__PURE__ */ jsx("span", {
					style: { color: "var(--ad-danger, #ef4444)" },
					children: "*"
				})]
			}), /* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					gap: 4
				},
				children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					className: sourceType === "custom" ? "ad-btn ad-btn--sm" : "ad-btn ad-btn--ghost ad-btn--sm",
					style: {
						fontSize: 11,
						padding: "2px 8px",
						height: 24
					},
					onClick: () => onPatch({ titleSource: { type: "custom" } }),
					children: "Custom"
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: sourceType === "system" ? "ad-btn ad-btn--sm" : "ad-btn ad-btn--ghost ad-btn--sm",
					style: {
						fontSize: 11,
						padding: "2px 8px",
						height: 24
					},
					onClick: () => onPatch({ titleSource: {
						type: "system",
						field: systemField
					} }),
					children: "From project"
				})]
			})]
		}), sourceType === "system" ? /* @__PURE__ */ jsx("select", {
			className: "ad-select",
			value: systemField,
			onChange: (e) => onPatch({ titleSource: {
				type: "system",
				field: e.target.value
			} }),
			children: BENTO_SYSTEM_FIELDS.map((f) => /* @__PURE__ */ jsx("option", {
				value: f,
				children: BENTO_SYSTEM_FIELD_LABELS[f]
			}, f))
		}) : /* @__PURE__ */ jsx("input", {
			className: "ad-input",
			value: item.title,
			onChange: (e) => onPatch({ title: e.target.value }),
			placeholder: titlePlaceholder
		})]
	});
}
function HeroCardFields({ item, onPatch, slotIndex }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(BentoTitleSourcePicker, {
			item,
			onPatch,
			titlePlaceholder: "Headline (e.g. Advanced Solar Installation)"
		}),
		/* @__PURE__ */ jsxs("div", {
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gap: 8,
				marginBottom: 8
			},
			children: [/* @__PURE__ */ jsx("input", {
				className: "ad-input",
				value: item.tag ?? "",
				onChange: (e) => onPatch({ tag: e.target.value || void 0 }),
				placeholder: "Tag pill (e.g. INVERTER + BATTERY)"
			}), /* @__PURE__ */ jsx("input", {
				className: "ad-input",
				value: item.badge ?? "",
				onChange: (e) => onPatch({ badge: e.target.value || void 0 }),
				placeholder: "Badge (e.g. NEW)"
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			style: { marginBottom: 8 },
			children: [/* @__PURE__ */ jsx("label", {
				className: "ad-label",
				style: {
					fontSize: 10,
					marginBottom: 4
				},
				children: "Gradient accent colour"
			}), /* @__PURE__ */ jsx(ColorInput, {
				value: item.accent,
				onChange: (hex) => onPatch({ accent: hex }),
				defaultHex: "#c84020"
			})]
		}),
		/* @__PURE__ */ jsx(BentoImageUpload, {
			slotIndex,
			imageUrl: item.imageUrl,
			onUpload: (url) => onPatch({ imageUrl: url }),
			onRemove: () => onPatch({ imageUrl: void 0 })
		})
	] });
}
function FeatureCardFields({ item, onPatch, slotIndex }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(BentoTitleSourcePicker, {
			item,
			onPatch,
			titlePlaceholder: "Feature title (e.g. Grid-Tied System)"
		}),
		/* @__PURE__ */ jsx("textarea", {
			className: "ad-input",
			rows: 2,
			style: {
				marginBottom: 8,
				resize: "vertical",
				width: "100%"
			},
			value: item.description ?? "",
			onChange: (e) => onPatch({ description: e.target.value || void 0 }),
			placeholder: "Description (optional)"
		}),
		/* @__PURE__ */ jsx("input", {
			className: "ad-input",
			style: { marginBottom: 8 },
			value: item.tag ?? "",
			onChange: (e) => onPatch({ tag: e.target.value || void 0 }),
			placeholder: "Tag pill (e.g. SOLAR PANEL)"
		}),
		/* @__PURE__ */ jsx(BentoImageUpload, {
			slotIndex,
			imageUrl: item.imageUrl,
			onUpload: (url) => onPatch({ imageUrl: url }),
			onRemove: () => onPatch({ imageUrl: void 0 })
		})
	] });
}
var EMPTY_PROJECT_FORM = {
	title: "",
	subtitle: "",
	category: "Residential",
	categoryColor: "",
	system: "",
	savings: "",
	videoUrl: "",
	isRecent: false,
	sortOrder: 0,
	stats: [],
	performanceMetrics: [],
	technicalBreakdown: [],
	galleryImages: [],
	galleryImageNames: [],
	heroCards: [],
	testimonial: null,
	systemCardSubtext: "",
	savingsCardSubtext: "",
	electricalSystem: "Single-Phase",
	loadKw: "",
	productionKwp: "",
	storageKwh: ""
};
function buildSystemString(productionKwp, storageKwh, electricalSystem) {
	const kwp = productionKwp.trim();
	if (!kwp) return "";
	const storage = parseFloat(storageKwh) > 0;
	return `${kwp} kWp ${storage ? "Hybrid" : "On-Grid"}${storage ? ` (${storageKwh} kWh Storage)` : ""}${electricalSystem === "Three-Phase" ? " · 3-Phase" : ""}`;
}
function categoryClass(c) {
	if (c === "Commercial") return "is-commercial";
	if (c === "Industrial") return "is-industrial";
	return "is-residential";
}
var SECTION_REGISTRY = [
	{
		id: "basic",
		label: "Hero (Basic Info)",
		isComplete: (f) => !!f.title.trim() && !!f.productionKwp.trim() && !!f.savings.trim()
	},
	{
		id: "performance",
		label: "Performance & Resilience",
		isComplete: () => true
	},
	{
		id: "breakdown",
		label: "Technical Breakdown",
		isComplete: (f) => f.technicalBreakdown.length === 0 || f.technicalBreakdown.every((item) => !!item.title.trim() || item.titleSource?.type === "system")
	},
	{
		id: "gallery",
		label: "Gallery",
		isComplete: (f) => f.galleryImages.length > 0
	},
	{
		id: "testimonial",
		label: "Testimonial",
		isComplete: () => true
	}
];
var PREVIEW_FIELD_LABELS = {
	loadKw: "Load Capacity",
	storageKwh: "Storage Capacity",
	productionKwp: "Production Capacity",
	savings: "Estimated Savings",
	electricalSystem: "Electrical System"
};
function resolveFormFieldValue(form, field) {
	switch (field) {
		case "loadKw": return form.loadKw && parseFloat(form.loadKw) > 0 ? `${form.loadKw}kW` : null;
		case "storageKwh": return form.storageKwh && parseFloat(form.storageKwh) > 0 ? `${form.storageKwh}kWh` : null;
		case "productionKwp": return form.productionKwp && parseFloat(form.productionKwp) > 0 ? `${form.productionKwp}kWp` : null;
		case "savings": return form.savings || null;
		case "electricalSystem": return form.electricalSystem || null;
		default: return null;
	}
}
function resolvePreviewChips(form) {
	if (form.heroCards.length > 0) return form.heroCards.slice(0, 5).flatMap((card) => {
		if (card.type === "custom") {
			if (!card.value && !card.label) return [];
			return [{
				value: card.value || "—",
				label: card.label || "Custom"
			}];
		}
		const label = card.label || PREVIEW_FIELD_LABELS[card.field] || card.field;
		const value = resolveFormFieldValue(form, card.field);
		if (!value) return [];
		return [{
			value,
			label
		}];
	});
	const chips = [];
	if (form.loadKw && parseFloat(form.loadKw) > 0) chips.push({
		value: `${form.loadKw}kW`,
		label: "Load Capacity"
	});
	if (form.storageKwh && parseFloat(form.storageKwh) > 0) chips.push({
		value: `${form.storageKwh}kWh`,
		label: "Storage Capacity"
	});
	if (form.productionKwp && parseFloat(form.productionKwp) > 0) chips.push({
		value: `${form.productionKwp}kWp`,
		label: "Production Capacity"
	});
	if (form.savings) chips.push({
		value: form.savings,
		label: "Estimated Savings"
	});
	if (form.electricalSystem) chips.push({
		value: form.electricalSystem,
		label: "Electrical System"
	});
	return chips;
}
var PREVIEW_INNER_W = 1440;
var PREVIEW_OUTER_W = 320;
var PREVIEW_SCALE = PREVIEW_OUTER_W / PREVIEW_INNER_W;
var PREVIEW_ENLARGED_W = 960;
var PREVIEW_ENLARGED_SCALE = PREVIEW_ENLARGED_W / PREVIEW_INNER_W;
function isEmptyPreviewBento(item) {
	if (item.cardType === "hero" || item.cardType === "feature") {
		if (item.titleSource?.type === "system") return false;
		return !item.title?.trim();
	}
	return true;
}
function ProjectLivePreview({ form, imagePreview }) {
	const scalerRef = useRef(null);
	const enlargedScalerRef = useRef(null);
	const [outerHeight, setOuterHeight] = useState(300);
	const [enlargedHeight, setEnlargedHeight] = useState(600);
	const [enlarged, setEnlarged] = useState(false);
	const chips = resolvePreviewChips(form);
	const filteredBreakdown = form.technicalBreakdown.filter((item) => !isEmptyPreviewBento(item)).slice(0, 5);
	const perfItems = form.performanceMetrics.filter((m) => m.title || m.description);
	const hasPerf = perfItems.length > 0;
	const hasBreakdown = filteredBreakdown.length > 0;
	const hasGallery = form.galleryImages.length > 0;
	const hasTestimonial = form.testimonial !== null && !!(form.testimonial?.quote || form.testimonial?.clientName);
	useLayoutEffect(() => {
		const el = scalerRef.current;
		if (!el) return;
		const update = () => setOuterHeight(el.scrollHeight * PREVIEW_SCALE);
		update();
		const ro = new ResizeObserver(update);
		ro.observe(el);
		return () => ro.disconnect();
	}, [form, imagePreview]);
	useLayoutEffect(() => {
		if (!enlarged) return;
		const el = enlargedScalerRef.current;
		if (!el) return;
		const update = () => setEnlargedHeight(el.scrollHeight * PREVIEW_ENLARGED_SCALE);
		update();
		const ro = new ResizeObserver(update);
		ro.observe(el);
		return () => ro.disconnect();
	}, [
		enlarged,
		form,
		imagePreview
	]);
	useEffect(() => {
		if (!enlarged) return;
		const onKey = (e) => {
			if (e.key === "Escape") setEnlarged(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [enlarged]);
	const sections = /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "as-pd-hero",
			style: { height: 700 },
			children: [
				imagePreview ? /* @__PURE__ */ jsx("img", {
					src: imagePreview,
					alt: "",
					className: "as-pd-hero-img"
				}) : /* @__PURE__ */ jsx("div", { style: {
					position: "absolute",
					inset: 0,
					background: "#181818"
				} }),
				/* @__PURE__ */ jsx("div", { className: "as-pd-hero-overlay" }),
				/* @__PURE__ */ jsx("div", {
					className: "as-pd-hero-bottom is-shown",
					style: { padding: "0 200px 56px" },
					children: /* @__PURE__ */ jsx("div", {
						className: "as-pd-hero-content",
						children: /* @__PURE__ */ jsxs("div", {
							className: "as-pd-hero-left",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "as-pd-category-badge",
									style: { color: form.categoryColor || "#ffffff" },
									children: form.category.toUpperCase()
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "as-pd-hero-title",
									children: form.title || "Project Title"
								}),
								form.subtitle && /* @__PURE__ */ jsx("p", {
									className: "as-pd-hero-subtitle",
									children: form.subtitle
								}),
								chips.length > 0 && /* @__PURE__ */ jsx("div", {
									className: "as-pd-hero-stats",
									children: chips.map((chip, i) => /* @__PURE__ */ jsxs("div", {
										className: "as-pd-hero-stat",
										children: [/* @__PURE__ */ jsx("span", {
											className: "as-pd-hero-stat-value",
											children: chip.value
										}), /* @__PURE__ */ jsx("span", {
											className: "as-pd-hero-stat-label",
											children: chip.label
										})]
									}, i))
								})
							]
						})
					})
				})
			]
		}),
		hasPerf && /* @__PURE__ */ jsx("section", {
			className: "as-pd-section as-pd-performance is-shown",
			children: /* @__PURE__ */ jsxs("div", {
				className: "as-pd-container",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "as-pd-section-title",
					children: "Performance & Resilience Summary"
				}), /* @__PURE__ */ jsx("div", {
					className: "as-pd-perf-grid",
					children: perfItems.map((m, i) => /* @__PURE__ */ jsxs("div", {
						className: "as-pd-perf-item",
						children: [/* @__PURE__ */ jsx("div", {
							className: "as-pd-perf-title",
							children: m.title
						}), /* @__PURE__ */ jsx("div", {
							className: "as-pd-perf-desc",
							children: m.description
						})]
					}, i))
				})]
			})
		}),
		hasBreakdown && /* @__PURE__ */ jsx("section", {
			className: "as-pd-section as-pd-breakdown is-shown",
			children: /* @__PURE__ */ jsxs("div", {
				className: "as-pd-container",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "as-pd-section-title",
					children: "Technical Breakdown"
				}), /* @__PURE__ */ jsx("div", {
					className: "as-pd-breakdown-bento",
					"data-count": filteredBreakdown.length,
					children: filteredBreakdown.map((item, i) => /* @__PURE__ */ jsx(BentoCard, {
						item,
						staticMetric: true
					}, i))
				})]
			})
		}),
		hasGallery && /* @__PURE__ */ jsx("section", {
			className: "as-pd-section as-pd-gallery is-shown",
			children: /* @__PURE__ */ jsxs("div", {
				className: "as-pd-container",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "as-pd-section-title",
					children: "Project Installation Gallery"
				}), /* @__PURE__ */ jsx("div", {
					className: "as-pd-gallery-grid",
					children: form.galleryImages.slice(0, 8).map((src, i) => /* @__PURE__ */ jsx("div", {
						className: "as-pd-gallery-item is-shown",
						children: /* @__PURE__ */ jsx("img", {
							src,
							alt: "",
							className: "as-pd-gallery-img",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								display: "block"
							}
						})
					}, i))
				})]
			})
		}),
		hasTestimonial && form.testimonial && /* @__PURE__ */ jsx("section", {
			className: "as-pd-section as-pd-testimonial-section is-shown",
			children: /* @__PURE__ */ jsx("div", {
				className: "as-pd-container",
				children: /* @__PURE__ */ jsxs("div", {
					className: "as-pd-testimonial-layout",
					children: [/* @__PURE__ */ jsx("div", {
						className: "as-pd-testimonial-author",
						children: /* @__PURE__ */ jsxs("div", {
							className: "as-pd-testimonial-name-role",
							children: [/* @__PURE__ */ jsx("span", {
								className: "as-pd-testimonial-name",
								children: form.testimonial.clientName
							}), /* @__PURE__ */ jsx("span", {
								className: "as-pd-testimonial-role",
								children: form.testimonial.clientRole
							})]
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "as-pd-testimonial-quote-container",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "as-pd-testimonial-open-quote",
								"aria-hidden": "true",
								children: "“"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "as-pd-testimonial-quote-inner-container",
								children: /* @__PURE__ */ jsx("p", {
									className: "as-pd-testimonial-quote",
									children: form.testimonial.quote
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "as-pd-testimonial-close-quote",
								"aria-hidden": "true",
								children: "”"
							})
						]
					})]
				})
			})
		}),
		!imagePreview && !form.title && !hasPerf && !hasBreakdown && !hasGallery && !hasTestimonial && /* @__PURE__ */ jsxs("div", {
			style: {
				height: 700,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 16
			},
			children: [/* @__PURE__ */ jsx("div", {
				style: {
					fontSize: 48,
					opacity: .12,
					color: "#fff"
				},
				children: "◻"
			}), /* @__PURE__ */ jsx("div", {
				style: {
					fontSize: 24,
					color: "rgba(255,255,255,0.2)",
					fontFamily: "Outfit, sans-serif"
				},
				children: "Start filling in the form"
			})]
		})
	] });
	const scalerStyle = {
		width: `${PREVIEW_INNER_W}px`,
		transformOrigin: "top left",
		pointerEvents: "none",
		userSelect: "none",
		background: "#0a0a0a"
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		style: { position: "relative" },
		children: [/* @__PURE__ */ jsx("button", {
			onClick: () => setEnlarged(true),
			title: "Enlarge preview",
			style: {
				position: "absolute",
				top: 8,
				right: 8,
				zIndex: 2,
				background: "rgba(0,0,0,0.55)",
				border: "1px solid rgba(255,255,255,0.18)",
				backdropFilter: "blur(4px)",
				borderRadius: 6,
				color: "rgba(255,255,255,0.8)",
				cursor: "pointer",
				width: 28,
				height: 28,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontSize: 15,
				lineHeight: 1,
				padding: 0,
				transition: "background 0.15s, color 0.15s"
			},
			children: "⛶"
		}), /* @__PURE__ */ jsx("div", {
			style: {
				width: `${PREVIEW_OUTER_W}px`,
				height: `${outerHeight}px`,
				overflow: "hidden",
				borderRadius: 8,
				border: "1px solid var(--ad-border2)",
				background: "#0a0a0a",
				position: "relative"
			},
			children: /* @__PURE__ */ jsx("div", {
				ref: scalerRef,
				style: {
					...scalerStyle,
					transform: `scale(${PREVIEW_SCALE})`
				},
				children: sections
			})
		})]
	}), enlarged && createPortal(/* @__PURE__ */ jsx("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 9999,
			background: "rgba(0,0,0,0.9)",
			backdropFilter: "blur(6px)",
			display: "flex",
			alignItems: "flex-start",
			justifyContent: "center",
			padding: "32px 24px 48px",
			overflowY: "auto"
		},
		onClick: () => setEnlarged(false),
		children: /* @__PURE__ */ jsxs("div", {
			style: {
				position: "relative",
				flexShrink: 0
			},
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: 12,
					gap: 16
				},
				children: [/* @__PURE__ */ jsxs("span", {
					style: {
						fontSize: 11,
						fontWeight: 700,
						letterSpacing: "0.08em",
						textTransform: "uppercase",
						color: "rgba(255,255,255,0.35)"
					},
					children: [
						"Live Preview — ",
						PREVIEW_ENLARGED_W,
						"px desktop view"
					]
				}), /* @__PURE__ */ jsx("button", {
					onClick: () => setEnlarged(false),
					style: {
						background: "rgba(255,255,255,0.08)",
						border: "1px solid rgba(255,255,255,0.16)",
						borderRadius: 8,
						color: "rgba(255,255,255,0.7)",
						cursor: "pointer",
						padding: "5px 14px",
						fontSize: 12,
						fontWeight: 600,
						display: "flex",
						alignItems: "center",
						gap: 6
					},
					children: "✕ Close"
				})]
			}), /* @__PURE__ */ jsx("div", {
				style: {
					width: `${PREVIEW_ENLARGED_W}px`,
					height: `${enlargedHeight}px`,
					overflow: "hidden",
					borderRadius: 12,
					border: "1px solid rgba(255,255,255,0.1)",
					background: "#0a0a0a"
				},
				children: /* @__PURE__ */ jsx("div", {
					ref: enlargedScalerRef,
					style: {
						...scalerStyle,
						transform: `scale(${PREVIEW_ENLARGED_SCALE})`
					},
					children: sections
				})
			})]
		})
	}), document.body)] });
}
function ProjectsManager({ apiKey }) {
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [form, setForm] = useState(EMPTY_PROJECT_FORM);
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState("");
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(null);
	const [publishing, setPublishing] = useState(null);
	const [msg, setMsg] = useState("");
	const [errors, setErrors] = useState({});
	const [previewProject, setPreviewProject] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [formSection, setFormSection] = useState("basic");
	const [systemInputMode, setSystemInputMode] = useState("manual");
	const [pkgList, setPkgList] = useState([]);
	const [pkgListLoading, setPkgListLoading] = useState(false);
	const [selectedPkgId, setSelectedPkgId] = useState("");
	const [galleryMsg, setGalleryMsg] = useState("");
	const clearErr = (f) => setErrors((p) => {
		const c = { ...p };
		delete c[f];
		return c;
	});
	const load = async () => {
		setLoading(true);
		try {
			setProjects((await adminGetProjects(apiKey)).data);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		load();
	}, []);
	useEffect(() => {
		if (!showForm || pkgList.length > 0 || pkgListLoading) return;
		setPkgListLoading(true);
		adminGetPackages(apiKey).then((res) => setPkgList(res.data ?? [])).finally(() => setPkgListLoading(false));
	}, [showForm]);
	const openAdd = () => {
		setEditingId(null);
		setForm(EMPTY_PROJECT_FORM);
		setImageFile(null);
		setImagePreview("");
		setMsg("");
		setFormSection("basic");
		setSystemInputMode("manual");
		setSelectedPkgId("");
		setShowForm(true);
	};
	const openEdit = (p) => {
		setEditingId(p.id);
		setForm({
			title: p.title,
			subtitle: p.subtitle ?? "",
			category: p.category,
			system: p.system,
			savings: p.savings,
			videoUrl: p.videoUrl ?? "",
			isRecent: p.isRecent,
			sortOrder: p.sortOrder ?? 0,
			stats: p.stats ?? [],
			performanceMetrics: p.performanceMetrics ?? [],
			technicalBreakdown: normalizeBreakdownItems(p.technicalBreakdown ?? []),
			categoryColor: p.categoryColor ?? "",
			galleryImages: p.galleryImages ?? [],
			galleryImageNames: p.galleryImageNames ?? [],
			heroCards: p.heroCards ?? [],
			testimonial: p.testimonial ?? null,
			systemCardSubtext: p.systemCardSubtext ?? "",
			savingsCardSubtext: p.savingsCardSubtext ?? "",
			electricalSystem: p.electricalSystem ?? (p.system?.includes("3-Phase") || p.system?.includes("Three Phase") || p.system?.includes("Three-Phase") ? "Three-Phase" : "Single-Phase"),
			productionKwp: p.productionKwp != null ? String(p.productionKwp) : p.system?.match(/^([\d.]+)/)?.[1] ?? "",
			loadKw: p.loadKw != null ? String(p.loadKw) : "",
			storageKwh: p.storageKwh != null ? String(p.storageKwh) : p.system?.match(/\(([\d.]+)\s*kWh/i)?.[1] ?? ""
		});
		setImageFile(null);
		setImagePreview(p.imageUrl);
		setMsg("");
		setFormSection("basic");
		setSystemInputMode("manual");
		setSelectedPkgId("");
		setShowForm(true);
	};
	const closeForm = () => {
		setShowForm(false);
		setEditingId(null);
		setImageFile(null);
		setImagePreview("");
		setMsg("");
		setErrors({});
		setGalleryMsg("");
	};
	const handleImageSelect = (file) => {
		if (!file) return;
		if (!new Set([
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/gif"
		]).has(file.type)) {
			setMsg("Error: Only JPEG, PNG, WebP or GIF images are allowed.");
			return;
		}
		if (file.size > 10 * 1024 * 1024) {
			setMsg("Error: Image must be under 10 MB.");
			return;
		}
		setImageFile(file);
		const reader = new FileReader();
		reader.onload = (e) => setImagePreview(e.target?.result);
		reader.readAsDataURL(file);
	};
	const setField = (key, value) => setForm((f) => ({
		...f,
		[key]: value
	}));
	const handlePkgSelect = (id) => {
		setSelectedPkgId(id);
		const pkg = pkgList.find((p) => p.id === id);
		if (!pkg) return;
		const es = pkg.phase === "three" ? "Three-Phase" : "Single-Phase";
		setForm((f) => ({
			...f,
			electricalSystem: es,
			productionKwp: String(pkg.solarKwp),
			loadKw: String(pkg.inverterKw),
			storageKwh: String(pkg.storageKwh),
			system: buildSystemString(String(pkg.solarKwp), String(pkg.storageKwh), es)
		}));
		const { savings } = computeMonthlySavings(pkg.solarKwp);
		setField("savings", `₱${(savings * 120).toLocaleString("en-PH")}`);
	};
	const handleSave = async () => {
		const errs = {};
		if (!form.title.trim()) errs.title = "Title is required.";
		if (!form.productionKwp.trim()) errs.productionKwp = "Production capacity is required.";
		if (!form.savings.trim()) errs.savings = "Estimated savings is required.";
		if (!editingId && !imageFile) errs.image = "A project image is required.";
		if (Object.keys(errs).length > 0) {
			setErrors(errs);
			setFormSection("basic");
			scrollToFirstError();
			return;
		}
		setErrors({});
		setSaving(true);
		setMsg("");
		try {
			const autoSystem = buildSystemString(form.productionKwp, form.storageKwh, form.electricalSystem);
			const payload = {
				title: form.title,
				subtitle: form.subtitle || void 0,
				category: form.category,
				categoryColor: form.categoryColor || void 0,
				system: autoSystem,
				savings: form.savings,
				videoUrl: form.videoUrl || void 0,
				isRecent: form.isRecent,
				sortOrder: form.sortOrder,
				imageFile: imageFile ?? void 0,
				stats: form.stats,
				performanceMetrics: form.performanceMetrics,
				technicalBreakdown: form.technicalBreakdown,
				galleryImages: form.galleryImages,
				galleryImageNames: form.galleryImageNames,
				heroCards: form.heroCards,
				testimonial: form.testimonial,
				systemCardSubtext: form.systemCardSubtext || void 0,
				savingsCardSubtext: form.savingsCardSubtext || void 0,
				electricalSystem: form.electricalSystem,
				loadKw: form.loadKw ? parseFloat(form.loadKw) : void 0,
				productionKwp: form.productionKwp ? parseFloat(form.productionKwp) : void 0,
				storageKwh: form.storageKwh ? parseFloat(form.storageKwh) : void 0
			};
			if (editingId) {
				await adminUpdateProject(apiKey, editingId, payload);
				setMsg("✓ Project updated");
			} else {
				await adminCreateProject(apiKey, payload);
				setMsg("✓ Project created");
			}
			await load();
			closeForm();
		} catch (e) {
			setMsg(`Error: ${e.message}`);
		} finally {
			setSaving(false);
		}
	};
	const handleDelete = async () => {
		if (!deleteTarget) return;
		setDeleting(deleteTarget.id);
		try {
			await adminDeleteProject(apiKey, deleteTarget.id);
			setMsg("✓ Project deleted");
			await load();
		} catch (e) {
			setMsg(`Error: ${e.message}`);
		} finally {
			setDeleting(null);
			setDeleteTarget(null);
		}
	};
	const handleTogglePublish = async (p) => {
		const next = !p.isPublished;
		setPublishing(p.id);
		setProjects((prev) => prev.map((x) => x.id === p.id ? {
			...x,
			isPublished: next
		} : x));
		try {
			await adminPublishProject(apiKey, p.id, next);
			setMsg(next ? `✓ "${p.title}" published` : `✓ "${p.title}" unpublished`);
		} catch (e) {
			setProjects((prev) => prev.map((x) => x.id === p.id ? {
				...x,
				isPublished: p.isPublished
			} : x));
			setMsg(`Error: ${e.message}`);
		} finally {
			setPublishing(null);
		}
	};
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "ad-section-header",
			children: [/* @__PURE__ */ jsx("div", {
				className: "ad-section-title",
				children: "Projects Portfolio"
			}), /* @__PURE__ */ jsx("button", {
				onClick: openAdd,
				className: "ad-btn ad-btn--sm",
				children: "+ Add Project"
			})]
		}),
		/* @__PURE__ */ jsx(Toast, { msg }),
		/* @__PURE__ */ jsx(ConfirmDeleteModal, {
			open: !!deleteTarget,
			title: `Delete "${deleteTarget?.title}"?`,
			description: "This will permanently remove the project and cannot be undone.",
			onConfirm: () => void handleDelete(),
			onCancel: () => setDeleteTarget(null),
			confirming: !!deleting
		}),
		previewProject && /* @__PURE__ */ jsxs(AdminModal, {
			open: !!previewProject,
			onClose: () => setPreviewProject(null),
			title: previewProject.title,
			subtitle: `${previewProject.category} · Created ${new Date(previewProject.createdAt).toLocaleDateString()}`,
			children: [previewProject.imageUrl && /* @__PURE__ */ jsx("div", {
				style: { marginBottom: 16 },
				children: /* @__PURE__ */ jsx("img", {
					src: previewProject.imageUrl,
					alt: previewProject.title,
					style: {
						width: "100%",
						maxHeight: 220,
						objectFit: "cover",
						borderRadius: 8,
						border: "1px solid var(--ad-border)"
					}
				})
			}), /* @__PURE__ */ jsxs("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: "12px 20px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Title"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)",
							fontWeight: 600
						},
						children: previewProject.title
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Category"
					}), /* @__PURE__ */ jsx("div", {
						style: { fontSize: 14 },
						children: /* @__PURE__ */ jsx("span", {
							className: `ad-badge ${categoryClass(previewProject.category)}`,
							children: previewProject.category
						})
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Electrical System"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewProject.electricalSystem ?? "—"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Production"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewProject.productionKwp != null ? `${previewProject.productionKwp} kWp` : "—"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Load"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewProject.loadKw != null ? `${previewProject.loadKw} kW` : "—"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Storage"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewProject.storageKwh != null && previewProject.storageKwh > 0 ? `${previewProject.storageKwh} kWh` : "None"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Estimated Savings"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewProject.savings
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Recent"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: previewProject.isRecent ? "#22c55e" : "var(--ad-text3)"
						},
						children: previewProject.isRecent ? "Yes — shown as recent" : "No"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Created"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: new Date(previewProject.createdAt).toLocaleDateString()
					})] }),
					previewProject.subtitle && /* @__PURE__ */ jsxs("div", {
						className: "ad-form-full",
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontSize: 11,
								fontWeight: 700,
								color: "var(--ad-text3)",
								textTransform: "uppercase",
								letterSpacing: "0.07em",
								marginBottom: 3
							},
							children: "Subtitle"
						}), /* @__PURE__ */ jsx("div", {
							style: {
								fontSize: 14,
								color: "var(--ad-text)"
							},
							children: previewProject.subtitle
						})]
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Capacity Label"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: previewProject.systemCardSubtext ? "var(--ad-text)" : "var(--ad-text3)"
						},
						children: previewProject.systemCardSubtext || "—"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Savings Label"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: previewProject.savingsCardSubtext ? "var(--ad-text)" : "var(--ad-text3)"
						},
						children: previewProject.savingsCardSubtext || "—"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Metrics"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: [
							(previewProject.performanceMetrics ?? []).length,
							" metric",
							(previewProject.performanceMetrics ?? []).length !== 1 ? "s" : ""
						]
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Breakdown Cards"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: [
							(previewProject.technicalBreakdown ?? []).length,
							" card",
							(previewProject.technicalBreakdown ?? []).length !== 1 ? "s" : ""
						]
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Gallery"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: [
							(previewProject.galleryImages ?? []).length,
							" photo",
							(previewProject.galleryImages ?? []).length !== 1 ? "s" : ""
						]
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Testimonial"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: previewProject.testimonial ? "#22c55e" : "var(--ad-text3)"
						},
						children: previewProject.testimonial ? `"${previewProject.testimonial.quote.slice(0, 60)}…"` : "None"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Video"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: previewProject.videoUrl ? "#22c55e" : "var(--ad-text3)"
						},
						children: previewProject.videoUrl ? "✓ Attached" : "None"
					})] }),
					previewProject.videoUrl && /* @__PURE__ */ jsxs("div", {
						className: "ad-form-full",
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontSize: 11,
								fontWeight: 700,
								color: "var(--ad-text3)",
								textTransform: "uppercase",
								letterSpacing: "0.07em",
								marginBottom: 3
							},
							children: "Video URL"
						}), /* @__PURE__ */ jsx("div", {
							style: {
								fontSize: 13,
								color: "var(--ad-text2)",
								wordBreak: "break-all"
							},
							children: previewProject.videoUrl
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ jsx(AdminModal, {
			open: showForm,
			onClose: closeForm,
			title: editingId ? "Edit Project" : "Add New Project",
			maxWidth: 1260,
			children: /* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					gap: 0,
					alignItems: "flex-start"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						flex: 1,
						minWidth: 0,
						paddingRight: 24
					},
					children: [
						/* @__PURE__ */ jsx("div", {
							style: {
								display: "flex",
								gap: 6,
								marginBottom: 24,
								borderBottom: "1px solid var(--ad-border)",
								paddingBottom: 12,
								flexWrap: "wrap"
							},
							children: SECTION_REGISTRY.map((section) => {
								const incomplete = !section.isComplete(form);
								return /* @__PURE__ */ jsxs("button", {
									onClick: () => setFormSection(section.id),
									className: formSection === section.id ? "ad-btn ad-btn--sm" : "ad-btn ad-btn--ghost ad-btn--sm",
									style: { position: "relative" },
									title: incomplete ? "Required fields missing" : void 0,
									children: [section.label, incomplete && /* @__PURE__ */ jsx("span", { style: {
										position: "absolute",
										top: 3,
										right: 3,
										width: 6,
										height: 6,
										borderRadius: "50%",
										background: "var(--ad-accent)",
										pointerEvents: "none"
									} })]
								}, section.id);
							})
						}),
						formSection === "basic" && /* @__PURE__ */ jsxs("div", {
							className: "ad-form-grid",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("label", {
										className: "ad-label",
										children: "Title *"
									}),
									/* @__PURE__ */ jsx("input", {
										className: `ad-input${errors.title ? " ad-input--error" : ""}`,
										value: form.title,
										onChange: (e) => {
											setField("title", e.target.value);
											clearErr("title");
										},
										placeholder: "Client name or project title"
									}),
									errors.title && /* @__PURE__ */ jsx("span", {
										className: "ad-field-error",
										"data-field-error": true,
										children: errors.title
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "ad-label",
									children: "Category"
								}), /* @__PURE__ */ jsxs("select", {
									className: "ad-select",
									value: form.category,
									onChange: (e) => setField("category", e.target.value),
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "Residential",
											children: "Residential"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Commercial",
											children: "Commercial"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Industrial",
											children: "Industrial"
										})
									]
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "ad-label",
									children: ["Category Badge Color ", /* @__PURE__ */ jsx("span", {
										style: {
											fontWeight: 400,
											opacity: .6
										},
										children: "(optional)"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: 8
									},
									children: [/* @__PURE__ */ jsx("input", {
										type: "color",
										value: form.categoryColor || "#ffffff",
										onChange: (e) => setField("categoryColor", e.target.value),
										style: {
											width: 38,
											height: 38,
											padding: 2,
											borderRadius: 6,
											border: "1px solid var(--ad-border)",
											background: "none",
											cursor: "pointer",
											flexShrink: 0
										}
									}), /* @__PURE__ */ jsx("input", {
										className: "ad-input",
										value: form.categoryColor,
										onChange: (e) => setField("categoryColor", e.target.value),
										placeholder: "#ffffff (leave blank for white)",
										style: { fontFamily: "monospace" }
									})]
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "ad-form-full",
									children: [/* @__PURE__ */ jsxs("label", {
										className: "ad-label",
										children: ["Subtitle ", /* @__PURE__ */ jsx("span", {
											style: {
												fontWeight: 400,
												opacity: .6
											},
											children: "(optional tagline)"
										})]
									}), /* @__PURE__ */ jsx("input", {
										className: "ad-input",
										value: form.subtitle,
										onChange: (e) => setField("subtitle", e.target.value),
										placeholder: "e.g. A grid-tied system built for the province's harshest summers"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "ad-form-full",
									style: {
										borderTop: "1px solid var(--ad-border)",
										paddingTop: 16,
										marginTop: 4
									},
									children: [/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											marginBottom: 12
										},
										children: [/* @__PURE__ */ jsx("label", {
											className: "ad-label",
											style: { margin: 0 },
											children: "System Details"
										}), /* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												gap: 6
											},
											children: [/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => {
													setSystemInputMode("manual");
													setSelectedPkgId("");
												},
												className: systemInputMode === "manual" ? "ad-btn ad-btn--sm" : "ad-btn ad-btn--ghost ad-btn--sm",
												children: "Enter Manually"
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setSystemInputMode("package"),
												className: systemInputMode === "package" ? "ad-btn ad-btn--sm" : "ad-btn ad-btn--ghost ad-btn--sm",
												children: "Fill from Package"
											})]
										})]
									}), systemInputMode === "package" && /* @__PURE__ */ jsxs("div", { children: [pkgListLoading ? /* @__PURE__ */ jsx("div", {
										style: {
											fontSize: 13,
											color: "var(--ad-text3)",
											padding: "6px 0"
										},
										children: "Loading packages…"
									}) : pkgList.length === 0 ? /* @__PURE__ */ jsx("div", {
										style: {
											fontSize: 13,
											color: "var(--ad-text3)",
											padding: "6px 0"
										},
										children: "No packages found. Create packages first."
									}) : /* @__PURE__ */ jsxs("select", {
										className: "ad-select",
										value: selectedPkgId,
										onChange: (e) => handlePkgSelect(e.target.value),
										style: {
											width: "100%",
											marginBottom: 8
										},
										children: [/* @__PURE__ */ jsx("option", {
											value: "",
											children: "— Select a package —"
										}), pkgList.map((p) => /* @__PURE__ */ jsxs("option", {
											value: p.id,
											children: [
												p.name,
												" · ",
												p.solarKwp,
												" kWp",
												p.storageKwh > 0 ? ` Hybrid (${p.storageKwh} kWh)` : " On-Grid",
												p.phase === "three" ? " · 3-Phase" : ""
											]
										}, p.id))]
									}), selectedPkgId && /* @__PURE__ */ jsx("p", {
										className: "ad-pkg-hint",
										children: "Auto-filled from selected package — edit the fields below if needed."
									})] })]
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "ad-label",
									children: "Electrical System"
								}), /* @__PURE__ */ jsxs("select", {
									className: "ad-select",
									value: form.electricalSystem,
									onChange: (e) => setField("electricalSystem", e.target.value),
									children: [/* @__PURE__ */ jsx("option", {
										value: "Single-Phase",
										children: "Single-Phase"
									}), /* @__PURE__ */ jsx("option", {
										value: "Three-Phase",
										children: "Three-Phase"
									})]
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "ad-label",
									children: ["Load Capacity ", /* @__PURE__ */ jsx("span", {
										style: {
											fontWeight: 400,
											opacity: .6
										},
										children: "(kW)"
									})]
								}), /* @__PURE__ */ jsx("input", {
									className: "ad-input",
									type: "number",
									min: 0,
									step: .1,
									value: form.loadKw,
									onChange: (e) => setField("loadKw", e.target.value),
									placeholder: "e.g. 5"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("label", {
										className: "ad-label",
										children: ["Production Capacity ", /* @__PURE__ */ jsx("span", {
											style: {
												fontWeight: 400,
												opacity: .6
											},
											children: "(kWp) *"
										})]
									}),
									/* @__PURE__ */ jsx("input", {
										className: `ad-input${errors.productionKwp ? " ad-input--error" : ""}`,
										type: "number",
										min: 0,
										step: .1,
										value: form.productionKwp,
										onChange: (e) => {
											setField("productionKwp", e.target.value);
											clearErr("productionKwp");
										},
										placeholder: "e.g. 5.2"
									}),
									errors.productionKwp && /* @__PURE__ */ jsx("span", {
										className: "ad-field-error",
										"data-field-error": true,
										children: errors.productionKwp
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "ad-label",
									children: ["Storage Capacity ", /* @__PURE__ */ jsx("span", {
										style: {
											fontWeight: 400,
											opacity: .6
										},
										children: "(kWh — 0 for no storage)"
									})]
								}), /* @__PURE__ */ jsx("input", {
									className: "ad-input",
									type: "number",
									min: 0,
									step: .1,
									value: form.storageKwh,
									onChange: (e) => setField("storageKwh", e.target.value),
									placeholder: "0"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("label", {
										className: "ad-label",
										children: "Estimated Savings (10-Year) *"
									}),
									/* @__PURE__ */ jsx("input", {
										className: `ad-input${errors.savings ? " ad-input--error" : ""}`,
										value: form.savings,
										onChange: (e) => {
											setField("savings", e.target.value);
											clearErr("savings");
										},
										placeholder: "e.g. ₱312,000"
									}),
									errors.savings && /* @__PURE__ */ jsx("span", {
										className: "ad-field-error",
										"data-field-error": true,
										children: errors.savings
									})
								] }),
								/* @__PURE__ */ jsxs("div", {
									className: "ad-form-full",
									children: [/* @__PURE__ */ jsxs("label", {
										className: "ad-label",
										children: ["Video URL ", /* @__PURE__ */ jsx("span", {
											style: {
												fontWeight: 400,
												opacity: .6
											},
											children: "(optional YouTube or direct link)"
										})]
									}), /* @__PURE__ */ jsx("input", {
										className: "ad-input",
										value: form.videoUrl,
										onChange: (e) => setField("videoUrl", e.target.value),
										placeholder: "https://youtube.com/watch?v=..."
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "ad-form-full",
									children: [
										/* @__PURE__ */ jsxs("label", {
											className: "ad-label",
											children: ["Project Image ", editingId ? /* @__PURE__ */ jsx("span", {
												style: {
													fontWeight: 400,
													opacity: .6
												},
												children: "(leave empty to keep current)"
											}) : /* @__PURE__ */ jsx("span", {
												style: { color: "#ef4444" },
												children: " *"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: `ad-image-row${errors.image ? " ad-image-row--error" : ""}`,
											children: [/* @__PURE__ */ jsxs("div", {
												className: "ad-image-drop",
												style: {
													flex: 1,
													borderColor: errors.image ? "#ef4444" : void 0
												},
												onClick: () => {
													document.getElementById("proj-img-input")?.click();
													clearErr("image");
												},
												onDragOver: (e) => e.preventDefault(),
												onDrop: (e) => {
													e.preventDefault();
													handleImageSelect(e.dataTransfer.files?.[0]);
													clearErr("image");
												},
												children: [/* @__PURE__ */ jsx("input", {
													id: "proj-img-input",
													type: "file",
													accept: "image/jpeg,image/png,image/webp,image/gif",
													hidden: true,
													onChange: (e) => {
														handleImageSelect(e.target.files?.[0]);
														clearErr("image");
													}
												}), imageFile ? /* @__PURE__ */ jsxs("span", { children: [
													imageFile.name,
													" (",
													(imageFile.size / 1024).toFixed(0),
													" KB)"
												] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
													"Click or drag & drop an image",
													/* @__PURE__ */ jsx("br", {}),
													/* @__PURE__ */ jsx("small", { children: "JPEG, PNG, WebP — max 10 MB" })
												] })]
											}), imagePreview && /* @__PURE__ */ jsx("img", {
												src: imagePreview,
												alt: "Preview",
												className: "ad-image-preview"
											})]
										}),
										errors.image && /* @__PURE__ */ jsx("span", {
											className: "ad-field-error",
											"data-field-error": true,
											children: errors.image
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: 10,
										paddingTop: 22
									},
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										id: "isRecent",
										checked: form.isRecent,
										onChange: (e) => setField("isRecent", e.target.checked),
										style: {
											width: 16,
											height: 16,
											cursor: "pointer",
											accentColor: "var(--ad-accent)"
										}
									}), /* @__PURE__ */ jsx("label", {
										htmlFor: "isRecent",
										style: {
											color: "var(--ad-text)",
											fontSize: 13,
											cursor: "pointer"
										},
										children: "Mark as Recent Project"
									})]
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "ad-label",
									children: "Sort Order"
								}), /* @__PURE__ */ jsx("input", {
									className: "ad-input",
									type: "number",
									value: form.sortOrder,
									onChange: (e) => setField("sortOrder", parseInt(e.target.value) || 0),
									placeholder: "0"
								})] }),
								/* @__PURE__ */ jsx("div", {
									className: "ad-form-full",
									style: {
										borderTop: "1px solid var(--ad-border)",
										paddingTop: 16,
										marginTop: 4
									},
									children: (() => {
										const MAX_HERO_CARDS = 5;
										const SYSTEM_FIELD_LABELS = {
											loadKw: "Load Capacity",
											storageKwh: "Storage Capacity",
											productionKwp: "Production Capacity",
											savings: "Estimated Savings",
											electricalSystem: "Electrical System"
										};
										const usedSystemFields = new Set(form.heroCards.filter((c) => c.type === "system").map((c) => c.field));
										const availableSystemFields = Object.keys(SYSTEM_FIELD_LABELS).filter((f) => !usedSystemFields.has(f));
										const addSystemCard = (field) => {
											if (form.heroCards.length >= MAX_HERO_CARDS) return;
											setField("heroCards", [...form.heroCards, {
												type: "system",
												field
											}]);
										};
										const addCustomCard = () => {
											if (form.heroCards.length >= MAX_HERO_CARDS) return;
											setField("heroCards", [...form.heroCards, {
												type: "custom",
												value: "",
												label: ""
											}]);
										};
										const removeCard = (i) => setField("heroCards", form.heroCards.filter((_, j) => j !== i));
										const moveCard = (i, dir) => {
											const arr = [...form.heroCards];
											const j = i + dir;
											if (j < 0 || j >= arr.length) return;
											[arr[i], arr[j]] = [arr[j], arr[i]];
											setField("heroCards", arr);
										};
										const patchCard = (i, patch) => setField("heroCards", form.heroCards.map((c, j) => j === i ? {
											...c,
											...patch
										} : c));
										return /* @__PURE__ */ jsxs(Fragment, { children: [
											/* @__PURE__ */ jsxs("div", {
												style: {
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													marginBottom: 10
												},
												children: [/* @__PURE__ */ jsxs("label", {
													className: "ad-label",
													style: { margin: 0 },
													children: ["Hero Cards", /* @__PURE__ */ jsxs("span", {
														style: {
															marginLeft: 8,
															fontSize: 11,
															fontWeight: 400,
															color: "var(--ad-text3)"
														},
														children: [
															form.heroCards.length,
															" / ",
															MAX_HERO_CARDS
														]
													})]
												}), /* @__PURE__ */ jsxs("div", {
													style: {
														display: "flex",
														gap: 6
													},
													children: [availableSystemFields.length > 0 && form.heroCards.length < MAX_HERO_CARDS && /* @__PURE__ */ jsxs("select", {
														className: "ad-select",
														style: {
															fontSize: 12,
															padding: "4px 8px",
															height: 30
														},
														value: "",
														onChange: (e) => {
															if (e.target.value) addSystemCard(e.target.value);
														},
														children: [/* @__PURE__ */ jsx("option", {
															value: "",
															children: "+ System field"
														}), availableSystemFields.map((f) => /* @__PURE__ */ jsx("option", {
															value: f,
															children: SYSTEM_FIELD_LABELS[f]
														}, f))]
													}), form.heroCards.length < MAX_HERO_CARDS && /* @__PURE__ */ jsx("button", {
														type: "button",
														className: "ad-btn ad-btn--ghost ad-btn--sm",
														onClick: addCustomCard,
														children: "+ Custom"
													})]
												})]
											}),
											/* @__PURE__ */ jsx("div", {
												style: {
													fontSize: 11,
													color: "var(--ad-text3)",
													marginBottom: 10
												},
												children: "These cards appear in the project hero section. Mix system-field cards (auto-populated) and custom cards. Reorder with ↑ ↓. Leave empty to auto-generate from system data."
											}),
											form.heroCards.length === 0 && /* @__PURE__ */ jsx("div", {
												style: {
													fontSize: 12,
													color: "var(--ad-text3)",
													padding: "10px 0",
													fontStyle: "italic"
												},
												children: "No cards configured — hero will auto-generate chips from system data."
											}),
											form.heroCards.map((card, i) => /* @__PURE__ */ jsxs("div", {
												style: {
													display: "flex",
													gap: 8,
													alignItems: "flex-start",
													background: "var(--ad-input-bg)",
													border: "1px solid var(--ad-border)",
													borderRadius: 8,
													padding: "10px 12px",
													marginBottom: 8
												},
												children: [
													/* @__PURE__ */ jsxs("div", {
														style: {
															display: "flex",
															flexDirection: "column",
															gap: 4,
															paddingTop: 2
														},
														children: [/* @__PURE__ */ jsx("button", {
															type: "button",
															className: "ad-btn ad-btn--ghost ad-btn--sm",
															style: {
																padding: "1px 6px",
																fontSize: 11
															},
															onClick: () => moveCard(i, -1),
															disabled: i === 0,
															children: "↑"
														}), /* @__PURE__ */ jsx("button", {
															type: "button",
															className: "ad-btn ad-btn--ghost ad-btn--sm",
															style: {
																padding: "1px 6px",
																fontSize: 11
															},
															onClick: () => moveCard(i, 1),
															disabled: i === form.heroCards.length - 1,
															children: "↓"
														})]
													}),
													/* @__PURE__ */ jsxs("div", {
														style: {
															flex: 1,
															minWidth: 0
														},
														children: [
															/* @__PURE__ */ jsx("div", {
																style: {
																	fontSize: 10,
																	fontWeight: 700,
																	color: card.type === "system" ? "#22c55e" : "var(--ad-accent)",
																	textTransform: "uppercase",
																	letterSpacing: "0.06em",
																	marginBottom: 6
																},
																children: card.type === "system" ? `System · ${SYSTEM_FIELD_LABELS[card.field]}` : "Custom"
															}),
															card.type === "system" && /* @__PURE__ */ jsx("input", {
																className: "ad-input",
																value: card.label ?? "",
																onChange: (e) => patchCard(i, { label: e.target.value || void 0 }),
																placeholder: `Label (default: "${SYSTEM_FIELD_LABELS[card.field]}")`,
																style: { fontSize: 12 }
															}),
															card.type === "custom" && /* @__PURE__ */ jsxs("div", {
																style: {
																	display: "grid",
																	gridTemplateColumns: "1fr 1fr",
																	gap: 8
																},
																children: [/* @__PURE__ */ jsx("input", {
																	className: "ad-input",
																	value: card.value,
																	onChange: (e) => patchCard(i, { value: e.target.value }),
																	placeholder: "Value (e.g. 5.2 kWp)",
																	style: { fontSize: 12 }
																}), /* @__PURE__ */ jsx("input", {
																	className: "ad-input",
																	value: card.label,
																	onChange: (e) => patchCard(i, { label: e.target.value }),
																	placeholder: "Label (e.g. System Size)",
																	style: { fontSize: 12 }
																})]
															})
														]
													}),
													/* @__PURE__ */ jsx("button", {
														type: "button",
														className: "ad-btn ad-btn--danger ad-btn--sm",
														style: { flexShrink: 0 },
														onClick: () => removeCard(i),
														children: "✕"
													})
												]
											}, i))
										] });
									})()
								})
							]
						}),
						formSection === "performance" && /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								flexDirection: "column",
								gap: 12
							},
							children: [
								/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: 12,
										color: "var(--ad-text3)",
										marginBottom: 4
									},
									children: "Each item appears as a column in the Performance & Resilience Summary section — title + description only."
								}),
								form.performanceMetrics.map((m, i) => /* @__PURE__ */ jsxs("div", {
									style: {
										background: "var(--ad-input-bg)",
										border: "1px solid var(--ad-border)",
										borderRadius: 8,
										padding: "12px 14px"
									},
									children: [
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												justifyContent: "space-between",
												marginBottom: 8
											},
											children: [/* @__PURE__ */ jsxs("span", {
												style: {
													fontSize: 12,
													color: "var(--ad-text3)"
												},
												children: ["Item ", i + 1]
											}), /* @__PURE__ */ jsx("button", {
												className: "ad-btn ad-btn--danger ad-btn--sm",
												onClick: () => setField("performanceMetrics", form.performanceMetrics.filter((_, j) => j !== i)),
												children: "✕"
											})]
										}),
										/* @__PURE__ */ jsx("input", {
											className: "ad-input",
											style: { marginBottom: 8 },
											value: m.title,
											onChange: (e) => setField("performanceMetrics", form.performanceMetrics.map((x, j) => j === i ? {
												...x,
												title: e.target.value
											} : x)),
											placeholder: "Title (e.g. Operational Security)"
										}),
										/* @__PURE__ */ jsx("textarea", {
											className: "ad-input",
											rows: 2,
											value: m.description,
											onChange: (e) => setField("performanceMetrics", form.performanceMetrics.map((x, j) => j === i ? {
												...x,
												description: e.target.value
											} : x)),
											placeholder: "Description",
											style: {
												resize: "vertical",
												width: "100%"
											}
										})
									]
								}, i)),
								/* @__PURE__ */ jsx("button", {
									className: "ad-btn ad-btn--ghost ad-btn--sm",
									style: { marginTop: 4 },
									onClick: () => setField("performanceMetrics", [...form.performanceMetrics, {
										title: "",
										description: ""
									}]),
									children: "+ Add Item"
								})
							]
						}),
						formSection === "breakdown" && /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								flexDirection: "column",
								gap: 12
							},
							children: [
								form.technicalBreakdown.length === 0 && /* @__PURE__ */ jsx("div", {
									style: {
										fontSize: 12,
										color: "var(--ad-text3)",
										padding: "8px 0"
									},
									children: "No slots added — the Technical Breakdown section will be hidden on the project page."
								}),
								form.technicalBreakdown.map((item, i) => {
									const isHero = i === 0;
									const typeBg = isHero ? "rgba(200,64,32,0.12)" : "rgba(251,191,36,0.12)";
									const typeFg = isHero ? "#fc7a4a" : "#fbbf24";
									const typeLabel = isHero ? "Hero" : "Feature";
									const patchItem = (patch) => setField("technicalBreakdown", form.technicalBreakdown.map((x, j) => j === i ? {
										...x,
										...patch
									} : x));
									return /* @__PURE__ */ jsxs("div", {
										style: {
											border: "1px solid var(--ad-border)",
											borderRadius: 8,
											padding: "14px 16px"
										},
										children: [/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: 8,
												marginBottom: 12
											},
											children: [
												/* @__PURE__ */ jsxs("span", {
													style: {
														fontSize: 13,
														fontWeight: 600,
														color: "var(--ad-text)"
													},
													children: ["Slot ", i + 1]
												}),
												/* @__PURE__ */ jsx("span", {
													style: {
														fontSize: 10,
														fontWeight: 700,
														letterSpacing: .5,
														padding: "2px 7px",
														borderRadius: 4,
														background: typeBg,
														color: typeFg
													},
													children: typeLabel
												}),
												/* @__PURE__ */ jsx("button", {
													type: "button",
													style: {
														marginLeft: "auto",
														fontSize: 11,
														color: "var(--ad-danger, #ef4444)",
														background: "none",
														border: "none",
														cursor: "pointer",
														padding: "2px 6px"
													},
													onClick: () => setField("technicalBreakdown", reindexSlots(form.technicalBreakdown.filter((_, j) => j !== i))),
													children: "Remove"
												})
											]
										}), item.cardType === "hero" ? /* @__PURE__ */ jsx(HeroCardFields, {
											item,
											onPatch: (p) => patchItem(p),
											slotIndex: i
										}) : /* @__PURE__ */ jsx(FeatureCardFields, {
											item,
											onPatch: (p) => patchItem(p),
											slotIndex: i
										})]
									}, i);
								}),
								form.technicalBreakdown.length < 5 && /* @__PURE__ */ jsx("button", {
									className: "ad-btn ad-btn--ghost ad-btn--sm",
									style: { alignSelf: "flex-start" },
									onClick: () => setField("technicalBreakdown", [...form.technicalBreakdown, emptySlotItem(form.technicalBreakdown.length)]),
									children: "+ Add Slot"
								})
							]
						}),
						formSection === "gallery" && /* @__PURE__ */ jsxs("div", { children: [(() => {
							const MAX = 20;
							const ALLOWED = new Set([
								"image/jpeg",
								"image/png",
								"image/webp",
								"image/gif"
							]);
							const atMax = form.galleryImages.length >= MAX;
							const savedCount = form.galleryImages.filter((s) => !s.startsWith("data:")).length;
							const newCount = form.galleryImages.length - savedCount;
							const processFiles = (files) => {
								const slots = MAX - form.galleryImages.length;
								if (slots <= 0) return;
								const existingNamesLower = new Set(form.galleryImageNames.map((n) => n.toLowerCase()));
								const duplicates = [];
								const valid = files.filter((f) => {
									if (!ALLOWED.has(f.type) || f.size > 10 * 1024 * 1024) return false;
									if (existingNamesLower.has(f.name.toLowerCase())) {
										duplicates.push(f.name);
										return false;
									}
									return true;
								}).slice(0, slots);
								if (duplicates.length > 0) setGalleryMsg(`Duplicate name${duplicates.length > 1 ? "s" : ""} skipped: ${duplicates.join(", ")}`);
								else setGalleryMsg("");
								if (valid.length === 0) return;
								const newNames = valid.map((f) => f.name);
								Promise.all(valid.map((f) => compressImageClient(f))).then((compressed) => {
									setForm((f) => ({
										...f,
										galleryImages: [...f.galleryImages, ...compressed].slice(0, MAX),
										galleryImageNames: [...f.galleryImageNames, ...newNames].slice(0, MAX)
									}));
								});
							};
							return /* @__PURE__ */ jsxs(Fragment, { children: [
								/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: 13,
										fontWeight: 700,
										color: "var(--ad-text)",
										marginBottom: 4
									},
									children: "Installation Gallery Photos"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										fontSize: 12,
										color: "var(--ad-text3)",
										marginBottom: 14
									},
									children: [
										form.galleryImages.length,
										" / ",
										MAX,
										" photos",
										savedCount > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
											" — ",
											/* @__PURE__ */ jsxs("span", {
												style: { color: "var(--ad-accent)" },
												children: [savedCount, " saved"]
											}),
											newCount > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
												", ",
												newCount,
												" new"
											] })
										] }),
										!atMax && /* @__PURE__ */ jsxs(Fragment, { children: [
											" — ",
											MAX - form.galleryImages.length,
											" remaining"
										] }),
										".",
										" ",
										"Images are compressed automatically."
									]
								}),
								galleryMsg && /* @__PURE__ */ jsx("div", {
									style: {
										fontSize: 12,
										color: "#f97316",
										background: "rgba(249,115,22,0.08)",
										border: "1px solid rgba(249,115,22,0.25)",
										borderRadius: 6,
										padding: "7px 12px",
										marginBottom: 10
									},
									children: galleryMsg
								}),
								/* @__PURE__ */ jsxs("div", {
									className: `ad-image-drop${atMax ? " is-disabled" : ""}`,
									style: {
										marginBottom: 16,
										minHeight: 72
									},
									onClick: () => {
										if (!atMax) document.getElementById("gallery-img-input")?.click();
									},
									onDragOver: (e) => {
										if (!atMax) e.preventDefault();
									},
									onDrop: (e) => {
										e.preventDefault();
										processFiles(Array.from(e.dataTransfer.files ?? []));
									},
									children: [/* @__PURE__ */ jsx("input", {
										id: "gallery-img-input",
										type: "file",
										accept: "image/jpeg,image/png,image/webp,image/gif",
										multiple: true,
										hidden: true,
										onChange: (e) => {
											const files = Array.from(e.target.files ?? []);
											e.target.value = "";
											processFiles(files);
										}
									}), atMax ? /* @__PURE__ */ jsxs("span", { children: [
										"Maximum of ",
										MAX,
										" photos reached"
									] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
										/* @__PURE__ */ jsx("span", { children: "Click or drag & drop to add multiple images" }),
										/* @__PURE__ */ jsx("br", {}),
										/* @__PURE__ */ jsxs("small", { children: [
											"JPEG, PNG, WebP — max 10 MB each — select up to ",
											MAX - form.galleryImages.length,
											" more"
										] })
									] })]
								})
							] });
						})(), form.galleryImages.length > 0 && /* @__PURE__ */ jsx("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
								gap: 8
							},
							children: form.galleryImages.map((src, i) => {
								const isSaved = !src.startsWith("data:");
								return /* @__PURE__ */ jsxs("div", {
									style: {
										position: "relative",
										aspectRatio: "4/3"
									},
									children: [
										/* @__PURE__ */ jsx("img", {
											src,
											alt: `Gallery ${i + 1}`,
											style: {
												width: "100%",
												height: "100%",
												objectFit: "cover",
												borderRadius: 6,
												border: `1px solid ${isSaved ? "var(--ad-accent)" : "var(--ad-border)"}`
											}
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												position: "absolute",
												top: 2,
												left: 2,
												background: isSaved ? "var(--ad-accent)" : "rgba(0,0,0,0.6)",
												color: "#fff",
												borderRadius: 3,
												fontSize: 9,
												fontWeight: 700,
												padding: "1px 5px",
												letterSpacing: "0.04em",
												pointerEvents: "none"
											},
											children: isSaved ? "SAVED" : "NEW"
										}),
										form.galleryImageNames[i] && /* @__PURE__ */ jsx("div", {
											style: {
												position: "absolute",
												bottom: 2,
												left: 2,
												right: 22,
												background: "rgba(0,0,0,0.65)",
												color: "#ccc",
												borderRadius: 3,
												fontSize: 8,
												padding: "1px 4px",
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
												pointerEvents: "none"
											},
											children: form.galleryImageNames[i]
										}),
										/* @__PURE__ */ jsx("button", {
											onClick: () => setForm((f) => ({
												...f,
												galleryImages: f.galleryImages.filter((_, j) => j !== i),
												galleryImageNames: f.galleryImageNames.filter((_, j) => j !== i)
											})),
											style: {
												position: "absolute",
												top: 2,
												right: 2,
												background: "rgba(0,0,0,0.7)",
												border: "none",
												color: "#fff",
												borderRadius: 4,
												width: 20,
												height: 20,
												cursor: "pointer",
												fontSize: 11,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												padding: 0
											},
											"aria-label": "Remove photo",
											children: "✕"
										})
									]
								}, i);
							})
						})] }),
						formSection === "testimonial" && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: 10,
								marginBottom: 20
							},
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								id: "testimonial-toggle",
								checked: form.testimonial !== null,
								onChange: (e) => setField("testimonial", e.target.checked ? {
									clientName: "",
									clientRole: "",
									quote: ""
								} : null),
								style: {
									width: 16,
									height: 16,
									cursor: "pointer",
									accentColor: "var(--ad-accent)"
								}
							}), /* @__PURE__ */ jsx("label", {
								htmlFor: "testimonial-toggle",
								style: {
									fontSize: 14,
									color: "var(--ad-text)",
									cursor: "pointer",
									fontWeight: 600
								},
								children: "Add a client testimonial"
							})]
						}), form.testimonial !== null && /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								flexDirection: "column",
								gap: 14
							},
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "ad-label",
									children: "Client Name"
								}), /* @__PURE__ */ jsx("input", {
									className: "ad-input",
									value: form.testimonial.clientName,
									onChange: (e) => setField("testimonial", {
										...form.testimonial,
										clientName: e.target.value
									}),
									placeholder: "e.g. Juan dela Cruz"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "ad-label",
									children: "Client Role"
								}), /* @__PURE__ */ jsx("input", {
									className: "ad-input",
									value: form.testimonial.clientRole,
									onChange: (e) => setField("testimonial", {
										...form.testimonial,
										clientRole: e.target.value
									}),
									placeholder: "e.g. Homeowner, Marikina City"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "ad-label",
									children: "Quote"
								}), /* @__PURE__ */ jsx("textarea", {
									className: "ad-input",
									rows: 4,
									value: form.testimonial.quote,
									onChange: (e) => setField("testimonial", {
										...form.testimonial,
										quote: e.target.value
									}),
									placeholder: "Client testimonial text…",
									style: {
										resize: "vertical",
										width: "100%"
									}
								})] })
							]
						})] }),
						/* @__PURE__ */ jsx("div", {
							className: "ad-form-actions",
							children: /* @__PURE__ */ jsx("button", {
								onClick: () => void handleSave(),
								disabled: saving,
								className: "ad-btn",
								children: saving ? "Saving…" : editingId ? "Update Project" : "Create Project"
							})
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						width: 320,
						flexShrink: 0,
						borderLeft: "1px solid var(--ad-border)",
						paddingLeft: 24,
						position: "sticky",
						top: 0,
						alignSelf: "flex-start"
					},
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 10,
							fontWeight: 700,
							letterSpacing: "0.09em",
							textTransform: "uppercase",
							color: "var(--ad-text3)",
							marginBottom: 12
						},
						children: "Live Preview"
					}), /* @__PURE__ */ jsx(ProjectLivePreview, {
						form,
						imagePreview
					})]
				})]
			})
		}),
		loading ? /* @__PURE__ */ jsx("div", {
			style: {
				color: "var(--ad-text2)",
				padding: 24
			},
			children: "Loading projects…"
		}) : projects.length === 0 ? /* @__PURE__ */ jsxs("div", {
			className: "ad-card",
			style: {
				textAlign: "center",
				padding: "48px 24px"
			},
			children: [/* @__PURE__ */ jsx("div", {
				style: {
					fontSize: 15,
					color: "var(--ad-text2)",
					marginBottom: 8
				},
				children: "No projects yet"
			}), /* @__PURE__ */ jsx("div", {
				style: {
					fontSize: 13,
					color: "var(--ad-text3)"
				},
				children: "Click \"+ Add Project\" to publish your first installation."
			})]
		}) : /* @__PURE__ */ jsx("div", {
			className: "ad-table-wrap",
			children: /* @__PURE__ */ jsxs("table", {
				className: "ad-table",
				children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", { children: "Title" }),
					/* @__PURE__ */ jsx("th", { children: "Category" }),
					/* @__PURE__ */ jsx("th", { children: "System" }),
					/* @__PURE__ */ jsx("th", { children: "Savings" }),
					/* @__PURE__ */ jsx("th", {
						style: {
							width: 60,
							textAlign: "center"
						},
						children: "Video"
					}),
					/* @__PURE__ */ jsx("th", { children: "Recent" }),
					/* @__PURE__ */ jsx("th", { children: "Status" }),
					/* @__PURE__ */ jsx("th", { children: "Created" }),
					/* @__PURE__ */ jsx("th", { children: "Actions" })
				] }) }), /* @__PURE__ */ jsx("tbody", { children: projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((p) => /* @__PURE__ */ jsxs("tr", {
					style: { opacity: p.isPublished ? 1 : .6 },
					children: [
						/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", {
							className: "ad-proj-title-cell",
							children: [p.imageUrl && /* @__PURE__ */ jsx("img", {
								src: p.imageUrl,
								alt: p.title,
								className: "ad-proj-thumb"
							}), /* @__PURE__ */ jsx("span", {
								style: { fontWeight: 600 },
								children: p.title
							})]
						}) }),
						/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", {
							className: `ad-badge ${categoryClass(p.category)}`,
							children: p.category
						}) }),
						/* @__PURE__ */ jsx("td", { children: p.system }),
						/* @__PURE__ */ jsx("td", { children: p.savings }),
						/* @__PURE__ */ jsx("td", {
							style: { textAlign: "center" },
							children: p.videoUrl ? /* @__PURE__ */ jsx("span", {
								style: {
									color: "#22c55e",
									fontSize: 13
								},
								children: "✓"
							}) : /* @__PURE__ */ jsx("span", {
								style: { color: "var(--ad-text3)" },
								children: "—"
							})
						}),
						/* @__PURE__ */ jsx("td", { children: p.isRecent ? /* @__PURE__ */ jsx("span", {
							className: "ad-badge is-recent",
							children: "Recent"
						}) : /* @__PURE__ */ jsx("span", {
							style: { color: "var(--ad-text3)" },
							children: "—"
						}) }),
						/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", {
							className: `ad-badge ${p.isPublished ? "is-published" : "is-draft"}`,
							children: p.isPublished ? "Published" : "Draft"
						}) }),
						/* @__PURE__ */ jsx("td", {
							style: { fontSize: 12 },
							children: new Date(p.createdAt).toLocaleDateString()
						}),
						/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", {
							className: "ad-table-actions",
							children: [
								/* @__PURE__ */ jsx("button", {
									onClick: () => setPreviewProject(p),
									className: "ad-btn ad-btn--ghost ad-btn--sm",
									children: "View"
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => openEdit(p),
									className: "ad-btn ad-btn--ghost ad-btn--sm",
									children: "Edit"
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => handleTogglePublish(p),
									disabled: publishing === p.id,
									className: p.isPublished ? "ad-btn ad-btn--ghost ad-btn--sm" : "ad-btn ad-btn--sm",
									style: { opacity: publishing === p.id ? .5 : 1 },
									children: publishing === p.id ? "…" : p.isPublished ? "Unpublish" : "Publish"
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => setDeleteTarget({
										id: p.id,
										title: p.title
									}),
									disabled: deleting === p.id,
									className: "ad-btn ad-btn--danger ad-btn--sm",
									style: { opacity: deleting === p.id ? .5 : 1 },
									children: deleting === p.id ? "…" : "Delete"
								})
							]
						}) })
					]
				}, p.id)) })]
			})
		})
	] });
}
var SECTION_INFO = [
	{
		key: "hero",
		name: "Hero",
		desc: "Main hero banner with headline"
	},
	{
		key: "metrics",
		name: "Metrics",
		desc: "Stats strip (installs, warranty, savings…)"
	},
	{
		key: "benefits",
		name: "Benefits",
		desc: "Benefits banner row"
	},
	{
		key: "excellence",
		name: "Engineered Excellence",
		desc: "Products & quality section"
	},
	{
		key: "tropics",
		name: "Tropics",
		desc: "Designed for the tropics section"
	},
	{
		key: "process",
		name: "Process",
		desc: "Step-by-step process section"
	},
	{
		key: "clientJourney",
		name: "Client Journey",
		desc: "Testimonials map carousel"
	},
	{
		key: "calculator",
		name: "Calculator",
		desc: "Solar impact calculator"
	},
	{
		key: "callToAction",
		name: "Call to Action",
		desc: "Final CTA section"
	},
	{
		key: "packages",
		name: "Packages Page",
		desc: "Public /packages route — hides nav link and redirects when off"
	}
];
function SectionsManager({ apiKey }) {
	const [vis, setVis] = useState(DEFAULT_VISIBILITY);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [msg, setMsg] = useState("");
	useEffect(() => {
		const load = async () => {
			try {
				const item = (await adminGetAllContent(apiKey)).data.find((i) => i.key === "section-visibility");
				if (item?.data) setVis({
					...DEFAULT_VISIBILITY,
					...item.data
				});
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);
	const handleSave = async () => {
		setSaving(true);
		setMsg("");
		try {
			await adminUpsertContent(apiKey, "section-visibility", vis);
			setMsg("✓ Section visibility saved");
		} catch (e) {
			setMsg(`Error: ${e.message}`);
		} finally {
			setSaving(false);
		}
	};
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: {
			color: "var(--ad-text2)",
			padding: 24
		},
		children: "Loading…"
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx("div", {
			className: "ad-section-header",
			children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
				className: "ad-section-title",
				children: "Section Visibility"
			}), /* @__PURE__ */ jsx("div", {
				style: {
					fontSize: 13,
					color: "var(--ad-text2)",
					marginTop: 4
				},
				children: "Toggle which sections are shown on the public website."
			})] })
		}),
		/* @__PURE__ */ jsx("div", {
			className: "ad-sections-grid",
			children: SECTION_INFO.map(({ key, name, desc }) => /* @__PURE__ */ jsxs("div", {
				className: `ad-section-toggle-card${vis[key] ? " is-enabled" : ""}`,
				children: [/* @__PURE__ */ jsxs("div", {
					className: "ad-section-toggle-info",
					children: [/* @__PURE__ */ jsx("div", {
						className: "ad-section-toggle-name",
						children: name
					}), /* @__PURE__ */ jsx("div", {
						className: "ad-section-toggle-desc",
						children: desc
					})]
				}), /* @__PURE__ */ jsxs("label", {
					className: "ad-toggle-switch",
					children: [/* @__PURE__ */ jsx("input", {
						type: "checkbox",
						checked: vis[key],
						onChange: (e) => setVis((v) => ({
							...v,
							[key]: e.target.checked
						}))
					}), /* @__PURE__ */ jsx("span", { className: "ad-toggle-track" })]
				})]
			}, key))
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "ad-sections-save-bar",
			children: [/* @__PURE__ */ jsx("button", {
				onClick: () => void handleSave(),
				disabled: saving,
				className: "ad-btn",
				children: saving ? "Saving…" : "Save Changes"
			}), /* @__PURE__ */ jsx(Toast, { msg })]
		})
	] });
}
var EMPTY_PKG_FORM = {
	name: "",
	solarKwp: 0,
	inverterKw: 0,
	storageKwh: 0,
	phase: "single",
	billRangeMin: 0,
	billRangeMax: 0,
	isActive: true,
	isRecommended: false,
	sortOrder: 1,
	mainFeatures: [],
	imageUrl: null
};
var ACCESSORY_CATEGORIES = [
	"Mounting & Racking",
	"Wiring & Protection",
	"Monitoring",
	"Others"
];
function EditableNumber({ value, min = 1, max = null, onChange, className, style }) {
	const [draft, setDraft] = useState(null);
	return /* @__PURE__ */ jsx("input", {
		type: "text",
		inputMode: "numeric",
		className,
		style,
		value: draft !== null ? draft : String(value),
		onFocus: (e) => {
			setDraft(String(value));
			e.currentTarget.select();
		},
		onChange: (e) => setDraft(e.target.value.replace(/[^0-9]/g, "")),
		onBlur: () => {
			const n = Math.max(min, parseInt(draft ?? "", 10) || min);
			onChange(max != null ? Math.min(n, max) : n);
			setDraft(null);
		},
		onKeyDown: (e) => {
			if (e.key === "Enter") e.target.blur();
		}
	});
}
function recomputeDerivedQtys(lines) {
	return lines.map((line) => {
		if (!line.baseComponentId) return line;
		const baseLine = lines.find((l) => l.componentId === line.baseComponentId && !l.baseComponentId);
		if (!baseLine) return {
			...line,
			baseComponentId: null
		};
		return {
			...line,
			quantity: Math.max(1, Math.ceil(baseLine.quantity * (line.multiplier ?? 1)))
		};
	});
}
function autoName(kwp, kw, kwh) {
	const parts = [];
	if (kwp > 0) parts.push(`${kwp.toFixed(2)} kWp`);
	if (kw > 0) parts.push(`${kw.toFixed(1)} kW`);
	if (kwh > 0) parts.push(`${kwh.toFixed(2)} kWh`);
	return parts.length > 0 ? parts.join(" · ") : "Package";
}
function computePackageSpecs(selected, components) {
	let solarKwp = 0, inverterKw = 0, storageKwh = 0;
	selected.forEach((sel) => {
		const comp = components.find((c) => c.id === sel.componentId);
		if (!comp) return;
		if (comp.productionCapacityKwp > 0) solarKwp += comp.productionCapacityKwp * sel.quantity;
		if (comp.loadCapacityKw > 0) inverterKw += comp.loadCapacityKw * sel.quantity;
		if (comp.storageCapacityKwh > 0) storageKwh += comp.storageCapacityKwh * sel.quantity;
	});
	return {
		solarKwp: Math.round(solarKwp * 100) / 100,
		inverterKw: Math.round(inverterKw * 10) / 10,
		storageKwh: Math.round(storageKwh * 100) / 100
	};
}
function computePkgViolations(pkg, editedId, newForm) {
	const violations = [];
	const invLine = pkg.components.find((l) => l.component.category === "Inverter");
	const panelLine = pkg.components.find((l) => l.component.category === "Solar Panel");
	const battLine = pkg.components.find((l) => l.component.category === "Battery");
	if (!invLine) return violations;
	const isEditedInv = invLine.componentId === editedId;
	const invQty = invLine.quantity;
	const pvMax = isEditedInv ? newForm.pvMaxPower ?? newForm.loadCapacityKw : invLine.component.pvMaxPower ?? invLine.component.loadCapacityKw;
	const battMax = isEditedInv ? newForm.batteryMaxCapacity ?? newForm.loadCapacityKw : invLine.component.batteryMaxCapacity ?? invLine.component.loadCapacityKw;
	if (panelLine) {
		const panelKwp = panelLine.componentId === editedId ? newForm.productionCapacityKwp ?? 0 : panelLine.component.productionCapacityKwp;
		if (panelKwp > 0 && pvMax != null) {
			const maxPanels = Math.floor(pvMax * invQty / panelKwp);
			if (panelLine.quantity > maxPanels) violations.push(`Panels: ${panelLine.quantity} installed, new max is ${maxPanels} (${(panelLine.quantity * panelKwp).toFixed(2)} kWp > ${(pvMax * invQty).toFixed(2)} kWp limit)`);
		}
	}
	if (battLine) {
		const battKwh = battLine.componentId === editedId ? newForm.storageCapacityKwh ?? 0 : battLine.component.storageCapacityKwh;
		if (battKwh > 0 && battMax != null) {
			const maxBatt = Math.floor(battMax * invQty / battKwh);
			if (battLine.quantity > maxBatt) violations.push(`Batteries: ${battLine.quantity} installed, new max is ${maxBatt} (${(battLine.quantity * battKwh).toFixed(1)} kWh > ${(battMax * invQty).toFixed(1)} kWh limit)`);
		}
	}
	if (isEditedInv) {
		const newParallelMax = newForm.parallelMax ?? 4;
		if (invQty > newParallelMax) violations.push(`Inverters: ${invQty} installed, new parallel limit is ${newParallelMax}`);
	}
	return violations;
}
var COMPONENT_CATEGORIES = [
	"Solar Panel",
	"Inverter",
	"Battery",
	"Mounting & Racking",
	"Wiring & Protection",
	"Monitoring",
	"Others"
];
var EMPTY_COMP = {
	name: "",
	brand: "",
	model: "",
	category: "Solar Panel",
	pricingEnabled: false,
	isActive: true,
	productionCapacityKwp: 0,
	loadCapacityKw: 0,
	storageCapacityKwh: 0,
	capacityUnit: "Wp",
	parallelMin: 1,
	parallelMax: 4,
	perInverterMin: 1,
	perInverterMax: 4,
	pvMinPower: null,
	pvMaxPower: null,
	batteryMaxCapacity: null,
	dataSheetUrl: null
};
function ComponentsManager({ apiKey, onGoToPackages }) {
	const [components, setComponents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [form, setForm] = useState(EMPTY_COMP);
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(null);
	const [msg, setMsg] = useState("");
	const [errors, setErrors] = useState({});
	const [catSearches, setCatSearches] = useState({});
	const [componentPage, setComponentPage] = useState({});
	const [editConfirm, setEditConfirm] = useState(null);
	const [postSaveCleanup, setPostSaveCleanup] = useState(null);
	const [previewComponent, setPreviewComponent] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const clearErr = (f) => setErrors((p) => {
		const c = { ...p };
		delete c[f];
		return c;
	});
	const load = async () => {
		setLoading(true);
		try {
			setComponents((await adminGetComponents(apiKey)).data);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		load();
	}, []);
	useEffect(() => {
		if (!msg) return;
		const isSuccess = msg.startsWith("✓");
		const timeout = setTimeout(() => setMsg(""), isSuccess ? 1500 : 3e3);
		return () => clearTimeout(timeout);
	}, [msg]);
	const setF = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	const openAdd = () => {
		setEditingId(null);
		setForm(EMPTY_COMP);
		setCatSearches({});
		setMsg("");
		setShowForm(true);
	};
	const openEdit = (c) => {
		setEditingId(c.id);
		const spec = CATEGORY_SPEC[c.category];
		const unit = c.capacityUnit && spec?.offer.includes(c.capacityUnit) ? c.capacityUnit : spec?.default ?? null;
		const hasPricing = c.pricingEnabled && c.unitPrice != null;
		setForm({
			name: c.name,
			brand: c.brand,
			model: c.model,
			category: c.category,
			unitPrice: c.unitPrice ?? void 0,
			pricingEnabled: hasPricing,
			isActive: c.isActive,
			productionCapacityKwp: c.productionCapacityKwp ?? 0,
			loadCapacityKw: c.loadCapacityKw ?? 0,
			storageCapacityKwh: c.storageCapacityKwh ?? 0,
			capacityUnit: unit,
			parallelMin: c.parallelMin ?? 1,
			parallelMax: c.parallelMax ?? 4,
			perInverterMin: c.perInverterMin ?? 1,
			perInverterMax: c.perInverterMax ?? 4,
			pvMinPower: c.pvMinPower ?? null,
			pvMaxPower: c.pvMaxPower ?? null,
			batteryMaxCapacity: c.batteryMaxCapacity ?? null,
			dataSheetUrl: c.dataSheetUrl?.trim() || null
		});
		setMsg("");
		setEditConfirm(null);
		setShowForm(true);
	};
	const closeForm = () => {
		setShowForm(false);
		setCatSearches({});
		setMsg("");
		setErrors({});
		setEditConfirm(null);
		setPostSaveCleanup(null);
	};
	const handleSave = async (bypassConfirm = false) => {
		const errs = {};
		if (!form.name.trim()) errs.name = "Name is required.";
		if (!form.brand.trim()) errs.brand = "Brand is required.";
		if (!form.model.trim()) errs.model = "Model is required.";
		if (form.category === "Solar Panel" && (!form.productionCapacityKwp || form.productionCapacityKwp <= 0)) errs.capacity = "Production capacity must be greater than 0 kWp.";
		if (form.category === "Inverter" && (!form.loadCapacityKw || form.loadCapacityKw <= 0)) errs.capacity = "Load capacity must be greater than 0 kW.";
		if (form.category === "Battery" && (!form.storageCapacityKwh || form.storageCapacityKwh <= 0)) errs.capacity = "Storage capacity must be greater than 0 kWh.";
		if (form.pricingEnabled && (form.unitPrice == null || form.unitPrice <= 0)) errs.unitPrice = "Unit price must be greater than 0 when pricing is enabled.";
		if (Object.keys(errs).length > 0) {
			setErrors(errs);
			scrollToFirstError();
			return;
		}
		setErrors({});
		if (editingId && !bypassConfirm) {
			setSaving(true);
			try {
				const usage = await adminGetComponentUsage(apiKey, editingId);
				if (usage.data.length > 0) {
					const oldComp = components.find((c) => c.id === editingId);
					const ratingChanged = !oldComp || form.category === "Inverter" && ((form.pvMaxPower ?? null) !== (oldComp.pvMaxPower ?? null) || (form.pvMinPower ?? null) !== (oldComp.pvMinPower ?? null) || (form.batteryMaxCapacity ?? null) !== (oldComp.batteryMaxCapacity ?? null) || form.loadCapacityKw !== oldComp.loadCapacityKw || (form.parallelMax ?? 4) !== (oldComp.parallelMax ?? 4)) || form.category === "Solar Panel" && form.productionCapacityKwp !== oldComp.productionCapacityKwp || form.category === "Battery" && form.storageCapacityKwh !== oldComp.storageCapacityKwh;
					setEditConfirm(usage.data.map((pkg) => ({
						id: pkg.id,
						name: pkg.name,
						isActive: pkg.isActive,
						violations: ratingChanged ? computePkgViolations(pkg, editingId, form) : [],
						components: pkg.components
					})));
					return;
				}
			} catch {} finally {
				setSaving(false);
			}
		}
		setSaving(true);
		setMsg("");
		try {
			const spec = CATEGORY_SPEC[form.category];
			const payload = {
				...form,
				unitPrice: form.pricingEnabled ? form.unitPrice : void 0,
				capacityUnit: spec ? form.capacityUnit ?? spec.default : null,
				dataSheetUrl: form.dataSheetUrl?.trim() || null
			};
			const affectedPackages = editConfirm ?? [];
			const violatedPackages = affectedPackages.filter((p) => p.violations.length > 0);
			if (editingId) {
				await adminUpdateComponent(apiKey, editingId, payload);
				if (violatedPackages.length > 0) {
					const cleanResults = [];
					for (const pkg of violatedPackages) {
						const toRemove = /* @__PURE__ */ new Set();
						pkg.violations.forEach((v) => {
							if (v.startsWith("Panels:")) toRemove.add("Solar Panel");
							if (v.startsWith("Batteries:")) toRemove.add("Battery");
							if (v.startsWith("Inverters:")) toRemove.add("Inverter");
						});
						const keptComponents = pkg.components.filter((l) => !toRemove.has(l.component.category)).map((l) => ({
							componentId: l.componentId,
							quantity: l.quantity,
							baseComponentId: l.baseComponentId ?? null,
							multiplier: l.multiplier ?? 1
						}));
						try {
							await adminUpdatePackage(apiKey, pkg.id, { components: keptComponents });
							cleanResults.push({
								id: pkg.id,
								name: pkg.name,
								removed: [...toRemove]
							});
						} catch (err) {
							cleanResults.push({
								id: pkg.id,
								name: pkg.name,
								removed: [...toRemove],
								error: err.message
							});
						}
					}
					setEditConfirm(null);
					await load();
					setMsg(`✓ Component updated — ${cleanResults.length} package${cleanResults.length !== 1 ? "s" : ""} cleaned up`);
					setPostSaveCleanup(cleanResults);
				} else if (affectedPackages.length > 0) {
					setEditConfirm(null);
					await load();
					setMsg(`✓ Component updated — review ${affectedPackages.length} affected package${affectedPackages.length !== 1 ? "s" : ""}: ${affectedPackages.map((p) => p.name).join(", ")}`);
					setTimeout(closeForm, 3e3);
				} else {
					setEditConfirm(null);
					await load();
					setMsg("✓ Component updated successfully");
					setTimeout(closeForm, 1500);
				}
			} else {
				await adminCreateComponent(apiKey, payload);
				setMsg("✓ Component added to inventory");
				setEditConfirm(null);
				await load();
				setTimeout(closeForm, 1500);
			}
		} catch (e) {
			const errorMsg = e.message;
			if (errorMsg.includes("409") || errorMsg.includes("conflict")) setMsg("This component already exists in your inventory");
			else setMsg(`Save failed: ${errorMsg}`);
		} finally {
			setSaving(false);
		}
	};
	const handleDelete = async (id, name) => {
		const usage = await adminGetComponentUsage(apiKey, id).catch(() => ({ data: [] }));
		if (usage.data.length > 0) {
			const packageList = usage.data.map((p) => `"${p.name}"`).join(", ");
			setMsg(`Cannot delete "${name}" — it is used in ${usage.data.length} package${usage.data.length !== 1 ? "s" : ""}: ${packageList}. Remove it from those packages first.`);
			return;
		}
		setDeleteTarget({
			id,
			name
		});
	};
	const confirmDelete = async () => {
		if (!deleteTarget) return;
		setDeleting(deleteTarget.id);
		try {
			await adminDeleteComponent(apiKey, deleteTarget.id);
			setMsg("✓ Component deleted");
			await load();
		} catch (e) {
			setMsg(`Delete failed: ${e.message}`);
		} finally {
			setDeleting(null);
			setDeleteTarget(null);
		}
	};
	const grouped = COMPONENT_CATEGORIES.map((cat) => ({
		cat,
		items: components.filter((c) => c.category === cat)
	})).filter((g) => g.items.length > 0);
	const pesoCmp = (n) => n == null ? "—" : `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "ad-section-header",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
				className: "ad-section-title",
				children: "Solar Component Inventory"
			}), /* @__PURE__ */ jsx("div", {
				className: "ad-section-sub",
				children: loading ? "Loading…" : `${components.length} total — manage your solar panels, inverters, batteries, and accessories here. These components are used to build packages.`
			})] }), /* @__PURE__ */ jsx("div", {
				style: {
					display: "flex",
					gap: 8
				},
				children: !showForm && /* @__PURE__ */ jsx("button", {
					onClick: openAdd,
					className: "ad-btn ad-btn--sm",
					children: "+ Add Component"
				})
			})]
		}),
		/* @__PURE__ */ jsx(ConfirmDeleteModal, {
			open: !!deleteTarget,
			title: `Delete "${deleteTarget?.name}"?`,
			description: "This component will be permanently removed.",
			onConfirm: () => void confirmDelete(),
			onCancel: () => setDeleteTarget(null),
			confirming: !!deleting
		}),
		previewComponent && /* @__PURE__ */ jsx(AdminModal, {
			open: !!previewComponent,
			onClose: () => setPreviewComponent(null),
			title: previewComponent.name,
			subtitle: `${previewComponent.brand} · ${previewComponent.model} · ${previewComponent.category}`,
			children: /* @__PURE__ */ jsxs("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: "12px 20px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Name"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)",
							fontWeight: 600
						},
						children: previewComponent.name
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Category"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewComponent.category
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Brand"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewComponent.brand
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Model"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewComponent.model
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Unit"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewComponent.unit || "—"
					})] }),
					previewComponent.pricingEnabled && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Unit Price"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: pesoCmp(previewComponent.unitPrice)
					})] }),
					(previewComponent.loadCapacityKw ?? 0) > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Load Capacity"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: [previewComponent.loadCapacityKw, " kW"]
					})] }),
					(previewComponent.productionCapacityKwp ?? 0) > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Production Capacity"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: [previewComponent.productionCapacityKwp, " kWp"]
					})] }),
					(previewComponent.storageCapacityKwh ?? 0) > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Storage Capacity"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: [previewComponent.storageCapacityKwh, " kWh"]
					})] }),
					previewComponent.pvMinPower != null && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Min PV Input"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: [previewComponent.pvMinPower, " kWp"]
					})] }),
					previewComponent.pvMaxPower != null && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Max PV Input"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: [previewComponent.pvMaxPower, " kWp"]
					})] }),
					previewComponent.batteryMaxCapacity != null && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Max Battery Capacity"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: [previewComponent.batteryMaxCapacity, " kWh/unit"]
					})] }),
					(previewComponent.parallelMin ?? 0) > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Parallel Min / Max"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: [
							previewComponent.parallelMin,
							" / ",
							previewComponent.parallelMax
						]
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Active"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: previewComponent.isActive ? "#22c55e" : "var(--ad-text3)"
						},
						children: previewComponent.isActive ? "Yes" : "No"
					})] }),
					previewComponent.dataSheetUrl && /* @__PURE__ */ jsxs("div", {
						style: { gridColumn: "1 / -1" },
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontSize: 11,
								fontWeight: 700,
								color: "var(--ad-text3)",
								textTransform: "uppercase",
								letterSpacing: "0.07em",
								marginBottom: 3
							},
							children: "Data Sheet"
						}), /* @__PURE__ */ jsx("div", {
							style: { fontSize: 14 },
							children: /* @__PURE__ */ jsx("a", {
								href: previewComponent.dataSheetUrl,
								target: "_blank",
								rel: "noopener noreferrer",
								style: { color: "var(--ad-accent)" },
								children: previewComponent.dataSheetUrl
							})
						})]
					})
				]
			})
		}),
		msg && /* @__PURE__ */ jsx(Toast, { msg }),
		showForm && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", {
			style: {
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				background: "rgba(0, 0, 0, 0.5)",
				zIndex: 999,
				display: "flex",
				alignItems: "flex-start",
				justifyContent: "center",
				padding: "16px",
				overflow: "auto",
				paddingTop: "max(16px, 10vh)"
			},
			onClick: closeForm,
			children: /* @__PURE__ */ jsxs("div", {
				style: {
					background: "var(--ad-bg)",
					borderRadius: 8,
					boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
					width: "100%",
					maxWidth: "min(90vw, 650px)",
					maxHeight: "85vh",
					overflow: "auto",
					zIndex: 1e3,
					display: "flex",
					flexDirection: "column"
				},
				onClick: (e) => e.stopPropagation(),
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						padding: "16px 20px",
						borderBottom: "1px solid var(--ad-border)",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 12,
						flexShrink: 0,
						position: "sticky",
						top: 0,
						background: "var(--ad-bg)",
						zIndex: 10
					},
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: "clamp(14px, 4vw, 18px)",
							fontWeight: 700,
							color: "var(--ad-text)",
							minWidth: 0,
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap"
						},
						children: editingId ? "Edit Component" : "Add Component"
					}), /* @__PURE__ */ jsx("button", {
						onClick: closeForm,
						style: {
							background: "none",
							border: "none",
							fontSize: "24px",
							color: "var(--ad-text3)",
							cursor: "pointer",
							padding: 0,
							width: 32,
							height: 32,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexShrink: 0,
							transition: "color 0.15s"
						},
						onMouseEnter: (e) => e.currentTarget.style.color = "var(--ad-accent)",
						onMouseLeave: (e) => e.currentTarget.style.color = "var(--ad-text3)",
						children: "✕"
					})]
				}), /* @__PURE__ */ jsx("div", {
					style: {
						padding: "clamp(12px, 4vw, 20px)",
						overflow: "auto",
						flex: 1,
						display: "flex",
						flexDirection: "column"
					},
					children: postSaveCleanup ? /* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("div", {
							style: {
								fontSize: 14,
								fontWeight: 700,
								color: "#22c55e",
								marginBottom: 8
							},
							children: "✓ Component updated"
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								fontSize: 13,
								color: "var(--ad-text2)",
								marginBottom: 14,
								lineHeight: 1.5
							},
							children: [
								"Out-of-bounds components were automatically removed from ",
								postSaveCleanup.length,
								" package",
								postSaveCleanup.length !== 1 ? "s" : "",
								". Open each package to reconfigure the quantities."
							]
						}),
						postSaveCleanup.map((r) => /* @__PURE__ */ jsxs("div", {
							style: {
								marginBottom: 8,
								padding: "10px 12px",
								background: r.error ? "rgba(220,38,38,0.06)" : "rgba(34,197,94,0.06)",
								border: `1px solid ${r.error ? "rgba(220,38,38,0.22)" : "rgba(34,197,94,0.2)"}`,
								borderRadius: 6
							},
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontSize: 13,
									fontWeight: 600,
									color: "var(--ad-text)",
									marginBottom: 3
								},
								children: r.name
							}), r.error ? /* @__PURE__ */ jsxs("div", {
								style: {
									fontSize: 12,
									color: "#dc2626"
								},
								children: ["⚠ Failed to update: ", r.error]
							}) : /* @__PURE__ */ jsxs("div", {
								style: {
									fontSize: 12,
									color: "var(--ad-text3)"
								},
								children: ["Removed: ", r.removed.join(", ")]
							})]
						}, r.id)),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								gap: 8,
								marginTop: 16,
								flexWrap: "wrap"
							},
							children: [/* @__PURE__ */ jsx("button", {
								onClick: closeForm,
								className: "ad-btn ad-btn--ghost",
								style: { flex: "1 1 auto" },
								children: "Done"
							}), onGoToPackages && /* @__PURE__ */ jsx("button", {
								onClick: () => {
									onGoToPackages();
									closeForm();
								},
								className: "ad-btn",
								style: { flex: "1 1 auto" },
								children: "Go to Packages →"
							})]
						})
					] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
								gap: "clamp(12px, 3vw, 16px)"
							},
							children: [
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("label", {
										className: "ad-label",
										children: "Name *"
									}),
									/* @__PURE__ */ jsx("input", {
										className: `ad-input${errors.name ? " ad-input--error" : ""}`,
										value: form.name,
										onChange: (e) => {
											setF("name", e.target.value);
											clearErr("name");
										},
										placeholder: "410W Monocrystalline Panel"
									}),
									errors.name && /* @__PURE__ */ jsx("span", {
										className: "ad-field-error",
										"data-field-error": true,
										children: errors.name
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("label", {
										className: "ad-label",
										children: "Brand *"
									}),
									/* @__PURE__ */ jsx("input", {
										className: `ad-input${errors.brand ? " ad-input--error" : ""}`,
										value: form.brand,
										onChange: (e) => {
											setF("brand", e.target.value);
											clearErr("brand");
										},
										placeholder: "Canadian Solar"
									}),
									errors.brand && /* @__PURE__ */ jsx("span", {
										className: "ad-field-error",
										"data-field-error": true,
										children: errors.brand
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("label", {
										className: "ad-label",
										children: "Model *"
									}),
									/* @__PURE__ */ jsx("input", {
										className: `ad-input${errors.model ? " ad-input--error" : ""}`,
										value: form.model,
										onChange: (e) => {
											setF("model", e.target.value);
											clearErr("model");
										},
										placeholder: "CS6R-410MS"
									}),
									errors.model && /* @__PURE__ */ jsx("span", {
										className: "ad-field-error",
										"data-field-error": true,
										children: errors.model
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "ad-label",
									children: "Category"
								}), /* @__PURE__ */ jsx("select", {
									className: "ad-select",
									value: form.category,
									onChange: (e) => {
										const cat = e.target.value;
										const spec = CATEGORY_SPEC[cat];
										setForm((f) => ({
											...f,
											category: cat,
											capacityUnit: spec ? f.capacityUnit && spec.offer.includes(f.capacityUnit) ? f.capacityUnit : spec.default : null
										}));
									},
									children: COMPONENT_CATEGORIES.map((c) => /* @__PURE__ */ jsx("option", {
										value: c,
										children: c
									}, c))
								})] }),
								CATEGORY_SPEC[form.category] ? (() => {
									const catSpec = CATEGORY_SPEC[form.category];
									const code = form.capacityUnit ?? catSpec.default;
									const canonicalVal = form[catSpec.field];
									const factor = unitFactor(catSpec.dimension, code);
									const step = factor < 1 ? "1" : factor === 1 ? "0.01" : "0.001";
									return /* @__PURE__ */ jsxs("div", {
										style: {
											borderTop: "1px solid var(--ad-border)",
											paddingTop: "clamp(12px, 2vw, 16px)",
											marginTop: "clamp(12px, 2vw, 16px)",
											gridColumn: "1 / -1"
										},
										children: [/* @__PURE__ */ jsxs("div", {
											style: {
												fontSize: "clamp(11px, 2vw, 12px)",
												fontWeight: 600,
												color: "var(--ad-text3)",
												textTransform: "uppercase",
												letterSpacing: "0.06em",
												marginBottom: 12
											},
											children: ["Component Specifications ", /* @__PURE__ */ jsx("span", {
												style: { color: "#fc615a" },
												children: "*"
											})]
										}), /* @__PURE__ */ jsx("div", {
											style: {
												display: "grid",
												gridTemplateColumns: "1fr",
												gap: "clamp(8px, 2vw, 12px)"
											},
											children: /* @__PURE__ */ jsxs("div", { children: [
												/* @__PURE__ */ jsxs("label", {
													className: "ad-label",
													children: [
														catSpec.label,
														" ",
														/* @__PURE__ */ jsx("span", {
															style: { color: "#fc615a" },
															children: "*"
														})
													]
												}),
												/* @__PURE__ */ jsxs("div", {
													style: {
														display: "flex",
														gap: 8
													},
													children: [/* @__PURE__ */ jsx("input", {
														type: "number",
														className: `ad-input${errors.capacity ? " ad-input--error" : ""}`,
														style: { flex: 1 },
														value: canonicalVal ? String(fromCanonical(canonicalVal, catSpec.dimension, code)) : "",
														step,
														min: "0",
														onChange: (e) => {
															setF(catSpec.field, e.target.value === "" ? 0 : toCanonical(Number(e.target.value), catSpec.dimension, code));
															clearErr("capacity");
														},
														placeholder: String(fromCanonical(catSpec.example, catSpec.dimension, code)),
														required: true
													}), /* @__PURE__ */ jsx("select", {
														className: "ad-select",
														style: {
															width: 90,
															flexShrink: 0
														},
														value: code,
														onChange: (e) => setF("capacityUnit", e.target.value),
														children: catSpec.offer.map((u) => /* @__PURE__ */ jsx("option", {
															value: u,
															children: u
														}, u))
													})]
												}),
												errors.capacity && /* @__PURE__ */ jsx("span", {
													className: "ad-field-error",
													"data-field-error": true,
													children: errors.capacity
												}),
												/* @__PURE__ */ jsxs("small", {
													style: {
														fontSize: 11,
														color: "var(--ad-text3)",
														marginTop: 4
													},
													children: [
														catSpec.helper,
														" · stored as ",
														canonicalVal ? `${canonicalVal} ${catSpec.canonicalLabel}` : catSpec.canonicalLabel
													]
												})
											] })
										})]
									});
								})() : /* @__PURE__ */ jsxs("div", {
									style: {
										borderTop: "1px solid var(--ad-border)",
										paddingTop: "clamp(12px, 2vw, 16px)",
										marginTop: "clamp(12px, 2vw, 16px)",
										gridColumn: "1 / -1"
									},
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "clamp(11px, 2vw, 12px)",
											fontWeight: 600,
											color: "var(--ad-text3)",
											textTransform: "uppercase",
											letterSpacing: "0.06em",
											marginBottom: 8
										},
										children: "Component Type"
									}), /* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: 12,
											color: "var(--ad-text2)",
											padding: "10px 12px",
											background: "rgba(34, 197, 94, 0.1)",
											borderRadius: 6,
											border: "1px solid rgba(34, 197, 94, 0.2)"
										},
										children: ["✓ No specifications required for ", form.category]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: 10,
										paddingTop: "clamp(12px, 2vw, 16px)",
										gridColumn: "1 / -1"
									},
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										id: "comp-pricing",
										checked: form.pricingEnabled,
										onChange: (e) => setF("pricingEnabled", e.target.checked),
										style: {
											width: 16,
											height: 16,
											cursor: "pointer",
											accentColor: "var(--ad-accent)"
										}
									}), /* @__PURE__ */ jsx("label", {
										htmlFor: "comp-pricing",
										style: {
											color: "var(--ad-text)",
											fontSize: 13,
											cursor: "pointer"
										},
										children: "Has pricing (contributes to package total)"
									})]
								}),
								form.pricingEnabled && /* @__PURE__ */ jsxs("div", {
									style: { gridColumn: "1 / -1" },
									children: [
										/* @__PURE__ */ jsxs("label", {
											className: "ad-label",
											children: ["Unit Price (₱) ", /* @__PURE__ */ jsx("span", {
												style: { color: "#fc615a" },
												children: "*"
											})]
										}),
										/* @__PURE__ */ jsx("input", {
											type: "number",
											className: `ad-input${errors.unitPrice ? " ad-input--error" : ""}`,
											value: form.unitPrice ?? "",
											min: 0,
											onChange: (e) => {
												setF("unitPrice", e.target.value ? Number(e.target.value) : void 0);
												clearErr("unitPrice");
											},
											placeholder: "0.00"
										}),
										errors.unitPrice && /* @__PURE__ */ jsx("span", {
											className: "ad-field-error",
											"data-field-error": true,
											children: errors.unitPrice
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: 10,
										paddingTop: "clamp(12px, 2vw, 16px)",
										gridColumn: "1 / -1"
									},
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										id: "comp-active",
										checked: form.isActive,
										onChange: (e) => setF("isActive", e.target.checked),
										style: {
											width: 16,
											height: 16,
											cursor: "pointer",
											accentColor: "var(--ad-accent)"
										}
									}), /* @__PURE__ */ jsx("label", {
										htmlFor: "comp-active",
										style: {
											color: "var(--ad-text)",
											fontSize: 13,
											cursor: "pointer"
										},
										children: "Active"
									})]
								}),
								(form.category === "Inverter" || form.category === "Battery" || form.category === "Solar Panel") && /* @__PURE__ */ jsxs("div", {
									style: {
										gridColumn: "1 / -1",
										borderTop: "1px solid var(--ad-border)",
										paddingTop: "clamp(12px, 2vw, 16px)",
										marginTop: 4
									},
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "clamp(11px, 2vw, 12px)",
											fontWeight: 600,
											color: "var(--ad-text3)",
											textTransform: "uppercase",
											letterSpacing: "0.06em",
											marginBottom: 10
										},
										children: "Quantity Range"
									}), form.category === "Inverter" ? /* @__PURE__ */ jsxs(Fragment, { children: [
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "ad-label",
											children: "Max Parallel Units"
										}), /* @__PURE__ */ jsx("input", {
											type: "number",
											className: "ad-input",
											min: 1,
											max: 1e3,
											value: form.parallelMax ?? 4,
											onChange: (e) => setF("parallelMax", Math.max(1, Number(e.target.value) || 1))
										})] }),
										/* @__PURE__ */ jsx("small", {
											style: {
												fontSize: 11,
												color: "var(--ad-text3)",
												marginTop: 6,
												display: "block"
											},
											children: "How many of this inverter the customer can add to the package. Min is always 1."
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												marginTop: 14,
												borderTop: "1px solid var(--ad-border)",
												paddingTop: 12
											},
											children: [
												/* @__PURE__ */ jsxs("div", {
													style: {
														fontSize: "clamp(11px, 2vw, 12px)",
														fontWeight: 600,
														color: "var(--ad-text3)",
														textTransform: "uppercase",
														letterSpacing: "0.06em",
														marginBottom: 8
													},
													children: ["PV Input Range ", /* @__PURE__ */ jsx("span", {
														style: {
															fontWeight: 400,
															textTransform: "none",
															letterSpacing: "normal"
														},
														children: "(optional — enables physics-based panel bounds)"
													})]
												}),
												/* @__PURE__ */ jsxs("div", {
													style: {
														display: "grid",
														gridTemplateColumns: "1fr 1fr",
														gap: 10
													},
													children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
														className: "ad-label",
														children: "Min PV Input (kWp)"
													}), /* @__PURE__ */ jsx("input", {
														type: "number",
														className: "ad-input",
														min: 0,
														step: "0.1",
														value: form.pvMinPower ?? "",
														placeholder: "e.g. 3.0",
														onChange: (e) => setF("pvMinPower", e.target.value === "" ? null : Number(e.target.value))
													})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
														className: "ad-label",
														children: "Max PV Input (kWp)"
													}), /* @__PURE__ */ jsx("input", {
														type: "number",
														className: "ad-input",
														min: 0,
														step: "0.1",
														value: form.pvMaxPower ?? "",
														placeholder: "e.g. 7.5",
														onChange: (e) => setF("pvMaxPower", e.target.value === "" ? null : Number(e.target.value))
													})] })]
												}),
												/* @__PURE__ */ jsxs("small", {
													style: {
														fontSize: 11,
														color: "var(--ad-text3)",
														marginTop: 4,
														display: "block"
													},
													children: [
														"From the inverter datasheet: \"Max. DC Input Power\" / \"Max. PV Array Power\". When set, panel count is derived from ",
														/* @__PURE__ */ jsx("strong", { children: "floor(pvMax × Q ÷ panelWp)" }),
														" instead of rated output."
													]
												})
											]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												marginTop: 14,
												borderTop: "1px solid var(--ad-border)",
												paddingTop: 12
											},
											children: [
												/* @__PURE__ */ jsxs("div", {
													style: {
														fontSize: "clamp(11px, 2vw, 12px)",
														fontWeight: 600,
														color: "var(--ad-text3)",
														textTransform: "uppercase",
														letterSpacing: "0.06em",
														marginBottom: 8
													},
													children: ["Battery Support ", /* @__PURE__ */ jsx("span", {
														style: {
															fontWeight: 400,
															textTransform: "none",
															letterSpacing: "normal"
														},
														children: "(optional)"
													})]
												}),
												/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
													className: "ad-label",
													children: "Max Battery Capacity (kWh per unit)"
												}), /* @__PURE__ */ jsx("input", {
													type: "number",
													className: "ad-input",
													min: 0,
													step: "0.1",
													value: form.batteryMaxCapacity ?? "",
													placeholder: "e.g. 15.0",
													onChange: (e) => setF("batteryMaxCapacity", e.target.value === "" ? null : Number(e.target.value))
												})] }),
												/* @__PURE__ */ jsxs("small", {
													style: {
														fontSize: 11,
														color: "var(--ad-text3)",
														marginTop: 4,
														display: "block"
													},
													children: [
														"Max battery storage this inverter supports per unit. When set, battery count is derived from ",
														/* @__PURE__ */ jsx("strong", { children: "floor(battMax × Q ÷ moduleKWh)" }),
														"."
													]
												})
											]
										})
									] }) : /* @__PURE__ */ jsx("div", {
										style: {
											fontSize: 12,
											color: "var(--ad-text2)",
											padding: "10px 12px",
											background: "rgba(59, 130, 246, 0.08)",
											borderRadius: 6,
											border: "1px solid rgba(59, 130, 246, 0.2)"
										},
										children: form.category === "Battery" ? /* @__PURE__ */ jsxs(Fragment, { children: [
											"Battery count is derived from the paired inverter's ",
											/* @__PURE__ */ jsx("strong", { children: "Max Battery Capacity" }),
											" field. Configure that on the inverter product."
										] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
											"Panel count is derived from the paired inverter's ",
											/* @__PURE__ */ jsx("strong", { children: "PV Input Range" }),
											" fields. Configure those on the inverter product."
										] })
									})]
								}),
								!ACCESSORY_CATEGORIES.includes(form.category) && /* @__PURE__ */ jsxs("div", {
									style: { gridColumn: "1 / -1" },
									children: [/* @__PURE__ */ jsxs("label", {
										className: "ad-label",
										children: ["Product Data Sheet ", /* @__PURE__ */ jsx("span", {
											style: {
												fontWeight: 400,
												color: "var(--ad-text3)"
											},
											children: "(optional — paste a link to the PDF)"
										})]
									}), /* @__PURE__ */ jsx("input", {
										className: "ad-input",
										value: form.dataSheetUrl ?? "",
										placeholder: "https://…/datasheet.pdf",
										onChange: (e) => setF("dataSheetUrl", e.target.value || null)
									})]
								})
							]
						}),
						editConfirm && (() => {
							const violating = editConfirm.filter((p) => p.violations.length > 0);
							const nonViolating = editConfirm.filter((p) => p.violations.length === 0);
							const hasViolations = violating.length > 0;
							return /* @__PURE__ */ jsxs("div", {
								style: {
									marginTop: "clamp(14px, 3vw, 20px)",
									padding: "14px 16px",
									borderRadius: 8,
									background: hasViolations ? "rgba(220, 38, 38, 0.06)" : "rgba(251, 191, 36, 0.08)",
									border: hasViolations ? "1px solid rgba(220, 38, 38, 0.3)" : "1px solid rgba(251, 191, 36, 0.35)"
								},
								children: [hasViolations ? /* @__PURE__ */ jsxs(Fragment, { children: [
									/* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: 13,
											fontWeight: 700,
											color: "#dc2626",
											marginBottom: 6
										},
										children: [
											"⚠ Rating change will break ",
											violating.length,
											" package",
											violating.length !== 1 ? "s" : ""
										]
									}),
									/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: 12,
											color: "var(--ad-text2)",
											marginBottom: 10,
											lineHeight: 1.5
										},
										children: "The new values push these packages outside their allowed quantity range. Save anyway — you'll be guided to fix them."
									}),
									violating.map((p) => /* @__PURE__ */ jsxs("div", {
										style: {
											marginBottom: 8,
											padding: "8px 10px",
											background: "rgba(220,38,38,0.05)",
											border: "1px solid rgba(220,38,38,0.18)",
											borderRadius: 6
										},
										children: [/* @__PURE__ */ jsxs("div", {
											style: {
												fontSize: 12,
												fontWeight: 600,
												color: "var(--ad-text)",
												marginBottom: 3
											},
											children: [p.name, !p.isActive ? " (inactive)" : ""]
										}), p.violations.map((v, i) => /* @__PURE__ */ jsxs("div", {
											style: {
												fontSize: 11,
												color: "#dc2626",
												lineHeight: 1.5
											},
											children: ["• ", v]
										}, i))]
									}, p.id)),
									nonViolating.length > 0 && /* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: 12,
											color: "var(--ad-text2)",
											marginTop: 8
										},
										children: ["Also affected (no quantity issues): ", nonViolating.map((p) => p.name).join(", ")]
									})
								] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
									/* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: 13,
											fontWeight: 700,
											color: "#f59e0b",
											marginBottom: 6
										},
										children: [
											"⚠ This component is used in ",
											editConfirm.length,
											" package",
											editConfirm.length !== 1 ? "s" : ""
										]
									}),
									/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: 12,
											color: "var(--ad-text2)",
											marginBottom: 10,
											lineHeight: 1.5
										},
										children: "Saving will update the component data. Review each affected package afterwards to make sure its specs and pricing are still aligned."
									}),
									/* @__PURE__ */ jsx("div", {
										style: {
											display: "flex",
											flexWrap: "wrap",
											gap: 6,
											marginBottom: 12
										},
										children: editConfirm.map((p) => /* @__PURE__ */ jsxs("span", {
											style: {
												fontSize: 11,
												padding: "3px 10px",
												borderRadius: 12,
												fontWeight: 600,
												background: p.isActive ? "rgba(34,197,94,0.12)" : "var(--ad-surface)",
												color: p.isActive ? "#22c55e" : "var(--ad-text3)",
												border: `1px solid ${p.isActive ? "rgba(34,197,94,0.3)" : "var(--ad-border)"}`
											},
											children: [p.name, !p.isActive ? " (inactive)" : ""]
										}, p.id))
									})
								] }), /* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										gap: 8,
										flexWrap: "wrap",
										marginTop: hasViolations ? 12 : 0
									},
									children: [/* @__PURE__ */ jsx("button", {
										onClick: () => setEditConfirm(null),
										className: "ad-btn ad-btn--ghost",
										style: {
											flex: "1 1 auto",
											minWidth: 90
										},
										children: "Cancel"
									}), /* @__PURE__ */ jsx("button", {
										onClick: () => void handleSave(true),
										disabled: saving,
										className: "ad-btn",
										style: {
											flex: "1 1 auto",
											minWidth: 140,
											background: hasViolations ? "#dc2626" : "#d97706",
											borderColor: hasViolations ? "#dc2626" : "#d97706"
										},
										children: saving ? "Saving…" : hasViolations ? "Save & Fix Packages" : "Yes, Update Anyway"
									})]
								})]
							});
						})(),
						!editConfirm && /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								gap: "clamp(8px, 2vw, 12px)",
								marginTop: "clamp(16px, 3vw, 20px)",
								flexWrap: "wrap-reverse",
								justifyContent: "flex-end"
							},
							children: [/* @__PURE__ */ jsx("button", {
								onClick: closeForm,
								className: "ad-btn ad-btn--ghost",
								style: {
									flex: "1 1 auto",
									minWidth: "100px"
								},
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => void handleSave(),
								disabled: saving,
								className: "ad-btn",
								style: {
									flex: "1 1 auto",
									minWidth: "120px"
								},
								children: saving ? "Checking…" : editingId ? "Update" : "Add"
							})]
						})
					] })
				})]
			})
		}) }),
		loading ? /* @__PURE__ */ jsx("div", {
			style: {
				color: "var(--ad-text2)",
				padding: 24
			},
			children: "Loading…"
		}) : components.length === 0 ? /* @__PURE__ */ jsxs("div", {
			className: "ad-card",
			style: {
				textAlign: "center",
				padding: "48px 24px"
			},
			children: [
				/* @__PURE__ */ jsx("div", {
					style: {
						fontSize: 15,
						color: "var(--ad-text2)",
						marginBottom: 8
					},
					children: "No components in inventory yet"
				}),
				/* @__PURE__ */ jsx("div", {
					style: {
						fontSize: 13,
						color: "var(--ad-text3)",
						marginBottom: 16
					},
					children: "Click \"+ Add Component\" to start building your inventory. You'll use these to create solar packages."
				}),
				/* @__PURE__ */ jsxs("div", {
					style: {
						fontSize: 12,
						color: "var(--ad-text3)",
						background: "var(--ad-surface)",
						padding: "12px 16px",
						borderRadius: 6,
						textAlign: "left",
						display: "inline-block"
					},
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontWeight: 600,
							marginBottom: 8,
							color: "var(--ad-text)"
						},
						children: "Component Types:"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: 11,
							lineHeight: 1.6
						},
						children: [/* @__PURE__ */ jsxs("div", { children: [
							"☀ ",
							/* @__PURE__ */ jsx("strong", { children: "Solar Panel, ⚡ Inverter, 🔋 Battery" }),
							" — require specifications"
						] }), /* @__PURE__ */ jsxs("div", {
							style: { marginTop: 4 },
							children: [
								"📦 ",
								/* @__PURE__ */ jsx("strong", { children: "Other categories" }),
								" — no specs needed (brackets, wiring, monitoring, etc.)"
							]
						})]
					})]
				})
			]
		}) : grouped.map(({ cat, items }) => {
			const search = catSearches[cat] ?? "";
			const filtered = items.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.brand.toLowerCase().includes(search.toLowerCase()) || c.model.toLowerCase().includes(search.toLowerCase())).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
			if (filtered.length === 0 && !search) return null;
			const itemsPerPage = 20;
			const page = componentPage[cat] ?? 0;
			const maxPages = Math.ceil(Math.max(1, filtered.length) / itemsPerPage);
			const paginatedItems = filtered.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
			return /* @__PURE__ */ jsxs("div", {
				style: { marginBottom: 24 },
				children: [
					/* @__PURE__ */ jsx("div", {
						style: {
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							marginBottom: 12,
							gap: 12
						},
						children: /* @__PURE__ */ jsxs("div", {
							style: {
								fontSize: 11,
								fontWeight: 700,
								color: "var(--ad-text3)",
								letterSpacing: "1.4px",
								textTransform: "uppercase"
							},
							children: [
								{
									"Solar Panel": "☀",
									"Inverter": "⚡",
									"Battery": "🔋",
									"Mounting & Racking": "📦",
									"Wiring & Protection": "🔌",
									"Monitoring": "📊",
									"Others": "📦"
								}[cat] ?? "📦",
								" ",
								cat
							]
						})
					}),
					/* @__PURE__ */ jsx("input", {
						type: "search",
						className: "ad-input",
						placeholder: `Search ${cat}...`,
						value: search,
						onChange: (e) => {
							setCatSearches((s) => ({
								...s,
								[cat]: e.target.value
							}));
							setComponentPage((p) => ({
								...p,
								[cat]: 0
							}));
						},
						style: { marginBottom: 12 }
					}),
					filtered.length === 0 ? /* @__PURE__ */ jsx("div", {
						style: {
							padding: 24,
							textAlign: "center",
							color: "var(--ad-text3)"
						},
						children: search ? "No components match your search" : "No components in this category"
					}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
						className: "ad-table-wrap",
						children: /* @__PURE__ */ jsxs("table", {
							className: "ad-table",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", { children: "Name" }),
								/* @__PURE__ */ jsx("th", {
									style: { width: "15%" },
									children: "Brand / Model"
								}),
								/* @__PURE__ */ jsx("th", {
									style: { width: "8%" },
									children: "Unit"
								}),
								/* @__PURE__ */ jsx("th", {
									style: { width: "10%" },
									children: "Unit Price"
								}),
								/* @__PURE__ */ jsx("th", {
									style: { width: "8%" },
									children: "Pricing"
								}),
								/* @__PURE__ */ jsx("th", {
									style: { width: "10%" },
									children: "Active"
								}),
								/* @__PURE__ */ jsx("th", {
									style: { width: "12%" },
									children: "Actions"
								})
							] }) }), /* @__PURE__ */ jsx("tbody", { children: paginatedItems.map((c) => /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsxs("td", { children: [
									/* @__PURE__ */ jsx("div", {
										style: { fontWeight: 500 },
										children: c.name
									}),
									(c.productionCapacityKwp ?? 0) > 0 && /* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: 10,
											color: "var(--ad-text3)",
											marginTop: 2
										},
										children: [
											"☀ ",
											(c.productionCapacityKwp ?? 0).toFixed(2),
											" kWp"
										]
									}),
									(c.loadCapacityKw ?? 0) > 0 && /* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: 10,
											color: "var(--ad-text3)",
											marginTop: 2
										},
										children: [
											"⚙️ ",
											(c.loadCapacityKw ?? 0).toFixed(1),
											" kW"
										]
									}),
									(c.storageCapacityKwh ?? 0) > 0 && /* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: 10,
											color: "var(--ad-text3)",
											marginTop: 2
										},
										children: [
											"🔋 ",
											(c.storageCapacityKwh ?? 0).toFixed(2),
											" kWh"
										]
									})
								] }),
								/* @__PURE__ */ jsxs("td", {
									style: { fontSize: 12 },
									children: [
										c.brand,
										/* @__PURE__ */ jsx("br", {}),
										/* @__PURE__ */ jsx("span", {
											style: {
												opacity: .6,
												fontSize: 10
											},
											children: c.model
										})
									]
								}),
								/* @__PURE__ */ jsx("td", {
									style: {
										fontSize: 12,
										color: c.unit ? "inherit" : "var(--ad-text3)"
									},
									children: c.unit || "—"
								}),
								/* @__PURE__ */ jsx("td", {
									style: {
										fontFamily: "monospace",
										fontSize: 12
									},
									children: c.pricingEnabled ? pesoCmp(c.unitPrice) : /* @__PURE__ */ jsx("span", {
										style: { opacity: .4 },
										children: "—"
									})
								}),
								/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", {
									style: {
										fontSize: 10,
										fontWeight: 700,
										padding: "2px 8px",
										borderRadius: 99,
										background: c.pricingEnabled ? "rgba(252,97,90,0.12)" : "rgba(255,255,255,0.06)",
										color: c.pricingEnabled ? "#fc615a" : "var(--ad-text3)",
										whiteSpace: "nowrap"
									},
									children: c.pricingEnabled ? "Priced" : "No price"
								}) }),
								/* @__PURE__ */ jsx("td", {
									style: { fontSize: 12 },
									children: /* @__PURE__ */ jsx("span", {
										style: { color: c.isActive ? "#22c55e" : "var(--ad-text3)" },
										children: c.isActive ? "Yes" : "No"
									})
								}),
								/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", {
									className: "ad-table-actions",
									style: {
										display: "flex",
										gap: 4
									},
									children: [
										/* @__PURE__ */ jsx("button", {
											onClick: () => setPreviewComponent(c),
											className: "ad-btn ad-btn--ghost ad-btn--sm",
											style: { fontSize: 11 },
											children: "View"
										}),
										/* @__PURE__ */ jsx("button", {
											onClick: () => openEdit(c),
											className: "ad-btn ad-btn--ghost ad-btn--sm",
											style: { fontSize: 11 },
											children: "Edit"
										}),
										/* @__PURE__ */ jsx("button", {
											onClick: () => void handleDelete(c.id, c.name),
											disabled: deleting === c.id,
											className: "ad-btn ad-btn--danger ad-btn--sm",
											style: {
												opacity: deleting === c.id ? .5 : 1,
												fontSize: 11
											},
											children: deleting === c.id ? "…" : "Delete"
										})
									]
								}) })
							] }, c.id)) })]
						})
					}), maxPages > 1 && /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: 8,
							marginTop: 12
						},
						children: [
							/* @__PURE__ */ jsx("button", {
								className: "ad-btn ad-btn--ghost ad-btn--sm",
								onClick: () => setComponentPage((m) => ({
									...m,
									[cat]: Math.max(0, (m[cat] ?? 0) - 1)
								})),
								disabled: page === 0,
								children: "← Prev"
							}),
							/* @__PURE__ */ jsxs("span", {
								style: {
									fontSize: 12,
									color: "var(--ad-text)",
									minWidth: 40,
									textAlign: "center"
								},
								children: [
									page + 1,
									" / ",
									maxPages
								]
							}),
							/* @__PURE__ */ jsx("button", {
								className: "ad-btn ad-btn--ghost ad-btn--sm",
								onClick: () => setComponentPage((m) => ({
									...m,
									[cat]: Math.min(maxPages - 1, (m[cat] ?? 0) + 1)
								})),
								disabled: page >= maxPages - 1,
								children: "Next →"
							})
						]
					})] })
				]
			}, cat);
		})
	] });
}
function PackageInquiriesManager({ apiKey }) {
	const [inquiries, setInquiries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState(null);
	const [deleting, setDeleting] = useState(null);
	const [msg, setMsg] = useState("");
	const [selectedInquiry, setSelectedInquiry] = useState(null);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [deleteTarget, setDeleteTarget] = useState(null);
	useEffect(() => {
		load();
	}, []);
	useEffect(() => {
		if (!msg) return;
		const timeout = setTimeout(() => setMsg(""), msg.startsWith("✓") ? 1500 : 3e3);
		return () => clearTimeout(timeout);
	}, [msg]);
	const load = async () => {
		setLoading(true);
		try {
			setInquiries((await adminGetPackageInquiries(apiKey)).data);
		} catch (e) {
			setMsg(`Failed to load inquiries: ${e instanceof Error ? e.message : "Unknown error"}`);
		} finally {
			setLoading(false);
		}
	};
	const updateStatus = async (id, status) => {
		setUpdating(id);
		try {
			await adminUpdatePackageInquiry(apiKey, id, { status });
			setMsg("✓ Status updated");
			setInquiries((prev) => prev.map((i) => i.id === id ? {
				...i,
				status
			} : i));
			setSelectedInquiry((prev) => prev?.id === id ? {
				...prev,
				status
			} : prev);
		} catch (e) {
			setMsg(`Failed to update: ${e instanceof Error ? e.message : "Unknown error"}`);
		} finally {
			setUpdating(null);
		}
	};
	const deleteInquiry = async (id) => {
		setDeleting(id);
		try {
			await adminDeletePackageInquiry(apiKey, id);
			setMsg("✓ Inquiry deleted");
			setSelectedInquiry(null);
			setInquiries((prev) => prev.filter((i) => i.id !== id));
		} catch (e) {
			setMsg(`Failed to delete: ${e instanceof Error ? e.message : "Unknown error"}`);
		} finally {
			setDeleting(null);
		}
	};
	const filtered = inquiries.filter((inq) => {
		if (statusFilter !== "all" && inq.status !== statusFilter) return false;
		if (!search.trim()) return true;
		const q = search.toLowerCase();
		return inq.name.toLowerCase().includes(q) || inq.email.toLowerCase().includes(q) || inq.packageName.toLowerCase().includes(q);
	});
	const counts = {
		new: inquiries.filter((i) => i.status === "new").length,
		contacted: inquiries.filter((i) => i.status === "contacted").length,
		converted: inquiries.filter((i) => i.status === "converted").length
	};
	const InqStatusSelect = ({ inq }) => /* @__PURE__ */ jsxs("select", {
		className: `ad-inq-status-select is-${inq.status}`,
		value: inq.status,
		disabled: updating === inq.id,
		onChange: (e) => void updateStatus(inq.id, e.target.value),
		children: [
			/* @__PURE__ */ jsx("option", {
				value: "new",
				children: "New"
			}),
			/* @__PURE__ */ jsx("option", {
				value: "contacted",
				children: "Contacted"
			}),
			/* @__PURE__ */ jsx("option", {
				value: "converted",
				children: "Converted"
			})
		]
	});
	const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-PH", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx("div", {
			className: "ad-section-header",
			children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
				className: "ad-section-title",
				children: "Package Inquiries"
			}), !loading && /* @__PURE__ */ jsxs("div", {
				className: "ad-section-sub",
				children: [
					inquiries.length,
					" total",
					inquiries.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
						" ·\xA0",
						/* @__PURE__ */ jsxs("span", {
							className: "ad-inq-count is-new",
							children: [counts.new, " New"]
						}),
						"\xA0·\xA0",
						/* @__PURE__ */ jsxs("span", {
							className: "ad-inq-count is-contacted",
							children: [counts.contacted, " Contacted"]
						}),
						"\xA0·\xA0",
						/* @__PURE__ */ jsxs("span", {
							className: "ad-inq-count is-converted",
							children: [counts.converted, " Converted"]
						})
					] })
				]
			})] })
		}),
		msg && /* @__PURE__ */ jsx(Toast, { msg }),
		/* @__PURE__ */ jsx(ConfirmDeleteModal, {
			open: !!deleteTarget,
			title: "Delete this package inquiry?",
			description: "This will permanently remove the inquiry record.",
			onConfirm: () => {
				deleteInquiry(deleteTarget);
				setDeleteTarget(null);
			},
			onCancel: () => setDeleteTarget(null),
			confirming: !!deleting
		}),
		!loading && inquiries.length > 0 && /* @__PURE__ */ jsxs("div", {
			className: "ad-inq-toolbar",
			children: [/* @__PURE__ */ jsx("input", {
				className: "ad-input ad-inq-search",
				type: "search",
				placeholder: "Search name, email or package…",
				value: search,
				onChange: (e) => setSearch(e.target.value)
			}), /* @__PURE__ */ jsxs("select", {
				className: "ad-select ad-inq-filter",
				value: statusFilter,
				onChange: (e) => setStatusFilter(e.target.value),
				children: [
					/* @__PURE__ */ jsxs("option", {
						value: "all",
						children: [
							"All (",
							inquiries.length,
							")"
						]
					}),
					/* @__PURE__ */ jsxs("option", {
						value: "new",
						children: [
							"New (",
							counts.new,
							")"
						]
					}),
					/* @__PURE__ */ jsxs("option", {
						value: "contacted",
						children: [
							"Contacted (",
							counts.contacted,
							")"
						]
					}),
					/* @__PURE__ */ jsxs("option", {
						value: "converted",
						children: [
							"Converted (",
							counts.converted,
							")"
						]
					})
				]
			})]
		}),
		loading ? /* @__PURE__ */ jsx("div", {
			style: {
				padding: 20,
				color: "var(--ad-text3)"
			},
			children: "Loading…"
		}) : filtered.length === 0 ? /* @__PURE__ */ jsx("div", {
			style: {
				padding: 20,
				color: "var(--ad-text3)"
			},
			children: inquiries.length === 0 ? "No inquiries yet." : "No results match your search."
		}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
			className: "ad-inq-table-wrap",
			children: /* @__PURE__ */ jsxs("table", {
				className: "ad-table",
				style: {
					width: "100%",
					borderCollapse: "collapse"
				},
				children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", {
						className: "ad-inq-th",
						children: "Name"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "ad-inq-th",
						children: "Contact"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "ad-inq-th",
						children: "Package"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "ad-inq-th",
						children: "Status"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "ad-inq-th",
						children: "Date"
					}),
					/* @__PURE__ */ jsx("th", { className: "ad-inq-th" })
				] }) }), /* @__PURE__ */ jsx("tbody", { children: filtered.map((inq) => /* @__PURE__ */ jsxs("tr", {
					className: "ad-inq-tr",
					children: [
						/* @__PURE__ */ jsxs("td", {
							className: "ad-inq-td",
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontWeight: 600,
									fontSize: 13
								},
								children: inq.name
							}), /* @__PURE__ */ jsxs("div", {
								className: "ad-inq-ref",
								children: ["PKG-", inq.id.slice(0, 8).toUpperCase()]
							})]
						}),
						/* @__PURE__ */ jsxs("td", {
							className: "ad-inq-td",
							children: [/* @__PURE__ */ jsx("div", {
								style: { fontSize: 13 },
								children: inq.email
							}), /* @__PURE__ */ jsx("div", {
								className: "ad-inq-ref",
								children: inq.phone
							})]
						}),
						/* @__PURE__ */ jsxs("td", {
							className: "ad-inq-td",
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontSize: 13,
									fontWeight: 500
								},
								children: inq.packageName
							}), /* @__PURE__ */ jsxs("div", {
								className: "ad-inq-ref",
								children: [
									formatCapacity(inq.packageDetails.inverterKw, "power", { unit: "kW" }),
									inq.packageDetails.storageKwh > 0 && ` · ${formatCapacity(inq.packageDetails.storageKwh, "energy", { unit: "kWh" })}`,
									` · ${inq.packageDetails.phase === "single" ? "Single" : "Three"} Phase`
								]
							})]
						}),
						/* @__PURE__ */ jsx("td", {
							className: "ad-inq-td",
							children: /* @__PURE__ */ jsx(InqStatusSelect, { inq })
						}),
						/* @__PURE__ */ jsx("td", {
							className: "ad-inq-td",
							children: /* @__PURE__ */ jsx("div", {
								style: {
									fontSize: 12,
									color: "var(--ad-text3)"
								},
								children: fmtDate(inq.createdAt)
							})
						}),
						/* @__PURE__ */ jsx("td", {
							className: "ad-inq-td",
							children: /* @__PURE__ */ jsx("button", {
								className: "ad-btn ad-btn--sm",
								onClick: () => setSelectedInquiry(inq),
								children: "View"
							})
						})
					]
				}, inq.id)) })]
			})
		}), /* @__PURE__ */ jsx("div", {
			className: "ad-inq-cards",
			children: filtered.map((inq) => /* @__PURE__ */ jsxs("div", {
				className: "ad-inq-card",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "ad-inq-card-top",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "ad-inq-card-name",
							children: inq.name
						}), /* @__PURE__ */ jsxs("div", {
							className: "ad-inq-ref",
							children: [
								inq.email,
								" · ",
								inq.phone
							]
						})] }), /* @__PURE__ */ jsx("button", {
							className: "ad-btn ad-btn--sm",
							onClick: () => setSelectedInquiry(inq),
							style: { flexShrink: 0 },
							children: "Details"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "ad-inq-card-pkg",
						children: [
							/* @__PURE__ */ jsx("span", {
								style: {
									fontWeight: 600,
									fontSize: 13
								},
								children: inq.packageName
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "ad-inq-ref",
								children: [
									formatCapacity(inq.packageDetails.inverterKw, "power", { unit: "kW" }),
									inq.packageDetails.storageKwh > 0 && ` · ${formatCapacity(inq.packageDetails.storageKwh, "energy", { unit: "kWh" })}`,
									` · ${inq.packageDetails.phase === "single" ? "Single" : "Three"} Phase`
								]
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "ad-inq-ref",
								children: [
									fmtDate(inq.createdAt),
									" · PKG-",
									inq.id.slice(0, 8).toUpperCase()
								]
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "ad-inq-card-footer",
						children: /* @__PURE__ */ jsx(InqStatusSelect, { inq })
					})
				]
			}, inq.id))
		})] }),
		selectedInquiry && createPortal(/* @__PURE__ */ jsx("div", {
			className: "ad-inq-modal-overlay",
			onClick: () => setSelectedInquiry(null),
			children: /* @__PURE__ */ jsxs("div", {
				className: "ad-inq-modal",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "ad-inq-modal-header",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "ad-inq-modal-title",
							children: "Inquiry Details"
						}), /* @__PURE__ */ jsxs("div", {
							className: "ad-inq-ref",
							style: { marginTop: 3 },
							children: ["PKG-", selectedInquiry.id.slice(0, 8).toUpperCase()]
						})] }), /* @__PURE__ */ jsx("button", {
							className: "ad-inq-modal-close",
							onClick: () => setSelectedInquiry(null),
							children: "×"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "ad-inq-modal-section",
						children: [/* @__PURE__ */ jsx("div", {
							className: "ad-inq-modal-sec-label",
							children: "Status"
						}), /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: 12
							},
							children: [/* @__PURE__ */ jsx(InqStatusSelect, { inq: selectedInquiry }), /* @__PURE__ */ jsxs("span", {
								className: "ad-inq-ref",
								children: [
									fmtDate(selectedInquiry.createdAt),
									" · ",
									new Date(selectedInquiry.createdAt).toLocaleTimeString("en-PH", {
										hour: "2-digit",
										minute: "2-digit"
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "ad-inq-modal-section",
						children: [/* @__PURE__ */ jsx("div", {
							className: "ad-inq-modal-sec-label",
							children: "Contact Information"
						}), /* @__PURE__ */ jsx("div", {
							className: "ad-inq-modal-grid",
							children: [
								["Full Name", selectedInquiry.name],
								["Email", selectedInquiry.email],
								["Phone", selectedInquiry.phone],
								["Location", selectedInquiry.location]
							].map(([label, value]) => /* @__PURE__ */ jsxs("div", {
								className: "ad-inq-modal-field",
								children: [/* @__PURE__ */ jsx("div", {
									className: "ad-inq-modal-field-label",
									children: label
								}), /* @__PURE__ */ jsx("div", {
									className: "ad-inq-modal-field-value",
									style: { wordBreak: "break-all" },
									children: value
								})]
							}, label))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "ad-inq-modal-section",
						children: [/* @__PURE__ */ jsx("div", {
							className: "ad-inq-modal-sec-label",
							children: "System Specifications"
						}), /* @__PURE__ */ jsxs("div", {
							className: "ad-inq-modal-grid",
							children: [[
								["Package", selectedInquiry.packageName],
								["Load Capacity", formatCapacity(selectedInquiry.packageDetails.inverterKw, "power", { unit: "kW" })],
								["Production", formatCapacity(selectedInquiry.packageDetails.solarKwp, "power", { unit: "kWp" })],
								...selectedInquiry.packageDetails.storageKwh > 0 ? [["Storage", formatCapacity(selectedInquiry.packageDetails.storageKwh, "energy", { unit: "kWh" })]] : [],
								["Phase", selectedInquiry.packageDetails.phase === "single" ? "Single Phase" : "Three Phase"],
								...selectedInquiry.packageDetails.billRangeMin != null ? [["Monthly Savings", `₱${selectedInquiry.packageDetails.billRangeMin.toLocaleString("en-PH")} – ₱${selectedInquiry.packageDetails.billRangeMax?.toLocaleString("en-PH")}`]] : []
							].map(([label, value]) => /* @__PURE__ */ jsxs("div", {
								className: "ad-inq-modal-field",
								children: [/* @__PURE__ */ jsx("div", {
									className: "ad-inq-modal-field-label",
									children: label
								}), /* @__PURE__ */ jsx("div", {
									className: "ad-inq-modal-field-value",
									children: value
								})]
							}, label)), /* @__PURE__ */ jsxs("div", {
								className: "ad-inq-modal-field",
								children: [/* @__PURE__ */ jsx("div", {
									className: "ad-inq-modal-field-label",
									children: "Total Price"
								}), /* @__PURE__ */ jsx("div", {
									className: "ad-inq-modal-field-value",
									style: { color: selectedInquiry.packageDetails.totalPrice != null ? "var(--ad-accent)" : void 0 },
									children: selectedInquiry.packageDetails.totalPrice != null ? `₱${selectedInquiry.packageDetails.totalPrice.toLocaleString("en-PH")}` : "Price TBD"
								})]
							})]
						})]
					}),
					(() => {
						const comps = selectedInquiry.packageDetails.components;
						if (!comps || comps.length === 0) return null;
						const EMOJI = {
							"Solar Panel": "☀️",
							"Inverter": "⚡",
							"Battery": "🔋"
						};
						const order = [
							"Solar Panel",
							"Inverter",
							"Battery"
						];
						const byCategory = comps.reduce((acc, c) => {
							(acc[c.category] ??= []).push(c);
							return acc;
						}, {});
						const categories = [...order.filter((c) => byCategory[c]), ...Object.keys(byCategory).filter((c) => !order.includes(c))];
						return /* @__PURE__ */ jsxs("div", {
							className: "ad-inq-modal-section",
							children: [/* @__PURE__ */ jsx("div", {
								className: "ad-inq-modal-sec-label",
								children: "Selected Components"
							}), /* @__PURE__ */ jsx("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: 8
								},
								children: categories.map((cat) => /* @__PURE__ */ jsxs("div", {
									className: "ad-inq-modal-field",
									style: { gap: 8 },
									children: [/* @__PURE__ */ jsxs("div", {
										className: "ad-inq-modal-field-label",
										children: [
											EMOJI[cat] ?? "📦",
											" ",
											cat
										]
									}), byCategory[cat].map((c, i) => /* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											fontSize: 13,
											padding: "3px 0",
											borderBottom: i < byCategory[cat].length - 1 ? "1px solid var(--ad-border)" : "none"
										},
										children: [/* @__PURE__ */ jsxs("span", { children: [
											/* @__PURE__ */ jsxs("span", {
												style: {
													fontWeight: 700,
													marginRight: 6
												},
												children: [c.quantity, "×"]
											}),
											c.brand,
											" ",
											c.name
										] }), c.unitPrice != null && /* @__PURE__ */ jsxs("span", {
											className: "ad-inq-ref",
											children: [
												"₱",
												c.unitPrice.toLocaleString("en-PH"),
												" ea."
											]
										})]
									}, i))]
								}, cat))
							})]
						});
					})(),
					/* @__PURE__ */ jsxs("div", {
						className: "ad-inq-modal-actions",
						children: [/* @__PURE__ */ jsx("button", {
							className: "ad-btn ad-btn--danger",
							disabled: deleting === selectedInquiry.id,
							onClick: () => setDeleteTarget(selectedInquiry.id),
							children: deleting === selectedInquiry.id ? "Deleting…" : "Delete"
						}), /* @__PURE__ */ jsx("button", {
							className: "ad-btn ad-btn--ghost",
							onClick: () => setSelectedInquiry(null),
							children: "Close"
						})]
					})
				]
			})
		}), document.body)
	] });
}
var EMPTY_IP_RATING = {
	code: "",
	description: ""
};
function UtilitiesManager({ apiKey }) {
	const [ratings, setRatings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [form, setForm] = useState(EMPTY_IP_RATING);
	const [editingId, setEditingId] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [msg, setMsg] = useState("");
	const [formError, setFormError] = useState("");
	const load = async () => {
		setLoading(true);
		try {
			setRatings((await adminGetIpRatings(apiKey)).data);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		load();
	}, []);
	useEffect(() => {
		if (!msg) return;
		const t = setTimeout(() => setMsg(""), msg.startsWith("✓") ? 1500 : 3e3);
		return () => clearTimeout(t);
	}, [msg]);
	const openAdd = () => {
		setEditingId(null);
		setForm(EMPTY_IP_RATING);
		setFormError("");
		setShowForm(true);
	};
	const openEdit = (r) => {
		setEditingId(r.id);
		setForm({
			code: r.code,
			description: r.description
		});
		setFormError("");
		setShowForm(true);
	};
	const closeForm = () => {
		setShowForm(false);
		setEditingId(null);
		setForm(EMPTY_IP_RATING);
		setFormError("");
	};
	const handleSave = async () => {
		if (!form.code.trim()) {
			setFormError("Code is required (e.g. IP65)");
			return;
		}
		if (!form.description.trim()) {
			setFormError("Description is required");
			return;
		}
		setSaving(true);
		try {
			if (editingId) {
				await adminUpdateIpRating(apiKey, editingId, form);
				setMsg("✓ IP Rating updated");
			} else {
				await adminCreateIpRating(apiKey, form);
				setMsg("✓ IP Rating added");
			}
			await load();
			closeForm();
		} catch (e) {
			setMsg(`Failed: ${e.message}`);
		} finally {
			setSaving(false);
		}
	};
	const handleDelete = async () => {
		if (!deleteTarget) return;
		setDeleting(deleteTarget.id);
		try {
			await adminDeleteIpRating(apiKey, deleteTarget.id);
			setMsg("✓ IP Rating deleted");
			await load();
		} catch {
			setMsg("Failed to delete IP Rating");
		} finally {
			setDeleting(null);
			setDeleteTarget(null);
		}
	};
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx("div", {
			className: "ad-section-header",
			children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
				className: "ad-section-title",
				children: "Utilities"
			}), /* @__PURE__ */ jsx("div", {
				className: "ad-section-sub",
				children: "Manage reference data used across packages and the client-facing site."
			})] })
		}),
		msg && /* @__PURE__ */ jsx(Toast, { msg }),
		/* @__PURE__ */ jsx(ConfirmDeleteModal, {
			open: !!deleteTarget,
			title: `Delete IP Rating "${deleteTarget?.code}"?`,
			description: "Any packages using this rating will lose their badge.",
			onConfirm: () => void handleDelete(),
			onCancel: () => setDeleteTarget(null),
			confirming: !!deleting
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "ad-card",
			style: { marginBottom: 24 },
			children: [
				/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						marginBottom: showForm ? 16 : 0
					},
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontWeight: 700,
							fontSize: 15,
							color: "var(--ad-text)",
							marginBottom: 2
						},
						children: "IP Ratings"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 12,
							color: "var(--ad-text3)",
							lineHeight: 1.5
						},
						children: "Ingress Protection ratings displayed as badges on package cards in the client frontend. Hover over a badge to see the full description."
					})] }), !showForm && /* @__PURE__ */ jsx("button", {
						onClick: openAdd,
						className: "ad-btn ad-btn--sm",
						style: {
							flexShrink: 0,
							marginLeft: 16
						},
						children: "+ Add"
					})]
				}),
				showForm && /* @__PURE__ */ jsxs("div", {
					style: {
						background: "var(--ad-surface-raised, var(--ad-surface))",
						border: "1px solid var(--ad-border)",
						borderRadius: 10,
						padding: "16px 18px",
						marginBottom: 16
					},
					children: [
						formError && /* @__PURE__ */ jsx("div", {
							style: {
								marginBottom: 10,
								padding: "7px 12px",
								background: "rgba(239,68,68,0.08)",
								border: "1px solid rgba(239,68,68,0.25)",
								borderRadius: 6,
								fontSize: 12,
								color: "#ef4444"
							},
							children: formError
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "160px 1fr",
								gap: 12,
								marginBottom: 12
							},
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontSize: 11,
									fontWeight: 600,
									color: "var(--ad-text3)",
									textTransform: "uppercase",
									letterSpacing: "0.06em",
									marginBottom: 5
								},
								children: "Code"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								className: "ad-input",
								placeholder: "e.g. IP65",
								value: form.code,
								onChange: (e) => setForm((f) => ({
									...f,
									code: e.target.value.toUpperCase()
								})),
								style: {
									fontWeight: 600,
									letterSpacing: "0.04em"
								}
							})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontSize: 11,
									fontWeight: 600,
									color: "var(--ad-text3)",
									textTransform: "uppercase",
									letterSpacing: "0.06em",
									marginBottom: 5
								},
								children: "Description"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								className: "ad-input",
								placeholder: "e.g. Dust-tight; protected against water jets",
								value: form.description,
								onChange: (e) => setForm((f) => ({
									...f,
									description: e.target.value
								}))
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								gap: 8
							},
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => void handleSave(),
								disabled: saving,
								className: "ad-btn ad-btn--sm",
								children: saving ? "Saving…" : editingId ? "Update" : "Add Rating"
							}), /* @__PURE__ */ jsx("button", {
								onClick: closeForm,
								className: "ad-btn ad-btn--ghost ad-btn--sm",
								children: "Cancel"
							})]
						})
					]
				}),
				loading ? /* @__PURE__ */ jsx("div", {
					style: {
						color: "var(--ad-text2)",
						padding: "16px 0",
						fontSize: 13
					},
					children: "Loading…"
				}) : ratings.length === 0 ? /* @__PURE__ */ jsxs("div", {
					style: {
						textAlign: "center",
						padding: "28px 0",
						color: "var(--ad-text3)",
						fontSize: 13
					},
					children: [
						"No IP ratings yet.",
						" ",
						!showForm && /* @__PURE__ */ jsx("button", {
							onClick: openAdd,
							style: {
								background: "none",
								border: "none",
								color: "var(--ad-accent)",
								cursor: "pointer",
								fontSize: 13,
								textDecoration: "underline",
								padding: 0
							},
							children: "Add the first one."
						})
					]
				}) : /* @__PURE__ */ jsx("div", {
					className: "ad-table-wrap",
					children: /* @__PURE__ */ jsxs("table", {
						className: "ad-table",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								style: { width: 90 },
								children: "Code"
							}),
							/* @__PURE__ */ jsx("th", { children: "Description" }),
							/* @__PURE__ */ jsx("th", {
								style: { width: 120 },
								children: "Added"
							}),
							/* @__PURE__ */ jsx("th", {
								style: { width: 120 },
								children: "Actions"
							})
						] }) }), /* @__PURE__ */ jsx("tbody", { children: ratings.map((r) => /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", {
								style: {
									display: "inline-flex",
									alignItems: "center",
									padding: "3px 9px",
									borderRadius: 6,
									background: "rgba(34,197,94,0.1)",
									border: "1px solid rgba(34,197,94,0.25)",
									color: "#22c55e",
									fontSize: 12,
									fontWeight: 700,
									letterSpacing: "0.04em"
								},
								children: r.code
							}) }),
							/* @__PURE__ */ jsx("td", {
								style: {
									fontSize: 13,
									color: "var(--ad-text2)"
								},
								children: r.description
							}),
							/* @__PURE__ */ jsx("td", {
								style: {
									fontSize: 12,
									color: "var(--ad-text3)"
								},
								children: new Date(r.createdAt).toLocaleDateString()
							}),
							/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", {
								className: "ad-table-actions",
								children: [/* @__PURE__ */ jsx("button", {
									onClick: () => openEdit(r),
									className: "ad-btn ad-btn--ghost ad-btn--sm",
									disabled: showForm && editingId !== r.id,
									children: "Edit"
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => setDeleteTarget(r),
									disabled: !!deleting,
									className: "ad-btn ad-btn--danger ad-btn--sm",
									children: "Delete"
								})]
							}) })
						] }, r.id)) })]
					})
				})
			]
		})
	] });
}
var PKG_BILL_TIERS = [
	[
		"bill-low",
		"Up to ₱5,000/mo",
		(p) => p.billRangeMin < 5e3
	],
	[
		"bill-mid",
		"₱5,000 – ₱15,000/mo",
		(p) => p.billRangeMin >= 5e3 && p.billRangeMin < 15e3
	],
	[
		"bill-high",
		"₱15,000 – ₱30,000/mo",
		(p) => p.billRangeMin >= 15e3 && p.billRangeMin < 3e4
	],
	[
		"bill-xhigh",
		"Above ₱30,000/mo",
		(p) => p.billRangeMin >= 3e4
	]
];
function PkgPhaseSection({ phase, packages, showForm, peso, onPreview, onEdit, onDelete, onToggle, deleting, toggling }) {
	const [search, setSearch] = useState("");
	const [showF, setShowF] = useState(false);
	const [fType, setFType] = useState(/* @__PURE__ */ new Set());
	const [fStatus, setFStatus] = useState(/* @__PURE__ */ new Set());
	const [fBill, setFBill] = useState(/* @__PURE__ */ new Set());
	const [fRec, setFRec] = useState(false);
	const toggleF = (setter, val) => setter((prev) => {
		const n = new Set(prev);
		n.has(val) ? n.delete(val) : n.add(val);
		return n;
	});
	const clearFilters = () => {
		setFType(/* @__PURE__ */ new Set());
		setFStatus(/* @__PURE__ */ new Set());
		setFBill(/* @__PURE__ */ new Set());
		setFRec(false);
	};
	const filterCount = fType.size + fStatus.size + fBill.size + (fRec ? 1 : 0);
	const isFiltering = search.trim().length > 0 || filterCount > 0;
	const label = phase === "single" ? "Single Phase" : "Three Phase";
	const activeCount = packages.filter((p) => p.isActive).length;
	const filtered = (() => {
		let r = packages;
		if (search.trim()) {
			const q = search.toLowerCase();
			r = r.filter((p) => p.name.toLowerCase().includes(q) || (p.components ?? []).some((pc) => pc.component.name.toLowerCase().includes(q) || pc.component.brand.toLowerCase().includes(q) || pc.component.model.toLowerCase().includes(q)));
		}
		if (fType.size > 0) r = r.filter((p) => fType.has(p.storageKwh > 0 ? "hybrid" : "grid-tied"));
		if (fStatus.size > 0) r = r.filter((p) => fStatus.has(p.isActive ? "active" : "inactive"));
		if (fBill.size > 0) r = r.filter((p) => PKG_BILL_TIERS.some(([v, , fn]) => fBill.has(v) && fn(p)));
		if (fRec) r = r.filter((p) => p.isRecommended);
		r = [...r].sort((a, b) => (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity));
		return r;
	})();
	return /* @__PURE__ */ jsxs("div", {
		style: { marginBottom: 36 },
		children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: 10,
					marginBottom: 14,
					paddingBottom: 10,
					borderBottom: "1px solid var(--ad-border)"
				},
				children: [/* @__PURE__ */ jsx("span", {
					className: `ad-badge ${phase === "single" ? "is-residential" : "is-commercial"}`,
					style: {
						fontSize: 12,
						padding: "4px 10px"
					},
					children: label
				}), /* @__PURE__ */ jsxs("span", {
					style: {
						fontSize: 12,
						color: "var(--ad-text3)"
					},
					children: [
						activeCount,
						" active · ",
						packages.length,
						" total"
					]
				})]
			}),
			packages.length > 0 && /* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					gap: 8,
					marginBottom: 16,
					flexWrap: "wrap",
					alignItems: "center"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							position: "relative",
							flex: "1 1 240px",
							minWidth: 180
						},
						children: [
							/* @__PURE__ */ jsx("input", {
								type: "text",
								className: "ad-input",
								placeholder: `Search ${label} packages…`,
								value: search,
								onChange: (e) => setSearch(e.target.value),
								style: {
									paddingLeft: 34,
									paddingTop: 8,
									paddingBottom: 8
								}
							}),
							/* @__PURE__ */ jsxs("svg", {
								style: {
									position: "absolute",
									left: 10,
									top: "50%",
									transform: "translateY(-50%)",
									opacity: .35,
									pointerEvents: "none"
								},
								width: "14",
								height: "14",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2.5",
								strokeLinecap: "round",
								children: [/* @__PURE__ */ jsx("circle", {
									cx: "11",
									cy: "11",
									r: "8"
								}), /* @__PURE__ */ jsx("path", { d: "m21 21-4.35-4.35" })]
							}),
							search && /* @__PURE__ */ jsx("button", {
								onClick: () => setSearch(""),
								style: {
									position: "absolute",
									right: 8,
									top: "50%",
									transform: "translateY(-50%)",
									background: "none",
									border: "none",
									cursor: "pointer",
									color: "var(--ad-text3)",
									fontSize: 14,
									padding: "2px 4px",
									lineHeight: 1
								},
								children: "✕"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							position: "relative",
							zIndex: 100
						},
						children: [/* @__PURE__ */ jsxs("button", {
							className: `ad-btn ad-btn--sm${filterCount === 0 ? " ad-btn--ghost" : ""}`,
							onClick: () => setShowF((s) => !s),
							style: {
								display: "flex",
								alignItems: "center",
								gap: 6
							},
							children: [
								/* @__PURE__ */ jsx("svg", {
									width: "12",
									height: "12",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2.5",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: /* @__PURE__ */ jsx("polygon", { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" })
								}),
								"Filters",
								filterCount > 0 && /* @__PURE__ */ jsx("span", {
									style: {
										background: "#fc615a",
										color: "#fff",
										borderRadius: 999,
										fontSize: 10,
										padding: "1px 6px",
										fontWeight: 700,
										lineHeight: "14px"
									},
									children: filterCount
								})
							]
						}), showF && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
							style: {
								position: "fixed",
								inset: 0,
								zIndex: 99
							},
							onClick: () => setShowF(false)
						}), /* @__PURE__ */ jsxs("div", {
							style: {
								position: "absolute",
								top: "calc(100% + 6px)",
								right: 0,
								background: "var(--ad-surface)",
								border: "1px solid var(--ad-border)",
								borderRadius: 10,
								padding: "16px 18px",
								minWidth: 280,
								boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
								zIndex: 100
							},
							children: [
								/* @__PURE__ */ jsxs("div", {
									style: { marginBottom: 14 },
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: 10,
											fontWeight: 700,
											color: "var(--ad-text3)",
											textTransform: "uppercase",
											letterSpacing: "0.07em",
											marginBottom: 8
										},
										children: "System Type"
									}), /* @__PURE__ */ jsx("div", {
										style: {
											display: "flex",
											gap: 14,
											flexWrap: "wrap"
										},
										children: [["hybrid", "Hybrid"], ["grid-tied", "Grid-Tied"]].map(([v, l]) => /* @__PURE__ */ jsxs("label", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: 6,
												cursor: "pointer",
												fontSize: 13,
												color: "var(--ad-text)"
											},
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: fType.has(v),
												onChange: () => toggleF(setFType, v),
												style: {
													accentColor: "var(--ad-accent)",
													width: 14,
													height: 14,
													cursor: "pointer"
												}
											}), l]
										}, v))
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: { marginBottom: 14 },
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: 10,
											fontWeight: 700,
											color: "var(--ad-text3)",
											textTransform: "uppercase",
											letterSpacing: "0.07em",
											marginBottom: 8
										},
										children: "Visibility"
									}), /* @__PURE__ */ jsx("div", {
										style: {
											display: "flex",
											gap: 14,
											flexWrap: "wrap"
										},
										children: [["active", "Active"], ["inactive", "Hidden"]].map(([v, l]) => /* @__PURE__ */ jsxs("label", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: 6,
												cursor: "pointer",
												fontSize: 13,
												color: "var(--ad-text)"
											},
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: fStatus.has(v),
												onChange: () => toggleF(setFStatus, v),
												style: {
													accentColor: "var(--ad-accent)",
													width: 14,
													height: 14,
													cursor: "pointer"
												}
											}), l]
										}, v))
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: { marginBottom: 14 },
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: 10,
											fontWeight: 700,
											color: "var(--ad-text3)",
											textTransform: "uppercase",
											letterSpacing: "0.07em",
											marginBottom: 8
										},
										children: "Bill Range"
									}), /* @__PURE__ */ jsx("div", {
										style: {
											display: "flex",
											flexDirection: "column",
											gap: 7
										},
										children: PKG_BILL_TIERS.map(([v, l]) => /* @__PURE__ */ jsxs("label", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: 6,
												cursor: "pointer",
												fontSize: 13,
												color: "var(--ad-text)"
											},
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: fBill.has(v),
												onChange: () => toggleF(setFBill, v),
												style: {
													accentColor: "var(--ad-accent)",
													width: 14,
													height: 14,
													cursor: "pointer"
												}
											}), l]
										}, v))
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										borderTop: "1px solid var(--ad-border)",
										paddingTop: 12,
										marginBottom: filterCount > 0 ? 12 : 0
									},
									children: /* @__PURE__ */ jsxs("label", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: 6,
											cursor: "pointer",
											fontSize: 13,
											color: "var(--ad-text)"
										},
										children: [/* @__PURE__ */ jsx("input", {
											type: "checkbox",
											checked: fRec,
											onChange: (e) => setFRec(e.target.checked),
											style: {
												accentColor: "var(--ad-accent)",
												width: 14,
												height: 14,
												cursor: "pointer"
											}
										}), "Recommended only"]
									})
								}),
								filterCount > 0 && /* @__PURE__ */ jsx("button", {
									className: "ad-btn ad-btn--ghost ad-btn--sm",
									style: {
										width: "100%",
										marginTop: 4
									},
									onClick: clearFilters,
									children: "Clear all filters"
								})
							]
						})] })]
					}),
					isFiltering && /* @__PURE__ */ jsxs("span", {
						style: {
							fontSize: 12,
							color: "var(--ad-text3)",
							whiteSpace: "nowrap"
						},
						children: [
							filtered.length,
							" of ",
							packages.length,
							" package",
							packages.length !== 1 ? "s" : ""
						]
					})
				]
			}),
			packages.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "ad-card",
				style: {
					textAlign: "center",
					padding: "32px 24px"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						fontSize: 14,
						color: "var(--ad-text2)",
						marginBottom: 6
					},
					children: [
						"No ",
						label,
						" packages yet"
					]
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						fontSize: 12,
						color: "var(--ad-text3)"
					},
					children: [
						"Click ",
						/* @__PURE__ */ jsx("strong", { children: "+ Add Package" }),
						" and set phase to ",
						/* @__PURE__ */ jsx("strong", { children: label }),
						" to create one."
					]
				})]
			}) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "ad-card",
				style: {
					textAlign: "center",
					padding: "32px 24px"
				},
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontSize: 14,
						color: "var(--ad-text2)",
						marginBottom: 6
					},
					children: "No packages match"
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						fontSize: 12,
						color: "var(--ad-text3)"
					},
					children: [
						"Try adjusting your search or filters.",
						" ",
						/* @__PURE__ */ jsx("button", {
							onClick: () => {
								setSearch("");
								clearFilters();
							},
							style: {
								background: "none",
								border: "none",
								color: "var(--ad-accent)",
								cursor: "pointer",
								fontSize: 12,
								textDecoration: "underline",
								padding: 0
							},
							children: "Clear all"
						})
					]
				})]
			}) : /* @__PURE__ */ jsx("div", {
				className: "ad-pkg-mgr-grid",
				children: filtered.map((p) => /* @__PURE__ */ jsxs("div", {
					className: `ad-pkg-mgr-card${!p.isActive ? " is-inactive" : ""}${p.isRecommended ? " is-recommended" : ""} is-${p.phase}-phase`,
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "ad-pkg-mgr-top",
							children: [/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: 6,
									flexWrap: "wrap",
									alignItems: "center"
								},
								children: [
									/* @__PURE__ */ jsx("span", {
										style: {
											fontSize: 11,
											color: "var(--ad-text3)",
											background: "var(--ad-border)",
											borderRadius: 4,
											padding: "2px 7px"
										},
										children: p.storageKwh > 0 ? "Hybrid" : "Grid-Tied"
									}),
									/* @__PURE__ */ jsxs("span", {
										style: {
											fontSize: 10,
											color: "var(--ad-text3)",
											background: "var(--ad-border)",
											borderRadius: 4,
											padding: "2px 6px",
											fontVariantNumeric: "tabular-nums",
											letterSpacing: "0.02em"
										},
										children: ["#", p.sortOrder ?? "—"]
									}),
									(p.isRecommended ?? false) && /* @__PURE__ */ jsx("span", {
										className: "ad-badge",
										style: {
											background: "rgba(252,97,90,0.15)",
											color: "#fc615a",
											border: "1px solid rgba(252,97,90,0.3)",
											fontSize: 10
										},
										children: "★ Recommended"
									})
								]
							}), /* @__PURE__ */ jsxs("label", {
								className: "ad-toggle-switch",
								title: p.isActive ? "Active — click to hide" : "Hidden — click to show",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: p.isActive,
									disabled: toggling === p.id,
									onChange: () => onToggle(p)
								}), /* @__PURE__ */ jsx("span", { className: "ad-toggle-track" })]
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "ad-pkg-mgr-name",
							children: p.name
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "ad-pkg-mgr-specs",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "ad-pkg-mgr-spec",
									children: [/* @__PURE__ */ jsx("span", { children: "Solar" }), /* @__PURE__ */ jsxs("strong", { children: [p.solarKwp, " kWp"] })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "ad-pkg-mgr-spec",
									children: [/* @__PURE__ */ jsx("span", { children: "Inverter" }), /* @__PURE__ */ jsxs("strong", { children: [p.inverterKw, " kW"] })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "ad-pkg-mgr-spec",
									children: [/* @__PURE__ */ jsx("span", { children: "Battery" }), /* @__PURE__ */ jsx("strong", { children: p.storageKwh > 0 ? `${p.storageKwh} kWh` : "None" })]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "ad-pkg-mgr-price",
							children: [p.totalPrice != null ? peso(p.totalPrice) : /* @__PURE__ */ jsx("span", {
								style: {
									fontSize: 11,
									opacity: .5
								},
								children: "Price TBD"
							}), (p.components?.length ?? 0) > 0 && /* @__PURE__ */ jsxs("span", {
								style: {
									fontSize: 10,
									opacity: .4,
									display: "block"
								},
								children: [
									p.components.length,
									" component",
									p.components.length !== 1 ? "s" : ""
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "ad-pkg-mgr-bill",
							children: [
								"For bills ",
								peso(p.billRangeMin),
								"–",
								peso(p.billRangeMax),
								"/mo"
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "ad-pkg-mgr-footer",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "ad-pkg-mgr-order",
								children: ["Created ", new Date(p.createdAt).toLocaleDateString()]
							}), /* @__PURE__ */ jsxs("div", {
								className: "ad-table-actions",
								children: [
									/* @__PURE__ */ jsx("button", {
										onClick: () => onPreview(p),
										className: "ad-btn ad-btn--ghost ad-btn--sm",
										disabled: showForm,
										children: "View"
									}),
									/* @__PURE__ */ jsx("button", {
										onClick: () => onEdit(p),
										className: "ad-btn ad-btn--ghost ad-btn--sm",
										disabled: showForm,
										children: "Edit"
									}),
									/* @__PURE__ */ jsx("button", {
										onClick: () => onDelete(p),
										disabled: deleting === p.id || showForm,
										className: "ad-btn ad-btn--danger ad-btn--sm",
										style: { opacity: deleting === p.id ? .5 : 1 },
										children: deleting === p.id ? "…" : "Delete"
									})
								]
							})]
						})
					]
				}, p.id))
			})
		]
	});
}
function PackagesManager({ apiKey }) {
	const [packages, setPackages] = useState([]);
	const [allComponents, setAllComponents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [form, setForm] = useState(EMPTY_PKG_FORM);
	const [nameEdited, setNameEdited] = useState(false);
	const [saving, setSaving] = useState(false);
	const [toggling, setToggling] = useState(null);
	const [deleting, setDeleting] = useState(null);
	const [msg, setMsg] = useState("");
	const [formError, setFormError] = useState("");
	const [previewPackage, setPreviewPackage] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [catSearches, setCatSearches] = useState({});
	const [systemType, setSystemType] = useState("hybrid");
	const [pkgImageFile, setPkgImageFile] = useState(null);
	const [pkgImagePreview, setPkgImagePreview] = useState("");
	const [allIpRatings, setAllIpRatings] = useState([]);
	const [sortOrderConflict, setSortOrderConflict] = useState(null);
	const [pendingSwap, setPendingSwap] = useState(null);
	const [isSortOrderManual, setIsSortOrderManual] = useState(false);
	const getNextSortOrder = (ph, excludeId) => Math.max(0, ...packages.filter((p) => p.phase === ph && p.id !== excludeId).map((p) => p.sortOrder ?? 0)) + 1;
	const load = async () => {
		setLoading(true);
		try {
			const [pkgRes, cmpRes, ipRes] = await Promise.all([
				adminGetPackages(apiKey),
				adminGetComponents(apiKey).catch(() => ({ data: [] })),
				adminGetIpRatings(apiKey).catch(() => ({ data: [] }))
			]);
			setPackages(pkgRes.data);
			setAllComponents(cmpRes.data);
			setAllIpRatings(ipRes.data);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		load();
	}, []);
	useEffect(() => {
		if ((form.components ?? []).length > 0) {
			const specs = computePackageSpecs(form.components ?? [], allComponents);
			const { min, max } = computeMonthlySavings(specs.solarKwp);
			setForm((f) => ({
				...f,
				solarKwp: specs.solarKwp,
				inverterKw: specs.inverterKw,
				storageKwh: specs.storageKwh,
				billRangeMin: min,
				billRangeMax: max
			}));
		}
	}, [form.components, allComponents]);
	useEffect(() => {
		if (!msg) return;
		const isSuccess = msg.startsWith("✓");
		const timeout = setTimeout(() => setMsg(""), isSuccess ? 1500 : 3e3);
		return () => clearTimeout(timeout);
	}, [msg]);
	const openAdd = () => {
		const nextOrder = getNextSortOrder(EMPTY_PKG_FORM.phase, null);
		setEditingId(null);
		setForm({
			...EMPTY_PKG_FORM,
			sortOrder: nextOrder
		});
		setSystemType("hybrid");
		setNameEdited(false);
		setCatSearches({});
		setMsg("");
		setPkgImageFile(null);
		setPkgImagePreview("");
		setSortOrderConflict(null);
		setPendingSwap(null);
		setIsSortOrderManual(false);
		setShowForm(true);
		if (allComponents.length === 0) adminGetComponents(apiKey).then((res) => setAllComponents(res.data)).catch(() => {});
	};
	const openEdit = (p) => {
		setEditingId(p.id);
		setSystemType(p.storageKwh > 0 ? "hybrid" : "grid-tied");
		setForm({
			name: p.name,
			solarKwp: p.solarKwp,
			inverterKw: p.inverterKw,
			storageKwh: p.storageKwh,
			phase: p.phase,
			billRangeMin: p.billRangeMin,
			billRangeMax: p.billRangeMax,
			isActive: p.isActive,
			isRecommended: p.isRecommended ?? false,
			sortOrder: p.sortOrder ?? 1,
			ipRatingId: p.ipRatingId ?? null,
			mainFeatures: p.mainFeatures ?? [],
			imageUrl: p.imageUrl ?? null,
			components: (p.components ?? []).map((pc) => ({
				componentId: pc.componentId,
				quantity: pc.quantity,
				baseComponentId: pc.baseComponentId ?? null,
				multiplier: pc.multiplier ?? 1
			}))
		});
		setSortOrderConflict(null);
		setPendingSwap(null);
		setIsSortOrderManual(true);
		setPkgImageFile(null);
		setPkgImagePreview(p.imageUrl ?? "");
		setNameEdited(true);
		setCatSearches({});
		setMsg("");
		setShowForm(true);
		if (allComponents.length === 0) adminGetComponents(apiKey).then((res) => setAllComponents(res.data)).catch(() => {});
	};
	const closeForm = () => {
		setShowForm(false);
		setEditingId(null);
		setNameEdited(false);
		setCatSearches({});
		setMsg("");
		setFormError("");
		setSystemType("hybrid");
		setPkgImageFile(null);
		setPkgImagePreview("");
		setSortOrderConflict(null);
		setPendingSwap(null);
		setIsSortOrderManual(false);
	};
	const setField = (key, value) => setForm((f) => ({
		...f,
		[key]: value
	}));
	const handleSortOrderChange = (val, currentPhase, currentSortOrder) => {
		const prevValue = currentSortOrder;
		setIsSortOrderManual(true);
		setField("sortOrder", val);
		setPendingSwap(null);
		const conflict = packages.find((p) => p.phase === currentPhase && (p.sortOrder ?? 0) === val && p.id !== editingId);
		if (conflict) setSortOrderConflict({
			takenBy: conflict,
			proposed: val,
			prevValue
		});
		else setSortOrderConflict(null);
	};
	const handlePhaseChange = (ph) => {
		setField("phase", ph);
		setSortOrderConflict(null);
		setPendingSwap(null);
		if (!isSortOrderManual) setField("sortOrder", getNextSortOrder(ph, editingId));
	};
	const setComponents = (next) => setForm((f) => ({
		...f,
		components: recomputeDerivedQtys(next)
	}));
	const handlePkgImageSelect = (file) => {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			setMsg("Error: Only image files are allowed (JPEG, PNG, WebP, AVIF, GIF)");
			return;
		}
		if (file.size > 10 * 1024 * 1024) {
			setMsg("Error: Image must be 10 MB or smaller");
			return;
		}
		setPkgImageFile(file);
		const reader = new FileReader();
		reader.onload = (e) => setPkgImagePreview(e.target?.result);
		reader.readAsDataURL(file);
	};
	const validateForm = () => {
		if (!form.name.trim()) return "Please enter a package name";
		if ((form.components ?? []).length === 0) return "Please select at least one component from your inventory";
		const components = form.components ?? [];
		const componentDetails = components.map((c) => allComponents.find((ac) => ac.id === c.componentId)).filter(Boolean);
		const hasSolarPanel = componentDetails.some((c) => c.category === "Solar Panel");
		const hasInverter = componentDetails.some((c) => c.category === "Inverter");
		if (!hasSolarPanel) return "Package must include at least one Solar Panel";
		if (!hasInverter) return "Package must include at least one Inverter";
		const specs = computePackageSpecs(components, allComponents);
		if (specs.solarKwp <= 0) return "Total Production Capacity must be greater than 0 kWp (add Solar Panels)";
		if (specs.inverterKw <= 0) return "Total Load Capacity must be greater than 0 kW (add Inverters)";
		if (specs.storageKwh < 0) return "Total Storage Capacity cannot be negative";
		if (form.billRangeMax < form.billRangeMin) return "Maximum monthly bill must be greater than or equal to minimum";
		const inverterEntry = components.find((c) => allComponents.find((a) => a.id === c.componentId)?.category === "Inverter");
		if (inverterEntry) {
			const inverterComp = allComponents.find((c) => c.id === inverterEntry.componentId);
			if (inverterComp) {
				const panelEntries = components.filter((c) => allComponents.find((a) => a.id === c.componentId)?.category === "Solar Panel");
				if (panelEntries.length > 0) {
					const totalPanelKwp = panelEntries.reduce((sum, entry) => {
						const panelComp = allComponents.find((c) => c.id === entry.componentId);
						return sum + entry.quantity * (panelComp?.productionCapacityKwp ?? 0);
					}, 0);
					const maxKwp = (inverterComp.pvMaxPower ?? inverterComp.loadCapacityKw) * inverterEntry.quantity;
					if (totalPanelKwp > maxKwp + .001) return `Total panel array (${totalPanelKwp.toFixed(2)} kWp) exceeds inverter max PV input (${maxKwp.toFixed(1)} kWp). Reduce panel count or use a larger inverter.`;
				}
				const batteryEntry = components.find((c) => allComponents.find((a) => a.id === c.componentId)?.category === "Battery");
				if (batteryEntry) {
					const batteryComp = allComponents.find((c) => c.id === batteryEntry.componentId);
					if (batteryComp && batteryComp.storageCapacityKwh > 0) {
						const battCapPerUnit = inverterComp.batteryMaxCapacity ?? inverterComp.loadCapacityKw;
						const rawMax = Math.floor(battCapPerUnit * inverterEntry.quantity / batteryComp.storageCapacityKwh);
						const maxBatteries = inverterComp.batteryMaxCapacity != null ? rawMax : Math.max(1, rawMax);
						if (batteryEntry.quantity > maxBatteries) return `Battery count (${batteryEntry.quantity}) exceeds inverter limit — max ${maxBatteries} batteries (${(battCapPerUnit * inverterEntry.quantity).toFixed(1)} kWh total) for ${inverterEntry.quantity}× inverter`;
					}
				}
				const maxInverters = inverterComp.parallelMax ?? 4;
				if (inverterEntry.quantity > maxInverters) return `Inverter count (${inverterEntry.quantity}) exceeds the maximum parallel units allowed for this model (${maxInverters})`;
			}
		}
		return "";
	};
	const handleSave = async () => {
		if (sortOrderConflict) {
			setFormError("Resolve the sort order conflict above before saving.");
			return;
		}
		const err = validateForm();
		if (err) {
			setFormError(err);
			scrollToFirstError();
			return;
		}
		setFormError("");
		setSaving(true);
		setMsg("");
		try {
			if (pendingSwap) await adminUpdatePackage(apiKey, pendingSwap.id, { sortOrder: pendingSwap.newSortOrder });
			let pkgId;
			if (editingId) {
				await adminUpdatePackage(apiKey, editingId, form);
				pkgId = editingId;
			} else pkgId = (await adminCreatePackage(apiKey, form)).data.id;
			if (pkgImageFile) await adminUploadPackageImage(apiKey, pkgId, pkgImageFile);
			setMsg(editingId ? "✓ Package updated successfully" : "✓ Package created successfully");
			await load();
			setTimeout(closeForm, 1500);
		} catch (e) {
			const errorMsg = e.message;
			if (errorMsg.includes("409") || errorMsg.includes("conflict")) setMsg("A package with this name already exists");
			else if (errorMsg.includes("401") || errorMsg.includes("unauthorized")) setMsg("Your session has expired. Please refresh and try again");
			else setMsg(`Failed to save package: ${errorMsg}`);
		} finally {
			setSaving(false);
		}
	};
	const handleToggleActive = async (p) => {
		setToggling(p.id);
		try {
			await adminUpdatePackage(apiKey, p.id, { isActive: !p.isActive });
			setMsg(p.isActive ? "✓ Package hidden" : "✓ Package visible");
			await load();
		} catch (e) {
			setMsg("Failed to update package visibility");
		} finally {
			setToggling(null);
		}
	};
	const handleDelete = async () => {
		if (!deleteTarget) return;
		setDeleting(deleteTarget.id);
		try {
			await adminDeletePackage(apiKey, deleteTarget.id);
			setMsg("✓ Package deleted");
			await load();
		} catch (e) {
			setMsg("Failed to delete package. Please try again");
		} finally {
			setDeleting(null);
			setDeleteTarget(null);
		}
	};
	const peso = (v) => `₱${v.toLocaleString("en-PH")}`;
	const activeCount = packages.filter((p) => p.isActive).length;
	const singlePkgs = packages.filter((p) => p.phase === "single");
	const threePkgs = packages.filter((p) => p.phase === "three");
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "ad-section-header",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
				className: "ad-section-title",
				children: "Solar Packages Builder"
			}), /* @__PURE__ */ jsx("div", {
				className: "ad-section-sub",
				children: loading ? "Loading…" : `${activeCount} active · ${packages.length} total — create packages by selecting components from your inventory. Specs and pricing auto-calculate.`
			})] }), /* @__PURE__ */ jsx("div", {
				style: {
					display: "flex",
					gap: 8,
					flexWrap: "wrap"
				},
				children: !showForm && /* @__PURE__ */ jsx("button", {
					onClick: openAdd,
					className: "ad-btn ad-btn--sm",
					children: "+ Add Package"
				})
			})]
		}),
		msg && /* @__PURE__ */ jsx(Toast, { msg }),
		/* @__PURE__ */ jsx(ConfirmDeleteModal, {
			open: !!deleteTarget,
			title: `Delete "${deleteTarget?.name}"?`,
			description: "This will permanently delete the package and cannot be undone.",
			onConfirm: () => void handleDelete(),
			onCancel: () => setDeleteTarget(null),
			confirming: !!deleting
		}),
		previewPackage && /* @__PURE__ */ jsx(AdminModal, {
			open: !!previewPackage,
			onClose: () => setPreviewPackage(null),
			title: previewPackage.name,
			subtitle: `Created ${new Date(previewPackage.createdAt).toLocaleDateString()}`,
			maxWidth: 680,
			children: /* @__PURE__ */ jsxs("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: "12px 20px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Name"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)",
							fontWeight: 600
						},
						children: previewPackage.name
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Phase"
					}), /* @__PURE__ */ jsx("div", {
						style: { fontSize: 14 },
						children: /* @__PURE__ */ jsx("span", {
							className: `ad-badge ${previewPackage.phase === "single" ? "is-residential" : "is-commercial"}`,
							children: previewPackage.phase === "single" ? "Single Phase" : "Three Phase"
						})
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "System Type"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewPackage.storageKwh > 0 ? "Hybrid" : "Grid-Tied"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Solar"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: [previewPackage.solarKwp, " kWp"]
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Inverter"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: [previewPackage.inverterKw, " kW"]
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Storage"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: previewPackage.storageKwh > 0 ? `${previewPackage.storageKwh} kWh` : "None"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Total Price"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: previewPackage.totalPrice != null ? "var(--ad-accent)" : "var(--ad-text3)"
						},
						children: previewPackage.totalPrice != null ? peso(previewPackage.totalPrice) : "Price TBD"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Bill Range"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)"
						},
						children: [
							peso(previewPackage.billRangeMin),
							" – ",
							peso(previewPackage.billRangeMax),
							"/mo"
						]
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Active"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: previewPackage.isActive ? "#22c55e" : "var(--ad-text3)"
						},
						children: previewPackage.isActive ? "Yes" : "No"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 3
						},
						children: "Recommended"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: previewPackage.isRecommended ?? false ? "#fc615a" : "var(--ad-text3)"
						},
						children: previewPackage.isRecommended ?? false ? "★ Yes" : "No"
					})] }),
					(previewPackage.mainFeatures ?? []).length > 0 && /* @__PURE__ */ jsxs("div", {
						style: { gridColumn: "1 / -1" },
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontSize: 11,
								fontWeight: 700,
								color: "var(--ad-text3)",
								textTransform: "uppercase",
								letterSpacing: "0.07em",
								marginBottom: 3
							},
							children: "Main Features"
						}), /* @__PURE__ */ jsx("ul", {
							style: {
								margin: 0,
								paddingLeft: 18,
								fontSize: 13,
								color: "var(--ad-text)",
								lineHeight: 1.8
							},
							children: (previewPackage.mainFeatures ?? []).map((f, i) => /* @__PURE__ */ jsx("li", { children: f }, i))
						})]
					}),
					(previewPackage.components ?? []).length > 0 && (() => {
						const EMOJI = {
							"Solar Panel": "☀",
							"Inverter": "⚡",
							"Battery": "🔋"
						};
						const ORDER = [
							"Solar Panel",
							"Inverter",
							"Battery"
						];
						const grouped = (previewPackage.components ?? []).reduce((acc, c) => {
							(acc[c.component.category] ??= []).push(c);
							return acc;
						}, {});
						const cats = [...ORDER.filter((c) => grouped[c]), ...Object.keys(grouped).filter((c) => !ORDER.includes(c))];
						return /* @__PURE__ */ jsxs("div", {
							style: { gridColumn: "1 / -1" },
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontSize: 11,
									fontWeight: 700,
									color: "var(--ad-text3)",
									textTransform: "uppercase",
									letterSpacing: "0.07em",
									marginBottom: 8
								},
								children: "Components"
							}), /* @__PURE__ */ jsx("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: 10
								},
								children: cats.map((cat) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									style: {
										fontSize: 11,
										fontWeight: 700,
										color: "var(--ad-text3)",
										marginBottom: 4
									},
									children: [
										EMOJI[cat] ?? "📦",
										" ",
										cat
									]
								}), (grouped[cat] ?? []).map((line, i) => /* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										justifyContent: "space-between",
										fontSize: 13,
										color: "var(--ad-text)",
										padding: "3px 0",
										borderBottom: "1px solid var(--ad-border)"
									},
									children: [/* @__PURE__ */ jsxs("span", { children: [
										/* @__PURE__ */ jsxs("strong", { children: [line.quantity, "×"] }),
										" ",
										line.component.brand,
										" ",
										line.component.name
									] }), line.component.unitPrice != null && /* @__PURE__ */ jsxs("span", {
										style: {
											color: "var(--ad-text3)",
											fontSize: 12
										},
										children: [
											"₱",
											line.component.unitPrice.toLocaleString("en-PH"),
											" ea."
										]
									})]
								}, i))] }, cat))
							})]
						});
					})()
				]
			})
		}),
		showForm && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", {
			style: {
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				background: "rgba(0, 0, 0, 0.5)",
				zIndex: 999,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: 16,
				overflow: "auto"
			},
			onClick: closeForm,
			children: /* @__PURE__ */ jsxs("div", {
				style: {
					background: "var(--ad-bg)",
					borderRadius: 8,
					boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
					maxWidth: 1140,
					width: "100%",
					maxHeight: "90vh",
					overflow: "auto",
					zIndex: 1e3,
					display: "flex",
					flexDirection: "column"
				},
				onClick: (e) => e.stopPropagation(),
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						padding: "18px 20px",
						borderBottom: "2px solid var(--ad-border)",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 12,
						flexShrink: 0,
						position: "sticky",
						top: 0,
						zIndex: 50,
						background: "var(--ad-bg)"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						className: "ad-pkg-modal-title",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "title-main",
							children: [/* @__PURE__ */ jsx("span", {
								className: "accent",
								children: editingId ? "Edit" : "New"
							}), " Package"]
						}), /* @__PURE__ */ jsx("div", {
							className: "title-sub",
							children: editingId ? "Update components, quantities, and settings" : "Build from inventory — specs and price auto-calculate"
						})]
					}), /* @__PURE__ */ jsx("button", {
						onClick: closeForm,
						style: {
							background: "none",
							border: "none",
							fontSize: 22,
							color: "var(--ad-text3)",
							cursor: "pointer",
							padding: 0,
							width: 34,
							height: 34,
							flexShrink: 0,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							borderRadius: 6,
							transition: "background 0.15s, color 0.15s"
						},
						onMouseEnter: (e) => {
							e.currentTarget.style.background = "var(--ad-surface)";
							e.currentTarget.style.color = "var(--ad-text)";
						},
						onMouseLeave: (e) => {
							e.currentTarget.style.background = "none";
							e.currentTarget.style.color = "var(--ad-text3)";
						},
						children: "✕"
					})]
				}), /* @__PURE__ */ jsx("div", {
					style: {
						padding: 20,
						overflow: "auto",
						flex: 1
					},
					children: /* @__PURE__ */ jsxs("div", {
						className: "ad-pkg-builder-layout",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "ad-pkg-builder-left",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "ad-pkg-form-phase",
									children: [/* @__PURE__ */ jsx("div", {
										className: "ad-label",
										children: "System Type"
									}), /* @__PURE__ */ jsxs("div", {
										className: "ad-pkg-phase-toggle",
										children: [/* @__PURE__ */ jsxs("button", {
											type: "button",
											className: `ad-pkg-phase-btn${systemType === "hybrid" ? " is-active" : ""}`,
											onClick: () => setSystemType("hybrid"),
											children: ["Hybrid", /* @__PURE__ */ jsx("span", { children: "With battery storage" })]
										}), /* @__PURE__ */ jsxs("button", {
											type: "button",
											className: `ad-pkg-phase-btn${systemType === "grid-tied" ? " is-active" : ""}`,
											onClick: () => {
												setSystemType("grid-tied");
												setComponents((form.components ?? []).filter((l) => allComponents.find((c) => c.id === l.componentId)?.category !== "Battery"));
											},
											children: ["Grid-Tied", /* @__PURE__ */ jsx("span", { children: "No battery storage" })]
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "ad-pkg-form-phase",
									children: [/* @__PURE__ */ jsx("div", {
										className: "ad-label",
										children: "System Phase"
									}), /* @__PURE__ */ jsxs("div", {
										className: "ad-pkg-phase-toggle",
										children: [/* @__PURE__ */ jsxs("button", {
											type: "button",
											className: `ad-pkg-phase-btn${form.phase === "single" ? " is-active" : ""}`,
											onClick: () => handlePhaseChange("single"),
											children: ["Single Phase", /* @__PURE__ */ jsx("span", { children: "Residential" })]
										}), /* @__PURE__ */ jsxs("button", {
											type: "button",
											className: `ad-pkg-phase-btn${form.phase === "three" ? " is-active" : ""}`,
											onClick: () => handlePhaseChange("three"),
											children: ["Three Phase", /* @__PURE__ */ jsx("span", { children: "Commercial / Industrial" })]
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									style: { marginBottom: 14 },
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: 14,
											fontWeight: 700,
											color: "var(--ad-text)",
											marginBottom: 4
										},
										children: "Build from Inventory"
									}), /* @__PURE__ */ jsx("div", {
										style: {
											fontSize: 12,
											color: "var(--ad-text2)",
											lineHeight: 1.45
										},
										children: "Search and select components to add to your package."
									})]
								}), [
									"Inverter",
									"Solar Panel",
									"Battery",
									"Mounting & Racking",
									"Wiring & Protection",
									"Monitoring",
									"Others"
								].map((category) => {
									if (category === "Battery" && systemType === "grid-tied") return null;
									const addedComponentIds = new Set((form.components ?? []).map((c) => c.componentId));
									const catComps = allComponents.filter((c) => c.isActive && c.category === category && !addedComponentIds.has(c.id)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
									const search = catSearches[category] ?? "";
									const filtered = catComps.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.brand.toLowerCase().includes(search.toLowerCase()) || c.model.toLowerCase().includes(search.toLowerCase()));
									const addedInCat = (form.components ?? []).filter((l) => allComponents.find((c) => c.id === l.componentId)?.category === category);
									const emoji = {
										"Solar Panel": "☀",
										"Inverter": "⚡",
										"Battery": "🔋",
										"Mounting & Racking": "📦",
										"Wiring & Protection": "🔌",
										"Monitoring": "📊",
										"Others": "🔧"
									}[category] ?? "📦";
									const isLocked = (category === "Inverter" || category === "Solar Panel" || category === "Battery") && addedInCat.length > 0;
									const lockedComp = isLocked ? allComponents.find((c) => c.id === addedInCat[0].componentId) : null;
									return /* @__PURE__ */ jsxs("div", {
										style: { marginBottom: 10 },
										children: [/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: 6,
												marginBottom: 5
											},
											children: [/* @__PURE__ */ jsxs("span", {
												style: {
													fontSize: 13,
													fontWeight: 600,
													color: "var(--ad-text)"
												},
												children: [
													emoji,
													" ",
													category
												]
											}), addedInCat.length > 0 && /* @__PURE__ */ jsx("span", {
												style: {
													fontSize: 10,
													background: "var(--ad-accent-dim)",
													color: "var(--ad-accent)",
													borderRadius: 10,
													padding: "1px 7px",
													fontWeight: 600
												},
												children: isLocked ? "selected" : `${addedInCat.length} added`
											})]
										}), isLocked ? /* @__PURE__ */ jsx("div", {
											style: {
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												gap: 8,
												padding: "9px 12px",
												borderRadius: 6,
												fontSize: 12,
												background: "rgba(34,197,94,0.06)",
												border: "1px solid rgba(34,197,94,0.22)"
											},
											children: /* @__PURE__ */ jsxs("div", {
												style: { minWidth: 0 },
												children: [
													/* @__PURE__ */ jsx("span", {
														style: {
															color: "#22c55e",
															marginRight: 5
														},
														children: "✓"
													}),
													/* @__PURE__ */ jsx("span", {
														style: {
															fontWeight: 600,
															color: "var(--ad-text)"
														},
														children: lockedComp?.name ?? category
													}),
													lockedComp && /* @__PURE__ */ jsxs("span", {
														style: {
															color: "var(--ad-text3)",
															marginLeft: 6,
															fontSize: 11
														},
														children: [
															lockedComp.brand,
															" · ",
															lockedComp.model
														]
													})
												]
											})
										}) : /* @__PURE__ */ jsxs("div", {
											style: { position: "relative" },
											children: [/* @__PURE__ */ jsx("input", {
												type: "search",
												className: "ad-input",
												placeholder: `Search ${category}…`,
												value: search,
												onChange: (e) => setCatSearches((s) => ({
													...s,
													[category]: e.target.value
												})),
												onFocus: () => setCatSearches((s) => ({
													...s,
													[category]: s[category] ?? ""
												})),
												style: { width: "100%" }
											}), search !== "" && /* @__PURE__ */ jsx("div", {
												style: {
													position: "absolute",
													top: "100%",
													left: 0,
													right: 0,
													background: "var(--ad-input-bg)",
													border: "1px solid var(--ad-border)",
													borderTop: "none",
													borderRadius: "0 0 8px 8px",
													maxHeight: 220,
													overflowY: "auto",
													zIndex: 20,
													boxShadow: "0 8px 24px rgba(0,0,0,0.18)"
												},
												children: filtered.length === 0 ? /* @__PURE__ */ jsx("div", {
													style: {
														padding: 14,
														textAlign: "center",
														color: "var(--ad-text3)",
														fontSize: 12
													},
													children: "No matches"
												}) : filtered.map((comp) => {
													const spec = (comp.productionCapacityKwp ?? 0) > 0 ? ` · ${(comp.productionCapacityKwp ?? 0).toFixed(2)} kWp` : (comp.loadCapacityKw ?? 0) > 0 ? ` · ${(comp.loadCapacityKw ?? 0).toFixed(1)} kW` : (comp.storageCapacityKwh ?? 0) > 0 ? ` · ${(comp.storageCapacityKwh ?? 0).toFixed(2)} kWh` : "";
													return /* @__PURE__ */ jsxs("button", {
														type: "button",
														onClick: () => {
															const existing = (form.components ?? []).find((l) => l.componentId === comp.id);
															if (existing) {
																if (!existing.baseComponentId) setComponents((form.components ?? []).map((l) => l.componentId === comp.id ? {
																	...l,
																	quantity: l.quantity + 1
																} : l));
															} else setComponents([...form.components ?? [], {
																componentId: comp.id,
																quantity: 1,
																baseComponentId: null,
																multiplier: 1
															}]);
															setCatSearches((s) => ({
																...s,
																[category]: ""
															}));
														},
														style: {
															width: "100%",
															padding: "9px 13px",
															textAlign: "left",
															background: "transparent",
															border: "none",
															borderBottom: "1px solid var(--ad-border)",
															color: "var(--ad-text)",
															cursor: "pointer",
															fontSize: 13,
															transition: "background 0.12s"
														},
														onMouseEnter: (e) => e.currentTarget.style.background = "var(--ad-surface)",
														onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
														children: [/* @__PURE__ */ jsx("div", {
															style: { fontWeight: 600 },
															children: comp.name
														}), /* @__PURE__ */ jsxs("div", {
															style: {
																fontSize: 11,
																color: "var(--ad-text3)",
																marginTop: 2
															},
															children: [
																comp.brand,
																" · ",
																comp.model,
																spec
															]
														})]
													}, comp.id);
												})
											})]
										})]
									}, category);
								})] })
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "ad-pkg-builder-right",
							children: [
								formError && /* @__PURE__ */ jsx("div", {
									className: "ad-field-error",
									"data-field-error": true,
									style: {
										marginBottom: 12,
										padding: "8px 12px",
										background: "rgba(239,68,68,0.08)",
										border: "1px solid rgba(239,68,68,0.25)",
										borderRadius: 8
									},
									children: formError
								}),
								(form.components ?? []).length === 0 ? /* @__PURE__ */ jsxs("div", {
									className: "ad-pkg-summary-empty",
									children: [
										/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: 24,
												marginBottom: 8
											},
											children: "📋"
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												fontWeight: 700,
												fontSize: 14,
												color: "var(--ad-text2)",
												marginBottom: 5
											},
											children: "No components yet"
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: 12,
												lineHeight: 1.5
											},
											children: "Search and select components from the left panel to build your package."
										})
									]
								}) : /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									style: {
										fontSize: 14,
										fontWeight: 700,
										color: "var(--ad-text)",
										marginBottom: 10
									},
									children: ["Selected Components ", /* @__PURE__ */ jsxs("span", {
										style: {
											color: "var(--ad-accent)",
											fontWeight: 800
										},
										children: [
											"(",
											(form.components ?? []).length,
											")"
										]
									})]
								}), /* @__PURE__ */ jsx("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: 6
									},
									children: (form.components ?? []).map((line, idx) => {
										const comp = allComponents.find((c) => c.id === line.componentId);
										if (!comp) return null;
										const specValue = (comp.productionCapacityKwp ?? 0) > 0 ? `${((comp.productionCapacityKwp ?? 0) * line.quantity).toFixed(2)} kWp total` : (comp.loadCapacityKw ?? 0) > 0 ? `${((comp.loadCapacityKw ?? 0) * line.quantity).toFixed(1)} kW total` : (comp.storageCapacityKwh ?? 0) > 0 ? `${((comp.storageCapacityKwh ?? 0) * line.quantity).toFixed(2)} kWh total` : "";
										const isSolarPanel = comp.category === "Solar Panel";
										const isBattery = comp.category === "Battery";
										const componentMax = isSolarPanel || isBattery ? (() => {
											const invLine = (form.components ?? []).find((l) => allComponents.find((c) => c.id === l.componentId)?.category === "Inverter");
											if (!invLine) return null;
											const invComp = allComponents.find((c) => c.id === invLine.componentId);
											if (!invComp) return null;
											if (isSolarPanel) {
												if ((comp.productionCapacityKwp ?? 0) <= 0) return null;
												const totalCapacityKwp = (invComp.pvMaxPower ?? invComp.loadCapacityKw) * invLine.quantity;
												const usedByOtherPanels = (form.components ?? []).reduce((sum, otherLine, otherIdx) => {
													if (otherIdx === idx) return sum;
													const otherComp = allComponents.find((c) => c.id === otherLine.componentId);
													if (!otherComp || otherComp.category !== "Solar Panel") return sum;
													return sum + otherLine.quantity * (otherComp.productionCapacityKwp ?? 0);
												}, 0);
												const remainingKwp = Math.max(0, totalCapacityKwp - usedByOtherPanels);
												return Math.max(0, Math.floor(remainingKwp / (comp.productionCapacityKwp ?? 1)));
											}
											if ((comp.storageCapacityKwh ?? 0) <= 0) return null;
											const battCapPerUnit = invComp.batteryMaxCapacity ?? invComp.loadCapacityKw;
											const rawBattMax = Math.floor(battCapPerUnit * invLine.quantity / (comp.storageCapacityKwh ?? 1));
											return invComp.batteryMaxCapacity != null ? rawBattMax : Math.max(1, rawBattMax);
										})() : null;
										const suggestedPanels = isSolarPanel ? (() => {
											const invLine2 = (form.components ?? []).find((l2) => allComponents.find((c2) => c2.id === l2.componentId)?.category === "Inverter");
											if (!invLine2) return null;
											const invComp2 = allComponents.find((c2) => c2.id === invLine2.componentId);
											if (!invComp2 || (comp.productionCapacityKwp ?? 0) <= 0) return null;
											const panelKwp = comp.productionCapacityKwp ?? 1;
											const dcAcTarget = Math.round(invComp2.loadCapacityKw * invLine2.quantity * 1.2 / panelKwp);
											const battLine2 = (form.components ?? []).find((l2) => allComponents.find((c2) => c2.id === l2.componentId)?.category === "Battery");
											const battComp2 = battLine2 ? allComponents.find((c2) => c2.id === battLine2.componentId) : null;
											const battFloor = battLine2 && battComp2 && (battComp2.storageCapacityKwh ?? 0) > 0 ? Math.ceil(battLine2.quantity * (battComp2.storageCapacityKwh ?? 0) / (4 * .8 * panelKwp)) : 1;
											return Math.min(componentMax ?? dcAcTarget, Math.max(battFloor, dcAcTarget));
										})() : null;
										const panelBelowBattFloor = isSolarPanel ? (() => {
											const battLine2 = (form.components ?? []).find((l2) => allComponents.find((c2) => c2.id === l2.componentId)?.category === "Battery");
											const battComp2 = battLine2 ? allComponents.find((c2) => c2.id === battLine2.componentId) : null;
											const panelKwp = comp.productionCapacityKwp ?? 0;
											if (!battLine2 || !battComp2 || panelKwp <= 0 || (battComp2.storageCapacityKwh ?? 0) <= 0) return false;
											const battFloor = Math.ceil(battLine2.quantity * (battComp2.storageCapacityKwh ?? 0) / (4 * .8 * panelKwp));
											return line.quantity < battFloor;
										})() : false;
										const isAccessory = ACCESSORY_CATEGORIES.includes(comp.category);
										const isDerived = isAccessory && !!line.baseComponentId;
										const nonDerivedLines = (form.components ?? []).filter((l) => !l.baseComponentId && l.componentId !== line.componentId);
										const baseLine = isDerived ? (form.components ?? []).find((l) => l.componentId === line.baseComponentId) : null;
										const baseComp = baseLine ? allComponents.find((c) => c.id === baseLine.componentId) : null;
										return /* @__PURE__ */ jsxs("div", {
											className: `ad-pkg-component-card${isDerived ? " is-derived" : ""}`,
											children: [
												/* @__PURE__ */ jsxs("div", {
													style: {
														display: "flex",
														alignItems: "flex-start",
														justifyContent: "space-between",
														gap: 8
													},
													children: [/* @__PURE__ */ jsxs("div", {
														style: {
															flex: 1,
															minWidth: 0
														},
														children: [/* @__PURE__ */ jsx("div", {
															style: {
																fontSize: 13,
																fontWeight: 600,
																color: "var(--ad-text)",
																lineHeight: 1.3
															},
															children: comp.name
														}), /* @__PURE__ */ jsxs("div", {
															style: {
																fontSize: 11,
																color: "var(--ad-text3)",
																marginTop: 3
															},
															children: [
																comp.brand,
																" · ",
																comp.model
															]
														})]
													}), /* @__PURE__ */ jsxs("div", {
														style: {
															display: "flex",
															alignItems: "center",
															gap: 4,
															flexShrink: 0
														},
														children: [specValue && /* @__PURE__ */ jsx("span", {
															style: {
																fontSize: 11,
																color: "var(--ad-accent)",
																background: "var(--ad-accent-dim)",
																borderRadius: 4,
																padding: "2px 6px",
																fontWeight: 600
															},
															children: specValue
														}), /* @__PURE__ */ jsx("button", {
															className: "ad-btn ad-btn--danger ad-btn--sm",
															onClick: () => setComponents((form.components ?? []).filter((_, i) => i !== idx)),
															style: {
																padding: "2px 8px",
																fontSize: 10
															},
															children: "✕"
														})]
													})]
												}),
												isAccessory && /* @__PURE__ */ jsxs("div", {
													style: {
														borderTop: "1px solid var(--ad-border)",
														paddingTop: 8,
														display: "flex",
														flexDirection: "column",
														gap: 7
													},
													children: [
														/* @__PURE__ */ jsx("div", {
															style: {
																fontSize: 12,
																fontWeight: 600,
																color: "var(--ad-text2)"
															},
															children: "Quantity mode"
														}),
														/* @__PURE__ */ jsxs("select", {
															value: line.baseComponentId ?? "",
															onChange: (e) => {
																const val = e.target.value || null;
																setComponents((form.components ?? []).map((c, i) => i === idx ? {
																	...c,
																	baseComponentId: val,
																	multiplier: val ? c.multiplier ?? 1 : 1
																} : c));
															},
															style: {
																padding: "6px 10px",
																background: "var(--ad-bg)",
																border: "1px solid var(--ad-border)",
																borderRadius: 6,
																color: "var(--ad-text)",
																width: "100%",
																cursor: "pointer",
																fontSize: 13
															},
															children: [/* @__PURE__ */ jsx("option", {
																value: "",
																children: "Fixed quantity (manual)"
															}), nonDerivedLines.map((nl) => {
																const nc = allComponents.find((c) => c.id === nl.componentId);
																if (!nc) return null;
																return /* @__PURE__ */ jsxs("option", {
																	value: nl.componentId,
																	children: [
																		"Scales with: ",
																		nc.name,
																		" (qty ",
																		nl.quantity,
																		")"
																	]
																}, nl.componentId);
															})]
														}),
														isDerived && baseComp && baseLine ? /* @__PURE__ */ jsxs("div", {
															className: "ad-pkg-multiplier-row",
															children: [
																/* @__PURE__ */ jsx("span", {
																	style: {
																		fontSize: 12,
																		color: "var(--ad-text3)"
																	},
																	children: "Each"
																}),
																/* @__PURE__ */ jsxs("span", {
																	style: {
																		fontSize: 12,
																		fontWeight: 600,
																		color: "var(--ad-text)"
																	},
																	children: ["1 × ", baseComp.name]
																}),
																/* @__PURE__ */ jsx("span", {
																	style: {
																		fontSize: 12,
																		color: "var(--ad-text3)"
																	},
																	children: "needs"
																}),
																/* @__PURE__ */ jsxs("div", {
																	className: "ad-pkg-multiplier-stepper",
																	children: [
																		/* @__PURE__ */ jsx("button", {
																			type: "button",
																			className: "ad-pkg-multiplier-btn",
																			disabled: (line.multiplier ?? 1) <= 1,
																			onClick: () => {
																				const m = Math.max(1, (line.multiplier ?? 1) - 1);
																				setComponents((form.components ?? []).map((c, i) => i === idx ? {
																					...c,
																					multiplier: m
																				} : c));
																			},
																			children: "−"
																		}),
																		/* @__PURE__ */ jsx(EditableNumber, {
																			className: "ad-pkg-multiplier-val",
																			value: line.multiplier ?? 1,
																			min: 1,
																			onChange: (m) => setComponents((form.components ?? []).map((c, i) => i === idx ? {
																				...c,
																				multiplier: m
																			} : c))
																		}),
																		/* @__PURE__ */ jsx("button", {
																			type: "button",
																			className: "ad-pkg-multiplier-btn",
																			onClick: () => {
																				const m = (line.multiplier ?? 1) + 1;
																				setComponents((form.components ?? []).map((c, i) => i === idx ? {
																					...c,
																					multiplier: m
																				} : c));
																			},
																			children: "+"
																		})
																	]
																}),
																/* @__PURE__ */ jsxs("span", {
																	style: {
																		fontSize: 12,
																		color: "var(--ad-text3)"
																	},
																	children: ["unit", (line.multiplier ?? 1) !== 1 ? "s" : ""]
																}),
																/* @__PURE__ */ jsxs("div", {
																	className: "ad-pkg-multiplier-result",
																	children: [/* @__PURE__ */ jsx("span", {
																		style: {
																			fontSize: 14,
																			fontWeight: 700,
																			color: "var(--ad-accent)"
																		},
																		children: line.quantity
																	}), /* @__PURE__ */ jsx("span", {
																		style: {
																			fontSize: 11,
																			color: "var(--ad-text3)"
																		},
																		children: "total"
																	})]
																}),
																/* @__PURE__ */ jsxs("div", {
																	style: {
																		width: "100%",
																		fontSize: 11,
																		color: "var(--ad-text3)",
																		marginTop: 2
																	},
																	children: [
																		"ceil(",
																		baseLine.quantity,
																		" × ",
																		line.multiplier ?? 1,
																		") = ",
																		line.quantity,
																		" ",
																		comp.unit ?? "pcs"
																	]
																})
															]
														}) : null
													]
												}),
												!isDerived && /* @__PURE__ */ jsxs("div", {
													style: {
														display: "flex",
														flexDirection: "column",
														gap: 4
													},
													children: [/* @__PURE__ */ jsxs("div", {
														style: {
															display: "flex",
															alignItems: "center",
															gap: 6
														},
														children: [
															/* @__PURE__ */ jsxs("div", {
																style: {
																	display: "flex",
																	alignItems: "center",
																	gap: 3,
																	background: "var(--ad-bg)",
																	border: "1px solid var(--ad-border)",
																	borderRadius: 6,
																	padding: "2px 4px"
																},
																children: [
																	/* @__PURE__ */ jsx("button", {
																		onClick: () => {
																			if (line.quantity > 1) setComponents((form.components ?? []).map((c, i) => i === idx ? {
																				...c,
																				quantity: c.quantity - 1
																			} : c));
																		},
																		style: {
																			background: "none",
																			border: "none",
																			color: "var(--ad-text3)",
																			cursor: line.quantity <= 1 ? "not-allowed" : "pointer",
																			fontSize: 15,
																			padding: "0 5px",
																			fontWeight: "bold",
																			opacity: line.quantity <= 1 ? .3 : 1
																		},
																		children: "−"
																	}),
																	/* @__PURE__ */ jsx(EditableNumber, {
																		style: {
																			fontSize: 13,
																			fontWeight: 700,
																			color: "var(--ad-text)",
																			width: 32,
																			textAlign: "center",
																			background: "none",
																			border: "none",
																			outline: "none"
																		},
																		value: line.quantity,
																		min: 1,
																		max: componentMax,
																		onChange: (n) => setComponents((form.components ?? []).map((c, i) => i === idx ? {
																			...c,
																			quantity: n
																		} : c))
																	}),
																	/* @__PURE__ */ jsx("button", {
																		onClick: () => {
																			if (componentMax === null || line.quantity < componentMax) setComponents((form.components ?? []).map((c, i) => i === idx ? {
																				...c,
																				quantity: c.quantity + 1
																			} : c));
																		},
																		disabled: componentMax !== null && line.quantity >= componentMax,
																		style: {
																			background: "none",
																			border: "none",
																			color: "var(--ad-text3)",
																			cursor: componentMax !== null && line.quantity >= componentMax ? "not-allowed" : "pointer",
																			fontSize: 15,
																			padding: "0 5px",
																			fontWeight: "bold",
																			opacity: componentMax !== null && line.quantity >= componentMax ? .3 : 1
																		},
																		children: "+"
																	})
																]
															}),
															componentMax !== null && /* @__PURE__ */ jsxs("button", {
																onClick: () => setComponents((form.components ?? []).map((c, i) => i === idx ? {
																	...c,
																	quantity: componentMax
																} : c)),
																disabled: line.quantity >= componentMax,
																style: {
																	fontSize: 10,
																	padding: "3px 8px",
																	background: "rgba(59,130,246,0.1)",
																	border: "1px solid rgba(59,130,246,0.25)",
																	borderRadius: 5,
																	color: "#3b82f6",
																	cursor: line.quantity >= componentMax ? "not-allowed" : "pointer",
																	opacity: line.quantity >= componentMax ? .4 : 1
																},
																children: [
																	"Max (",
																	componentMax,
																	")"
																]
															}),
															suggestedPanels !== null && line.quantity !== suggestedPanels && /* @__PURE__ */ jsxs("button", {
																onClick: () => setComponents((form.components ?? []).map((c, i) => i === idx ? {
																	...c,
																	quantity: suggestedPanels
																} : c)),
																style: {
																	fontSize: 10,
																	padding: "3px 8px",
																	background: "rgba(34,197,94,0.1)",
																	border: "1px solid rgba(34,197,94,0.25)",
																	borderRadius: 5,
																	color: "#22c55e",
																	cursor: "pointer"
																},
																children: [
																	"Suggest (",
																	suggestedPanels,
																	")"
																]
															})
														]
													}), panelBelowBattFloor && /* @__PURE__ */ jsx("div", {
														style: {
															fontSize: 10,
															color: "#f59e0b"
														},
														children: "⚠ Array may not fully charge batteries at 4 PSH"
													})]
												})
											]
										}, idx);
									})
								})] }),
								allComponents.length > 0 && (form.components ?? []).length > 0 && (() => {
									const specs = computePackageSpecs(form.components ?? [], allComponents);
									const autoName_ = autoName(specs.solarKwp, specs.inverterKw, specs.storageKwh);
									if (!nameEdited && form.name !== autoName_) setField("name", autoName_);
									return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: 13,
											fontWeight: 700,
											color: "var(--ad-text)",
											marginBottom: 10
										},
										children: "System Specs"
									}), /* @__PURE__ */ jsxs("div", {
										className: "ad-pkg-spec-chips",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "ad-pkg-spec-chip",
												children: [
													/* @__PURE__ */ jsx("div", {
														className: "chip-label",
														children: "Production"
													}),
													/* @__PURE__ */ jsx("div", {
														className: "chip-value",
														children: specs.solarKwp.toFixed(2)
													}),
													/* @__PURE__ */ jsx("div", {
														className: "chip-unit",
														children: "kWp"
													})
												]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "ad-pkg-spec-chip",
												children: [
													/* @__PURE__ */ jsx("div", {
														className: "chip-label",
														children: "Load"
													}),
													/* @__PURE__ */ jsx("div", {
														className: "chip-value",
														children: specs.inverterKw.toFixed(1)
													}),
													/* @__PURE__ */ jsx("div", {
														className: "chip-unit",
														children: "kW"
													})
												]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "ad-pkg-spec-chip",
												children: [
													/* @__PURE__ */ jsx("div", {
														className: "chip-label",
														children: "Storage"
													}),
													/* @__PURE__ */ jsx("div", {
														className: `chip-value${specs.storageKwh <= 0 ? " no-value" : ""}`,
														style: specs.storageKwh <= 0 ? {
															color: "var(--ad-text3)",
															fontSize: 14
														} : {},
														children: specs.storageKwh > 0 ? specs.storageKwh.toFixed(2) : "—"
													}),
													/* @__PURE__ */ jsx("div", {
														className: "chip-unit",
														children: specs.storageKwh > 0 ? "kWh" : ""
													})
												]
											})
										]
									})] });
								})(),
								(form.components ?? []).length > 0 && (() => {
									const lines = form.components ?? [];
									const allPriced = lines.every((l) => {
										const c = allComponents.find((c) => c.id === l.componentId);
										return !c?.pricingEnabled || c?.unitPrice != null;
									});
									const priced = lines.filter((l) => {
										const c = allComponents.find((c) => c.id === l.componentId);
										return c?.pricingEnabled && c?.unitPrice != null;
									});
									const total = allPriced && priced.length > 0 ? priced.reduce((s, l) => {
										return s + (allComponents.find((c) => c.id === l.componentId)?.unitPrice ?? 0) * l.quantity;
									}, 0) : null;
									return /* @__PURE__ */ jsxs("div", {
										style: {
											background: "var(--ad-surface)",
											border: "1px solid var(--ad-border)",
											borderRadius: 8,
											padding: "12px 14px"
										},
										children: [/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: 12,
												fontWeight: 600,
												color: "var(--ad-text3)",
												textTransform: "uppercase",
												letterSpacing: "0.06em",
												marginBottom: 6
											},
											children: "Package Price"
										}), total != null ? /* @__PURE__ */ jsxs("div", {
											style: {
												fontSize: 24,
												fontWeight: 700,
												color: "#22c55e",
												fontFamily: "monospace"
											},
											children: ["₱", total.toLocaleString()]
										}) : /* @__PURE__ */ jsx("div", {
											style: {
												fontSize: 12,
												color: "var(--ad-text3)",
												fontStyle: "italic"
											},
											children: "⚠ Incomplete pricing data"
										})]
									});
								})(),
								(form.components ?? []).length > 0 && /* @__PURE__ */ jsxs("div", {
									style: {
										background: "var(--ad-surface)",
										border: "1px solid var(--ad-border)",
										borderRadius: 8,
										padding: "12px 14px"
									},
									children: [
										/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: 12,
												fontWeight: 600,
												color: "var(--ad-text3)",
												textTransform: "uppercase",
												letterSpacing: "0.06em",
												marginBottom: 6
											},
											children: "Est. Monthly Savings"
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												fontSize: 18,
												fontWeight: 700,
												color: "#22c55e",
												fontFamily: "monospace"
											},
											children: [
												"₱",
												(form.billRangeMin || 0).toLocaleString(),
												" – ₱",
												(form.billRangeMax || 0).toLocaleString()
											]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												fontSize: 11,
												color: "var(--ad-text3)",
												marginTop: 4
											},
											children: [form.solarKwp.toFixed(2), " kWp × 4h × 30d × ₱12/kWh ± ₱1,000"]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("label", {
										className: "ad-label",
										children: ["Card Features ", /* @__PURE__ */ jsx("span", {
											style: {
												fontWeight: 400,
												color: "var(--ad-text3)"
											},
											children: "(optional · one per line)"
										})]
									}),
									/* @__PURE__ */ jsx("textarea", {
										className: "ad-input",
										rows: 3,
										style: {
											resize: "vertical",
											fontFamily: "inherit",
											fontSize: 11
										},
										placeholder: "Hybrid System\nMobile Device Monitoring\n5kW Load Capacity",
										value: (form.mainFeatures ?? []).join("\n"),
										onChange: (e) => setField("mainFeatures", e.target.value.split("\n").map((s) => s.trimEnd()).filter((s) => s))
									}),
									/* @__PURE__ */ jsx("small", {
										style: {
											fontSize: 11,
											color: "var(--ad-text3)",
											marginTop: 4,
											display: "block"
										},
										children: "Leave blank to auto-generate from components."
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "ad-label",
									children: ["Package Image ", /* @__PURE__ */ jsx("span", {
										style: {
											fontWeight: 400,
											color: "var(--ad-text3)"
										},
										children: "(optional — max 10 MB)"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "ad-image-row",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "ad-image-drop",
										style: { flex: 1 },
										onClick: () => document.getElementById("pkg-img-input")?.click(),
										onDragOver: (e) => e.preventDefault(),
										onDrop: (e) => {
											e.preventDefault();
											handlePkgImageSelect(e.dataTransfer.files?.[0]);
										},
										children: [/* @__PURE__ */ jsx("input", {
											id: "pkg-img-input",
											type: "file",
											accept: "image/jpeg,image/png,image/webp,image/gif,image/avif",
											hidden: true,
											onChange: (e) => handlePkgImageSelect(e.target.files?.[0])
										}), pkgImageFile ? /* @__PURE__ */ jsxs("span", { children: [
											pkgImageFile.name,
											" (",
											(pkgImageFile.size / 1024).toFixed(0),
											" KB)"
										] }) : pkgImagePreview ? /* @__PURE__ */ jsx("span", {
											style: { color: "var(--ad-text2)" },
											children: "Image set — click or drop to replace"
										}) : /* @__PURE__ */ jsxs(Fragment, { children: [
											/* @__PURE__ */ jsx("span", { children: "Click or drag & drop an image" }),
											/* @__PURE__ */ jsx("br", {}),
											/* @__PURE__ */ jsx("small", { children: "JPEG, PNG, WebP, AVIF, GIF — max 10 MB" })
										] })]
									}), pkgImagePreview && /* @__PURE__ */ jsx("img", {
										src: pkgImagePreview,
										alt: "Package preview",
										className: "ad-image-preview"
									})]
								})] }),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: 8
									},
									children: [/* @__PURE__ */ jsxs("label", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: 9,
											cursor: "pointer"
										},
										children: [/* @__PURE__ */ jsx("input", {
											type: "checkbox",
											checked: form.isActive,
											onChange: (e) => setField("isActive", e.target.checked),
											style: {
												width: 16,
												height: 16,
												accentColor: "var(--ad-accent)",
												cursor: "pointer",
												flexShrink: 0
											}
										}), /* @__PURE__ */ jsx("span", {
											style: {
												color: "var(--ad-text)",
												fontSize: 13
											},
											children: "Active — visible to customers"
										})]
									}), /* @__PURE__ */ jsxs("label", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: 9,
											cursor: "pointer"
										},
										children: [/* @__PURE__ */ jsx("input", {
											type: "checkbox",
											checked: form.isRecommended,
											onChange: (e) => setField("isRecommended", e.target.checked),
											style: {
												width: 16,
												height: 16,
												accentColor: "var(--ad-accent)",
												cursor: "pointer",
												flexShrink: 0
											}
										}), /* @__PURE__ */ jsx("span", {
											style: {
												color: "var(--ad-text)",
												fontSize: 13
											},
											children: "Recommended — highlighted on packages page"
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: 6
									},
									children: [
										/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: 12,
												fontWeight: 600,
												color: "var(--ad-text3)",
												textTransform: "uppercase",
												letterSpacing: "0.06em"
											},
											children: "IP Rating Badge"
										}),
										/* @__PURE__ */ jsxs("select", {
											className: "ad-input",
											value: form.ipRatingId ?? "",
											onChange: (e) => setField("ipRatingId", e.target.value || null),
											style: { cursor: "pointer" },
											children: [/* @__PURE__ */ jsx("option", {
												value: "",
												children: "— None —"
											}), allIpRatings.map((r) => /* @__PURE__ */ jsxs("option", {
												value: r.id,
												children: [
													r.code,
													" — ",
													r.description
												]
											}, r.id))]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												fontSize: 11,
												color: "var(--ad-text3)",
												lineHeight: 1.45
											},
											children: [
												"Shown as a hoverable badge on the package card in the client frontend.",
												" ",
												allIpRatings.length === 0 && /* @__PURE__ */ jsx("span", {
													style: { color: "var(--ad-accent)" },
													children: "No ratings yet — add them in Utilities."
												})
											]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: 6
									},
									children: [
										/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: 12,
												fontWeight: 600,
												color: "var(--ad-text3)",
												textTransform: "uppercase",
												letterSpacing: "0.06em"
											},
											children: "Display Order"
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: 10
											},
											children: [/* @__PURE__ */ jsx("input", {
												type: "number",
												min: 1,
												value: form.sortOrder ?? 1,
												onChange: (e) => {
													handleSortOrderChange(Math.max(1, parseInt(e.target.value, 10) || 1), form.phase, form.sortOrder ?? 1);
												},
												className: "ad-input",
												style: {
													width: 72,
													textAlign: "center",
													padding: "6px 8px"
												}
											}), /* @__PURE__ */ jsxs("span", {
												style: {
													fontSize: 12,
													color: "var(--ad-text3)"
												},
												children: [
													form.phase === "single" ? `of ${singlePkgs.length} Single Phase` : `of ${threePkgs.length} Three Phase`,
													" packages",
													!isSortOrderManual && /* @__PURE__ */ jsx("span", {
														style: {
															marginLeft: 6,
															opacity: .55
														},
														children: "(auto)"
													})
												]
											})]
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: 11,
												color: "var(--ad-text3)",
												lineHeight: 1.45
											},
											children: "Recommended packages always appear first on the client frontend — this order applies within each group."
										}),
										sortOrderConflict && (() => {
											const bumpTo = Math.max(0, ...packages.filter((p) => p.phase === form.phase && p.id !== editingId && p.id !== sortOrderConflict.takenBy.id).map((p) => p.sortOrder ?? 0)) + 1;
											return /* @__PURE__ */ jsxs("div", {
												style: {
													background: "rgba(252,97,90,0.08)",
													border: "1px solid rgba(252,97,90,0.25)",
													borderRadius: 8,
													padding: "10px 12px"
												},
												children: [/* @__PURE__ */ jsxs("div", {
													style: {
														fontSize: 12,
														color: "#fc615a",
														fontWeight: 600,
														marginBottom: 8
													},
													children: [
														"Order #",
														sortOrderConflict.proposed,
														" is already used by \"",
														sortOrderConflict.takenBy.name,
														"\""
													]
												}), /* @__PURE__ */ jsxs("div", {
													style: {
														display: "flex",
														gap: 8,
														flexWrap: "wrap"
													},
													children: [/* @__PURE__ */ jsxs("button", {
														type: "button",
														className: "ad-btn ad-btn--sm",
														onClick: () => {
															setPendingSwap({
																id: sortOrderConflict.takenBy.id,
																name: sortOrderConflict.takenBy.name,
																newSortOrder: bumpTo
															});
															setSortOrderConflict(null);
														},
														children: ["Swap — move it to #", bumpTo]
													}), /* @__PURE__ */ jsxs("button", {
														type: "button",
														className: "ad-btn ad-btn--ghost ad-btn--sm",
														onClick: () => {
															setField("sortOrder", sortOrderConflict.prevValue);
															setSortOrderConflict(null);
															setPendingSwap(null);
														},
														children: ["Revert to #", sortOrderConflict.prevValue]
													})]
												})]
											});
										})(),
										pendingSwap && /* @__PURE__ */ jsxs("div", {
											style: {
												background: "rgba(34,197,94,0.06)",
												border: "1px solid rgba(34,197,94,0.2)",
												borderRadius: 6,
												padding: "6px 10px",
												fontSize: 11,
												color: "#22c55e"
											},
											children: [
												"✓ On save: \"",
												pendingSwap.name,
												"\" will move to #",
												pendingSwap.newSortOrder,
												/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => setPendingSwap(null),
													style: {
														background: "none",
														border: "none",
														cursor: "pointer",
														color: "#22c55e",
														fontSize: 11,
														marginLeft: 8,
														textDecoration: "underline",
														padding: 0
													},
													children: "Undo"
												})
											]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "ad-form-actions",
									style: { paddingTop: 4 },
									children: [/* @__PURE__ */ jsx("button", {
										onClick: () => void handleSave(),
										disabled: saving,
										className: "ad-btn",
										children: saving ? "Saving…" : editingId ? "Update Package" : "Create Package"
									}), /* @__PURE__ */ jsx("button", {
										onClick: closeForm,
										className: "ad-btn ad-btn--ghost",
										children: "Cancel"
									})]
								})
							]
						})]
					})
				})]
			})
		}) }),
		loading ? /* @__PURE__ */ jsx("div", {
			style: {
				color: "var(--ad-text2)",
				padding: 24
			},
			children: "Loading packages…"
		}) : packages.length === 0 ? /* @__PURE__ */ jsxs("div", {
			className: "ad-card",
			style: {
				textAlign: "center",
				padding: "48px 24px"
			},
			children: [/* @__PURE__ */ jsx("div", {
				style: {
					fontSize: 15,
					color: "var(--ad-text2)",
					marginBottom: 8
				},
				children: "No packages yet"
			}), /* @__PURE__ */ jsxs("div", {
				style: {
					fontSize: 13,
					color: "var(--ad-text3)",
					maxWidth: 450,
					margin: "0 auto"
				},
				children: [
					"Click ",
					/* @__PURE__ */ jsx("strong", { children: "+ Add Package" }),
					" to build a new solar package. Choose components from your ",
					/* @__PURE__ */ jsx("strong", { children: "Inventory" }),
					" tab, and the system will auto-calculate your system specs and total price. Active packages appear on the public ",
					/* @__PURE__ */ jsx("strong", { children: "/packages" }),
					" page."
				]
			})]
		}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PkgPhaseSection, {
			phase: "single",
			packages: singlePkgs,
			showForm,
			peso,
			onPreview: setPreviewPackage,
			onEdit: openEdit,
			onDelete: setDeleteTarget,
			onToggle: (p) => void handleToggleActive(p),
			deleting,
			toggling
		}), /* @__PURE__ */ jsx(PkgPhaseSection, {
			phase: "three",
			packages: threePkgs,
			showForm,
			peso,
			onPreview: setPreviewPackage,
			onEdit: openEdit,
			onDelete: setDeleteTarget,
			onToggle: (p) => void handleToggleActive(p),
			deleting,
			toggling
		})] })
	] });
}
function useSectionEditor(apiKey, contentKey, defaults) {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [msg, setMsg] = useState("");
	const [form, setForm] = useState(defaults);
	const [tick, setTick] = useState(0);
	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		adminGetAllContent(apiKey).then((res) => {
			if (cancelled) return;
			const item = res.data.find((i) => i.key === contentKey);
			setForm(item?.data ? {
				...defaults,
				...item.data
			} : { ...defaults });
		}).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [tick]);
	const save = async (data) => {
		setSaving(true);
		setMsg("");
		try {
			const res = await adminUpsertContent(apiKey, contentKey, data);
			if (res?.data) setForm((f) => ({
				...f,
				...res.data
			}));
			setMsg("✓ Saved successfully");
		} catch (e) {
			setMsg(`Error: ${e.message}`);
		} finally {
			setSaving(false);
		}
	};
	const [resetPending, setResetPending] = useState(false);
	const startReset = () => setResetPending(true);
	const cancelReset = () => setResetPending(false);
	const confirmReset = async () => {
		setResetPending(false);
		try {
			await adminResetContent(apiKey, contentKey);
			setMsg("✓ Reset to default");
			setTick((t) => t + 1);
		} catch (e) {
			setMsg(`Error: ${e.message}`);
		}
	};
	return {
		loading,
		saving,
		msg,
		form,
		setForm,
		save,
		resetPending,
		startReset,
		cancelReset,
		confirmReset
	};
}
function SectionEditorHeader({ title, onReset, resetPending, onConfirmReset, onCancelReset }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(ConfirmDeleteModal, {
		open: !!resetPending,
		title: `Reset "${title}" to default?`,
		description: "All current content will be replaced with the default values. This cannot be undone.",
		onConfirm: onConfirmReset ?? (() => {}),
		onCancel: onCancelReset ?? (() => {})
	}), /* @__PURE__ */ jsxs("div", {
		className: "ad-section-header",
		style: { marginBottom: 16 },
		children: [/* @__PURE__ */ jsx("div", {
			className: "ad-section-title",
			children: title
		}), /* @__PURE__ */ jsx("button", {
			onClick: onReset,
			className: "ad-btn ad-btn--danger ad-btn--sm",
			children: "Reset to Default"
		})]
	})] });
}
var HERO_SECTIONS = [
	{
		label: "Calculator",
		value: "#calculator"
	},
	{
		label: "Hero",
		value: "#hero"
	},
	{
		label: "Metrics / Stats",
		value: "#metrics"
	},
	{
		label: "Benefits",
		value: "#benefits"
	},
	{
		label: "Excellence",
		value: "#excellence"
	},
	{
		label: "Tropics",
		value: "#tropics"
	},
	{
		label: "Process",
		value: "#process"
	},
	{
		label: "Client Journey",
		value: "#client-journey"
	},
	{
		label: "Call to Action",
		value: "#call-to-action"
	}
];
var HERO_PAGES = [
	{
		label: "Home",
		value: "/"
	},
	{
		label: "Projects",
		value: "/projects"
	},
	{
		label: "Packages",
		value: "/packages"
	},
	{
		label: "Solar Calculator",
		value: "/solar-calculator"
	}
];
var DEPRECATED_URLS = { "/quotation-engine": "/solar-calculator" };
function CtaDestinationPicker({ label, value, onChange }) {
	const normalised = DEPRECATED_URLS[value] ?? value;
	const isSection = normalised.startsWith("#");
	const typeOptions = [{
		label: "Section (scroll)",
		value: "section"
	}, {
		label: "Page (navigate)",
		value: "page"
	}];
	const handleTypeChange = (type) => {
		onChange(type === "section" ? HERO_SECTIONS[0].value : HERO_PAGES[0].value);
	};
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
		className: "ad-label",
		children: label
	}), /* @__PURE__ */ jsxs("div", {
		style: {
			display: "grid",
			gridTemplateColumns: "1fr 1fr",
			gap: 8
		},
		children: [/* @__PURE__ */ jsx("select", {
			className: "ad-input",
			value: isSection ? "section" : "page",
			onChange: (e) => handleTypeChange(e.target.value),
			children: typeOptions.map((o) => /* @__PURE__ */ jsx("option", {
				value: o.value,
				children: o.label
			}, o.value))
		}), isSection ? /* @__PURE__ */ jsx("select", {
			className: "ad-input",
			value: normalised,
			onChange: (e) => onChange(e.target.value),
			children: HERO_SECTIONS.map((s) => /* @__PURE__ */ jsx("option", {
				value: s.value,
				children: s.label
			}, s.value))
		}) : /* @__PURE__ */ jsx("select", {
			className: "ad-input",
			value: normalised,
			onChange: (e) => onChange(e.target.value),
			children: HERO_PAGES.map((p) => /* @__PURE__ */ jsx("option", {
				value: p.value,
				children: p.label
			}, p.value))
		})]
	})] });
}
var DEFAULT_HERO_FORM = {
	headerPart1: "Affordable",
	headerPart2: "Solar Power for Every Filipino Home and Business",
	highlightWords: "Affordable",
	subtext: "We Provide Solar Solutions Tailored For Your Home And Business",
	primaryCta: "Calculate Your Savings",
	secondaryCta: "View Projects",
	primaryCtaUrl: "#calculator",
	secondaryCtaUrl: "/projects"
};
function HeroEditor({ apiKey }) {
	const { loading, saving, msg, form, setForm, save, resetPending, startReset, cancelReset, confirmReset } = useSectionEditor(apiKey, "hero", DEFAULT_HERO_FORM);
	const ch = (k) => (e) => setForm((f) => ({
		...f,
		[k]: e.target.value
	}));
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: {
			color: "var(--ad-text2)",
			padding: 24
		},
		children: "Loading…"
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(SectionEditorHeader, {
			title: "Hero Section",
			onReset: startReset,
			resetPending,
			onConfirmReset: confirmReset,
			onCancelReset: cancelReset
		}),
		/* @__PURE__ */ jsx(Toast, { msg }),
		/* @__PURE__ */ jsxs("div", {
			className: "ad-card",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "ad-form-grid",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Headline — Part 1"
					}), /* @__PURE__ */ jsx("input", {
						className: "ad-input",
						value: form.headerPart1,
						onChange: ch("headerPart1"),
						placeholder: "Affordable"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Headline — Part 2"
					}), /* @__PURE__ */ jsx("input", {
						className: "ad-input",
						value: form.headerPart2,
						onChange: ch("headerPart2"),
						placeholder: "Solar Power for Every Filipino Home and Business"
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "ad-form-full",
						children: [
							/* @__PURE__ */ jsxs("label", {
								className: "ad-label",
								children: ["Highlighted Words ", /* @__PURE__ */ jsx("span", {
									style: {
										fontWeight: 400,
										opacity: .6
									},
									children: "(comma-separated)"
								})]
							}),
							/* @__PURE__ */ jsx("input", {
								className: "ad-input",
								value: form.highlightWords,
								onChange: ch("highlightWords"),
								placeholder: "Affordable, Filipino"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "ad-pkg-hint",
								children: "Words in Part 1 + Part 2 that match will be shown in the accent colour. Separate multiple words with a comma."
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "ad-form-full",
						children: [/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Subtext"
						}), /* @__PURE__ */ jsx("input", {
							className: "ad-input",
							value: form.subtext,
							onChange: ch("subtext"),
							placeholder: "We Provide Solar Solutions Tailored For Your Home And Business"
						})]
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Primary Button Label"
					}), /* @__PURE__ */ jsx("input", {
						className: "ad-input",
						value: form.primaryCta,
						onChange: ch("primaryCta"),
						placeholder: "Calculate Your Savings"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Secondary Button Label"
					}), /* @__PURE__ */ jsx("input", {
						className: "ad-input",
						value: form.secondaryCta,
						onChange: ch("secondaryCta"),
						placeholder: "View Projects"
					})] }),
					/* @__PURE__ */ jsx(CtaDestinationPicker, {
						label: "Primary Button Destination",
						value: form.primaryCtaUrl,
						onChange: (v) => setForm((f) => ({
							...f,
							primaryCtaUrl: v
						}))
					}),
					/* @__PURE__ */ jsx(CtaDestinationPicker, {
						label: "Secondary Button Destination",
						value: form.secondaryCtaUrl,
						onChange: (v) => setForm((f) => ({
							...f,
							secondaryCtaUrl: v
						}))
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "ad-form-actions",
				children: /* @__PURE__ */ jsx("button", {
					onClick: () => void save(form),
					disabled: saving,
					className: "ad-btn",
					children: saving ? "Saving…" : "Save Changes"
				})
			})]
		})
	] });
}
var DEFAULT_METRICS_FORM = { items: [
	{
		value: "0",
		label: "INSTALLED",
		order: 1
	},
	{
		value: "0",
		label: "ACTIVE CLIENTS",
		order: 2
	},
	{
		value: "0",
		label: "CERTIFIED COMPLIANT",
		order: 3
	},
	{
		value: "0",
		label: "PERFORMANCE WARRANTY",
		order: 4
	}
] };
function MetricsEditor({ apiKey }) {
	const { loading, saving, msg, form, setForm, save, resetPending, startReset, cancelReset, confirmReset } = useSectionEditor(apiKey, "metrics", DEFAULT_METRICS_FORM);
	const updateItem = (idx, key, val) => setForm((f) => ({
		...f,
		items: f.items.map((item, i) => i === idx ? {
			...item,
			[key]: val
		} : item)
	}));
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: {
			color: "var(--ad-text2)",
			padding: 24
		},
		children: "Loading…"
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(SectionEditorHeader, {
			title: "Metrics / Stats",
			onReset: startReset,
			resetPending,
			onConfirmReset: confirmReset,
			onCancelReset: cancelReset
		}),
		/* @__PURE__ */ jsx(Toast, { msg }),
		/* @__PURE__ */ jsxs("div", {
			className: "ad-card",
			children: [
				/* @__PURE__ */ jsx("p", {
					style: {
						fontSize: 13,
						color: "var(--ad-text2)",
						marginBottom: 16
					},
					children: "These numbers appear in the stats strip below the hero section."
				}),
				form.items.map((item, i) => /* @__PURE__ */ jsxs("div", {
					className: "ad-metrics-row",
					children: [/* @__PURE__ */ jsxs("div", { children: [i === 0 && /* @__PURE__ */ jsx("div", {
						className: "ad-label",
						children: "Value"
					}), /* @__PURE__ */ jsx("input", {
						className: "ad-input",
						style: {
							textAlign: "center",
							fontWeight: 700
						},
						value: item.value,
						onChange: (e) => updateItem(i, "value", e.target.value),
						placeholder: "e.g. 25yr"
					})] }), /* @__PURE__ */ jsxs("div", { children: [i === 0 && /* @__PURE__ */ jsx("div", {
						className: "ad-label",
						children: "Label"
					}), /* @__PURE__ */ jsx("input", {
						className: "ad-input",
						value: item.label,
						onChange: (e) => updateItem(i, "label", e.target.value),
						placeholder: "e.g. PERFORMANCE WARRANTY"
					})] })]
				}, i)),
				/* @__PURE__ */ jsx("div", {
					className: "ad-form-actions",
					children: /* @__PURE__ */ jsx("button", {
						onClick: () => void save(form),
						disabled: saving,
						className: "ad-btn",
						children: saving ? "Saving…" : "Save Changes"
					})
				})
			]
		})
	] });
}
var DEFAULT_BENEFITS_FORM = { items: [
	{
		title: "Long-Term Durability",
		description: "25-YEAR WARRANTY",
		order: 1
	},
	{
		title: "Lower Monthly Bills",
		description: "CUT YOUR ENERGY COSTS",
		order: 2
	},
	{
		title: "Monitoring",
		description: "TRACK YOUR ENERGY & SAVINGS",
		order: 3
	},
	{
		title: "Peace of Mind",
		description: "WORRY-FREE ENERGY SINCE DAY ONE",
		order: 4
	}
] };
function BenefitsEditor({ apiKey }) {
	const { loading, saving, msg, form, setForm, save, resetPending, startReset, cancelReset, confirmReset } = useSectionEditor(apiKey, "benefits", DEFAULT_BENEFITS_FORM);
	const updateItem = (idx, key, val) => setForm((f) => ({
		...f,
		items: f.items.map((item, i) => i === idx ? {
			...item,
			[key]: val
		} : item)
	}));
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: {
			color: "var(--ad-text2)",
			padding: 24
		},
		children: "Loading…"
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(SectionEditorHeader, {
			title: "Benefits Banner",
			onReset: startReset,
			resetPending,
			onConfirmReset: confirmReset,
			onCancelReset: cancelReset
		}),
		/* @__PURE__ */ jsx(Toast, { msg }),
		/* @__PURE__ */ jsxs("div", {
			className: "ad-card",
			children: [form.items.map((item, i) => /* @__PURE__ */ jsxs("div", {
				style: { marginBottom: i < form.items.length - 1 ? 20 : 0 },
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						fontWeight: 600,
						fontSize: 12,
						color: "var(--ad-text3)",
						textTransform: "uppercase",
						letterSpacing: "0.06em",
						marginBottom: 8
					},
					children: ["Benefit ", i + 1]
				}), /* @__PURE__ */ jsxs("div", {
					className: "ad-form-grid",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Title"
					}), /* @__PURE__ */ jsx("input", {
						className: "ad-input",
						value: item.title,
						onChange: (e) => updateItem(i, "title", e.target.value)
					})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Tag / Descriptor"
					}), /* @__PURE__ */ jsx("input", {
						className: "ad-input",
						value: item.description,
						onChange: (e) => updateItem(i, "description", e.target.value)
					})] })]
				})]
			}, i)), /* @__PURE__ */ jsx("div", {
				className: "ad-form-actions",
				children: /* @__PURE__ */ jsx("button", {
					onClick: () => void save(form),
					disabled: saving,
					className: "ad-btn",
					children: saving ? "Saving…" : "Save Changes"
				})
			})]
		})
	] });
}
var DEFAULT_TROPICS_FORM = {
	header: "Solar Energy for the Tropics",
	subtext: "Standard solar systems are often not equipped to handle the unique challenges of the tropics. At azari.solar we bridge the Trust Gap with resilient design for the philippine archipelago.",
	performanceRating: 87
};
function TropicsEditor({ apiKey }) {
	const { loading, saving, msg, form, setForm, save, resetPending, startReset, cancelReset, confirmReset } = useSectionEditor(apiKey, "tropics", DEFAULT_TROPICS_FORM);
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: {
			color: "var(--ad-text2)",
			padding: 24
		},
		children: "Loading…"
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(SectionEditorHeader, {
			title: "Tropics Section",
			onReset: startReset,
			resetPending,
			onConfirmReset: confirmReset,
			onCancelReset: cancelReset
		}),
		/* @__PURE__ */ jsx(Toast, { msg }),
		/* @__PURE__ */ jsxs("div", {
			className: "ad-card",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "ad-form-grid",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "ad-form-full",
						children: [
							/* @__PURE__ */ jsx("label", {
								className: "ad-label",
								children: "Section Header"
							}),
							/* @__PURE__ */ jsx("input", {
								className: "ad-input",
								value: form.header,
								onChange: (e) => setForm((f) => ({
									...f,
									header: e.target.value
								})),
								placeholder: "Solar Energy for the Tropics"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "ad-pkg-hint",
								children: "Use <br /> to split into two lines."
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "ad-form-full",
						children: [/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Subtext"
						}), /* @__PURE__ */ jsx("textarea", {
							className: "ad-textarea",
							rows: 3,
							value: form.subtext,
							onChange: (e) => setForm((f) => ({
								...f,
								subtext: e.target.value
							}))
						})]
					}),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Performance Rating (%)"
						}),
						/* @__PURE__ */ jsx("input", {
							className: "ad-input",
							type: "number",
							min: 0,
							max: 100,
							value: form.performanceRating,
							onChange: (e) => {
								const v = Math.min(100, Math.max(0, Number(e.target.value)));
								setForm((f) => ({
									...f,
									performanceRating: v
								}));
							},
							placeholder: "87"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "ad-pkg-hint",
							children: "Shown as the bar chart percentage on the Performance Guarantee card (0–100)."
						})
					] })
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "ad-form-actions",
				children: /* @__PURE__ */ jsx("button", {
					onClick: () => void save(form),
					disabled: saving,
					className: "ad-btn",
					children: saving ? "Saving…" : "Save Changes"
				})
			})]
		})
	] });
}
var DEFAULT_JOURNEY_FORM = { entries: [
	{
		id: "1",
		name: "Santos Family",
		location: "Quezon City, Metro Manila",
		testimonial: "Our Meralco bill dropped by 87% in the first month. The team handled the entire Net-Metering application perfectly, and now we literally earn credits while we sleep.",
		videoUrl: "",
		coords: [121.05, 14.68]
	},
	{
		id: "2",
		name: "Cruz Commercial",
		location: "Cebu City, Cebu",
		testimonial: "Operating costs dropped significantly since we installed our solar array. The team handled everything from permits to final inspection.",
		videoUrl: "",
		coords: [123.9, 10.32]
	},
	{
		id: "3",
		name: "Reyes Residence",
		location: "Davao City, Davao del Sur",
		testimonial: "We were skeptical at first, but the numbers don't lie. Within 18 months we recovered a significant portion of our investment.",
		videoUrl: "",
		coords: [125.61, 7.07]
	},
	{
		id: "4",
		name: "De Leon Residence",
		location: "Angeles City, Pampanga",
		testimonial: "Professional installation completed in just two days. Our home now runs entirely on solar during daytime hours.",
		videoUrl: "",
		coords: [120.59, 15.15]
	},
	{
		id: "5",
		name: "Garcia Business",
		location: "Iloilo City, Iloilo",
		testimonial: "As a business owner, the ROI was clear from the start. Our electricity expenses went from our highest operating cost to nearly negligible.",
		videoUrl: "",
		coords: [122.57, 10.72]
	},
	{
		id: "6",
		name: "Torres Family",
		location: "Batangas City, Batangas",
		testimonial: "Consistent monthly savings since day one. The process from quotation to installation was seamless.",
		videoUrl: "",
		coords: [121.05, 13.76]
	},
	{
		id: "7",
		name: "Chua Enterprise",
		location: "Cagayan de Oro, Misamis Oriental",
		testimonial: "We installed a 50kWp commercial system across our warehouse rooftops. The project was completed on schedule and within budget.",
		videoUrl: "",
		coords: [124.63, 8.48]
	}
] };
async function geocodePhLocation(location) {
	try {
		const data = await (await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&countrycodes=ph&limit=1`)).json();
		if (!data.length) return null;
		return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
	} catch {
		return null;
	}
}
function ClientJourneyEditor({ apiKey }) {
	const { loading, msg, form, setForm, save } = useSectionEditor(apiKey, "clientJourney", DEFAULT_JOURNEY_FORM);
	const [geocoding, setGeocoding] = useState(false);
	const [geoMsg, setGeoMsg] = useState("");
	const [modalMode, setModalMode] = useState(null);
	const [draft, setDraft] = useState({
		id: "",
		name: "",
		location: "",
		testimonial: "",
		videoUrl: "",
		coords: [122, 12]
	});
	const [deleteTarget, setDeleteTarget] = useState(null);
	const emptyDraft = () => ({
		id: crypto.randomUUID(),
		name: "",
		location: "",
		testimonial: "",
		videoUrl: "",
		coords: [122, 12]
	});
	const openAdd = () => {
		setDraft(emptyDraft());
		setGeoMsg("");
		setModalMode("add");
	};
	const openEdit = (entry) => {
		setDraft({ ...entry });
		setGeoMsg("");
		setModalMode("edit");
	};
	const openView = (entry) => {
		setDraft({ ...entry });
		setGeoMsg("");
		setModalMode("view");
	};
	const closeModal = () => {
		setModalMode(null);
		setGeoMsg("");
	};
	const locate = async () => {
		const loc = draft.location?.trim();
		if (!loc) return;
		setGeocoding(true);
		setGeoMsg("");
		const coords = await geocodePhLocation(loc);
		if (coords) {
			setDraft((d) => ({
				...d,
				coords
			}));
			setGeoMsg(`✓ Located: ${coords[1].toFixed(4)}°N, ${coords[0].toFixed(4)}°E`);
		} else setGeoMsg("Location not found. Try a more specific place name.");
		setGeocoding(false);
	};
	const handleModalSave = () => {
		const newEntries = modalMode === "add" ? [...form.entries, draft] : form.entries.map((e) => e.id === draft.id ? { ...draft } : e);
		const newForm = {
			...form,
			entries: newEntries
		};
		setForm(newForm);
		save(newForm);
		closeModal();
	};
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: {
			color: "var(--ad-text2)",
			padding: 24
		},
		children: "Loading…"
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx("div", {
			className: "ad-section-header",
			style: { marginBottom: 16 },
			children: /* @__PURE__ */ jsx("div", {
				className: "ad-section-title",
				children: "Client Journey"
			})
		}),
		/* @__PURE__ */ jsx(Toast, { msg }),
		/* @__PURE__ */ jsx(ConfirmDeleteModal, {
			open: !!deleteTarget,
			title: `Remove "${deleteTarget?.name || "this entry"}"?`,
			description: "This client journey entry will be removed from the map and testimonials.",
			onConfirm: () => {
				if (deleteTarget) {
					const newForm = {
						...form,
						entries: form.entries.filter((e) => e.id !== deleteTarget.id)
					};
					setForm(newForm);
					save(newForm);
				}
				setDeleteTarget(null);
			},
			onCancel: () => setDeleteTarget(null)
		}),
		/* @__PURE__ */ jsxs(AdminModal, {
			open: modalMode === "add" || modalMode === "edit",
			onClose: closeModal,
			title: modalMode === "add" ? "Add Client Journey Entry" : `Edit — ${draft.name || "Entry"}`,
			subtitle: "Appears as a testimonial card and pin on the Philippines map.",
			maxWidth: 560,
			children: [/* @__PURE__ */ jsxs("div", {
				className: "ad-form-grid",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Client / Business Name"
					}), /* @__PURE__ */ jsx("input", {
						className: "ad-input",
						value: draft.name,
						onChange: (e) => setDraft((d) => ({
							...d,
							name: e.target.value
						})),
						placeholder: "Santos Family"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Location"
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								gap: 8
							},
							children: [/* @__PURE__ */ jsx(LocationAutocompleteInput, {
								value: draft.location,
								onChange: (val) => setDraft((d) => ({
									...d,
									location: val
								})),
								placeholder: "Quezon City, Metro Manila",
								inputClassName: "ad-input",
								wrapperStyle: {
									flex: 1,
									minWidth: 0
								}
							}), /* @__PURE__ */ jsx("button", {
								className: "ad-btn ad-btn--sm",
								onClick: () => void locate(),
								disabled: geocoding || !draft.location.trim(),
								title: "Auto-fill map pin from location name",
								style: {
									whiteSpace: "nowrap",
									flexShrink: 0
								},
								children: geocoding ? "Locating…" : "Locate Pin"
							})]
						}),
						geoMsg && /* @__PURE__ */ jsx("p", {
							style: {
								fontSize: 12,
								marginTop: 4,
								color: geoMsg.startsWith("✓") ? "#22c55e" : "#f87171",
								margin: "4px 0 0"
							},
							children: geoMsg
						}),
						draft.coords[0] !== 0 && /* @__PURE__ */ jsxs("p", {
							className: "ad-pkg-hint",
							children: [
								"Pin: ",
								draft.coords[1].toFixed(4),
								"°N, ",
								draft.coords[0].toFixed(4),
								"°E"
							]
						})
					] }),
					/* @__PURE__ */ jsxs("div", {
						className: "ad-form-full",
						children: [/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Testimonial"
						}), /* @__PURE__ */ jsx("textarea", {
							className: "ad-textarea",
							rows: 4,
							value: draft.testimonial,
							onChange: (e) => setDraft((d) => ({
								...d,
								testimonial: e.target.value
							})),
							placeholder: "What the client said about their experience…"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "ad-form-full",
						children: [
							/* @__PURE__ */ jsx("label", {
								className: "ad-label",
								children: "Video URL (optional)"
							}),
							/* @__PURE__ */ jsx("input", {
								className: "ad-input",
								value: draft.videoUrl,
								onChange: (e) => setDraft((d) => ({
									...d,
									videoUrl: e.target.value
								})),
								placeholder: "https://youtube.com/watch?v=... or direct video URL"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "ad-pkg-hint",
								children: "YouTube links are auto-converted to embeds. Leave blank to hide the Watch button."
							})
						]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "ad-form-actions",
				children: [/* @__PURE__ */ jsx("button", {
					onClick: closeModal,
					className: "ad-btn ad-btn--ghost",
					children: "Cancel"
				}), /* @__PURE__ */ jsx("button", {
					onClick: handleModalSave,
					className: "ad-btn",
					children: modalMode === "add" ? "Add Entry" : "Save Changes"
				})]
			})]
		}),
		/* @__PURE__ */ jsxs(AdminModal, {
			open: modalMode === "view",
			onClose: closeModal,
			title: draft.name || "Entry Details",
			subtitle: draft.location || void 0,
			maxWidth: 520,
			children: [/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: 16
				},
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 4
						},
						children: "Testimonial"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text)",
							lineHeight: 1.6
						},
						children: draft.testimonial || /* @__PURE__ */ jsx("em", {
							style: { color: "var(--ad-text3)" },
							children: "No testimonial"
						})
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 4
						},
						children: "Map Pin"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: 14,
							color: "var(--ad-text2)"
						},
						children: [
							draft.coords[1].toFixed(4),
							"°N, ",
							draft.coords[0].toFixed(4),
							"°E"
						]
					})] }),
					draft.videoUrl && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 11,
							fontWeight: 700,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.07em",
							marginBottom: 4
						},
						children: "Video URL"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 13,
							color: "var(--ad-text2)",
							wordBreak: "break-all"
						},
						children: draft.videoUrl
					})] })
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "ad-form-actions",
				style: { marginTop: 20 },
				children: [/* @__PURE__ */ jsx("button", {
					onClick: closeModal,
					className: "ad-btn ad-btn--ghost",
					children: "Close"
				}), /* @__PURE__ */ jsx("button", {
					onClick: () => {
						setGeoMsg("");
						setModalMode("edit");
					},
					className: "ad-btn",
					children: "Edit"
				})]
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "ad-card",
			children: [/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: 16
				},
				children: [/* @__PURE__ */ jsx("p", {
					style: {
						fontSize: 13,
						color: "var(--ad-text2)",
						margin: 0
					},
					children: "Each entry appears as a testimonial card and a location pin on the Philippines map."
				}), /* @__PURE__ */ jsx("button", {
					onClick: openAdd,
					className: "ad-btn ad-btn--sm",
					children: "+ Add Entry"
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "ad-table-wrap",
				children: /* @__PURE__ */ jsxs("table", {
					className: "ad-table",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("th", {
							style: { width: 36 },
							children: "#"
						}),
						/* @__PURE__ */ jsx("th", { children: "Name" }),
						/* @__PURE__ */ jsx("th", { children: "Location" }),
						/* @__PURE__ */ jsx("th", { children: "Testimonial" }),
						/* @__PURE__ */ jsx("th", {
							style: {
								width: 60,
								textAlign: "center"
							},
							children: "Video"
						}),
						/* @__PURE__ */ jsx("th", {
							style: { width: 160 },
							children: "Actions"
						})
					] }) }), /* @__PURE__ */ jsxs("tbody", { children: [form.entries.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 6,
						style: {
							textAlign: "center",
							color: "var(--ad-text3)",
							padding: "24px 0"
						},
						children: "No entries yet. Click \"+ Add Entry\" to add one."
					}) }), form.entries.map((entry, i) => /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("td", {
							style: {
								color: "var(--ad-text3)",
								textAlign: "center"
							},
							children: i + 1
						}),
						/* @__PURE__ */ jsx("td", {
							style: { fontWeight: 500 },
							children: entry.name || /* @__PURE__ */ jsx("em", {
								style: { color: "var(--ad-text3)" },
								children: "Unnamed"
							})
						}),
						/* @__PURE__ */ jsx("td", {
							style: { color: "var(--ad-text2)" },
							children: entry.location || "—"
						}),
						/* @__PURE__ */ jsx("td", {
							style: {
								color: "var(--ad-text2)",
								maxWidth: 240
							},
							children: /* @__PURE__ */ jsx("span", {
								style: {
									display: "block",
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap"
								},
								children: entry.testimonial ? entry.testimonial.length > 80 ? entry.testimonial.slice(0, 80) + "…" : entry.testimonial : "—"
							})
						}),
						/* @__PURE__ */ jsx("td", {
							style: { textAlign: "center" },
							children: entry.videoUrl ? /* @__PURE__ */ jsx("span", {
								style: {
									color: "#22c55e",
									fontSize: 13
								},
								children: "✓"
							}) : /* @__PURE__ */ jsx("span", {
								style: { color: "var(--ad-text3)" },
								children: "—"
							})
						}),
						/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", {
							className: "ad-table-actions",
							children: [
								/* @__PURE__ */ jsx("button", {
									onClick: () => openView(entry),
									className: "ad-btn ad-btn--ghost ad-btn--sm",
									children: "View"
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => openEdit(entry),
									className: "ad-btn ad-btn--ghost ad-btn--sm",
									children: "Edit"
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => setDeleteTarget(entry),
									className: "ad-btn ad-btn--danger ad-btn--sm",
									children: "Delete"
								})
							]
						}) })
					] }, entry.id))] })]
				})
			})]
		})
	] });
}
var DEFAULT_EXCELLENCE_FORM = { items: [
	{
		number: "01",
		title: "Zero-Bill Future",
		description: "Eliminate your dependency on fluctuating grid prices. Our net-metering optimized systems turn your roof into a revenue-generating asset that pays you back."
	},
	{
		number: "02",
		title: "Global Tier-1 Standards",
		description: "We exclusively deploy Tier-1 components like SMA inverters and mounting structures tested for typhoons up to 280kph. Built to last 25+ years."
	},
	{
		number: "03",
		title: "Full Compliance",
		description: "Navigating local bureaucracy is our headache, not yours. We handle all permits, ERC compliance, and utility interconnection paperwork end-to-end."
	},
	{
		number: "04",
		title: "Smart Monitoring",
		description: "Real-time data visualization of your energy harvest and consumption. Control your home's power flow from anywhere in the world."
	}
] };
function ExcellenceEditor({ apiKey }) {
	const { loading, saving, msg, form, setForm, save, resetPending, startReset, cancelReset, confirmReset } = useSectionEditor(apiKey, "excellence", DEFAULT_EXCELLENCE_FORM);
	const updateItem = (idx, key, val) => setForm((f) => ({
		...f,
		items: f.items.map((item, i) => i === idx ? {
			...item,
			[key]: val
		} : item)
	}));
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: {
			color: "var(--ad-text2)",
			padding: 24
		},
		children: "Loading…"
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(SectionEditorHeader, {
			title: "Engineered Excellence",
			onReset: startReset,
			resetPending,
			onConfirmReset: confirmReset,
			onCancelReset: cancelReset
		}),
		/* @__PURE__ */ jsx(Toast, { msg }),
		/* @__PURE__ */ jsxs("div", {
			className: "ad-card",
			children: [form.items.map((item, i) => /* @__PURE__ */ jsxs("div", {
				style: { marginBottom: i < form.items.length - 1 ? 28 : 0 },
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						fontWeight: 600,
						fontSize: 12,
						color: "var(--ad-text3)",
						textTransform: "uppercase",
						letterSpacing: "0.06em",
						marginBottom: 8
					},
					children: ["Card ", item.number]
				}), /* @__PURE__ */ jsxs("div", {
					className: "ad-form-grid",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "ad-form-full",
						children: [/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Title"
						}), /* @__PURE__ */ jsx("input", {
							className: "ad-input",
							value: item.title,
							onChange: (e) => updateItem(i, "title", e.target.value)
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "ad-form-full",
						children: [/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Description"
						}), /* @__PURE__ */ jsx("textarea", {
							className: "ad-textarea",
							rows: 3,
							value: item.description,
							onChange: (e) => updateItem(i, "description", e.target.value)
						})]
					})]
				})]
			}, i)), /* @__PURE__ */ jsx("div", {
				className: "ad-form-actions",
				children: /* @__PURE__ */ jsx("button", {
					onClick: () => void save(form),
					disabled: saving,
					className: "ad-btn",
					children: saving ? "Saving…" : "Save Changes"
				})
			})]
		})
	] });
}
var DEFAULT_PROCESS_FORM = {
	stepsDelay: 800,
	steps: [
		{
			number: "01",
			title: "Consumption Audit",
			description: "We don't guess; we calculate. Our engineers analyze your historical electricity bill data to build a custom ROI map tailored to your specific energy habits. You'll know exactly how much you'll save before we even touch your roof."
		},
		{
			number: "02",
			title: "Resilient Engineering",
			description: "A Licensed Professional Electrical Engineer (PEE) conducts a 100-point structural and shading audit. We design your system to withstand 250 kph winds and maintain peak yield in 40°C+ tropical heat using Global Tier-1 components."
		},
		{
			number: "03",
			title: "Turnkey Activation",
			description: "From Barangay clearances to energy providers Net-Metering permits, we handle the bureaucracy. Our certified in-house teams manage the full installation and grid interconnection, leaving you with nothing to do but flip the switch."
		}
	]
};
function ProcessEditor({ apiKey }) {
	const { loading, saving, msg, form, setForm, save, resetPending, startReset, cancelReset, confirmReset } = useSectionEditor(apiKey, "process", DEFAULT_PROCESS_FORM);
	const updateStep = (idx, key, val) => setForm((f) => ({
		...f,
		steps: f.steps.map((s, i) => i === idx ? {
			...s,
			[key]: val
		} : s)
	}));
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: {
			color: "var(--ad-text2)",
			padding: 24
		},
		children: "Loading…"
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(SectionEditorHeader, {
			title: "Process Steps",
			onReset: startReset,
			resetPending,
			onConfirmReset: confirmReset,
			onCancelReset: cancelReset
		}),
		/* @__PURE__ */ jsx(Toast, { msg }),
		/* @__PURE__ */ jsxs("div", {
			className: "ad-card",
			children: [
				/* @__PURE__ */ jsxs("div", {
					style: { marginBottom: 24 },
					children: [
						/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Animation Delay Between Steps (ms)"
						}),
						/* @__PURE__ */ jsx("input", {
							type: "number",
							className: "ad-input",
							style: { maxWidth: 180 },
							value: form.stepsDelay,
							min: 0,
							step: 100,
							onChange: (e) => setForm((f) => ({
								...f,
								stepsDelay: Number(e.target.value)
							}))
						}),
						/* @__PURE__ */ jsx("p", {
							className: "ad-pkg-hint",
							children: "Time in milliseconds before each step animates in (default: 800)."
						})
					]
				}),
				form.steps.map((step, i) => /* @__PURE__ */ jsxs("div", {
					style: { marginBottom: i < form.steps.length - 1 ? 28 : 0 },
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							fontWeight: 600,
							fontSize: 12,
							color: "var(--ad-text3)",
							textTransform: "uppercase",
							letterSpacing: "0.06em",
							marginBottom: 8
						},
						children: ["Step ", step.number]
					}), /* @__PURE__ */ jsxs("div", {
						className: "ad-form-grid",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "ad-form-full",
							children: [/* @__PURE__ */ jsx("label", {
								className: "ad-label",
								children: "Title"
							}), /* @__PURE__ */ jsx("input", {
								className: "ad-input",
								value: step.title,
								onChange: (e) => updateStep(i, "title", e.target.value)
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "ad-form-full",
							children: [/* @__PURE__ */ jsx("label", {
								className: "ad-label",
								children: "Description"
							}), /* @__PURE__ */ jsx("textarea", {
								className: "ad-textarea",
								rows: 4,
								value: step.description,
								onChange: (e) => updateStep(i, "description", e.target.value)
							})]
						})]
					})]
				}, i)),
				/* @__PURE__ */ jsx("div", {
					className: "ad-form-actions",
					children: /* @__PURE__ */ jsx("button", {
						onClick: () => void save(form),
						disabled: saving,
						className: "ad-btn",
						children: saving ? "Saving…" : "Save Changes"
					})
				})
			]
		})
	] });
}
var DEFAULT_CTA_FORM = {
	title: "Ready to engineer your energy independence?",
	description: "Take control of your energy bills. Get a free quote or talk to an expert",
	primaryCta: "Get a free Quote",
	secondaryCta: "Talk to an Expert"
};
function CtaEditor({ apiKey }) {
	const { loading, saving, msg, form, setForm, save, resetPending, startReset, cancelReset, confirmReset } = useSectionEditor(apiKey, "cta", DEFAULT_CTA_FORM);
	const ch = (k) => (e) => setForm((f) => ({
		...f,
		[k]: e.target.value
	}));
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: {
			color: "var(--ad-text2)",
			padding: 24
		},
		children: "Loading…"
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(SectionEditorHeader, {
			title: "Call to Action",
			onReset: startReset,
			resetPending,
			onConfirmReset: confirmReset,
			onCancelReset: cancelReset
		}),
		/* @__PURE__ */ jsx(Toast, { msg }),
		/* @__PURE__ */ jsxs("div", {
			className: "ad-card",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "ad-form-grid",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "ad-form-full",
						children: [/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Title"
						}), /* @__PURE__ */ jsx("input", {
							className: "ad-input",
							value: form.title,
							onChange: ch("title"),
							placeholder: "Ready to engineer your energy independence?"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "ad-form-full",
						children: [/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Description"
						}), /* @__PURE__ */ jsx("input", {
							className: "ad-input",
							value: form.description,
							onChange: ch("description"),
							placeholder: "Take control of your energy bills…"
						})]
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Primary Button"
					}), /* @__PURE__ */ jsx("input", {
						className: "ad-input",
						value: form.primaryCta,
						onChange: ch("primaryCta"),
						placeholder: "Get a free Quote"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Secondary Button"
					}), /* @__PURE__ */ jsx("input", {
						className: "ad-input",
						value: form.secondaryCta,
						onChange: ch("secondaryCta"),
						placeholder: "Talk to an Expert"
					})] })
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "ad-form-actions",
				children: /* @__PURE__ */ jsx("button", {
					onClick: () => void save(form),
					disabled: saving,
					className: "ad-btn",
					children: saving ? "Saving…" : "Save Changes"
				})
			})]
		})
	] });
}
function FooterEditor({ apiKey }) {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [msg, setMsg] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [socials, setSocials] = useState([]);
	const [credits, setCredits] = useState("");
	const [privacyName, setPrivacyName] = useState("");
	const [privacyUrl, setPrivacyUrl] = useState("");
	const [termsName, setTermsName] = useState("");
	const [termsUrl, setTermsUrl] = useState("");
	const populate = (d) => {
		setPhone(d.phone ?? "");
		setEmail(d.email ?? "");
		setSocials(Object.entries(d.socials ?? {}).map(([k, v]) => ({
			key: k,
			name: v.name,
			url: v.url
		})));
		setCredits(d.footer_text?.credits ?? "");
		setPrivacyName(d.footer_text?.privacy_policy?.name ?? "");
		setPrivacyUrl(d.footer_text?.privacy_policy?.url ?? "");
		setTermsName(d.footer_text?.terms_conditions?.name ?? "");
		setTermsUrl(d.footer_text?.terms_conditions?.url ?? "");
	};
	const load = async () => {
		setLoading(true);
		try {
			const item = (await adminGetAllContent(apiKey)).data.find((i) => i.key === "footer");
			if (item) populate(item.data);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		load();
	}, []);
	const buildPayload = () => ({
		phone,
		email,
		socials: Object.fromEntries(socials.filter((s) => s.key.trim()).map((s) => [s.key.trim(), {
			name: s.name,
			url: s.url
		}])),
		footer_text: {
			credits,
			privacy_policy: {
				name: privacyName,
				url: privacyUrl
			},
			terms_conditions: {
				name: termsName,
				url: termsUrl
			}
		}
	});
	const handleSave = async () => {
		setSaving(true);
		setMsg("");
		try {
			await adminUpsertContent(apiKey, "footer", buildPayload());
			setMsg("✓ Footer saved successfully");
		} catch (e) {
			setMsg(`Error: ${e.message}`);
		} finally {
			setSaving(false);
		}
	};
	const [resetPending, setResetPending] = useState(false);
	const handleReset = async () => {
		setResetPending(false);
		try {
			await adminResetContent(apiKey, "footer");
			setMsg("✓ Footer reset to default");
			await load();
		} catch (e) {
			setMsg(`Error: ${e.message}`);
		}
	};
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: {
			color: "var(--ad-text2)",
			padding: 24
		},
		children: "Loading footer…"
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "ad-footer-wrap",
		children: [
			/* @__PURE__ */ jsx(ConfirmDeleteModal, {
				open: resetPending,
				title: "Reset \"Footer\" to default?",
				description: "All current footer content will be replaced with the default values. This cannot be undone.",
				onConfirm: () => void handleReset(),
				onCancel: () => setResetPending(false)
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "ad-section-header",
				style: { marginBottom: 16 },
				children: [/* @__PURE__ */ jsx("div", {
					className: "ad-section-title",
					children: "Footer"
				}), /* @__PURE__ */ jsx("button", {
					onClick: () => setResetPending(true),
					className: "ad-btn ad-btn--danger ad-btn--sm",
					children: "Reset to Default"
				})]
			}),
			/* @__PURE__ */ jsx(Toast, { msg }),
			/* @__PURE__ */ jsxs("div", {
				className: "ad-card",
				style: { marginBottom: 16 },
				children: [/* @__PURE__ */ jsx("div", {
					className: "ad-card-title",
					children: "Contact Info"
				}), /* @__PURE__ */ jsxs("div", {
					className: "ad-form-grid",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Phone"
					}), /* @__PURE__ */ jsx("input", {
						className: "ad-input",
						value: phone,
						onChange: (e) => setPhone(e.target.value),
						placeholder: "+63 961 618 3436"
					})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Email"
					}), /* @__PURE__ */ jsx("input", {
						className: "ad-input",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "sales@azari.solar"
					})] })]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "ad-card",
				style: { marginBottom: 16 },
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "ad-section-header",
						style: { marginBottom: 12 },
						children: [/* @__PURE__ */ jsx("div", {
							className: "ad-card-title",
							style: { margin: 0 },
							children: "Social Links"
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setSocials((prev) => [...prev, {
								key: "",
								name: "",
								url: ""
							}]),
							className: "ad-btn ad-btn--sm ad-btn--secondary",
							children: "+ Add Link"
						})]
					}),
					socials.length === 0 && /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: 13,
							color: "var(--ad-text3)"
						},
						children: "No social links. Click \"+ Add Link\" to add one."
					}),
					socials.map((s, i) => /* @__PURE__ */ jsxs("div", {
						className: "ad-socials-row",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [i === 0 && /* @__PURE__ */ jsx("div", {
								className: "ad-label",
								children: "Key (ID)"
							}), /* @__PURE__ */ jsx("input", {
								className: "ad-input",
								value: s.key,
								onChange: (e) => setSocials((prev) => prev.map((x, j) => j === i ? {
									...x,
									key: e.target.value
								} : x)),
								placeholder: "facebook"
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [i === 0 && /* @__PURE__ */ jsx("div", {
								className: "ad-label",
								children: "Display Name"
							}), /* @__PURE__ */ jsx("input", {
								className: "ad-input",
								value: s.name,
								onChange: (e) => setSocials((prev) => prev.map((x, j) => j === i ? {
									...x,
									name: e.target.value
								} : x)),
								placeholder: "Facebook"
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "ad-socials-url",
								children: [i === 0 && /* @__PURE__ */ jsx("div", {
									className: "ad-label",
									children: "URL"
								}), /* @__PURE__ */ jsx("input", {
									className: "ad-input",
									value: s.url,
									onChange: (e) => setSocials((prev) => prev.map((x, j) => j === i ? {
										...x,
										url: e.target.value
									} : x)),
									placeholder: "https://..."
								})]
							}),
							/* @__PURE__ */ jsxs("div", { children: [i === 0 && /* @__PURE__ */ jsx("div", { style: { height: 23 } }), /* @__PURE__ */ jsx("button", {
								onClick: () => setSocials((prev) => prev.filter((_, j) => j !== i)),
								className: "ad-btn ad-btn--danger ad-btn--sm",
								children: "✕"
							})] })
						]
					}, i))
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "ad-card",
				style: { marginBottom: 16 },
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "ad-card-title",
						children: "Footer Text"
					}),
					/* @__PURE__ */ jsxs("div", {
						style: { marginBottom: 16 },
						children: [/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Credits"
						}), /* @__PURE__ */ jsx("input", {
							className: "ad-input",
							value: credits,
							onChange: (e) => setCredits(e.target.value),
							placeholder: "Designed by..."
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "ad-form-grid",
						style: { marginBottom: 16 },
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Privacy Policy Label"
						}), /* @__PURE__ */ jsx("input", {
							className: "ad-input",
							value: privacyName,
							onChange: (e) => setPrivacyName(e.target.value),
							placeholder: "Privacy Policy"
						})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Privacy Policy URL"
						}), /* @__PURE__ */ jsx("input", {
							className: "ad-input",
							value: privacyUrl,
							onChange: (e) => setPrivacyUrl(e.target.value),
							placeholder: "https://..."
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "ad-form-grid",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Terms & Conditions Label"
						}), /* @__PURE__ */ jsx("input", {
							className: "ad-input",
							value: termsName,
							onChange: (e) => setTermsName(e.target.value),
							placeholder: "Terms and Conditions"
						})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "ad-label",
							children: "Terms & Conditions URL"
						}), /* @__PURE__ */ jsx("input", {
							className: "ad-input",
							value: termsUrl,
							onChange: (e) => setTermsUrl(e.target.value),
							placeholder: "https://..."
						})] })]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "ad-form-actions",
				children: /* @__PURE__ */ jsx("button", {
					onClick: () => void handleSave(),
					disabled: saving,
					className: "ad-btn",
					children: saving ? "Saving…" : "Save Changes"
				})
			})
		]
	});
}
var BLOCK_TYPE_LABELS = {
	heading: "Heading",
	paragraph: "Paragraph",
	bullet_list: "Bullet List",
	link_group: "Link Group",
	button: "Button",
	image: "Image",
	partner_grid: "Partner Grid",
	contact_channels: "Contact Channels",
	divider: "Divider"
};
var BLOCK_TYPE_DESCRIPTIONS = {
	heading: "h1–h4 section title",
	paragraph: "Rich text / HTML content",
	bullet_list: "Nested bullet points",
	link_group: "Multiple text or button links",
	button: "Single call-to-action button",
	image: "Photo with optional caption",
	partner_grid: "Logo grid with download links",
	contact_channels: "WhatsApp, email, phone…",
	divider: "Horizontal separator rule"
};
var BLOCK_TYPES = Object.keys(BLOCK_TYPE_LABELS);
var EMPTY_STEP = {
	order: 0,
	title: "",
	iconKey: "",
	accentColor: "",
	subheading: "",
	iconUrl: null,
	iconUrlHighlighted: null,
	iconUrlLight: null,
	iconUrlLightHighlighted: null,
	status: "draft",
	blocks: []
};
function makeEmptyBlock(type, order) {
	switch (type) {
		case "heading": return {
			type,
			order,
			text: "",
			level: 2
		};
		case "paragraph": return {
			type,
			order,
			html: ""
		};
		case "bullet_list": return {
			type,
			order,
			items: [{ text: "" }]
		};
		case "link_group": return {
			type,
			order,
			links: [{
				label: "",
				url: "",
				external: false,
				style: "text"
			}]
		};
		case "button": return {
			type,
			order,
			label: "",
			url: "",
			external: false
		};
		case "image": return {
			type,
			order,
			src: "",
			alt: "",
			caption: ""
		};
		case "partner_grid": return {
			type,
			order,
			items: [{
				name: "",
				logoUrl: "",
				downloadUrl: "",
				external: false
			}]
		};
		case "contact_channels": return {
			type,
			order,
			channels: [{
				kind: "email",
				value: "",
				url: ""
			}]
		};
		case "divider": return {
			type,
			order
		};
	}
}
function HeadingBlockForm({ block, onPatch }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "ad-field-row",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "ad-field",
			style: { flex: 2 },
			children: [/* @__PURE__ */ jsx("label", {
				className: "ad-label",
				children: "Text"
			}), /* @__PURE__ */ jsx("input", {
				className: "ad-input",
				value: block.text,
				onChange: (e) => onPatch({ text: e.target.value }),
				placeholder: "Heading text"
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "ad-field",
			style: { flex: .5 },
			children: [/* @__PURE__ */ jsx("label", {
				className: "ad-label",
				children: "Level"
			}), /* @__PURE__ */ jsx("select", {
				className: "ad-input",
				value: block.level,
				onChange: (e) => onPatch({ level: Number(e.target.value) }),
				children: [
					1,
					2,
					3,
					4
				].map((l) => /* @__PURE__ */ jsxs("option", {
					value: l,
					children: ["H", l]
				}, l))
			})]
		})]
	});
}
function ParagraphBlockForm({ block, onPatch }) {
	const ref = useRef(null);
	const wrapSelection = (open, close) => {
		const el = ref.current;
		if (!el) return;
		const { selectionStart: s, selectionEnd: e, value } = el;
		onPatch({ html: value.slice(0, s) + open + value.slice(s, e) + close + value.slice(e) });
		setTimeout(() => {
			el.setSelectionRange(s + open.length, e + open.length);
			el.focus();
		}, 0);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "ad-field",
		children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					gap: 6,
					marginBottom: 6
				},
				children: [
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "ad-btn ad-btn--ghost ad-btn--sm",
						onClick: () => wrapSelection("<strong>", "</strong>"),
						title: "Bold",
						children: "B"
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "ad-btn ad-btn--ghost ad-btn--sm",
						onClick: () => wrapSelection("<em>", "</em>"),
						title: "Italic",
						style: { fontStyle: "italic" },
						children: "I"
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "ad-btn ad-btn--ghost ad-btn--sm",
						onClick: () => wrapSelection("<a href=\"\" target=\"_blank\" rel=\"noopener noreferrer\">", "</a>"),
						title: "Link",
						children: "🔗"
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "ad-btn ad-btn--ghost ad-btn--sm",
						onClick: () => wrapSelection("<span class=\"highlight\">", "</span>"),
						title: "Highlight",
						children: "✦"
					})
				]
			}),
			/* @__PURE__ */ jsx("textarea", {
				ref,
				className: "ad-input",
				style: {
					minHeight: 90,
					fontFamily: "monospace",
					fontSize: 12
				},
				value: block.html,
				onChange: (e) => onPatch({ html: e.target.value }),
				placeholder: "<strong>Bold</strong>, <a href='...' target='_blank' rel='noopener noreferrer'>Link</a>, plain text…"
			}),
			/* @__PURE__ */ jsx("p", {
				style: {
					margin: "4px 0 0",
					fontSize: 11,
					color: "var(--ad-text3)"
				},
				children: "HTML is sanitized server-side. Only b/strong/em/i/u/a/span/br allowed."
			})
		]
	});
}
function BulletItemRow({ item, onChange, onRemove, depth = 0 }) {
	return /* @__PURE__ */ jsxs("div", {
		style: { paddingLeft: depth * 20 },
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "ad-field-row",
				style: {
					alignItems: "flex-start",
					gap: 6,
					marginBottom: 4
				},
				children: [
					/* @__PURE__ */ jsx("input", {
						className: "ad-input",
						style: { flex: 2 },
						value: item.text,
						onChange: (e) => onChange({
							...item,
							text: e.target.value
						}),
						placeholder: "Bullet text"
					}),
					/* @__PURE__ */ jsx("input", {
						className: "ad-input",
						style: { flex: 1 },
						value: item.boldLead ?? "",
						onChange: (e) => onChange({
							...item,
							boldLead: e.target.value
						}),
						placeholder: "Bold lead (optional)"
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "ad-btn ad-btn--ghost ad-btn--sm",
						onClick: onRemove,
						title: "Remove",
						children: "✕"
					})
				]
			}),
			(item.children ?? []).map((child, ci) => /* @__PURE__ */ jsx(BulletItemRow, {
				item: child,
				depth: depth + 1,
				onChange: (v) => {
					const nc = [...item.children ?? []];
					nc[ci] = v;
					onChange({
						...item,
						children: nc
					});
				},
				onRemove: () => {
					const nc = (item.children ?? []).filter((_, i) => i !== ci);
					onChange({
						...item,
						children: nc
					});
				}
			}, ci)),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "ad-btn ad-btn--ghost ad-btn--sm",
				style: {
					marginLeft: 4,
					marginBottom: 6
				},
				onClick: () => onChange({
					...item,
					children: [...item.children ?? [], { text: "" }]
				}),
				children: "+ Sub-bullet"
			})
		]
	});
}
function BulletListBlockForm({ block, onPatch }) {
	const setItems = (items) => onPatch({ items });
	return /* @__PURE__ */ jsxs("div", {
		className: "ad-field",
		children: [block.items.map((item, i) => /* @__PURE__ */ jsx(BulletItemRow, {
			item,
			onChange: (v) => {
				const ni = [...block.items];
				ni[i] = v;
				setItems(ni);
			},
			onRemove: () => setItems(block.items.filter((_, j) => j !== i))
		}, i)), /* @__PURE__ */ jsx("button", {
			type: "button",
			className: "ad-btn ad-btn--ghost ad-btn--sm",
			onClick: () => setItems([...block.items, { text: "" }]),
			children: "+ Add Bullet"
		})]
	});
}
function LinkGroupBlockForm({ block, onPatch }) {
	const setLinks = (links) => onPatch({ links });
	return /* @__PURE__ */ jsxs("div", {
		className: "ad-field",
		children: [block.links.map((link, i) => /* @__PURE__ */ jsxs("div", {
			className: "ad-field-row",
			style: { marginBottom: 6 },
			children: [
				/* @__PURE__ */ jsx("input", {
					className: "ad-input",
					style: { flex: 2 },
					value: link.label,
					onChange: (e) => {
						const nl = [...block.links];
						nl[i] = {
							...nl[i],
							label: e.target.value
						};
						setLinks(nl);
					},
					placeholder: "Label"
				}),
				/* @__PURE__ */ jsx("input", {
					className: "ad-input",
					style: { flex: 3 },
					value: link.url,
					onChange: (e) => {
						const nl = [...block.links];
						nl[i] = {
							...nl[i],
							url: e.target.value
						};
						setLinks(nl);
					},
					placeholder: "URL"
				}),
				/* @__PURE__ */ jsxs("select", {
					className: "ad-input",
					style: { flex: 1 },
					value: link.style,
					onChange: (e) => {
						const nl = [...block.links];
						nl[i] = {
							...nl[i],
							style: e.target.value
						};
						setLinks(nl);
					},
					children: [/* @__PURE__ */ jsx("option", {
						value: "text",
						children: "Text"
					}), /* @__PURE__ */ jsx("option", {
						value: "button",
						children: "Button"
					})]
				}),
				/* @__PURE__ */ jsxs("label", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: 4,
						fontSize: 12,
						color: "var(--ad-text2)",
						whiteSpace: "nowrap"
					},
					children: [/* @__PURE__ */ jsx("input", {
						type: "checkbox",
						checked: link.external,
						onChange: (e) => {
							const nl = [...block.links];
							nl[i] = {
								...nl[i],
								external: e.target.checked
							};
							setLinks(nl);
						}
					}), "External"]
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "ad-btn ad-btn--ghost ad-btn--sm",
					onClick: () => setLinks(block.links.filter((_, j) => j !== i)),
					children: "✕"
				})
			]
		}, i)), /* @__PURE__ */ jsx("button", {
			type: "button",
			className: "ad-btn ad-btn--ghost ad-btn--sm",
			onClick: () => setLinks([...block.links, {
				label: "",
				url: "",
				external: false,
				style: "text"
			}]),
			children: "+ Add Link"
		})]
	});
}
function ButtonBlockForm({ block, onPatch }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "ad-field-row",
		children: [
			/* @__PURE__ */ jsx("input", {
				className: "ad-input",
				style: { flex: 2 },
				value: block.label,
				onChange: (e) => onPatch({ label: e.target.value }),
				placeholder: "Button label"
			}),
			/* @__PURE__ */ jsx("input", {
				className: "ad-input",
				style: { flex: 3 },
				value: block.url,
				onChange: (e) => onPatch({ url: e.target.value }),
				placeholder: "URL (e.g. /solar-calculator)"
			}),
			/* @__PURE__ */ jsxs("label", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: 4,
					fontSize: 12,
					color: "var(--ad-text2)",
					whiteSpace: "nowrap"
				},
				children: [/* @__PURE__ */ jsx("input", {
					type: "checkbox",
					checked: block.external,
					onChange: (e) => onPatch({ external: e.target.checked })
				}), "External"]
			})
		]
	});
}
function ImageBlockForm({ block, onPatch }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "ad-field",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "ad-field-row",
			style: { marginBottom: 8 },
			children: [/* @__PURE__ */ jsxs("div", {
				className: "ad-field",
				style: { flex: 3 },
				children: [/* @__PURE__ */ jsx("label", {
					className: "ad-label",
					children: "Image URL or Base64"
				}), /* @__PURE__ */ jsx("input", {
					className: "ad-input",
					value: block.src,
					onChange: (e) => onPatch({ src: e.target.value }),
					placeholder: "https://... or data:image/..."
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "ad-field",
				style: { flex: 2 },
				children: [/* @__PURE__ */ jsx("label", {
					className: "ad-label",
					children: "Alt text"
				}), /* @__PURE__ */ jsx("input", {
					className: "ad-input",
					value: block.alt,
					onChange: (e) => onPatch({ alt: e.target.value }),
					placeholder: "Describe the image"
				})]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "ad-field",
			children: [/* @__PURE__ */ jsx("label", {
				className: "ad-label",
				children: "Caption (optional)"
			}), /* @__PURE__ */ jsx("input", {
				className: "ad-input",
				value: block.caption ?? "",
				onChange: (e) => onPatch({ caption: e.target.value }),
				placeholder: "Caption shown below image"
			})]
		})]
	});
}
function PartnerGridBlockForm({ block, onPatch }) {
	const setItems = (items) => onPatch({ items });
	return /* @__PURE__ */ jsxs("div", {
		className: "ad-field",
		children: [block.items.map((item, i) => /* @__PURE__ */ jsxs("div", {
			className: "ad-field-row",
			style: {
				marginBottom: 6,
				alignItems: "flex-start"
			},
			children: [
				/* @__PURE__ */ jsx("input", {
					className: "ad-input",
					style: { flex: 2 },
					value: item.name,
					onChange: (e) => {
						const ni = [...block.items];
						ni[i] = {
							...ni[i],
							name: e.target.value
						};
						setItems(ni);
					},
					placeholder: "Partner name"
				}),
				/* @__PURE__ */ jsx("input", {
					className: "ad-input",
					style: { flex: 2 },
					value: item.logoUrl ?? "",
					onChange: (e) => {
						const ni = [...block.items];
						ni[i] = {
							...ni[i],
							logoUrl: e.target.value
						};
						setItems(ni);
					},
					placeholder: "Logo URL"
				}),
				/* @__PURE__ */ jsx("input", {
					className: "ad-input",
					style: { flex: 2 },
					value: item.downloadUrl ?? "",
					onChange: (e) => {
						const ni = [...block.items];
						ni[i] = {
							...ni[i],
							downloadUrl: e.target.value
						};
						setItems(ni);
					},
					placeholder: "Download URL (PDF)"
				}),
				/* @__PURE__ */ jsxs("label", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: 4,
						fontSize: 12,
						color: "var(--ad-text2)",
						whiteSpace: "nowrap"
					},
					children: [/* @__PURE__ */ jsx("input", {
						type: "checkbox",
						checked: item.external,
						onChange: (e) => {
							const ni = [...block.items];
							ni[i] = {
								...ni[i],
								external: e.target.checked
							};
							setItems(ni);
						}
					}), "External"]
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "ad-btn ad-btn--ghost ad-btn--sm",
					onClick: () => setItems(block.items.filter((_, j) => j !== i)),
					children: "✕"
				})
			]
		}, i)), /* @__PURE__ */ jsx("button", {
			type: "button",
			className: "ad-btn ad-btn--ghost ad-btn--sm",
			onClick: () => setItems([...block.items, {
				name: "",
				logoUrl: "",
				downloadUrl: "",
				external: false
			}]),
			children: "+ Add Partner"
		})]
	});
}
var CHANNEL_KINDS = [
	"whatsapp",
	"viber",
	"facebook",
	"instagram",
	"email",
	"phone"
];
function ContactBlockForm({ block, onPatch }) {
	const setChannels = (channels) => onPatch({ channels });
	return /* @__PURE__ */ jsxs("div", {
		className: "ad-field",
		children: [block.channels.map((ch, i) => /* @__PURE__ */ jsxs("div", {
			className: "ad-field-row",
			style: { marginBottom: 6 },
			children: [
				/* @__PURE__ */ jsx("select", {
					className: "ad-input",
					style: { flex: 1 },
					value: ch.kind,
					onChange: (e) => {
						const nc = [...block.channels];
						nc[i] = {
							...nc[i],
							kind: e.target.value
						};
						setChannels(nc);
					},
					children: CHANNEL_KINDS.map((k) => /* @__PURE__ */ jsx("option", {
						value: k,
						children: k
					}, k))
				}),
				/* @__PURE__ */ jsx("input", {
					className: "ad-input",
					style: { flex: 2 },
					value: ch.value,
					onChange: (e) => {
						const nc = [...block.channels];
						nc[i] = {
							...nc[i],
							value: e.target.value
						};
						setChannels(nc);
					},
					placeholder: "Display value"
				}),
				/* @__PURE__ */ jsx("input", {
					className: "ad-input",
					style: { flex: 2 },
					value: ch.url,
					onChange: (e) => {
						const nc = [...block.channels];
						nc[i] = {
							...nc[i],
							url: e.target.value
						};
						setChannels(nc);
					},
					placeholder: "URL (https://wa.me/..., mailto:...)"
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "ad-btn ad-btn--ghost ad-btn--sm",
					onClick: () => setChannels(block.channels.filter((_, j) => j !== i)),
					children: "✕"
				})
			]
		}, i)), /* @__PURE__ */ jsx("button", {
			type: "button",
			className: "ad-btn ad-btn--ghost ad-btn--sm",
			onClick: () => setChannels([...block.channels, {
				kind: "email",
				value: "",
				url: ""
			}]),
			children: "+ Add Channel"
		})]
	});
}
function BlockForm({ block, index, onPatch, onRemove, onMoveUp, onMoveDown }) {
	const [expanded, setExpanded] = useState(true);
	return /* @__PURE__ */ jsxs("div", {
		className: "ad-card",
		style: {
			marginBottom: 10,
			padding: 0,
			overflow: "hidden"
		},
		children: [/* @__PURE__ */ jsxs("div", {
			style: {
				display: "flex",
				alignItems: "center",
				gap: 8,
				padding: "10px 14px",
				background: "var(--ad-surface2)",
				borderBottom: expanded ? "1px solid var(--ad-border)" : "none"
			},
			children: [
				/* @__PURE__ */ jsx("span", {
					style: {
						fontSize: 10,
						fontWeight: 700,
						letterSpacing: "0.06em",
						color: "var(--ad-text3)",
						background: "var(--ad-surface)",
						border: "1px solid var(--ad-border)",
						borderRadius: 4,
						padding: "2px 6px",
						flexShrink: 0
					},
					children: String(index + 1).padStart(2, "0")
				}),
				/* @__PURE__ */ jsx("strong", {
					style: {
						flex: 1,
						fontSize: 13
					},
					children: BLOCK_TYPE_LABELS[block.type]
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "ad-btn ad-btn--ghost ad-btn--sm",
					onClick: onMoveUp,
					title: "Move up",
					children: "↑"
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "ad-btn ad-btn--ghost ad-btn--sm",
					onClick: onMoveDown,
					title: "Move down",
					children: "↓"
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "ad-btn ad-btn--ghost ad-btn--sm",
					onClick: () => setExpanded((e) => !e),
					children: expanded ? "Collapse" : "Expand"
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "ad-btn ad-btn--ghost ad-btn--sm",
					style: { color: "#fc615a" },
					onClick: onRemove,
					children: "Remove"
				})
			]
		}), expanded && /* @__PURE__ */ jsx("div", {
			style: { padding: "14px 16px" },
			children: block.type === "heading" ? /* @__PURE__ */ jsx(HeadingBlockForm, {
				block,
				onPatch
			}) : block.type === "paragraph" ? /* @__PURE__ */ jsx(ParagraphBlockForm, {
				block,
				onPatch
			}) : block.type === "bullet_list" ? /* @__PURE__ */ jsx(BulletListBlockForm, {
				block,
				onPatch
			}) : block.type === "link_group" ? /* @__PURE__ */ jsx(LinkGroupBlockForm, {
				block,
				onPatch
			}) : block.type === "button" ? /* @__PURE__ */ jsx(ButtonBlockForm, {
				block,
				onPatch
			}) : block.type === "image" ? /* @__PURE__ */ jsx(ImageBlockForm, {
				block,
				onPatch
			}) : block.type === "partner_grid" ? /* @__PURE__ */ jsx(PartnerGridBlockForm, {
				block,
				onPatch
			}) : block.type === "contact_channels" ? /* @__PURE__ */ jsx(ContactBlockForm, {
				block,
				onPatch
			}) : block.type === "divider" ? /* @__PURE__ */ jsx("p", {
				style: {
					color: "var(--ad-text3)",
					fontSize: 12,
					margin: 0
				},
				children: "Horizontal divider — no settings."
			}) : null
		})]
	});
}
function JourneyPreviewModal({ steps, initialOpenId, onClose }) {
	const [openId, setOpenId] = useState(initialOpenId ?? null);
	const [previewTheme, setPreviewTheme] = useState("dark");
	const isPreviewLight = previewTheme === "light";
	const previewBg = isPreviewLight ? "#f4f4f6" : "#0a0a0a";
	const previewBorder = isPreviewLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)";
	const emptyColor = isPreviewLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.35)";
	return createPortal(/* @__PURE__ */ jsx("div", {
		className: "ad-modal-backdrop",
		onClick: onClose,
		style: {
			zIndex: 9e3,
			alignItems: "flex-start",
			overflowY: "auto",
			padding: "5vh 16px"
		},
		children: /* @__PURE__ */ jsxs("div", {
			onClick: (e) => e.stopPropagation(),
			style: {
				margin: "0 auto",
				maxWidth: 680,
				width: "100%",
				borderRadius: 12,
				overflow: "hidden",
				boxShadow: "0 24px 64px rgba(0,0,0,0.6)"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: "12px 16px",
					background: "var(--ad-surface)",
					border: "1px solid var(--ad-border)",
					borderBottom: "none",
					borderRadius: "12px 12px 0 0"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: 10
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: {
							fontSize: 13,
							fontWeight: 600,
							color: "var(--ad-text)"
						},
						children: "Client Journey Preview"
					}), /* @__PURE__ */ jsxs("span", {
						style: {
							fontSize: 11,
							color: "var(--ad-text3)",
							background: "var(--ad-surface2)",
							padding: "2px 8px",
							borderRadius: 4
						},
						children: [
							steps.length,
							" step",
							steps.length !== 1 ? "s" : ""
						]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						gap: 8,
						alignItems: "center"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								background: "var(--ad-surface2)",
								borderRadius: 6,
								border: "1px solid var(--ad-border)",
								overflow: "hidden"
							},
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => setPreviewTheme("dark"),
								style: {
									fontSize: 11,
									padding: "4px 10px",
									border: "none",
									cursor: "pointer",
									fontFamily: "Inter, sans-serif",
									fontWeight: 500,
									transition: "background 0.15s, color 0.15s",
									background: previewTheme === "dark" ? "#fc615a" : "transparent",
									color: previewTheme === "dark" ? "#fff" : "var(--ad-text3)"
								},
								children: "Dark"
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setPreviewTheme("light"),
								style: {
									fontSize: 11,
									padding: "4px 10px",
									border: "none",
									cursor: "pointer",
									fontFamily: "Inter, sans-serif",
									fontWeight: 500,
									transition: "background 0.15s, color 0.15s",
									background: previewTheme === "light" ? "#fc615a" : "transparent",
									color: previewTheme === "light" ? "#fff" : "var(--ad-text3)"
								},
								children: "Light"
							})]
						}),
						/* @__PURE__ */ jsx("a", {
							href: "/client-journey",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "ad-btn ad-btn--ghost ad-btn--sm",
							style: { fontSize: 12 },
							children: "Open Live ↗"
						}),
						/* @__PURE__ */ jsx("button", {
							className: "ad-btn ad-btn--ghost",
							onClick: onClose,
							"aria-label": "Close preview",
							style: {
								fontSize: 20,
								lineHeight: "20px",
								padding: "4px 10px"
							},
							children: "×"
						})
					]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: isPreviewLight ? "light-theme" : "dark-theme",
				style: {
					background: previewBg,
					border: `1px solid ${previewBorder}`,
					borderTop: "none",
					borderRadius: "0 0 12px 12px",
					padding: "20px 20px 28px",
					maxHeight: "78vh",
					overflowY: "auto"
				},
				children: steps.length === 0 ? /* @__PURE__ */ jsx("p", {
					style: {
						color: emptyColor,
						textAlign: "center",
						padding: "40px 0",
						fontFamily: "Inter, sans-serif",
						fontSize: 14,
						margin: 0
					},
					children: "No steps to preview."
				}) : /* @__PURE__ */ jsx("div", {
					style: {
						display: "flex",
						flexDirection: "column"
					},
					children: steps.map((step, i) => {
						const isActive = openId === step.id;
						const accent = step.accentColor ?? "#fc615a";
						const idx = String(i + 1).padStart(2, "0");
						return /* @__PURE__ */ jsxs("div", {
							className: "as-cjp-mobile-item is-shown",
							children: [
								/* @__PURE__ */ jsxs("button", {
									className: `as-cjp-step-row is-shown${isActive ? " is-active" : ""}`,
									style: isActive ? { "--step-accent": accent } : void 0,
									onClick: () => setOpenId((prev) => prev === step.id ? null : step.id),
									"aria-expanded": isActive,
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "as-cjp-icon-chip",
											children: /* @__PURE__ */ jsx(JourneyIcon, {
												iconKey: step.iconKey,
												iconUrl: step.iconUrl,
												iconUrlHighlighted: step.iconUrlHighlighted,
												iconUrlLight: step.iconUrlLight,
												iconUrlLightHighlighted: step.iconUrlLightHighlighted,
												isActive,
												isLight: isPreviewLight
											})
										}),
										/* @__PURE__ */ jsx("span", {
											className: "as-cjp-step-index",
											children: idx
										}),
										/* @__PURE__ */ jsx("span", {
											className: "as-cjp-step-title",
											children: step.title || "(untitled)"
										}),
										/* @__PURE__ */ jsx("span", {
											className: "as-cjp-toggle",
											"aria-hidden": "true",
											children: isActive ? "−" : "+"
										})
									]
								}),
								/* @__PURE__ */ jsx("div", {
									className: `as-cjp-mobile-panel${isActive ? " is-open" : ""}`,
									role: "region",
									children: /* @__PURE__ */ jsx("div", {
										className: "as-cjp-mobile-panel-inner",
										children: /* @__PURE__ */ jsx(StepContent, { step })
									})
								}),
								step.status === "draft" && /* @__PURE__ */ jsx("div", {
									style: {
										paddingLeft: 70,
										paddingBottom: 6
									},
									children: /* @__PURE__ */ jsx("span", {
										style: {
											fontSize: 10,
											fontFamily: "Inter, sans-serif",
											color: "rgba(255,200,0,0.65)",
											background: "rgba(255,200,0,0.07)",
											border: "1px solid rgba(255,200,0,0.18)",
											borderRadius: 3,
											padding: "1px 6px"
										},
										children: "draft — not visible to clients"
									})
								})
							]
						}, step.id);
					})
				})
			})]
		})
	}), document.body);
}
function StepEditor({ step, onSave, onCancel, saving }) {
	const [form, setForm] = useState({
		...step,
		blocks: [...step.blocks]
	});
	const [addingBlock, setAddingBlock] = useState(false);
	const [errors, setErrors] = useState({});
	const clearErr = (f) => setErrors((p) => {
		const c = { ...p };
		delete c[f];
		return c;
	});
	const [svgDraft, setSvgDraft] = useState("");
	const [svgDraftHighlighted, setSvgDraftHighlighted] = useState("");
	const [svgDraftLight, setSvgDraftLight] = useState("");
	const [svgDraftLightHighlighted, setSvgDraftLightHighlighted] = useState("");
	const [editorPreviewOpen, setEditorPreviewOpen] = useState(false);
	const patchField = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	const reorder = (blocks) => blocks.map((b, i) => ({
		...b,
		order: i
	}));
	const patchBlock = (i, patch) => setForm((f) => ({
		...f,
		blocks: reorder(f.blocks.map((b, j) => j === i ? {
			...b,
			...patch
		} : b))
	}));
	const removeBlock = (i) => setForm((f) => ({
		...f,
		blocks: reorder(f.blocks.filter((_, j) => j !== i))
	}));
	const moveBlock = (i, dir) => setForm((f) => {
		const arr = [...f.blocks];
		const target = i + dir;
		if (target < 0 || target >= arr.length) return f;
		[arr[i], arr[target]] = [arr[target], arr[i]];
		return {
			...f,
			blocks: reorder(arr)
		};
	});
	const addBlock = (type) => setForm((f) => ({
		...f,
		blocks: reorder([...f.blocks, makeEmptyBlock(type, f.blocks.length)])
	}));
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "ad-field-row",
			style: {
				marginBottom: 16,
				flexWrap: "wrap"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "ad-field",
				style: { flex: "1 1 220px" },
				children: [
					/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Title *"
					}),
					/* @__PURE__ */ jsx("input", {
						className: `ad-input${errors.title ? " ad-input--error" : ""}`,
						value: form.title,
						onChange: (e) => {
							patchField("title", e.target.value);
							clearErr("title");
						},
						placeholder: "e.g. Customer Service"
					}),
					errors.title && /* @__PURE__ */ jsx("span", {
						className: "ad-field-error",
						"data-field-error": true,
						children: errors.title
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "ad-field",
				style: { flex: "0 0 120px" },
				children: [/* @__PURE__ */ jsx("label", {
					className: "ad-label",
					children: "Status"
				}), /* @__PURE__ */ jsxs("select", {
					className: "ad-input",
					value: form.status,
					onChange: (e) => patchField("status", e.target.value),
					children: [/* @__PURE__ */ jsx("option", {
						value: "draft",
						children: "Draft"
					}), /* @__PURE__ */ jsx("option", {
						value: "published",
						children: "Published"
					})]
				})]
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "ad-field-row",
			style: {
				marginBottom: 16,
				flexWrap: "wrap"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "ad-field",
				style: { flex: "1 1 220px" },
				children: [/* @__PURE__ */ jsx("label", {
					className: "ad-label",
					children: "Subheading (shown above blocks when open)"
				}), /* @__PURE__ */ jsx("input", {
					className: "ad-input",
					value: form.subheading ?? "",
					onChange: (e) => patchField("subheading", e.target.value),
					placeholder: "e.g. Your Consultation Starts Here"
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "ad-field",
				style: { flex: "0 0 180px" },
				children: [/* @__PURE__ */ jsx("label", {
					className: "ad-label",
					children: "Accent color"
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						gap: 6,
						alignItems: "center"
					},
					children: [/* @__PURE__ */ jsx("input", {
						type: "color",
						value: form.accentColor ?? "#fc615a",
						onChange: (e) => patchField("accentColor", e.target.value),
						style: {
							width: 36,
							height: 36,
							padding: 2,
							border: "1px solid var(--ad-border)",
							borderRadius: 6,
							background: "none",
							cursor: "pointer",
							flexShrink: 0
						}
					}), /* @__PURE__ */ jsx("input", {
						className: "ad-input",
						value: form.accentColor ?? "",
						onChange: (e) => patchField("accentColor", e.target.value),
						placeholder: "#fc615a",
						style: {
							flex: 1,
							minWidth: 0
						}
					})]
				})]
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "ad-field-row",
			style: {
				marginBottom: 16,
				flexWrap: "wrap"
			},
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "ad-field",
					style: { flex: "1 1 240px" },
					children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Icon — Normal *"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: 8
						},
						children: [
							form.iconUrl && /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: 10
								},
								children: [/* @__PURE__ */ jsx("img", {
									src: form.iconUrl,
									alt: "",
									style: {
										width: 36,
										height: 36,
										objectFit: "contain",
										borderRadius: 6,
										border: "1px solid var(--ad-border)",
										background: "var(--ad-surface2)",
										padding: 4
									}
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "ad-btn ad-btn--ghost",
									style: {
										fontSize: 12,
										padding: "4px 10px"
									},
									onClick: () => {
										patchField("iconUrl", null);
										patchField("iconKey", null);
										clearErr("iconUrl");
									},
									children: "Remove"
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: `ad-btn ad-btn--ghost${errors.iconUrl ? " ad-btn--error" : ""}`,
								style: {
									fontSize: 12,
									padding: "5px 12px",
									cursor: "pointer",
									textAlign: "center"
								},
								children: ["Upload Image / SVG File", /* @__PURE__ */ jsx("input", {
									type: "file",
									accept: "image/*,.svg",
									style: { display: "none" },
									onChange: (e) => {
										const file = e.target.files?.[0];
										if (!file) return;
										const reader = new FileReader();
										reader.onload = () => {
											patchField("iconUrl", reader.result);
											patchField("iconKey", null);
											clearErr("iconUrl");
										};
										reader.readAsDataURL(file);
										e.target.value = "";
									}
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: 6
								},
								children: [/* @__PURE__ */ jsx("textarea", {
									className: "ad-input",
									style: {
										flex: 1,
										minHeight: 54,
										fontSize: 11,
										fontFamily: "monospace",
										resize: "vertical"
									},
									placeholder: "Or paste SVG code…",
									value: svgDraft,
									onChange: (e) => setSvgDraft(e.target.value)
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "ad-btn",
									style: {
										fontSize: 12,
										padding: "5px 10px",
										alignSelf: "flex-end"
									},
									disabled: !svgDraft.trim(),
									onClick: () => {
										try {
											patchField("iconUrl", `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgDraft.trim())))}`);
											patchField("iconKey", null);
											setSvgDraft("");
											clearErr("iconUrl");
										} catch {}
									},
									children: "Apply"
								})]
							}),
							errors.iconUrl && /* @__PURE__ */ jsx("span", {
								className: "ad-field-error",
								"data-field-error": true,
								children: errors.iconUrl
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "ad-field",
					style: { flex: "1 1 240px" },
					children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Icon — Highlighted *"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: 8
						},
						children: [
							form.iconUrlHighlighted && /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: 10
								},
								children: [/* @__PURE__ */ jsx("img", {
									src: form.iconUrlHighlighted,
									alt: "",
									style: {
										width: 36,
										height: 36,
										objectFit: "contain",
										borderRadius: 6,
										border: "1px solid var(--ad-border)",
										background: "var(--ad-surface2)",
										padding: 4
									}
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "ad-btn ad-btn--ghost",
									style: {
										fontSize: 12,
										padding: "4px 10px"
									},
									onClick: () => {
										patchField("iconUrlHighlighted", null);
										clearErr("iconUrlHighlighted");
									},
									children: "Remove"
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: `ad-btn ad-btn--ghost${errors.iconUrlHighlighted ? " ad-btn--error" : ""}`,
								style: {
									fontSize: 12,
									padding: "5px 12px",
									cursor: "pointer",
									textAlign: "center"
								},
								children: ["Upload Image / SVG File", /* @__PURE__ */ jsx("input", {
									type: "file",
									accept: "image/*,.svg",
									style: { display: "none" },
									onChange: (e) => {
										const file = e.target.files?.[0];
										if (!file) return;
										const reader = new FileReader();
										reader.onload = () => {
											patchField("iconUrlHighlighted", reader.result);
											clearErr("iconUrlHighlighted");
										};
										reader.readAsDataURL(file);
										e.target.value = "";
									}
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: 6
								},
								children: [/* @__PURE__ */ jsx("textarea", {
									className: "ad-input",
									style: {
										flex: 1,
										minHeight: 54,
										fontSize: 11,
										fontFamily: "monospace",
										resize: "vertical"
									},
									placeholder: "Or paste SVG code…",
									value: svgDraftHighlighted,
									onChange: (e) => setSvgDraftHighlighted(e.target.value)
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "ad-btn",
									style: {
										fontSize: 12,
										padding: "5px 10px",
										alignSelf: "flex-end"
									},
									disabled: !svgDraftHighlighted.trim(),
									onClick: () => {
										try {
											patchField("iconUrlHighlighted", `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgDraftHighlighted.trim())))}`);
											setSvgDraftHighlighted("");
											clearErr("iconUrlHighlighted");
										} catch {}
									},
									children: "Apply"
								})]
							}),
							errors.iconUrlHighlighted && /* @__PURE__ */ jsx("span", {
								className: "ad-field-error",
								"data-field-error": true,
								children: errors.iconUrlHighlighted
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "ad-field",
					style: { flex: "1 1 240px" },
					children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Icon — Light Mode"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: 8
						},
						children: [
							form.iconUrlLight && /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: 10
								},
								children: [/* @__PURE__ */ jsx("img", {
									src: form.iconUrlLight,
									alt: "",
									style: {
										width: 36,
										height: 36,
										objectFit: "contain",
										borderRadius: 6,
										border: "1px solid var(--ad-border)",
										background: "#f5f5f5",
										padding: 4
									}
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "ad-btn ad-btn--ghost",
									style: {
										fontSize: 12,
										padding: "4px 10px"
									},
									onClick: () => {
										patchField("iconUrlLight", null);
									},
									children: "Remove"
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "ad-btn ad-btn--ghost",
								style: {
									fontSize: 12,
									padding: "5px 12px",
									cursor: "pointer",
									textAlign: "center"
								},
								children: ["Upload Image / SVG File", /* @__PURE__ */ jsx("input", {
									type: "file",
									accept: "image/*,.svg",
									style: { display: "none" },
									onChange: (e) => {
										const file = e.target.files?.[0];
										if (!file) return;
										const reader = new FileReader();
										reader.onload = () => {
											patchField("iconUrlLight", reader.result);
										};
										reader.readAsDataURL(file);
										e.target.value = "";
									}
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: 6
								},
								children: [/* @__PURE__ */ jsx("textarea", {
									className: "ad-input",
									style: {
										flex: 1,
										minHeight: 54,
										fontSize: 11,
										fontFamily: "monospace",
										resize: "vertical"
									},
									placeholder: "Or paste SVG code…",
									value: svgDraftLight,
									onChange: (e) => setSvgDraftLight(e.target.value)
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "ad-btn",
									style: {
										fontSize: 12,
										padding: "5px 10px",
										alignSelf: "flex-end"
									},
									disabled: !svgDraftLight.trim(),
									onClick: () => {
										try {
											patchField("iconUrlLight", `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgDraftLight.trim())))}`);
											setSvgDraftLight("");
										} catch {}
									},
									children: "Apply"
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								style: {
									margin: 0,
									fontSize: 11,
									color: "var(--ad-text3)"
								},
								children: "Shown instead of the normal icon when the site is in light mode. Optional — falls back to the normal icon if omitted."
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "ad-field",
					style: { flex: "1 1 240px" },
					children: [/* @__PURE__ */ jsx("label", {
						className: "ad-label",
						children: "Icon — Light Highlighted"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: 8
						},
						children: [
							form.iconUrlLightHighlighted && /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: 10
								},
								children: [/* @__PURE__ */ jsx("img", {
									src: form.iconUrlLightHighlighted,
									alt: "",
									style: {
										width: 36,
										height: 36,
										objectFit: "contain",
										borderRadius: 6,
										border: "1px solid var(--ad-border)",
										background: "#f5f5f5",
										padding: 4
									}
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "ad-btn ad-btn--ghost",
									style: {
										fontSize: 12,
										padding: "4px 10px"
									},
									onClick: () => {
										patchField("iconUrlLightHighlighted", null);
									},
									children: "Remove"
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "ad-btn ad-btn--ghost",
								style: {
									fontSize: 12,
									padding: "5px 12px",
									cursor: "pointer",
									textAlign: "center"
								},
								children: ["Upload Image / SVG File", /* @__PURE__ */ jsx("input", {
									type: "file",
									accept: "image/*,.svg",
									style: { display: "none" },
									onChange: (e) => {
										const file = e.target.files?.[0];
										if (!file) return;
										const reader = new FileReader();
										reader.onload = () => {
											patchField("iconUrlLightHighlighted", reader.result);
										};
										reader.readAsDataURL(file);
										e.target.value = "";
									}
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: 6
								},
								children: [/* @__PURE__ */ jsx("textarea", {
									className: "ad-input",
									style: {
										flex: 1,
										minHeight: 54,
										fontSize: 11,
										fontFamily: "monospace",
										resize: "vertical"
									},
									placeholder: "Or paste SVG code…",
									value: svgDraftLightHighlighted,
									onChange: (e) => setSvgDraftLightHighlighted(e.target.value)
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "ad-btn",
									style: {
										fontSize: 12,
										padding: "5px 10px",
										alignSelf: "flex-end"
									},
									disabled: !svgDraftLightHighlighted.trim(),
									onClick: () => {
										try {
											patchField("iconUrlLightHighlighted", `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgDraftLightHighlighted.trim())))}`);
											setSvgDraftLightHighlighted("");
										} catch {}
									},
									children: "Apply"
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								style: {
									margin: 0,
									fontSize: 11,
									color: "var(--ad-text3)"
								},
								children: "Active/highlighted state in light mode. Optional — falls back to the highlighted icon, then the light icon."
							})
						]
					})]
				})
			]
		}),
		addingBlock && createPortal(/* @__PURE__ */ jsx("div", {
			className: "ad-modal-backdrop",
			onClick: () => setAddingBlock(false),
			children: /* @__PURE__ */ jsxs("div", {
				className: "ad-modal",
				onClick: (e) => e.stopPropagation(),
				style: {
					maxWidth: 480,
					width: "92vw"
				},
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "ad-modal-title",
						children: "Add Content Block"
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "var(--ad-text3)",
							fontSize: 13,
							marginTop: -4,
							marginBottom: 16
						},
						children: "Choose a block type to add to this step."
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "repeat(3, 1fr)",
							gap: 8
						},
						children: BLOCK_TYPES.map((t) => /* @__PURE__ */ jsxs("button", {
							type: "button",
							className: "ad-btn ad-btn--ghost",
							style: {
								display: "flex",
								flexDirection: "column",
								alignItems: "flex-start",
								padding: "10px 12px",
								textAlign: "left",
								gap: 3,
								height: "auto"
							},
							onClick: () => {
								addBlock(t);
								setAddingBlock(false);
							},
							children: [/* @__PURE__ */ jsx("span", {
								style: {
									fontSize: 13,
									fontWeight: 500
								},
								children: BLOCK_TYPE_LABELS[t]
							}), /* @__PURE__ */ jsx("span", {
								style: {
									fontSize: 11,
									color: "var(--ad-text3)",
									fontWeight: 400,
									lineHeight: 1.35
								},
								children: BLOCK_TYPE_DESCRIPTIONS[t]
							})]
						}, t))
					}),
					/* @__PURE__ */ jsx("div", {
						className: "ad-modal-actions",
						style: { marginTop: 16 },
						children: /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "ad-btn ad-btn--ghost",
							onClick: () => setAddingBlock(false),
							children: "Cancel"
						})
					})
				]
			})
		}), document.body),
		/* @__PURE__ */ jsxs("div", {
			style: { marginBottom: 20 },
			children: [
				/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 8
					},
					children: [/* @__PURE__ */ jsxs("strong", {
						style: { fontSize: 13 },
						children: [
							"Content Blocks (",
							form.blocks.length,
							")"
						]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "ad-btn",
						onClick: () => setAddingBlock(true),
						children: "+ Add Block"
					})]
				}),
				form.blocks.length === 0 && /* @__PURE__ */ jsx("p", {
					style: {
						color: "var(--ad-text3)",
						fontSize: 13,
						textAlign: "center",
						padding: "20px 0"
					},
					children: "No blocks yet. Click \"+ Add Block\" to add one."
				}),
				form.blocks.map((block, i) => /* @__PURE__ */ jsx(BlockForm, {
					index: i,
					block,
					onPatch: (patch) => patchBlock(i, patch),
					onRemove: () => removeBlock(i),
					onMoveUp: () => moveBlock(i, -1),
					onMoveDown: () => moveBlock(i, 1)
				}, i))
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "ad-field-row",
			style: { gap: 10 },
			children: [
				/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "ad-btn",
					disabled: saving,
					onClick: () => {
						const errs = {};
						if (!form.title.trim()) errs.title = "Title is required.";
						if (!form.iconUrl) errs.iconUrl = "Normal icon is required.";
						if (!form.iconUrlHighlighted) errs.iconUrlHighlighted = "Highlighted icon is required.";
						if (Object.keys(errs).length > 0) {
							setErrors(errs);
							scrollToFirstError();
							return;
						}
						setErrors({});
						onSave({
							...form,
							iconKey: form.iconKey?.trim() || void 0,
							accentColor: form.accentColor?.trim() || void 0,
							subheading: form.subheading?.trim() || void 0
						});
					},
					children: saving ? "Saving…" : "Save Step"
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "ad-btn ad-btn--ghost",
					onClick: onCancel,
					children: "Cancel"
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "ad-btn ad-btn--ghost",
					onClick: () => setEditorPreviewOpen(true),
					children: "Preview"
				})
			]
		}),
		editorPreviewOpen && (() => {
			const previewStep = {
				id: "_editor_preview",
				createdAt: "",
				updatedAt: "",
				...form,
				iconKey: form.iconKey ?? null,
				iconUrl: form.iconUrl ?? null,
				iconUrlHighlighted: form.iconUrlHighlighted ?? null,
				accentColor: form.accentColor ?? null,
				subheading: form.subheading ?? null
			};
			return /* @__PURE__ */ jsx(JourneyPreviewModal, {
				steps: [previewStep],
				initialOpenId: previewStep.id,
				onClose: () => setEditorPreviewOpen(false)
			});
		})()
	] });
}
function JourneyStepsManager({ apiKey }) {
	const [steps, setSteps] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editStep, setEditStep] = useState(null);
	const [creating, setCreating] = useState(false);
	const [saving, setSaving] = useState(false);
	const [toast, setToast] = useState(null);
	const [confirmDelete, setConfirmDelete] = useState(null);
	const [previewInitialId, setPreviewInitialId] = useState(null);
	const [previewOpen, setPreviewOpen] = useState(false);
	const showToast = (msg, ok = true) => {
		setToast({
			msg,
			ok
		});
		setTimeout(() => setToast(null), 3500);
	};
	const load = async () => {
		setLoading(true);
		try {
			setSteps((await adminGetJourneySteps(apiKey)).data);
		} catch {
			showToast("Failed to load steps", false);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		load();
	}, []);
	const handleSave = async (data) => {
		setSaving(true);
		try {
			if (editStep) {
				await adminUpdateJourneyStep(apiKey, editStep.id, data);
				showToast("Step updated.");
			} else {
				await adminCreateJourneyStep(apiKey, data);
				showToast("Step created.");
			}
			setEditStep(null);
			setCreating(false);
			await load();
		} catch (err) {
			showToast(err.message ?? "Save failed", false);
		} finally {
			setSaving(false);
		}
	};
	const handleDelete = async (id) => {
		try {
			await adminDeleteJourneyStep(apiKey, id);
			showToast("Step deleted.");
			await load();
		} catch {
			showToast("Delete failed", false);
		} finally {
			setConfirmDelete(null);
		}
	};
	const handleToggleStatus = async (step) => {
		const next = step.status === "published" ? "draft" : "published";
		try {
			await adminPatchJourneyStepStatus(apiKey, step.id, next);
			showToast(`Step ${next === "published" ? "published" : "unpublished"}.`);
			await load();
		} catch {
			showToast("Status update failed", false);
		}
	};
	const handleMoveStep = async (id, dir) => {
		const i = steps.findIndex((s) => s.id === id);
		const j = i + dir;
		if (i < 0 || j < 0 || j >= steps.length) return;
		const next = [...steps];
		[next[i], next[j]] = [next[j], next[i]];
		const reordered = next.map((s, idx) => ({
			id: s.id,
			order: idx
		}));
		try {
			await adminReorderJourneySteps(apiKey, reordered);
			setSteps(next.map((s, idx) => ({
				...s,
				order: idx
			})));
		} catch {
			showToast("Reorder failed", false);
		}
	};
	if (editStep || creating) return /* @__PURE__ */ jsxs("div", {
		className: "ad-section",
		children: [
			toast && createPortal(/* @__PURE__ */ jsx("div", {
				className: `ad-toast${toast.ok ? "" : " ad-toast--error"}`,
				children: toast.msg
			}), document.body),
			/* @__PURE__ */ jsx("div", {
				className: "ad-section-header",
				children: /* @__PURE__ */ jsx("h2", {
					className: "ad-section-title",
					children: editStep ? `Edit: ${editStep.title}` : "New Journey Step"
				})
			}),
			/* @__PURE__ */ jsx(StepEditor, {
				step: editStep ? { ...editStep } : {
					...EMPTY_STEP,
					order: steps.length
				},
				onSave: handleSave,
				onCancel: () => {
					setEditStep(null);
					setCreating(false);
				},
				saving
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "ad-section",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "ad-section-header",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "ad-section-title",
					children: "Client Journey Steps"
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						gap: 8
					},
					children: [steps.length > 0 && /* @__PURE__ */ jsx("button", {
						className: "ad-btn ad-btn--ghost",
						onClick: () => {
							setPreviewInitialId(steps[0].id);
							setPreviewOpen(true);
						},
						children: "Preview All"
					}), /* @__PURE__ */ jsx("button", {
						className: "ad-btn",
						onClick: () => setCreating(true),
						children: "+ New Step"
					})]
				})]
			}),
			toast && createPortal(/* @__PURE__ */ jsx("div", {
				className: `ad-toast${toast.ok ? "" : " ad-toast--error"}`,
				children: toast.msg
			}), document.body),
			confirmDelete && createPortal(/* @__PURE__ */ jsx("div", {
				className: "ad-modal-backdrop",
				onClick: () => setConfirmDelete(null),
				children: /* @__PURE__ */ jsxs("div", {
					className: "ad-modal",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ jsx("h3", {
							className: "ad-modal-title",
							children: "Delete step?"
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								color: "var(--ad-text2)",
								marginBottom: 20
							},
							children: "This cannot be undone."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "ad-modal-actions",
							children: [/* @__PURE__ */ jsx("button", {
								className: "ad-btn ad-btn--danger",
								onClick: () => void handleDelete(confirmDelete),
								children: "Delete"
							}), /* @__PURE__ */ jsx("button", {
								className: "ad-btn ad-btn--ghost",
								onClick: () => setConfirmDelete(null),
								children: "Cancel"
							})]
						})
					]
				})
			}), document.body),
			previewOpen && /* @__PURE__ */ jsx(JourneyPreviewModal, {
				steps,
				initialOpenId: previewInitialId,
				onClose: () => setPreviewOpen(false)
			}),
			loading ? /* @__PURE__ */ jsx("p", {
				style: {
					color: "var(--ad-text3)",
					padding: "32px 0",
					textAlign: "center"
				},
				children: "Loading…"
			}) : steps.length === 0 ? /* @__PURE__ */ jsx("p", {
				style: {
					color: "var(--ad-text3)",
					padding: "32px 0",
					textAlign: "center"
				},
				children: "No steps yet. Click \"+ New Step\" to add one."
			}) : /* @__PURE__ */ jsx("div", {
				className: "ad-table-wrap",
				children: /* @__PURE__ */ jsxs("table", {
					className: "ad-table",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("th", {
							style: { width: 60 },
							children: "Order"
						}),
						/* @__PURE__ */ jsx("th", { children: "Title" }),
						/* @__PURE__ */ jsx("th", {
							style: { width: 80 },
							children: "Blocks"
						}),
						/* @__PURE__ */ jsx("th", {
							style: { width: 100 },
							children: "Status"
						}),
						/* @__PURE__ */ jsx("th", {
							style: { width: 180 },
							children: "Last Updated"
						}),
						/* @__PURE__ */ jsx("th", {
							style: { width: 220 },
							children: "Actions"
						})
					] }) }), /* @__PURE__ */ jsx("tbody", { children: steps.map((step, i) => /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("td", {
							style: { textAlign: "center" },
							children: /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: 2,
									alignItems: "center"
								},
								children: [
									/* @__PURE__ */ jsx("button", {
										className: "ad-btn ad-btn--ghost ad-btn--sm",
										onClick: () => void handleMoveStep(step.id, -1),
										disabled: i === 0,
										children: "↑"
									}),
									/* @__PURE__ */ jsx("span", {
										style: {
											fontSize: 12,
											color: "var(--ad-text3)"
										},
										children: String(i + 1).padStart(2, "0")
									}),
									/* @__PURE__ */ jsx("button", {
										className: "ad-btn ad-btn--ghost ad-btn--sm",
										onClick: () => void handleMoveStep(step.id, 1),
										disabled: i === steps.length - 1,
										children: "↓"
									})
								]
							})
						}),
						/* @__PURE__ */ jsxs("td", { children: [/* @__PURE__ */ jsx("strong", {
							style: {
								display: "block",
								fontSize: 14
							},
							children: step.title
						}), step.subheading && /* @__PURE__ */ jsx("span", {
							style: {
								fontSize: 12,
								color: "var(--ad-text3)"
							},
							children: step.subheading
						})] }),
						/* @__PURE__ */ jsx("td", {
							style: {
								textAlign: "center",
								color: "var(--ad-text3)"
							},
							children: step.blocks.length
						}),
						/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", {
							className: `ad-badge${step.status === "published" ? " ad-badge--green" : " ad-badge--gray"}`,
							children: step.status
						}) }),
						/* @__PURE__ */ jsx("td", {
							style: {
								fontSize: 12,
								color: "var(--ad-text3)"
							},
							children: new Date(step.updatedAt).toLocaleString()
						}),
						/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))",
								gap: "4px 6px"
							},
							children: [
								/* @__PURE__ */ jsx("button", {
									className: "ad-btn ad-btn--sm",
									onClick: () => setEditStep(step),
									children: "Edit"
								}),
								/* @__PURE__ */ jsx("button", {
									className: "ad-btn ad-btn--ghost ad-btn--sm",
									onClick: () => {
										setPreviewInitialId(step.id);
										setPreviewOpen(true);
									},
									children: "Preview"
								}),
								/* @__PURE__ */ jsx("button", {
									className: "ad-btn ad-btn--ghost ad-btn--sm",
									onClick: () => void handleToggleStatus(step),
									children: step.status === "published" ? "Unpublish" : "Publish"
								}),
								/* @__PURE__ */ jsx("button", {
									className: "ad-btn ad-btn--ghost ad-btn--sm",
									style: { color: "#fc615a" },
									onClick: () => setConfirmDelete(step.id),
									children: "Delete"
								})
							]
						}) })
					] }, step.id)) })]
				})
			})
		]
	});
}
function NavIcon({ children }) {
	return /* @__PURE__ */ jsx("svg", {
		width: "14",
		height: "14",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.75",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": "true",
		children
	});
}
function ASAdmin() {
	const [apiKey, setApiKey] = useState(() => sessionStorage.getItem("azari_admin_key") ?? "");
	const [authError, setAuthError] = useState("");
	const [tab, setTab] = useState("overview");
	const [stats, setStats] = useState(null);
	const [isLight, setIsLight] = useState(() => localStorage.getItem("azari-admin-theme") === "light");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	useEffect(() => {
		document.body.classList.toggle("is-light", isLight);
		return () => {
			document.body.classList.remove("is-light");
		};
	}, [isLight]);
	const handleLogin = async (key) => {
		try {
			const res = await adminGetStats(key);
			sessionStorage.setItem("azari_admin_key", key);
			setApiKey(key);
			setStats(res.data);
			setAuthError("");
		} catch {
			setAuthError("Invalid API key. Please try again.");
		}
	};
	useEffect(() => {
		if (apiKey) adminGetStats(apiKey).then((res) => setStats(res.data)).catch(() => {
			sessionStorage.removeItem("azari_admin_key");
			setApiKey("");
		});
	}, []);
	const handleLogout = () => {
		sessionStorage.removeItem("azari_admin_key");
		setApiKey("");
		setStats(null);
	};
	const toggleTheme = () => {
		const next = !isLight;
		setIsLight(next);
		localStorage.setItem("azari-admin-theme", next ? "light" : "dark");
	};
	const navigate = (id) => {
		setTab(id);
		setSidebarOpen(false);
	};
	const NAV_GROUPS = [
		{
			label: "Dashboard",
			items: [{
				id: "overview",
				label: "Overview",
				icon: /* @__PURE__ */ jsxs(NavIcon, { children: [
					/* @__PURE__ */ jsx("rect", {
						x: "3",
						y: "3",
						width: "7",
						height: "7",
						rx: "1"
					}),
					/* @__PURE__ */ jsx("rect", {
						x: "14",
						y: "3",
						width: "7",
						height: "7",
						rx: "1"
					}),
					/* @__PURE__ */ jsx("rect", {
						x: "3",
						y: "14",
						width: "7",
						height: "7",
						rx: "1"
					}),
					/* @__PURE__ */ jsx("rect", {
						x: "14",
						y: "14",
						width: "7",
						height: "7",
						rx: "1"
					})
				] })
			}]
		},
		{
			label: "Operations",
			items: [
				{
					id: "inquiries",
					label: "Talk Inquiries",
					icon: /* @__PURE__ */ jsx(NavIcon, { children: /* @__PURE__ */ jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) })
				},
				{
					id: "quotations",
					label: "Quotations",
					icon: /* @__PURE__ */ jsxs(NavIcon, { children: [
						/* @__PURE__ */ jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
						/* @__PURE__ */ jsx("polyline", { points: "14 2 14 8 20 8" }),
						/* @__PURE__ */ jsx("line", {
							x1: "16",
							y1: "13",
							x2: "8",
							y2: "13"
						}),
						/* @__PURE__ */ jsx("line", {
							x1: "16",
							y1: "17",
							x2: "8",
							y2: "17"
						})
					] })
				},
				{
					id: "package-inquiries",
					label: "Package Inquiries",
					icon: /* @__PURE__ */ jsxs(NavIcon, { children: [/* @__PURE__ */ jsx("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }), /* @__PURE__ */ jsx("polyline", { points: "22 6 12 13 2 6" })] })
				}
			]
		},
		{
			label: "Products",
			items: [
				{
					id: "inventory",
					label: "Inventory",
					icon: /* @__PURE__ */ jsxs(NavIcon, { children: [
						/* @__PURE__ */ jsx("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }),
						/* @__PURE__ */ jsx("polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }),
						/* @__PURE__ */ jsx("line", {
							x1: "12",
							y1: "22.08",
							x2: "12",
							y2: "12"
						})
					] })
				},
				{
					id: "packages",
					label: "Packages",
					icon: /* @__PURE__ */ jsxs(NavIcon, { children: [
						/* @__PURE__ */ jsx("line", {
							x1: "16.5",
							y1: "9.4",
							x2: "7.5",
							y2: "4.21"
						}),
						/* @__PURE__ */ jsx("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }),
						/* @__PURE__ */ jsx("polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }),
						/* @__PURE__ */ jsx("line", {
							x1: "12",
							y1: "22.08",
							x2: "12",
							y2: "12"
						})
					] })
				},
				{
					id: "projects",
					label: "Projects",
					icon: /* @__PURE__ */ jsxs(NavIcon, { children: [
						/* @__PURE__ */ jsx("rect", {
							x: "3",
							y: "3",
							width: "18",
							height: "18",
							rx: "2"
						}),
						/* @__PURE__ */ jsx("circle", {
							cx: "8.5",
							cy: "8.5",
							r: "1.5"
						}),
						/* @__PURE__ */ jsx("polyline", { points: "21 15 16 10 5 21" })
					] })
				},
				{
					id: "utilities",
					label: "Utilities",
					icon: /* @__PURE__ */ jsxs(NavIcon, { children: [/* @__PURE__ */ jsx("circle", {
						cx: "12",
						cy: "12",
						r: "3"
					}), /* @__PURE__ */ jsx("path", { d: "M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" })] })
				}
			]
		},
		{
			label: "Content",
			items: [
				{
					id: "sections",
					label: "Visibility",
					icon: /* @__PURE__ */ jsxs(NavIcon, { children: [/* @__PURE__ */ jsx("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }), /* @__PURE__ */ jsx("circle", {
						cx: "12",
						cy: "12",
						r: "3"
					})] })
				},
				{
					id: "hero",
					label: "Hero",
					icon: /* @__PURE__ */ jsxs(NavIcon, { children: [/* @__PURE__ */ jsx("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }), /* @__PURE__ */ jsx("polyline", { points: "9 22 9 12 15 12 15 22" })] })
				},
				{
					id: "metrics",
					label: "Metrics",
					icon: /* @__PURE__ */ jsxs(NavIcon, { children: [
						/* @__PURE__ */ jsx("line", {
							x1: "18",
							y1: "20",
							x2: "18",
							y2: "10"
						}),
						/* @__PURE__ */ jsx("line", {
							x1: "12",
							y1: "20",
							x2: "12",
							y2: "4"
						}),
						/* @__PURE__ */ jsx("line", {
							x1: "6",
							y1: "20",
							x2: "6",
							y2: "14"
						})
					] })
				},
				{
					id: "benefits",
					label: "Benefits",
					icon: /* @__PURE__ */ jsx(NavIcon, { children: /* @__PURE__ */ jsx("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }) })
				},
				{
					id: "tropics",
					label: "Tropics",
					icon: /* @__PURE__ */ jsxs(NavIcon, { children: [
						/* @__PURE__ */ jsx("circle", {
							cx: "12",
							cy: "12",
							r: "5"
						}),
						/* @__PURE__ */ jsx("line", {
							x1: "12",
							y1: "1",
							x2: "12",
							y2: "3"
						}),
						/* @__PURE__ */ jsx("line", {
							x1: "12",
							y1: "21",
							x2: "12",
							y2: "23"
						}),
						/* @__PURE__ */ jsx("line", {
							x1: "4.22",
							y1: "4.22",
							x2: "5.64",
							y2: "5.64"
						}),
						/* @__PURE__ */ jsx("line", {
							x1: "18.36",
							y1: "18.36",
							x2: "19.78",
							y2: "19.78"
						}),
						/* @__PURE__ */ jsx("line", {
							x1: "1",
							y1: "12",
							x2: "3",
							y2: "12"
						}),
						/* @__PURE__ */ jsx("line", {
							x1: "21",
							y1: "12",
							x2: "23",
							y2: "12"
						})
					] })
				},
				{
					id: "journey",
					label: "Journey",
					icon: /* @__PURE__ */ jsxs(NavIcon, { children: [/* @__PURE__ */ jsx("circle", {
						cx: "12",
						cy: "12",
						r: "10"
					}), /* @__PURE__ */ jsx("polyline", { points: "12 6 12 12 16 14" })] })
				},
				{
					id: "journey-steps",
					label: "Journey Steps",
					icon: /* @__PURE__ */ jsxs(NavIcon, { children: [/* @__PURE__ */ jsx("polyline", { points: "9 11 12 14 22 4" }), /* @__PURE__ */ jsx("path", { d: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" })] })
				},
				{
					id: "excellence",
					label: "Excellence",
					icon: /* @__PURE__ */ jsxs(NavIcon, { children: [/* @__PURE__ */ jsx("circle", {
						cx: "12",
						cy: "8",
						r: "7"
					}), /* @__PURE__ */ jsx("polyline", { points: "8.21 13.89 7 23 12 20 17 23 15.79 13.88" })] })
				},
				{
					id: "process",
					label: "Process",
					icon: /* @__PURE__ */ jsxs(NavIcon, { children: [/* @__PURE__ */ jsx("circle", {
						cx: "12",
						cy: "12",
						r: "3"
					}), /* @__PURE__ */ jsx("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" })] })
				},
				{
					id: "cta",
					label: "Call to Action",
					icon: /* @__PURE__ */ jsx(NavIcon, { children: /* @__PURE__ */ jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) })
				},
				{
					id: "footer",
					label: "Footer",
					icon: /* @__PURE__ */ jsxs(NavIcon, { children: [
						/* @__PURE__ */ jsx("rect", {
							x: "3",
							y: "3",
							width: "18",
							height: "18",
							rx: "2"
						}),
						/* @__PURE__ */ jsx("line", {
							x1: "3",
							y1: "9",
							x2: "21",
							y2: "9"
						}),
						/* @__PURE__ */ jsx("line", {
							x1: "3",
							y1: "15",
							x2: "21",
							y2: "15"
						})
					] })
				}
			]
		}
	];
	const currentLabel = NAV_GROUPS.flatMap((g) => g.items).find((i) => i.id === tab)?.label ?? "";
	if (!apiKey) return /* @__PURE__ */ jsx("div", {
		className: `as-admin${isLight ? " is-light" : ""}`,
		children: /* @__PURE__ */ jsx(LoginScreen, {
			onLogin: handleLogin,
			error: authError
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: `as-admin${isLight ? " is-light" : ""}`,
		children: [
			/* @__PURE__ */ jsx(ASRateLimitWall, {}),
			/* @__PURE__ */ jsxs("nav", {
				className: "ad-topnav",
				children: [
					/* @__PURE__ */ jsx("button", {
						className: "ad-hamburger",
						onClick: () => setSidebarOpen((s) => !s),
						"aria-label": "Toggle navigation",
						children: /* @__PURE__ */ jsxs("svg", {
							width: "18",
							height: "18",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							children: [
								/* @__PURE__ */ jsx("line", {
									x1: "3",
									y1: "6",
									x2: "21",
									y2: "6"
								}),
								/* @__PURE__ */ jsx("line", {
									x1: "3",
									y1: "12",
									x2: "21",
									y2: "12"
								}),
								/* @__PURE__ */ jsx("line", {
									x1: "3",
									y1: "18",
									x2: "21",
									y2: "18"
								})
							]
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "ad-topnav-logo",
						children: ["azari", /* @__PURE__ */ jsx("span", { children: ".solar" })]
					}),
					/* @__PURE__ */ jsx("span", {
						className: "ad-topnav-badge",
						children: "Admin"
					}),
					/* @__PURE__ */ jsx("span", {
						className: "ad-topnav-section",
						children: currentLabel
					}),
					/* @__PURE__ */ jsx("div", { className: "ad-topnav-spacer" }),
					/* @__PURE__ */ jsxs("div", {
						className: "ad-topnav-actions",
						children: [/* @__PURE__ */ jsx("button", {
							className: `ad-theme-toggle${isLight ? " is-light" : ""}`,
							onClick: toggleTheme,
							"aria-label": "Toggle theme",
							title: isLight ? "Switch to dark mode" : "Switch to light mode"
						}), /* @__PURE__ */ jsx("button", {
							onClick: handleLogout,
							className: "ad-btn ad-btn--ghost ad-btn--sm",
							children: "Sign Out"
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "ad-body",
				children: [
					sidebarOpen && /* @__PURE__ */ jsx("div", {
						className: "ad-sidebar-backdrop",
						onClick: () => setSidebarOpen(false)
					}),
					/* @__PURE__ */ jsx("nav", {
						className: `ad-sidebar${sidebarOpen ? " is-open" : ""}`,
						"aria-label": "Admin navigation",
						children: /* @__PURE__ */ jsx("div", {
							className: "ad-sidebar-inner",
							children: NAV_GROUPS.map((group, gi) => /* @__PURE__ */ jsxs("div", {
								className: "ad-sidebar-group",
								children: [
									gi > 0 && /* @__PURE__ */ jsx("div", { className: "ad-sidebar-divider" }),
									/* @__PURE__ */ jsx("div", {
										className: "ad-sidebar-group-label",
										children: group.label
									}),
									group.items.map((item) => /* @__PURE__ */ jsxs("button", {
										className: `ad-sidebar-item${tab === item.id ? " is-active" : ""}`,
										onClick: () => navigate(item.id),
										children: [item.icon, item.label]
									}, item.id))
								]
							}, group.label))
						})
					}),
					/* @__PURE__ */ jsxs("main", {
						className: "ad-main",
						children: [
							tab === "overview" && /* @__PURE__ */ jsx(OverviewTab, { stats }),
							tab === "inquiries" && /* @__PURE__ */ jsx(SubmissionsTable, {
								apiKey,
								type: "talk"
							}),
							tab === "quotations" && /* @__PURE__ */ jsx(SubmissionsTable, {
								apiKey,
								type: "quotations"
							}),
							tab === "projects" && /* @__PURE__ */ jsx(ProjectsManager, { apiKey }),
							tab === "inventory" && /* @__PURE__ */ jsx(ComponentsManager, {
								apiKey,
								onGoToPackages: () => navigate("packages")
							}),
							tab === "packages" && /* @__PURE__ */ jsx(PackagesManager, { apiKey }),
							tab === "package-inquiries" && /* @__PURE__ */ jsx(PackageInquiriesManager, { apiKey }),
							tab === "utilities" && /* @__PURE__ */ jsx(UtilitiesManager, { apiKey }),
							tab === "sections" && /* @__PURE__ */ jsx(SectionsManager, { apiKey }),
							tab === "hero" && /* @__PURE__ */ jsx(HeroEditor, { apiKey }),
							tab === "metrics" && /* @__PURE__ */ jsx(MetricsEditor, { apiKey }),
							tab === "benefits" && /* @__PURE__ */ jsx(BenefitsEditor, { apiKey }),
							tab === "tropics" && /* @__PURE__ */ jsx(TropicsEditor, { apiKey }),
							tab === "journey" && /* @__PURE__ */ jsx(ClientJourneyEditor, { apiKey }),
							tab === "journey-steps" && /* @__PURE__ */ jsx(JourneyStepsManager, { apiKey }),
							tab === "excellence" && /* @__PURE__ */ jsx(ExcellenceEditor, { apiKey }),
							tab === "process" && /* @__PURE__ */ jsx(ProcessEditor, { apiKey }),
							tab === "cta" && /* @__PURE__ */ jsx(CtaEditor, { apiKey }),
							tab === "footer" && /* @__PURE__ */ jsx(FooterEditor, { apiKey })
						]
					})
				]
			})
		]
	});
}
//#endregion
//#region app/routes/admin.tsx
var admin_exports = /* @__PURE__ */ __exportAll({
	default: () => admin_default,
	meta: () => meta
});
var meta = () => [{ title: "Admin — Azari Solar" }, {
	name: "robots",
	content: "noindex, nofollow"
}];
var admin_default = UNSAFE_withComponentProps(function Admin() {
	return /* @__PURE__ */ jsx(ASAdmin, {});
});
//#endregion
//#region app/routes/robots-txt.tsx
var robots_txt_exports = /* @__PURE__ */ __exportAll({ loader: () => loader });
function loader() {
	const content = [
		"User-agent: *",
		"Allow: /",
		"Disallow: /admin",
		"",
		"Sitemap: https://azari.solar/sitemap.xml"
	].join("\n");
	return new Response(content, {
		status: 200,
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=86400"
		}
	});
}
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-CEJMG3rL.js",
		"imports": [
			"/assets/jsx-runtime-CU655D_Z.js",
			"/assets/errorBoundaries-BSmPFqlN.js",
			"/assets/react-dom-BJSRuIyb.js"
		],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/root-lrWOMhMg.js",
			"imports": [
				"/assets/jsx-runtime-CU655D_Z.js",
				"/assets/errorBoundaries-BSmPFqlN.js",
				"/assets/react-dom-BJSRuIyb.js"
			],
			"css": ["/assets/root-CF5dm7fD.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"layouts/main-layout": {
			"id": "layouts/main-layout",
			"parentId": "root",
			"path": void 0,
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/main-layout-BS366k3G.js",
			"imports": [
				"/assets/jsx-runtime-CU655D_Z.js",
				"/assets/ASRateLimitBanner-Bqe6nB8k.js",
				"/assets/useContent-b8Ah0NSL.js",
				"/assets/ASContent-D-3bArIT.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/_index": {
			"id": "routes/_index",
			"parentId": "layouts/main-layout",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/_index-C3EATVAG.js",
			"imports": [
				"/assets/jsx-runtime-CU655D_Z.js",
				"/assets/react-dom-BJSRuIyb.js",
				"/assets/ASCallToAction-BhqMfFbh.js",
				"/assets/useContent-b8Ah0NSL.js",
				"/assets/useSeoMeta-ov6J0T2i.js",
				"/assets/calculation-DOBR6BZH.js",
				"/assets/ASTalkToAnExpert-f6djKMq_.js",
				"/assets/ASContent-D-3bArIT.js",
				"/assets/ASLocationAutocomplete-De37eGpm.js"
			],
			"css": [
				"/assets/_index-C3JQx-Vl.css",
				"/assets/ASTalkToAnExpert-Ca3Y7G8y.css",
				"/assets/ASLocationAutocomplete-SzgnLS76.css"
			],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/projects._index": {
			"id": "routes/projects._index",
			"parentId": "layouts/main-layout",
			"path": "projects",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/projects._index-hFs32d7G.js",
			"imports": [
				"/assets/jsx-runtime-CU655D_Z.js",
				"/assets/ASImgLoader-BPWnkoh6.js",
				"/assets/useSeoMeta-ov6J0T2i.js",
				"/assets/ASContent-D-3bArIT.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/projects.$id": {
			"id": "routes/projects.$id",
			"parentId": "layouts/main-layout",
			"path": "projects/:id",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/projects._id-BZif1hpq.js",
			"imports": [
				"/assets/jsx-runtime-CU655D_Z.js",
				"/assets/react-dom-BJSRuIyb.js",
				"/assets/ASImgLoader-BPWnkoh6.js",
				"/assets/ASBentoCard-I6EBDKg8.js",
				"/assets/ASCallToAction-BhqMfFbh.js",
				"/assets/useSeoMeta-ov6J0T2i.js",
				"/assets/ASContent-D-3bArIT.js",
				"/assets/useContent-b8Ah0NSL.js",
				"/assets/ASTalkToAnExpert-f6djKMq_.js",
				"/assets/ASLocationAutocomplete-De37eGpm.js"
			],
			"css": ["/assets/ASTalkToAnExpert-Ca3Y7G8y.css", "/assets/ASLocationAutocomplete-SzgnLS76.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/packages": {
			"id": "routes/packages",
			"parentId": "layouts/main-layout",
			"path": "packages",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/packages-CgEqGBo5.js",
			"imports": [
				"/assets/jsx-runtime-CU655D_Z.js",
				"/assets/react-dom-BJSRuIyb.js",
				"/assets/ASLocationAutocomplete-De37eGpm.js",
				"/assets/useContent-b8Ah0NSL.js",
				"/assets/useSeoMeta-ov6J0T2i.js",
				"/assets/units-Bjt9xUjm.js",
				"/assets/ASTalkToAnExpert-f6djKMq_.js",
				"/assets/ASContent-D-3bArIT.js"
			],
			"css": ["/assets/ASLocationAutocomplete-SzgnLS76.css", "/assets/ASTalkToAnExpert-Ca3Y7G8y.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/solar-calculator": {
			"id": "routes/solar-calculator",
			"parentId": "layouts/main-layout",
			"path": "solar-calculator",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/solar-calculator-B1bm37Ef.js",
			"imports": [
				"/assets/jsx-runtime-CU655D_Z.js",
				"/assets/react-dom-BJSRuIyb.js",
				"/assets/ASLocationAutocomplete-De37eGpm.js",
				"/assets/useSeoMeta-ov6J0T2i.js",
				"/assets/calculation-DOBR6BZH.js"
			],
			"css": ["/assets/ASLocationAutocomplete-SzgnLS76.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/client-journey": {
			"id": "routes/client-journey",
			"parentId": "layouts/main-layout",
			"path": "client-journey",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/client-journey-alO12E9N.js",
			"imports": [
				"/assets/jsx-runtime-CU655D_Z.js",
				"/assets/ASClientJourneyPage-BGierHbQ.js",
				"/assets/ASImgLoader-BPWnkoh6.js",
				"/assets/ASCallToAction-BhqMfFbh.js",
				"/assets/useSeoMeta-ov6J0T2i.js",
				"/assets/ASContent-D-3bArIT.js",
				"/assets/useContent-b8Ah0NSL.js",
				"/assets/ASTalkToAnExpert-f6djKMq_.js",
				"/assets/react-dom-BJSRuIyb.js",
				"/assets/ASLocationAutocomplete-De37eGpm.js"
			],
			"css": ["/assets/ASTalkToAnExpert-Ca3Y7G8y.css", "/assets/ASLocationAutocomplete-SzgnLS76.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/sitemap-xml": {
			"id": "routes/sitemap-xml",
			"parentId": "layouts/main-layout",
			"path": "sitemap.xml",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/sitemap-xml-BMj1HUwi.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/$": {
			"id": "routes/$",
			"parentId": "layouts/main-layout",
			"path": "*",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/_-6Py3BmZl.js",
			"imports": ["/assets/jsx-runtime-CU655D_Z.js"],
			"css": ["/assets/_-CRp-DlTo.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin": {
			"id": "routes/admin",
			"parentId": "root",
			"path": "dev-admin",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/admin-CyoJPfk5.js",
			"imports": [
				"/assets/jsx-runtime-CU655D_Z.js",
				"/assets/react-dom-BJSRuIyb.js",
				"/assets/ASClientJourneyPage-BGierHbQ.js",
				"/assets/ASBentoCard-I6EBDKg8.js",
				"/assets/ASLocationAutocomplete-De37eGpm.js",
				"/assets/ASRateLimitBanner-Bqe6nB8k.js",
				"/assets/units-Bjt9xUjm.js",
				"/assets/ASContent-D-3bArIT.js",
				"/assets/ASImgLoader-BPWnkoh6.js",
				"/assets/ASCallToAction-BhqMfFbh.js",
				"/assets/useSeoMeta-ov6J0T2i.js",
				"/assets/useContent-b8Ah0NSL.js",
				"/assets/ASTalkToAnExpert-f6djKMq_.js"
			],
			"css": ["/assets/ASTalkToAnExpert-Ca3Y7G8y.css", "/assets/ASLocationAutocomplete-SzgnLS76.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/robots-txt": {
			"id": "routes/robots-txt",
			"parentId": "root",
			"path": "robots.txt",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/robots-txt-DfodlPWU.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-de789385.js",
	"version": "de789385",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build\\client";
var basename = "/";
var future = { "unstable_optimizeDeps": false };
var ssr = true;
var isSpaMode = false;
var prerender = [
	"/",
	"/packages",
	"/projects",
	"/solar-calculator",
	"/client-journey"
];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"layouts/main-layout": {
		id: "layouts/main-layout",
		parentId: "root",
		path: void 0,
		index: void 0,
		caseSensitive: void 0,
		module: main_layout_exports
	},
	"routes/_index": {
		id: "routes/_index",
		parentId: "layouts/main-layout",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: _index_exports
	},
	"routes/projects._index": {
		id: "routes/projects._index",
		parentId: "layouts/main-layout",
		path: "projects",
		index: void 0,
		caseSensitive: void 0,
		module: projects__index_exports
	},
	"routes/projects.$id": {
		id: "routes/projects.$id",
		parentId: "layouts/main-layout",
		path: "projects/:id",
		index: void 0,
		caseSensitive: void 0,
		module: projects_$id_exports
	},
	"routes/packages": {
		id: "routes/packages",
		parentId: "layouts/main-layout",
		path: "packages",
		index: void 0,
		caseSensitive: void 0,
		module: packages_exports
	},
	"routes/solar-calculator": {
		id: "routes/solar-calculator",
		parentId: "layouts/main-layout",
		path: "solar-calculator",
		index: void 0,
		caseSensitive: void 0,
		module: solar_calculator_exports
	},
	"routes/client-journey": {
		id: "routes/client-journey",
		parentId: "layouts/main-layout",
		path: "client-journey",
		index: void 0,
		caseSensitive: void 0,
		module: client_journey_exports
	},
	"routes/sitemap-xml": {
		id: "routes/sitemap-xml",
		parentId: "layouts/main-layout",
		path: "sitemap.xml",
		index: void 0,
		caseSensitive: void 0,
		module: sitemap_xml_exports
	},
	"routes/$": {
		id: "routes/$",
		parentId: "layouts/main-layout",
		path: "*",
		index: void 0,
		caseSensitive: void 0,
		module: $_exports
	},
	"routes/admin": {
		id: "routes/admin",
		parentId: "root",
		path: "dev-admin",
		index: void 0,
		caseSensitive: void 0,
		module: admin_exports
	},
	"routes/robots-txt": {
		id: "routes/robots-txt",
		parentId: "root",
		path: "robots.txt",
		index: void 0,
		caseSensitive: void 0,
		module: robots_txt_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
