import { RequestHandler } from "express";
import { FactorialRepository, Item } from "../../db/factorial";
import { ItemEventEmitter } from "../../db/ItemEventEmitter";


export function putFactorial(ee: ItemEventEmitter, repo: FactorialRepository): RequestHandler<
  { id: string },
  Item,
  Partial<Item>
> {
  return  async function (req, res) {
    console.log("put");
    const id = Number(req.params.id);
    const item: Partial<Item> = req.body;
    const newItem = await repo.updateFractorial(id, item);
    ee.emit("updated", newItem);
    res.status(200);
    res.json(newItem);
  }
}
