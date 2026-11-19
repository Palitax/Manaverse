"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  UserProfile,
  UserRole,
  CardListing,
  TradeOffer,
  BulkSubmission,
  DealConfirmation,
  AuthModalMode,
  BoosterReward,
} from "@/types";
import {
  MOCK_USERS,
  INITIAL_LISTINGS,
  INITIAL_DEALS,
  INITIAL_BULK_SUBMISSIONS,
} from "./mock-data";
import { supabase, isSupabaseConfigured } from "./supabase/client";
import { ensureHostedCardPhoto } from "./supabase/storage";
import { toast } from "@/components/ui/toast";
import confetti from "canvas-confetti";
import {
  rollBoosterReward,
  isDailyBoosterClaimable,
  formatDailyBoosterCountdown,
} from "./booster-rewards";

interface LocalBoosterStats {
  manaPoints: number;
  boosterPacks: number;
  lastDailyBoosterClaimedAt: string | null;
  hasReceivedDiscordWelcomePack: boolean;
  openedBoostersCount: number;
}

function getLocalBoosterStats(userId: string): LocalBoosterStats {
  if (typeof window === "undefined") {
    return {
      manaPoints: 0,
      boosterPacks: 0,
      lastDailyBoosterClaimedAt: null,
      hasReceivedDiscordWelcomePack: false,
      openedBoostersCount: 0,
    };
  }
  try {
    const raw = localStorage.getItem(`manaforge_booster_${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Fehler beim Lesen der lokalen Booster-Daten:", e);
  }
  return {
    manaPoints: 0,
    boosterPacks: 0,
    lastDailyBoosterClaimedAt: null,
    hasReceivedDiscordWelcomePack: false,
    openedBoostersCount: 0,
  };
}

function setLocalBoosterStats(userId: string, stats: Partial<LocalBoosterStats>) {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalBoosterStats(userId);
    const updated = { ...current, ...stats };
    localStorage.setItem(`manaforge_booster_${userId}`, JSON.stringify(updated));
  } catch (e) {
    console.error("Fehler beim Speichern der lokalen Booster-Daten:", e);
  }
}

const UNSYNCED_STORAGE_KEY = "manaforge_unsynced_listings";

function stageUnsyncedListing(pendingItem: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const existingRaw = localStorage.getItem(UNSYNCED_STORAGE_KEY);
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    const list = Array.isArray(existing) ? existing : [];
    const deduped = [
      pendingItem,
      ...list.filter((x: any) => x && x.id !== pendingItem.id),
    ].slice(0, 30);
    localStorage.setItem(UNSYNCED_STORAGE_KEY, JSON.stringify(deduped));
  } catch {
    // Speicher-Limit ignorieren
  }
}

function rescueLegacyLocalListingsBeforeOverwrite() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("manaforge_listings");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;

    const unsynced = parsed.filter(
      (item: any) =>
        item &&
        typeof item.id === "string" &&
        item.id.startsWith("list-") &&
        !item.id.startsWith("list-mock") &&
        item.name
    );
    for (const item of unsynced) {
      stageUnsyncedListing(item);
    }
  } catch {
    // Ungültiges JSON ignorieren
  }
}

function persistLightweightListingsCache(items: CardListing[]) {
  if (typeof window === "undefined") return;
  try {
    rescueLegacyLocalListingsBeforeOverwrite();
    // Speichere keine riesigen unkomprimierten Base64-Strings im 5MB-localStorage
    const compact = items.slice(0, 100).map((item) => ({
      ...item,
      photos: (item.photos || []).map((p) => (p.length > 150_000 ? "" : p)).filter(Boolean),
    }));
    localStorage.setItem("manaforge_listings", JSON.stringify(compact));
  } catch {
    // Quota-Überschreitung im Offline-Cache ignorieren
  }
}

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
  registerWithEmail: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  addListing: (listing: Omit<CardListing, "id" | "userId" | "user" | "createdAt" | "status"> & { status?: CardListing["status"] }) => Promise<CardListing>;
  updateListingStatus: (listingId: string, status: CardListing["status"]) => Promise<void>;
  addTradeOffer: (listingId: string, offer: { offeredCardsDescription: string; offeredImages: string[]; estimatedValue: number; message?: string }) => Promise<void>;
  respondToTradeOffer: (offerId: string, status: "accepted" | "declined") => Promise<boolean>;
  addBulkSubmission: (submission: { cards: BulkSubmission["cards"]; askingPrice?: number; notes?: string }) => Promise<void>;
  updateBulkSubmissionStatus: (submissionId: string, status: BulkSubmission["status"]) => Promise<boolean>;
  confirmDeal: (dealId: string, asRole: "seller" | "buyer") => Promise<void>;
  createDeal: (listing: CardListing, buyer: UserProfile) => Promise<void>;
  deleteListing: (listingId: string) => Promise<void>;
  // Booster Arena & Mana System
  manaPoints: number;
  availableBoosters: number;
  openedBoostersCount: number;
  canClaimDailyBooster: boolean;
  dailyBoosterCountdown: string;
  isBoosterModalOpen: boolean;
  openBoosterModal: () => void;
  closeBoosterModal: () => void;
  claimDailyBooster: () => Promise<boolean>;
  ripBoosterPack: () => Promise<BoosterReward>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80";
const LUFFY_AVATAR =
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80";

function mapDBProfileToUserProfile(p: any, email?: string): UserProfile {
  const isLuffy =
    p?.discord_username?.toLowerCase().includes("freakyfamous") ||
    p?.whatnot_username?.toLowerCase() === "all_out_luffy" ||
    p?.username?.toLowerCase() === "all_out_luffy";
  const role: UserRole =
    p?.role === "founder"
      ? "founder"
      : isLuffy
      ? "admin"
      : p?.role || "member";

  const localStats = p?.id ? getLocalBoosterStats(p.id) : {
    manaPoints: 0,
    boosterPacks: 0,
    lastDailyBoosterClaimedAt: null,
    hasReceivedDiscordWelcomePack: false,
    openedBoostersCount: 0,
  };
  const manaPoints = p?.mana_points ?? localStats.manaPoints ?? 0;
  const boosterPacks = p?.booster_packs ?? localStats.boosterPacks ?? 0;
  const lastDailyBoosterClaimedAt = p?.last_daily_booster_at ?? localStats.lastDailyBoosterClaimedAt ?? null;
  const hasReceivedDiscordWelcomePack = Boolean(
    p?.has_received_discord_welcome_pack || localStats.hasReceivedDiscordWelcomePack
  );
  const openedBoostersCount = p?.opened_boosters_count ?? localStats.openedBoostersCount ?? 0;

  return {
    id: p.id,
    username: p.username || (isLuffy ? "all_out_luffy" : "Sammler"),
    avatarUrl: p.avatar_url || (isLuffy ? LUFFY_AVATAR : DEFAULT_AVATAR),
    role,
    verified: isLuffy ? true : Boolean(p.verified),
    dealsCount: p.deals_count || (isLuffy ? 18 : 0),
    whatnotUsername: p.whatnot_username || (isLuffy ? "all_out_luffy" : undefined),
    discordUsername: p.discord_username || (isLuffy ? "freakyfamous#0" : undefined),
    bio:
      p.bio ||
      (isLuffy
        ? "Manaforge Administrator · Whatnot: all_out_luffy · Discord: @freakyfamous#0"
        : undefined),
    createdAt: p.created_at || new Date().toISOString(),
    email,
    manaPoints,
    boosterPacks,
    lastDailyBoosterClaimedAt,
    hasReceivedDiscordWelcomePack,
    openedBoostersCount,
  };
}

function mapDBListingToCardListing(
  item: any,
  profilesById?: Map<string, UserProfile>
): CardListing {
  const joinedProfile = item.user && item.user.id ? mapDBProfileToUserProfile(item.user) : null;
  const fallbackProfile = profilesById?.get(item.user_id) || null;
  const resolvedUser: UserProfile = joinedProfile || fallbackProfile || {
    id: item.user_id,
    username: "Sammler",
    avatarUrl: DEFAULT_AVATAR,
    role: "member",
    verified: false,
    dealsCount: 0,
    createdAt: item.created_at || new Date().toISOString(),
  };

  return {
    id: item.id,
    userId: item.user_id,
    type: item.type,
    name: item.name,
    set: item.set_name || undefined,
    cardNumber: item.card_number || undefined,
    language: item.language,
    condition: item.condition,
    photos: Array.isArray(item.photos) ? item.photos.filter(Boolean) : [],
    videoUrl: item.video_url || undefined,
    description: item.description || "",
    price: item.price !== null && item.price !== undefined ? Number(item.price) : undefined,
    priceRange: item.price_range || undefined,
    estimatedTradeValue:
      item.estimated_trade_value !== null && item.estimated_trade_value !== undefined
        ? Number(item.estimated_trade_value)
        : undefined,
    lookingForWants: item.looking_for_wants || undefined,
    allowOffers: item.allow_offers ?? true,
    postToDiscord: item.post_to_discord ?? true,
    showDiscordName: item.show_discord_name ?? true,
    status: item.status || "active",
    createdAt: item.created_at,
    user: resolvedUser,
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
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

  const recoveredUserIdsRef = useRef<Set<string>>(new Set());
  const lastRefreshAtRef = useRef<number>(0);

  const openAuthModal = (mode: AuthModalMode = "register") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  // Stellt sicher, dass für einen authentifizierten Supabase-Benutzer ein Profil-Datensatz existiert
  const ensureProfileForAuthUser = useCallback(async (user: any): Promise<any | null> => {
    if (!isSupabaseConfigured || !supabase || !user?.id) return null;

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (existingProfile) {
      return existingProfile;
    }

    const rawMeta = user.user_metadata || {};
    const baseName = (
      rawMeta.username ||
      rawMeta.user_name ||
      rawMeta.full_name ||
      (user.email ? user.email.split("@")[0] : "Trainer")
    )
      .toString()
      .trim()
      .replace(/\s+/g, "_");

    const avatar = rawMeta.avatar_url || rawMeta.picture || DEFAULT_AVATAR;
    const disc =
      rawMeta.custom_claims?.discord_tag ||
      rawMeta.discord_username ||
      (user.app_metadata?.provider === "discord" ? baseName : null);

    const isLuffyAdmin =
      disc?.toLowerCase().includes("freakyfamous") ||
      baseName?.toLowerCase().includes("freakyfamous") ||
      baseName?.toLowerCase() === "all_out_luffy" ||
      rawMeta.whatnot_username?.toLowerCase() === "all_out_luffy" ||
      rawMeta.full_name?.toLowerCase().includes("freakyfamous") ||
      rawMeta.user_name?.toLowerCase().includes("freakyfamous");

    const assignedRole: UserRole =
      user.email === "levin@rohde-media.de" || baseName === "Levin_Mana"
        ? "founder"
        : isLuffyAdmin
        ? "admin"
        : "member";

    const tryUpsert = async (candidateUsername: string) =>
      supabase!
        .from("profiles")
        .upsert({
          id: user.id,
          username: candidateUsername,
          avatar_url: avatar,
          role: assignedRole,
          verified: assignedRole === "founder" || assignedRole === "admin",
          deals_count: 0,
          discord_username: disc,
        })
        .select("*")
        .maybeSingle();

    const firstAttempt = await tryUpsert(baseName || `Trainer_${user.id.slice(0, 6)}`);
    if (!firstAttempt.error && firstAttempt.data) {
      return firstAttempt.data;
    }

    // Falls der Benutzername bereits belegt ist (23505), eindeutigen Suffix anhängen
    const fallbackName = `${baseName || "Trainer"}_${user.id.slice(0, 4)}`;
    const secondAttempt = await tryUpsert(fallbackName);
    return secondAttempt.data || null;
  }, []);

  // Zentrale Synchronisation aller Marktplatz-Daten (Inserate, Profile, Tauschangebote, Deals & Ankäufe)
  const refreshMarketplaceData = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      try {
        localStorage.removeItem("manaverse_listings");
        const savedListings = localStorage.getItem("manaforge_listings");
        if (savedListings) {
          const parsed = JSON.parse(savedListings);
          if (Array.isArray(parsed)) {
            setListings(parsed.filter((l: CardListing) => l && l.id && !l.id.startsWith("list-mock")));
            return;
          }
        }
      } catch (e) {
        console.error("LocalStorage fallback error:", e);
      }
      setListings([]);
      return;
    }

    try {
      lastRefreshAtRef.current = Date.now();

      // 1. Profile laden
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      // Falls ein abgelaufenes/ungültiges JWT alle Anfragen blockiert, bereinigen & neu versuchen
      if (
        profilesError &&
        (profilesError.code === "PGRST301" ||
          profilesError.message?.toLowerCase().includes("jwt"))
      ) {
        await supabase.auth.signOut();
      }

      const profilesById = new Map<string, UserProfile>();
      if (profilesData && profilesData.length > 0) {
        const mappedProfiles: UserProfile[] = profilesData.map((p: any) => {
          const isLuffy =
            p.discord_username?.toLowerCase().includes("freakyfamous") ||
            p.whatnot_username?.toLowerCase() === "all_out_luffy" ||
            p.username?.toLowerCase() === "all_out_luffy";
          if (isLuffy && p.role !== "admin" && p.role !== "founder" && supabase) {
            supabase.from("profiles").update({ role: "admin" }).eq("id", p.id).then();
          }

          const mapped = mapDBProfileToUserProfile(p);
          if (p.booster_packs !== undefined && p.booster_packs !== null) {
            setLocalBoosterStats(p.id, {
              manaPoints: mapped.manaPoints,
              boosterPacks: mapped.boosterPacks,
              lastDailyBoosterClaimedAt: mapped.lastDailyBoosterClaimedAt,
              hasReceivedDiscordWelcomePack: mapped.hasReceivedDiscordWelcomePack,
              openedBoostersCount: mapped.openedBoostersCount,
            });
          }
          profilesById.set(mapped.id, mapped);
          return mapped;
        });

        const missingSeeds = MOCK_USERS.filter(
          (m) =>
            !mappedProfiles.some(
              (f) =>
                f.username.toLowerCase() === m.username.toLowerCase() ||
                (f.discordUsername &&
                  m.discordUsername &&
                  f.discordUsername.toLowerCase() === m.discordUsername.toLowerCase())
            )
        ).map((m) => {
          const localStats = getLocalBoosterStats(m.id);
          return {
            ...m,
            manaPoints: localStats.manaPoints || m.manaPoints || 0,
            boosterPacks: localStats.boosterPacks ?? (m.boosterPacks !== undefined ? m.boosterPacks : 0),
            lastDailyBoosterClaimedAt: localStats.lastDailyBoosterClaimedAt || m.lastDailyBoosterClaimedAt || null,
            hasReceivedDiscordWelcomePack: localStats.hasReceivedDiscordWelcomePack || Boolean(m.hasReceivedDiscordWelcomePack),
            openedBoostersCount: localStats.openedBoostersCount || m.openedBoostersCount || 0,
          };
        });

        setUsers([...mappedProfiles, ...missingSeeds]);
      }

      // 2. Inserate (alle Sektionen: Kaufen/Verkaufen, Tauschen, Gesucht, Entwürfe) laden
      let { data: listingsData, error: listingsError } = await supabase
        .from("listings")
        .select("*, user:profiles(*)")
        .order("created_at", { ascending: false });

      if (listingsError) {
        console.warn("Joined listings query warning, retrying plain select:", listingsError.message);
        const fallbackRes = await supabase
          .from("listings")
          .select("*")
          .order("created_at", { ascending: false });
        listingsData = fallbackRes.data;
        listingsError = fallbackRes.error;
      }

      let mappedListings: CardListing[] = [];
      if (!listingsError && listingsData) {
        mappedListings = listingsData.map((row: any) =>
          mapDBListingToCardListing(row, profilesById)
        );
        setListings(mappedListings);
        persistLightweightListingsCache(mappedListings);
      }

      const listingsById = new Map<string, CardListing>(
        mappedListings.map((l) => [l.id, l])
      );

      // 3. Tauschangebote, Deals & Sammlungs-Ankäufe parallel laden
      const [offersRes, dealsRes, bulkRes] = await Promise.all([
        supabase
          .from("trade_offers")
          .select("*, from_user:profiles!trade_offers_from_user_id_fkey(*)")
          .order("created_at", { ascending: false }),
        supabase
          .from("deals")
          .select("*, seller:profiles!deals_seller_id_fkey(username), buyer:profiles!deals_buyer_id_fkey(username)")
          .order("created_at", { ascending: false }),
        supabase
          .from("bulk_submissions")
          .select("*, user:profiles(*)")
          .order("created_at", { ascending: false }),
      ]);

      if (!offersRes.error && offersRes.data) {
        const mappedOffers: TradeOffer[] = offersRes.data
          .map((row: any) => {
            const targetListing = listingsById.get(row.listing_id);
            if (!targetListing) return null;
            const fromUser = row.from_user
              ? mapDBProfileToUserProfile(row.from_user)
              : profilesById.get(row.from_user_id) || {
                  id: row.from_user_id,
                  username: "Sammler",
                  avatarUrl: DEFAULT_AVATAR,
                  role: "member" as UserRole,
                  verified: false,
                  dealsCount: 0,
                  createdAt: row.created_at,
                };
            return {
              id: row.id,
              listingId: row.listing_id,
              listing: targetListing,
              fromUserId: row.from_user_id,
              fromUser,
              offeredCardsDescription: row.offered_cards_description,
              offeredImages: Array.isArray(row.offered_images) ? row.offered_images : [],
              estimatedValue: Number(row.estimated_value || 0),
              message: row.message || undefined,
              status: row.status || "pending",
              createdAt: row.created_at,
            } as TradeOffer;
          })
          .filter(Boolean) as TradeOffer[];
        setTradeOffers(mappedOffers);
      }

      if (!dealsRes.error && dealsRes.data) {
        const mappedDeals: DealConfirmation[] = dealsRes.data.map((row: any) => ({
          id: row.id,
          listingId: row.listing_id || "",
          listingTitle: row.listing_title,
          listingType: row.listing_type,
          priceOrValue:
            row.price_or_value !== null && row.price_or_value !== undefined
              ? Number(row.price_or_value)
              : undefined,
          sellerId: row.seller_id,
          sellerUsername:
            row.seller?.username || profilesById.get(row.seller_id)?.username || "Verkäufer",
          buyerId: row.buyer_id,
          buyerUsername:
            row.buyer?.username || profilesById.get(row.buyer_id)?.username || "Käufer",
          sellerConfirmed: Boolean(row.seller_confirmed),
          buyerConfirmed: Boolean(row.buyer_confirmed),
          status: row.status || "pending",
          createdAt: row.created_at,
          completedAt: row.completed_at || undefined,
        }));
        setDeals(mappedDeals);
      }

      if (!bulkRes.error && bulkRes.data) {
        const mappedBulk: BulkSubmission[] = bulkRes.data.map((row: any) => {
          const submitter = row.user
            ? mapDBProfileToUserProfile(row.user)
            : profilesById.get(row.user_id) || {
                id: row.user_id,
                username: "Sammler",
                avatarUrl: DEFAULT_AVATAR,
                role: "member" as UserRole,
                verified: false,
                dealsCount: 0,
                createdAt: row.created_at,
              };
          return {
            id: row.id,
            userId: row.user_id,
            user: submitter,
            totalCards: Number(row.total_cards || 0),
            cards: Array.isArray(row.cards_data) ? row.cards_data : [],
            askingPrice:
              row.asking_price !== null && row.asking_price !== undefined
                ? Number(row.asking_price)
                : undefined,
            notes: row.notes || undefined,
            status: row.status || "pending",
            createdAt: row.created_at,
          };
        });
        setBulkSubmissions(mappedBulk);
      }
    } catch (e) {
      console.error("Supabase Synchronisationsfehler:", e);
    }
  }, []);

  const loginWithDiscord = async (): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      const err = "Supabase ist nicht konfiguriert.";
      toast.error(err);
      return { error: err };
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem("manaforge_discord_welcome", "true");
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
      toast.error("Discord-Anmeldung fehlgeschlagen", error.message);
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
  ): Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }> => {
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

    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", cleanUsername)
      .maybeSingle();

    if (existingUser) {
      return { success: false, error: "Dieser Benutzername ist leider bereits vergeben." };
    }

    const redirectUrl =
      typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirectUrl,
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

    // Wichtig: Nur einloggen, wenn Supabase tatsächlich eine aktive Session zurückgibt!
    // Wenn E-Mail-Bestätigung aktiv ist (data.session === null), niemals im Ghost-Zustand einloggen.
    if (data?.session?.user) {
      await syncSessionUser(data.session.user);
      closeAuthModal();
      return { success: true };
    }

    return {
      success: true,
      requiresEmailConfirmation: true,
    };
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
  const syncSessionUser = useCallback(async (user: any) => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoadingAuth(false);
      return;
    }
    try {
      const profile = await ensureProfileForAuthUser(user);

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

        if (isLuffyAdmin && profile.role !== "admin" && profile.role !== "founder") {
          supabase.from("profiles").update({ role: "admin" }).eq("id", profile.id).then();
        }

        const localStats = getLocalBoosterStats(profile.id);
        const manaPoints = profile.mana_points ?? localStats.manaPoints ?? 0;
        let boosterPacks = profile.booster_packs ?? localStats.boosterPacks ?? 0;
        const lastDailyBoosterClaimedAt = profile.last_daily_booster_at ?? localStats.lastDailyBoosterClaimedAt ?? null;
        let hasReceivedDiscordWelcomePack = Boolean(
          profile.has_received_discord_welcome_pack || localStats.hasReceivedDiscordWelcomePack
        );
        const openedBoostersCount = profile.opened_boosters_count ?? localStats.openedBoostersCount ?? 0;

        const isDiscordUser = Boolean(
          user.app_metadata?.provider === "discord" ||
            profile.discord_username ||
            (typeof window !== "undefined" && sessionStorage.getItem("manaforge_discord_welcome") === "true")
        );

        if (isDiscordUser && !hasReceivedDiscordWelcomePack) {
          boosterPacks += 1;
          hasReceivedDiscordWelcomePack = true;
          setLocalBoosterStats(profile.id, {
            boosterPacks,
            hasReceivedDiscordWelcomePack: true,
          });
          supabase
            .from("profiles")
            .update({
              booster_packs: boosterPacks,
              has_received_discord_welcome_pack: true,
            })
            .eq("id", profile.id)
            .then();
        }

        setLocalBoosterStats(profile.id, {
          manaPoints,
          boosterPacks,
          lastDailyBoosterClaimedAt,
          hasReceivedDiscordWelcomePack,
          openedBoostersCount,
        });

        const authUser: UserProfile = {
          ...mapDBProfileToUserProfile(profile, user.email),
          role: effectiveRole,
          manaPoints,
          boosterPacks,
          lastDailyBoosterClaimedAt,
          hasReceivedDiscordWelcomePack,
          openedBoostersCount,
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
  }, [ensureProfileForAuthUser]);

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
  }, [syncSessionUser]);

  // Initialer & Session-abhängiger Marktplatz-Abruf + Echtzeit-Synchronisation über Supabase Realtime
  useEffect(() => {
    refreshMarketplaceData();

    const client = supabase;
    if (!isSupabaseConfigured || !client) return;

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const scheduleRefresh = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        refreshMarketplaceData();
      }, 250);
    };

    const channel = client
      .channel(`manaforge-live-sync-${sessionUser?.id || "anon"}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "listings" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "trade_offers" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "deals" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "bulk_submissions" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, scheduleRefresh)
      .subscribe();

    const handleVisibilityOrFocus = () => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      if (Date.now() - lastRefreshAtRef.current > 4_000) {
        refreshMarketplaceData();
      }
    };

    // Fallback-Intervall (alle 15s bei aktivem Tab), falls Mobile-Browser/Firewalls WebSockets drosseln
    const pollInterval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      refreshMarketplaceData();
    }, 15_000);

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      clearInterval(pollInterval);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      client.removeChannel(channel);
    };
  }, [refreshMarketplaceData, sessionUser?.id]);

  // Bei jedem Seitenwechsel (/buy, /sell, /trade, /looking-for, /profile) frisch synchronisieren
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    if (Date.now() - lastRefreshAtRef.current > 2_000) {
      refreshMarketplaceData();
    }
  }, [pathname, refreshMarketplaceData]);

  // Automatische Synchronisierung zwischengespeicherter lokaler Inserate in Supabase, sobald eine echte Session besteht
  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client || !sessionUser?.id) return;
    if (recoveredUserIdsRef.current.has(sessionUser.id)) return;

    const migrateLocalPending = async () => {
      try {
        rescueLegacyLocalListingsBeforeOverwrite();
        const raw = localStorage.getItem(UNSYNCED_STORAGE_KEY);
        if (!raw) {
          recoveredUserIdsRef.current.add(sessionUser.id);
          return;
        }
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          recoveredUserIdsRef.current.add(sessionUser.id);
          return;
        }

        const { data: sessionData } = await client.auth.getSession();
        const activeAuthUser = sessionData?.session?.user;
        if (!activeAuthUser) return;

        await ensureProfileForAuthUser(activeAuthUser);

        const remaining: any[] = [];
        let migratedCount = 0;

        for (const pending of parsed) {
          if (!pending || !pending.name) continue;
          const hostedPhotos = await Promise.all(
            (Array.isArray(pending.photos) ? pending.photos : [])
              .filter((p: string) => typeof p === "string" && p.trim() !== "")
              .map((p: string) => ensureHostedCardPhoto(p, activeAuthUser.id))
          );

          const { error } = await client.from("listings").insert({
            user_id: activeAuthUser.id,
            type: pending.type || "sell",
            name: pending.name,
            set_name: pending.set || null,
            card_number: pending.cardNumber || null,
            language: pending.language || "DE",
            condition: pending.condition || "NM",
            photos: hostedPhotos,
            video_url: pending.videoUrl || null,
            description: pending.description || "",
            price: pending.price ?? null,
            price_range: pending.priceRange || null,
            estimated_trade_value: pending.estimatedTradeValue ?? null,
            looking_for_wants: pending.lookingForWants || null,
            allow_offers: pending.allowOffers ?? true,
            post_to_discord: false,
            show_discord_name: pending.showDiscordName ?? true,
            status: pending.status || "active",
          });

          if (!error) {
            migratedCount += 1;
          } else {
            remaining.push(pending);
          }
        }

        if (remaining.length === 0) {
          localStorage.removeItem(UNSYNCED_STORAGE_KEY);
        } else {
          localStorage.setItem(UNSYNCED_STORAGE_KEY, JSON.stringify(remaining));
        }

        recoveredUserIdsRef.current.add(sessionUser.id);

        if (migratedCount > 0) {
          await refreshMarketplaceData();
        }
      } catch (err) {
        console.warn("Lokale Inserat-Synchronisierung übersprungen:", err);
      }
    };

    migrateLocalPending();
  }, [sessionUser, ensureProfileForAuthUser, refreshMarketplaceData]);

  const currentUser: UserProfile | null =
    sessionUser || (currentUserId ? users.find((u) => u.id === currentUserId) || null : null);

  const isAuthenticated = Boolean(currentUser);

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  const [isBoosterModalOpen, setIsBoosterModalOpen] = useState(false);
  const [dailyBoosterCountdown, setDailyBoosterCountdown] = useState<string>("Bereit!");
  const [canClaimDailyBooster, setCanClaimDailyBooster] = useState<boolean>(true);

  useEffect(() => {
    const updateCountdown = () => {
      if (!currentUser) {
        setCanClaimDailyBooster(true);
        setDailyBoosterCountdown("Bereit!");
        return;
      }
      const info = formatDailyBoosterCountdown(currentUser.lastDailyBoosterClaimedAt);
      setCanClaimDailyBooster(info.isReady);
      setDailyBoosterCountdown(info.formatted);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const openBoosterModal = () => setIsBoosterModalOpen(true);
  const closeBoosterModal = () => setIsBoosterModalOpen(false);

  const updateUserBoosterData = async (
    userId: string,
    updates: {
      manaPoints?: number;
      boosterPacks?: number;
      lastDailyBoosterClaimedAt?: string | null;
      hasReceivedDiscordWelcomePack?: boolean;
      openedBoostersCount?: number;
    }
  ) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
    if (sessionUser && sessionUser.id === userId) {
      setSessionUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
    setLocalBoosterStats(userId, updates);

    if (isSupabaseConfigured && supabase) {
      try {
        const payload: Record<string, unknown> = {};
        if (updates.manaPoints !== undefined) payload.mana_points = updates.manaPoints;
        if (updates.boosterPacks !== undefined) payload.booster_packs = updates.boosterPacks;
        if (updates.lastDailyBoosterClaimedAt !== undefined) payload.last_daily_booster_at = updates.lastDailyBoosterClaimedAt;
        if (updates.hasReceivedDiscordWelcomePack !== undefined) payload.has_received_discord_welcome_pack = updates.hasReceivedDiscordWelcomePack;
        if (updates.openedBoostersCount !== undefined) payload.opened_boosters_count = updates.openedBoostersCount;

        await supabase.from("profiles").update(payload).eq("id", userId);
      } catch (err) {
        console.warn("Supabase Booster-Aktualisierung übersprungen:", err);
      }
    }
  };

  const claimDailyBooster = async (): Promise<boolean> => {
    if (!currentUser) {
      openAuthModal("login");
      return false;
    }
    const claimable = isDailyBoosterClaimable(currentUser.lastDailyBoosterClaimedAt);
    if (!claimable) {
      return false;
    }

    const nowIso = new Date().toISOString();
    const newPacks = Math.max(1, (currentUser.boosterPacks ?? 0) > 0 ? currentUser.boosterPacks! : 1);

    await updateUserBoosterData(currentUser.id, {
      boosterPacks: newPacks,
      lastDailyBoosterClaimedAt: nowIso,
    });

    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.error(e);
    }

    return true;
  };

  const ripBoosterPack = async (): Promise<BoosterReward> => {
    if (!currentUser) {
      openAuthModal("login");
      throw new Error("Bitte melde dich an, um einen Booster zu öffnen.");
    }
    const currentPacks = currentUser.boosterPacks ?? 0;
    if (currentPacks <= 0) {
      throw new Error("Keine Booster Packs mehr verfügbar.");
    }

    const reward = rollBoosterReward();
    const newPacks = Math.max(0, currentPacks - 1);
    const newMana = (currentUser.manaPoints ?? 0) + reward.manaPoints;
    const newOpenedCount = (currentUser.openedBoostersCount ?? 0) + 1;

    await updateUserBoosterData(currentUser.id, {
      boosterPacks: newPacks,
      manaPoints: newMana,
      openedBoostersCount: newOpenedCount,
    });

    return reward;
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;

    if (data.username) {
      data.username = data.username.replace(/\s+/g, "_");
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...data } : u))
    );
    if (sessionUser && sessionUser.id === currentUser.id) {
      setSessionUser((prev) => (prev ? { ...prev, ...data } : null));
    }

    setListings((prev) => {
      const updated = prev.map((item) => {
        if (
          item.userId === currentUser.id ||
          item.user?.id === currentUser.id ||
          (currentUser.username && item.user?.username?.toLowerCase() === currentUser.username.toLowerCase())
        ) {
          return {
            ...item,
            user: {
              ...item.user,
              ...data,
              username: data.username ?? item.user.username,
              avatarUrl: data.avatarUrl ?? item.user.avatarUrl,
              bio: data.bio !== undefined ? data.bio : item.user.bio,
              whatnotUsername: data.whatnotUsername !== undefined ? data.whatnotUsername : item.user.whatnotUsername,
              discordUsername: data.discordUsername !== undefined ? data.discordUsername : item.user.discordUsername,
            },
          };
        }
        return item;
      });
      persistLightweightListingsCache(updated);
      return updated;
    });

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
    if (!currentUser || (currentUser.role !== "founder" && currentUser.role !== "admin")) {
      return { success: false, error: "Nur Administratoren dürfen Rollen zuweisen." };
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    if (sessionUser && sessionUser.id === userId) {
      setSessionUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }

    setListings((prev) =>
      prev.map((l) =>
        l.userId === userId
          ? { ...l, user: { ...l.user, role: newRole } }
          : l
      )
    );

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

  const dispatchDiscordWebhook = async (listing: CardListing) => {
    let channel: "sell" | "trade" | "looking_for" = "sell";
    let embedColor = 0xfbbf24;
    let typeLabel = "VERKAUF";

    if (listing.type === "sell") {
      channel = "sell";
      embedColor = 0xfbbf24;
      typeLabel = "VERKAUF";
    } else if (listing.type === "trade") {
      channel = "trade";
      embedColor = 0x8b5cf6;
      typeLabel = "TAUSCH";
    } else if (listing.type === "looking_for") {
      channel = "looking_for";
      embedColor = 0xf97316;
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

    const discordDisplay =
      listing.showDiscordName === false
        ? "Auf Anfrage"
        : listing.user.discordUsername
        ? `@${listing.user.discordUsername}`
        : "Nicht hinterlegt";

    fields.push({
      name: listing.type === "looking_for" ? "Gesucht von" : "Anbieter",
      value: `${listing.user.username} (Discord: ${discordDisplay})`,
      inline: false,
    });

    const firstHttpPhoto = listing.photos.find((p) => p.startsWith("http"));

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
            image: firstHttpPhoto ? { url: firstHttpPhoto } : undefined,
          },
          slabData: {
            name: listing.name,
            set: listing.set,
            cardNumber: listing.cardNumber,
            condition: listing.condition,
            language: listing.language,
            type: listing.type,
            price: listing.price,
            estimatedTradeValue: listing.estimatedTradeValue,
            photoUrl: listing.photos[0],
            username: listing.user?.username || "Manaforge Trainer",
            discordUsername:
              listing.showDiscordName === false ? undefined : listing.user?.discordUsername,
            avatarUrl: listing.user?.avatarUrl,
            dealsCount: listing.user?.dealsCount || 0,
            allowOffers: listing.allowOffers ?? true,
          },
        }),
      });
    } catch (err) {
      console.warn("Secure Discord notification trigger failed:", err);
    }
  };

  const addListing = async (
    listingData: Omit<CardListing, "id" | "userId" | "user" | "createdAt" | "status"> & { status?: CardListing["status"] }
  ): Promise<CardListing> => {
    if (!currentUser) {
      openAuthModal("register");
      throw new Error("Bitte melde dich an, um eine Karte anzubieten.");
    }

    const initialStatus = listingData.status || "active";
    let newListing: CardListing;

    if (isSupabaseConfigured && supabase) {
      // 1. Echte authentifizierte Sitzung verifizieren (inkl. automatischem Token-Refresh nach >1h Tab-Laufzeit)
      let authUser = (await supabase.auth.getSession()).data?.session?.user || null;
      if (!authUser) {
        const refreshed = await supabase.auth.refreshSession();
        authUser = refreshed.data?.session?.user || null;
      }
      if (!authUser) {
        authUser = (await supabase.auth.getUser()).data?.user || null;
      }

      if (!authUser) {
        // Karte sicher zwischenspeichern, damit sie nach dem Login sofort automatisch veröffentlicht wird
        stageUnsyncedListing({
          ...listingData,
          id: `list-${Date.now()}`,
          status: initialStatus,
        });
        setSessionUser(null);
        setCurrentUserId(null);
        openAuthModal("login");
        throw new Error(
          "Deine Sitzung ist nicht aktiv (z. B. E-Mail noch unbestätigt oder Anmeldung abgelaufen). Deine Eingaben wurden gesichert – bitte melde dich kurz an, dann wird die Karte automatisch veröffentlicht!"
        );
      }

      // 2. Sicherstellen, dass das öffentliche Profil in public.profiles existiert
      await ensureProfileForAuthUser(authUser);

      // 3. Fotos komprimieren & in den öffentlichen Supabase Storage Bucket 'card-photos' hochladen
      const hostedPhotos = await Promise.all(
        (listingData.photos || [])
          .filter((p) => p && p.trim() !== "")
          .map((p) => ensureHostedCardPhoto(p, authUser.id))
      );

      const insertPayload: Record<string, unknown> = {
        user_id: authUser.id,
        type: listingData.type,
        name: listingData.name,
        set_name: listingData.set || null,
        card_number: listingData.cardNumber || null,
        language: listingData.language,
        condition: listingData.condition,
        photos: hostedPhotos,
        video_url: listingData.videoUrl || null,
        description: listingData.description || "",
        price: listingData.price ?? null,
        price_range: listingData.priceRange || null,
        estimated_trade_value: listingData.estimatedTradeValue ?? null,
        looking_for_wants: listingData.lookingForWants || null,
        allow_offers: listingData.allowOffers ?? true,
        post_to_discord: listingData.postToDiscord ?? true,
        show_discord_name: listingData.showDiscordName ?? true,
        status: initialStatus,
      };

      let { data, error } = await supabase
        .from("listings")
        .insert(insertPayload)
        .select("*, user:profiles(*)")
        .single();

      // Defensiver Fallback, falls eine optionale Spalte im Schema-Cache noch nicht geladen ist
      if (error && error.message?.includes("show_discord_name")) {
        const { show_discord_name: _ignored, ...fallbackPayload } = insertPayload;
        const retry = await supabase
          .from("listings")
          .insert(fallbackPayload)
          .select("*, user:profiles(*)")
          .single();
        data = retry.data;
        error = retry.error;
      }

      if (error || !data) {
        console.error("Supabase addListing Fehler:", error);
        throw new Error(
          `Inserat konnte nicht in der Datenbank gespeichert werden: ${
            error?.message || "Unbekannter Datenbankfehler"
          }`
        );
      }

      const profilesById = new Map(users.map((u) => [u.id, u]));
      newListing = mapDBListingToCardListing(data, profilesById);
    } else {
      newListing = {
        ...listingData,
        id: `list-${Date.now()}`,
        userId: currentUser.id,
        user: currentUser,
        status: initialStatus,
        createdAt: new Date().toISOString(),
      };
    }

    setListings((prev) => {
      const deduplicated = [newListing, ...prev.filter((l) => l.id !== newListing.id)];
      persistLightweightListingsCache(deduplicated);
      return deduplicated;
    });

    if (newListing.postToDiscord && newListing.status === "active") {
      await dispatchDiscordWebhook(newListing);
    }

    return newListing;
  };

  const updateListingStatus = async (listingId: string, newStatus: CardListing["status"]) => {
    let updatedListing: CardListing | undefined;

    setListings((prev) => {
      const updated = prev.map((l) => {
        if (l.id === listingId) {
          updatedListing = { ...l, status: newStatus };
          return updatedListing;
        }
        return l;
      });
      persistLightweightListingsCache(updated);
      return updated;
    });

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("listings")
        .update({ status: newStatus })
        .eq("id", listingId);

      if (error) {
        console.error("Supabase updateListingStatus error:", error);
        await refreshMarketplaceData();
        return;
      }
    }

    if (newStatus === "active" && updatedListing?.postToDiscord) {
      await dispatchDiscordWebhook(updatedListing);
    }
  };

  const deleteListing = async (listingId: string) => {
    setListings((prev) => {
      const updated = prev.filter((l) => l.id !== listingId);
      persistLightweightListingsCache(updated);
      return updated;
    });

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("listings").delete().eq("id", listingId);
      if (error) {
        console.error("Supabase deleteListing error:", error);
        await refreshMarketplaceData();
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
    let hostedImages = offerData.offeredImages;

    if (isSupabaseConfigured && supabase) {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        const uid = authUser?.id || currentUser.id;
        if (authUser) {
          await ensureProfileForAuthUser(authUser);
        }

        hostedImages = await Promise.all(
          (offerData.offeredImages || [])
            .filter(Boolean)
            .map((img) => ensureHostedCardPhoto(img, uid))
        );

        const { data, error } = await supabase
          .from("trade_offers")
          .insert({
            listing_id: listingId,
            from_user_id: uid,
            offered_cards_description: offerData.offeredCardsDescription,
            offered_images: hostedImages,
            estimated_value: offerData.estimatedValue,
            message: offerData.message || null,
            status: "pending",
          })
          .select("id")
          .single();

        if (!error && data) {
          offerId = data.id;
        } else if (error) {
          console.error("Supabase addTradeOffer error:", error);
        }
      } catch (err) {
        console.error("Supabase addTradeOffer exception:", err);
      }
    }

    const newOffer: TradeOffer = {
      id: offerId,
      listingId,
      listing,
      fromUserId: currentUser.id,
      fromUser: currentUser,
      ...offerData,
      offeredImages: hostedImages,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setTradeOffers((prev) => [newOffer, ...prev.filter((o) => o.id !== newOffer.id)]);
  };

  const respondToTradeOffer = async (offerId: string, status: "accepted" | "declined"): Promise<boolean> => {
    const previous = tradeOffers;
    setTradeOffers((prev) => prev.map((o) => (o.id === offerId ? { ...o, status } : o)));

    if (isSupabaseConfigured && supabase && !offerId.startsWith("offer-")) {
      const { error } = await supabase.from("trade_offers").update({ status }).eq("id", offerId);
      if (error) {
        console.error("Supabase respondToTradeOffer error:", error);
        setTradeOffers(previous);
        return false;
      }
    }
    return true;
  };

  const updateBulkSubmissionStatus = async (
    submissionId: string,
    status: BulkSubmission["status"]
  ): Promise<boolean> => {
    const previous = bulkSubmissions;
    setBulkSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status } : s))
    );

    if (isSupabaseConfigured && supabase && !submissionId.startsWith("bulk-")) {
      const { error } = await supabase
        .from("bulk_submissions")
        .update({ status })
        .eq("id", submissionId);
      if (error) {
        console.error("Supabase updateBulkSubmissionStatus error:", error);
        setBulkSubmissions(previous);
        return false;
      }
    }
    return true;
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
    let hostedCards = submissionData.cards;

    if (isSupabaseConfigured && supabase) {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        const uid = authUser?.id || currentUser.id;
        if (authUser) {
          await ensureProfileForAuthUser(authUser);
        }

        hostedCards = await Promise.all(
          submissionData.cards.map(async (c) => ({
            ...c,
            image: c.image ? await ensureHostedCardPhoto(c.image, uid) : c.image,
          }))
        );

        const { data, error } = await supabase
          .from("bulk_submissions")
          .insert({
            user_id: uid,
            total_cards: hostedCards.length,
            cards_data: hostedCards,
            asking_price: submissionData.askingPrice ?? null,
            notes: submissionData.notes || null,
            status: "pending",
          })
          .select("id")
          .single();

        if (!error && data) {
          submissionId = data.id;
        } else if (error) {
          console.error("Supabase addBulkSubmission error:", error);
        }
      } catch (err) {
        console.error("Supabase addBulkSubmission exception:", err);
      }
    }

    const newSubmission: BulkSubmission = {
      id: submissionId,
      userId: currentUser.id,
      user: currentUser,
      totalCards: hostedCards.length,
      cards: hostedCards,
      askingPrice: submissionData.askingPrice,
      notes: submissionData.notes,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setBulkSubmissions((prev) => [
      newSubmission,
      ...prev.filter((s) => s.id !== newSubmission.id),
    ]);

    try {
      await fetch("/api/discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "bulk",
          embed: {
            title: `[MANACARDS ANKAUF] Neue Sammlung eingereicht von ${currentUser.username}!`,
            description: `Enthält **${newSubmission.totalCards} Karten**. Wunschpreis: ${newSubmission.askingPrice ? `${newSubmission.askingPrice} €` : "Offen / Gebot erwünscht"}\n\nNotizen: ${newSubmission.notes || "Keine"}`,
            color: 0xe2e8f0,
            fields: newSubmission.cards.slice(0, 5).map((c, i) => ({
              name: `Karte #${i + 1}: ${c.name}`,
              value: `Zustand: ${c.condition} | Sprache: ${c.language}${c.estimatedValue ? ` | Wert: ${c.estimatedValue} €` : ""}`,
              inline: true,
            })),
            image:
              newSubmission.cards[0]?.image && newSubmission.cards[0].image.startsWith("http")
                ? { url: newSubmission.cards[0].image }
                : undefined,
          },
          slabData: {
            name: `Sammlung (${newSubmission.totalCards} Karten)`,
            set: "Verschiedene Sets",
            cardNumber: `${newSubmission.totalCards}x`,
            condition: newSubmission.cards[0]?.condition || "NM",
            language: newSubmission.cards[0]?.language || "DE",
            type: "bulk",
            price: newSubmission.askingPrice,
            photoUrl: newSubmission.cards[0]?.image,
            username: currentUser.username,
            discordUsername: currentUser.discordUsername,
            avatarUrl: currentUser.avatarUrl,
            dealsCount: currentUser.dealsCount || 0,
            allowOffers: true,
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
            listing_id: listing.id.startsWith("list-") ? null : listing.id,
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
        } else if (error) {
          console.error("Supabase createDeal error:", error);
        }
      } catch (err) {
        console.error("Supabase createDeal exception:", err);
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

    setDeals((prev) => [newDeal, ...prev.filter((d) => d.id !== newDeal.id)]);
  };

  const confirmDeal = async (dealId: string, asRole: "seller" | "buyer") => {
    const targetDeal = deals.find((d) => d.id === dealId);
    if (!targetDeal) return;

    const nextSellerConfirmed = asRole === "seller" ? true : targetDeal.sellerConfirmed;
    const nextBuyerConfirmed = asRole === "buyer" ? true : targetDeal.buyerConfirmed;
    const isNowCompleted =
      nextSellerConfirmed && nextBuyerConfirmed && targetDeal.status !== "completed";
    const completedIso = isNowCompleted ? new Date().toISOString() : targetDeal.completedAt;

    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id !== dealId) return deal;
        return {
          ...deal,
          sellerConfirmed: nextSellerConfirmed,
          buyerConfirmed: nextBuyerConfirmed,
          status: isNowCompleted ? "completed" : deal.status,
          completedAt: completedIso,
        };
      })
    );

    if (isNowCompleted) {
      setUsers((uList) =>
        uList.map((u) => {
          if (u.id === targetDeal.sellerId || u.id === targetDeal.buyerId) {
            const newCount = u.dealsCount + 1;
            const becomesVerified = u.verified || newCount >= 3;
            if (becomesVerified && !u.verified) {
              try {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              } catch (e) {
                console.error(e);
              }
            }
            return { ...u, dealsCount: newCount, verified: becomesVerified };
          }
          return u;
        })
      );
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const updatePayload: Record<string, unknown> = {
          seller_confirmed: nextSellerConfirmed,
          buyer_confirmed: nextBuyerConfirmed,
        };
        if (isNowCompleted) {
          updatePayload.status = "completed";
          updatePayload.completed_at = completedIso;
        }
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
        updateListingStatus,
        deleteListing,
        addTradeOffer,
        respondToTradeOffer,
        addBulkSubmission,
        updateBulkSubmissionStatus,
        confirmDeal,
        createDeal,
        manaPoints: currentUser?.manaPoints ?? 0,
        availableBoosters: currentUser?.boosterPacks ?? 0,
        openedBoostersCount: currentUser?.openedBoostersCount ?? 0,
        canClaimDailyBooster,
        dailyBoosterCountdown,
        isBoosterModalOpen,
        openBoosterModal,
        closeBoosterModal,
        claimDailyBooster,
        ripBoosterPack,
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
