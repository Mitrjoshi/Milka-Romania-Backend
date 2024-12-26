import { GetSongDataModel } from "@/model/GetSongDataModel";
import { UpdateSongModel } from "@/model/UpdateSongModel";
import { Request, Response } from "express";
import {
  CustomPipelineGenerateSong,
  I_SongRequest,
} from "@/utils/CustomPipelineApi";

interface I_Request {
  regId: number;
  songId: number;
  lyricsId: string;
  variant: string;
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
    typeof variant !== "string"
  ) {
    const errors = [];
    if (typeof regId !== "number") errors.push("regId should be a number");
    if (typeof songId !== "number") errors.push("songId should be a number");
    if (typeof variant !== "string") errors.push("variant should be a string");

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

    const generateSongParam: I_SongRequest = {
      lyrics: songData.pLyrics.toString(),
      msg: songData.pMsg,
      region: language.toLowerCase(),
      receiverName: songData.pToName,
      senderName: songData.pFromName,
      tag: String(songId),
      trackID: Number(songData.pTrackID),
      msgCode: variant,
    };

    const songGenerationResponse = await CustomPipelineGenerateSong(
      generateSongParam
    );

    const updateVideoModel = await UpdateSongModel({
      songId,
    });

    if (!songGenerationResponse.success) {
      res.status(400).send({
        error: "Something went wrong.",
        success: false,
      });
      return;
    }

    res.status(200).send({
      success: true,
      data: {
        status: songGenerationResponse.message,
        msg: songData.pMsg,
        receiverName: songData.pToName,
        senderName: songData.pFromName,
        newSongId: songGenerationResponse.songID,
      },
    });
  } catch (error) {
    res.status(400).send({
      error: error,
      success: false,
    });
    return;
  }
};
