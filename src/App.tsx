import React, { useState, useEffect } from 'react';
import { useGameStore } from './store';
import { Hand } from './components/Hand';
import { Ocean } from './components/Ocean';
import { P2PNetwork } from './p2p';
import { FishCard } from './types';
import './styles/App.css';

const App: React.FC = () => {
  const gameStore = useGameStore();
  const [p2pNetwork, setP2pNetwork] = useState<P2PNetwork | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2']);
  const [selectedCard, setSelectedCard] = useState<FishCard | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedDiveSite, setSelectedDiveSite] = useState<string | null>(null);
  const [peerId, setPeerId] = useState<string>('');
  const [remoteId, setRemoteId] = useState<string>('');

  useEffect(() => {
    const network = new P2PNetwork();
    setP2pNetwork(network);
    setPeerId(network.getPeerId());

    // Handle incoming game state updates
    network.onMessage('game_state_update', (gameState) => {
      gameStore.updateGameState(gameState);
    });

    return () => {
      network.disconnect();
    };
  }, []);

  const handleStartGame = () => {
    gameStore.initializeGame(playerNames, peerId);
    setGameStarted(true);
  };

  const handleConnect = async () => {
    if (p2pNetwork && remoteId) {
      try {
        await p2pNetwork.connectToPeer(remoteId);
        alert('Connected!');
      } catch (err) {
        alert('Failed to connect: ' + err);
      }
    }
  };

  const handlePlayCard = () => {
    if (selectedCard && selectedZone && selectedDiveSite) {
      gameStore.playFish(selectedCard.id, selectedZone as any, selectedDiveSite as any);
      setSelectedCard(null);
      setSelectedZone(null);
      setSelectedDiveSite(null);

      // Broadcast game state to other players
      if (p2pNetwork && gameStore.gameState) {
        p2pNetwork.broadcastGameState(gameStore.gameState);
      }
    } else {
      alert('Please select a card, zone, and dive site');
    }
  };

  if (!gameStarted) {
    return (
      <div className="setup-screen">
        <div className="setup-container">
          <h1>🐠 Finspan Online 🐠</h1>
          
          <div className="setup-section">
            <h2>P2P Connection</h2>
            <div className="setup-field">
              <label>Your ID:</label>
              <div className="peer-id">{peerId}</div>
              <button onClick={() => navigator.clipboard.writeText(peerId)}>
                Copy ID
              </button>
            </div>

            <div className="setup-field">
              <label>Connect to Peer ID:</label>
              <input
                type="text"
                value={remoteId}
                onChange={(e) => setRemoteId(e.target.value)}
                placeholder="Paste peer ID here"
              />
              <button onClick={handleConnect} disabled={!remoteId}>
                Connect
              </button>
            </div>

            <div className="connected-peers">
              <p>Connected to: {p2pNetwork?.getConnectedPeers().join(', ') || 'None'}</p>
            </div>
          </div>

          <div className="setup-section">
            <h2>Game Setup</h2>
            <div className="setup-field">
              <label>Player 1 Name:</label>
              <input
                type="text"
                value={playerNames[0]}
                onChange={(e) =>
                  setPlayerNames([e.target.value, playerNames[1]])
                }
              />
            </div>

            <div className="setup-field">
              <label>Player 2 Name:</label>
              <input
                type="text"
                value={playerNames[1]}
                onChange={(e) =>
                  setPlayerNames([playerNames[0], e.target.value])
                }
              />
            </div>

            <button className="start-button" onClick={handleStartGame}>
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!gameStore.gameState) {
    return <div className="loading">Loading game...</div>;
  }

  const gameState = gameStore.gameState;
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isYourTurn =
    gameStore.playerId === currentPlayer.playerId;
  const yourPlayer = gameState.players.find(
    (p) => p.playerId === gameStore.playerId
  );

  return (
    <div className="game-screen">
      <div className="header">
        <h1>🐠 Finspan Online 🐠</h1>
        <div className="game-info">
          <span>Round: {gameState.currentRound}/4</span>
          <span>Turn: {gameState.turn + 1}</span>
          <span className={`turn-indicator ${isYourTurn ? 'your-turn' : ''}`}>
            Current Turn: {currentPlayer.playerName}
          </span>
        </div>
      </div>

      <div className="game-container">
        <div className="players-section">
          {gameState.players.map((player) => (
            <div key={player.playerId} className="player-view">
              <Ocean
                player={player}
                isYourTurn={isYourTurn && player.playerId === gameStore.playerId}
              />
            </div>
          ))}
        </div>

        {yourPlayer && (
          <div className="action-panel">
            <Hand
              cards={yourPlayer.hand}
              isYourTurn={isYourTurn}
              onCardSelect={setSelectedCard}
            />

            {selectedCard && (
              <div className="placement-controls">
                <h3>Place {selectedCard.name}</h3>

                <div className="control-group">
                  <label>Zone:</label>
                  <div className="zone-buttons">
                    {selectedCard.allowedZones.map((zone) => (
                      <button
                        key={zone}
                        className={`zone-btn ${
                          selectedZone === zone ? 'selected' : ''
                        }`}
                        onClick={() => setSelectedZone(zone)}
                      >
                        {zone}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="control-group">
                  <label>Dive Site:</label>
                  <div className="site-buttons">
                    {['red', 'blue', 'green'].map((site) => (
                      <button
                        key={site}
                        className={`site-btn site-${site} ${
                          selectedDiveSite === site ? 'selected' : ''
                        }`}
                        onClick={() => setSelectedDiveSite(site)}
                      >
                        {site.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="play-button"
                  onClick={handlePlayCard}
                  disabled={!selectedZone || !selectedDiveSite}
                >
                  Play Card
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;