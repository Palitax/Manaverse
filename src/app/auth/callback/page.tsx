"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
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

    const finalizeRedirect = (session: any) => {
      if (typeof window !== "undefined") {
        if (session?.user?.app_metadata?.provider === "discord") {
          sessionStorage.setItem("manaforge_discord_welcome", "true");
          router.replace("/?discord_welcome=1");
          return;
        }
      }
      router.replace("/");
    };

    const handleCallback = async () => {
      try {
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const code = params.get("code");
          const tokenHash = params.get("token_hash");
          const otpType = params.get("type") as EmailOtpType | null;

          if (code) {
            const { data: exchanged, error: exchangeErr } =
              await client.auth.exchangeCodeForSession(code);
            if (!exchangeErr && exchanged?.session) {
              finalizeRedirect(exchanged.session);
              return;
            }
          } else if (tokenHash && otpType) {
            const { data: verified, error: verifyErr } = await client.auth.verifyOtp({
              token_hash: tokenHash,
              type: otpType,
            });
            if (!verifyErr && verified?.session) {
              finalizeRedirect(verified.session);
              return;
            }
          }
        }

        const { data, error } = await client.auth.getSession();
        if (error) {
          console.error("Auth callback getSession error:", error);
          setErrorMsg(error.message);
          return;
        }

        if (data?.session) {
          finalizeRedirect(data.session);
        } else {
          const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
            if (session) {
              authListener.subscription.unsubscribe();
              finalizeRedirect(session);
            }
          });

          setTimeout(() => {
            router.replace("/");
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
    <div className="min-h-[70dvh] flex items-center justify-center p-4">
      <div className="p-8 rounded-3xl border border-hairline-strong bg-surface-1/95 backdrop-blur-xl text-center space-y-4 max-w-sm w-full shadow-[0_30px_80px_rgba(0,0,0,0.85)]">
        {errorMsg ? (
          <>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto text-lg font-black">
              !
            </div>
            <h2 className="text-lg font-black text-ink tracking-tight">Anmeldefehler</h2>
            <p className="text-xs text-ink-muted leading-relaxed">{errorMsg}</p>
            <button
              onClick={() => router.replace("/")}
              className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-bold transition-colors min-h-[44px] cursor-pointer"
            >
              Zurück zur Startseite
            </button>
          </>
        ) : (
          <>
            <div className="w-11 h-11 border-2 border-white/15 border-t-white rounded-full animate-spin mx-auto" />
            <h2 className="text-lg font-black text-ink tracking-tight">Anmeldung wird abgeschlossen …</h2>
            <p className="text-xs text-ink-muted leading-relaxed">
              Dein Profil wird mit Manaforge synchronisiert. Du wirst gleich weitergeleitet.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
