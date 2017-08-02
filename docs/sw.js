(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//      
var CACHE_NAME = "v9 ";

var urlsToCache = ["index.html", "vendors.js", "app.js", "sw.js"];

var onInstall = function (event) {
    console.log({ event: event });
    console.log(CACHE_NAME);
    event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
        console.log("Opened cache");
        return cache.addAll(urlsToCache).then(function (c) {
            return console.log({ c: c });
        });
    }).catch(function (e) {
        return console.error({ e: e });
    }));
};

var onFetch = function (event) {
    console.log({ event: event });
    console.log(event.request.url);
    event.respondWith(caches.match(event.request).then(function (response) {
        if (response) {
            return response;
        }
        return fetch(event.request);
    }));
};

var onActivate = function (event) {
    console.log({ event: event });
    //remove previous caches
    caches.keys().then(function (names) {
        return Promise.all(names.map(function (name) {
            return name !== CACHE_NAME ? caches.delete(name) : Promise.resolve();
        }));
    });
};

self.addEventListener("install", onInstall);
self.addEventListener("fetch", onFetch);
self.addEventListener("activate", onActivate);

self.addEventListener("notificationclose", function (event) {
    console.log("notificationclose", event);
});
self.addEventListener("notificationclick", function (event) {
    console.log("notificationclick", event);
});

self.addEventListener("push", function (event) {
    console.log("push", event);
    clients.openWindow("https://fczuardi.github.io/alarm-pwa");
    var options = {
        body: "This notification was generated from a push!",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: "2"
        },
        actions: [{ action: "explore", title: "Explore this new world" }, { action: "close", title: "Close" }]
    };
    event.waitUntil(self.registration.showNotification("Hello world!", options));
});
},{}]},{},[1]);
