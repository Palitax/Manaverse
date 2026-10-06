import { supabase, isSupabaseConfigured } from "./client";

/**
 * Uploads a card photo to the public Supabase Storage bucket 'card-photos'.
 * Returns the permanent public CDN URL for use in listings.
 */
export async function uploadCardPhoto(file: File): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase ist nicht konfiguriert");
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
  const ext = cleanName.split(".").pop() || "jpg";
  const uniqueName = `card_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = `uploads/${uniqueName}`;

  const { error } = await supabase.storage
    .from("card-photos")
    .upload(filePath, file, {
      cacheControl: "31536000", // 1 year cache
      upsert: false,
    });

  if (error) {
    console.error("Storage upload error:", error);
    throw error;
  }

  const { data } = supabase.storage
    .from("card-photos")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
