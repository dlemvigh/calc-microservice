import { EventEmitter } from "events";
import { Item } from "./factorial";

export declare class ItemEventEmitter extends EventEmitter {
  on(event: "created", listener: (this: ItemEventEmitter, item: Item) => void): this;
  on(event: "updated", listener: (this: ItemEventEmitter, item: Item) => void): this;
  on(event: "deleted", listener: (this: ItemEventEmitter, item: Item) => void): this;
  emit(event: "created", item: Item): boolean;
  emit(event: "updated", item: Item): boolean;
  emit(event: "deleted", item: Item): boolean;
}