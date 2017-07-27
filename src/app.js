// @flow
const SW_URL = `./sw.js`;

// Notification.requestPermission().then(function(permission) { ... });

const browserIsCompatible = () => {
  console.assert(
    window.Notification,
    `Your browser don't support notifications`
  );
  if (window.Notification === undefined) {
    return false;
  }
  console.assert(
    navigator.serviceWorker,
    `Your browser don't support service workers`
  );
  if (navigator.serviceWorker === undefined) {
    return false;
  }
  return true;
};

const canBeNotified = () => {
  return window.Notification.permission === "granted";
};

const onLoad = () => {
  if (!browserIsCompatible()) {
    throw new Error("imcompatible browser");
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
