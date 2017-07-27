// @flow
const html = require("choo/html");

const setupView = (state, emit) => {
  const notificationPrompt = () => {
    return Notification.requestPermission().then(permission => {
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

const alarmView = (state, emit) => {
  const requestAlarm = () => {
    window.setTimeout(
      state => {
        state.registration.showNotification("Hi there", {});
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

const blockedView = (state, emit) => {
  return html`
        <div>
        Please change the notifications permissions and refresh this page.
        </div>
    `;
};
const mainView = (state, emit) => {
  if (state.registration === null) {
    return html`
        <div>
            Loading...
        </div>`;
  }
  switch (Notification.permission) {
    case "granted":
      return alarmView(state, emit);
    case "denied":
      return blockedView(state.emit);
    default:
      return setupView(state, emit);
  }
};

module.exports = {
  setupView,
  alarmView,
  blockedView,
  mainView
};
