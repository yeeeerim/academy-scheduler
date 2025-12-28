const { writeFileSync } = require("fs");
const { join } = require("path");
const { google } = require("googleapis");
const dotenv = require("dotenv");

dotenv.config();

async function fetchData() {
  try {
    const SPREADSHEET_ID = process.env.NEXT_PUBLIC_ACCOUNT_SHEET_ID;
    const RANGES = [
      "사이트 정보!C6:C", // 이름
      "사이트 정보!F6:F", // 스프레드시트 ID
      "사이트 정보!D6:D", // 아이디
      "사이트 정보!E6:E", // 비밀번호
    ];

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Use batchGet to get both values and rich text
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      ranges: RANGES,
      fields: "sheets.data.rowData.values",
    });

    // Extract data from each column
    const nameData = response.data.sheets[0].data[0].rowData.map(
      (row) => row.values[0]?.formattedValue || null
    );

    const sheetIdData = response.data.sheets[0].data[1].rowData.map(
      (row) => row.values[0]?.formattedValue || null
    );

    const idData = response.data.sheets[0].data[2].rowData.map(
      (row) => row.values[0]?.formattedValue || null
    );

    const passwordData = response.data.sheets[0].data[3].rowData.map(
      (row) => row.values[0]?.formattedValue || null
    );

    // Combine data into JSON structure
    const combinedData = nameData
      .map((_, index) => ({
        name: nameData[index],
        sheetId: sheetIdData[index],
        id: idData[index],
        password: passwordData[index],
      }))
      .filter(
        (value) =>
          value.name &&
          value.name !== "#REF!" &&
          ((value.sheetId && value.sheetId !== "#REF!") ||
            (value.id && value.id !== "#REF!") ||
            (value.password && value.password !== "#REF!"))
      );

    // Write the data to a JSON file
    const filePath = join("/tmp", "data.json");
    writeFileSync(filePath, JSON.stringify(combinedData, null, 2));
    console.log("Data saved successfully");
  } catch (error) {
    console.error("Failed to fetch and save data:", error);
  }
}

fetchData();
