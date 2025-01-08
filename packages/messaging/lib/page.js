import {
  __async,
  __objRest,
  __spreadProps,
  __spreadValues,
  defineGenericMessanging
} from "./chunk-BQLFSFFZ.js";

// src/window.ts
import { uid } from "uid";
var REQUEST_TYPE = "@webext-core/messaging/window";
var RESPONSE_TYPE = "@webext-core/messaging/window/response";
function defineWindowMessaging(config) {
  const namespace = config.namespace;
  const instanceId = uid();
  let removeAdditionalListeners = [];
  const sendWindowMessage = (message, targetOrigin) => new Promise((res) => {
    const responseListener = (event) => {
      if (event.data.type === RESPONSE_TYPE && event.data.namespace === namespace && event.data.instanceId !== instanceId && event.data.message.type === message.type) {
        res(event.data.response);
        removeResponseListener();
      }
    };
    const removeResponseListener = () => window.removeEventListener("message", responseListener);
    removeAdditionalListeners.push(removeResponseListener);
    window.addEventListener("message", responseListener);
    window.postMessage(
      { type: REQUEST_TYPE, message, senderOrigin: location.origin, namespace, instanceId },
      targetOrigin != null ? targetOrigin : "*"
    );
  });
  const messenger = defineGenericMessanging(__spreadProps(__spreadValues({}, config), {
    sendMessage(message, targetOrigin) {
      return sendWindowMessage(message, targetOrigin);
    },
    addRootListener(processMessage) {
      const listener = (event) => __async(this, null, function* () {
        if (event.data.type !== REQUEST_TYPE || event.data.namespace !== namespace || event.data.instanceId === instanceId)
          return;
        const response = yield processMessage(event.data.message);
        window.postMessage(
          { type: RESPONSE_TYPE, response, instanceId, message: event.data.message, namespace },
          event.data.senderOrigin
        );
      });
      window.addEventListener("message", listener);
      return () => window.removeEventListener("message", listener);
    },
    verifyMessageData(data) {
      return structuredClone(data);
    }
  }));
  return __spreadProps(__spreadValues({}, messenger), {
    removeAllListeners() {
      messenger.removeAllListeners();
      removeAdditionalListeners.forEach((removeListener) => removeListener());
      removeAdditionalListeners = [];
    }
  });
}

// src/custom-event.ts
import { uid as uid2 } from "uid";

// src/utils.ts
function prepareCustomEventDict(data, options = { targetScope: window != null ? window : void 0 }) {
  return typeof cloneInto !== "undefined" ? cloneInto(data, options.targetScope) : data;
}

// src/custom-event.ts
var REQUEST_EVENT = "@webext-core/messaging/custom-events";
var RESPONSE_EVENT = "@webext-core/messaging/custom-events/response";
function defineCustomEventMessaging(config) {
  const namespace = config.namespace;
  const instanceId = uid2();
  const removeAdditionalListeners = [];
  const sendCustomMessage = (requestEvent) => new Promise((res) => {
    const responseListener = (e) => {
      const { detail } = e;
      if (detail.namespace === namespace && detail.instanceId !== instanceId && detail.message.type === requestEvent.detail.message.type) {
        res(detail.response);
      }
    };
    removeAdditionalListeners.push(
      () => window.removeEventListener(RESPONSE_EVENT, responseListener)
    );
    window.addEventListener(RESPONSE_EVENT, responseListener);
    window.dispatchEvent(requestEvent);
  });
  const messenger = defineGenericMessanging(__spreadProps(__spreadValues({}, config), {
    sendMessage(message) {
      const reqDetail = { message, namespace, instanceId };
      const requestEvent = new CustomEvent(REQUEST_EVENT, {
        detail: prepareCustomEventDict(reqDetail)
      });
      return sendCustomMessage(requestEvent);
    },
    addRootListener(processMessage) {
      const requestListener = (e) => __async(this, null, function* () {
        const _a = e, { detail } = _a, event = __objRest(_a, ["detail"]);
        if (detail.namespace !== namespace || detail.instanceId === instanceId)
          return;
        const message = __spreadProps(__spreadValues({}, detail.message), { event });
        const response = yield processMessage(message);
        const resDetail = { response, message, instanceId, namespace };
        const responseEvent = new CustomEvent(RESPONSE_EVENT, {
          detail: prepareCustomEventDict(resDetail)
        });
        window.dispatchEvent(responseEvent);
      });
      window.addEventListener(REQUEST_EVENT, requestListener);
      return () => window.removeEventListener(REQUEST_EVENT, requestListener);
    },
    verifyMessageData(data) {
      return structuredClone(data);
    }
  }));
  return __spreadProps(__spreadValues({}, messenger), {
    removeAllListeners() {
      messenger.removeAllListeners();
      removeAdditionalListeners.forEach((removeListener) => removeListener());
    }
  });
}
export {
  defineCustomEventMessaging,
  defineWindowMessaging
};
