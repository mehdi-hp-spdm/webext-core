import {
  __spreadProps,
  __spreadValues,
  defineGenericMessanging
} from "./chunk-BQLFSFFZ.js";

// src/extension.ts
import Browser from "webextension-polyfill";
function defineExtensionMessaging(config) {
  return defineGenericMessanging(__spreadProps(__spreadValues({}, config), {
    sendMessage(message, arg) {
      if (arg == null) {
        return Browser.runtime.sendMessage(message);
      }
      const options = typeof arg === "number" ? { tabId: arg } : arg;
      if (typeof options.tabId !== "number") {
        throw new Error("tabId is required when sending a message to a tab");
      }
      return Browser.tabs.sendMessage(
        options.tabId,
        message,
        // Pass frameId if specified
        options.frameId != null ? { frameId: options.frameId } : void 0
      );
    },
    addRootListener(processMessage) {
      const listener = (message, sender) => {
        if (typeof message === "object")
          return processMessage(__spreadProps(__spreadValues({}, message), { sender }));
        else
          return processMessage(message);
      };
      Browser.runtime.onMessage.addListener(listener);
      return () => Browser.runtime.onMessage.removeListener(listener);
    }
  }));
}
export {
  defineExtensionMessaging
};
