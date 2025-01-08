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
  defineExtensionStorage: () => defineExtensionStorage,
  localExtStorage: () => localExtStorage,
  managedExtStorage: () => managedExtStorage,
  sessionExtStorage: () => sessionExtStorage,
  syncExtStorage: () => syncExtStorage
});
module.exports = __toCommonJS(src_exports);

// src/defineExtensionStorage.ts
var import_webextension_polyfill = __toESM(require("webextension-polyfill"), 1);
function defineExtensionStorage(storage) {
  const onStorageChanged = (changes) => __async(this, null, function* () {
    const work = listeners.map(({ key, cb }) => {
      if (!(key in changes))
        return;
      const { newValue, oldValue } = changes[key];
      if (newValue === oldValue)
        return;
      return cb(newValue, oldValue);
    });
    yield Promise.all(work);
  });
  let listeners = [];
  function addListener(listener) {
    if (listeners.length === 0) {
      storage.onChanged.addListener(onStorageChanged);
    }
    listeners.push(listener);
  }
  function removeListener(listener) {
    const i = listeners.indexOf(listener);
    if (i >= 0)
      listeners.splice(i, 1);
    if (listeners.length === 0) {
      import_webextension_polyfill.default.storage.onChanged.removeListener(onStorageChanged);
    }
  }
  return {
    clear() {
      return storage.clear();
    },
    getItem(key) {
      return storage.get(key).then((res) => {
        var _a;
        return (_a = res[key]) != null ? _a : null;
      });
    },
    setItem(key, value) {
      return storage.set({ [key]: value != null ? value : null });
    },
    removeItem(key) {
      return storage.remove(key);
    },
    onChange(key, cb) {
      const listener = {
        key,
        // @ts-expect-error: We don't need this type to fit internally.
        cb
      };
      addListener(listener);
      return () => removeListener(listener);
    }
  };
}

// src/index.ts
var import_webextension_polyfill2 = __toESM(require("webextension-polyfill"), 1);
var localExtStorage = defineExtensionStorage(import_webextension_polyfill2.default.storage.local);
var sessionExtStorage = defineExtensionStorage(import_webextension_polyfill2.default.storage.session);
var syncExtStorage = defineExtensionStorage(import_webextension_polyfill2.default.storage.sync);
var managedExtStorage = defineExtensionStorage(import_webextension_polyfill2.default.storage.managed);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defineExtensionStorage,
  localExtStorage,
  managedExtStorage,
  sessionExtStorage,
  syncExtStorage
});
