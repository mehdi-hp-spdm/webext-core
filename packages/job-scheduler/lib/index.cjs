"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
  defineJobScheduler: () => defineJobScheduler
});
module.exports = __toCommonJS(src_exports);
var import_webextension_polyfill = __toESM(require("webextension-polyfill"), 1);
var import_format_duration = __toESM(require("format-duration"), 1);
var import_cron_parser = __toESM(require("cron-parser"), 1);
function defineJobScheduler(options) {
  const logger = (options == null ? void 0 : options.logger) === void 0 ? console : options.logger;
  if (import_webextension_polyfill.default.alarms == null) {
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
      logger == null ? void 0 : logger.log(`[${executionId}] Job ran in ${(0, import_format_duration.default)(durationInMs)}`, {
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
        const expression = import_cron_parser.default.parseExpression(job.expression, __spreadProps(__spreadValues({}, job), {
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
      const existing = yield import_webextension_polyfill.default.alarms.get(job.id);
      switch (job.type) {
        case "cron":
        case "once":
          if (alarm.scheduledTime !== (existing == null ? void 0 : existing.scheduledTime)) {
            import_webextension_polyfill.default.alarms.create(alarm.name, { when: alarm.scheduledTime });
          }
          break;
        case "interval":
          if (!existing || alarm.periodInMinutes !== existing.periodInMinutes) {
            import_webextension_polyfill.default.alarms.create(alarm.name, {
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
  import_webextension_polyfill.default.alarms.onAlarm.addListener((alarm) => __async(this, null, function* () {
    const job = jobs[alarm.name];
    if (job)
      yield executeJob(job);
  }));
  return {
    scheduleJob,
    removeJob(jobId) {
      return __async(this, null, function* () {
        delete jobs[jobId];
        yield import_webextension_polyfill.default.alarms.clear(jobId);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defineJobScheduler
});
