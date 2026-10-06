"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { HoloAvatarFrame } from "@/components/frames/holo-avatar-frame";
import { UserRole } from "@/types";
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
  Zap,
  Users,
  Search,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  const { currentUser, bulkSubmissions, users, assignUserRole } = useStore();
  const [activeTab, setActiveTab] = useState<"roles" | "bulk" | "discord">("roles");
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [testingChannel, setTestingChannel] = useState<string | null>(null);

  // User management states
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "founder" | "member">("all");
  const [roleFeedback, setRoleFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);

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
            Dieser Bereich ist ausschließlich für Administratoren und Gründer von Manacards bestimmt. Aus Sicherheitsgründen sind sensible Ankaufsdaten, Rollenrechte und Webhook-Steuerungen geschützt.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" /> Zurück zum Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered users for admin management
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.discordUsername && u.discordUsername.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.whatnotUsername && u.whatnotUsername.toLowerCase().includes(userSearch.toLowerCase()));

    if (!matchesSearch) return false;

    if (roleFilter === "admin") return u.role === "admin";
    if (roleFilter === "founder") return u.role === "founder";
    if (roleFilter === "member") return u.role === "member" || u.role === "beta";
    return true;
  });

  const handleRoleChange = async (userId: string, newRole: UserRole, targetUsername: string) => {
    setProcessingUserId(userId);
    setRoleFeedback(null);

    // Safeguard: Cannot demote yourself if you are an admin
    if (userId === currentUser?.id && newRole !== "admin" && newRole !== "founder") {
      setRoleFeedback({
        type: "error",
        text: "Du kannst dir deine eigenen Administrator-Rechte nicht selbst entziehen!",
      });
      setProcessingUserId(null);
      return;
    }

    try {
      const result = await assignUserRole(userId, newRole);
      if (result.success) {
        setRoleFeedback({
          type: "success",
          text:
            newRole === "admin"
              ? `⚡ ${targetUsername} ist jetzt Administrator! Der animierte Blitz-Avatarrahmen wurde aktiviert.`
              : `Rolle von ${targetUsername} wurde erfolgreich auf „${newRole}“ geändert.`,
        });
      } else {
        setRoleFeedback({
          type: "error",
          text: result.error || "Rollenänderung fehlgeschlagen.",
        });
      }
    } catch (e) {
      setRoleFeedback({
        type: "error",
        text: (e as Error).message || "Unerwarteter Fehler bei der Rollenzuweisung.",
      });
    } finally {
      setProcessingUserId(null);
    }
  };

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
    <div className="min-h-screen py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 pb-28">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Zap className="w-4 h-4 fill-cyan-400" /> Manacards Admin-Zentrale
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          Admin Dashboard & Rollenverwaltung
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Geschützter Verwaltungsbereich für Administrator-Berechtigungen, Sammlungs-Ankäufe und Discord-Integrationen.
        </p>
      </div>

      {/* Navigation Tabs (Mobile-optimiert mit Daumenfreundlicher Steuerung) */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("roles")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap min-h-[44px]",
            activeTab === "roles"
              ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/25"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Zap className="w-4 h-4" />
          <span>⚡ Admins & Blitzrahmen</span>
          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-black/20">
            {users.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bulk")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap min-h-[44px]",
            activeTab === "bulk"
              ? "bg-amber-500 text-black shadow-lg shadow-amber-500/25"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Inbox className="w-4 h-4" />
          <span>📦 Ankäufe</span>
          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-black/20">
            {bulkSubmissions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("discord")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap min-h-[44px]",
            activeTab === "discord"
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Settings className="w-4 h-4" />
          <span>Discord-Zentrale</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: ADMINISTRATOR & ROLLENVERWALTUNG                              */}
      {/* ==================================================================== */}
      {activeTab === "roles" && (
        <div className="space-y-6">
          {/* Hero Feature Showcase Card */}
          <div className="p-5 sm:p-6 rounded-3xl glass-panel border border-cyan-500/30 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Live Preview of the Electric Lightning Frame */}
              <div className="flex-shrink-0">
                <HoloAvatarFrame
                  avatarUrl={
                    currentUser?.avatarUrl ||
                    "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80"
                  }
                  username={currentUser?.username || "Admin"}
                  role="admin"
                  verified={true}
                  size="xl"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-black shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                  <Zap className="w-3.5 h-3.5 fill-cyan-400" /> Exklusiver Anime-Blitz-Avatarrahmen
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Administrator-Berechtigung & Blitz-Aura
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
                  Dieser animierte Kreisrahmen im dynamischen Anime-Blitz-Stil mit rotierender Plasma-Corona und regelmäßigen Blitzeinschlägen ins Avatarbild ist <b>streng exklusiv für Administratoren</b>.
                  Als Administrator kannst du unten registrierten Nutzern die Admin-Rechte manuell zuweisen oder wieder entziehen.
                </p>
              </div>
            </div>
          </div>

          {/* Feedback Toast Banner */}
          {roleFeedback && (
            <div
              className={cn(
                "p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in slide-in-from-top-2",
                roleFeedback.type === "success"
                  ? "bg-cyan-950/40 border border-cyan-500/50 text-cyan-200 shadow-lg shadow-cyan-500/10"
                  : "bg-rose-950/40 border border-rose-500/50 text-rose-200 shadow-lg shadow-rose-500/10"
              )}
            >
              <div className="flex items-center gap-2.5">
                {roleFeedback.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                )}
                <span>{roleFeedback.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setRoleFeedback(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Benutzer nach Name, Discord oder Whatnot suchen..."
                className="w-full bg-[#101524] border border-white/10 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
              />
              {userSearch && (
                <button
                  type="button"
                  onClick={() => setUserSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: "all", label: "Alle" },
                { id: "admin", label: "⚡ Admins" },
                { id: "founder", label: "Gründer" },
                { id: "member", label: "Mitglieder" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setRoleFilter(f.id as any)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap min-h-[36px]",
                    roleFilter === f.id
                      ? "bg-white/20 text-white border border-white/25 shadow-sm"
                      : "text-neutral-400 hover:text-white bg-white/5"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* User List: Mobile Cards & Desktop Grid (Mobile Extralocke) */}
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center glass-panel rounded-2xl border border-white/10 text-neutral-500 text-xs">
                Keine Benutzer für den Suchbegriff „{userSearch}“ gefunden.
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isAdmin = user.role === "admin";
                const isFounder = user.role === "founder";
                const isSelf = user.id === currentUser?.id;
                const isProcessing = processingUserId === user.id;

                return (
                  <div
                    key={user.id}
                    className={cn(
                      "p-4 sm:p-5 rounded-2xl glass-panel transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 border",
                      isAdmin
                        ? "border-cyan-500/40 bg-cyan-950/10 shadow-[0_0_20px_rgba(0,240,255,0.06)]"
                        : isFounder
                        ? "border-amber-500/40 bg-amber-950/10"
                        : "border-white/10"
                    )}
                  >
                    {/* User Info with Live Frame */}
                    <div className="flex items-center gap-4">
                      {/* Avatar with its live frame */}
                      <div className="flex-shrink-0">
                        <HoloAvatarFrame
                          avatarUrl={user.avatarUrl}
                          username={user.username}
                          role={user.role}
                          verified={user.verified}
                          size="md"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-white flex items-center gap-1.5">
                            {user.username}
                            {user.verified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                            )}
                          </p>

                          {/* Current Role Badge */}
                          {isAdmin && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-black shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                              <Zap className="w-3 h-3 fill-cyan-400" /> Administrator (Blitz)
                            </span>
                          )}

                          {isFounder && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                              <Crown className="w-3 h-3 text-amber-400" /> Founder
                            </span>
                          )}

                          {user.role === "beta" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 text-[10px] font-bold">
                              <Sparkles className="w-3 h-3 text-cyan-400" /> Beta Tester
                            </span>
                          )}

                          {user.role === "member" && (
                            <span className="text-[10px] font-medium text-neutral-400 px-2 py-0.5 rounded-full bg-white/5">
                              Mitglied
                            </span>
                          )}

                          {isSelf && (
                            <span className="text-[9px] font-bold text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">
                              Du
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
                          {user.discordUsername ? (
                            <span className="text-indigo-300">
                              Discord: @{user.discordUsername}
                            </span>
                          ) : (
                            <span className="text-neutral-500">Kein Discord hinterlegt</span>
                          )}
                          <span>•</span>
                          <span>{user.dealsCount} erfolgreiche Deals</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Promote / Demote / Change Role */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      {/* Quick 1-Click Promote / Demote Button */}
                      {!isAdmin ? (
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleRoleChange(user.id, "admin", user.username)}
                          className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/25 min-h-[44px] cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 fill-black" />
                          <span>⚡ Als Admin ernennen</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isProcessing || isSelf}
                          onClick={() => handleRoleChange(user.id, "member", user.username)}
                          title={isSelf ? "Du kannst dir selbst nicht die Admin-Rechte entziehen" : undefined}
                          className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Admin-Rechte entziehen
                        </button>
                      )}

                      {/* Granular Role Selector */}
                      <select
                        value={user.role}
                        disabled={isProcessing || (isSelf && user.role === "founder")}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value as UserRole, user.username)
                        }
                        className="bg-[#101524] text-neutral-200 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-cyan-500 min-h-[44px]"
                      >
                        <option value="admin">⚡ Administrator (Blitzrahmen)</option>
                        <option value="founder">👑 Gründer (Goldrahmen)</option>
                        <option value="beta">✨ Beta-Tester (Holo-Rahmen)</option>
                        <option value="member">👤 Standard-Mitglied</option>
                      </select>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: SAMMLUNGS-ANKÄUFE                                            */}
      {/* ==================================================================== */}
      {activeTab === "bulk" && (
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
                      type="button"
                      onClick={() => alert(`Angebot per Discord an ${sub.user.discordUsername || sub.user.username} vorbereiten!`)}
                      className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-md shadow-amber-500/20 min-h-[44px]"
                    >
                      Ankaufsangebot senden
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Status auf 'In Verhandlung' gesetzt.")}
                      className="px-3.5 py-2.5 rounded-xl bg-white/5 text-neutral-300 text-xs font-semibold hover:bg-white/10 min-h-[44px]"
                    >
                      In Prüfung
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: DISCORD-ZENTRALE & DIAGNOSTIK                                */}
      {/* ==================================================================== */}
      {activeTab === "discord" && (
        <div className="space-y-6">
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
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 min-h-[44px]"
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
      )}
    </div>
  );
}
