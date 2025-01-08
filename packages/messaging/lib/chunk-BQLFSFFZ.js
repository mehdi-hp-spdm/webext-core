var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
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

// src/generic.ts
import { serializeError, deserializeError } from "serialize-error";
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
          throw deserializeError(err);
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
            return { err: serializeError(err) };
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

export {
  __spreadValues,
  __spreadProps,
  __objRest,
  __async,
  defineGenericMessanging
};
