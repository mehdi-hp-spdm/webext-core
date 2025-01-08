import cron from 'cron-parser';

/**
 * Interface used to log text to the console when creating and executing jobs.
 */
interface Logger {
    debug(...args: any[]): void;
    log(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
}
/**
 * Configures how the job scheduler behaves.
 */
interface JobSchedulerConfig {
    /**
     * The logger to use when logging messages. Set to `null` to disable logging.
     *
     * @default console
     */
    logger?: Logger | null;
}
/**
 * Function ran when executing the job. Errors are automatically caught and will trigger the
 * `"error"` event. If a value is returned, the result will be available in the `"success"` event.
 */
type ExecuteFn = () => Promise<any> | any;
/**
 * A job that executes on a set interval, starting when the job is scheduled for the first time.
 */
interface IntervalJob {
    id: string;
    type: 'interval';
    /**
     * Interval in milliseconds. Due to limitations of the alarms API, it must be greater than 1
     * minute.
     */
    duration: number;
    /**
     * Execute the job immediately when it is scheduled for the first time. If `false`, it will
     * execute for the first time after `duration`. This has no effect when updating an existing job.
     *
     * @default false
     */
    immediate?: boolean;
    execute: ExecuteFn;
}
/**
 * A job that is executed based on a CRON expression. Backed by `cron-parser`.
 *
 * [`cron.ParserOptions`](https://github.com/harrisiirak/cron-parser#options) includes options like timezone.
 */
interface CronJob extends cron.ParserOptions<false> {
    id: string;
    type: 'cron';
    /**
     * See `cron-parser`'s [supported expressions](https://github.com/harrisiirak/cron-parser#supported-format)
     */
    expression: string;
    execute: ExecuteFn;
}
/**
 * Runs a job once, at a specific date/time.
 */
interface OnceJob {
    id: string;
    type: 'once';
    /**
     * The date to run the job on.
     */
    date: Date | string | number;
    execute: ExecuteFn;
}
type Job = IntervalJob | CronJob | OnceJob;
interface JobScheduler {
    /**
     * Schedule a job. If a job with the same `id` has already been scheduled, it will update the job if it is different.
     */
    scheduleJob(job: Job): Promise<void>;
    /**
     * Un-schedules a job by it's ID.
     */
    removeJob(jobId: string): Promise<void>;
    /**
     * Listen for a job to finish successfully.
     */
    on(event: 'success', callback: (job: Job, result: any) => void): RemoveListenerFn;
    /**
     * Listen for when a job fails.
     */
    on(event: 'error', callback: (job: Job, error: unknown) => void): RemoveListenerFn;
}
/**
 * Call to remove the listener that was added.
 */
type RemoveListenerFn = () => void;
/**
 * > Requires the `alarms` permission.
 *
 * Creates a `JobScheduler` backed by the
 * [alarms API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/alarms).
 *
 * @param options
 * @returns A `JobScheduler` that can be used to schedule and manage jobs.
 */
declare function defineJobScheduler(options?: JobSchedulerConfig): JobScheduler;

export { CronJob, ExecuteFn, IntervalJob, Job, JobScheduler, JobSchedulerConfig, Logger, OnceJob, defineJobScheduler };
