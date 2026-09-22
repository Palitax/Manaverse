"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { HoloAvatarFrame } from "@/components/frames/holo-avatar-frame";
import {
  Crown,
  Settings,
  Send,
  Sparkles,
  Layers,
  Inbox,
  CheckCircle,
  ExternalLink,
  Save,
  Check,
} from "lucide-react";

export default function AdminPage() {
  const { webhooks, updateWebhooks, bulkSubmissions } = useStore();

  const [sellUrl, setSellUrl] = useState(webhooks.sellWebhookUrl);
  const [tradeUrl, setTradeUrl] = useState(webhooks.tradeWebhookUrl);
  const [lookingForUrl, setLookingForUrl] = useState(webhooks.lookingForWebhookUrl);
  const [bulkUrl, setBulkUrl] = useState(webhooks.bulkWebhookUrl);

  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveWebhooks = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebhooks({
      sellWebhookUrl: sellUrl,
      tradeWebhookUrl: tradeUrl,
      lookingForWebhookUrl: lookingForUrl,
      bulkWebhookUrl: bulkUrl,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTestWebhook = async (url: string, channelName: string) => {
    if (!url) {
      alert(`Bitte trage zuerst eine Webhook-URL für ${channelName} ein.`);
      return;
    }
    setTestStatus(`Sende Test an ${channelName}...`);
    try {
      const res = await fetch("/api/discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl: url,
          embed: {
            title: `🧪 Test-Nachricht: ${channelName} Webhook erfolgreich verbunden!`,
            description: "Die Manaverse Community-Plattform ist erfolgreich mit diesem Discord-Kanal verknüpft.",
            color: 0x6366f1,
            fields: [
              { name: "Status", value: "Aktiv & Bereit", inline: true },
              { name: "Features", value: "Sell, Buy, Trade, Looking For, Manacards Bulk", inline: true },
            ],
            footer: { text: "Manaverse Bot System" },
            timestamp: new Date().toISOString(),
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestStatus(`✓ Test für ${channelName} erfolgreich empfangen!`);
      } else {
        setTestStatus(`Fehler: ${data.error || "Webhook antwortete mit Fehler"}`);
      }
    } catch (e) {
      setTestStatus(`Fehler: ${(e as Error).message}`);
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
          Verwalte eingereichte Sammlungen und konfiguriere die Webhook-URLs deiner Discord-Kanäle.
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

                  {/* Contact / Action */}
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

        {/* Right: Discord Webhook Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-400" />
              Discord Webhook-Kanäle
            </h2>
            <span className="text-[10px] text-indigo-400 font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              Live Dispatcher
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-neutral-300 space-y-2">
            <p className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Wie erstelle ich Webhooks im Discord?
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-neutral-400 text-[11px]">
              <li>Gehe in Discord in die Kanaleinstellungen (z.B. <code className="text-indigo-300">#karten-verkauf</code>).</li>
              <li>Klicke auf <b>Integrationen</b> $\rightarrow$ <b>Webhooks</b> $\rightarrow$ <b>Neuer Webhook</b>.</li>
              <li>Klicke auf <b>Webhook-URL kopieren</b> und füge sie unten in das entsprechende Feld ein!</li>
            </ol>
          </div>

          <form onSubmit={handleSaveWebhooks} className="space-y-4 glass-panel p-6 rounded-3xl border border-white/10 text-xs">
            {/* Sell Webhook */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-neutral-300 font-bold">
                  1. Sell Kanal Webhook-URL (#karten-verkauf)
                </label>
                <button
                  type="button"
                  onClick={() => handleTestWebhook(sellUrl, "Sell (#karten-verkauf)")}
                  className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Send className="w-3 h-3" /> Test senden
                </button>
              </div>
              <input
                type="url"
                value={sellUrl}
                onChange={(e) => setSellUrl(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>

            {/* Trade Webhook */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-neutral-300 font-bold">
                  2. Trade Kanal Webhook-URL (#karten-tausch)
                </label>
                <button
                  type="button"
                  onClick={() => handleTestWebhook(tradeUrl, "Trade (#karten-tausch)")}
                  className="text-[10px] text-purple-400 hover:underline flex items-center gap-1"
                >
                  <Send className="w-3 h-3" /> Test senden
                </button>
              </div>
              <input
                type="url"
                value={tradeUrl}
                onChange={(e) => setTradeUrl(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>

            {/* Looking For Webhook */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-neutral-300 font-bold">
                  3. Looking For Webhook-URL (#gesuche)
                </label>
                <button
                  type="button"
                  onClick={() => handleTestWebhook(lookingForUrl, "Looking For (#gesuche)")}
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Send className="w-3 h-3" /> Test senden
                </button>
              </div>
              <input
                type="url"
                value={lookingForUrl}
                onChange={(e) => setLookingForUrl(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>

            {/* Bulk / Manacards Ankauf Webhook */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-neutral-300 font-bold">
                  4. Manacards Ankauf Webhook-URL (#ankauf-postfach)
                </label>
                <button
                  type="button"
                  onClick={() => handleTestWebhook(bulkUrl, "Manacards Ankauf (#ankauf)")}
                  className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Send className="w-3 h-3" /> Test senden
                </button>
              </div>
              <input
                type="url"
                value={bulkUrl}
                onChange={(e) => setBulkUrl(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>

            {testStatus && (
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 text-[11px]">
                {testStatus}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-indigo-600/30"
            >
              <Save className="w-4 h-4" />
              {savedSuccess ? "Webhooks gespeichert! ✓" : "Einstellungen speichern"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
