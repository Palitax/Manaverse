<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Projektregeln: Manaforge

## 🇩🇪 Deutsche Sprache (STRIKTE REGEL)
- **Konsequent Deutsch:** Alle UI-Texte, Labels, Buttons, Platzhalter, Beschreibungen, Fehlermeldungen, Dialoge, Badges, Dokumentationen und neu erstellten Inhalte MÜSSEN ausnahmslos auf **Deutsch** verfasst werden.
- **Keine gemischten Sprachen:** Vermeide Denglisch oder unübersetzte englische UI-Strings (z. B. "Kaufen" statt "Buy", "Verkaufen" statt "Sell", "Tauschen" statt "Trade", "Gesucht" statt "Looking For", "Warenkorb" statt "Cart", "Einstellungen" statt "Settings").
- **Konsistente Tonalität:** Klare, moderne und präzise deutsche Formulierungen, die zur Pokémon-/TCG-Community passen.

## 📱 Mobile Responsiveness & WebApp-Tauglichkeit (STRIKTE REGEL)
- **Immer Mobile-First prüfen:** Jede geplante oder umgesetzte UI-Änderung MUSS zwingend auf mobile Endgeräte (Smartphones von 320px bis 430px Breite sowie Tablets) optimiert und geprüft werden.
- **Webapp-Usability:**
  - Ausreichend große Touch-Targets (mindestens 44×44 Pixel für interaktive Buttons und Links).
  - Keine horizontalen Layout-Overflows oder abschneidenden Elemente (`overflow-x: hidden` sauber handhaben, keine festen Pixelbreiten die den Viewport sprengen).
  - Sichere Abstände an Bildschirmrändern (Padding `px-4 sm:px-6`).
  - Mobile Navigationsleiste unten oder saubere Dropdowns für eine intuitive Bedienung wie in einer nativen App.
  - Verwendung dynamischer Viewport-Einheiten (`dvh`) bei Vollbildansichten, um die Adressleiste von mobilen Browsern sauber einzuberechnen.

## 🚀 Automatischer Git Push (STRIKTE REGEL)
- **Immer zu Git pushen:** Nach jedem erfolgreich umgesetzten Feature, Bugfix, Design- oder Code-Update MÜSSEN alle Änderungen und neuen Dateien umgehend mit einer präzisen Commit-Message committed und direkt auf das Remote-Repository gepusht werden (`git push`).
- **Keine offenen Arbeitsstände:** Beende niemals einen Auftrag oder eine Antwort an den User, ohne die vorgenommenen Änderungen committet und gepusht zu haben.


