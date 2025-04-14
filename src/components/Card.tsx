import React, { useState } from 'react';
import { Card as CardType } from '../types/card';
import '../styles/Card.css';

interface CardProps {
  card: CardType;
  index: number;
  hideUntilHover?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, index, hideUntilHover = false }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const price = card.isFoil ? card.foilPrice : card.normalPrice;

  const handleMouseEnter = () => {
    if (hideUntilHover) {
      setIsRevealed(true);
    }
  };

  return (
    <div
      className={`card ${card.rarity.toLowerCase().replace(' ', '-')} ${card.isFoil ? 'foil' : ''} ${hideUntilHover ? 'hide-until-hover' : ''} ${isRevealed ? 'revealed' : ''}`}
      onMouseEnter={handleMouseEnter}
      style={
        {
          animationDelay: `${index * 0.1}s`,
          '--card-rarity': `var(--${card.rarity.toLowerCase().replace(' ', '-')}-color)`,
        } as React.CSSProperties
      }
    >
      <div className="card-inner">
        <div className="card-front">
          <img src={card.imageUrl} alt={card.name} />
          {card.isFoil && <div className="foil-overlay"></div>}
        </div>
        <div className="card-back">
          <div className="card-back-pattern"></div>
        </div>
      </div>
      <div className="card-info">
        <div className="card-name">
          <h3>{card.name}</h3>
        </div>
        <div className="card-details">
          <span className="rarity">{card.rarity}</span>
          <div className="price-container">
            <span className="price">${price.toFixed(2)}</span>
            {card.isFoil && <span className="foil-badge">Foil</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
