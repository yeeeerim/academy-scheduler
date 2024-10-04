import { google } from "googleapis";
import { NextResponse } from "next/server";

export const fetchCache = "force-no-store";
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
    const ranges = [`출석(1월)!B2:I23`, `출석(2월)!B2:I23`];

    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges,
    });

    // Extract values and merged cell information
    const values = response.data.valueRanges;

    return NextResponse.json({ data: values });
  } catch (error) {
    throw new Error("Error fetching data from Google Spreadsheet");
  }
}
