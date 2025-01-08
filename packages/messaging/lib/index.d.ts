import { B as BaseMessagingConfig, G as GenericMessenger } from './generic-ad5087a0.js';
export { a as GetDataType, b as GetReturnType, L as Logger, M as MaybePromise, c as Message, N as NamespaceMessagingConfig, P as ProtocolWithReturn, R as RemoveListenerCallback } from './generic-ad5087a0.js';
import { Runtime } from 'webextension-polyfill';

/**
 * Configuration passed into `defineExtensionMessaging`.
 */
interface ExtensionMessagingConfig extends BaseMessagingConfig {
}
/**
 * Additional fields available on the `Message` from an `ExtensionMessenger`.
 */
interface ExtensionMessage {
    /**
     * Information about where the message came from. See
     * [`Runtime.MessageSender`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/MessageSender).
     */
    sender: Runtime.MessageSender;
}
/**
 * Options for sending a message to a specific tab/frame
 */
interface SendMessageOptions {
    /**
     * The tab to send a message to
     */
    tabId: number;
    /**
     * The frame to send a message to. 0 represents the main frame.
     */
    frameId?: number;
}
/**
 * Send message accepts either:
 * - No arguments to send to background
 * - A tabId number to send to a specific tab
 * - A SendMessageOptions object to target a specific tab and/or frame
 */
type ExtensionSendMessageArgs = [arg?: number | SendMessageOptions];
/**
 * Messenger returned by `defineExtensionMessaging`.
 */
type ExtensionMessenger<TProtocolMap extends Record<string, any>> = GenericMessenger<TProtocolMap, ExtensionMessage, ExtensionSendMessageArgs>;
/**
 * Returns an `ExtensionMessenger` that is backed by the `browser.runtime.sendMessage` and
 * `browser.tabs.sendMessage` APIs.
 *
 * It can be used to send messages to and from the background page/service worker.
 */
declare function defineExtensionMessaging<TProtocolMap extends Record<string, any> = Record<string, any>>(config?: ExtensionMessagingConfig): ExtensionMessenger<TProtocolMap>;

export { BaseMessagingConfig, ExtensionMessage, ExtensionMessagingConfig, ExtensionMessenger, ExtensionSendMessageArgs, SendMessageOptions, defineExtensionMessaging };
