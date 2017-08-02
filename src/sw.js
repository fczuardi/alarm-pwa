// @flow
const CACHE_NAME = "v12";

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
    event.notification.close();
    if (clients.openWindow) {
        event.waitUntil(clients.openWindow(self.clickTarget));
    }
});

self.addEventListener("push", event => {
    console.log("push event");
    let body = "";
    if (event.data) {
        body = event.data.text();
    } else {
        body = "Push message no payload";
    }
    var options = {
        body,
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
