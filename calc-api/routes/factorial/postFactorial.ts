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
  const { input } = req.body;
  const { id } = await createFactorial({ input });
  const message = {
    version: "v1",
    id,
    input,
  };
  sendJSON(message);
  res.sendStatus(200);
};
