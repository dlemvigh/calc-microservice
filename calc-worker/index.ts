import { receiveMessage } from "./aws/sqs";
import { postResult } from "./api/api";
import { factorial } from "./api/calc";

const POLLING_INTERVAL = Number(process.env.POLLING_INTERVAL) || 10 * 1000;

let working = false;

async function loop() {
  if (working) return;
  try {
    working = true;
    const msg = await receiveMessage();
    console.log("received message", msg);
    const result = factorial(msg.json.input);
    console.log("calculated result", result);
    await postResult({ ...msg.json, output: result.toString() });
    console.log("result posted");
  } catch (err) {
    console.error("err", err);
  }
  working = false;
}

const interval = setInterval(loop, POLLING_INTERVAL);

async function close(signal: NodeJS.Signals) {
  console.log(`Received signal to close ${signal}`);
  // clearInterval(interval);
  process.exit();
}

process.on("SIGINT", close);
process.on("SIGTERM", close);
