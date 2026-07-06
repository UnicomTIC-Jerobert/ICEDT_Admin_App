export interface Level {
  levelId: number;
  levelName: string;
  sequenceOrder: number;
  slug: string;
  coverImageUrl?: string | null;
  barcode: string;
}