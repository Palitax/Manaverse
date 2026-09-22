export type UserRole = 'founder' | 'beta' | 'member' | 'admin';

export type CardCondition = 'NM' | 'EX' | 'GD' | 'LP' | 'PL' | 'PO' | 'Egal';

export type CardLanguage = 'DE' | 'EN' | 'JP' | 'OTHER' | 'Egal';

export type ListingType = 'sell' | 'trade' | 'looking_for';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  verified: boolean;
  dealsCount: number;
  whatnotUsername?: string;
  discordUsername?: string;
  bio?: string;
  createdAt: string;
}

export interface CardListing {
  id: string;
  userId: string;
  user: UserProfile;
  type: ListingType;
  name: string;
  set?: string;
  cardNumber?: string;
  language: CardLanguage;
  condition: CardCondition;
  photos: string[];
  videoUrl?: string;
  description: string;
  price?: number;
  priceRange?: string; // For looking_for, e.g. "50€ - 80€"
  allowOffers: boolean;
  estimatedTradeValue?: number; // For trade
  lookingForWants?: string; // For trade: what they want in return
  postToDiscord: boolean;
  status: 'active' | 'reserved' | 'completed';
  createdAt: string;
}

export interface TradeOffer {
  id: string;
  listingId: string;
  listing: CardListing;
  fromUserId: string;
  fromUser: UserProfile;
  offeredCardsDescription: string;
  offeredImages: string[];
  estimatedValue: number;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface BulkCardItem {
  id: string;
  name: string;
  language: CardLanguage;
  condition: CardCondition;
  image: string;
  estimatedValue?: number;
  notes?: string;
}

export interface BulkSubmission {
  id: string;
  userId: string;
  user: UserProfile;
  totalCards: number;
  cards: BulkCardItem[];
  askingPrice?: number;
  notes?: string;
  status: 'pending' | 'reviewing' | 'offer_sent' | 'completed';
  createdAt: string;
}

export interface DealConfirmation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingType: ListingType;
  priceOrValue?: number;
  sellerId: string;
  sellerUsername: string;
  buyerId: string;
  buyerUsername: string;
  sellerConfirmed: boolean;
  buyerConfirmed: boolean;
  status: 'pending' | 'completed';
  createdAt: string;
  completedAt?: string;
}

export interface DiscordWebhookConfig {
  sellWebhookUrl: string;
  tradeWebhookUrl: string;
  lookingForWebhookUrl: string;
  bulkWebhookUrl: string;
}

export interface PokemonApiCard {
  id: string;
  name: string;
  supertype?: string;
  subtypes?: string[];
  number?: string;
  set: {
    id: string;
    name: string;
    series?: string;
  };
  rarity?: string;
  images: {
    small: string;
    large: string;
  };
}
