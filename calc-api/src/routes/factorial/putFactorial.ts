import { RequestHandler } from "express";
import { Config } from "../../config";
import { FactorialRepository, Item } from "../../db/factorial";
import { ItemEventEmitter } from "../../db/ItemEventEmitter";
import { trunkOutput } from "./util";

export function putFactorial(
  config: Config,
  ee: ItemEventEmitter,
  repo: FactorialRepository
): RequestHandler<{ id: string }, Item, Partial<Item>> {
  return async function (req, res) {
    console.log("put");
    const id = Number(req.params.id);
    const item: Partial<Item> = req.body;
    const newItem = await repo.updateFractorial(id, item);
    const truckatedItem = {
      ...newItem,
      output: newItem.output && trunkOutput(newItem.output, config.MAX_LENGTH),
    };
    ee.emit("updated", truckatedItem);
    res.status(200);
    res.json(newItem);
  };
}
