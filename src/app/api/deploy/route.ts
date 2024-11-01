// app/api/deploy/route.ts
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const secret = req.headers.get("x-vercel-secret");

  if (secret !== process.env.DEPLOY_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    // Vercel Deployment Hook 호출하여 배포 시작
    const deployHookUrl = process.env.DEPLOY_HOOK_URL!;
    await axios.post(deployHookUrl);
    return NextResponse.json({ message: "Deployment started successfully" }, { status: 200 });
  } catch (error) {
    console.error("Deployment failed:", error);
    return NextResponse.json({ message: "Deployment failed" }, { status: 500 });
  }
}
