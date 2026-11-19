import React from "react";
import { Languages, Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Sprach-Kennzeichnung ohne Emoji-Flaggen.
 * Emoji-Flaggen rendern je nach Betriebssystem unterschiedlich (Windows zeigt nur Buchstaben)
 * und wirken unruhig. Stattdessen: präzise CSS-Mikroflaggen + ISO-Code in Mono-Typografie.
 */

export interface LanguageMeta {
  code: string;
  label: string;
  flag?: string;
}

const FLAG_BACKGROUNDS: Record<string, string> = {
  DE: "linear-gradient(to bottom, #111 0 33.33%, #dd0000 33.33% 66.66%, #ffce00 66.66%)",
  FR: "linear-gradient(to right, #0055a4 0 33.33%, #f5f5f5 33.33% 66.66%, #ef4135 66.66%)",
  IT: "linear-gradient(to right, #009246 0 33.33%, #f5f5f5 33.33% 66.66%, #ce2b37 66.66%)",
  ES: "linear-gradient(to bottom, #aa151b 0 25%, #f1bf00 25% 75%, #aa151b 75%)",
  JP: "radial-gradient(circle at 50% 50%, #bc002d 0 27%, #f5f5f5 29%)",
  CN: "radial-gradient(circle at 27% 32%, #ffde00 0 15%, #de2910 17%)",
  KR: "radial-gradient(circle at 50% 50%, transparent 0 25%, #f5f5f5 27%), linear-gradient(to bottom, #cd2e3a 50%, #0047a0 50%)",
  EN: "linear-gradient(to right, transparent 43%, #c8102e 43% 57%, transparent 57%), linear-gradient(to bottom, transparent 38%, #c8102e 38% 62%, transparent 62%), linear-gradient(to right, transparent 36%, #f5f5f5 36% 64%, transparent 64%), linear-gradient(to bottom, transparent 28%, #f5f5f5 28% 72%, transparent 72%), #012169",
};

export const LANGUAGE_META: Record<string, LanguageMeta> = {
  DE: { code: "DE", label: "Deutsch", flag: FLAG_BACKGROUNDS.DE },
  EN: { code: "EN", label: "Englisch", flag: FLAG_BACKGROUNDS.EN },
  JP: { code: "JP", label: "Japanisch", flag: FLAG_BACKGROUNDS.JP },
  KR: { code: "KR", label: "Koreanisch", flag: FLAG_BACKGROUNDS.KR },
  CN: { code: "CN", label: "Chinesisch", flag: FLAG_BACKGROUNDS.CN },
  FR: { code: "FR", label: "Französisch", flag: FLAG_BACKGROUNDS.FR },
  IT: { code: "IT", label: "Italienisch", flag: FLAG_BACKGROUNDS.IT },
  ES: { code: "ES", label: "Spanisch", flag: FLAG_BACKGROUNDS.ES },
  Egal: { code: "ALLE", label: "Beliebig" },
  ALL: { code: "ALLE", label: "Alle Sprachen" },
  OTHER: { code: "INT", label: "Sonstige" },
};

export function getLanguageMeta(lang?: string | null): LanguageMeta {
  const key = (lang || "DE").toString();
  return (
    LANGUAGE_META[key] ||
    LANGUAGE_META[key.toUpperCase()] || { code: key.toUpperCase().slice(0, 4), label: key }
  );
}

/** Reiner Sprachcode (z. B. für die weiße Slab-Plakette) */
export function getLanguageCode(lang?: string | null): string {
  return getLanguageMeta(lang).code;
}

export function FlagSwatch({
  lang,
  className,
}: {
  lang?: string | null;
  className?: string;
}) {
  const meta = getLanguageMeta(lang);
  if (!meta.flag) {
    const Icon = meta.code === "INT" ? Globe2 : Languages;
    return <Icon aria-hidden className={cn("w-3.5 h-3.5 text-ink-subtle flex-shrink-0", className)} />;
  }
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block w-[15px] h-[10px] rounded-[2px] flex-shrink-0 ring-1 ring-black/20 shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.25)]",
        className
      )}
      style={{ background: meta.flag }}
    />
  );
}

interface LanguageTagProps {
  lang?: string | null;
  /** Zeigt den ausgeschriebenen Sprachnamen statt nur des Codes */
  showLabel?: boolean;
  /** "dark" für dunkle Flächen, "plain" ohne Rahmen */
  variant?: "dark" | "plain";
  className?: string;
}

export function LanguageTag({ lang, showLabel = false, variant = "dark", className }: LanguageTagProps) {
  const meta = getLanguageMeta(lang);
  return (
    <span
      title={meta.label}
      className={cn(
        "inline-flex items-center gap-1.5 leading-none whitespace-nowrap",
        variant === "dark" &&
          "px-2 py-1 rounded-md bg-white/[0.04] border border-hairline text-ink-muted",
        className
      )}
    >
      <FlagSwatch lang={lang} />
      {showLabel ? (
        <span className="text-[11px] font-semibold">{meta.label}</span>
      ) : (
        <span className="font-mono text-[10px] font-semibold tracking-[0.08em]">{meta.code}</span>
      )}
    </span>
  );
}
