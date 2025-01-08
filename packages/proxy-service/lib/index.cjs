"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  defineProxyService: () => defineProxyService,
  flattenPromise: () => flattenPromise
});
module.exports = __toCommonJS(src_exports);

// src/isBackground.ts
var import_webextension_polyfill = __toESM(require("webextension-polyfill"), 1);
function isBackground() {
  if (!canAccessExtensionApi())
    return false;
  const manifest = import_webextension_polyfill.default.runtime.getManifest();
  if (!manifest.background)
    return false;
  return manifest.manifest_version === 3 ? isBackgroundServiceWorker() : isBackgroundPage();
}
function canAccessExtensionApi() {
  var _a;
  return !!((_a = import_webextension_polyfill.default.runtime) == null ? void 0 : _a.id);
}
var KNOWN_BACKGROUND_PAGE_PATHNAMES = [
  // Firefox
  "/_generated_background_page.html"
];
function isBackgroundPage() {
  return typeof window !== "undefined" && KNOWN_BACKGROUND_PAGE_PATHNAMES.includes(location.pathname);
}
function isBackgroundServiceWorker() {
  return typeof window === "undefined";
}

// src/defineProxyService.ts
var import_messaging = require("@webext-core/messaging");
var import_get_value = __toESM(require("get-value"), 1);
function defineProxyService(name, init, config) {
  let service;
  const messageKey = `proxy-service.${name}`;
  const { onMessage, sendMessage } = (0, import_messaging.defineExtensionMessaging)(config);
  function createProxy(path) {
    const wrapped = () => {
    };
    const proxy = new Proxy(wrapped, {
      // Executed when the object is called as a function
      apply(_target, _thisArg, args) {
        return __async(this, null, function* () {
          const res = yield sendMessage(messageKey, {
            path,
            args
          });
          return res;
        });
      },
      // Executed when accessing a property on an object
      get(target, propertyName, receiver) {
        if (propertyName === "__proxy" || typeof propertyName === "symbol") {
          return Reflect.get(target, propertyName, receiver);
        }
        return createProxy(path == null ? propertyName : `${path}.${propertyName}`);
      }
    });
    proxy.__proxy = true;
    return proxy;
  }
  return [
    function registerService(...args) {
      service = init(...args);
      onMessage(messageKey, ({ data }) => {
        const method = data.path == null ? service : (0, import_get_value.default)(service != null ? service : {}, data.path);
        if (method)
          return Promise.resolve(method.bind(service)(...data.args));
      });
      return service;
    },
    function getService() {
      if (!isBackground())
        return createProxy();
      if (service == null) {
        throw Error(
          `Failed to get an instance of ${name}: in background, but registerService has not been called. Did you forget to call registerService?`
        );
      }
      return service;
    }
  ];
}

// src/flattenPromise.ts
var import_get_value2 = __toESM(require("get-value"), 1);
function flattenPromise(promise) {
  function createProxy(location2) {
    const wrapped = () => {
    };
    const proxy = new Proxy(wrapped, {
      apply(_target, _thisArg, args) {
        return __async(this, null, function* () {
          const t = yield promise;
          const thisArg = (location2 == null ? void 0 : location2.parentPath) ? (0, import_get_value2.default)(t, location2.parentPath) : t;
          const fn = location2 ? (0, import_get_value2.default)(t, location2.propertyPath) : t;
          return fn.apply(thisArg, args);
        });
      },
      // Executed when accessing a property on an object
      get(target, propertyName, receiver) {
        if (propertyName === "__proxy" || typeof propertyName === "symbol") {
          return Reflect.get(target, propertyName, receiver);
        }
        return createProxy({
          propertyPath: location2 == null ? propertyName : `${location2.propertyPath}.${propertyName}`,
          parentPath: location2 == null ? void 0 : location2.propertyPath
        });
      }
    });
    proxy.__proxy = true;
    return proxy;
  }
  return createProxy();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defineProxyService,
  flattenPromise
});
