import { RequestHandler } from "express";
import { Config } from "../../config";
import { FactorialRepository } from "../../db/factorial";
import { trunkOutput } from "./util";

export function getFactorial(
  config: Config,
  repo: FactorialRepository
): RequestHandler {
  return async function (req, res) {
    console.log("get");
    const items = await repo.getFactorials();
    const lightItems = items.map(({ output, ...rest }) => ({
      ...rest,
      output: trunkOutput(output, config.MAX_LENGTH),
    }));

    res.status(200);
    res.json(lightItems);
  };
}
