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

// src/defineExtensionStorage.ts
import browser from "webextension-polyfill";
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
      browser.storage.onChanged.removeListener(onStorageChanged);
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
import Browser from "webextension-polyfill";
var localExtStorage = defineExtensionStorage(Browser.storage.local);
var sessionExtStorage = defineExtensionStorage(Browser.storage.session);
var syncExtStorage = defineExtensionStorage(Browser.storage.sync);
var managedExtStorage = defineExtensionStorage(Browser.storage.managed);
export {
  defineExtensionStorage,
  localExtStorage,
  managedExtStorage,
  sessionExtStorage,
  syncExtStorage
};
