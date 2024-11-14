import dbConfig from "@/configs/dbConfig";
import sql from "mssql";

export interface I_RequestSetFlag {
  regId: number | null;
  songId: number;
  type: string;
}

export const SetFlagModel = async (
  params: I_RequestSetFlag
): Promise<boolean> => {
  let connection;

  try {
    connection = await sql.connect(dbConfig);
    const request = new sql.Request()
      .input("pRegID", sql.Int, params.regId)
      .input("pSongID", sql.Int, params.songId)
      .input("pType", sql.NVarChar, params.type);

    await request.execute("dbo.usp_setFlag");
    return true;
  } catch (err) {
    return false;
  } finally {
    if (connection && connection.connected) {
      await connection.close();
    }
  }
};
