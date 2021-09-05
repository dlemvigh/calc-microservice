import express from "express";
import { health } from "./routes/health";
import { getFactorial } from "./routes/factorial/getFactorial";
import { postFactorial } from "./routes/factorial/postFactorials";
import { putFactorial } from "./routes/factorial/putFactorial";

const app = express();

const PORT = process.env.PORT || 8081;

app.use(express.json());

app.get("/health", health);

app.get("/factorial", getFactorial);
app.post("/factorial", postFactorial);
app.put("/factorial", putFactorial);

const server = app.listen(PORT, () => {
  console.log(`server listening to port ${PORT}`);
});

async function close(signal: NodeJS.Signals) {
  console.log(`Received signal to close ${signal}`);
  await server.close();
  process.exit();
}

process.on("SIGINT", close);
process.on("SIGTERM", close);
