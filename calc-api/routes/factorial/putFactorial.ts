import { RequestHandler } from "express";
import { Item, updateFractorial } from "../../db/factorial";

export const putFactorial: RequestHandler<
  { id: string },
  Item,
  Partial<Item>
> = async (req, res) => {
  console.log("put");
  const id = Number(req.params.id);
  const item: Partial<Item> = {
    ...req.body,
    status: "finished",
    finishedAt: new Date(),
  };
  const newItem = await updateFractorial(id, item);

  res.status(200);
  res.json(newItem);
};
