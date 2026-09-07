/************************
 * swium dev
 * (literally first dev realize, most of the features arent here)
 * | by VAPOR/created by s16dih
 ***********************/

/*
Examples:
const CONFIG = {
	blocked: [
		block a domain
		"example.com",
    subdomains
		"*.example.com",           blocks any subdomain (a.example.com, foo.bar.example.com, etc.)
		"tracker.*.example.com",   blocks tracker.us.example.com, tracker.eu.example.com, etc.
    paths
		"example.com/ads",         blocks only https://example.com/ads
		"example.com/ads/*",       blocks any path under /ads
		"example.com/*.js",        blocks all JS files at root (e.g., /app.js)
		"example.com/assets/*.png",  blocks only PNG files inside /assets
    double wildcards
		"example.com/**",          blocks *all* paths on example.com
    weird cases
		"*.example.com/**.gif",    blocks all .gif files on any subdomain
		"example.com/",            blocks only the main page
		"example.com/*",           blocks one level deep paths
	],
};
when ur done doing it you have to base64d it before putting it there this is for fi*ters
*/
/************************
 * swium dev
 * (literally first dev realize, most of the features arent here)
 * | by VAPOR/created by s16dih
 ***********************/

if (navigator.userAgent.includes("Firefox")) {
	Object.defineProperty(globalThis, "crossOriginIsolated", {
		value: true,
		writable: false,
	});
}

importScripts("./scram/scramjet.all.js");

self.addEventListener("install", () => {
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(self.clients.claim());
});

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

const CONFIG = {
	blocked: [
		"youtube.com/get_video_info?*adformat=*",
		"youtube.com/api/stats/ads/*",
		"youtube.com/pagead/*",
		".facebook.com/ads/*",
		".facebook.com/tr/*",
		".fbcdn.net/ads/*",
		"graph.facebook.com/ads/*",
		"ads-api.twitter.com/*",
		"analytics.twitter.com/*",
		".twitter.com/i/ads/*",
		".ads.yahoo.com",
		".advertising.com",
		".adtechus.com",
		".oath.com",
		".verizonmedia.com",
		".amazon-adsystem.com",
		"aax.amazon-adsystem.com/*",
		"c.amazon-adsystem.com/*",
		".adnxs.com",
		".adnxs-simple.com",
		"ab.adnxs.com/*",
		".rubiconproject.com",
		".magnite.com",
		".pubmatic.com",
		"ads.pubmatic.com/*",
		".criteo.com",
		"bidder.criteo.com/*",
		"static.criteo.net/*",
		".openx.net",
		".openx.com",
		".indexexchange.com",
		".casalemedia.com",
		".adcolony.com",
		".chartboost.com",
		".unityads.unity3d.com",
		".inmobiweb.com",
		".tapjoy.com",
		".applovin.com",
		".vungle.com",
		".ironsrc.com",
		".fyber.com",
		".smaato.net",
		".supersoniads.com",
		".startappservice.com",
		".airpush.com",
		".outbrain.com",
		".taboola.com",
		".revcontent.com",
		".zedo.com",
		".mgid.com",
		"*/ads/*",
		"*/adserver/*",
		"*/adclick/*",
		"*/banner_ads/*",
		"*/sponsored/*",
		"*/promotions/*",
		"*/tracking/ads/*",
		"*/promo/*",
		"*/affiliates/*",
		"*/partnerads/*",
	],
	inject: {
		html: "\x3c!-- pr0x1ed by vapor's static sj --\x3e",
	},
};

/** @type {{ origin: string, html: string, css: string, js: string } | undefined} */
let playgroundData;

/**
 * @param {string} pattern
 * @returns {RegExp}
 */
function toRegex(pattern) {
	const escaped = pattern
		.replace(/[.+?^${}()|[\]\\]/g, "\\$&")
		.replace(/\*\*/g, "{{DOUBLE_STAR}}")
		.replace(/\*/g, "[^/]*")
		.replace(/{{DOUBLE_STAR}}/g, ".*");
	return new RegExp(`^${escaped}$`);
}

/**
 * @param {string} hostname
 * @param {string} pathname
 * @returns {boolean}
 */
function isBlocked(hostname, pathname) {
	return CONFIG.blocked.some((pattern) => {
		if (pattern.startsWith("#")) {
			pattern = pattern.substring(1);
		}
		if (pattern.startsWith("*")) {
			pattern = pattern.substring(1);
		}

		if (pattern.includes("/")) {
			const [hostPattern, ...pathParts] = pattern.split("/");
			const pathPattern = pathParts.join("/");
			const hostRegex = toRegex(hostPattern);
			const pathRegex = toRegex(`/${pathPattern}`);
			return hostRegex.test(hostname) && pathRegex.test(pathname);
		}
		const hostRegex = toRegex(pattern);
		return hostRegex.test(hostname);
	});
}

/**
 * @param {string} html
 * @returns {string}
 */
function inject(html) {
	return html.replace(/<head[^>]*>/i, (match) => `${match}${CONFIG.inject.html}`);
}

// this app's own runtime lives under the same path Scramjet uses as its
// proxy prefix (both are "/scramjet/" by design), so Scramjet's router has
// to be kept from swallowing requests for the app's own files - otherwise
// it tries to decode e.g. "baremux/worker.js" as an encoded proxy target
// and fails. these are the local, non-proxied paths this app actually ships.
const LOCAL_ASSET_PATHS = new Set(["", "index.html", "newtab.html", "embed.html", "config.js", "sw.js", "favicon.ico"]);
const LOCAL_ASSET_DIRS = ["styles/", "scripts/", "scram/", "baremux/", "epoxy/"];

/**
 * @param {URL} url
 * @returns {boolean}
 */
function isLocalAsset(url) {
	const scopePath = new URL(self.registration.scope).pathname;
	if (!url.pathname.startsWith(scopePath)) return false;
	const rel = url.pathname.slice(scopePath.length);
	return LOCAL_ASSET_PATHS.has(rel) || LOCAL_ASSET_DIRS.some((dir) => rel.startsWith(dir));
}

/**
 * fetch() rejects reconstructing a request with mode "navigate" (only the
 * browser's own navigation algorithm may use it), but otherwise dropping the
 * original mode breaks legitimately no-cors cross-origin loads (e.g. an
 * <img> tag pointing at an external favicon service) by forcing them into
 * strict cors mode instead of the opaque load they're supposed to get.
 * @param {URL} url
 * @param {Request} request
 * @returns {Promise<Response>}
 */
function refetch(url, request) {
	const mode = request.mode === "navigate" ? "same-origin" : request.mode;
	return fetch(url.href, { mode, credentials: request.credentials });
}

/**
 * @param {FetchEvent} event
 * @returns {Promise<Response>}
 */
async function handleRequest(event) {
	const url = new URL(event.request.url);
	if (isLocalAsset(url)) {
		return refetch(url, event.request);
	}

	await scramjet.loadConfig();

	if (scramjet.route(event)) {
		let response;
		try {
			response = await scramjet.fetch(event);
		} catch (err) {
			// this is a real cross-origin proxy target, so falling back to a
			// plain fetch() can never work here (it would just fail again on
			// CORS) - report the actual failure instead of masking it.
			console.error("scramjet: failed to proxy request:", event.request.url, err);
			return new Response(`Scramjet failed to proxy this request: ${err.message}`, {
				status: 502,
				headers: { "content-type": "text/plain" },
			});
		}

		const contentType = response.headers.get("content-type") || "";

		if (contentType.includes("text/html")) {
			const originalText = await response.text();
			const modifiedHtml = inject(originalText);
			const encoder = new TextEncoder();
			const byteLength = encoder.encode(modifiedHtml).length;
			const newHeaders = new Headers(response.headers);
			newHeaders.set("content-length", byteLength.toString());

			return new Response(modifiedHtml, {
				status: response.status,
				statusText: response.statusText,
				headers: newHeaders,
			});
		}

		return response;
	}

	return refetch(url, event.request);
}

self.addEventListener("fetch", (event) => {
	event.respondWith(handleRequest(event));
});

self.addEventListener("message", ({ data }) => {
	if (data.type === "playgroundData") {
		playgroundData = data;
	}
});

scramjet.addEventListener("request", (e) => {
	if (isBlocked(e.url.hostname, e.url.pathname)) {
		e.response = new Response("Site Blocked", { status: 403 });
		return;
	}

	if (playgroundData && e.url.href.startsWith(playgroundData.origin)) {
		const routes = {
			"/": { content: playgroundData.html, type: "text/html" },
			"/style.css": { content: playgroundData.css, type: "text/css" },
			"/script.js": { content: playgroundData.js, type: "application/javascript" },
		};

		const route = routes[e.url.pathname];

		if (route) {
			let content = route.content;

			if (route.type === "text/html") {
				content = inject(content);
			}

			const headers = { "content-type": route.type };
			e.response = new Response(content, { headers });
			e.response.rawHeaders = headers;
			e.response.rawResponse = {
				body: e.response.body,
				headers: headers,
				status: e.response.status,
				statusText: e.response.statusText,
			};
			e.response.finalURL = e.url.toString();
		} else {
			e.response = new Response("empty response", { headers: {} });
		}
	}
});