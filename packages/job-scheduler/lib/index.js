var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
import browser from "webextension-polyfill";
import formatDuration from "format-duration";
import cron from "cron-parser";
function defineJobScheduler(options) {
  const logger = (options == null ? void 0 : options.logger) === void 0 ? console : options.logger;
  if (browser.alarms == null) {
    options;
  }
  const successListeners = [];
  function triggerSuccessListeners(job, result) {
    successListeners.forEach((l) => l(job, result));
  }
  const errorListeners = [];
  function triggerErrorListeners(job, error) {
    errorListeners.forEach((l) => l(job, error));
  }
  const jobs = {};
  function executeJob(job) {
    return __async(this, null, function* () {
      const executionId = String(Math.floor(Math.random() * 1e3)).padStart(3, "0");
      logger == null ? void 0 : logger.log(`[${executionId}] Executing job:`, job);
      const startTime = Date.now();
      let status = "success";
      try {
        yield scheduleNextAlarm(job);
        const result = yield job.execute();
        triggerSuccessListeners(job, result);
      } catch (err) {
        status = "failure";
        triggerErrorListeners(job, err);
      }
      const endTime = Date.now();
      const durationInMs = endTime - startTime;
      logger == null ? void 0 : logger.log(`[${executionId}] Job ran in ${formatDuration(durationInMs)}`, {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        durationInMs,
        status,
        job
      });
    });
  }
  function jobToAlarm(job) {
    let scheduledTime;
    let periodInMinutes;
    switch (job.type) {
      case "once":
        scheduledTime = new Date(job.date).getTime();
        if (scheduledTime < Date.now())
          return;
        break;
      case "interval":
        scheduledTime = Date.now();
        if (!job.immediate)
          scheduledTime += job.duration;
        periodInMinutes = job.duration / 6e4;
        break;
      case "cron":
        const expression = cron.parseExpression(job.expression, __spreadProps(__spreadValues({}, job), {
          currentDate: Date.now(),
          startDate: Date.now()
        }));
        if (!expression.hasNext())
          return;
        scheduledTime = expression.next().getTime();
        break;
    }
    return {
      name: job.id,
      scheduledTime,
      periodInMinutes
    };
  }
  function scheduleJob(job) {
    return __async(this, null, function* () {
      logger == null ? void 0 : logger.debug("Scheduling job: ", job);
      const alarm = jobToAlarm(job);
      if (alarm == null) {
        delete jobs[job.id];
        return;
      }
      jobs[job.id] = job;
      const existing = yield browser.alarms.get(job.id);
      switch (job.type) {
        case "cron":
        case "once":
          if (alarm.scheduledTime !== (existing == null ? void 0 : existing.scheduledTime)) {
            browser.alarms.create(alarm.name, { when: alarm.scheduledTime });
          }
          break;
        case "interval":
          if (!existing || alarm.periodInMinutes !== existing.periodInMinutes) {
            browser.alarms.create(alarm.name, {
              delayInMinutes: job.immediate && !existing ? 0 : alarm.periodInMinutes,
              periodInMinutes: alarm.periodInMinutes
            });
          }
          break;
      }
    });
  }
  function scheduleNextAlarm(job) {
    return __async(this, null, function* () {
      switch (job.type) {
        case "once":
        case "interval":
          break;
        case "cron":
          yield scheduleJob(job);
          break;
      }
    });
  }
  browser.alarms.onAlarm.addListener((alarm) => __async(this, null, function* () {
    const job = jobs[alarm.name];
    if (job)
      yield executeJob(job);
  }));
  return {
    scheduleJob,
    removeJob(jobId) {
      return __async(this, null, function* () {
        delete jobs[jobId];
        yield browser.alarms.clear(jobId);
      });
    },
    on(event, callback) {
      const listeners = event === "success" ? successListeners : errorListeners;
      listeners.push(callback);
      return () => {
        const i = listeners.indexOf(callback);
        listeners.splice(i, 1);
      };
    }
  };
}
export {
  defineJobScheduler
};
