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

const getMarket = (market: T_Country) => {
  switch (market) {
    case "germany":
      return {
        CODE: "DE",
        KEY: "UzFKQlJsUXVSRVVnVmpkOFRVdEVSVEkwTURJd01TQk5hV3hyWVNCVFlYa2dTWFFnVjJsMGFDQk5hV3hyWVNCQlkzUnBkbUYwYVc5dToxYzkzNjhmMTE1MWY0NTMxOTMwMWE5MDBmM2NiYmZlMA==",
      };
    case "romania":
      return {
        CODE: "RO",
        KEY: "UzFKQlJsUXRVazhnVmpkOFRVdGFXakkxTURJd01TQk5hV3hyWVNCVFlYa2dTWFFnVjJsMGFDQk5hV3hyWVNCUWNtOXRiM1JwYjI0PTo5NGYwZGQ2Zjg3YTY0ZmVlOTc1NWY1ZmZkYjUxYmFlYQ==",
      };
    case "czechia":
      return {
        CODE: "CZ",
        KEY: "UzFKQlJsUXRRMW9nVmpkOFRVdGFXakkxTURJd01TQk5hV3hyWVNCVFlYa2dTWFFnVjJsMGFDQk5hV3hyWVNCUWNtOXRiM1JwYjI0PTo1NmFjNzU5MTliOTY0ZGZkYjRlNzkwYTQ5YzVlMDg3Mg==",
      };
    case "slovakia":
      return {
        CODE: "SK",
        KEY: "UzFKQlJsUXRVMHNnVmpkOFRVdGFXakkxTURJd01TQk5hV3hyWVNCVFlYa2dTWFFnVjJsMGFDQk5hV3hyWVNCUWNtOXRiM1JwYjI0PTpjOWQxM2E4MTY1NGI0NjEzYTJjNGUzYzY1ZDI0Zjk0NA==",
      };
    case "hungary":
      return {
        CODE: "HU",
        KEY: "UzFKQlJsUXRTRlVnVmpkOFRVdGFXakkxTURJd01TQk5hV3hyWVNCVFlYa2dTWFFnVjJsMGFDQk5hV3hyWVNCUWNtOXRiM1JwYjI0PTo5ZjAzMjMxMDA5MGM0ODY5ODQ4M2E5ZTdhZmYyOGRkYg==",
      };
    case "austria":
      return {
        CODE: "AT",
        KEY: "UzFKQlJsUXVRVlFnVmpkOFRVdGFXakkxTURJd01TQk5hV3hyWVNCVFlYa2dTWFFnVjJsMGFDQk5hV3hyWVNCUWNtOXRiM1JwYjI0PTphYTUwNjc5ZmU4Mzk0OWU4ODhhZTkyNWMzZDVlODIyMQ==",
      };
    default:
      return null;
  }
};

export const ConsultixOperations = async (param: I_Request) => {
  try {
    const apiKey = getMarket(param.market.toLowerCase() as T_Country);

    // Create the attributes array
    const attributes = [
      { Name: "Email", value: param.email },
      { Name: "Firstname", value: param.firstName },
      { Name: "Lastname", value: param.lastName },
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
        Name: `list:Privacy_Policy_${apiKey?.CODE}`,
        value: "1",
      },
    ];

    if (
      (param.market === "czechia" || param.market === "slovakia") &&
      param.mobile
    ) {
      attributes.push({ Name: "MobilePrivate", value: param.mobile });
    }

    const params = {
      Attributes: attributes,
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
          Authorization: `Basic ${apiKey?.KEY}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    console.log(error.response.data);

    throw error;
  }
};
