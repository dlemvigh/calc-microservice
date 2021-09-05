import { RequestHandler } from "express";

export const health: RequestHandler = (req, res) => {
  res.status(200);
  res.send("Calculation API is health");
};
