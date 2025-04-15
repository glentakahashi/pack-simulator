import React from 'react';
import { Card, Rarity } from '../types/card';
import '../styles/CardTracker.css';

interface CardTrackerProps {
  openedCards: Card[];
}

const rarityImages: Record<Rarity, string> = {
  Common: new URL('../images/rarity/common.svg', import.meta.url).href,
  Uncommon: new URL('../images/rarity/uncommon.svg', import.meta.url).href,
  Rare: new URL('../images/rarity/rare.svg', import.meta.url).href,
  'Super Rare': new URL('../images/rarity/super-rare.svg', import.meta.url).href,
  Legendary: new URL('../images/rarity/legendary.svg', import.meta.url).href,
  Enchanted: new URL('../images/rarity/enchanted.png', import.meta.url).href,
};

export const CardTracker: React.FC<CardTrackerProps> = ({ openedCards }) => {
  // Group cards by name and track normal/foil counts
  const cardCounts = openedCards.reduce(
    (acc, card) => {
      if (!acc[card.id]) {
        acc[card.id] = {
          name: card.name,
          normal: 0,
          foil: 0,
          rarity: card.rarity,
        };
      }
      if (card.isFoil) {
        acc[card.id].foil++;
      } else {
        acc[card.id].normal++;
      }
      return acc;
    },
    {} as Record<string, { normal: number; foil: number; rarity: Rarity; name: string }>
  );

  // Sort cards by rarity and then by name
  const sortedCards = Object.entries(cardCounts).sort((a, b) => {
    const rarityOrder: Record<Rarity, number> = {
      Enchanted: 0,
      Legendary: 1,
      'Super Rare': 2,
      Rare: 3,
      Uncommon: 4,
      Common: 5,
    };

    const rarityCompare = rarityOrder[a[1].rarity] - rarityOrder[b[1].rarity];
    if (rarityCompare !== 0) return rarityCompare;
    return a[0].localeCompare(b[0]);
  });

  return (
    <div className="card-tracker">
      <h2>Opened Cards</h2>
      <div className="card-list">
        {sortedCards.map(([id, info]) => (
          <div key={id} className="tracked-card">
            <div className="card-details">
              <div className="card-info-row">
                <span className="tracker-card-name">{info.name}</span>
                <span className="card-counts">
                  <span className="normal-count">{info.normal}</span>
                  <span className="foil-count">{info.foil}</span>
                  <img
                    src={rarityImages[info.rarity]}
                    alt={info.rarity}
                    className="rarity-icon"
                    title={info.rarity}
                  />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
