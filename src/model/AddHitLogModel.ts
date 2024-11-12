import dbConfig from "@/configs/dbConfig";
import sql from "mssql";

export interface I_RequestHitLog {
  browser: string;
  device: string;
  os: string;
  ip: string;
}

export const AddHitLogModel = async (
  params: I_RequestHitLog
): Promise<boolean> => {
  let connection;

  try {
    connection = await sql.connect(dbConfig);
    const request = new sql.Request()
      .input("pDevice", sql.NVarChar, params.device)
      .input("pOS", sql.NVarChar, params.os)
      .input("pBrowser", sql.NVarChar, params.browser)
      .input("pIP", sql.NVarChar, params.ip);

    await request.execute("dbo.usp_addHitLog");
    return true;
  } catch (err) {
    return false;
  } finally {
    if (connection && connection.connected) {
      await connection.close();
    }
  }
};
