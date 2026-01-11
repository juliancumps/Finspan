import { FishCard } from './types';

// Sample cards - we'll expand this with all 125+ cards
// You can replace this entire array with card data from the physical game
export const FISH_CARDS: FishCard[] = [
  {
    id: 'clownfish',
    name: 'Clownfish',
    cost: [{ type: 'card', amount: 1 }],
    points: 2,
    length: 10,
    allowedZones: ['sunlight', 'twilight'],
    abilities: [
      {
        type: 'when_played',
        description: 'Gain 1 egg',
        allPlayers: false
      }
    ],
    tags: ['symbiotic', 'reef'],
    imageUrl: '/cards/clownfish.jpg'
  },
  {
    id: 'anglerfish',
    name: 'Anglerfish',
    cost: [
      { type: 'card', amount: 2 },
      { type: 'consume', amount: 1 }
    ],
    points: 4,
    length: 20,
    allowedZones: ['twilight', 'midnight'],
    abilities: [
      {
        type: 'when_played',
        description: 'Consume a shorter fish',
        allPlayers: false
      },
      {
        type: 'if_activated',
        description: 'Gain 2 eggs',
        allPlayers: true
      }
    ],
    tags: ['predator', 'bioluminescent'],
    imageUrl: '/cards/anglerfish.jpg'
  },
  {
    id: 'seahorse',
    name: 'Seahorse',
    cost: [{ type: 'card', amount: 1 }],
    points: 1,
    length: 8,
    allowedZones: ['sunlight'],
    abilities: [
      {
        type: 'if_activated',
        description: 'Play a card from your discard pile',
        allPlayers: false
      }
    ],
    tags: ['pair-bonding', 'reef'],
    imageUrl: '/cards/seahorse.jpg'
  },
  {
    id: 'whale_shark',
    name: 'Whale Shark',
    cost: [
      { type: 'card', amount: 3 },
      { type: 'egg', amount: 1 }
    ],
    points: 5,
    length: 50,
    allowedZones: ['sunlight'],
    allowedDiveSites: ['red', 'blue'], // can only go in specific dive sites
    abilities: [
      {
        type: 'when_played',
        description: 'All players gain 1 egg',
        allPlayers: true
      }
    ],
    tags: ['filter-feeder', 'gentle-giant', 'predator'],
    imageUrl: '/cards/whale-shark.jpg'
  },
  {
    id: 'goblin_shark',
    name: 'Goblin Shark',
    cost: [
      { type: 'card', amount: 2 },
      { type: 'young', amount: 1 }
    ],
    points: 4,
    length: 35,
    allowedZones: ['midnight'],
    abilities: [
      {
        type: 'game_end',
        description: '1 point for each egg on this fish',
        allPlayers: false
      }
    ],
    tags: ['deep-sea', 'predator', 'relict'],
    imageUrl: '/cards/goblin-shark.jpg'
  },
  {
    id: 'pufferfish',
    name: 'Pufferfish',
    cost: [{ type: 'card', amount: 2 }],
    points: 2,
    length: 15,
    allowedZones: ['sunlight', 'twilight'],
    abilities: [
      {
        type: 'if_activated',
        description: 'Discard up to 2 cards and draw 2 cards',
        allPlayers: false
      }
    ],
    tags: ['toxic', 'reef'],
    imageUrl: '/cards/pufferfish.jpg'
  },
  {
    id: 'giant_squid',
    name: 'Giant Squid',
    cost: [
      { type: 'card', amount: 4 },
      { type: 'consume', amount: 2 }
    ],
    points: 6,
    length: 45,
    allowedZones: ['twilight', 'midnight'],
    abilities: [
      {
        type: 'when_played',
        description: 'Consume up to 2 shorter fish',
        allPlayers: false
      }
    ],
    tags: ['predator', 'deep-sea', 'intelligent'],
    imageUrl: '/cards/giant-squid.jpg'
  },
  {
    id: 'coral_polyp',
    name: 'Coral Polyp',
    cost: [{ type: 'card', amount: 1 }],
    points: 3,
    length: 5,
    allowedZones: ['sunlight'],
    allowedDiveSites: ['green'],
    abilities: [
      {
        type: 'if_activated',
        description: 'Gain 1 young for each fish in this dive site',
        allPlayers: false
      }
    ],
    tags: ['sessile', 'reef-builder'],
    imageUrl: '/cards/coral-polyp.jpg'
  },
  {
    id: 'mantis_shrimp',
    name: 'Mantis Shrimp',
    cost: [
      { type: 'card', amount: 2 },
      { type: 'egg', amount: 1 }
    ],
    points: 3,
    length: 18,
    allowedZones: ['sunlight', 'twilight'],
    abilities: [
      {
        type: 'when_played',
        description: 'Play a card from your hand onto your ocean',
        allPlayers: false
      }
    ],
    tags: ['hunter', 'colorful'],
    imageUrl: '/cards/mantis-shrimp.jpg'
  },
  {
    id: 'nautilus',
    name: 'Nautilus',
    cost: [
      { type: 'card', amount: 2 },
      { type: 'young', amount: 1 }
    ],
    points: 4,
    length: 25,
    allowedZones: ['twilight', 'midnight'],
    abilities: [
      {
        type: 'if_activated',
        description: 'Gain 2 eggs and 1 young',
        allPlayers: true
      }
    ],
    tags: ['cephalopod', 'chambered-shell', 'deep-sea'],
    imageUrl: '/cards/nautilus.jpg'
  }
];

export const getCardById = (id: string): FishCard | undefined => {
  return FISH_CARDS.find(card => card.id === id);
};

export const getRandomCards = (count: number): FishCard[] => {
  const shuffled = [...FISH_CARDS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, FISH_CARDS.length));
};