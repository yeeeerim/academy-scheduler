import { google } from "googleapis";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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
    const cookieStore = cookies();
    const spreadsheetId = cookieStore.get("authToken")?.value;
    const values = [];
    for (let i = 1; i <= 5; i++) {
      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `자습 교재 현황${i}!k6`,
        });
        values.push(response.data.values[0][0]);
      } catch (e) {}
    }
    return NextResponse.json({
      selfStudy: values,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.error();
  }
}
export const revalidate = 0;
