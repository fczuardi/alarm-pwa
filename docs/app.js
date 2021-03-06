(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = { "app": { "name": "Your App's Long Name", "shortName": "Your App's Name", "themeColor": "#FFFFFF" }, "webPush": { "pubKey": "BL8EV9JBpANTUBuo2ybx5cEf2uJRPpuHLprnNl1SyFVyMBIhm8sRZWfSTA6ny20lTbQdJVChNe0aXQLvkTnWeIk", "privKey": "xrJ4unQQoTPYDGzdg8f0fqaFFYGoESBa4FngLGiaTR4", "subject": "mailto: fabricio@fabricio.org" } };
},{}],2:[function(require,module,exports){
var _templateObject = _taggedTemplateLiteral(["<div id=\"main\"></div>"], ["<div id=\"main\"></div>"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

//      
var config = require("./config");
var choo = require("choo");
var html = require("choo/html");
var log = require("choo-log");

var _require = require("./views"),
    setupView = _require.setupView,
    alarmView = _require.alarmView,
    blockedView = _require.blockedView,
    mainView = _require.mainView;

var SW_URL = "./sw.js";

var alarmStore = function (state, emitter) {
    state.notificationPermission = window.Notification.permission;
    state.registration = null;
    emitter.on("sw:registered", function (registration) {
        state.registration = registration;
        emitter.emit("render");
    });
    emitter.on("notification:update", function (permission) {
        state.notificationPermission = permission;
        emitter.emit("render");
    });
    emitter.on("subscription:available", function (subscription) {
        state.subscription = subscription;
        emitter.emit("render");
    });
};

var registerWorker = function (state, emitter) {
    if (!navigator.serviceWorker) {
        return emitter.emit("log:error", "You need a browser with service worker support");
    }
    navigator.serviceWorker.register(SW_URL).then(function (registration) {
        emitter.emit("log:info", "ServiceWorker registration successful with scope: " + registration.scope);
        emitter.emit("sw:registered", registration);
    }, function (err) {
        emitter.emit("log:error", "ServiceWorker registration failed: " + err);
        alert("ServiceWorker registration failed");
    });
};

var app = choo();
app.use(log());
app.use(alarmStore);
app.use(registerWorker);
app.route("/", mainView);
app.route("/index.html", mainView);
app.route("/alarm-pwa", mainView);
app.route("/alarm-pwa/index.html", mainView);
app.mount("#main");

if (document.body) {
    document.body.appendChild(html(_templateObject));
} else {
    console.error("document.body is not here", document.body);
}
},{"./config":3,"./views":5,"choo":undefined,"choo-log":undefined,"choo/html":undefined}],3:[function(require,module,exports){
var config = require("../config.toml");
module.exports = config;
},{"../config.toml":1}],4:[function(require,module,exports){
// from https://github.com/web-push-libs/web-push
function urlBase64ToUint8Array(base64String) {
    var padding = "=".repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
module.exports = urlBase64ToUint8Array;
},{}],5:[function(require,module,exports){
var _templateObject = _taggedTemplateLiteral(["\n<div>\n    <h2>Setup</h2>\n    <p>Please allow notifications from this app.</p>\n    <button onclick=", " >\n        Continue\n    </button>\n</div>\n"], ["\n<div>\n    <h2>Setup</h2>\n    <p>Please allow notifications from this app.</p>\n    <button onclick=", " >\n        Continue\n    </button>\n</div>\n"]),
    _templateObject2 = _taggedTemplateLiteral(["\n<div>\n    <h2>Alarm</h2>\n    <p>Use the following curl line to sound the alarm</p>\n    <pre>", "</pre>\n</div>\n"], ["\n<div>\n    <h2>Alarm</h2>\n    <p>Use the following curl line to sound the alarm</p>\n    <pre>", "</pre>\n</div>\n"]),
    _templateObject3 = _taggedTemplateLiteral(["\n        <div>\n        Please change the notifications permissions and refresh this page.\n        </div>\n    "], ["\n        <div>\n        Please change the notifications permissions and refresh this page.\n        </div>\n    "]),
    _templateObject4 = _taggedTemplateLiteral(["\n        <div>\n            Loading...\n        </div>"], ["\n        <div>\n            Loading...\n        </div>"]),
    _templateObject5 = _taggedTemplateLiteral(["<div>Error unexpected Notification.permission value</div>"], ["<div>Error unexpected Notification.permission value</div>"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

//      
var config = require("./config");
var html = require("choo/html");
var toUint8Array = require('./urlBase64ToUint8Array');

var setupView = function (state, emit) {
    var notificationPrompt = function () {
        return window.Notification.requestPermission().then(function (permission) {
            emit("notification:update", permission === "granted" ? permission : "denied");
        });
    };
    return html(_templateObject, notificationPrompt);
};

var alarmView = function (state, emit) {
    var webPushLine = "";
    if (!state.subscription) {
        state.registration.pushManager.getSubscription().then(function (subscription) {
            if (subscription) {
                return subscription;
            }
            if (!state.registration.pushManager) {
                emit("log:error", "pushManager not there");
                return Promise.reject();
            }
            emit('log:info', config.webPush.pubKey);
            var publicKey = toUint8Array(config.webPush.pubKey);
            var subscriptionPromise = state.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: publicKey
            });
            return subscriptionPromise;
        }).then(function (subscription) {
            emit("log:info", "Got a susbscription " + JSON.stringify(subscription));
            emit("subscription:available", subscription);
        }).catch(function (err) {
            return emit("log:error", err.message);
        });
    } else {
        var key = state.subscription.getKey('p256dh');
        var auth = state.subscription.getKey('auth');
        var encodedKey = btoa(String.fromCharCode.apply(null, new Uint8Array(key)));
        var encodedAuth = btoa(String.fromCharCode.apply(null, new Uint8Array(auth)));
        webPushLine = "\nweb-push send-notification \\\n--payload \"My payload\" \\\n--endpoint \"" + state.subscription.endpoint + "\" \\\n--key \"" + encodedKey + "\" \\\n--auth \"" + encodedAuth + "\" \\\n--vapid-subject \"" + config.webPush.subject + "\" \\\n--vapid-pubkey \"" + config.webPush.pubKey + "\" \\\n--vapid-pvtkey ";
    }
    return html(_templateObject2, webPushLine);
};

var blockedView = function (state, emit) {
    return html(_templateObject3);
};
var mainView = function (state, emit) {
    if (state.registration === null) {
        return html(_templateObject4);
    }
    switch (state.notificationPermission) {
        case "granted":
            return alarmView(state, emit);
        case "denied":
            return blockedView(state, emit);
        case "default":
            return setupView(state, emit);
        default:
            return html(_templateObject5);
    }
};

module.exports = {
    setupView: setupView,
    alarmView: alarmView,
    blockedView: blockedView,
    mainView: mainView
};
},{"./config":3,"./urlBase64ToUint8Array":4,"choo/html":undefined}]},{},[2]);
