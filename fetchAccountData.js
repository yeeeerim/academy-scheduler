import { writeFileSync } from "fs";
import { join } from "path";
import path from "path";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.resolve();

async function fetchData() {
  try {
    const SPREADSHEET_ID = "1o5nTdjfNYe_DseZjAYIy24hxJefdQqFy_DGQl7na2iQ";
    const RANGES = [
      "학생 관리!C6:C",
      "학생 관리!G6:G",
      "학생 관리!L6:L",
      "학생 관리!M6:M",
    ];

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: SPREADSHEET_ID,
      ranges: [RANGES],
    });

    // Extract data from each column
    const nameData = response.data.valueRanges?.[0]?.values || [];
    const sheetIdData = response.data.valueRanges?.[1]?.values || [];
    const idData = response.data.valueRanges?.[2]?.values || [];
    const passwordData = response.data.valueRanges?.[3]?.values || [];

    // Combine data into JSON structure
    const combinedData = nameData.map((_, index) => ({
      name: nameData[index][0],
      sheetId: sheetIdData[index][0],
      id: idData[index][0],
      password: passwordData[index][0],
    }));

    // Write the data to a JSON file
    const filePath = join(__dirname, "src/account", "data.json");
    writeFileSync(filePath, JSON.stringify(combinedData, null, 2));
    console.log("Data saved successfully");
  } catch (error) {
    console.error("Failed to fetch and save data:", error);
  }
}

fetchData();
