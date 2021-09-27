import { sqsClient } from "./aws/sqs";
import { postResult } from "./api/api";
import { worker } from "./worker";

import { config } from "./config";

const sqs = sqsClient(config);
const loop = worker(config, sqs, postResult);

const interval = setInterval(loop, config.POLLING_INTERVAL);

async function close(signal: NodeJS.Signals) {
  console.log(`Received signal to close ${signal}`);
  clearInterval(interval);
  process.exit();
}
process.on("SIGINT", close);
process.on("SIGTERM", close);
