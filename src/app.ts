import express from "express";
import "dotenv/config";
import getGreeting from "@/utils/getGreeting";

const app = express();

app.use(express.json());

const name = process.env.NAME || "World";

app.get("/", (req, res) => {
  res.send(`${getGreeting()}, ${name}`);
});

export default app;
