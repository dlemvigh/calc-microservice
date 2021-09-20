const PORT = process.env.PORT || 8081;
const MAX_LENGTH = Number(process.env.MAX_LENGTH) || 20;

const SQS_ENDPOINT = process.env.SQS_ENDPOINT || "http://localhost:9324";
const QUEUE_ENDPOINT =
  process.env.QUEUE_ENDPOINT || "http://localhost:9324/queue/default";

export const config = {
  PORT,
  MAX_LENGTH,
  SQS_ENDPOINT,
  QUEUE_ENDPOINT
}

export type Config = typeof config;
