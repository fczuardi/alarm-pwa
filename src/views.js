// @flow
const config = require("../config.toml");
const html = require("choo/html");

type ChooView = (Object, Function) => any;

const setupView: ChooView = (state, emit) => {
  const notificationPrompt = () => {
    return window.Notification.requestPermission().then(permission => {
      console.log({ permission });
      emit("render");
    });
  };
  return html`
<div>
    <h2>Setup</h2>
    <p>Please allow notifications from this app.</p>
    <button onclick=${notificationPrompt} >
        Continue
    </button>
</div>
`;
};

const alarmView: ChooView = (state, emit) => {
  const requestAlarm = () => {
    window.setTimeout(
      state => {
        // const audio = new Audio(config.alarmSound);
        // audio.play();
        state.registration.showNotification("Hi there", {
          // requireInteraction: true,
          body: "Can you answer?",
          vibrate: [200, 100, 200, 100, 200, 100, 500],
          sound: config.alarmSound
        });
      },
      3000,
      state
    );
  };
  return html`
<div>
    <h2>Alarm</h2>
    <button onclick=${requestAlarm}>
        Wake me up in 3 seconds
    </button>
</div>
`;
};

const blockedView: ChooView = (state, emit) => {
  return html`
        <div>
        Please change the notifications permissions and refresh this page.
        </div>
    `;
};
const mainView: ChooView = (state, emit) => {
  if (state.registration === null) {
    return html`
        <div>
            Loading...
        </div>`;
  }
  switch (window.Notification.permission) {
    case "granted":
      return alarmView(state, emit);
    case "denied":
      return blockedView(state, emit);
    case "default":
      return setupView(state, emit);
    default:
      return html`<div>Error unexpected Notification.permission value</div>`;
  }
};

module.exports = {
  setupView,
  alarmView,
  blockedView,
  mainView
};
