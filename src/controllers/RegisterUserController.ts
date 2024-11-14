import {
  I_RequestRegisterBody,
  RegisterModel,
} from "@/model/RegisterUserModel";
import { UpdateConsultixModel } from "@/model/UpdateConsultixModel";
import { ConsultixOperations } from "@/utils/ConsultixOperations";
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
    return;
  }

  try {
    const modelRes = await RegisterModel(req.body);

    if (!modelRes) {
      res.status(400).send({ error: "Something went wrong", success: false });
      return;
    }

    const consultixRes = await ConsultixOperations({
      email,
      firstName,
      lastName,
      promo,
    });

    if (consultixRes.IsSuccessful) {
      await UpdateConsultixModel({
        consumerId: consultixRes.Data.ConsumerId,
        jobId: consultixRes.JobId,
        regId: modelRes.pRegID,
      });
    }

    res.status(200).send({
      data: {
        regId: modelRes.pRegID,
        userFound: modelRes.pFound,
      },
      success: true,
    });
  } catch (error) {
    res.status(400).send({ error, success: false });
  }
};
