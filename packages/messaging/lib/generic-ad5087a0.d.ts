/**
 * Interface used to log text to the console when sending and recieving messages.
 */
interface Logger {
    debug(...args: any[]): void;
    log(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
}
/**
 * Either a Promise of a type, or that type directly. Used to indicate that a method can by sync or
 * async.
 */
type MaybePromise<T> = Promise<T> | T;
/**
 * Used to add a return type to a message in the protocol map.
 *
 * > Internally, this is just an object with random keys for the data and return types.
 *
 * @deprecated Use the function syntax instead: <https://webext-core.aklinker1.io/guide/messaging/protocol-maps.html#syntax>
 *
 * @example
 * interface ProtocolMap {
 *   // data is a string, returns undefined
 *   type1: string;
 *   // data is a string, returns a number
 *   type2: ProtocolWithReturn<string, number>;
 * }
 */
interface ProtocolWithReturn<TData, TReturn> {
    /**
     * Stores the data type. Randomly named so that it isn't accidentally implemented.
     */
    BtVgCTPYZu: TData;
    /**
     * Stores the return type. Randomly named so that it isn't accidentally implemented.
     */
    RrhVseLgZW: TReturn;
}
/**
 * Given a function declaration, `ProtocolWithReturn`, or a value, return the message's data type.
 */
type GetDataType<T> = T extends (...args: infer Args) => any ? Args['length'] extends 0 | 1 ? Args[0] : never : T extends ProtocolWithReturn<any, any> ? T['BtVgCTPYZu'] : T;
/**
 * Given a function declaration, `ProtocolWithReturn`, or a value, return the message's return type.
 */
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : T extends ProtocolWithReturn<any, any> ? T['RrhVseLgZW'] : void;
/**
 * Call to ensure an active listener has been removed.
 *
 * If the listener has already been removed with `Messenger.removeAllListeners`, this is a noop.
 */
type RemoveListenerCallback = () => void;
/**
 * Shared configuration between all the different messengers.
 */
interface BaseMessagingConfig {
    /**
     * The logger to use when logging messages. Set to `null` to disable logging.
     *
     * @default console
     */
    logger?: Logger;
    /**
     * Whether to break an error when an invalid message is received.
     *
     * @default undefined
     */
    breakError?: boolean;
}
interface NamespaceMessagingConfig extends BaseMessagingConfig {
    /**
     * A string used to ensure the messenger only sends messages to and listens for messages from
     * other messengers of the same type, with the same namespace.
     */
    namespace: string;
}
/**
 * Contains information about the message recieved.
 */
interface Message<TProtocolMap extends Record<string, any>, TType extends keyof TProtocolMap> {
    /**
     * A semi-unique, auto-incrementing number used to trace messages being sent.
     */
    id: number;
    /**
     * The data that was passed into `sendMessage`
     */
    data: GetDataType<TProtocolMap[TType]>;
    type: TType;
    /**
     * The timestamp the message was sent in MS since epoch.
     */
    timestamp: number;
}

/**
 * Messaging interface shared by all messengers.
 *
 * Type parameters accept:
 * - `TProtocolMap` to define the data and return types of messages.
 * - `TMessageExtension` to define additional fields that are available on a message inside
 *    `onMessage`'s callback
 * - `TSendMessageArgs` to define a list of additional arguments for `sendMessage`
 */
interface GenericMessenger<TProtocolMap extends Record<string, any>, TMessageExtension, TSendMessageArgs extends any[]> {
    /**
     * Send a message to the background or a specific tab if `tabId` is passed. You can call this
     * function anywhere in your extension.
     *
     * If you haven't setup a listener for the sent `type`, an error will be thrown.
     *
     * @param type The message type being sent. Call `onMessage` with the same type to listen for that message.
     * @param data The data to send with the message.
     * @param args Different messengers will have additional arguments to configure how a message gets sent.
     */
    sendMessage<TType extends keyof TProtocolMap>(type: TType, data: GetDataType<TProtocolMap[TType]>, ...args: TSendMessageArgs): Promise<GetReturnType<TProtocolMap[TType]>>;
    /**
     * Trigger a callback when a message of the requested type is recieved. You cannot setup multiple
     * listeners for the same message type in the same JS context.
     *
     * To remove the listener, call the returned message.
     *
     * @param type The message type to listen for. Call `sendMessage` with the same type to triggern this listener.
     * @param onReceived The callback executed when a message is recieved.
     */
    onMessage<TType extends keyof TProtocolMap>(type: TType, onReceived: (message: Message<TProtocolMap, TType> & TMessageExtension) => void | MaybePromise<GetReturnType<TProtocolMap[TType]>>): RemoveListenerCallback;
    /**
     * Removes all listeners.
     */
    removeAllListeners(): void;
}

export { BaseMessagingConfig as B, GenericMessenger as G, Logger as L, MaybePromise as M, NamespaceMessagingConfig as N, ProtocolWithReturn as P, RemoveListenerCallback as R, GetDataType as a, GetReturnType as b, Message as c };
