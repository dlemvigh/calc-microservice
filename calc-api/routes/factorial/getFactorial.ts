import { RequestHandler } from "express";
import { getFactorials } from "../../db/factorial";
export const getFactorial: RequestHandler = async (req, res) => {
  console.log("get");
  const items = await getFactorials();
  res.status(200);
  res.json(items);
};
