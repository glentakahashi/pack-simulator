export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Super Rare' | 'Legendary' | 'Enchanted';
export type Color = 'amber' | 'emerald' | 'amethyst' | 'sapphire' | 'steel' | 'ruby';

export interface Card {
  id: string;
  name: string;
  rarity: Rarity;
  set: string;
  number: string;
  normalPrice: number;
  foilPrice: number;
  isFoil: boolean;
  color: Color;
}
