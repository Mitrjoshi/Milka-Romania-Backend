import { Request, Response } from "express";
import { GetCodeModel, I_RequestGetCode } from "@/model/GetCodeModel";

export const GetCodeController = async (req: Request, res: Response) => {
  const { regId, songId }: I_RequestGetCode = req.body;

  if (typeof regId !== "number" || typeof songId !== "number") {
    res.json({ message: "Invalid Inputs", success: false });
    return;
  }

  try {
    const result = await GetCodeModel(songId);

    if (!result) {
      res
        .status(400)
        .send({ message: "Something went wrong.", success: false });
      return;
    }

    res.status(200).send({
      data: result.pCode,
      success: true,
    });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Something went wrong.", success: false, error });
  }
};
