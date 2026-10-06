"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ListingType } from "@/types";
import { CardForgeStudio } from "./card-forge-studio";

interface CreateListingModalProps {
  initialType?: ListingType;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Backward compatibility wrapper for CreateListingModal.
 * Embeds the next-level CardForgeStudio.
 */
export function CreateListingModal({
  initialType = "looking_for",
  isOpen,
  onClose,
}: CreateListingModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="w-full max-w-5xl my-auto">
        <CardForgeStudio
          initialType={initialType}
          mode="inline"
          onSuccess={onClose}
          onCancel={onClose}
        />
      </div>
    </div>,
    document.body
  );
}
