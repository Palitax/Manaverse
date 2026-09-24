import { NextResponse } from "next/server";

// Valid channel targets
type AllowedChannel = "sell" | "trade" | "looking_for" | "bulk" | "test";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { channel, embed, content } = body;

    // Validate channel parameter strictly
    const validChannels: AllowedChannel[] = ["sell", "trade", "looking_for", "bulk", "test"];
    if (!channel || !validChannels.includes(channel)) {
      return NextResponse.json(
        { success: false, error: "Ungültiger oder fehlender Kanal-Typ." },
        { status: 400 }
      );
    }

    // Resolve webhook URL strictly from server environment variables - NEVER from client input!
    let targetWebhookUrl: string | undefined;

    switch (channel) {
      case "sell":
        targetWebhookUrl = process.env.DISCORD_WEBHOOK_SELL || process.env.DISCORD_WEBHOOK_URL;
        break;
      case "trade":
        targetWebhookUrl = process.env.DISCORD_WEBHOOK_TRADE || process.env.DISCORD_WEBHOOK_URL;
        break;
      case "looking_for":
        targetWebhookUrl = process.env.DISCORD_WEBHOOK_LOOKING_FOR || process.env.DISCORD_WEBHOOK_URL;
        break;
      case "bulk":
        targetWebhookUrl = process.env.DISCORD_WEBHOOK_MANACARDS_BULK || process.env.DISCORD_WEBHOOK_URL;
        break;
      case "test":
        targetWebhookUrl = process.env.DISCORD_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_SELL;
        break;
    }

    if (!targetWebhookUrl) {
      // Return safe message without leaking internal paths or configurations
      return NextResponse.json(
        {
          success: false,
          error: "Für diesen Kanal ist auf dem Server keine Webhook-URL konfiguriert.",
          configured: false,
        },
        { status: 404 }
      );
    }

    // Ensure the target URL is strictly a discord.com domain
    try {
      const parsedUrl = new URL(targetWebhookUrl);
      if (
        parsedUrl.protocol !== "https:" ||
        !parsedUrl.hostname.endsWith("discord.com") ||
        !parsedUrl.pathname.startsWith("/api/webhooks/")
      ) {
        return NextResponse.json(
          { success: false, error: "Server-Fehlkonfiguration: Ungültige Discord-Webhook-Domain." },
          { status: 500 }
        );
      }
    } catch {
      return NextResponse.json(
        { success: false, error: "Server-Fehlkonfiguration: Ungültiges URL-Format." },
        { status: 500 }
      );
    }

    // Sanitize embed data
    const sanitizedEmbed = embed
      ? {
          title: String(embed.title || "").slice(0, 256),
          description: String(embed.description || "").slice(0, 2048),
          color: typeof embed.color === "number" ? embed.color : 0x6366f1,
          fields: Array.isArray(embed.fields)
            ? embed.fields.slice(0, 10).map((f: { name?: string; value?: string; inline?: boolean }) => ({
                name: String(f.name || "").slice(0, 256),
                value: String(f.value || "").slice(0, 1024),
                inline: Boolean(f.inline),
              }))
            : [],
          image: embed.image?.url ? { url: String(embed.image.url) } : undefined,
          footer: { text: "Manaforge Community • Discord Sync" },
          timestamp: new Date().toISOString(),
        }
      : undefined;

    const payload = {
      username: "Manaforge Bot",
      avatar_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png",
      content: content ? String(content).slice(0, 2000) : undefined,
      embeds: sanitizedEmbed ? [sanitizedEmbed] : undefined,
    };

    const response = await fetch(targetWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Discord API verweigerte die Anfrage." },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, message: "Erfolgreich an Discord übermittelt." });
  } catch (error) {
    // Never expose stack traces or raw error messages to the client
    console.error("Secure Discord dispatcher error:", error);
    return NextResponse.json(
      { success: false, error: "Interner Verarbeitungsfehler." },
      { status: 500 }
    );
  }
}
