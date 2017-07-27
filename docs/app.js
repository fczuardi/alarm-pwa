(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//      
var browserIsCompatible = require("./checkFeatures");

var SW_URL = "./sw.js";

// Notification.requestPermission().then(function(permission) { ... });

var canBeNotified = function () {
  return window.Notification.permission === "granted";
};

var onLoad = function () {
  if (!browserIsCompatible()) {
    throw new Error("incompatible browser");
  }
  navigator.serviceWorker.register(SW_URL).then(function (registration) {
    // Registration was successful
    console.log("ServiceWorker registration successful with scope: ", registration.scope);
  }, function (err) {
    // registration failed :(
    console.log("ServiceWorker registration failed: ", err);
  });
};
window.addEventListener("load", onLoad);
},{"./checkFeatures":2}],2:[function(require,module,exports){
//      
module.exports = function () {
  console.assert(window.Notification, "Your browser don't support notifications");
  if (window.Notification === undefined) {
    return false;
  }

  console.assert(navigator.serviceWorker, "Your browser don't support service workers");
  if (navigator.serviceWorker === undefined) {
    return false;
  }

  return true;
};
},{}]},{},[1]);
