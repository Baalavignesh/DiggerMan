import './createPost.js';

import { Devvit, useWebView } from '@devvit/public-api';

import type { DevvitMessage, WebViewMessage, GameState } from './message.js';

Devvit.configure({
  redditAPI: true,
  redis: true,
  http: true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: 'TheDigger',
  height: 'tall',
  render: (context) => {
    const webView = useWebView<WebViewMessage, DevvitMessage>({
      url: 'index.html',
      async onMessage(message, webView) {
        switch (message.type) {
          case 'webViewReady': {
            // Load saved game state from Redis
            const userId = context.userId || 'anonymous';
            const saveKey = `gameState:${context.postId}:${userId}`;
            const savedStateStr = await context.redis.get(saveKey);

            let savedState: GameState | undefined;
            if (savedStateStr) {
              try {
                savedState = JSON.parse(savedStateStr);
              } catch (e) {
                console.error('Failed to parse saved state:', e);
              }
            }

            webView.postMessage({
              type: 'initialData',
              data: {
                savedState,
              },
            });
            break;
          }
          case 'saveGame': {
            // Save game state to Redis
            const userId = context.userId || 'anonymous';
            const saveKey = `gameState:${context.postId}:${userId}`;
            await context.redis.set(saveKey, JSON.stringify(message.data.gameState));

            webView.postMessage({
              type: 'saveConfirmed',
              data: {},
            });
            break;
          }
          case 'resetGame': {
            // Delete saved game state from Redis
            const userId = context.userId || 'anonymous';
            const saveKey = `gameState:${context.postId}:${userId}`;
            await context.redis.del(saveKey);

            webView.postMessage({
              type: 'resetConfirmed',
              data: {},
            });
            break;
          }
          default:
            throw new Error(`Unknown message type: ${message satisfies never}`);
        }
      },
      onUnmount() {
        context.ui.showToast('Keep digging!');
      },
    });

    return (
      <vstack grow padding="small">
        <vstack grow alignment="middle center">
          <text size="xlarge" weight="bold">TheDigger</text>
          <text>Dig deep, collect dirt, upgrade your tools!</text>
          <spacer />
          <button onPress={() => webView.mount()}>Start Digging</button>
        </vstack>
      </vstack>
    );
  },
});

export default Devvit;
