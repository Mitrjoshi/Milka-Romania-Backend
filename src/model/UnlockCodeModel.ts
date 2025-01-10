import dbConfig from "@/configs/dbConfig";
import sql from "mssql";

export interface I_RequestUnlockCode {
  code: string;
}

interface I_Response {
  pVideoLink: string;
  pVideoTitle: string;
  pFromName: string;
  pToName: string;
  pMsg: string;
  pSongID: number;
  pUnlockID: number;
}

export const UnlockCodeModel = async (
  params: I_RequestUnlockCode
): Promise<I_Response | false> => {
  let connection;

  try {
    connection = await sql.connect(dbConfig);
    const request = new sql.Request()
      .input("pCode", sql.NVarChar, params.code)

      .output("pVideoLink", sql.NVarChar)
      .output("pFromName", sql.NVarChar)
      .output("pToName", sql.NVarChar)
      .output("pMsg", sql.NVarChar)
      .output("pSongID", sql.Int)
      .output("pUnlockID", sql.Int);

    const response = await request.execute("dbo.usp_checkCodeVideo");

    return response.output as I_Response;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    if (connection && connection.connected) {
      await connection.close();
    }
  }
};
