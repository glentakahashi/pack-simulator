import { Card, Rarity, Color } from '../types/card';
import cardData from '../data/cards.json';
import pricesData from '../data/prices.json';
const colors: Color[] = ['amber', 'emerald', 'amethyst', 'sapphire', 'steel', 'ruby'];

export type SetName =
  | 'The First Chapter'
  | 'Rise of the Floodborn'
  | 'Into the Inklands'
  | "Ursula's Return"
  | 'Shimmering Skies'
  | 'Azurite Sea'
  | "Archazia's Island";

const SetIdToSetName: Record<string, SetName> = {
  '001': 'The First Chapter',
  '002': 'Rise of the Floodborn',
  '003': 'Into the Inklands',
  '004': "Ursula's Return",
  '005': 'Shimmering Skies',
  '006': 'Azurite Sea',
  '007': "Archazia's Island",
};

interface SetPrices {
  sealed_booster: number;
  box: number;
  case: number;
}

export const PACK_COSTS: Record<SetName, SetPrices> = pricesData;

// Convert the JSON data to our Card type
const ALL_CARDS = Object.fromEntries(
  Object.entries(cardData).map(([setId, cards]) => [
    SetIdToSetName[setId],
    cards.map(card => ({
      id: card.id,
      name: card.title ? `${card.name} - ${card.title}` : card.name,
      // title case the rarity of every word before casting
      rarity: card.rarity
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') as Rarity,
      set: SetIdToSetName[setId],
      number: card.number,
      normalPrice: card.normalPrice,
      foilPrice: card.foilPrice,
      isFoil: false,
      color: card.colors[0] as Color,
    })),
  ])
) as Record<SetName, Card[]>;

// Create a pool of cards for each rarity for each set
const RARITY_POOLS = Object.fromEntries(
  Object.entries(ALL_CARDS).map(([set, cards]) => [
    set,
    cards.reduce(
      (acc, card) => {
        if (!acc[card.rarity]) {
          acc[card.rarity] = {
            amber: [],
            emerald: [],
            amethyst: [],
            sapphire: [],
            steel: [],
            ruby: [],
          };
        }
        acc[card.rarity][card.color].push(card);
        return acc;
      },
      {} as Record<Rarity, Record<Color, Card[]>>
    ),
  ])
) as Record<SetName, Record<Rarity, Record<Color, Card[]>>>;

// Number per pack
const RARE_RARITY_DISTRIBUTION: Record<'Super Rare' | 'Legendary', number> = {
  'Super Rare': 1 / 2,
  Legendary: 1 / 6,
};

// Number per pack
const FOIL_RARITY_DISTRIBUTION: Record<Rarity, number> = {
  Common: 1 / 2,
  Uncommon: 1 / 4,
  Rare: 1 / 8,
  'Super Rare': 1 / 16,
  Legendary: 1 / 48,
  Enchanted: 1 / 96,
};

export const openPack = (set: SetName): { cards: Card[]; packValue: number } => {
  const pack: Card[] = [];
  const rarityPools = RARITY_POOLS[set];

  const commons: Card[] = [];

  // Create 6 Common cards (1 of each color)
  for (const color of colors) {
    const randomIndex = Math.floor(Math.random() * rarityPools.Common[color].length);
    commons.push(rarityPools.Common[color][randomIndex]);
  }
  // Randomize the order of the cards
  commons.sort(() => Math.random() - 0.5);
  // Add the commons to the pack
  pack.push(...commons);

  const uncommons: Card[] = [];
  const uncommonColors = colors.sort(() => Math.random() - 0.5).slice(0, 3);
  // Create 3 Uncommon cards (of different colors)
  for (const color of uncommonColors) {
    const randomIndex = Math.floor(Math.random() * rarityPools.Uncommon[color].length);
    uncommons.push(rarityPools.Uncommon[color][randomIndex]);
  }
  // Add the uncommons to the pack
  pack.push(...uncommons);

  // Add 2 Rare or higher cards
  const tiers = [0, 0];
  for (let i = 0; i < 2; i++) {
    const rarityRoll = Math.random();
    let selectedPool;

    if (rarityRoll < RARE_RARITY_DISTRIBUTION.Legendary / 2) {
      selectedPool = rarityPools.Legendary;
      tiers[i] = 2;
    } else if (rarityRoll < RARE_RARITY_DISTRIBUTION['Super Rare'] / 2) {
      selectedPool = rarityPools['Super Rare'];
      tiers[i] = 1;
    } else {
      selectedPool = rarityPools.Rare;
    }

    // choose a random color from the selected pool
    const color = colors[Math.floor(Math.random() * colors.length)];

    if (selectedPool[color].length > 0) {
      const randomIndex = Math.floor(Math.random() * selectedPool[color].length);
      pack.push(selectedPool[color][randomIndex]);
    } else {
      // Fallback to Rare if the selected pool is empty
      const randomIndex = Math.floor(Math.random() * rarityPools.Rare[color].length);
      pack.push(rarityPools.Rare[color][randomIndex]);
    }
  }
  if (tiers[0] > tiers[1]) {
    // swap the two rare or higher cards
    const temp = pack[pack.length - 1];
    pack[pack.length - 1] = pack[pack.length - 2];
    pack[pack.length - 2] = temp;
  }

  // Add 1 foil card with correct distribution
  const foilRoll = Math.random();
  let foilPool;

  if (foilRoll < FOIL_RARITY_DISTRIBUTION.Enchanted) {
    foilPool = rarityPools.Enchanted;
  } else if (foilRoll < FOIL_RARITY_DISTRIBUTION.Legendary) {
    foilPool = rarityPools.Legendary;
  } else if (foilRoll < FOIL_RARITY_DISTRIBUTION['Super Rare']) {
    foilPool = rarityPools['Super Rare'];
  } else if (foilRoll < FOIL_RARITY_DISTRIBUTION.Rare) {
    foilPool = rarityPools.Rare;
  } else if (foilRoll < FOIL_RARITY_DISTRIBUTION.Uncommon) {
    foilPool = rarityPools.Uncommon;
  } else {
    foilPool = rarityPools.Common;
  }

  // choose a random color from the selected pool
  const foilColor = colors[Math.floor(Math.random() * colors.length)];

  if (foilPool[foilColor].length > 0) {
    const randomIndex = Math.floor(Math.random() * foilPool[foilColor].length);
    const foilCard = { ...foilPool[foilColor][randomIndex], isFoil: true };
    pack.push(foilCard);
  } else {
    // Fallback to Common if the selected pool is empty
    const randomIndex = Math.floor(Math.random() * rarityPools.Common[foilColor].length);
    const foilCard = { ...rarityPools.Common[foilColor][randomIndex], isFoil: true };
    pack.push(foilCard);
  }

  const packValue = pack.reduce(
    (sum, card) => sum + (card.isFoil ? card.foilPrice : card.normalPrice),
    0
  );
  return { cards: pack, packValue };
};

export const getPackCost = (
  set: SetName = 'The First Chapter',
  quantity: 'sealed_booster' | 'box' | 'case' = 'sealed_booster'
): number => {
  return PACK_COSTS[set][quantity];
};
