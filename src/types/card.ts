export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Super Rare' | 'Legendary' | 'Enchanted';

export interface Card {
  id: string;
  name: string;
  imageUrl: string;
  rarity: Rarity;
  set: string;
  number: string;
  normalPrice: number;
  foilPrice: number;
  isFoil: boolean;
}
