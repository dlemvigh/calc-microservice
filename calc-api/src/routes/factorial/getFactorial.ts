import { RequestHandler } from "express";
import { getFactorials } from "../../db/factorial";
import { Config } from "../../config";

export function trunkOutput(output: string | undefined, maxLength: number) {
  if (output && output.length > maxLength) {
    return output.substr(0, maxLength) + "e" + (output.length - maxLength);
  }
}

export function getFactorial(config: Config): RequestHandler {
  return async function(req, res) {
    console.log("get");
    const items = await getFactorials();
    const lightItems = items.map(({ output, ...rest }) => ({
      ...rest,
      output: trunkOutput(output, config.MAX_LENGTH)
    }));
    
    res.status(200);
    res.json(lightItems);
  
  }
}
