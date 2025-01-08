"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  defineExtensionMessaging: () => defineExtensionMessaging
});
module.exports = __toCommonJS(src_exports);

// src/extension.ts
var import_webextension_polyfill = __toESM(require("webextension-polyfill"), 1);

// src/generic.ts
var import_serialize_error = require("serialize-error");
function defineGenericMessanging(config) {
  let removeRootListener;
  let perTypeListeners = {};
  function cleanupRootListener() {
    if (Object.entries(perTypeListeners).length === 0) {
      removeRootListener == null ? void 0 : removeRootListener();
      removeRootListener = void 0;
    }
  }
  let idSeq = Math.floor(Math.random() * 1e4);
  function getNextId() {
    return idSeq++;
  }
  return {
    sendMessage(type, data, ...args) {
      return __async(this, null, function* () {
        var _a2, _b, _c, _d;
        const _message = {
          id: getNextId(),
          type,
          data,
          timestamp: Date.now()
        };
        const message = (_b = yield (_a2 = config.verifyMessageData) == null ? void 0 : _a2.call(config, _message)) != null ? _b : _message;
        (_c = config.logger) == null ? void 0 : _c.debug(`[messaging] sendMessage {id=${message.id}} \u2500\u1405`, message, ...args);
        const response = yield config.sendMessage(message, ...args);
        const { res, err } = response != null ? response : { err: new Error("No response") };
        (_d = config.logger) == null ? void 0 : _d.debug(`[messaging] sendMessage {id=${message.id}} \u140A\u2500`, { res, err });
        if (err != null)
          throw (0, import_serialize_error.deserializeError)(err);
        return res;
      });
    },
    onMessage(type, onReceived) {
      var _a2, _b, _c;
      if (removeRootListener == null) {
        (_a2 = config.logger) == null ? void 0 : _a2.debug(
          `[messaging] "${type}" initialized the message listener for this context`
        );
        removeRootListener = config.addRootListener((message) => {
          var _a3, _b2;
          if (typeof message.type != "string" || typeof message.timestamp !== "number") {
            if (config.breakError) {
              return;
            }
            const err = Error(
              `[messaging] Unknown message format, must include the 'type' & 'timestamp' fields, received: ${JSON.stringify(
                message
              )}`
            );
            (_a3 = config.logger) == null ? void 0 : _a3.error(err);
            throw err;
          }
          (_b2 = config == null ? void 0 : config.logger) == null ? void 0 : _b2.debug("[messaging] Received message", message);
          const listener = perTypeListeners[message.type];
          if (listener == null)
            return;
          const res = listener(message);
          return Promise.resolve(res).then((res2) => {
            var _a4, _b3;
            return (_b3 = (_a4 = config.verifyMessageData) == null ? void 0 : _a4.call(config, res2)) != null ? _b3 : res2;
          }).then((res2) => {
            var _a4;
            (_a4 = config == null ? void 0 : config.logger) == null ? void 0 : _a4.debug(`[messaging] onMessage {id=${message.id}} \u2500\u1405`, { res: res2 });
            return { res: res2 };
          }).catch((err) => {
            var _a4;
            (_a4 = config == null ? void 0 : config.logger) == null ? void 0 : _a4.debug(`[messaging] onMessage {id=${message.id}} \u2500\u1405`, { err });
            return { err: (0, import_serialize_error.serializeError)(err) };
          });
        });
      }
      if (perTypeListeners[type] != null) {
        const err = Error(
          `[messaging] In this JS context, only one listener can be setup for ${type}`
        );
        (_b = config.logger) == null ? void 0 : _b.error(err);
        throw err;
      }
      perTypeListeners[type] = onReceived;
      (_c = config.logger) == null ? void 0 : _c.log(`[messaging] Added listener for ${type}`);
      return () => {
        delete perTypeListeners[type];
        cleanupRootListener();
      };
    },
    removeAllListeners() {
      Object.keys(perTypeListeners).forEach((type) => {
        delete perTypeListeners[type];
      });
      cleanupRootListener();
    }
  };
}

// src/extension.ts
function defineExtensionMessaging(config) {
  return defineGenericMessanging(__spreadProps(__spreadValues({}, config), {
    sendMessage(message, arg) {
      if (arg == null) {
        return import_webextension_polyfill.default.runtime.sendMessage(message);
      }
      const options = typeof arg === "number" ? { tabId: arg } : arg;
      if (typeof options.tabId !== "number") {
        throw new Error("tabId is required when sending a message to a tab");
      }
      return import_webextension_polyfill.default.tabs.sendMessage(
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
      import_webextension_polyfill.default.runtime.onMessage.addListener(listener);
      return () => import_webextension_polyfill.default.runtime.onMessage.removeListener(listener);
    }
  }));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defineExtensionMessaging
});
