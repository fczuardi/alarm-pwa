// @flow
const config = require("./config");
const html = require("choo/html");

type ChooView = (Object, Function) => any;

const setupView: ChooView = (state, emit) => {
    const notificationPrompt = () => {
        return window.Notification.requestPermission().then(permission => {
            emit(
                "notification:update",
                permission === "granted" ? permission : "denied"
            );
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
    console.log({ config });
    let curlLine = "";
    if (!state.subscription) {
        state.registration.pushManager
            .getSubscription()
            .then(subscription => {
                console.log({ subscription });
                if (subscription) {
                    return subscription;
                }
                if (!state.registration.pushManager) {
                    emit("log:error", "pushManager not there");
                    return Promise.reject();
                }
                const subscriptionPromise = state.registration.pushManager.subscribe(
                    { userVisibleOnly: true }
                );
                console.log({ subscriptionPromise });
                return subscriptionPromise;
            })
            .then(subscription => {
                emit(
                    "log:info",
                    `Got a susbscription ${JSON.stringify(subscription)}`
                );
                emit("subscription:available", subscription);
            })
            .catch(err => emit("log:error", err.message));
    } else {
        console.log(state.subscription.endpoint);
        curlLine = `
curl "${state.subscription.endpoint}" \
  --request POST --header "TTL: 60" --header "Content-Length: 0" \
  --header "Authorization: key=${config.app.gcmServerKey}"
`;
    }
    return html`
<div>
    <h2>Alarm</h2>
    <p>Use the following curl line to sound the alarm</p>
    <pre>${curlLine}</pre>
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
    switch (state.notificationPermission) {
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
