import express from "express";
import cors from "cors";
import { health } from "./routes/health";
import { getFactorial } from "./routes/factorial/getFactorial";
import { postFactorial } from "./routes/factorial/postFactorial";
import { putFactorial } from "./routes/factorial/putFactorial";

const PORT = process.env.PORT || 8081;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", health);

app.get("/factorial", getFactorial);
app.post("/factorial", postFactorial);
app.put("/factorial/:id", putFactorial);

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
