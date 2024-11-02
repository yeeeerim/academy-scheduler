const { writeFileSync } = require("fs");
const { join } = require("path");
const { google } = require("googleapis");
const dotenv = require("dotenv");
dotenv.config();

async function fetchData() {
  try {
    const SPREADSHEET_ID = "1o5nTdjfNYe_DseZjAYIy24hxJefdQqFy_DGQl7na2iQ";
    const RANGES = ["학생 관리!C6:C", "학생 관리!O6:O", "학생 관리!M6:M", "학생 관리!N6:N"];

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
    const nameData = response.data.sheets[0].data[0].rowData.map((row) => row.values[0]?.formattedValue || null).filter((value) => value !== null);

    const sheetIdData = response.data.sheets[0].data[1].rowData.map((row) => row.values[0]?.formattedValue || null).filter((value) => value !== null);

    const idData = response.data.sheets[0].data[2].rowData.map((row) => row.values[0]?.formattedValue || null).filter((value) => value !== null);

    const passwordData = response.data.sheets[0].data[3].rowData.map((row) => row.values[0]?.formattedValue || null).filter((value) => value !== null);

    // Combine data into JSON structure
    const combinedData = nameData.map((_, index) => ({
      name: nameData[index],
      sheetId: sheetIdData[index],
      id: idData[index],
      password: passwordData[index],
    }));

    // Write the data to a JSON file
    const filePath = join("/tmp", "data.json");
    writeFileSync(filePath, JSON.stringify(combinedData, null, 2));
    console.log("Data saved successfully");
  } catch (error) {
    console.error("Failed to fetch and save data:", error);
  }
}

fetchData();
