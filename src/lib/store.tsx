"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserProfile,
  UserRole,
  CardListing,
  TradeOffer,
  BulkSubmission,
  DealConfirmation,
  AuthModalMode,
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
  currentUser: UserProfile | null;
  sessionUser: UserProfile | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  authModalOpen: boolean;
  authModalMode: AuthModalMode;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
  users: UserProfile[];
  listings: CardListing[];
  deals: DealConfirmation[];
  bulkSubmissions: BulkSubmission[];
  tradeOffers: TradeOffer[];
  switchUser: (userId: string) => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  assignUserRole: (userId: string, newRole: UserRole) => Promise<{ success: boolean; error?: string }>;
  loginWithDiscord: () => Promise<{ error?: string }>;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
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
      role: (u.discord_username?.toLowerCase().includes("freakyfamous") || u.username?.toLowerCase() === "all_out_luffy" || u.whatnot_username?.toLowerCase() === "all_out_luffy") && u.role !== "founder" ? "admin" : (u.role || "member"),
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>("register");

  const [listings, setListings] = useState<CardListing[]>(INITIAL_LISTINGS);
  const [deals, setDeals] = useState<DealConfirmation[]>(INITIAL_DEALS);
  const [bulkSubmissions, setBulkSubmissions] = useState<BulkSubmission[]>(INITIAL_BULK_SUBMISSIONS);
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([]);

  const openAuthModal = (mode: AuthModalMode = "register") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const loginWithDiscord = async (): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      const err = "Supabase ist nicht konfiguriert.";
      alert(err);
      return { error: err };
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
      return { error: error.message };
    }
    return {};
  };

  const loginWithEmail = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: "Supabase ist nicht konfiguriert." };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      let deError = error.message;
      if (error.message.includes("Invalid login credentials")) {
        deError = "Ungültige E-Mail-Adresse oder falsches Passwort.";
      } else if (error.message.includes("Email not confirmed")) {
        deError = "Bitte bestätige zuerst deine E-Mail-Adresse.";
      }
      return { success: false, error: deError };
    }
    if (data?.user) {
      await syncSessionUser(data.user);
    }
    closeAuthModal();
    return { success: true };
  };

  const registerWithEmail = async (
    email: string,
    password: string,
    username: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: "Supabase ist nicht konfiguriert." };
    }
    const cleanUsername = username.trim();
    if (!cleanUsername) {
      return { success: false, error: "Bitte gib einen gewünschten Benutzernamen ein." };
    }
    if (password.length < 6) {
      return { success: false, error: "Das Passwort muss mindestens 6 Zeichen lang sein." };
    }

    // Vorab-Prüfung auf bereits vergebenen Benutzernamen
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", cleanUsername)
      .maybeSingle();

    if (existingUser) {
      return { success: false, error: "Dieser Benutzername ist leider bereits vergeben." };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          username: cleanUsername,
          full_name: cleanUsername,
          user_name: cleanUsername,
        },
      },
    });

    if (error) {
      let deError = error.message;
      if (error.message.includes("User already registered")) {
        deError = "Diese E-Mail-Adresse ist bereits registriert. Bitte melde dich an.";
      } else if (error.message.includes("Password should be at least")) {
        deError = "Das Passwort muss mindestens 6 Zeichen lang sein.";
      }
      return { success: false, error: deError };
    }

    if (data?.user) {
      await syncSessionUser(data.user);
    }
    closeAuthModal();
    return { success: true };
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: "Supabase ist nicht konfiguriert." };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback?type=recovery`,
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setSessionUser(null);
    setCurrentUserId(null);
  };

  // Synchronisiere Session mit dem Benutzerprofil
  const syncSessionUser = async (user: any) => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoadingAuth(false);
      return;
    }
    try {
      let { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        const rawMeta = user.user_metadata || {};
        const candidateName =
          rawMeta.username ||
          rawMeta.user_name ||
          rawMeta.full_name ||
          (user.email ? user.email.split("@")[0] : "Trainer");

        const avatar =
          rawMeta.avatar_url ||
          "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80";

        const disc =
          rawMeta.custom_claims?.discord_tag ||
          rawMeta.discord_username ||
          (user.app_metadata?.provider === "discord" ? candidateName : null);

        const isLuffyAdmin =
          disc?.toLowerCase().includes("freakyfamous") ||
          candidateName?.toLowerCase().includes("freakyfamous") ||
          candidateName?.toLowerCase() === "all_out_luffy" ||
          rawMeta.whatnot_username?.toLowerCase() === "all_out_luffy" ||
          rawMeta.full_name?.toLowerCase().includes("freakyfamous") ||
          rawMeta.user_name?.toLowerCase().includes("freakyfamous");

        const assignedRole: UserRole =
          user.email === "levin@rohde-media.de" || candidateName === "Levin_Mana"
            ? "founder"
            : isLuffyAdmin
            ? "admin"
            : "member";

        const { data: newProfile } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            username: candidateName,
            avatar_url: avatar,
            role: assignedRole,
            verified: assignedRole === "founder" || assignedRole === "admin",
            deals_count: 0,
            discord_username: disc,
          })
          .select()
          .maybeSingle();

        if (newProfile) {
          profile = newProfile;
        }
      }

      if (profile) {
        const isLuffyAdmin =
          profile.discord_username?.toLowerCase().includes("freakyfamous") ||
          profile.whatnot_username?.toLowerCase() === "all_out_luffy" ||
          profile.username?.toLowerCase() === "all_out_luffy" ||
          user.user_metadata?.custom_claims?.discord_tag?.toLowerCase().includes("freakyfamous") ||
          user.user_metadata?.user_name?.toLowerCase().includes("freakyfamous");

        const effectiveRole: UserRole =
          profile.role === "founder"
            ? "founder"
            : isLuffyAdmin
            ? "admin"
            : profile.role || "member";

        if (isLuffyAdmin && profile.role !== "admin" && profile.role !== "founder" && isSupabaseConfigured && supabase) {
          supabase.from("profiles").update({ role: "admin" }).eq("id", profile.id).then();
        }

        const authUser: UserProfile = {
          id: profile.id,
          username: profile.username || user.user_metadata?.full_name || user.user_metadata?.user_name || (isLuffyAdmin ? "all_out_luffy" : "Trainer"),
          avatarUrl: profile.avatar_url || user.user_metadata?.avatar_url || (isLuffyAdmin ? "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80"),
          role: effectiveRole,
          verified: isLuffyAdmin ? true : Boolean(profile.verified),
          dealsCount: profile.deals_count || (isLuffyAdmin ? 18 : 0),
          whatnotUsername: profile.whatnot_username || (isLuffyAdmin ? "all_out_luffy" : undefined),
          discordUsername: profile.discord_username || user.user_metadata?.custom_claims?.discord_tag || user.user_metadata?.user_name || (isLuffyAdmin ? "freakyfamous#0" : undefined),
          bio: profile.bio || (isLuffyAdmin ? "Manaforge Administrator ⚡ • Whatnot: all_out_luffy • Discord: @freakyfamous#0" : undefined),
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
      console.error("Fehler beim Synchronisieren des Benutzerprofils:", err);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoadingAuth(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncSessionUser(session.user);
      } else {
        setIsLoadingAuth(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncSessionUser(session.user);
      } else {
        setSessionUser(null);
        setCurrentUserId(null);
        setIsLoadingAuth(false);
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
            const mappedProfiles: UserProfile[] = profilesData.map((p: any) => {
              const isLuffy =
                p.discord_username?.toLowerCase().includes("freakyfamous") ||
                p.whatnot_username?.toLowerCase() === "all_out_luffy" ||
                p.username?.toLowerCase() === "all_out_luffy";
              const role: UserRole = isLuffy && p.role !== "founder" ? "admin" : (p.role || "member");

              if (isLuffy && p.role !== "admin" && p.role !== "founder" && isSupabaseConfigured && supabase) {
                supabase.from("profiles").update({ role: "admin" }).eq("id", p.id).then();
              }

              return {
                id: p.id,
                username: p.username,
                avatarUrl: p.avatar_url || (isLuffy ? "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80"),
                role: role,
                verified: isLuffy ? true : Boolean(p.verified),
                dealsCount: p.deals_count || (isLuffy ? 18 : 0),
                whatnotUsername: p.whatnot_username || (isLuffy ? "all_out_luffy" : undefined),
                discordUsername: p.discord_username || (isLuffy ? "freakyfamous#0" : undefined),
                bio: p.bio || (isLuffy ? "Manaforge Administrator ⚡ • Whatnot: all_out_luffy • Discord: @freakyfamous#0" : undefined),
                createdAt: p.created_at,
              };
            });

            // Ensure predefined seed users from MOCK_USERS (like all_out_luffy) are present
            const missingSeeds = MOCK_USERS.filter(
              (m) =>
                !mappedProfiles.some(
                  (f) =>
                    f.username.toLowerCase() === m.username.toLowerCase() ||
                    (f.discordUsername && m.discordUsername && f.discordUsername.toLowerCase() === m.discordUsername.toLowerCase())
                )
            );

            setUsers([...mappedProfiles, ...missingSeeds]);
          } else {
            setUsers(MOCK_USERS);
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

  const currentUser: UserProfile | null =
    sessionUser || (currentUserId ? users.find((u) => u.id === currentUserId) || null : null);

  const isAuthenticated = Boolean(currentUser);

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;

    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...data } : u))
    );
    if (sessionUser && sessionUser.id === currentUser.id) {
      setSessionUser((prev) => (prev ? { ...prev, ...data } : null));
    }

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

  const assignUserRole = async (
    userId: string,
    newRole: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    // Only founder or admin can assign roles
    if (!currentUser || (currentUser.role !== "founder" && currentUser.role !== "admin")) {
      return { success: false, error: "Nur Administratoren dürfen Rollen zuweisen." };
    }

    // Update users array in local state
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    // If updating current user / session user
    if (sessionUser && sessionUser.id === userId) {
      setSessionUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }

    // Also update any listings created by this user so their avatar frame reflects instantly
    setListings((prev) =>
      prev.map((l) =>
        l.userId === userId
          ? { ...l, user: { ...l.user, role: newRole } }
          : l
      )
    );

    // Update in Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ role: newRole })
          .eq("id", userId);

        if (error) {
          console.error("Fehler beim Aktualisieren der Benutzerrolle in Supabase:", error);
          return { success: false, error: error.message };
        }
      } catch (err) {
        console.error("Supabase assignUserRole exception:", err);
        return { success: false, error: (err as Error).message };
      }
    }

    return { success: true };
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
    if (!currentUser) {
      openAuthModal("register");
      throw new Error("Bitte melde dich an, um eine Karte anzubieten.");
    }

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
    if (!currentUser) {
      openAuthModal("register");
      return;
    }

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
    if (!currentUser) {
      openAuthModal("register");
      return;
    }

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
    if (!currentUser) {
      openAuthModal("register");
      return;
    }

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
        isAuthenticated,
        isLoadingAuth,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        users,
        listings,
        deals,
        bulkSubmissions,
        tradeOffers,
        switchUser,
        updateProfile,
        assignUserRole,
        loginWithDiscord,
        loginWithEmail,
        registerWithEmail,
        resetPassword,
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
