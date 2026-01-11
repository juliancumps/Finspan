import React, { useState } from 'react';
import { FishCard } from '../types';
import '../styles/Hand.css';

interface HandProps {
  cards: FishCard[];
  isYourTurn: boolean;
  onCardSelect: (card: FishCard) => void;
}

export const Hand: React.FC<HandProps> = ({ cards, isYourTurn, onCardSelect }) => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleCardClick = (card: FishCard) => {
    setSelectedCardId(card.id);
    onCardSelect(card);
  };

  return (
    <div className="hand">
      <h3>Your Hand ({cards.length}/5)</h3>
      <div className="cards-container">
        {cards.length === 0 ? (
          <div className="no-cards">No cards in hand</div>
        ) : (
          cards.map(card => (
            <div
              key={card.id}
              className={`card ${selectedCardId === card.id ? 'selected' : ''} ${
                isYourTurn ? 'clickable' : 'disabled'
              }`}
              onClick={() => isYourTurn && handleCardClick(card)}
            >
              <div className="card-header">
                <div className="card-name">{card.name}</div>
                <div className="card-points">{card.points} pts</div>
              </div>

              <div className="card-cost">
                {card.cost.map((cost, idx) => (
                  <span key={idx} className={`cost-item cost-${cost.type}`}>
                    {cost.amount}
                    {cost.type === 'card' && '🎴'}
                    {cost.type === 'egg' && '🥚'}
                    {cost.type === 'young' && '🐟'}
                    {cost.type === 'consume' && '◀'}
                  </span>
                ))}
              </div>

              <div className="card-zones">
                {card.allowedZones.map(zone => (
                  <span key={zone} className={`zone-badge zone-${zone}`}>
                    {zone.substring(0, 3)}
                  </span>
                ))}
              </div>

              <div className="card-length">Length: {card.length}</div>

              <div className="card-abilities">
                {card.abilities.slice(0, 2).map((ability, idx) => (
                  <div key={idx} className={`ability ability-${ability.type}`}>
                    <strong>{ability.type.replace(/_/g, ' ')}:</strong>
                    <span>{ability.description}</span>
                  </div>
                ))}
              </div>

              <div className="card-tags">
                {card.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};