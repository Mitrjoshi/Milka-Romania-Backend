import express from "express";
import "dotenv/config";
import cors from "cors";

import { SERVER_ROUTES } from "@/constants";
import { AddHitLogController } from "@/controllers/AddHitLogController";
import { RegisterUserController } from "@/controllers/RegisterUserController";
import { GenerateLyricsController } from "@/controllers/GenerateLyricsController";
import { RegenerateLyricsController } from "@/controllers/RegenerateLyricsController";
import { GenerateSongController } from "@/controllers/GenerateSongController";
import { GetCodeController } from "@/controllers/GetCodeController";
import { UnlockCodeController } from "@/controllers/UnlockCodeController";
import { SetFlagController } from "./controllers/SetFlagController";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://milka-romania-stag-25.onmlab.in",
      "https://milka-czechia-stag-25.onmlab.in",
      "https://milka-slovakia-stag-25.onmlab.in",
      "https://milka-hungary-stag-25.onmlab.in",
      "https://milka-germany-stag-25.onmlab.in",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
    ],
  })
);

//routes
app.post(SERVER_ROUTES.hitLog, AddHitLogController);
app.post(SERVER_ROUTES.register, RegisterUserController);
app.post(SERVER_ROUTES.generateLyrics, GenerateLyricsController);
app.post(SERVER_ROUTES.regenerateLyrics, RegenerateLyricsController);
app.post(SERVER_ROUTES.generateSong, GenerateSongController);
app.post(SERVER_ROUTES.getCode, GetCodeController);
app.post(SERVER_ROUTES.unlockCode, UnlockCodeController);
app.post(SERVER_ROUTES.setFlag, SetFlagController);

export default app;
