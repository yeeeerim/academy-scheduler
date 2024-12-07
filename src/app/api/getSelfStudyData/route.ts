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

    const tab = "자습 교재 현황1";

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${tab}!aj6`,
    });

    const unit = res.data.values[0][0];

    const ranges = ["k6", "v6", "ae6", "ai9"];

    for (let i = 0; i < unit; i++) {
      const row = 9 + i * 2;
      ranges.push(`d${row}:ad${row}`);
    }

    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges: ranges.map((range) => `${tab}!${range}`),
    });
    const values = response.data.valueRanges;

    const result = {
      subject: values[0]?.values?.[0]?.[0] || "",
      level: values[1]?.values?.[0]?.[0] || "",
      teacher_name: values[2]?.values?.[0]?.[0] || "",
      feedback: values[3]?.values?.[0]?.[0] || "",
      study_data: [
        ...values.slice(4).map((v) => {
          const row = v.values?.[0] || [];
          return {
            name: row[0] || "",
            progress: {
              completed: Number(row[3]) || 0,
              total: Number(row[7]) || 0,
            },
            wrongAnswers: {
              completed: Number(row[14]) || 0,
              total: Number(row[18]) || 0,
            },
            wrongAnswerNotes: row[25] || "",
            comment: row[26] || "",
          };
        }),
      ],
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
  }
}
export const revalidate = 0;
