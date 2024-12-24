import sql from "mssql";
import dbConfig from "@/configs/dbConfig";

export interface I_RequestCheckLyricsVersion {
  songId: number;
}

interface I_Response {
  pMsg: string;
  pToName: string;
  pPronoun: string;
  pRelation: string;
  pSpl: string;
  pSpendTime: string;
  pTheyLove: string;
  pHobbies: string;
  pLaugh: string;
  pFavMem: string;
  pLang: string;
  pAllow: boolean;
}

export const CheckLyricsVersionModel = async (
  params: I_RequestCheckLyricsVersion
): Promise<I_Response | false> => {
  let connection;

  try {
    connection = await sql.connect(dbConfig);
    const request = new sql.Request()
      .input("pSongID", sql.Int, params.songId)

      .output("pMsg", sql.NVarChar)
      .output("pToName", sql.NVarChar)
      .output("pPronoun", sql.NVarChar)
      .output("pRelation", sql.NVarChar)
      .output("pSpl", sql.NVarChar)
      .output("pSpendTime", sql.NVarChar)
      .output("pTheyLove", sql.NVarChar)
      .output("pHobbies", sql.NVarChar)
      .output("pLaugh", sql.NVarChar)
      .output("pFavMem", sql.NVarChar)

      .output("pLang", sql.NVarChar)

      .output("pAllow", sql.Bit);

    const res = await request.execute("dbo.usp_checkLyricsVer");

    return res.output as I_Response;
  } catch (err) {
    return false;
  } finally {
    if (connection && connection.connected) {
      await connection.close();
    }
  }
};
