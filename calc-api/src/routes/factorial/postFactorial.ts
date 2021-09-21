import { RequestHandler } from "express";
import { SqsClient } from "../../aws/sqs";
import { FactorialRepository } from "../../db/factorial";
import { ItemEventEmitter } from "../../db/ItemEventEmitter";

export interface ReqBody {
  input: number;
}

export function postFactorial(
  sqs: SqsClient,
  ee: ItemEventEmitter,
  repo: FactorialRepository
): RequestHandler<{}, any, ReqBody> {
  return async function (req, res) {
    try {
      // console.log("post", req.body);
      const { input } = req.body;
      const item = await repo.createFactorial({
        input,
        createdAt: new Date(),
        status: "pending",
      });
      ee.emit("created", item);

      const message = {
        version: "v1",
        id: item.id,
        input,
      };

      await sqs.sendJSON(message);
      res.status(200);
      res.json(item);
    } catch (err) {
      res.status(500);
      if (err instanceof Error) {
        res.send(err.message);
      } else {
        res.send(err);
      }
    }
  };
}
