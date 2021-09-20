import { RequestHandler } from "express";
import { Item, updateFractorial } from "../../db/factorial";
import { ItemEventEmitter } from "../../db/ItemEventEmitter";


export function putFactorial(ee: ItemEventEmitter): RequestHandler<
  { id: string },
  Item,
  Partial<Item>
> {
  return  async function (req, res) {
    console.log("put");
    const id = Number(req.params.id);
    const item: Partial<Item> = req.body;
    const newItem = await updateFractorial(id, item);
    ee.emit("updated", newItem);
    res.status(200);
    res.json(newItem);
  }
}
