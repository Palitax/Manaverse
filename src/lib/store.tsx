"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserProfile,
  CardListing,
  TradeOffer,
  BulkSubmission,
  DealConfirmation,
} from "@/types";
import {
  MOCK_USERS,
  INITIAL_LISTINGS,
  INITIAL_DEALS,
  INITIAL_BULK_SUBMISSIONS,
} from "./mock-data";
import { supabase, isSupabaseConfigured } from "./supabase/client";
import confetti from "canvas-confetti";

interface StoreContextType {
  currentUser: UserProfile;
  sessionUser: UserProfile | null;
  isAuthenticated: boolean;
  users: UserProfile[];
  listings: CardListing[];
  deals: DealConfirmation[];
  bulkSubmissions: BulkSubmission[];
  tradeOffers: TradeOffer[];
  switchUser: (userId: string) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  loginWithDiscord: () => Promise<void>;
  logout: () => Promise<void>;
  addListing: (listing: Omit<CardListing, "id" | "userId" | "user" | "createdAt" | "status">) => Promise<CardListing>;
  addTradeOffer: (listingId: string, offer: { offeredCardsDescription: string; offeredImages: string[]; estimatedValue: number; message?: string }) => void;
  addBulkSubmission: (submission: { cards: BulkSubmission["cards"]; askingPrice?: number; notes?: string }) => Promise<void>;
  confirmDeal: (dealId: string, asRole: "seller" | "buyer") => void;
  createDeal: (listing: CardListing, buyer: UserProfile) => void;
  deleteListing: (listingId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function mapDBListingToCardListing(item: any): CardListing {
  const u = item.user || {};
  return {
    id: item.id,
    userId: item.user_id,
    type: item.type,
    name: item.name,
    set: item.set_name || undefined,
    cardNumber: item.card_number || undefined,
    language: item.language,
    condition: item.condition,
    photos: Array.isArray(item.photos) ? item.photos : [],
    videoUrl: item.video_url || undefined,
    description: item.description || "",
    price: item.price !== null && item.price !== undefined ? Number(item.price) : undefined,
    priceRange: item.price_range || undefined,
    estimatedTradeValue: item.estimated_trade_value !== null && item.estimated_trade_value !== undefined ? Number(item.estimated_trade_value) : undefined,
    lookingForWants: item.looking_for_wants || undefined,
    allowOffers: item.allow_offers ?? true,
    postToDiscord: item.post_to_discord ?? true,
    status: item.status || "active",
    createdAt: item.created_at,
    user: {
      id: u.id || item.user_id,
      username: u.username || "Sammler",
      avatarUrl: u.avatar_url || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
      role: u.role || "member",
      verified: Boolean(u.verified),
      dealsCount: u.deals_count || 0,
      whatnotUsername: u.whatnot_username || undefined,
      discordUsername: u.discord_username || undefined,
      bio: u.bio || undefined,
      createdAt: u.created_at || item.created_at,
    },
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [sessionUser, setSessionUser] = useState<UserProfile | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("a0000000-0000-0000-0000-000000000001"); // Levin_Mana
  const [listings, setListings] = useState<CardListing[]>(INITIAL_LISTINGS);
  const [deals, setDeals] = useState<DealConfirmation[]>(INITIAL_DEALS);
  const [bulkSubmissions, setBulkSubmissions] = useState<BulkSubmission[]>(INITIAL_BULK_SUBMISSIONS);
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([]);

  const loginWithDiscord = async () => {
    if (!isSupabaseConfigured || !supabase) {
      alert("Supabase ist nicht konfiguriert.");
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "identify email",
      },
    });

    if (error) {
      console.error("Discord login error:", error);
      alert("Fehler bei der Discord-Anmeldung: " + error.message);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setSessionUser(null);
    setCurrentUserId("a0000000-0000-0000-0000-000000000001");
  };

  // Synchronisiere Discord-Login-Session mit dem Benutzerprofil
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const syncSessionUser = async (user: any) => {
      try {
        const { data: profile } = await supabase!
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          const authUser: UserProfile = {
            id: profile.id,
            username: profile.username || user.user_metadata?.full_name || user.user_metadata?.user_name || "Trainer",
            avatarUrl: profile.avatar_url || user.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
            role: profile.role || "member",
            verified: Boolean(profile.verified),
            dealsCount: profile.deals_count || 0,
            whatnotUsername: profile.whatnot_username,
            discordUsername: profile.discord_username || user.user_metadata?.custom_claims?.discord_tag || user.user_metadata?.user_name,
            bio: profile.bio,
            createdAt: profile.created_at || new Date().toISOString(),
            email: user.email,
          };

          setSessionUser(authUser);
          setUsers((prev) => {
            const exists = prev.some((u) => u.id === authUser.id);
            if (exists) return prev.map((u) => (u.id === authUser.id ? authUser : u));
            return [authUser, ...prev];
          });
          setCurrentUserId(authUser.id);
        }
      } catch (err) {
        console.error("Fehler beim Synchronisieren des Discord-Profils:", err);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncSessionUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncSessionUser(session.user);
      } else {
        setSessionUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load from Supabase on mount (with localStorage fallback)
  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured && supabase) {
        try {
          // 1. Load profiles
          const { data: profilesData } = await supabase.from("profiles").select("*");
          if (profilesData && profilesData.length > 0) {
            setUsers(
              profilesData.map((p: any) => ({
                id: p.id,
                username: p.username,
                avatarUrl: p.avatar_url,
                role: p.role,
                verified: p.verified,
                dealsCount: p.deals_count,
                whatnotUsername: p.whatnot_username,
                discordUsername: p.discord_username,
                bio: p.bio,
                createdAt: p.created_at,
              }))
            );
          }

          // 2. Load listings with joined profile
          const { data: listingsData, error: listingsError } = await supabase
            .from("listings")
            .select("*, user:profiles(*)")
            .order("created_at", { ascending: false });

          if (!listingsError && listingsData) {
            const mapped = listingsData.map(mapDBListingToCardListing);
            setListings(mapped);
            return;
          }
        } catch (e) {
          console.error("Supabase fetch failed, falling back to local storage:", e);
        }
      }

      // LocalStorage fallback
      try {
        localStorage.removeItem("manaverse_listings");
        const savedListings = localStorage.getItem("manaforge_listings");
        if (savedListings) {
          const parsed = JSON.parse(savedListings);
          if (Array.isArray(parsed)) {
            const clean = parsed.filter((l: CardListing) => l && l.id && !l.id.startsWith("list-mock"));
            setListings(clean);
            return;
          }
        }
      } catch (e) {
        console.error("LocalStorage fallback error:", e);
      }
      setListings([]);
    }

    loadData();
  }, []);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...data } : u))
    );

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("profiles")
          .update({
            username: data.username,
            avatar_url: data.avatarUrl,
            bio: data.bio,
            whatnot_username: data.whatnotUsername,
            discord_username: data.discordUsername,
          })
          .eq("id", currentUser.id);
      } catch (err) {
        console.error("Supabase updateProfile error:", err);
      }
    }
  };

  // Dispatch through secure server proxy - client NEVER sees raw webhook URLs
  const dispatchDiscordWebhook = async (listing: CardListing) => {
    let channel: "sell" | "trade" | "looking_for" = "sell";
    let embedColor = 0x10b981;
    let typeLabel = "VERKAUF";

    if (listing.type === "sell") {
      channel = "sell";
      embedColor = 0x10b981; // Green
      typeLabel = "VERKAUF";
    } else if (listing.type === "trade") {
      channel = "trade";
      embedColor = 0xa855f7; // Royal Purple
      typeLabel = "TAUSCH";
    } else if (listing.type === "looking_for") {
      channel = "looking_for";
      embedColor = 0x06b6d4; // Cyan
      typeLabel = "GESUCH";
    }

    const fields: Array<{ name: string; value: string; inline?: boolean }> = [
      { name: "Zustand", value: listing.condition, inline: true },
      { name: "Sprache", value: listing.language, inline: true },
      {
        name: listing.type === "sell" ? "Festpreis" : listing.type === "trade" ? "Estimated Trade Value (ETV)" : "Budget",
        value: listing.price ? `${listing.price} €` : listing.estimatedTradeValue ? `${listing.estimatedTradeValue} €` : listing.priceRange || "VB",
        inline: true,
      },
    ];

    if (listing.set || listing.cardNumber) {
      fields.push({
        name: "Set / Kartennr.",
        value: `${listing.set || "–"}${listing.cardNumber ? ` #${listing.cardNumber}` : ""}`,
        inline: true,
      });
    }

    if (listing.type === "trade" && listing.lookingForWants) {
      fields.push({
        name: "Gesuchte Tauschkarten (Wants)",
        value: listing.lookingForWants,
        inline: false,
      });
    }

    fields.push({
      name: listing.type === "looking_for" ? "Gesucht von" : "Anbieter",
      value: `${listing.user.username} (Discord: ${listing.user.discordUsername ? `@${listing.user.discordUsername}` : "Nicht hinterlegt"})`,
      inline: false,
    });

    try {
      await fetch("/api/discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          embed: {
            title: `[${typeLabel}] ${listing.name}`,
            description: listing.description || "Neues Angebot auf Manaforge eingestellt.",
            color: embedColor,
            fields,
            image: listing.photos[0] ? { url: listing.photos[0] } : undefined,
          },
        }),
      });
    } catch (err) {
      console.warn("Secure Discord notification trigger failed:", err);
    }
  };

  const addListing = async (
    listingData: Omit<CardListing, "id" | "userId" | "user" | "createdAt" | "status">
  ): Promise<CardListing> => {
    let newListing: CardListing;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("listings")
          .insert({
            user_id: currentUser.id,
            type: listingData.type,
            name: listingData.name,
            set_name: listingData.set || null,
            card_number: listingData.cardNumber || null,
            language: listingData.language,
            condition: listingData.condition,
            photos: listingData.photos || [],
            video_url: listingData.videoUrl || null,
            description: listingData.description || "",
            price: listingData.price || null,
            price_range: listingData.priceRange || null,
            estimated_trade_value: listingData.estimatedTradeValue || null,
            looking_for_wants: listingData.lookingForWants || null,
            allow_offers: listingData.allowOffers ?? true,
            post_to_discord: listingData.postToDiscord ?? true,
            status: "active",
          })
          .select("*, user:profiles(*)")
          .single();

        if (!error && data) {
          newListing = mapDBListingToCardListing(data);
        } else {
          console.error("Supabase addListing error, fallback local:", error);
          newListing = {
            ...listingData,
            id: `list-${Date.now()}`,
            userId: currentUser.id,
            user: currentUser,
            status: "active",
            createdAt: new Date().toISOString(),
          };
        }
      } catch (err) {
        console.error("Supabase addListing failed:", err);
        newListing = {
          ...listingData,
          id: `list-${Date.now()}`,
          userId: currentUser.id,
          user: currentUser,
          status: "active",
          createdAt: new Date().toISOString(),
        };
      }
    } else {
      newListing = {
        ...listingData,
        id: `list-${Date.now()}`,
        userId: currentUser.id,
        user: currentUser,
        status: "active",
        createdAt: new Date().toISOString(),
      };
    }

    setListings((prev) => {
      const updated = [newListing, ...prev];
      try {
        localStorage.setItem("manaforge_listings", JSON.stringify(updated));
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

  const deleteListing = async (listingId: string) => {
    setListings((prev) => {
      const updated = prev.filter((l) => l.id !== listingId);
      try {
        localStorage.setItem("manaforge_listings", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("listings").delete().eq("id", listingId);
      } catch (err) {
        console.error("Supabase deleteListing error:", err);
      }
    }
  };

  const addTradeOffer = async (
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

    let offerId = `offer-${Date.now()}`;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("trade_offers")
          .insert({
            listing_id: listingId,
            from_user_id: currentUser.id,
            offered_cards_description: offerData.offeredCardsDescription,
            offered_images: offerData.offeredImages,
            estimated_value: offerData.estimatedValue,
            message: offerData.message || null,
            status: "pending",
          })
          .select("id")
          .single();

        if (!error && data) {
          offerId = data.id;
        }
      } catch (err) {
        console.error("Supabase addTradeOffer error:", err);
      }
    }

    const newOffer: TradeOffer = {
      id: offerId,
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
    let submissionId = `bulk-${Date.now()}`;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("bulk_submissions")
          .insert({
            user_id: currentUser.id,
            total_cards: submissionData.cards.length,
            cards: submissionData.cards,
            asking_price: submissionData.askingPrice || null,
            notes: submissionData.notes || null,
            status: "pending",
          })
          .select("id")
          .single();

        if (!error && data) {
          submissionId = data.id;
        }
      } catch (err) {
        console.error("Supabase addBulkSubmission error:", err);
      }
    }

    const newSubmission: BulkSubmission = {
      id: submissionId,
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

    // Send discord webhook securely through server
    try {
      await fetch("/api/discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "bulk",
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
          },
        }),
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const createDeal = async (listing: CardListing, buyer: UserProfile) => {
    let dealId = `deal-${Date.now()}`;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("deals")
          .insert({
            listing_id: listing.id,
            listing_title: listing.name,
            listing_type: listing.type,
            price_or_value: listing.price || listing.estimatedTradeValue || null,
            seller_id: listing.userId,
            buyer_id: buyer.id,
            seller_confirmed: false,
            buyer_confirmed: false,
            status: "pending",
          })
          .select("id")
          .single();

        if (!error && data) {
          dealId = data.id;
        }
      } catch (err) {
        console.error("Supabase createDeal error:", err);
      }
    }

    const newDeal: DealConfirmation = {
      id: dealId,
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

  const confirmDeal = async (dealId: string, asRole: "seller" | "buyer") => {
    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id !== dealId) return deal;

        const updated = {
          ...deal,
          sellerConfirmed: asRole === "seller" ? true : deal.sellerConfirmed,
          buyerConfirmed: asRole === "buyer" ? true : deal.buyerConfirmed,
        };

        if (updated.sellerConfirmed && updated.buyerConfirmed && deal.status !== "completed") {
          updated.status = "completed";
          updated.completedAt = new Date().toISOString();

          setUsers((uList) =>
            uList.map((u) => {
              if (u.id === deal.sellerId || u.id === deal.buyerId) {
                const newCount = u.dealsCount + 1;
                const becomesVerified = newCount >= 3;

                if (becomesVerified && !u.verified) {
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

    if (isSupabaseConfigured && supabase) {
      try {
        const updatePayload: any = {};
        if (asRole === "seller") updatePayload.seller_confirmed = true;
        if (asRole === "buyer") updatePayload.buyer_confirmed = true;
        await supabase.from("deals").update(updatePayload).eq("id", dealId);
      } catch (err) {
        console.error("Supabase confirmDeal error:", err);
      }
    }
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        sessionUser,
        isAuthenticated: Boolean(sessionUser),
        users,
        listings,
        deals,
        bulkSubmissions,
        tradeOffers,
        switchUser,
        updateProfile,
        loginWithDiscord,
        logout,
        addListing,
        deleteListing,
        addTradeOffer,
        addBulkSubmission,
        confirmDeal,
        createDeal,
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
