/*! coi-serviceworker v0.1.7 - Guido Zuidhof and contributors, licensed under MIT */
let coepCredentialless = false;
if (typeof window === 'undefined') {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

    self.addEventListener("message", (ev) => {
        if (!ev.data) {
            return;
        } else if (ev.data.type === "deregister") {
            self.registration
                .unregister()
                .then(() => {
                    return self.clients.matchAll();
                })
                .then(clients => {
                    clients.forEach((client) => client.navigate(client.url));
                });
        } else if (ev.data.type === "coepCredentialless") {
            coepCredentialless = ev.data.value;
        }
    });

    self.addEventListener("fetch", function (event) {
        const r = event.request;
        if (r.cache === "only-if-cached" && r.mode !== "same-origin") {
            return;
        }

        const request = (coepCredentialless && r.mode === "no-cors")
            ? new Request(r, {
                credentials: "omit",
            })
            : r;
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.status === 0) {
                        return response;
                    }

                    const newHeaders = new Headers(response.headers);
                    newHeaders.set("Document-Isolation-Policy", "isolate-and-require-corp");
                    newHeaders.set("Cross-Origin-Embedder-Policy",
                        coepCredentialless ? "credentialless" : "require-corp"
                    );
                    if (!coepCredentialless) {
                        newHeaders.set("Cross-Origin-Resource-Policy", "cross-origin");
                    }
                    newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders,
                    });
                })
                .catch((e) => {
                    console.error(e);
                    return Response.error();
                })
        );
    });

} else {
    // Minecraft owns its startup. Never navigate or reload the containing site.
    const workerURL = new URL(document.currentScript.src);
    workerURL.searchParams.set('frame-isolation', '1');
    const retryKey = 'minecraft-frame-isolation:' + location.href;

    window.minecraftIsolationReady = (async () => {
        if (!window.isSecureContext || !navigator.serviceWorker) {
            throw new Error('This game needs HTTPS or localhost.');
        }

        // Remove only the experimental homepage worker from the earlier attempt.
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
            const worker = registration.active || registration.waiting || registration.installing;
            if (worker && new URL(worker.scriptURL).pathname.endsWith('/nexus-game-serviceworker.js')) {
                await registration.unregister();
            }
        }

        if (window.crossOriginIsolated) {
            sessionStorage.removeItem(retryKey);
            return true;
        }
        if (sessionStorage.getItem(retryKey)) {
            throw new Error('Minecraft could not enable its threads. Use an updated Chrome or Edge browser.');
        }

        const registration = await navigator.serviceWorker.register(workerURL.href, { updateViaCache: 'none' });
        await registration.update();
        const worker = registration.installing || registration.waiting || registration.active;
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => finish(new Error('Minecraft startup timed out.')), 15000);
            function finish(error) {
                clearTimeout(timeout);
                worker?.removeEventListener('statechange', check);
                navigator.serviceWorker.removeEventListener('controllerchange', check);
                error ? reject(error) : resolve();
            }
            function check() {
                if (!worker || worker.state === 'redundant') {
                    finish(new Error('Minecraft startup worker failed.'));
                } else if (worker.state === 'activated'
                        && navigator.serviceWorker.controller?.scriptURL === worker.scriptURL) {
                    finish();
                }
            }
            worker?.addEventListener('statechange', check);
            navigator.serviceWorker.addEventListener('controllerchange', check);
            check();
        });
        sessionStorage.setItem(retryKey, '1');
        window.location.reload();
        return false;
    })();
}
