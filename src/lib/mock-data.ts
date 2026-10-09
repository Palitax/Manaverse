import { CardListing, UserProfile, DealConfirmation, BulkSubmission } from "@/types";

// Public profiles: strictly no emails or private credentials
export const MOCK_USERS: UserProfile[] = [
  {
    id: "a0000000-0000-0000-0000-000000000001",
    username: "Levin_Mana",
    avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
    role: "founder",
    verified: true,
    dealsCount: 12,
    whatnotUsername: "ManaverseLive",
    discordUsername: "Levin#0001",
    bio: "Inhaber Manacards & Streamer auf Whatnot. Vintage & High-End Modern.",
    createdAt: "2024-01-10T12:00:00Z",
    manaPoints: 750,
    boosterPacks: 10,
    hasReceivedDiscordWelcomePack: true,
    openedBoostersCount: 5,
  },
  {
    id: "a0000000-0000-0000-0000-000000000004",
    username: "all_out_luffy",
    avatarUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80",
    role: "admin",
    verified: true,
    dealsCount: 18,
    whatnotUsername: "all_out_luffy",
    discordUsername: "freakyfamous#0",
    bio: "Manaforge Administrator ⚡ • Whatnot: all_out_luffy • Discord: @freakyfamous#0",
    createdAt: "2024-01-20T10:00:00Z",
    manaPoints: 1200,
    boosterPacks: 10,
    hasReceivedDiscordWelcomePack: true,
    openedBoostersCount: 8,
  },
  {
    id: "a0000000-0000-0000-0000-000000000002",
    username: "KantoChampion_Tim",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    role: "member",
    verified: true,
    dealsCount: 5,
    whatnotUsername: "TimTCG",
    discordUsername: "Tim_Poke#1337",
    bio: "Leidenschaftlicher Sammler von Vintage WOTC & Glurak Karten.",
    createdAt: "2024-02-15T10:30:00Z",
    manaPoints: 300,
    boosterPacks: 1,
    hasReceivedDiscordWelcomePack: true,
    openedBoostersCount: 2,
  },
  {
    id: "a0000000-0000-0000-0000-000000000003",
    username: "Misty_WaterTrainer",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    role: "beta",
    verified: false,
    dealsCount: 2,
    whatnotUsername: "MistyStreams",
    discordUsername: "Misty#2468",
    bio: "Wasser-Pokémon Enthusiastin & Beta-Testerin für Manaforge.",
    createdAt: "2024-03-01T14:20:00Z",
    manaPoints: 150,
    boosterPacks: 1,
    hasReceivedDiscordWelcomePack: true,
    openedBoostersCount: 1,
  },
];

// Production initial state: Empty lists, completely free of placeholder / mock items
export const INITIAL_LISTINGS: CardListing[] = [];

export const INITIAL_DEALS: DealConfirmation[] = [];

export const INITIAL_BULK_SUBMISSIONS: BulkSubmission[] = [];
