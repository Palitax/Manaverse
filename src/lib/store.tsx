"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserProfile,
  CardListing,
  TradeOffer,
  BulkSubmission,
  DealConfirmation,
  DiscordWebhookConfig,
} from "@/types";
import {
  MOCK_USERS,
  INITIAL_LISTINGS,
  INITIAL_DEALS,
  INITIAL_BULK_SUBMISSIONS,
} from "./mock-data";
import confetti from "canvas-confetti";

interface StoreContextType {
  currentUser: UserProfile;
  users: UserProfile[];
  listings: CardListing[];
  deals: DealConfirmation[];
  bulkSubmissions: BulkSubmission[];
  tradeOffers: TradeOffer[];
  webhooks: DiscordWebhookConfig;
  switchUser: (userId: string) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  addListing: (listing: Omit<CardListing, "id" | "userId" | "user" | "createdAt" | "status">) => Promise<CardListing>;
  addTradeOffer: (listingId: string, offer: { offeredCardsDescription: string; offeredImages: string[]; estimatedValue: number; message?: string }) => void;
  addBulkSubmission: (submission: { cards: BulkSubmission["cards"]; askingPrice?: number; notes?: string }) => Promise<void>;
  confirmDeal: (dealId: string, asRole: "seller" | "buyer") => void;
  createDeal: (listing: CardListing, buyer: UserProfile) => void;
  updateWebhooks: (config: DiscordWebhookConfig) => void;
  deleteListing: (listingId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>("user-1"); // Levin_Mana default
  const [listings, setListings] = useState<CardListing[]>(INITIAL_LISTINGS);
  const [deals, setDeals] = useState<DealConfirmation[]>(INITIAL_DEALS);
  const [bulkSubmissions, setBulkSubmissions] = useState<BulkSubmission[]>(INITIAL_BULK_SUBMISSIONS);
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([]);
  const [webhooks, setWebhooks] = useState<DiscordWebhookConfig>({
    sellWebhookUrl: "",
    tradeWebhookUrl: "",
    lookingForWebhookUrl: "",
    bulkWebhookUrl: "",
  });

  // Load saved state from localStorage if available
  useEffect(() => {
    try {
      const savedWebhooks = localStorage.getItem("manaverse_webhooks");
      if (savedWebhooks) {
        setWebhooks(JSON.parse(savedWebhooks));
      }
      const savedListings = localStorage.getItem("manaverse_listings");
      if (savedListings) {
        setListings(JSON.parse(savedListings));
      }
    } catch (e) {
      console.error("Failed to load local storage state:", e);
    }
  }, []);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...data } : u))
    );
  };

  const updateWebhooks = (config: DiscordWebhookConfig) => {
    setWebhooks(config);
    try {
      localStorage.setItem("manaverse_webhooks", JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  };

  const dispatchDiscordWebhook = async (listing: CardListing) => {
    let targetWebhook = "";
    let embedColor = 0x6366f1;
    let typeLabel = "ANGEBOT";

    if (listing.type === "sell") {
      targetWebhook = webhooks.sellWebhookUrl;
      embedColor = 0x10b981; // Green
      typeLabel = "VERKAUF";
    } else if (listing.type === "trade") {
      targetWebhook = webhooks.tradeWebhookUrl;
      embedColor = 0x8b5cf6; // Purple
      typeLabel = "TAUSCH";
    } else if (listing.type === "looking_for") {
      targetWebhook = webhooks.lookingForWebhookUrl;
      embedColor = 0x06b6d4; // Cyan
      typeLabel = "GESUCH";
    }

    if (!targetWebhook) return;

    try {
      await fetch("/api/discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl: targetWebhook,
          embed: {
            title: `[${typeLabel}] ${listing.name}`,
            description: listing.description || "Neues Listing auf Manaverse!",
            color: embedColor,
            fields: [
              { name: "Zustand", value: listing.condition, inline: true },
              { name: "Sprache", value: listing.language, inline: true },
              {
                name: listing.type === "sell" ? "Preis" : listing.type === "trade" ? "Estimated Trade Value" : "Budget",
                value: listing.price ? `${listing.price} €` : listing.estimatedTradeValue ? `${listing.estimatedTradeValue} €` : listing.priceRange || "VB",
                inline: true,
              },
              { name: "Verkäufer", value: `${listing.user.username} (Discord: ${listing.user.discordUsername || "N/A"})`, inline: false },
            ],
            image: listing.photos[0] ? { url: listing.photos[0] } : undefined,
            footer: { text: "Manaverse Community • Whatnot & Discord" },
            timestamp: new Date().toISOString(),
          },
        }),
      });
    } catch (err) {
      console.warn("Failed to dispatch webhook:", err);
    }
  };

  const addListing = async (
    listingData: Omit<CardListing, "id" | "userId" | "user" | "createdAt" | "status">
  ): Promise<CardListing> => {
    const newListing: CardListing = {
      ...listingData,
      id: `list-${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    setListings((prev) => {
      const updated = [newListing, ...prev];
      try {
        localStorage.setItem("manaverse_listings", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    if (newListing.postToDiscord) {
      await dispatchDiscordWebhook(newListing);
    }

    return newListing;
  };

  const deleteListing = (listingId: string) => {
    setListings((prev) => {
      const updated = prev.filter((l) => l.id !== listingId);
      try {
        localStorage.setItem("manaverse_listings", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const addTradeOffer = (
    listingId: string,
    offerData: {
      offeredCardsDescription: string;
      offeredImages: string[];
      estimatedValue: number;
      message?: string;
    }
  ) => {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;

    const newOffer: TradeOffer = {
      id: `offer-${Date.now()}`,
      listingId,
      listing,
      fromUserId: currentUser.id,
      fromUser: currentUser,
      ...offerData,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setTradeOffers((prev) => [newOffer, ...prev]);
  };

  const addBulkSubmission = async (submissionData: {
    cards: BulkSubmission["cards"];
    askingPrice?: number;
    notes?: string;
  }) => {
    const newSubmission: BulkSubmission = {
      id: `bulk-${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      totalCards: submissionData.cards.length,
      cards: submissionData.cards,
      askingPrice: submissionData.askingPrice,
      notes: submissionData.notes,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setBulkSubmissions((prev) => [newSubmission, ...prev]);

    // Send discord webhook to Manacards Admin Ankauf channel if configured
    if (webhooks.bulkWebhookUrl) {
      try {
        await fetch("/api/discord", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            webhookUrl: webhooks.bulkWebhookUrl,
            embed: {
              title: `[MANACARDS ANKAUF] Neue Sammlung eingereicht von ${currentUser.username}!`,
              description: `Enthält **${newSubmission.totalCards} Karten**. Wunschpreis: ${newSubmission.askingPrice ? `${newSubmission.askingPrice} €` : "Offen / Gebot erwünscht"}\n\nNotizen: ${newSubmission.notes || "Keine"}`,
              color: 0xf59e0b,
              fields: newSubmission.cards.slice(0, 5).map((c, i) => ({
                name: `Karte #${i + 1}: ${c.name}`,
                value: `Zustand: ${c.condition} | Sprache: ${c.language}${c.estimatedValue ? ` | Wert: ${c.estimatedValue} €` : ""}`,
                inline: true,
              })),
              image: newSubmission.cards[0]?.image ? { url: newSubmission.cards[0].image } : undefined,
              footer: { text: "Manacards Ankauf Postfach" },
              timestamp: new Date().toISOString(),
            },
          }),
        });
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const createDeal = (listing: CardListing, buyer: UserProfile) => {
    const newDeal: DealConfirmation = {
      id: `deal-${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.name,
      listingType: listing.type,
      priceOrValue: listing.price || listing.estimatedTradeValue,
      sellerId: listing.userId,
      sellerUsername: listing.user.username,
      buyerId: buyer.id,
      buyerUsername: buyer.username,
      sellerConfirmed: false,
      buyerConfirmed: false,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setDeals((prev) => [newDeal, ...prev]);
  };

  const confirmDeal = (dealId: string, asRole: "seller" | "buyer") => {
    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id !== dealId) return deal;

        const updated = {
          ...deal,
          sellerConfirmed: asRole === "seller" ? true : deal.sellerConfirmed,
          buyerConfirmed: asRole === "buyer" ? true : deal.buyerConfirmed,
        };

        // If both confirmed, mark completed and increment user deal counters!
        if (updated.sellerConfirmed && updated.buyerConfirmed && deal.status !== "completed") {
          updated.status = "completed";
          updated.completedAt = new Date().toISOString();

          // Increment counters for seller and buyer
          setUsers((uList) =>
            uList.map((u) => {
              if (u.id === deal.sellerId || u.id === deal.buyerId) {
                const newCount = u.dealsCount + 1;
                const becomesVerified = newCount >= 3;

                if (becomesVerified && !u.verified) {
                  // Fire celebratory confetti!
                  try {
                    confetti({
                      particleCount: 100,
                      spread: 70,
                      origin: { y: 0.6 },
                    });
                  } catch (e) {
                    console.error(e);
                  }
                }

                return {
                  ...u,
                  dealsCount: newCount,
                  verified: becomesVerified,
                };
              }
              return u;
            })
          );
        }

        return updated;
      })
    );
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        users,
        listings,
        deals,
        bulkSubmissions,
        tradeOffers,
        webhooks,
        switchUser,
        updateProfile,
        addListing,
        deleteListing,
        addTradeOffer,
        addBulkSubmission,
        confirmDeal,
        createDeal,
        updateWebhooks,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
