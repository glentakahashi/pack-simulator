import React, { useState, useRef } from 'react';
import { Card } from '../types/card';
import { Card as CardComponent } from './Card';
import '../styles/CardDisplay.css';

interface CardDisplayProps {
  cards: Card[];
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ cards }) => {
  const [revealImmediately, setRevealImmediately] = useState(false);
  const [sortByPrice, setSortByPrice] = useState(false);
  const renderCount = useRef(0);

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

  // Increment render count when cards change
  React.useEffect(() => {
    renderCount.current += 1;
  }, [cards]);

  return (
    <div className="cards-container">
      <div className="display-options">
        <label>
          <input
            type="checkbox"
            checked={revealImmediately}
            onChange={e => setRevealImmediately(e.target.checked)}
          />
          Reveal cards immediately
        </label>
        <label>
          <input
            type="checkbox"
            checked={sortByPrice}
            onChange={e => setSortByPrice(e.target.checked)}
          />
          Sort by price (high to low)
        </label>
      </div>
      {displayCards.map((card, index) => (
        <CardComponent
          key={`${card.id}-${index}-${renderCount.current}`}
          card={card}
          index={index}
          hideUntilHover={!revealImmediately}
        />
      ))}
    </div>
  );
};
