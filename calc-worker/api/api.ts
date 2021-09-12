import fetch from "node-fetch";
import { Job } from "../interfaces";

const API_ENDPOINT = process.env.API_ENDPOINT || "http://localhost:8081";

export async function postResult(item: Partial<Job> & Pick<Job, "id">) {
  const url = `${API_ENDPOINT}/factorial/${item.id}`;
  const body = JSON.stringify(item);
  console.log("put", `${API_ENDPOINT}/factorial/${item.id}`, body);
  await fetch(url, {
    method: "PUT",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
