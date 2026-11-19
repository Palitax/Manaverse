# Manaforge Design System (`DESIGN.md`)

Verbindliche Design-Spezifikation für **Manaforge** (Community- & TCG-Marktplatz von Manacards) nach der 9-Säulen-Architektur.

---

## 1. Visual Theme & Atmosphere
- **Polarität:** Tiefes, ruhiges Obsidian-Dark (`#05070c`) mit subtilen, klar abgestuften Flächen statt greller Neon-Verläufe.
- **Atmosphäre:** Minimalistische, hochwertige Sammler-Galerie (inspiriert von physischen Acrylic Graded Slabs, Museums-Vitrinen und präzisen Werkzeug-Interfaces wie Linear & Stripe).
- **Fokus:** Die Pokémon-Karten und das geschützte **Collector-Slab-Gehäuse** stehen visuell immer im Mittelpunkt – die UI tritt ruhig zurück.

---

## 2. Semantic Color Tokens
Definiert als Tailwind-Tokens in [src/app/globals.css](file:///Users/levinrohde/Desktop/_projects/Manaverse/src/app/globals.css) (`@theme`) und typisiert in [src/lib/design-system.ts](file:///Users/levinrohde/Desktop/_projects/Manaverse/src/lib/design-system.ts).

### Surface Ladder & Ink
| Token | Wert | Verwendung |
| :--- | :--- | :--- |
| `canvas` | `#05070c` | Grundfläche hinter allen Seiten |
| `surface-1` | `#0a0d16` | Haupt-Container, Modals, Filter-Docks, Navigationsleisten |
| `surface-2` | `#0f131e` | Eingabefelder, eingebettete Info-Boxen, Tabs |
| `surface-3` | `#151a27` | Erhöhte Bedienelemente, Swap-Indikatoren |
| `surface-4` | `#1c2232` | Aktive Hover-Flächen |
| `hairline` | `rgba(255, 255, 255, 0.08)` | Standard `1px` Rahmen |
| `hairline-strong` | `rgba(255, 255, 255, 0.16)` | Fokus-/Modal-Rahmen, aktive Chips |
| `ink` | `#f4f5f7` | Primärer Text, Headlines |
| `ink-muted` | `#b4bac6` | Sekundärer Fließtext, Labels |
| `ink-subtle` | `#7d8494` | Meta-Angaben, Platzhalter, Eyebrows |
| `discord` | `#5865f2` | Ausschließlich für Discord-Aktionen & -Badges |

### 4-Mode Accent System (Strikt bereichsgebunden)
Jeder Kernbereich trägt **genau eine** Akzentfarbe über Navigation, Seitenkopf, Slab-Preis, Primär-CTAs, Modals und Discord-Embeds:
- **Verkaufen (Eigene Vitrine & Erstellen):** Smaragd (`emerald-400` / `emerald-300`)
- **Kaufen (Sofortkauf-Marktplatz):** Gold (`amber-400` / `amber-300`)
- **Tauschen (1:1 Tausch-Arena):** Violett (`violet-500` / `violet-300`)
- **Gesucht (Gesuche / Kopfgeld):** Orange (`orange-500` / `orange-300`)

### Neutrale Zustände & Status
- **Eigene Karte / Entwurf / Verkauft / Sekundär-Buttons:** Bewusst neutral (`bg-white/[0.04..0.08]` + `border-hairline-strong` + kleiner Modus-Punkt), damit sie nie mit einem Bereichs-Akzent kollidieren.
- **System-Status:** Erfolg `emerald-400`, Warnung `amber-400`, Fehler/Löschen `rose-400`.
- **Neutrale Primär-CTAs** (z. B. Anmelden, Profil speichern, Sammlung einreichen): Hoher Kontrast (`bg-white text-black`).

---

## 3. Typography Hierarchy
- **Display / Seitenkopf:** `28px–36px` (`font-black`, `tracking-[-0.02em]`, `leading-[1.1]`)
- **Eyebrow / Bereichs-Label:** `10px–11px` (`font-bold`, `uppercase`, `tracking-[0.16em–0.18em]`)
- **Card / Modal Title:** `18px–24px` (`font-black`, `tracking-tight`)
- **Body / Controls:** `12px–14px` (`leading-relaxed`, ruhiger Kontrast über `ink-muted`)
- **Zahlen, Preise, Zähler & Sprachcodes:** Immer `tabular-nums` bzw. `font-mono` (`DE`, `JP`, `EN`, `KR`, `CN`).

---

## 4. Component Stylings & Custom Primitives
- **Collector Slab ([collector-slab-card.tsx](file:///Users/levinrohde/Desktop/_projects/Manaverse/src/components/cards/collector-slab-card.tsx)):** Die Acryl-Hülle (`.acrylic-display-slab`, `.slab-header-plate`, `.slab-card-window`, `.slab-bottom-rim`) bleibt architektonisch unangetastet; innere Preis- & Aktionszeilen folgen exakt `listingTheme(card.type)`.
- **Manaforge-Siegel ([verified-seal.tsx](file:///Users/levinrohde/Desktop/_projects/Manaverse/src/components/ui/verified-seal.tsx)):** Eigene geprägte Metall-Rosette (SVG) statt generischer Schild-Icons:
  - Stufe 0 Anwärter (offene Hairline-Rosette) → Stufe 1 Platin → Stufe 2 Kobalt → Stufe 3 Gold → Stufe 4 Rubin → Stufe 5 Prisma.
- **Sprach-Kennzeichnung ([language-tag.tsx](file:///Users/levinrohde/Desktop/_projects/Manaverse/src/components/ui/language-tag.tsx)):** Präzise CSS-Mikroflaggen + `font-mono` ISO-Codes (`DE`, `EN`, `JP`, `KR`, `CN`) – **keine** Betriebssystem-Flaggen- oder Weltkugel-Emojis.
- **Overlays & Feedback ([portal.tsx](file:///Users/levinrohde/Desktop/_projects/Manaverse/src/components/ui/portal.tsx), [toast.tsx](file:///Users/levinrohde/Desktop/_projects/Manaverse/src/components/ui/toast.tsx)):** Alle Modals/Drawer rendern über `<Portal>` direkt in `document.body`; Feedback läuft über `<Toaster />` – **keine** nativen `alert()`-Dialoge.
- **Seiten-Bausteine ([page-shell.tsx](file:///Users/levinrohde/Desktop/_projects/Manaverse/src/components/market/page-shell.tsx)):** `MarketPageHeader` & `MarketEmptyState` sorgen für identische Proportionen auf `/buy`, `/sell`, `/trade` und `/looking-for`.

---

## 5. Layout & Whitespace
- **4px/8px-Basisraster** mit konsistenten Container-Breiten (`max-w-7xl` Marktplatz, `max-w-6xl` Startseite/Admin, `max-w-5xl` Profil/Bulk) und sicherem Rand-Padding (`px-4 sm:px-6 lg:px-8`).
- **Grid-Kollaps:** `4-up` (`xl`) → `3-up` (`lg`) → `2-up` (`sm`) → `1-up` / Swipe-Deck (Mobile).

---

## 6. Elevation & Depth
- Tiefe entsteht durch die **Surface-Ladder** (`canvas` → `surface-1` → `surface-2`) und präzise `1px` Hairlines statt schwerer, bunter Glow-Schatten.
- Ein subtiler oberer Licht-Hairline (`via-white/25`) betont hervorgehobene Banner sparsam.

---

## 7. Do's & Don'ts (Guardrails)
- **Kein `Sparkles`-Icon und keine Glitzer-/Sternenglanz-Symbole:** Strikt verboten in Code, UI und Texten.
- **Keine UI-Emojis als Icons:** Keine Weltkugeln, Flaggen-Emojis, Ampel-Punkte, Flammen oder Glühbirnen als UI-Icons – stattdessen Lucide-Icons, `<FlagSwatch />` und `<VerifiedSeal />`.
- **Keine generischen Regenbogen-/Indigo-KI-Verläufe** auf Überschriften, Buttons oder Bannern.
- **Kein `window.alert()`:** Immer `toast.success / toast.error / toast.info` nutzen.
- **Konsequent Deutsch:** Keine englischen UI-Strings oder Denglisch in Labels und Statusmeldungen.

---

## 8. Responsive & Touch Targets
- Alle interaktiven Controls, Filter, Tabs, Modal-Close-Buttons und Navigationspunkte bieten mindestens **`44×44px`** Touch-Fläche.
- Modals docken auf Smartphones als Bottom-Sheet (`rounded-t-3xl`, `max-h-[92dvh]`) an und zentrieren ab `sm`.
- Mobile Floating Island Navigation respektiert `env(safe-area-inset-bottom)`.

---

## 9. Token-First Iteration
Jede neue Komponente importiert ihre Bereichs- und Neutral-Tokens aus [src/lib/design-system.ts](file:///Users/levinrohde/Desktop/_projects/Manaverse/src/lib/design-system.ts) (`MODE_THEME`, `listingTheme`, `studioTheme`, `BTN_SECONDARY`, `BTN_CLOSE`, `INPUT_BASE`, `MODAL_OVERLAY`, `MODAL_PANEL`) statt eigene Ad-hoc-Farbklassen einzuführen.
