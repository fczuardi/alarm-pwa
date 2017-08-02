// @flow
const config = require("./config");
const html = require("choo/html");
const toUint8Array = require("./urlBase64ToUint8Array");

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
    let webPushLine = "";
    if (!state.subscription) {
        state.registration.pushManager
            .getSubscription()
            .then(subscription => {
                if (subscription) {
                    return subscription;
                }
                if (!state.registration.pushManager) {
                    emit("log:error", "pushManager not there");
                    return Promise.reject();
                }
                emit("log:info", config.webPush.pubKey);
                const publicKey = toUint8Array(config.webPush.pubKey);
                const subscriptionPromise = state.registration.pushManager.subscribe(
                    {
                        userVisibleOnly: true,
                        applicationServerKey: publicKey
                    }
                );
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
        const key = state.subscription.getKey("p256dh");
        const auth = state.subscription.getKey("auth");
        const encodedKey = btoa(
            String.fromCharCode.apply(null, new Uint8Array(key))
        );
        const encodedAuth = btoa(
            String.fromCharCode.apply(null, new Uint8Array(auth))
        );
        webPushLine = `
web-push send-notification \\
--payload "My payload" \\
--endpoint "${state.subscription.endpoint}" \\
--key "${encodedKey}" \\
--auth "${encodedAuth}" \\
--vapid-subject "${config.webPush.subject}" \\
--vapid-pubkey "${config.webPush.pubKey}" \\
--vapid-pvtkey `;
    }
    return html`
<div>
    <h2>Alarm</h2>
    <p>Use the following curl line to sound the alarm</p>
    <pre>${webPushLine}</pre>
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
