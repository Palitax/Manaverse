"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      router.replace("/");
      return;
    }

    const handleCallback = async () => {
      try {
        const { data, error } = await client.auth.getSession();
        if (error) {
          console.error("Auth callback getSession error:", error);
          setErrorMsg(error.message);
          return;
        }

        if (data?.session) {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("manaforge_discord_welcome", "true");
          }
          router.replace("/?discord_welcome=1");
        } else {
          // If no session found yet, wait for onAuthStateChange
          const { data: authListener } = client.auth.onAuthStateChange((event, session) => {
            if (session) {
              authListener.subscription.unsubscribe();
              if (typeof window !== "undefined") {
                sessionStorage.setItem("manaforge_discord_welcome", "true");
              }
              router.replace("/?discord_welcome=1");
            }
          });

          // Timeout fallback
          setTimeout(() => {
            if (typeof window !== "undefined") {
              sessionStorage.setItem("manaforge_discord_welcome", "true");
            }
            router.replace("/?discord_welcome=1");
          }, 2500);
        }
      } catch (e) {
        console.error("Auth callback exception:", e);
        router.replace("/");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="glass-panel p-8 rounded-3xl border border-orange-500/20 bg-[#121316]/90 backdrop-blur-xl text-center space-y-4 max-w-sm w-full shadow-2xl">
        {errorMsg ? (
          <>
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-lg font-black text-white">Anmeldefehler</h2>
            <p className="text-xs text-neutral-400">{errorMsg}</p>
            <button
              onClick={() => router.replace("/")}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
            >
              Zurück zur Startseite
            </button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-lg font-black text-white">Discord-Anmeldung läuft...</h2>
            <p className="text-xs text-neutral-400">
              Dein Profil wird mit Manaforge synchronisiert. Du wirst gleich weitergeleitet.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
