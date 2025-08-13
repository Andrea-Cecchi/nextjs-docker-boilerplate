import { Prisma } from "@prisma/client";

export interface Drug {
  id: string;
  activeSubstance: string;
  brandName: string;
  pack: string;
  holder: string | null;
  atc: string | null;
  note: string | null;
  equivalenceGroupCode: string | null;
  ssnReferencePrice: number; // Decimal type from Prisma
  publicPrice?: number; // Decimal type from Prisma
  priceHistory: {
    date: Date;
    ssnReferencePrice: number; // Decimal type from Prisma
    publicPrice?: number; // Decimal type from Prisma
  }[];
  isFavorited?: boolean; // Added for favorite status
}

export type DrugWithPriceHistoryAndFavorites = Prisma.DrugGetPayload<{
  include: {
    priceHistory: true;
  };
}> & {
  isFavorited: boolean;
};

export interface SearchParams {
  q?: string;
  page?: string;
  activeSubstance?: string;
  atc?: string;
  holder?: string;
  minPrice?: string;
  maxPrice?: string;
  note?: string;
  equivalenceGroup?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
