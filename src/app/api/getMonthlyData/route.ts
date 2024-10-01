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

    const spreadsheetId = "1xwR133yh4OEcx3zfhdRUkzd6Tfy95aX2yIyAhoEs2PE";
    const range = `전체 일정!B5:H25`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const values = response.data.values;

    return NextResponse.json({ data: values });
  } catch (error) {
    throw new Error("Error fetching data from Google Spreadsheet");
  }
}
