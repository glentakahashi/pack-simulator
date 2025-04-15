import { Card, Rarity } from '../types/card';
import cardData from '../cards/data.json';

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
  single: number;
  box: number;
  case: number;
}

export const PACK_COSTS: Record<SetName, SetPrices> = {
  'The First Chapter': {
    single: 14.9,
    box: 424.01,
    case: 1460.08,
  },
  'Rise of the Floodborn': {
    single: 6.33,
    box: 161.71,
    case: 633.81,
  },
  'Into the Inklands': {
    single: 5.57,
    box: 82.16,
    case: 403.4,
  },
  "Ursula's Return": {
    single: 5.01,
    box: 91.87,
    case: 370.75,
  },
  'Shimmering Skies': {
    single: 4.69,
    box: 107.97,
    case: 416.19,
  },
  'Azurite Sea': {
    single: 7.28,
    box: 101.5,
    case: 402.04,
  },
  "Archazia's Island": {
    single: 8.97,
    box: 129.72,
    case: 538.62,
  },
} as const;

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
    })),
  ])
) as Record<SetName, Card[]>;

// Create a pool of cards for each rarity for each set
const RARITY_POOLS = Object.fromEntries(
  Object.entries(ALL_CARDS).map(([set, cards]) => [
    set,
    cards.reduce(
      (acc, card) => {
        acc[card.rarity] = [...(acc[card.rarity] || []), card];
        return acc;
      },
      {} as Record<Rarity, Card[]>
    ),
  ])
) as Record<SetName, Record<Rarity, Card[]>>;

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

export const openPack = (set: SetName): { cards: Card[]; packValue: number } => {
  const pack: Card[] = [];
  const rarityPools = RARITY_POOLS[set];

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
