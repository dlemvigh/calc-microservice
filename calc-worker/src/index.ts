import { deleteMessage, receiveMessage } from "./aws/sqs";
import { postResult } from "./api/api";
import { factorial } from "./api/calc";
import { config } from "./config";

let working = false;

function log(message: any, ...other: any[]) {
  if (config.DEBUG) {
    print(message, ...other);
  }
}
function error(message: any, ...other: any[]) {
  print(message, ...other);
}

function print(message: any, ...other: any[]) {
  console.log(new Date().toLocaleTimeString(), " | ", message, ...other);
}

async function loop() {
  if (working) {
    console.log("working...");
    return;
  }
  try {
    working = true;
    const msg = await receiveMessage();
    log("received message from queue");
    await postResult({ ...msg.json, calcStartedAt: new Date() });
    log("started calculation");
    const result = await factorial(msg.json.input);
    log("finished calculation", result.toString().length);
    await postResult({
      ...msg.json,
      finishedAt: new Date(),
      output: result.toString(),
    });
    log("posted result to api");
    await deleteMessage(msg);
    log("deleted message from queue");
  } catch (err) {
    error("err", err);
  }
  working = false;
}

const interval = setInterval(loop, config.POLLING_INTERVAL);

async function close(signal: NodeJS.Signals) {
  console.log(`Received signal to close ${signal}`);
  clearInterval(interval);
  process.exit();
}

process.on("SIGINT", close);
process.on("SIGTERM", close);
