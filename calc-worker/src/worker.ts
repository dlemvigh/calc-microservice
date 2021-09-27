import { SqsClient } from "./aws/sqs";
import { PostResult } from "./api/api";
import { factorial } from "./api/calc";
import { Config } from "./config";

export function worker(config: Config, sqs: SqsClient, postResult: PostResult) {
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

  return async function doWork() {
    if (working) {
      console.log("working...");
      return;
    }

    try {
      working = true;
      const msg = await sqs.receiveMessage();
      log("received message from queue");
      await postResult(config)({ ...msg.json, calcStartedAt: new Date() });
      log("started calculation");
      const result = await factorial(msg.json.input);
      log("finished calculation", result.toString().length);
      await postResult(config)({
        ...msg.json,
        finishedAt: new Date(),
        output: result.toString(),
      });
      log("posted result to api");
      await sqs.deleteMessage(msg);
      log("deleted message from queue");
    } catch (err) {
      error("err", err);
    }
    working = false;
  }
}
