import { create } from 'zustand';
import { GameState } from './types';
import { FinspanEngine } from './gameEngine';

interface GameStore {
  gameEngine: FinspanEngine | null;
  gameState: GameState | null;
  playerId: string | null;
  isHost: boolean;
  
  // Actions
  initializeGame: (playerNames: string[], yourId: string) => void;
  playFish: (cardId: string, zone: any, diveSite: any) => void;
  dive: (diveSite: any) => void;
  skipTurn: () => void;
  updateGameState: (newState: GameState) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameEngine: null,
  gameState: null,
  playerId: null,
  isHost: false,

  initializeGame: (playerNames: string[], yourId: string) => {
    const engine = new FinspanEngine(playerNames);
    set({
      gameEngine: engine,
      gameState: engine.getGameState(),
      playerId: yourId,
      isHost: true
    });
  },

  playFish: (cardId: string, zone: any, diveSite: any) => {
    const { gameEngine, playerId } = get();
    if (!gameEngine || !playerId) return;

    const success = gameEngine.playFish(playerId, cardId, zone, diveSite);
    if (success) {
      set({ gameState: gameEngine.getGameState() });
    }
  },

  dive: (diveSite: any) => {
    const { gameEngine, playerId } = get();
    if (!gameEngine || !playerId) return;

    const success = gameEngine.dive(playerId, diveSite);
    if (success) {
      set({ gameState: gameEngine.getGameState() });
    }
  },

  skipTurn: () => {
    const { gameEngine } = get();
    if (!gameEngine) return;
    // For now, diving is a valid action. Skipping would be implemented separately
  },

  updateGameState: (newState: GameState) => {
    set({ gameState: newState });
  }
}));