// Game Constants and Types

export type Zone = 'sunlight' | 'twilight' | 'midnight';
export type DiveSite = 'red' | 'blue' | 'green';
export type CostType = 'card' | 'egg' | 'young' | 'consume';

export interface Cost {
  type: CostType;
  amount: number;
}

export interface FishAbility {
  type: 'when_played' | 'if_activated' | 'game_end';
  description: string;
  allPlayers?: boolean;
}

export interface FishCard {
  id: string;
  name: string;
  cost: Cost[];
  points: number;
  length: number; // for determining which fish can consume which
  allowedZones: Zone[];
  allowedDiveSites?: DiveSite[]; // if undefined, can go in any dive site
  abilities: FishAbility[];
  tags: string[]; // e.g., 'predator', 'bioluminescent', etc.
  imageUrl?: string;
}

export interface PlacedFish {
  card: FishCard;
  zone: Zone;
  diveSite: DiveSite;
  rowIndex: number; // depth within the zone/diveSite
  eggs: number;
  young: number;
  hasSchool: boolean;
  consumedFish: PlacedFish[]; // fish this one consumes
}

export interface PlayerMat {
  playerId: string;
  playerName: string;
  hand: FishCard[];
  ocean: PlacedFish[]; // all placed fish across all zones/divesites
  discard: FishCard[];
  divers: Diver[];
  eggs: number;
  young: number;
  schools: number;
}

export interface Diver {
  id: string;
  diveSite: DiveSite;
  currentDepth: number; // 0 = top (sunlight), increases downward
  hasDived: boolean; // has dived this round
}

export interface GameState {
  gameId: string;
  players: PlayerMat[];
  currentPlayerIndex: number;
  currentRound: number; // 1-4
  turn: number; // turn within the round (each player gets 6 turns per round)
  deck: FishCard[];
  gamePhase: 'setup' | 'playing' | 'end_week' | 'end_game';
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  scoringType: 'points_per_tag' | 'bonus_condition' | 'comparison';
  points: number;
  condition?: string;
}

export interface GameAction {
  type: 'play_fish' | 'dive' | 'skip';
  playerId: string;
  data?: any;
}