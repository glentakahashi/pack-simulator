import React from 'react';
import { Card } from '../types/card';
import { Card as CardComponent } from './Card';
import '../styles/CardDisplay.css';

interface CardDisplayProps {
  cards: Card[];
  revealImmediately: boolean;
  sortMode: 'open' | 'price' | 'rarity';
  useEightyPercent: boolean;
  openNumber: number;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({
  cards,
  revealImmediately,
  sortMode,
  useEightyPercent,
  openNumber,
}) => {
  const displayCards = React.useMemo(() => {
    switch (sortMode) {
      case 'price':
        return [...cards].sort((a, b) => {
          const aValue = a.isFoil ? a.foilPrice : a.normalPrice;
          const bValue = b.isFoil ? b.foilPrice : b.normalPrice;
          if (aValue === bValue) {
            return a.name.localeCompare(b.name);
          }
          return bValue - aValue;
        });
      case 'rarity':
        return [...cards].sort((a, b) => {
          const rarityOrder: Record<string, number> = {
            Enchanted: 0,
            Legendary: 1,
            'Super Rare': 2,
            Rare: 3,
            Uncommon: 4,
            Common: 5,
          };
          const rarityCompare = rarityOrder[a.rarity] - rarityOrder[b.rarity];
          if (rarityCompare !== 0) return rarityCompare;
          return a.name.localeCompare(b.name);
        });
      case 'open':
      default:
        return cards;
    }
  }, [cards, sortMode]);

  return (
    <div className="cards-container">
      {displayCards.map((card, index) => (
        <CardComponent
          key={`${card.id}-${index}-${openNumber}`}
          card={card}
          index={index}
          hideUntilHover={!revealImmediately}
          useEightyPercent={useEightyPercent}
        />
      ))}
    </div>
  );
};
