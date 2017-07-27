(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var _templateObject = _taggedTemplateLiteral(["<div id=\"main\"></div>"], ["<div id=\"main\"></div>"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

//      
var html = require("choo/html");
var choo = require("choo");
var log = require("choo-log");

var _require = require("./views"),
    setupView = _require.setupView,
    alarmView = _require.alarmView,
    blockedView = _require.blockedView,
    mainView = _require.mainView;

var SW_URL = "./sw.js";

var alarmStore = function (state, emitter) {
  state.registration = null;
  emitter.on("sw:registered", function (registration) {
    state.registration = registration;
    emitter.emit("render");
    emitter.emit("log:info", "ServiceWorker registration successful with scope: " + registration.scope);
  });
};

var registerWorker = function (state, emitter) {
  if (!navigator.serviceWorker) {
    return emitter.emit("log:error", "You need a browser with service worker support");
  }
  navigator.serviceWorker.register(SW_URL).then(function (registration) {
    // Registration was successful
    emitter.emit("sw:registered", registration);
  }, function (err) {
    // registration failed :(
    emitter.emit("log:error", "ServiceWorker registration failed: " + err);
    alert("ServiceWorker registration failed");
  });
};

var app = choo();
app.use(log());
app.use(alarmStore);
app.use(registerWorker);
app.route("/", mainView);
app.route("/alarm-pwa", mainView);
app.mount("#main");

if (document.body) {
  document.body.appendChild(html(_templateObject));
} else {
  console.error("document.body is not here", document.body);
}
},{"./views":2,"choo":undefined,"choo-log":undefined,"choo/html":undefined}],2:[function(require,module,exports){
var _templateObject = _taggedTemplateLiteral(["\n<div>\n    <h2>Setup</h2>\n    <p>Please allow notifications from this app.</p>\n    <button onclick=", " >\n        Continue\n    </button>\n</div>\n"], ["\n<div>\n    <h2>Setup</h2>\n    <p>Please allow notifications from this app.</p>\n    <button onclick=", " >\n        Continue\n    </button>\n</div>\n"]),
    _templateObject2 = _taggedTemplateLiteral(["\n<div>\n    <h2>Alarm</h2>\n    <button onclick=", ">\n        Wake me up in 3 seconds\n    </button>\n</div>\n"], ["\n<div>\n    <h2>Alarm</h2>\n    <button onclick=", ">\n        Wake me up in 3 seconds\n    </button>\n</div>\n"]),
    _templateObject3 = _taggedTemplateLiteral(["\n        <div>\n        Please change the notifications permissions and refresh this page.\n        </div>\n    "], ["\n        <div>\n        Please change the notifications permissions and refresh this page.\n        </div>\n    "]),
    _templateObject4 = _taggedTemplateLiteral(["\n        <div>\n            Loading...\n        </div>"], ["\n        <div>\n            Loading...\n        </div>"]),
    _templateObject5 = _taggedTemplateLiteral(["<div>Error unexpected Notification.permission value</div>"], ["<div>Error unexpected Notification.permission value</div>"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

//      
var html = require("choo/html");

var setupView = function (state, emit) {
  var notificationPrompt = function () {
    return window.Notification.requestPermission().then(function (permission) {
      console.log({ permission: permission });
      emit("render");
    });
  };
  return html(_templateObject, notificationPrompt);
};

var alarmView = function (state, emit) {
  var requestAlarm = function () {
    window.setTimeout(function (state) {
      state.registration.showNotification("Hi there", {});
    }, 3000, state);
  };
  return html(_templateObject2, requestAlarm);
};

var blockedView = function (state, emit) {
  return html(_templateObject3);
};
var mainView = function (state, emit) {
  if (state.registration === null) {
    return html(_templateObject4);
  }
  switch (window.Notification.permission) {
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
},{"choo/html":undefined}]},{},[1]);
