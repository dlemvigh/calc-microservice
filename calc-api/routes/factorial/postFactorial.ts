import { RequestHandler } from "express";
import { sendJSON } from "../../aws/sqs";
import { createFactorial } from "../../db/factorial";

interface ReqBody {
  input: number;
}

export const postFactorial: RequestHandler<{}, any, ReqBody> = async (
  req,
  res
) => {
  console.log("post");
  const { input } = req.body;
  const item = await createFactorial({ input });
  const message = {
    version: "v1",
    id: item.id,
    input,
  };
  sendJSON(message);
  res.status(200);
  res.json(item);
};
