import { backing_track_array, voicemodel_uuid_array } from "@/constants";
import { CheckLyricsVersionModel } from "@/model/CheckLyricsVersionModel";
import { GetSongDataModel } from "@/model/GetSongDataModel";
import { UpdateSongModel } from "@/model/UpdateSongModel";
import {
  I_UberduckGenerateSong,
  UberduckGenerateSong,
} from "@/utils/UberduckGenerateSong";
import { Request, Response } from "express";

interface I_Request {
  regId: number;
  songId: number;
  lyricsId: string;
  variant: number;
  voice: string;
  language: string;
}

export const GenerateSongController = async (req: Request, res: Response) => {
  const { lyricsId, regId, songId, variant, voice, language }: I_Request =
    req.body;

  const requiredFields: I_Request = {
    lyricsId,
    regId,
    songId,
    variant,
    voice,
    language,
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
    const songData = await GetSongDataModel({
      songId: String(songId),
      lyricsId: String(lyricsId),
      regId: String(regId),
    });

    if (!songData) {
      res.status(400).send({
        success: false,
        message: "Something went wrong.",
      });
      return;
    }

    const generateSongParam: I_UberduckGenerateSong = {
      lyrics: [songData.pLyrics.split("\n\n")],
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
        message: songData.pMsg,
        senderName: "Mitr",
        receiverName: songData.pToName,
        language: language,
      },
      render_video: true,
    };

    const songGenerationUberduckData = await UberduckGenerateSong(
      generateSongParam
    );

    if (!songGenerationUberduckData.render_video_response) {
      res.status(400).send({
        error: "Something went wrong.",
        success: false,
      });
      return;
    }

    const updateVideoModel = await UpdateSongModel({
      APIVideoReqJson: JSON.stringify(generateSongParam),
      songId,
      variant,
      voice: voice,
      videoUuid: songGenerationUberduckData.render_uuid,
      mixLink: songGenerationUberduckData.mix_url,
      vocalLink: songGenerationUberduckData.vocals_url,
      videoLink: songGenerationUberduckData.render_video_response,
      videoTitle: songGenerationUberduckData.title,
    });

    if (!updateVideoModel) {
      res.status(400).send({
        error: "Something went wrong.",
        success: false,
      });
      return;
    }

    res.status(200).send({
      data: songGenerationUberduckData.render_video_response,
      success: true,
    });
  } catch (error) {
    res.status(400).send({
      error: error,
      success: false,
    });
    return;
  }
};
