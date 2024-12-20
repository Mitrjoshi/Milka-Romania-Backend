import { UpdateSongModel } from "@/model/UpdateSongModel";
import { Request, Response } from "express";

interface I_Request {
  status: "completed" | "error";
  songId: number;
  videoURL: string;
  errMsg: string | null;
}

export const SongGenerationWebhook = async (
  req: Request<{}, {}, I_Request>,
  res: Response
) => {
  const { songId, status, videoURL, errMsg } = req.body;

  try {
    await UpdateSongModel({
      songId,
      status,
      pVideoError: errMsg as string,
      pVideoLink: videoURL,
    });

    res.status(400).send({
      success: status === "completed" ? true : false,
    });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Something went wrong.", success: false, error });
  }
};
