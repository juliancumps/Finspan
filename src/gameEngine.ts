import {
  GameState,
  PlayerMat,
  FishCard,
  PlacedFish,
  Zone,
  DiveSite,
  Diver,
  Cost
} from './types';
import { FISH_CARDS, getRandomCards } from './cards';

export class FinspanEngine {
  private gameState: GameState;

  constructor(playerNames: string[]) {
    this.gameState = this.initializeGame(playerNames);
  }

  private initializeGame(playerNames: string[]): GameState {
    const deck = [...FISH_CARDS].sort(() => 0.5 - Math.random());
    
    const players: PlayerMat[] = playerNames.map((name, index) => ({
      playerId: `player_${index}`,
      playerName: name,
      hand: [],
      ocean: [],
      discard: [],
      divers: this.createDivers(),
      eggs: 2,
      young: 1,
      schools: 0
    }));

    // Deal initial cards and add starter fish to hands
    players.forEach(player => {
      player.hand = deck.splice(0, 5);
    });

    return {
      gameId: Math.random().toString(36).substring(7),
      players,
      currentPlayerIndex: 0,
      currentRound: 1,
      turn: 0,
      deck,
      gamePhase: 'setup',
      achievements: []
    };
  }

  private createDivers(): Diver[] {
    return [
      { id: 'diver_0', diveSite: 'red', currentDepth: 0, hasDived: false },
      { id: 'diver_1', diveSite: 'blue', currentDepth: 0, hasDived: false },
      { id: 'diver_2', diveSite: 'green', currentDepth: 0, hasDived: false }
    ];
  }

  getGameState(): GameState {
    return this.gameState;
  }

  getCurrentPlayer(): PlayerMat {
    return this.gameState.players[this.gameState.currentPlayerIndex];
  }

  playFish(playerId: string, cardId: string, zone: Zone, diveSite: DiveSite): boolean {
    const player = this.gameState.players.find(p => p.playerId === playerId);
    if (!player) return false;

    const cardIndex = player.hand.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return false;

    const card = player.hand[cardIndex];

    // Check if fish can be placed in the chosen zone
    if (!card.allowedZones.includes(zone)) return false;

    // Check if fish can be placed in the chosen dive site
    if (card.allowedDiveSites && !card.allowedDiveSites.includes(diveSite)) {
      return false;
    }

    // Check if player can afford the cost
    if (!this.canAffordCost(player, card.cost)) return false;

    // Pay the cost
    this.payCost(player, card.cost);

    // Place the fish
    const placedFish: PlacedFish = {
      card,
      zone,
      diveSite,
      rowIndex: this.getNextRowIndex(player, zone, diveSite),
      eggs: 0,
      young: 0,
      hasSchool: false,
      consumedFish: []
    };

    player.ocean.push(placedFish);

    // Remove card from hand and move to discard (if it wasn't consumed)
    player.hand.splice(cardIndex, 1);

    // Trigger "when played" abilities
    this.resolveWhenPlayedAbilities(player, card);

    // Move to next turn
    this.nextTurn();

    return true;
  }

  dive(playerId: string, diveSite: DiveSite): boolean {
    const player = this.gameState.players.find(p => p.playerId === playerId);
    if (!player) return false;

    const diver = player.divers.find(d => d.diveSite === diveSite);
    if (!diver || diver.hasDived) return false;

    // Move diver down and collect benefits from each zone
    diver.hasDived = true;

    // For now, just mark as complete. In a full implementation,
    // we'd resolve all the zone benefits
    this.collectDiveRewards(player, diveSite);

    this.nextTurn();
    return true;
  }

  private canAffordCost(player: PlayerMat, costs: Cost[]): boolean {
    for (const cost of costs) {
      switch (cost.type) {
        case 'card':
          if (player.hand.length < cost.amount) return false;
          break;
        case 'egg':
          if (player.eggs < cost.amount) return false;
          break;
        case 'young':
          if (player.young < cost.amount) return false;
          break;
        case 'consume':
          // Check if player has fish to consume
          const consumableFish = player.ocean.filter(f => f.card.length < 30); // arbitrary threshold
          if (consumableFish.length < cost.amount) return false;
          break;
      }
    }
    return true;
  }

  private payCost(player: PlayerMat, costs: Cost[]): void {
    for (const cost of costs) {
      switch (cost.type) {
        case 'card':
          // Remove cards from hand (in real game, player chooses which cards)
          player.hand.splice(0, cost.amount);
          break;
        case 'egg':
          player.eggs = Math.max(0, player.eggs - cost.amount);
          break;
        case 'young':
          player.young = Math.max(0, player.young - cost.amount);
          break;
        case 'consume':
          // Consume fish (in real game, player chooses which fish)
          const consumableIndex = player.ocean.findIndex(f => !f.consumedFish.length);
          if (consumableIndex !== -1) {
            // Mark as consumed (but don't remove from ocean)
            player.ocean[consumableIndex].consumedFish.push(player.ocean[consumableIndex]);
          }
          break;
      }
    }
  }

  private getNextRowIndex(player: PlayerMat, zone: Zone, diveSite: DiveSite): number {
    const fishInZoneAndSite = player.ocean.filter(
      f => f.zone === zone && f.diveSite === diveSite
    );
    return fishInZoneAndSite.length;
  }

  private resolveWhenPlayedAbilities(player: PlayerMat, card: FishCard): void {
    const abilities = card.abilities.filter(a => a.type === 'when_played');
    for (const ability of abilities) {
      // Parse and execute ability
      if (ability.description.includes('egg')) {
        const match = ability.description.match(/(\d+)\s+egg/);
        if (match) {
          player.eggs += parseInt(match[1], 10);
        }
      }
      // Add more ability parsing as needed
    }
  }

  private collectDiveRewards(player: PlayerMat, diveSite: DiveSite): void {
    // Collect rewards from diving in this dive site
    // This is where we resolve dive site benefits based on fish placement
    // For now, this is a placeholder
  }

  private nextTurn(): void {
    this.gameState.turn += 1;

    // Each player gets 6 turns per round
    const turnsPerRound = 6;
    const playerCount = this.gameState.players.length;
    const totalTurnsPerRound = turnsPerRound * playerCount;

    if (this.gameState.turn >= totalTurnsPerRound) {
      this.resolveEndOfWeek();
      this.gameState.turn = 0;
      this.gameState.currentRound += 1;

      if (this.gameState.currentRound > 4) {
        this.resolveEndOfGame();
      } else {
        this.resetDivers();
      }
    } else {
      this.gameState.currentPlayerIndex =
        (this.gameState.currentPlayerIndex + 1) % playerCount;
    }
  }

  private resolveEndOfWeek(): void {
    // Score end of week achievements, add new cards to hand, etc.
    // Add cards back to hands from deck
    this.gameState.players.forEach(player => {
      const cardsNeeded = 5 - player.hand.length;
      if (cardsNeeded > 0) {
        const newCards = this.gameState.deck.splice(0, cardsNeeded);
        player.hand.push(...newCards);
      }
    });
  }

  private resetDivers(): void {
    this.gameState.players.forEach(player => {
      player.divers.forEach(diver => {
        diver.currentDepth = 0;
        diver.hasDived = false;
      });
    });
  }

  private resolveEndOfGame(): void {
    this.gameState.gamePhase = 'end_game';
    // Calculate final scores
  }

  calculateScore(playerId: string): number {
    const player = this.gameState.players.find(p => p.playerId === playerId);
    if (!player) return 0;

    let score = 0;

    // Points from fish
    player.ocean.forEach(fish => {
      score += fish.card.points;
    });

    // Points from consumed fish (1 point each)
    player.ocean.forEach(fish => {
      score += fish.consumedFish.length;
    });

    // Points from eggs, young, and schools
    // (These would have game-end abilities)

    return score;
  }
}