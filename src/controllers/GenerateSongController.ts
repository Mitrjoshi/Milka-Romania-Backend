import { backing_track_array, voicemodel_uuid_array } from "@/constants";
import { CheckLyricsVersionModel } from "@/model/CheckLyricsVersionModel";
import { I_UberduckGenerateSong } from "@/utils/UberduckGenerateSong";
import { Request, Response } from "express";

interface I_Request {
  regId: number;
  songId: number;
  lyricsId: string;
  variant: number;
  voice: string;
}

export const GenerateSongController = async (req: Request, res: Response) => {
  const { lyricsId, regId, songId, variant, voice }: I_Request = req.body;

  const requiredFields: I_Request = {
    lyricsId,
    regId,
    songId,
    variant,
    voice,
  };

  const missingFields = Object.keys(requiredFields).filter(
    (key) => requiredFields[key as keyof I_Request] === undefined
  );

  if (missingFields.length > 0) {
    res.status(400).send({
      error: `Missing required fields: ${missingFields.join(", ")}`,
      success: false,
    });
    return;
  }

  if (
    typeof regId !== "number" ||
    typeof songId !== "number" ||
    typeof variant !== "number"
  ) {
    const errors = [];
    if (typeof regId !== "number") errors.push("regId should be a number");
    if (typeof songId !== "number") errors.push("songId should be a number");
    if (typeof variant !== "number") errors.push("variant should be a number");

    res.status(400).send({
      error: `Invalid input types: ${errors.join(", ")}`,
      success: false,
    });
    return;
  }

  try {
    const checkVersion = await CheckLyricsVersionModel({
      songId,
    });

    if (!checkVersion) {
      res.status(400).send({
        success: false,
        message: "Something went wrong.",
      });
      return;
    }

    if (!checkVersion.pAllow) {
      res.status(400).send({
        success: false,
        message: "Max Retry Limit Reached.",
      });

      return;
    }

    console.log(checkVersion);

    const generateSongParam: I_UberduckGenerateSong = {
      lyrics: [],
      backing_track:
        backing_track_array[
          Math.floor(Math.random() * backing_track_array.length)
        ],
      voicemodel_uuid:
        voicemodel_uuid_array[
          Math.floor(Math.random() * voicemodel_uuid_array.length)
        ],
      metadata: {
        version: "milka-germany",
        variant: String(variant),
        message: checkVersion.pMsg,
        senderName: "Mitr",
        receiverName: checkVersion.pToName,
        language: checkVersion.pLang,
      },
      render_video: true,
    };

    res.status(200).send("checkVersion");
  } catch (error) {
    res.status(400).send({
      error: `Type of variant should be number`,
      success: false,
    });
    return;
  }
};
