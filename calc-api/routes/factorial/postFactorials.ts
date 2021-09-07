import { RequestHandler } from "express";
import { sendJSON } from "../../aws/sqs";

interface ReqBody {
  input: number;
}

export const postFactorial: RequestHandler<{}, any, ReqBody> = async (
  req,
  res
) => {
  const { input } = req.body;
  const message = {
    version: "v1",
    input,
  };
  sendJSON(message);
  res.sendStatus(200);
};
