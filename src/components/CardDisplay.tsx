import React from 'react';
import { Card } from '../types/card';
import { Card as CardComponent } from './Card';
import '../styles/CardDisplay.css';

interface CardDisplayProps {
  cards: Card[];
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ cards }) => {
  // sort cards by value, highest to lowest
  const sortedCards = [...cards].sort((a, b) => {
    const aValue = a.isFoil ? a.foilPrice : a.normalPrice;
    const bValue = b.isFoil ? b.foilPrice : b.normalPrice;
    return bValue - aValue;
  });
  return (
    <div className="cards-container">
      {sortedCards.map((card, index) => (
        <CardComponent key={`${card.id}-${index}`} card={card} index={index} />
      ))}
    </div>
  );
};
