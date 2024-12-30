import { I_RequestHitLog } from "./AddHitLogModel";
import sql from "mssql";
import dbConfig from "@/configs/dbConfig";
import { T_Country } from "@/utils/ConsultixOperations";

export interface I_RequestRegisterBody extends I_RequestHitLog {
  firstName: string;
  lastName: string;
  email: string;
  terms: boolean;
  promo: boolean;
  market: T_Country;
  mobile?: string;
  utm_camp?: string;
  utm_content?: string;
  utm_medium?: string;
  utm_src?: string;
  utm_term?: string;
}

interface I_Response {
  pRegID: number;
  pFound: boolean;
}

export const RegisterModel = async (
  params: I_RequestRegisterBody
): Promise<I_Response | false> => {
  let connection;

  try {
    connection = await sql.connect(dbConfig);
    const request = new sql.Request()
      .input("pDevice", sql.NVarChar, params.device)
      .input("pOS", sql.NVarChar, params.os)
      .input("pBrowser", sql.NVarChar, params.browser)
      .input("pIP", sql.NVarChar, params.ip)

      .input("pMarket", sql.NVarChar, params.market)

      .input("pFirstName", sql.NVarChar, params.firstName)
      .input("pLastName", sql.NVarChar, params.lastName)
      .input("pEmailID", sql.NVarChar, params.email)

      .input("pTerms", sql.Bit, params.terms ? 1 : 0)
      .input("pPromo", sql.Bit, params.promo ? 1 : 0)

      .input("utm_campaign", sql.NVarChar, params.utm_camp)
      .input("utm_content", sql.NVarChar, params.utm_content)
      .input("utm_medium", sql.NVarChar, params.utm_medium)
      .input("utm_source", sql.NVarChar, params.utm_src)
      .input("utm_term", sql.NVarChar, params.utm_term)

      .output("pRegID", sql.Int)
      .output("pFound", sql.Bit);

    const res = await request.execute("dbo.usp_reg");

    return res.output as I_Response;
  } catch (err) {
    return false;
  } finally {
    if (connection && connection.connected) {
      await connection.close();
    }
  }
};
