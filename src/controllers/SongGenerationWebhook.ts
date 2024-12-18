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
    if (status === "completed") {
      //   const updateVideoModel = await UpdateSongModel({
      //     songId,
      //     status,
      //     videoURL,
      //     errMsg,
      //   });

      //   if (!updateVideoModel) {
      //     res.status(400).send({
      //       success: false,
      //     });
      //     return;
      //   }

      res.status(200).send({
        success: true,
      });

      return;
    } else {
      res.status(400).send({
        success: false,
      });
      return;
    }
  } catch (error) {
    res
      .status(400)
      .send({ message: "Something went wrong.", success: false, error });
  }
};
