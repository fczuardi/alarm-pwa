// @flow
module.exports = () => {
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
