import dbConfig from "@/configs/dbConfig";
import sql from "mssql";

export interface I_RequestGetCode {
  regId: string;
  songId: string;
}

interface I_Response {
  pCode: string;
}

export const GetCodeModel = async (
  params: string
): Promise<I_Response | false> => {
  let connection;

  try {
    connection = await sql.connect(dbConfig);
    const request = new sql.Request()
      .input("pSongID", sql.Int, params)

      .output("pCode", sql.NVarChar);

    const response = await request.execute("dbo.usp_getCode");
    return response.output as I_Response;
  } catch (err) {
    return false;
  } finally {
    if (connection && connection.connected) {
      await connection.close();
    }
  }
};
