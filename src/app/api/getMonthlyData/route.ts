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
    const ranges = [`전체 일정!B4:H25`, `전체 일정!B27:H48`];

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

    // Extract values and merged cell information
    const values2 =
      response.data.sheets?.[0].data?.[1].rowData?.map(
        (row) => row.values?.map((cell) => cell.formattedValue || "") || []
      ) || [];

    // const mergedCells2 = response.data.sheets?.[1].merges || []; // Get merged cells

    return NextResponse.json({ data: values, data2: values2, mergedCells });

    // const [value1, value2, ...rest] = response.data.valueRanges;

    // return NextResponse.json({ data: [value1, value2] });
  } catch (error) {
    throw new Error("Error fetching data from Google Spreadsheet");
  }
}
