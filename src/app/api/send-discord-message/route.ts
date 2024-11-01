// app/api/send-discord-message/route.ts
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL!;

  try {
    await axios.post(discordWebhookUrl, {
      content: `!deploy - 배포를 시작합니다.`,
    });
    return NextResponse.json({ message: "Message sent to Discord successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to send message to Discord:", error);
    return NextResponse.json({ message: "Failed to send message to Discord" }, { status: 500 });
  }
}
