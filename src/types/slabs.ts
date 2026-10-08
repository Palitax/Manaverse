export type GradingCompany = "PSA" | "BGS_BLACK" | "BGS_GOLD" | "CGC" | "RAW_MAGNETIC";
export type Franchise = "pokemon" | "one_piece" | "riftbound";

export interface BackgroundSlab {
  id: string;
  franchise: Franchise;
  gradingCompany?: GradingCompany;
  cardName: string;
  setName: string;
  year: string;
  cardNumber: string;
  certNumber?: string;
  grade?: string;
  gradeLabel?: string;
  subgrades?: {
    centering: string;
    corners: string;
    edges: string;
    surface: string;
  };
  image: string;
  priceEst: string;
  rarity?: string;
}
