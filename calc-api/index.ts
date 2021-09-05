import express from "express";

const app = express();

const PORT = process.env.PORT || 8081;

app.get("/health", (req, res) => {
  res.status(200);
  res.send("Calculation API is health");
});

app.get("/factorial", async (req, res) => {});

app.post("/factorial", async (req, res) => {});

app.put("/factorial", async (req, res) => {});

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
