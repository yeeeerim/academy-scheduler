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
    const range = `시간표!B4:I32`;

    // const response = await sheets.spreadsheets.get({
    //   spreadsheetId,
    //   ranges: [range],
    //   // fields: "sheets(data(merges))",
    //   includeGridData: true,
    // });

    // console.log(response);

    // const values = response.data.sheets;

    // Fetch the values and merged cell information
    // const [valuesResponse, mergedCellsResponse] = await Promise.all([
    //   sheets.spreadsheets.values.get({
    //     spreadsheetId,
    //     range, // Adjust as necessary
    //   }),
    //   sheets.spreadsheets.get({
    //     spreadsheetId,
    //     ranges: [range],
    //     includeGridData: true,
    //   }),
    // ]);

    // const values = valuesResponse.data.values || [];
    // const mergedCells = mergedCellsResponse.data.sheets?.[0].merges || [];

    const response = await sheets.spreadsheets.get({
      spreadsheetId,
      ranges: [range],
      includeGridData: true,
    });

    // Extract values and merged cell information
    const values =
      response.data.sheets?.[0].data?.[0].rowData?.map(
        (row) => row.values?.map((cell) => cell.formattedValue || "") || []
      ) || [];

    const mergedCells = response.data.sheets?.[0].merges || []; // Get merged cells

    // return { values, mergedCells };

    return NextResponse.json({ data: values, mergedCells });
  } catch (error) {
    throw new Error("Error fetching data from Google Spreadsheet");
  }
}
