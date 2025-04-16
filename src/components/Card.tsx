import React, { useState } from 'react';
import { Card as CardType } from '../types/card';
import '../styles/Card.css';

interface CardProps {
  card: CardType;
  index: number;
  hideUntilHover?: boolean;
  useEightyPercent: boolean;
}

export const Card: React.FC<CardProps> = ({ card, hideUntilHover = false, useEightyPercent }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const price = card.isFoil ? card.foilPrice : card.normalPrice;
  const adjustedPrice = useEightyPercent ? price * 0.8 : price;

  const handleReveal = () => {
    if (hideUntilHover) {
      setIsRevealed(true);
    }
  };

  const imageUrl = new URL(`../images/cards/${card.id}.jpg`, import.meta.url).href;

  return (
    <div
      className={`card ${card.rarity.toLowerCase().replace(' ', '-')} ${card.isFoil ? 'foil' : ''} ${hideUntilHover ? 'hide-until-hover' : ''} ${isRevealed ? 'revealed' : ''}`}
      onMouseEnter={handleReveal}
      onTouchStart={handleReveal}
      style={
        {
          '--card-rarity': `var(--${card.rarity.toLowerCase().replace(' ', '-')}-color)`,
        } as React.CSSProperties
      }
    >
      <div className="card-inner">
        <div className="card-front">
          <img src={imageUrl} alt={card.name} />
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
          <div className="price-container">
            <span
              className={`price ${adjustedPrice > 5 ? 'medium-value' : ''} ${adjustedPrice > 10 ? 'high-value' : ''} ${adjustedPrice > 100 ? 'premium-value' : ''}`}
            >
              ${adjustedPrice.toFixed(2)}
            </span>
            {card.isFoil && <span className="foil-badge">Foil</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
