import React from 'react';
import { PlayerMat, PlacedFish, Zone, DiveSite } from '../types';
import '../styles/Ocean.css';

interface OceanProps {
  player: PlayerMat;
  isYourTurn: boolean;
  onFishClick?: (fish: PlacedFish) => void;
  onSlotClick?: (zone: Zone, diveSite: DiveSite, rowIndex: number) => void;
}

const DIVE_SITES: DiveSite[] = ['red', 'blue', 'green'];
const TOTAL_ROWS = 6;

// Define which zone each row belongs to
const getZoneForRow = (rowIndex: number): Zone => {
  if (rowIndex <= 2) return 'sunlight';    // Rows 0-2: Sunlight
  if (rowIndex === 3) return 'twilight';   // Row 3: Twilight
  return 'midnight';                       // Rows 4-5: Midnight
};

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

            {/* 6 rows, each row is a depth level */}
            {Array.from({ length: TOTAL_ROWS }).map((_, rowIndex) => {
              const zone = getZoneForRow(rowIndex);
              const fishInZone = getFishInZoneAndSite(zone, diveSite);
              const fishAtRow = fishInZone[rowIndex]; // Get the fish at this specific row
              
              return (
                <div
                  key={`${diveSite}-row-${rowIndex}`}
                  className="zone"
                  style={{ backgroundColor: getZoneColor(zone) }}
                >
                  <div className="zone-label">
                    {zone.toUpperCase()} - Depth {rowIndex}
                  </div>
                  
                  <div className="fish-row">
                    <div
                      className={`fish-slot ${fishAtRow ? 'occupied' : 'empty'} ${
                        isYourTurn ? 'clickable' : ''
                      }`}
                      onClick={() => {
                        if (fishAtRow && onFishClick) {
                          onFishClick(fishAtRow);
                        } else if (!fishAtRow && onSlotClick) {
                          onSlotClick(zone, diveSite, rowIndex);
                        }
                      }}
                    >
                      {fishAtRow ? (
                        <div className="fish-card">
                          <div className="fish-name">{fishAtRow.card.name}</div>
                          <div className="fish-points">{fishAtRow.card.points} pts</div>
                          <div className="fish-tokens">
                            {fishAtRow.eggs > 0 && (
                              <span className="egg-token">{fishAtRow.eggs}🥚</span>
                            )}
                            {fishAtRow.young > 0 && (
                              <span className="young-token">{fishAtRow.young}🐟</span>
                            )}
                            {fishAtRow.hasSchool && <span className="school-token">🐠</span>}
                          </div>
                        </div>
                      ) : (
                        <div className="empty-slot">+</div>
                      )}
                    </div>
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