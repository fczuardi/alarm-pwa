// @flow
const html = require("choo/html");
const choo = require("choo");

const browserIsCompatible = require("./checkFeatures");
const { setupView, alarmView, blockedView, mainView } = require("./views");
const SW_URL = `./sw.js`;

const alarmStore = (state, emitter) => {
  state.registration = null;
  emitter.on("sw:registered", registration => {
    state.registration = registration;
    console.log(
      "ServiceWorker registration successful with scope: ",
      registration.scope
    );
    emitter.emit("render");
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
      console.log("ServiceWorker registration failed: ", err);
      alert("ServiceWorker registration failed: ", err);
    }
  );
};

const app = choo();
app.use(alarmStore);
app.use(registerWorker);
app.route("/", mainView);
document.body.appendChild(html`<div id="main"></div>`);
app.mount("#main");
