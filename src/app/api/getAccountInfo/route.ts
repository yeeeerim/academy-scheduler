import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const sheets = google.sheets({ version: "v4", auth: auth });
    const spreadsheetId = process.env.NEXT_PUBLIC_ACCOUNT_SHEET_ID;

    const ranges = [
      "사이트 정보!C6:C", // 이름
      "사이트 정보!F6:F", // 스프레드시트 ID
      "사이트 정보!D6:D", // 아이디
      "사이트 정보!E6:E", // 비밀번호
    ];

    const res = await sheets.spreadsheets.get({
      spreadsheetId,
      ranges,
      fields: "sheets.data.rowData.values",
    });

    const nameData = res.data.sheets[0].data[0].rowData.map((row) => row.values[0]?.formattedValue || null).filter((value) => value !== null);

    const sheetIdData = res.data.sheets[0].data[1].rowData.map((row) => row.values[0]?.formattedValue || null).filter((value) => value !== null);

    const idData = res.data.sheets[0].data[2].rowData.map((row) => row.values[0]?.formattedValue || null).filter((value) => value !== null);

    const passwordData = res.data.sheets[0].data[3].rowData.map((row) => row.values[0]?.formattedValue || null).filter((value) => value !== null);

    const combinedData = nameData.map((_, index) => ({
      name: nameData[index],
      sheetId: sheetIdData[index],
      id: idData[index],
      password: passwordData[index] && passwordData[index].length > 0 ? 1 : 0,
    }));

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error(error);
  }
}
export const revalidate = 0;
