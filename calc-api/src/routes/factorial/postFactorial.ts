import { RequestHandler } from "express";
import { SqsClient } from "../../aws/sqs";
import { createFactorial } from "../../db/factorial";
import { Config } from "../../config";
interface ReqBody {
  input: number;
}

export function postFactorial(sqs: SqsClient): RequestHandler<{}, any, ReqBody> {
  return  async function(req, res) {
    console.log("post");
    const { input } = req.body;
    const item = await createFactorial({ input });
    const message = {
      version: "v1",
      id: item.id,
      input,
    };
    try {
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
  }
}
