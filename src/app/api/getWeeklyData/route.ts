import { google } from "googleapis";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// export const fetchCache = "force-no-store";
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

    const ranges = [`시간표!B4:I32`];

    const response = await sheets.spreadsheets.get({
      spreadsheetId,
      ranges,
      includeGridData: true,
    });

    // Extract values and merged cell information
    const values =
      response.data.sheets?.[0].data?.[0].rowData?.map(
        (row) => row.values?.map((cell) => cell.formattedValue || "") || []
      ) || [];

    const mergedCells = response.data.sheets?.[0].merges || []; // Get merged cells

    return NextResponse.json({ data: values, mergedCells });
  } catch (error) {
    throw new Error("Error fetching data from Google Spreadsheet");
  }
}
export const revalidate = 0;
