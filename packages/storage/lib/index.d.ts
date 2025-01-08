import { Storage } from 'webextension-polyfill';

type AnySchema = Record<string, any>;
/**
 * Call this method to remove the listener that was added.
 */
type RemoveListenerCallback = () => void;
type OnChangeCallback<TSchema extends AnySchema, TKey extends keyof TSchema = keyof TSchema> = (newValue: TSchema[TKey], oldValue: TSchema[TKey] | null) => void;
/**
 * This is the interface for the storage objects exported from the package. It is similar to `localStorage`, except for a few differences:
 *
 * - ***It's async*** since the web extension storage APIs are async.
 * - It can store any data type, ***not just strings***.
 */
interface ExtensionStorage<TSchema extends AnySchema> {
    /**
     * Clear all values from storage.
     */
    clear(): Promise<void>;
    /**
     * Return the value in storage or `null` if the item is missing.
     */
    getItem<TKey extends keyof TSchema>(key: TKey): Promise<Required<TSchema>[TKey] | null>;
    /**
     * Set the key and value in storage. Unlike with `localStorage`, passing `null` or `undefined`
     * will result in `null` being stored for the value.
     */
    setItem<TKey extends keyof TSchema>(key: TKey, value: TSchema[TKey]): Promise<void>;
    /**
     * Remove the value from storage at a key.
     */
    removeItem<TKey extends keyof TSchema>(key: TKey): Promise<void>;
    /**
     * Add a callback that is executed when a key is changed in the storage. Listeners are executed in
     * parallel, but the first listeners added are always started first.
     *
     * Returns a method that, when called, removes the listener that was added.
     */
    onChange<TKey extends keyof TSchema>(key: TKey, cb: OnChangeCallback<TSchema, TKey>): RemoveListenerCallback;
}

/**
 * Create a storage instance with an optional schema, `TSchema`, for type safety.
 *
 * @param storage The storage to to use. Either `Browser.storage.local`, `Browser.storage.sync`, or `Browser.storage.managed`.
 *
 * @example
 * import browser from 'webextension-polyfill';
 *
 * interface Schema {
 *   installDate: number;
 * }
 * const extensionStorage = defineExtensionStorage<Schema>(browser.storage.local);
 *
 * const date = await extensionStorage.getItem("installDate");
 */
declare function defineExtensionStorage<TSchema extends AnySchema = AnySchema>(storage: Storage.StorageArea): ExtensionStorage<TSchema>;

/**
 * An implementation of `ExtensionStorage` based on the `browser.storage.local` storage area.
 */
declare const localExtStorage: ExtensionStorage<AnySchema>;
/**
 * An implementation of `ExtensionStorage` based on the `browser.storage.local` storage area.
 *
 * - Added to Chrome 102 as of May 24th, 2022.
 * - Added to Safari 16.4 as of March 27th, 2023.
 * - Added to Firefox 115 as of July 4th, 2023.
 */
declare const sessionExtStorage: ExtensionStorage<AnySchema>;
/**
 * An implementation of `ExtensionStorage` based on the `browser.storage.sync` storage area.
 */
declare const syncExtStorage: ExtensionStorage<AnySchema>;
/**
 * An implementation of `ExtensionStorage` based on the `browser.storage.managed` storage area.
 */
declare const managedExtStorage: ExtensionStorage<AnySchema>;

export { ExtensionStorage, defineExtensionStorage, localExtStorage, managedExtStorage, sessionExtStorage, syncExtStorage };
