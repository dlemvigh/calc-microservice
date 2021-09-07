import { RequestHandler } from "express";

export const getFactorial: RequestHandler = async (req, res) => {
  res.sendStatus(200);
};
