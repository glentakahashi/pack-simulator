import { Card, Rarity } from '../types/card';
import firstChapterCards from '../cards/firstchapter.json';

export type SetName =
  | 'The First Chapter'
  | 'Rise of the Floodborn'
  | 'Into the Inklands'
  | 'Disney100';

interface SetPrices {
  single: number;
  box: number;
  case: number;
}

export const PACK_COSTS: Record<SetName, SetPrices> = {
  'The First Chapter': {
    single: 13.92,
    box: 424.01, // 24 packs
    case: 1460.08, // 96 packs
  },
  'Rise of the Floodborn': {
    single: 5.99,
    box: 119.99,
    case: 479.99,
  },
  'Into the Inklands': {
    single: 5.99,
    box: 119.99,
    case: 479.99,
  },
  Disney100: {
    single: 6.99,
    box: 139.99,
    case: 559.99,
  },
} as const;

// Convert the JSON data to our Card type
const ALL_CARDS: Card[] = firstChapterCards.map((card, index) => ({
  id: `${card.name}-${index}`,
  name: card.name,
  imageUrl: card.src,
  rarity: card.rarity as Rarity,
  set: 'The First Chapter',
  number: card.src.split('/').pop() || '',
  normalPrice: parseFloat(card.normalPrice),
  foilPrice: parseFloat(card.foilPrice),
  isFoil: false,
}));

// Number per pack
const RAW_RARE_RARITY_DISTRIBUTION: Record<'Rare' | 'Super Rare' | 'Legendary', number> = {
  Rare: 1.5,
  'Super Rare': 1 / 2,
  Legendary: 1 / 6,
};
const RARE_RARITY_SUM = Object.values(RAW_RARE_RARITY_DISTRIBUTION).reduce(
  (sum, value) => sum + value,
  0
);
// Sum up the totals
const RARE_RARITY_DISTRIBUTION = Object.fromEntries(
  Object.entries(RAW_RARE_RARITY_DISTRIBUTION).map(([rarity, value]) => [
    rarity,
    value / RARE_RARITY_SUM,
  ])
);

// Number per pack
const RAW_FOIL_RARITY_DISTRIBUTION: Record<Rarity, number> = {
  Common: 1 / 2,
  Uncommon: 1 / 4,
  Rare: 1 / 8,
  'Super Rare': 1 / 16,
  Legendary: 1 / 48,
  Enchanted: 1 / 96,
};
const FOIL_RARITY_SUM = Object.values(RAW_FOIL_RARITY_DISTRIBUTION).reduce(
  (sum, value) => sum + value,
  0
);
const FOIL_RARITY_DISTRIBUTION = Object.fromEntries(
  Object.entries(RAW_FOIL_RARITY_DISTRIBUTION).map(([rarity, value]) => [
    rarity,
    value / FOIL_RARITY_SUM,
  ])
);

export const openPack = (): { cards: Card[]; packValue: number } => {
  const pack: Card[] = [];

  // Create a pool of cards for each rarity
  const rarityPools = {
    Common: ALL_CARDS.filter(card => card.rarity === 'Common'),
    Uncommon: ALL_CARDS.filter(card => card.rarity === 'Uncommon'),
    Rare: ALL_CARDS.filter(card => card.rarity === 'Rare'),
    'Super Rare': ALL_CARDS.filter(card => card.rarity === 'Super Rare'),
    Legendary: ALL_CARDS.filter(card => card.rarity === 'Legendary'),
    Enchanted: ALL_CARDS.filter(card => card.rarity === 'Enchanted'),
  };

  // Add 6 Common cards
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * rarityPools.Common.length);
    pack.push(rarityPools.Common[randomIndex]);
  }

  // Add 3 Uncommon cards
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * rarityPools.Uncommon.length);
    pack.push(rarityPools.Uncommon[randomIndex]);
  }

  // Add 2 Rare or higher cards
  for (let i = 0; i < 2; i++) {
    const rarityRoll = Math.random();
    let selectedPool;

    if (rarityRoll < RARE_RARITY_DISTRIBUTION.Legendary) {
      // one per 6 packs on average
      selectedPool = rarityPools.Legendary;
    } else if (rarityRoll < RARE_RARITY_DISTRIBUTION.SuperRare) {
      // one per 2 packs on average
      selectedPool = rarityPools['Super Rare'];
    } else {
      // 1.5 per pack on average
      selectedPool = rarityPools.Rare;
    }

    if (selectedPool.length > 0) {
      const randomIndex = Math.floor(Math.random() * selectedPool.length);
      pack.push(selectedPool[randomIndex]);
    } else {
      // Fallback to Rare if the selected pool is empty
      const randomIndex = Math.floor(Math.random() * rarityPools.Rare.length);
      pack.push(rarityPools.Rare[randomIndex]);
    }
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

  if (foilPool.length > 0) {
    const randomIndex = Math.floor(Math.random() * foilPool.length);
    const foilCard = { ...foilPool[randomIndex], isFoil: true };
    pack.push(foilCard);
  } else {
    // Fallback to Common if the selected pool is empty
    const randomIndex = Math.floor(Math.random() * rarityPools.Common.length);
    const foilCard = { ...rarityPools.Common[randomIndex], isFoil: true };
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
  quantity: 'single' | 'box' | 'case' = 'single'
): number => {
  return PACK_COSTS[set][quantity];
};
