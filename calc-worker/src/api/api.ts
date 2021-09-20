import fetch from "node-fetch";
import { Config } from "../config";
import { Job } from "../interfaces";

export function postResult(config: Config) {
  return async function (item: Partial<Job> & Pick<Job, "id">) {
    const url = `${config.API_ENDPOINT}/factorial/${item.id}`;
    const body = JSON.stringify(item);
    return await fetch(url, {
      method: "PUT",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
