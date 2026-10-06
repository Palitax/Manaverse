"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { HoloAvatarFrame } from "@/components/frames/holo-avatar-frame";
import {
  Crown,
  Settings,
  Send,
  Sparkles,
  Inbox,
  ShieldAlert,
  Lock,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const { currentUser, bulkSubmissions } = useStore();
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [testingChannel, setTestingChannel] = useState<string | null>(null);

  // STRICT ACCESS CONTROL: Only Founder & Admin can view this page
  const hasAdminAccess = currentUser?.role === "founder" || currentUser?.role === "admin";

  if (!hasAdminAccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl glass-panel border border-rose-500/30 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white">Zugriff verweigert (403)</h1>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Dieser Bereich ist ausschließlich für Administratoren und Gründer von Manacards bestimmt. Aus Sicherheitsgründen sind sensible Ankaufsdaten und Webhook-Steuerungen geschützt.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Zurück zum Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleTestChannel = async (channel: "sell" | "trade" | "looking_for" | "bulk") => {
    setTestingChannel(channel);
    setTestStatus(`Sende Test-Signal für '${channel}' an Discord...`);

    const currentName = currentUser?.username || "Admin";
    const currentDiscord = currentUser?.discordUsername || "Levin";

    const sampleEmbeds: Record<string, { title: string; description: string; fields: Array<{ name: string; value: string; inline?: boolean }> }> = {
      sell: {
        title: "Glurak VMAX (Secret Rare #074/073) – Flammende Finsternis",
        description: "Makellose deutsche Karte, direkt aus dem Booster gesleevt und im Toploader gelagert.",
        fields: [
          { name: "Zustand", value: "Near Mint (NM)", inline: true },
          { name: "Sprache", value: "Deutsch (DE)", inline: true },
          { name: "Festpreis", value: "115,00 €", inline: true },
          { name: "Set / Kartennr.", value: "Flammende Finsternis #074/073", inline: true },
          { name: "Anbieter", value: `${currentName} (@${currentDiscord})`, inline: false },
        ],
      },
      trade: {
        title: "Nachtara VMAX (#215/203) – Drachenwandel (Moonbreon)",
        description: "Suche gleichwertigen Tausch gegen Glurak Gold Star oder Rayquaza VMAX Alt Art.",
        fields: [
          { name: "Zustand", value: "Mint (M)", inline: true },
          { name: "Sprache", value: "Englisch (EN)", inline: true },
          { name: "Estimated Trade Value (ETV)", value: "850,00 €", inline: true },
          { name: "Gesuchte Tauschkarten (Wants)", value: "Rayquaza VMAX Alt Art oder Gengar VMAX Alt Art", inline: false },
          { name: "Tauschpartner", value: `${currentName} (@${currentDiscord})`, inline: false },
        ],
      },
      looking_for: {
        title: "Suche: Pikachu mit Grauem Filzhut (Van Gogh Promo)",
        description: "Suche original versiegelt (Sealed) oder im perfekten Zustand für meine persönliche Sammlung.",
        fields: [
          { name: "Gesuchter Zustand", value: "Sealed / Gem Mint", inline: true },
          { name: "Sprache", value: "Englisch (EN)", inline: true },
          { name: "Maximales Budget", value: "Bis zu 130,00 €", inline: true },
          { name: "Gesucht von", value: `${currentName} (@${currentDiscord})`, inline: false },
        ],
      },
      bulk: {
        title: "Sammlungs-Ankauf: 14 Holo & Secret Rare Karten eingereicht",
        description: "Sammlung zur Überprüfung und für ein Ankaufsangebot an Manacards eingereicht.",
        fields: [
          { name: "Kartenanzahl", value: "14 Karten", inline: true },
          { name: "Wunschpreis", value: "320,00 € (VB)", inline: true },
          { name: "Eingereicht von", value: `${currentName} (@${currentDiscord})`, inline: false },
        ],
      },
    };

    const chosenSample = sampleEmbeds[channel];

    try {
      const res = await fetch("/api/discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          embed: {
            title: chosenSample.title,
            description: chosenSample.description,
            fields: chosenSample.fields,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestStatus(`✓ Erfolgreich gesendet: '${channel}' wurde in Discord veröffentlicht!`);
      } else {
        setTestStatus(`Hinweis: ${data.error}`);
      }
    } catch (e) {
      setTestStatus(`Verbindungsfehler: ${(e as Error).message}`);
    } finally {
      setTestingChannel(null);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 pb-24">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Crown className="w-4 h-4" /> Manacards Dashboard
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Admin Postfach & Discord-Zentrale
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Geschützter Verwaltungsbereich für Sammlungs-Ankäufe und Discord-Kanal-Integrationen.
        </p>
      </div>

      {/* Grid: Manacards Ankauf Postfach & Discord Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Manacards Ankauf Postfach */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Inbox className="w-5 h-5 text-amber-400" />
              Eingegangene Sammlungen ({bulkSubmissions.length})
            </h2>
            <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              Vorverkaufsrecht
            </span>
          </div>

          <p className="text-xs text-neutral-400">
            Hier landen alle Sammlungen, bei denen User auf „An Manacards verkaufen“ geklickt haben.
          </p>

          <div className="space-y-4 pt-2">
            {bulkSubmissions.length === 0 ? (
              <div className="p-8 text-center glass-panel rounded-2xl border border-white/10 text-neutral-500 text-xs">
                Noch keine Sammlungs-Ankäufe eingegangen.
              </div>
            ) : (
              bulkSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl glass-panel border border-amber-500/30 space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <HoloAvatarFrame
                        avatarUrl={sub.user.avatarUrl}
                        username={sub.user.username}
                        role={sub.user.role}
                        verified={sub.user.verified}
                        size="sm"
                      />
                      <div>
                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                          {sub.user.username}
                          <span className="text-[10px] text-neutral-400 font-normal">
                            (Whatnot: @{sub.user.whatnotUsername || "N/A"})
                          </span>
                        </p>
                        <p className="text-[10px] text-indigo-300">
                          Discord: {sub.user.discordUsername || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 block">Wunschsumme</span>
                      <span className="text-sm font-black text-amber-400">
                        {sub.askingPrice ? `${sub.askingPrice} €` : "Gebot erbeten"}
                      </span>
                    </div>
                  </div>

                  {sub.notes && (
                    <div className="text-xs bg-[#0c101a] p-3 rounded-xl border border-white/5 text-neutral-300">
                      <span className="font-semibold text-neutral-400 block mb-0.5">Notiz:</span>
                      "{sub.notes}"
                    </div>
                  )}

                  {/* Cards Grid */}
                  <div>
                    <p className="text-xs font-semibold text-neutral-400 mb-2">
                      Karten in diesem Konvolut ({sub.cards.length}):
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {sub.cards.map((c, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-xl bg-black/40 border border-white/5 text-[11px]"
                        >
                          <div className="aspect-[3/4] rounded-lg overflow-hidden bg-black mb-1">
                            <img src={c.image} alt="" className="w-full h-full object-contain" />
                          </div>
                          <p className="font-bold text-white truncate">{c.name || "Karte"}</p>
                          <p className="text-[10px] text-neutral-400">
                            {c.condition} • {c.language}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => alert(`Angebot per Discord an ${sub.user.discordUsername || sub.user.username} vorbereiten!`)}
                      className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-md shadow-amber-500/20"
                    >
                      Ankaufsangebot senden
                    </button>
                    <button
                      onClick={() => alert("Status auf 'In Verhandlung' gesetzt.")}
                      className="px-3 py-2 rounded-xl bg-white/5 text-neutral-300 text-xs font-semibold hover:bg-white/10"
                    >
                      In Prüfung
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Discord Webhook Diagnostics & Security */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-400" />
              Discord Kanäle & Sicherheit
            </h2>
            <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Server-Geschützt
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-neutral-300 space-y-2">
            <p className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Datenschutz & Sicherheit
            </p>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              Deine Discord Webhook-Tokens werden <b>ausschließlich serverseitig</b> in Umgebungsvariablen verwaltet (z.B. in Vercel oder <code className="text-indigo-300">.env</code>). Dadurch sind sie <b>im Browser, in der Console und im Network-Tab unantastbar und unsichtbar</b>.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 text-xs">
            <div>
              <h3 className="font-bold text-white text-sm">Discord Kanal-Status & Verbindungstests</h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Konfiguriert über <code className="text-indigo-300">DISCORD_WEBHOOK_URL</code> in <code className="text-neutral-300">.env.local</code>. Alle Post-Typen erscheinen in deinem Kanal mit jeweils eigenem Bot-Namen, Pokéball-Avatar und Akzentfarbe!
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "sell",
                  name: "Verkauf (Sofortkauf)",
                  badge: "🟢 Pokéball • Grün",
                  desc: "Bot: Manaforge • VERKAUF 🟢",
                  color: "border-emerald-500/30 bg-emerald-500/5",
                },
                {
                  id: "trade",
                  name: "1:1 Karten-Tausch",
                  badge: "🟣 Meisterball • Violett",
                  desc: "Bot: Manaforge • TAUSCH 🟣",
                  color: "border-purple-500/30 bg-purple-500/5",
                },
                {
                  id: "looking_for",
                  name: "Suchanfrage (Gesuch)",
                  badge: "🔵 Superball • Cyan",
                  desc: "Bot: Manaforge • GESUCH 🔵",
                  color: "border-cyan-500/30 bg-cyan-500/5",
                },
                {
                  id: "bulk",
                  name: "Sammlungs-Ankauf",
                  badge: "🟠 Hyperball • Bernstein",
                  desc: "Bot: Manaforge • ANKAUF 📦",
                  color: "border-amber-500/30 bg-amber-500/5",
                },
              ].map((channelItem) => (
                <div
                  key={channelItem.id}
                  className={`p-3.5 rounded-2xl border ${channelItem.color} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white text-xs">{channelItem.name}</p>
                      <span className="text-[10px] font-semibold text-neutral-300 px-2 py-0.5 rounded-full bg-white/10">
                        {channelItem.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{channelItem.desc}</p>
                  </div>
                  <button
                    type="button"
                    disabled={testingChannel !== null}
                    onClick={() => handleTestChannel(channelItem.id as any)}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 min-h-[38px]"
                  >
                    <Send className="w-3 h-3" /> Test posten
                  </button>
                </div>
              ))}
            </div>

            {testStatus && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-neutral-200 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>{testStatus}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
