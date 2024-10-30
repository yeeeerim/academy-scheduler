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

    const tab = "자습 교재 현황";

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${tab}!ag3`,
    });

    const unit = res.data.values[0][0];

    const ranges = ["k6", "v6", "ae6"];

    // TODO: 특이사항 추가
    for (let i = 0; i < unit; i++) {
      const row = 9 + i * 2;
      ranges.push(`d${row}:ac${row}`);
    }

    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges: ranges.map((range) => `${tab}!${range}`),
    });
    const values = response.data.valueRanges;

    const result = {
      subject: values[0].values[0][0],
      level: values[1].values[0][0],
      teacher_name: values[2].values[0][0],
      study_data: [
        ...values.slice(3).map((v) => {
          return {
            name: v.values[0][0],
            progress: {
              completed: Number(v.values[0][3]),
              total: Number(v.values[0][7]),
            },
            wrongAnswers: {
              completed: Number(v.values[0][14]),
              total: Number(v.values[0][18]),
            },
            wrongAnswerNotes: v.values[0][v.values[0].length - 1],
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
