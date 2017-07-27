// @flow

const onInstall = event => {
  console.log({ event });
};

const onFetch = event => {
  console.log({ event });
  console.log(event.request.url);
};

const onActivate = event => {
  console.log({ event });
};
self.addEventListener("install", onInstall);
self.addEventListener("fetch", onFetch);
self.addEventListener("activate", onActivate);
