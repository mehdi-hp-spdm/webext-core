import { ExtensionMessagingConfig } from '@webext-core/messaging';

type Proimsify<T> = T extends Promise<any> ? T : Promise<T>;
type Service = ((...args: any[]) => Promise<any>) | {
    [key: string]: any | Service;
};
/**
 * A type that ensures a service has only async methods.
 * - ***If all methods are async***, it returns the original type.
 * - ***If the service has non-async methods***, it returns a `DeepAsync` of the service.
 */
type ProxyService<TService> = TService extends DeepAsync<TService> ? TService : DeepAsync<TService>;
/**
 * A recursive type that deeply converts all methods in `TService` to be async.
 */
type DeepAsync<TService> = TService extends (...args: any) => any ? ToAsyncFunction<TService> : TService extends {
    [key: string]: any;
} ? {
    [fn in keyof TService]: DeepAsync<TService[fn]>;
} : never;
type ToAsyncFunction<T extends (...args: any) => any> = (...args: Parameters<T>) => Proimsify<ReturnType<T>>;
/**
 * Configure a proxy service's behavior. It uses `@webext-core/messaging` internally, so any
 * config from `ExtensionMessagingConfig` can be passed as well.
 */
interface ProxyServiceConfig extends ExtensionMessagingConfig {
}

/**
 * Utility for creating a service whose functions are executed in the background script regardless
 * of the JS context the they are called from.
 *
 * @param name A unique name for the service. Used to identify which service is being executed.
 * @param init A function that returns your real service implementation. If args are listed,
 *             `registerService` will require the same set of arguments.
 * @param config
 * @returns
 * - `registerService`: Used to register your service in the background
 * - `getService`: Used to get an instance of the service anywhere in the extension.
 */
declare function defineProxyService<TService extends Service, TArgs extends any[]>(name: string, init: (...args: TArgs) => TService, config?: ProxyServiceConfig): [registerService: (...args: TArgs) => TService, getService: () => ProxyService<TService>];

/**
 * Given a promise of a variable, return a proxy to that awaits the promise internally so you don't
 * have to call `await` twice.
 *
 * > This can be used to simplify handling `Promise<Dependency>` passed in your services.
 *
 * @example
 * function createService(dependencyPromise: Promise<SomeDependency>) {
 *   const dependency = flattenPromise(dependencyPromise);
 *
 *   return {
 *     doSomething() {
 *       await dependency.someAsyncWork();
 *       // Instead of `await (await dependencyPromise).someAsyncWork();`
 *     }
 *   }
 * }
 */
declare function flattenPromise<T>(promise: Promise<T>): DeepAsync<T>;

export { DeepAsync, ProxyService, ProxyServiceConfig, defineProxyService, flattenPromise };
