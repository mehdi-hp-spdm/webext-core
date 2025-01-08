"use strict";
var webExtCoreMessaging = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
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
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
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

  // src/page.ts
  var page_exports = {};
  __export(page_exports, {
    defineCustomEventMessaging: () => defineCustomEventMessaging,
    defineWindowMessaging: () => defineWindowMessaging
  });

  // ../../node_modules/uid/dist/index.mjs
  var IDX = 256;
  var HEX = [];
  var SIZE = 256;
  var BUFFER;
  while (IDX--)
    HEX[IDX] = (IDX + 256).toString(16).substring(1);
  function uid(len) {
    var i = 0, tmp = len || 11;
    if (!BUFFER || IDX + tmp > SIZE * 2) {
      for (BUFFER = "", IDX = 0; i < SIZE; i++) {
        BUFFER += HEX[Math.random() * 256 | 0];
      }
    }
    return BUFFER.substring(IDX, IDX++ + tmp);
  }

  // ../../node_modules/serialize-error/error-constructors.js
  var list = [
    // Native ES errors https://262.ecma-international.org/12.0/#sec-well-known-intrinsic-objects
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
    // Built-in errors
    globalThis.DOMException,
    // Node-specific errors
    // https://nodejs.org/api/errors.html
    globalThis.AssertionError,
    globalThis.SystemError
  ].filter(Boolean).map(
    (constructor) => [constructor.name, constructor]
  );
  var errorConstructors = new Map(list);
  var error_constructors_default = errorConstructors;

  // ../../node_modules/serialize-error/index.js
  var NonError = class extends Error {
    constructor(message) {
      super(NonError._prepareSuperMessage(message));
      __publicField(this, "name", "NonError");
    }
    static _prepareSuperMessage(message) {
      try {
        return JSON.stringify(message);
      } catch (e) {
        return String(message);
      }
    }
  };
  var commonProperties = [
    {
      property: "name",
      enumerable: false
    },
    {
      property: "message",
      enumerable: false
    },
    {
      property: "stack",
      enumerable: false
    },
    {
      property: "code",
      enumerable: true
    },
    {
      property: "cause",
      enumerable: false
    }
  ];
  var toJsonWasCalled = /* @__PURE__ */ new WeakSet();
  var toJSON = (from) => {
    toJsonWasCalled.add(from);
    const json = from.toJSON();
    toJsonWasCalled.delete(from);
    return json;
  };
  var getErrorConstructor = (name) => {
    var _a;
    return (_a = error_constructors_default.get(name)) != null ? _a : Error;
  };
  var destroyCircular = ({
    from,
    seen,
    to,
    forceEnumerable,
    maxDepth,
    depth,
    useToJSON,
    serialize
  }) => {
    if (!to) {
      if (Array.isArray(from)) {
        to = [];
      } else if (!serialize && isErrorLike(from)) {
        const Error2 = getErrorConstructor(from.name);
        to = new Error2();
      } else {
        to = {};
      }
    }
    seen.push(from);
    if (depth >= maxDepth) {
      return to;
    }
    if (useToJSON && typeof from.toJSON === "function" && !toJsonWasCalled.has(from)) {
      return toJSON(from);
    }
    const continueDestroyCircular = (value) => destroyCircular({
      from: value,
      seen: [...seen],
      forceEnumerable,
      maxDepth,
      depth,
      useToJSON,
      serialize
    });
    for (const [key, value] of Object.entries(from)) {
      if (value && value instanceof Uint8Array && value.constructor.name === "Buffer") {
        to[key] = "[object Buffer]";
        continue;
      }
      if (value !== null && typeof value === "object" && typeof value.pipe === "function") {
        to[key] = "[object Stream]";
        continue;
      }
      if (typeof value === "function") {
        continue;
      }
      if (!value || typeof value !== "object") {
        try {
          to[key] = value;
        } catch (e) {
        }
        continue;
      }
      if (!seen.includes(from[key])) {
        depth++;
        to[key] = continueDestroyCircular(from[key]);
        continue;
      }
      to[key] = "[Circular]";
    }
    for (const { property, enumerable } of commonProperties) {
      if (typeof from[property] !== "undefined" && from[property] !== null) {
        Object.defineProperty(to, property, {
          value: isErrorLike(from[property]) ? continueDestroyCircular(from[property]) : from[property],
          enumerable: forceEnumerable ? true : enumerable,
          configurable: true,
          writable: true
        });
      }
    }
    return to;
  };
  function serializeError(value, options = {}) {
    const {
      maxDepth = Number.POSITIVE_INFINITY,
      useToJSON = true
    } = options;
    if (typeof value === "object" && value !== null) {
      return destroyCircular({
        from: value,
        seen: [],
        forceEnumerable: true,
        maxDepth,
        depth: 0,
        useToJSON,
        serialize: true
      });
    }
    if (typeof value === "function") {
      return `[Function: ${value.name || "anonymous"}]`;
    }
    return value;
  }
  function deserializeError(value, options = {}) {
    const { maxDepth = Number.POSITIVE_INFINITY } = options;
    if (value instanceof Error) {
      return value;
    }
    if (isMinimumViableSerializedError(value)) {
      const Error2 = getErrorConstructor(value.name);
      return destroyCircular({
        from: value,
        seen: [],
        to: new Error2(),
        maxDepth,
        depth: 0,
        serialize: false
      });
    }
    return new NonError(value);
  }
  function isErrorLike(value) {
    return Boolean(value) && typeof value === "object" && "name" in value && "message" in value && "stack" in value;
  }
  function isMinimumViableSerializedError(value) {
    return Boolean(value) && typeof value === "object" && "message" in value && !Array.isArray(value);
  }

  // src/generic.ts
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

  // src/window.ts
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

  // src/utils.ts
  function prepareCustomEventDict(data, options = { targetScope: window != null ? window : void 0 }) {
    return typeof cloneInto !== "undefined" ? cloneInto(data, options.targetScope) : data;
  }

  // src/custom-event.ts
  var REQUEST_EVENT = "@webext-core/messaging/custom-events";
  var RESPONSE_EVENT = "@webext-core/messaging/custom-events/response";
  function defineCustomEventMessaging(config) {
    const namespace = config.namespace;
    const instanceId = uid();
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
  return __toCommonJS(page_exports);
})();
