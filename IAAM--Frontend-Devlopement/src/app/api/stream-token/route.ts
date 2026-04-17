import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { videoId } = await req.json();

  if (!videoId) {
    return NextResponse.json({ error: "Video ID required" }, { status: 400 });
  }

  let privateKey = process.env.CLOUDFLARE_STREAM_PRIVATE_KEY;
  const keyId = process.env.CLOUDFLARE_STREAM_KEY_ID;

  if (!privateKey || !keyId) {
    return NextResponse.json(
      { error: "Cloudflare Stream configuration missing" },
      { status: 500 }
    );
  }

  try {
    privateKey = Buffer.from(privateKey, 'base64').toString('utf-8');
  } catch (e) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  const token = jwt.sign(
    {
      sub: videoId,
      kid: keyId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    privateKey,
    {
      algorithm: "RS256",
    }
  );

  return NextResponse.json({ token });
}
