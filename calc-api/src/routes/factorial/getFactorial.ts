import { RequestHandler } from "express";
import { getFactorials } from "../../db/factorial";

const MAX_LENGTH = Number(process.env.MAX_LENGTH) || 20;

function trunkOutput(output: string | undefined) {
  if (output && output.length > MAX_LENGTH) {
    return output.substr(0, MAX_LENGTH) + "e" + (output.length - MAX_LENGTH);
  }
}

export const getFactorial: RequestHandler = async (req, res) => {
  console.log("get");
  const items = await getFactorials();
  const lightItems = items.map(({ output, ...rest }) => ({
    ...rest,
    output: trunkOutput(output),
  }));
  res.status(200);
  res.json(lightItems);
};
