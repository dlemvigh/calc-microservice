import express from "express";
import cors from "cors";

import { health } from "./routes/health";
import { getFactorial } from "./routes/factorial/getFactorial";
import { postFactorial } from "./routes/factorial/postFactorial";
import { putFactorial } from "./routes/factorial/putFactorial";
import websockets from "./routes/websockets";
import { config } from "./config";
import { sqsClient } from "./aws/sqs";
import { ItemEventEmitter } from "./db/ItemEventEmitter";
import { EventEmitter } from "events";
import { factorialRepository } from "./db/factorial";
// dependencies
const sqs = sqsClient(config);
const itemsEventEmitter: ItemEventEmitter = new EventEmitter();

const app = express();
app.use(cors());
app.use(express.json({ limit: "25mb" }));

app.get("/health", health);

app.get("/factorial", getFactorial(config, factorialRepository));
app.post(
  "/factorial",
  postFactorial(sqs, itemsEventEmitter, factorialRepository)
);
app.put("/factorial/:id", putFactorial(itemsEventEmitter, factorialRepository));

const server = app.listen(config.PORT, () => {
  console.log(`server listening to port ${config.PORT}`);
});

websockets(server as any, itemsEventEmitter);

async function close(signal: NodeJS.Signals) {
  console.log(`Received signal to close ${signal}`);
  await server.close();
  process.exit();
}

process.on("SIGINT", close);
process.on("SIGTERM", close);
