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
}

/** Message from Devvit to the web view. */
export type DevvitMessage =
  | {
      type: 'initialData';
      data: {
        savedState?: GameState;
      };
    }
  | {
      type: 'error';
      data: { message: string };
    }
  | {
      type: 'saveConfirmed';
      data: {};
    }
  | {
      type: 'resetConfirmed';
      data: {};
    };

/** Message from the web view to Devvit. */
export type WebViewMessage =
  | { type: 'webViewReady' }
  | {
      type: 'saveGame';
      data: { gameState: GameState };
    }
  | { type: 'resetGame' };

/**
 * Web view MessageEvent listener data type. The Devvit API wraps all messages
 * from Blocks to the web view.
 */
export type DevvitSystemMessage = {
  data: { message: DevvitMessage };
  /** Reserved type for messages sent via `context.ui.webView.postMessage`. */
  type?: 'devvit-message' | string;
};
