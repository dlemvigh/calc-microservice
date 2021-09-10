import fetch from "node-fetch";

const API_ENDPOINT = process.env.API_ENDPOINT || "http://localhost:8081";

export async function postResult(id: number, input: number, output: number) {
  const body = JSON.stringify({ id, input, output });
  await fetch(`${API_ENDPOINT}/factorial/${id}`, {
    method: "PUT",
    body,
  });
}

export async function get() {
  const res = await fetch(`${API_ENDPOINT}/factorial`);
  const json = await res.json();
  console.log("get", json);
}
