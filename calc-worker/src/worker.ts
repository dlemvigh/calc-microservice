import { SqsClient } from "./aws/sqs";
import { ApiClient } from "./api/api";
import { Factorial } from "./api/calc";
import { Config } from "./config";

export function worker(
  config: Config,
  sqs: SqsClient,
  factorial: Factorial,
  client: ApiClient
) {
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
      return false;
    }

    try {
      working = true;
      const msg = await sqs.receiveMessage();
      log("received message from queue", msg);
      await client.postResult({
        id: msg.json.id,
        calcStartedAt: new Date(),
      });
      log("started calculation");
      const result = await factorial(msg.json.input);
      log("finished calculation");
      await client.postResult({
        id: msg.json.id,
        finishedAt: new Date(),
        output: result.toString(),
      });
      log("posted result to api");
      await sqs.deleteMessage(msg);
      log("deleted message from queue");
      return true;
    } catch (err) {
      error("err", err);
    } finally {
      working = false;
    }
  };
}
