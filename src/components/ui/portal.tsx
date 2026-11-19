"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Rendert Overlays (Modals, Drawer) direkt in document.body.
 * Verhindert, dass `perspective`/`transform` von Slab-Containern
 * fixierte Modals einschließen oder abschneiden.
 */
export function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}
