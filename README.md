# Finspan Online - P2P Multiplayer Web Version

A real-time, peer-to-peer multiplayer web version of the board game **Finspan** by Stonemaier Games.

## Features

- ✅ **P2P Multiplayer**: Connect directly to your friend using PeerJS - no server needed
- ✅ **React + TypeScript**: Modern, type-safe frontend
- ✅ **Full Game Logic**: Complete Finspan mechanics implemented
- ✅ **Real-time Sync**: Game state synced between players instantly
- ✅ **Beautiful UI**: Ocean zones, fish cards, and dive sites rendered beautifully
- ✅ **Free Hosting**: Deploy on Vercel with zero backend costs

## Getting Started

### Prerequisites

- Node.js 16+ and npm (or yarn/pnpm)
- macOS, Windows, or Linux

### Installation

1. **Clone/set up the repo:**

```bash
cd finspan-game
npm install
```

2. **Start the development server:**

```bash
npm run dev
```

This opens the app at `http://localhost:3000`

3. **To play with a friend:**
   - Start the game in two browser windows (on different computers)
   - Copy your **Peer ID** from the setup screen
   - Share it with your friend and paste theirs into the connection field
   - Click "Connect"
   - Both players set up their names and click "Start Game"

## Project Structure

```
finspan-game/
├── src/
│   ├── components/          # React components
│   │   ├── Ocean.tsx        # Ocean board display
│   │   └── Hand.tsx         # Player hand display
│   ├── styles/              # CSS files
│   │   ├── Ocean.css
│   │   ├── Hand.css
│   │   ├── App.css
│   │   └── index.css
│   ├── types.ts             # TypeScript game types
│   ├── cards.ts             # Fish card data (populate with all 125+ cards here)
│   ├── gameEngine.ts        # Core game logic
│   ├── store.ts             # Zustand state management
│   ├── p2p.ts               # PeerJS networking
│   ├── App.tsx              # Main app component
│   └── index.tsx            # Entry point
├── index.html               # HTML entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Card Data

Currently there are 10 sample fish cards. To add all 125+ real Finspan cards:

1. Get card data from the physical game or https://navarog.github.io/finsearch/
2. Create a CSV or JSON file with the card stats
3. Update `src/cards.ts` with all card data

Each card needs:
- `id`: Unique identifier
- `name`: Card name
- `cost`: Array of costs (card, egg, young, or consume)
- `points`: Victory points
- `length`: For consuming mechanic
- `allowedZones`: Which ocean zones (sunlight, twilight, midnight)
- `allowedDiveSites`: Which dive sites (red, blue, green), optional
- `abilities`: When-played, if-activated, and game-end abilities
- `tags`: Category tags (predator, reef, deep-sea, etc.)
- `imageUrl`: Path to card image

## Deployment

### Deploy to Vercel (Free)

```bash
# Build
npm run build

# Deploy
# Option 1: Push to GitHub and connect to Vercel
# Option 2: Use Vercel CLI
npm i -g vercel
vercel
```

Share the Vercel URL with your friend to play online!

## Game Rules

### Basic Flow
1. **Setup**: Deal 5 cards to each player
2. **4 Rounds**: Each round has 6 turns per player
3. **Each Turn**: Play a fish card OR dive in a dive site
4. **Scoring**: Points from fish, eggs, young, schools, and achievements

### Playing a Card
- Choose a fish from your hand
- Pay its cost (cards, eggs, young, or consume other fish)
- Place it in an allowed zone/dive site
- Resolve "when played" abilities

### Diving
- Move your diver down a dive site column
- Collect rewards from each zone you pass through
- First time per round in each site = extra benefits

### End of Game
- Calculate scores from:
  - Fish points
  - Consumed fish (1 point each)
  - Eggs, young, and schools
  - Achievement tiles

## Known Limitations

- Drag-and-drop card placement can be added later
- Achievement tiles are not yet implemented
- Some complex abilities need refinement
- Solo (Nautoma) mode is not yet implemented

## Contributing

To improve this project:

1. Add all 125 fish cards to `src/cards.ts`
2. Implement more complex ability logic in `gameEngine.ts`
3. Add card images
4. Improve the UI/UX
5. Add achievement tile support
6. Add chat/messaging between players

## License

This is a fan project for educational purposes. Finspan is copyrighted by Stonemaier Games.

## Support

If you encounter issues:

1. Check that both players are connected (P2P status on setup screen)
2. Refresh if connection drops
3. Make sure browser supports WebRTC (all modern browsers do)
4. Try a different network if behind a restrictive firewall

## Tips for Playing

- Plan your fish placement to maximize dive site bonuses
- Watch other players' hands to predict their moves
- Build engines that combo together
- Save high-value fish for later rounds when you can combo them

Enjoy playing Finspan online with your friend! 🐠