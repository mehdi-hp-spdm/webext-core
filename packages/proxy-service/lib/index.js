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

// src/isBackground.ts
import Browser from "webextension-polyfill";
function isBackground() {
  if (!canAccessExtensionApi())
    return false;
  const manifest = Browser.runtime.getManifest();
  if (!manifest.background)
    return false;
  return manifest.manifest_version === 3 ? isBackgroundServiceWorker() : isBackgroundPage();
}
function canAccessExtensionApi() {
  var _a;
  return !!((_a = Browser.runtime) == null ? void 0 : _a.id);
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
import { defineExtensionMessaging } from "@webext-core/messaging";
import get from "get-value";
function defineProxyService(name, init, config) {
  let service;
  const messageKey = `proxy-service.${name}`;
  const { onMessage, sendMessage } = defineExtensionMessaging(config);
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
        const method = data.path == null ? service : get(service != null ? service : {}, data.path);
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
import get2 from "get-value";
function flattenPromise(promise) {
  function createProxy(location2) {
    const wrapped = () => {
    };
    const proxy = new Proxy(wrapped, {
      apply(_target, _thisArg, args) {
        return __async(this, null, function* () {
          const t = yield promise;
          const thisArg = (location2 == null ? void 0 : location2.parentPath) ? get2(t, location2.parentPath) : t;
          const fn = location2 ? get2(t, location2.propertyPath) : t;
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
export {
  defineProxyService,
  flattenPromise
};
