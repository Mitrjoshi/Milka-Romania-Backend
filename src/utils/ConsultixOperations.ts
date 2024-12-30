import axios from "axios";

export type T_Country =
  | "germany"
  | "romania"
  | "czechia"
  | "slovakia"
  | "hungary"
  | "austria";

interface I_Request {
  email: string;
  firstName: string;
  lastName: string;
  promo: boolean;
  market: T_Country;
  mobile?: string;
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

const getMarket = (
  market: "germany" | "romania" | "czechia" | "slovakia" | "hungary" | "austria"
) => {
  switch (market) {
    case "germany":
      return "VGVzdCBLUkFGVC5JUyBWN3xNS0RFMjQwMjAxIE1pbGthIFNheSBJdCBXaXRoIE1pbGthIEFjdGl2YXRpb24=";
    case "romania":
      return "S1JBRlQtUk8gVjd8TUtaWjI1MDIwMSBNaWxrYSBTYXkgSXQgV2l0aCBNaWxrYSBQcm9tb3Rpb24==";
    case "czechia":
      return "S1JBRlQtQ1ogVjd8TUtaWjI1MDIwMSBNaWxrYSBTYXkgSXQgV2l0aCBNaWxrYSBQcm9tb3Rpb24==";
    case "slovakia":
      return "S1JBRlQtU0sgVjd8TUtaWjI1MDIwMSBNaWxrYSBTYXkgSXQgV2l0aCBNaWxrYSBQcm9tb3Rpb24==";
    case "hungary":
      return "S1JBRlQtSFUgVjd8TUtaWjI1MDIwMSBNaWxrYSBTYXkgSXQgV2l0aCBNaWxrYSBQcm9tb3Rpb24==";
    case "austria":
      return "S1JBRlQuQVQgVjd8TUtaWjI1MDIwMSBNaWxrYSBTYXkgSXQgV2l0aCBNaWxrYSBQcm9tb3Rpb24==";
    default:
      return null;
  }
};

export const ConsultixOperations = async (param: I_Request) => {
  try {
    const apiKey =
      "VGVzdCBLUkFGVC5JUyBWN3xNS1paMjUwMjAxIE1pbGthIFNheSBJdCBXaXRoIE1pbGthIFByb21vdGlvbg==";

    console.log({ apiKey });

    const params = {
      Attributes: [
        { Name: "Email", value: param.email },
        { Name: "Firstname", value: param.firstName },
        { Name: "Lastname", value: param.lastName },
        { Name: "MobilePrivate", value: param.mobile || null },
        {
          Name:
            param.market === "germany"
              ? "list:MKDE240201_Participants"
              : "list:MKZZ250201_Participants",
          value: "1",
        },
        { Name: "list:Milka_Email", value: param.promo ? "1" : "0" },
        {
          Name: "list:Milka_ThirdParty_Consent",
          value: param.promo ? "1" : "0",
        },
        {
          Name:
            param.market === "germany"
              ? "list:Privacy_Policy_DE"
              : "list:Privacy_Policy_TLD",
          value: "1",
        },
      ],
      Transactions: [
        {
          Name:
            param.market === "germany"
              ? "MKDE240201 Milka Say It With Milka Activation Participation (IN)"
              : "MKZZ250201 Milka Say It With Milka Promotion Participation (IN)",
          Parameters: [{ Name: "Group", Value: "1" }],
        },
      ],
    };

    const { data }: { data: I_Response } = await axios.post(
      process.env.CONSULTIX_API_URL as string,
      params,
      {
        headers: {
          Authorization: `Basic ${apiKey}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    console.log(error.response.data);

    throw error;
  }
};
