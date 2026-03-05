import { NextResponse } from "next/server";

interface WebhookPayload {
  url?: string;
  text: string;
  platform: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as WebhookPayload;

    if (!body.text || !body.platform) {
      return NextResponse.json(
        { error: "Missing required fields: text, platform" },
        { status: 400 },
      );
    }

    const validPlatforms = ["x", "substack", "linkedin", "rss", "manual"];
    if (!validPlatforms.includes(body.platform)) {
      return NextResponse.json(
        {
          error: `Invalid platform. Must be one of: ${validPlatforms.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // TODO: Insert into raw_ingestions table with workspace context
    console.log("[Ingest Webhook] Received payload:", {
      url: body.url ?? null,
      text: body.text.slice(0, 100) + (body.text.length > 100 ? "..." : ""),
      platform: body.platform,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Ingestion received",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }
}
