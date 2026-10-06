import { NextResponse } from "next/server";

// Valid channel targets
type AllowedChannel = "sell" | "trade" | "looking_for" | "bulk" | "test";

// Channel-specific styling for instant visual distinction in a single channel
const channelConfig: Record<
  AllowedChannel,
  {
    botName: string;
    avatarUrl: string;
    color: number;
    badge: string;
    tagEmoji: string;
  }
> = {
  sell: {
    botName: "Manaforge • VERKAUF 🟢",
    avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png",
    color: 0x10b981, // Emerald Green
    badge: "VERKAUF (SOFORTKAUF)",
    tagEmoji: "🟢",
  },
  trade: {
    botName: "Manaforge • TAUSCH 🟣",
    avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png",
    color: 0xa855f7, // Royal Purple / Violet
    badge: "1:1 KARTEN-TAUSCH",
    tagEmoji: "🟣",
  },
  looking_for: {
    botName: "Manaforge • GESUCH 🔵",
    avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png",
    color: 0x06b6d4, // Cyan / Sky Blue
    badge: "SUCHANFRAGE (WANT)",
    tagEmoji: "🔵",
  },
  bulk: {
    botName: "Manaforge • ANKAUF 📦",
    avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png",
    color: 0xf59e0b, // Amber / Lava Orange
    badge: "SAMMLUNG-ANKAUF",
    tagEmoji: "🟠",
  },
  test: {
    botName: "Manaforge • TEST-SIGNAL 🧪",
    avatarUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/safari-ball.png",
    color: 0x6366f1, // Indigo
    badge: "TEST-SIGNAL",
    tagEmoji: "⚪",
  },
};

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

    // Resolve webhook URL strictly from server environment variables:
    // Allows 1 master webhook (DISCORD_WEBHOOK_URL) or specific channel overrides
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
      return NextResponse.json(
        {
          success: false,
          error: "Auf dem Server ist weder DISCORD_WEBHOOK_URL noch eine spezifische Webhook-URL konfiguriert.",
          configured: false,
        },
        { status: 404 }
      );
    }

    // Ensure target URL is strictly a discord.com domain
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

    const cfg = channelConfig[channel as AllowedChannel];

    // Sanitize and style embed data with distinctive branding
    const sanitizedEmbed = embed
      ? {
          author: {
            name: `${cfg.tagEmoji} ${cfg.badge} • MANAFORGE MARKTPLATZ`,
            icon_url: cfg.avatarUrl,
          },
          title: String(embed.title || "").slice(0, 256),
          description: String(embed.description || "").slice(0, 2048),
          color: typeof embed.color === "number" ? embed.color : cfg.color,
          fields: Array.isArray(embed.fields)
            ? embed.fields.slice(0, 12).map((f: { name?: string; value?: string; inline?: boolean }) => ({
                name: String(f.name || "").slice(0, 256),
                value: String(f.value || "").slice(0, 1024),
                inline: Boolean(f.inline),
              }))
            : [],
          image: embed.image?.url ? { url: String(embed.image.url) } : undefined,
          footer: { text: "Manaforge Community • Pokémon TCG Hub" },
          timestamp: new Date().toISOString(),
        }
      : undefined;

    const payload = {
      username: cfg.botName,
      avatar_url: cfg.avatarUrl,
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

    return NextResponse.json({
      success: true,
      message: `Erfolgreich als '${cfg.badge}' an Discord übermittelt.`,
    });
  } catch (error) {
    console.error("Secure Discord dispatcher error:", error);
    return NextResponse.json(
      { success: false, error: "Interner Verarbeitungsfehler." },
      { status: 500 }
    );
  }
}
