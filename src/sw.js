// @flow
const CACHE_NAME = "v6";

const urlsToCache = ["index.html", "vendors.js", "app.js", "sw.js"];

const onInstall = event => {
    console.log({ event });
    console.log(CACHE_NAME);
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(cache => {
                console.log("Opened cache");
                return cache.addAll(urlsToCache).then(c => console.log({ c }));
            })
            .catch(e => console.error({ e }))
    );
};

const onFetch = event => {
    console.log({ event });
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
};

const onActivate = event => {
    console.log({ event });
    //remove previous caches
    caches
        .keys()
        .then(names =>
            Promise.all(
                names.map(
                    name =>
                        name !== CACHE_NAME
                            ? caches.delete(name)
                            : Promise.resolve()
                )
            )
        );
};

self.addEventListener("install", onInstall);
self.addEventListener("fetch", onFetch);
self.addEventListener("activate", onActivate);

self.addEventListener("notificationclose", event => {
    console.log("notificationclose", event);
});
self.addEventListener("notificationclick", event => {
    console.log("notificationclick", event);
});

self.addEventListener("push", event => {
    console.log("push", event);
    var options = {
        body: "This notification was generated from a push!",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: "2"
        },
        actions: [
            { action: "explore", title: "Explore this new world" },
            { action: "close", title: "Close" }
        ]
    };
    event.waitUntil(
        self.registration.showNotification("Hello world!", options)
    );
});
