import { N as NamespaceMessagingConfig, G as GenericMessenger } from './generic-ad5087a0.js';

/**
 * Configuration passed into `defineWindowMessaging`.
 */
interface WindowMessagingConfig extends NamespaceMessagingConfig {
}
/**
 * For a `WindowMessenger`, `sendMessage` requires an additional argument, the `targetOrigin`. It
 * defines which frames inside the page should receive the message.
 *
 * > See <https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#targetorigin> for more
 * details.
 */
type WindowSendMessageArgs = [targetOrigin?: string];
type WindowMessenger<TProtocolMap extends Record<string, any>> = GenericMessenger<TProtocolMap, {}, WindowSendMessageArgs>;
/**
 * Returns a `WindowMessenger`. It is backed by the `window.postMessage` API.  It can be used to
 * communicate between:
 *
 * - Content script and website
 * - Content script and injected script
 *
 * @example
 * interface WebsiteMessengerSchema {
 *   initInjectedScript(data: ...): void;
 * }
 *
 * export const websiteMessenger = defineWindowMessaging<initInjectedScript>();
 *
 * // Content script
 * websiteMessenger.sendMessage("initInjectedScript", ...);
 *
 * // Injected script
 * websiteMessenger.onMessage("initInjectedScript", (...) => {
 *   // ...
 * })
 *
 * @link Spec diagrams
 * https://mermaid.live/edit#pako:eNqVlG9v2jAQxr-KZamvGv7YyYBYVSTGWgmpwAs6VZqQJpMc1BOxM8fZoIjvPieBACUVLC8SO3ru7vc4l9viUEWAGU7hdwYyhG-CLzWPZxLZa67WaKCkAWka01CLxDzMdSsobkKmhtsAUuy2SPIY0oSHwNBCKbQrMyRcGxGKhEuDbAT5qSTiKVJyBGnKl_CJKgUZ5br8eaa0-yPaUP6C0EDUeoX5VBi4hKP_A0dvgqM3wvWlMm-gi-Nb15ybe4k25_oTNPcmNPcKWrm8uzvWRF_Ld2NlAKk_oA_FnCodQ4PJaPR9PBz0X4aTMXp6nrwW6NP-6BH1p-j58enlkNsCoXKVX9WnbATB_f6AWcHWMpsE2AwnQi7JDNeFNNb7fmFILKXSlu-vLILP1HnOUkv3uCdqDemlOAgaVRWWS2phqjoXluipJVJriX6wRE8s0auWSGWJXLdEjpZovSV6ZqlcHjtBoVDFcSZFyG0LrIQ85D9rCfqhJcbnYUIWHRGJxQK0HRbHBrPJsINj0DEXkR0z2zz5DNs_I4YZZnYZwYJnK5ND7qyUZ0ZNNzLEzOgMHKxVtnzDbMFXqd1lSWTr7WdU9db2P2ZbvMasQYjX9AnteaRN3HbP7XgO3mBG3U6z533p-W637bue5-4c_K6UTUGbpOtT36edLvXaLu06GCJhlB6Vc7EYj0WJH4U-p9r9Aynbsqc
 */
declare function defineWindowMessaging<TProtocolMap extends Record<string, any> = Record<string, any>>(config: WindowMessagingConfig): WindowMessenger<TProtocolMap>;

/**
 * Configuration passed into `defineCustomEventMessaging`.
 */
interface CustomEventMessagingConfig extends NamespaceMessagingConfig {
}
/**
 * Additional fields available on the `Message` from a `CustomEventMessenger`.
 */
interface CustomEventMessage {
    /**
     * The event that was fired, resulting in the message being passed.
     */
    event: CustomEvent;
}
/**
 * Messenger returned by `defineCustomEventMessenger`.
 */
type CustomEventMessenger<TProtocolMap extends Record<string, any>> = GenericMessenger<TProtocolMap, CustomEventMessage, [
]>;
/**
 * Creates a `CustomEventMessenger`. This messenger is backed by the `CustomEvent` APIs. It can be
 * used to communicate between:
 *
 * - Content script and website
 * - Content script and injected script
 *
 * `sendMessage` does not accept any additional arguments..
 *
 * @example
 * interface WebsiteMessengerSchema {
 *   initInjectedScript(data: ...): void;
 * }
 *
 * export const websiteMessenger = defineCustomEventMessenger<initInjectedScript>();
 *
 * // Content script
 * websiteMessenger.sendMessage("initInjectedScript", ...);
 *
 * // Injected script
 * websiteMessenger.onMessage("initInjectedScript", (...) => {
 *   // ...
 * })
 *
 * * @link Spec diagrams
 * https://mermaid.live/edit#pako:eNqVlG9v2jAQxr-KZamvGv7YyYBYVSTGWgmpwAs6VZqQJpMc1BOxM8fZoIjvPieBACUVLC8SO3ru7vc4l9viUEWAGU7hdwYyhG-CLzWPZxLZa67WaKCkAWka01CLxDzMdSsobkKmhtsAUuy2SPIY0oSHwNBCKbQrMyRcGxGKhEuDbAT5qSTiKVJyBGnKl_CJKgUZ5br8eaa0-yPaUP6C0EDUeoX5VBi4hKP_A0dvgqM3wvWlMm-gi-Nb15ybe4k25_oTNPcmNPcKWrm8uzvWRF_Ld2NlAKk_oA_FnCodQ4PJaPR9PBz0X4aTMXp6nrwW6NP-6BH1p-j58enlkNsCoXKVX9WnbATB_f6AWcHWMpsE2AwnQi7JDNeFNNb7fmFILKXSlu-vLILP1HnOUkv3uCdqDemlOAgaVRWWS2phqjoXluipJVJriX6wRE8s0auWSGWJXLdEjpZovSV6ZqlcHjtBoVDFcSZFyG0LrIQ85D9rCfqhJcbnYUIWHRGJxQK0HRbHBrPJsINj0DEXkR0z2zz5DNs_I4YZZnYZwYJnK5ND7qyUZ0ZNNzLEzOgMHKxVtnzDbMFXqd1lSWTr7WdU9db2P2ZbvMasQYjX9AnteaRN3HbP7XgO3mBG3U6z533p-W637bue5-4c_K6UTUGbpOtT36edLvXaLu06GCJhlB6Vc7EYj0WJH4U-p9r9Aynbsqc
 */
declare function defineCustomEventMessaging<TProtocolMap extends Record<string, any> = Record<string, any>>(config: CustomEventMessagingConfig): CustomEventMessenger<TProtocolMap>;

export { CustomEventMessage, CustomEventMessagingConfig, CustomEventMessenger, WindowMessagingConfig, WindowMessenger, WindowSendMessageArgs, defineCustomEventMessaging, defineWindowMessaging };
