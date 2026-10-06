import { CardListing, UserProfile, DealConfirmation, BulkSubmission } from "@/types";

// Public profiles: strictly no emails or private credentials
export const MOCK_USERS: UserProfile[] = [
  {
    id: "a0000000-0000-0000-0000-000000000001",
    username: "Levin_Mana",
    avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
    role: "founder",
    verified: true,
    dealsCount: 0,
    whatnotUsername: "ManaverseLive",
    discordUsername: "Levin#0001",
    bio: "Inhaber Manacards & Streamer auf Whatnot. Vintage & High-End Modern.",
    createdAt: "2024-01-10T12:00:00Z",
  },
];

// Production initial state: Empty lists, completely free of placeholder / mock items
export const INITIAL_LISTINGS: CardListing[] = [];

export const INITIAL_DEALS: DealConfirmation[] = [];

export const INITIAL_BULK_SUBMISSIONS: BulkSubmission[] = [];
