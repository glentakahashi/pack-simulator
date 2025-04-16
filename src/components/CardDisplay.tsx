import React from 'react';
import { Card } from '../types/card';
import { Card as CardComponent } from './Card';
import '../styles/CardDisplay.css';

interface CardDisplayProps {
  cards: Card[];
  revealImmediately: boolean;
  sortByPrice: boolean;
  useEightyPercent: boolean;
  openNumber: number;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({
  cards,
  revealImmediately,
  sortByPrice,
  useEightyPercent,
  openNumber,
}) => {
  // Only sort if sortByPrice is enabled
  const displayCards = sortByPrice
    ? [...cards].sort((a, b) => {
        const aValue = a.isFoil ? a.foilPrice : a.normalPrice;
        const bValue = b.isFoil ? b.foilPrice : b.normalPrice;
        // if the values are the same, sort by name
        if (aValue === bValue) {
          return a.name.localeCompare(b.name);
        }
        return bValue - aValue;
      })
    : cards;

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
