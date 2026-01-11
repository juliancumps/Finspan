import Peer, { DataConnection } from 'peerjs';
import { GameState } from './types';

export interface PeerMessage {
  type: 'game_state_update' | 'player_action' | 'chat';
  payload: any;
}

export class P2PNetwork {
  private peer: Peer;
  private connections: Map<string, DataConnection> = new Map();
  private messageHandlers: Map<string, Function> = new Map();
  private peerId: string;

  constructor() {
    // Initialize PeerJS with a random ID
    this.peerId = this.generatePeerId();
    this.peer = new Peer(this.peerId);

    // Handle incoming connections
    this.peer.on('connection', (conn: DataConnection) => {
      this.setupConnection(conn);
      this.handleNewConnection(conn.peer);
    });

    this.peer.on('error', (err) => {
      console.error('PeerJS error:', err);
    });
  }

  private generatePeerId(): string {
    return `player_${Math.random().toString(36).substring(2, 9)}`;
  }

  private setupConnection(conn: DataConnection): void {
    conn.on('open', () => {
      this.connections.set(conn.peer, conn);
      console.log(`Connected to ${conn.peer}`);
    });

    conn.on('data', (message: PeerMessage) => {
      this.handleMessage(conn.peer, message);
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
      console.log(`Disconnected from ${conn.peer}`);
    });

    conn.on('error', (err) => {
      console.error(`Connection error with ${conn.peer}:`, err);
    });
  }

  connectToPeer(remotePeerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connections.has(remotePeerId)) {
        resolve();
        return;
      }

      const conn = this.peer.connect(remotePeerId, { reliable: true });
      
      conn.on('open', () => {
        this.setupConnection(conn);
        resolve();
      });

      conn.on('error', reject);

      // Timeout after 10 seconds
      setTimeout(() => reject(new Error('Connection timeout')), 10000);
    });
  }

  broadcastMessage(message: PeerMessage): void {
    this.connections.forEach((conn) => {
      if (conn.open) {
        conn.send(message);
      }
    });
  }

  sendMessage(peerId: string, message: PeerMessage): void {
    const conn = this.connections.get(peerId);
    if (conn && conn.open) {
      conn.send(message);
    } else {
      console.warn(`Not connected to ${peerId}`);
    }
  }

  broadcastGameState(gameState: GameState): void {
    this.broadcastMessage({
      type: 'game_state_update',
      payload: gameState
    });
  }

  onMessage(type: string, handler: (data: any, fromPeerId: string) => void): void {
    this.messageHandlers.set(type, handler);
  }

  private handleMessage(fromPeerId: string, message: PeerMessage): void {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message.payload, fromPeerId);
    }
  }

  private handleNewConnection(peerId: string): void {
    const handler = this.messageHandlers.get('connection');
    if (handler) {
      handler(peerId);
    }
  }

  getPeerId(): string {
    return this.peerId;
  }

  getConnectedPeers(): string[] {
    return Array.from(this.connections.keys());
  }

  disconnect(): void {
    this.connections.forEach((conn) => {
      conn.close();
    });
    this.peer.destroy();
  }
}