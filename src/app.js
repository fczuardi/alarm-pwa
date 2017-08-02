// @flow
const config = require("../config.toml");
const choo = require("choo");
const html = require("choo/html");
const log = require("choo-log");

const { setupView, alarmView, blockedView, mainView } = require("./views");
const SW_URL = `./sw.js`;

const alarmStore = (state, emitter) => {
    state.notificationPermission = window.Notification.permission;
    state.registration = null;
    emitter.on("sw:registered", registration => {
        state.registration = registration;
        emitter.emit("render");
    });
    emitter.on("notification:update", permission => {
        state.notificationPermission = permission;
        emitter.emit("render");
    });
    emitter.on("subscription:available", subscription => {
        state.subscription = subscription;
        emitter.emit("render");
    });
};

const registerWorker = (state, emitter) => {
    if (!navigator.serviceWorker) {
        return emitter.emit(
            "log:error",
            "You need a browser with service worker support"
        );
    }
    navigator.serviceWorker.register(SW_URL).then(
        registration => {
            emitter.emit(
                "log:info",
                `ServiceWorker registration successful with scope: ${registration.scope}`
            );
            emitter.emit("sw:registered", registration);
        },
        err => {
            emitter.emit(
                "log:error",
                `ServiceWorker registration failed: ${err}`
            );
            alert("ServiceWorker registration failed");
        }
    );
};

const app = choo();
app.use(log());
app.use(alarmStore);
app.use(registerWorker);
app.route("/", mainView);
app.route("/index.html", mainView);
app.route("/alarm-pwa", mainView);
app.route("/alarm-pwa/index.html", mainView);
app.mount("#main");

if (document.body) {
    document.body.appendChild(html`<div id="main"></div>`);
} else {
    console.error("document.body is not here", document.body);
}
