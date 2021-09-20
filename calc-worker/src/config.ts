const POLLING_INTERVAL = Number(process.env.POLLING_INTERVAL) || 1 * 1000;
const DEBUG = process.env.DEBUG === "true";
const API_ENDPOINT = process.env.API_ENDPOINT || "http://localhost:8081";
const SQS_ENDPOINT = process.env.SQS_ENDPOINT || "http://localhost:9324";
const QUEUE_ENDPOINT =
  process.env.QUEUE_ENDPOINT || "http://localhost:9324/queue/default";

export const config = {
  POLLING_INTERVAL,
  DEBUG,
  API_ENDPOINT,
  SQS_ENDPOINT,
  QUEUE_ENDPOINT
}

export type Config = typeof config;
