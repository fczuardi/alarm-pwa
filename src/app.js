// @flow
const browserIsCompatible = require("./checkFeatures");

const SW_URL = `./sw.js`;

// Notification.requestPermission().then(function(permission) { ... });

const canBeNotified = () => {
  return window.Notification.permission === "granted";
};

const onLoad = () => {
  if (!browserIsCompatible()) {
    throw new Error("incompatible browser");
  }
  navigator.serviceWorker.register(SW_URL).then(
    registration => {
      // Registration was successful
      console.log(
        "ServiceWorker registration successful with scope: ",
        registration.scope
      );
    },
    err => {
      // registration failed :(
      console.log("ServiceWorker registration failed: ", err);
    }
  );
};
window.addEventListener("load", onLoad);
