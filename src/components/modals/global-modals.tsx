"use client";

import dynamic from "next/dynamic";

const AuthModal = dynamic(
  () => import("@/components/forms/auth-modal").then((m) => m.AuthModal),
  { ssr: false }
);

const DiscordWelcomeModal = dynamic(
  () =>
    import("@/components/forms/discord-welcome-modal").then(
      (m) => m.DiscordWelcomeModal
    ),
  { ssr: false }
);

const BoosterRipModal = dynamic(
  () =>
    import("@/components/booster/booster-rip-modal").then((m) => m.BoosterRipModal),
  { ssr: false }
);

export function GlobalModals() {
  return (
    <>
      <AuthModal />
      <DiscordWelcomeModal />
      <BoosterRipModal />
    </>
  );
}
