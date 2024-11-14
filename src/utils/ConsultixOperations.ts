import axios from "axios";

interface I_Request {
  email: string;
  firstName: string;
  lastName: string;
  promo: boolean;
}

interface I_Response {
  Data: { ConsumerId: string };
  JobId: string;
  HttpStatusCode: number;
  HttpStatusMessage: string;
  StatusCode: number;
  StatusMessage: string;
  IsSuccessful: boolean;
}

export const ConsultixOperations = async (param: I_Request) => {
  try {
    const params = {
      Attributes: [
        { Name: "Email", value: param.email },
        { Name: "Firstname", value: param.firstName },
        { Name: "Lastname", value: param.lastName },
        { Name: "list:MKDE240201_Participants", value: "1" },
        { Name: "list:Milka_Email", value: param.promo ? "1" : "0" },
        {
          Name: "list:Milka_ThirdParty_Consent",
          value: param.promo ? "1" : "0",
        },
        { Name: "list:Privacy_Policy_DE", value: "1" },
      ],
      Transactions: [
        {
          Name: "MKDE240201 Milka Say It With Milka Activation Participation (IN)",
          Parameters: [{ Name: "Group", Value: "1" }],
        },
      ],
    };

    const { data }: { data: I_Response } = await axios.post(
      process.env.CONSULTIX_API_URL as string,
      params,
      {
        headers: {
          Authorization: `Basic ${process.env.CONSULTIX_API_KEY}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    throw error;
  }
};
