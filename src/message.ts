export interface GameState {
  money: number; // Currency from selling ores
  depth: number;
  currentTool: string;
  autoDiggers: { [key: string]: number };
  oreInventory: { [key: string]: number }; // Count of each ore type collected
  lastSaveTime: number;
  discoveredOres?: Set<string> | string[]; // Ores that have been discovered
  discoveredTools?: Set<string> | string[]; // Tools that have been discovered
  discoveredDiggers?: Set<string> | string[]; // Auto-diggers that have been discovered
  discoveredBiomes?: Set<number> | number[]; // Biomes that have been discovered
  playerName?: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
}

export interface LeaderboardSnapshot {
  money: LeaderboardEntry[];
  depth: LeaderboardEntry[];
}

/** Message from Devvit to the web view. */
export type DevvitMessage =
  | {
      type: 'initialData';
      data: {
        savedState?: GameState;
        leaderboard?: LeaderboardSnapshot;
        playerName?: string;
      };
    }
  | {
      type: 'error';
      data: { message: string };
    }
  | {
      type: 'saveConfirmed';
      data: { leaderboard?: LeaderboardSnapshot };
    }
  | {
      type: 'resetConfirmed';
      data: {};
    }
  | {
      type: 'registerResult';
      data: {
        success: boolean;
        playerName?: string;
        error?: string;
        leaderboard?: LeaderboardSnapshot;
      };
    }
  | {
      type: 'leaderboardUpdate';
      data: {
        leaderboard: LeaderboardSnapshot;
      };
    };

/** Message from the web view to Devvit. */
export type WebViewMessage =
  | { type: 'webViewReady' }
  | {
      type: 'saveGame';
      data: { gameState: GameState };
    }
  | { type: 'resetGame' }
  | {
      type: 'registerPlayer';
      data: { name: string };
    }
  | { type: 'requestLeaderboard' };

/**
 * Web view MessageEvent listener data type. The Devvit API wraps all messages
 * from Blocks to the web view.
 */
export type DevvitSystemMessage = {
  data: { message: DevvitMessage };
  /** Reserved type for messages sent via `context.ui.webView.postMessage`. */
  type?: 'devvit-message' | string;
};
