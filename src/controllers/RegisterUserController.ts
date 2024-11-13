import {
  I_RequestRegisterBody,
  RegisterModel,
} from "@/model/RegisterUserModel";
import { Request, Response } from "express";

export const RegisterUserController = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    terms,
    promo,
    browser,
    device,
    os,
    market,
  }: I_RequestRegisterBody = req.body;

  const requiredFields: Partial<I_RequestRegisterBody> = {
    firstName,
    lastName,
    email,
    terms,
    promo,
    browser,
    device,
    ip: req.ip || "0",
    os,
    market,
  };

  const missingFields = Object.keys(requiredFields).filter(
    (key) => requiredFields[key as keyof I_RequestRegisterBody] === undefined
  );

  if (missingFields.length > 0) {
    res.status(400).send({
      error: `Missing required fields: ${missingFields.join(", ")}`,
      success: false,
    });
  }

  const modelRes = await RegisterModel(req.body);

  if (!modelRes) {
    res.status(400).send({ error: "Something went wrong", success: false });
    return;
  }

  res.status(200).send({
    data: {
      regId: modelRes.pRegID,
      userFound: modelRes.pFound,
    },
    success: true,
  });
};
