import { google } from "googleapis";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const days = ["일", "월", "화", "수", "목", "금", "토"];
const daysLength = days.length;

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

    const cookieStore = cookies();
    const spreadsheetId = cookieStore.get("authToken")?.value;

    const ranges = [`출석1!B2`, `출석1!C4:I23`, `출석2!B2`, `출석2!C4:I23`];

    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges,
    });

    // Extract values and merged cell information
    const values = response.data.valueRanges;

    return NextResponse.json({
      title1: values[0].values[0],
      data1: values[1].values
        .map((row: string[], i: number) => {
          const arr = row;
          while (arr.length < daysLength) {
            arr.push("");
          }
          return arr;
        })
        .filter((_, index) => index % 4 !== 3),
      title2: values[2].values[0],
      data2: values[3].values
        .map((row: string[], i: number) => {
          const arr = row;
          while (arr.length < daysLength) {
            arr.push("");
          }
          return arr;
        })
        .filter((_, index) => index % 4 !== 3),
    });
  } catch (error) {
    throw new Error("Error fetching data from Google Spreadsheet");
  }
}
export const revalidate = 0;
