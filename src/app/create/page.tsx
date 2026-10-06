"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ListingType } from "@/types";
import { CardForgeStudio } from "@/components/forms/card-forge-studio";
import { Flame, ArrowLeft, ShieldCheck, Sparkles, Zap, HeartHandshake } from "lucide-react";
import Link from "next/link";

function CreateStudioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawType = searchParams.get("type");
  const initialType: ListingType =
    rawType === "trade" || rawType === "looking_for" || rawType === "sell"
      ? rawType
      : "sell";

  const handleSuccess = () => {
    if (initialType === "looking_for") {
      router.push("/looking-for");
    } else if (initialType === "trade") {
      router.push("/trade");
    } else {
      router.push("/sell");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-32">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="space-y-1.5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Zurück zum Marktplatz
          </Link>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Flame className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Manaforge Karten-Schmiede
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl">
            Erschaffe dein Inserat mit authentischer 3D-Graded-Slab-Vorschau. Erreiche hunderte aktiver Sammler auf Whatnot & Discord – garantiert ohne Provision.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5 text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>0% Gebühren</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5 text-cyan-300">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Discord Webhook Alert</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5 text-purple-300">
            <HeartHandshake className="w-4 h-4 text-purple-400" />
            <span>Sicherer Sammeltausch</span>
          </div>
        </div>
      </div>

      {/* Main Studio Engine */}
      <CardForgeStudio
        initialType={initialType}
        mode="page"
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default function CreateListingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-neutral-400 text-sm">
          Karten-Schmiede wird geladen...
        </div>
      }
    >
      <CreateStudioContent />
    </Suspense>
  );
}
