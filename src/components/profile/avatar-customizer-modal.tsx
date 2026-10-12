"use client";

import React, { useState, useRef } from "react";
import { UserRole } from "@/types";
import { HoloAvatarFrame } from "@/components/frames/holo-avatar-frame";
import {
  X,
  Upload,
  Link as LinkIcon,
  Check,
  Flame,
  Crown,
  Zap,
  Layers,
  Lock,
  User,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl: string;
  currentRole: UserRole;
  username: string;
  verified: boolean;
  userRole: UserRole; // Real role from account to check lock permissions
  onSave: (data: { avatarUrl: string; role: UserRole }) => void;
}

const AVATAR_PRESETS = [
  {
    name: "Glurak",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
  },
  {
    name: "Rayquaza",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png",
  },
  {
    name: "Mewtu",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
  },
  {
    name: "Gengar",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
  },
  {
    name: "Nachtara",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/197.png",
  },
  {
    name: "Pikachu",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  },
  {
    name: "Evoli",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
  },
  {
    name: "Luffy Anime",
    url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80",
  },
];

export function AvatarCustomizerModal({
  isOpen,
  onClose,
  currentAvatarUrl,
  currentRole,
  username,
  verified,
  userRole,
  onSave,
}: AvatarCustomizerModalProps) {
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(currentAvatarUrl);
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [activeTab, setActiveTab] = useState<"presets" | "upload" | "url">("presets");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read as Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setSelectedAvatarUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (customUrlInput.trim()) {
      setSelectedAvatarUrl(customUrlInput.trim());
    }
  };

  const handleSave = () => {
    onSave({
      avatarUrl: selectedAvatarUrl,
      role: selectedRole,
    });
    onClose();
  };

  const frameOptions = [
    {
      id: "admin" as UserRole,
      label: "Admin 🔥",
      sublabel: "Molten Lava Flammen",
      icon: <Flame className="w-3.5 h-3.5 fill-amber-400 text-orange-400" />,
      isLocked: userRole !== "admin" && userRole !== "founder",
    },
    {
      id: "founder" as UserRole,
      label: "Founder",
      sublabel: "Gold-Glanz Aura",
      icon: <Crown className="w-3.5 h-3.5 text-amber-400" />,
      isLocked: userRole !== "founder" && userRole !== "admin",
    },
    {
      id: "beta" as UserRole,
      label: "Beta Tester",
      sublabel: "Holo-Prisma Glanz",
      icon: <Zap className="w-3.5 h-3.5 text-cyan-400" />,
      isLocked: false,
    },
    {
      id: "member" as UserRole,
      label: "Standard",
      sublabel: "Schlichter Rahmen",
      icon: <User className="w-3.5 h-3.5 text-neutral-400" />,
      isLocked: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0c101c] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Profilbild & Rahmen anpassen
              </h2>
              <p className="text-[11px] text-neutral-400">
                Wähle ein Bild oder lade ein eigenes hoch und wähle deinen Rahmen.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Live Preview Area */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
              Live-Vorschau
            </span>
            <div className="py-2">
              <HoloAvatarFrame
                avatarUrl={selectedAvatarUrl}
                username={username}
                role={selectedRole}
                verified={verified}
                size="xl"
              />
            </div>
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{username}</span>
              {selectedRole === "admin" && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 font-black">
                  Admin 🔥
                </span>
              )}
              {selectedRole === "founder" && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  Founder 👑
                </span>
              )}
              {selectedRole === "beta" && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                  Beta ⚡
                </span>
              )}
            </span>
          </div>

          {/* Section 1: Avatar Image Source */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-neutral-200">
              1. Profilbild auswählen
            </label>

            {/* Source Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/40 rounded-xl border border-white/5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab("presets")}
                className={cn(
                  "py-2 px-3 rounded-lg transition-all min-h-[40px] flex items-center justify-center gap-1.5 cursor-pointer",
                  activeTab === "presets"
                    ? "bg-white/15 text-white shadow"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Vorlagen</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={cn(
                  "py-2 px-3 rounded-lg transition-all min-h-[40px] flex items-center justify-center gap-1.5 cursor-pointer",
                  activeTab === "upload"
                    ? "bg-white/15 text-white shadow"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Hochladen</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("url")}
                className={cn(
                  "py-2 px-3 rounded-lg transition-all min-h-[40px] flex items-center justify-center gap-1.5 cursor-pointer",
                  activeTab === "url"
                    ? "bg-white/15 text-white shadow"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Bild-URL</span>
              </button>
            </div>

            {/* Tab 1: Presets */}
            {activeTab === "presets" && (
              <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 pt-1">
                {AVATAR_PRESETS.map((preset) => {
                  const isSelected = selectedAvatarUrl === preset.url;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setSelectedAvatarUrl(preset.url)}
                      className={cn(
                        "p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer relative group",
                        isSelected
                          ? "bg-orange-500/20 border-orange-500 text-white shadow-md shadow-orange-500/20"
                          : "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:border-white/20"
                      )}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-black/40 p-1 flex items-center justify-center">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-[10px] font-bold truncate max-w-full">
                        {preset.name}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-500 text-black flex items-center justify-center shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Upload File */}
            {activeTab === "upload" && (
              <div className="p-5 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] flex flex-col items-center justify-center text-center space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    Eigenes Profilbild von deinem Gerät hochladen
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    PNG, JPG oder WEBP (wird automatisch angepasst)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs transition-all active:scale-95 cursor-pointer min-h-[44px] shadow-lg shadow-cyan-500/25 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Datei auswählen</span>
                </button>
              </div>
            )}

            {/* Tab 3: Image URL */}
            {activeTab === "url" && (
              <div className="space-y-2 pt-1">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://beispiel.de/mein-avatar.png"
                    className="flex-1 bg-[#111624] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500 min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer min-h-[44px]"
                  >
                    Vorschau
                  </button>
                </div>
                <p className="text-[10px] text-neutral-400">
                  Gib einen direkten Bildlink ein, um ihn als Profilbild zu nutzen.
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Frame Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-neutral-200">
                2. Spezial-Avatarrahmen wählen
              </label>
              {userRole === "admin" && (
                <span className="text-[10px] text-orange-400 font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-amber-400 text-orange-500" /> Admin-Rechte aktiv
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {frameOptions.map((opt) => {
                const isSelected = selectedRole === opt.id;

                if (opt.isLocked) {
                  return (
                    <div
                      key={opt.id}
                      title="Exklusiv für berechtigte Rollen (Administrator/Founder)."
                      className="p-3 rounded-xl border border-white/5 bg-black/40 text-neutral-500 flex flex-col items-center justify-center gap-1 opacity-50 cursor-not-allowed select-none min-h-[64px]"
                    >
                      <div className="flex items-center gap-1 text-xs font-bold text-neutral-400">
                        <Lock className="w-3 h-3 text-neutral-500" />
                        <span>{opt.label}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500">{opt.sublabel} (Gesperrt)</span>
                    </div>
                  );
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedRole(opt.id)}
                    className={cn(
                      "p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer min-h-[64px] relative",
                      isSelected
                        ? opt.id === "admin"
                          ? "bg-orange-950/40 border-orange-500 text-white font-black shadow-[0_0_15px_rgba(255,80,0,0.45)]"
                          : "bg-indigo-600/20 border-indigo-500 text-white font-bold shadow-md shadow-indigo-500/20"
                        : "bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      {opt.icon}
                      <span>{opt.label}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400">{opt.sublabel}</span>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions - Fixed Sticky on Mobile */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#090c15] flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-bold border border-white/10 transition-colors cursor-pointer min-h-[44px]"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-xs font-black shadow-lg shadow-orange-500/30 transition-all active:scale-95 cursor-pointer min-h-[44px] flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Speichern & Übernehmen</span>
          </button>
        </div>
      </div>
    </div>
  );
}
