import { supabase, isSupabaseConfigured } from "./client";

/**
 * Komprimiert große Kamera-/Smartphone-Fotos im Browser auf eine scharfe Sammlerkarten-Größe (~150-300 KB),
 * damit KI-Scans, Datenbank-Einträge und Discord-Embeds schnell und stabil geladen werden.
 */
export async function compressCardImage(
  source: File | string,
  maxDimension = 1400,
  quality = 0.85
): Promise<{ blob: Blob; dataUrl: string }> {
  if (typeof window === "undefined") {
    throw new Error("Bildkomprimierung ist nur im Browser verfügbar.");
  }

  const objectUrl =
    typeof source === "string" ? source : URL.createObjectURL(source);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.crossOrigin = "anonymous";
      el.onload = () => resolve(el);
      el.onerror = (err) => reject(err);
      el.src = objectUrl;
    });

    const origW = img.naturalWidth || img.width || 800;
    const origH = img.naturalHeight || img.height || 1100;
    const scale = Math.min(1, maxDimension / Math.max(origW, origH));
    const targetW = Math.max(1, Math.round(origW * scale));
    const targetH = Math.max(1, Math.round(origH * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas-Kontext nicht verfügbar.");
    }

    ctx.drawImage(img, 0, 0, targetW, targetH);
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("JPEG-Konvertierung fehlgeschlagen."))),
        "image/jpeg",
        quality
      );
    });

    return { blob, dataUrl };
  } finally {
    if (typeof source !== "string") {
      URL.revokeObjectURL(objectUrl);
    }
  }
}

/**
 * Lädt ein Kartenfoto in den öffentlichen Supabase Storage Bucket 'card-photos' hoch
 * und gibt die permanente CDN-URL zurück.
 */
export async function uploadCardPhoto(file: File | Blob, userId?: string): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase ist nicht konfiguriert");
  }

  const ext =
    file instanceof File && file.name.includes(".")
      ? (file.name.replace(/[^a-zA-Z0-9.]/g, "_").split(".").pop() || "jpg").toLowerCase()
      : "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
  const folder = userId ? `uploads/${userId}` : "uploads";
  const uniqueName = `card_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${safeExt}`;
  const filePath = `${folder}/${uniqueName}`;

  const { error } = await supabase.storage
    .from("card-photos")
    .upload(filePath, file, {
      contentType: file.type || "image/jpeg",
      cacheControl: "31536000",
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

/**
 * Stellt sicher, dass Base64-Data-URLs komprimiert und – sofern angemeldet –
 * als schnelle öffentliche CDN-URL in Supabase Storage gespeichert werden.
 */
export async function ensureHostedCardPhoto(
  photo: string,
  userId?: string
): Promise<string> {
  const trimmed = photo.trim();
  if (!trimmed || !trimmed.startsWith("data:image/")) {
    return trimmed;
  }

  let compressedDataUrl = trimmed;
  let uploadBlob: Blob | null = null;

  try {
    const compressed = await compressCardImage(trimmed);
    compressedDataUrl = compressed.dataUrl;
    uploadBlob = compressed.blob;
  } catch {
    try {
      const res = await fetch(trimmed);
      uploadBlob = await res.blob();
    } catch {
      uploadBlob = null;
    }
  }

  if (uploadBlob && isSupabaseConfigured && supabase) {
    try {
      const publicUrl = await uploadCardPhoto(uploadBlob, userId);
      if (publicUrl) {
        return publicUrl;
      }
    } catch (err) {
      console.warn("Foto-Upload in Storage fehlgeschlagen, verwende komprimiertes Bild:", err);
    }
  }

  return compressedDataUrl;
}
