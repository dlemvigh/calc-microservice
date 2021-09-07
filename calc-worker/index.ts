import { receiveMessage } from "./aws/sqs";

async function getMessage() {
  try {
    const msg = await receiveMessage();
    console.log("msg", msg);
  } catch (err) {
    console.error("err", err);
  }
}

getMessage();
