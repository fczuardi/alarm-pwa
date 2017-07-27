// @flow
const html = require("choo/html");
const choo = require("choo");
const log = require('choo-log')

const browserIsCompatible = require("./checkFeatures");
const { setupView, alarmView, blockedView, mainView } = require("./views");
const SW_URL = `./sw.js`;

const alarmStore = (state, emitter) => {
  state.registration = null;
  emitter.on("sw:registered", registration => {
    state.registration = registration;
    emitter.emit("render");
    emitter.emit('log:info', `ServiceWorker registration successful with scope: ${registration.scope}`);
  });
};

const registerWorker = (state, emitter) => {
  if (!browserIsCompatible()) {
    throw new Error("incompatible browser");
  }
  navigator.serviceWorker.register(SW_URL).then(
    registration => {
      // Registration was successful
      emitter.emit("sw:registered", registration);
    },
    err => {
      // registration failed :(
      emitter.emit('log:error', `ServiceWorker registration failed: ${err}`);
      alert("ServiceWorker registration failed");
    }
  );
};

const app = choo();
app.use(log());
app.use(alarmStore);
app.use(registerWorker);
app.route("/", mainView);
app.route("/alarm-pwa", mainView);
document.body.appendChild(html`<div id="main"></div>`);
app.mount("#main");
