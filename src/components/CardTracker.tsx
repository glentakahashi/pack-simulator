import React from 'react';
import { Card, Rarity } from '../types/card';
import '../styles/CardTracker.css';

interface CardTrackerProps {
  openedCards: Card[];
}

const rarityImages: Record<Rarity, string> = {
  Common: '/images/rarity/common.svg',
  Uncommon: '/images/rarity/uncommon.svg',
  Rare: '/images/rarity/rare.svg',
  'Super Rare': '/images/rarity/super-rare.svg',
  Legendary: '/images/rarity/legendary.svg',
  Enchanted: '/images/rarity/enchanted.png',
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
