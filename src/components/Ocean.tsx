import React from 'react';
import { PlayerMat, PlacedFish, Zone, DiveSite } from '../types';
import '../styles/Ocean.css';

interface OceanProps {
  player: PlayerMat;
  isYourTurn: boolean;
  onFishClick?: (fish: PlacedFish) => void;
  onSlotClick?: (zone: Zone, diveSite: DiveSite, rowIndex: number) => void;
}

const ZONES: Zone[] = ['sunlight', 'twilight', 'midnight'];
const DIVE_SITES: DiveSite[] = ['red', 'blue', 'green'];

export const Ocean: React.FC<OceanProps> = ({
  player,
  isYourTurn,
  onFishClick,
  onSlotClick
}) => {
  const getZoneColor = (zone: Zone): string => {
    switch (zone) {
      case 'sunlight':
        return '#FFD700';
      case 'twilight':
        return '#4B0082';
      case 'midnight':
        return '#000033';
      default:
        return '#CCCCCC';
    }
  };

  const getFishInZoneAndSite = (zone: Zone, diveSite: DiveSite): PlacedFish[] => {
    return player.ocean.filter(f => f.zone === zone && f.diveSite === diveSite);
  };

  const getDiveSiteColor = (diveSite: DiveSite): string => {
    switch (diveSite) {
      case 'red':
        return '#FF6B6B';
      case 'blue':
        return '#4ECDC4';
      case 'green':
        return '#95E1D3';
      default:
        return '#CCCCCC';
    }
  };

  return (
    <div className="ocean">
      <h2>{player.playerName}'s Ocean</h2>
      
      <div className="tokens-display">
        <div className="token-group">
          <span className="token-label">Eggs:</span>
          <span className="token-count">{player.eggs}</span>
        </div>
        <div className="token-group">
          <span className="token-label">Young:</span>
          <span className="token-count">{player.young}</span>
        </div>
        <div className="token-group">
          <span className="token-label">Schools:</span>
          <span className="token-count">{player.schools}</span>
        </div>
      </div>

      <div className="dive-sites-container">
        {DIVE_SITES.map(diveSite => (
          <div
            key={diveSite}
            className="dive-site"
            style={{ borderColor: getDiveSiteColor(diveSite) }}
          >
            <div className="dive-site-title" style={{ backgroundColor: getDiveSiteColor(diveSite) }}>
              {diveSite.toUpperCase()} Dive Site
            </div>

            {ZONES.map(zone => {
              const fish = getFishInZoneAndSite(zone, diveSite);
              const maxSlots = 5; // Cards per zone

              return (
                <div
                  key={`${diveSite}-${zone}`}
                  className="zone"
                  style={{ backgroundColor: getZoneColor(zone) }}
                >
                  <div className="zone-label">{zone.toUpperCase()}</div>
                  
                  <div className="fish-row">
                    {Array.from({ length: maxSlots }).map((_, rowIndex) => {
                      const fish = fish[rowIndex];
                      return (
                        <div
                          key={`slot-${rowIndex}`}
                          className={`fish-slot ${fish ? 'occupied' : 'empty'} ${
                            isYourTurn ? 'clickable' : ''
                          }`}
                          onClick={() => {
                            if (fish && onFishClick) {
                              onFishClick(fish);
                            } else if (!fish && onSlotClick) {
                              onSlotClick(zone, diveSite, rowIndex);
                            }
                          }}
                        >
                          {fish ? (
                            <div className="fish-card">
                              <div className="fish-name">{fish.card.name}</div>
                              <div className="fish-points">{fish.card.points} pts</div>
                              <div className="fish-tokens">
                                {fish.eggs > 0 && (
                                  <span className="egg-token">{fish.eggs}🥚</span>
                                )}
                                {fish.young > 0 && (
                                  <span className="young-token">{fish.young}🐟</span>
                                )}
                                {fish.hasSchool && <span className="school-token">🐠</span>}
                              </div>
                            </div>
                          ) : (
                            <div className="empty-slot">+</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};