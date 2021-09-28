import { sqsClient } from "./aws/sqs";
import { postResult } from "./api/api";
import { worker } from "./worker";
import { factorial } from "./api/calc";
import { config } from "./config";

const sqs = sqsClient(config);
const api = postResult(config)
const loop = worker(config, sqs, factorial, api);

const interval = setInterval(loop, config.POLLING_INTERVAL);

async function close(signal: NodeJS.Signals) {
  console.log(`Received signal to close ${signal}`);
  clearInterval(interval);
  process.exit();
}
process.on("SIGINT", close);
process.on("SIGTERM", close);
