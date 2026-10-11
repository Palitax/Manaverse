import { NextRequest, NextResponse } from "next/server";
import { generateSlabImageBuffer } from "@/lib/discord-slab-generator";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const name = searchParams.get("name") || "Pokémon Sammelkarte";
    const set = searchParams.get("set") || undefined;
    const cardNumber = searchParams.get("cardNumber") || undefined;
    const condition = searchParams.get("condition") || "NM";
    const language = searchParams.get("language") || "DE";
    const type = searchParams.get("type") || "sell";
    const price = searchParams.get("price") || undefined;
    const photoUrl = searchParams.get("photo") || searchParams.get("photoUrl") || undefined;
    const username = searchParams.get("user") || searchParams.get("username") || "Manaforge Trainer";

    const slabPng = await generateSlabImageBuffer({
      name,
      set,
      cardNumber,
      condition,
      language,
      type,
      price,
      photoUrl,
      username,
    });

    return new NextResponse(new Uint8Array(slabPng), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
      },
    });
  } catch (error) {
    console.error("Slab image generation error:", error);
    return NextResponse.json(
      { error: "Slab-Bild konnte nicht generiert werden." },
      { status: 500 }
    );
  }
}
