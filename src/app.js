// @flow
const SW_URL = `./sw.js`;

// Notification.requestPermission().then(function(permission) { ... });

const canBeNotified = () => {
  console.assert(
    window.Notification,
    `Your browser don't support notifications`
  );
  if (window.Notification === undefined) {
    return false;
  }
  return window.Notification.permission === "granted";
};

console.log(canBeNotified());

const registerWorker = url => {
  console.assert(
    navigator.serviceWorker !== undefined,
    `Browser don't support service worker`
  );
  if (navigator.serviceWorker === undefined) {
    return false;
  }
  return navigator.serviceWorker.register(url);
};

const onLoad = () => {
  registerWorker(SW_URL).then(
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
