import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { webhookUrl, embed, content } = body;

    // Check if webhook is provided either directly or via environment variable
    const targetWebhook =
      webhookUrl ||
      process.env.DISCORD_WEBHOOK_URL ||
      process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;

    if (!targetWebhook) {
      return NextResponse.json(
        {
          success: false,
          message: "Keine Discord Webhook-URL konfiguriert. Du kannst sie in den Admin-Einstellungen hinterlegen.",
        },
        { status: 400 }
      );
    }

    const payload: {
      content?: string;
      embeds?: unknown[];
      username?: string;
      avatar_url?: string;
    } = {
      username: "Manaverse Bot",
      avatar_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png",
    };

    if (content) payload.content = content;
    if (embed) payload.embeds = [embed];

    const response = await fetch(targetWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { success: false, error: errorText },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, message: "Erfolgreich an Discord gesendet!" });
  } catch (error) {
    console.error("Discord webhook dispatch error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
