import { receiveMessage } from "./aws/sqs";
import { get } from "./api/api";

async function getMessage() {
  try {
    const msg = await receiveMessage();
    console.log("msg", msg);
  } catch (err) {
    console.error("err", err);
  }
}

// getMessage();
get();
