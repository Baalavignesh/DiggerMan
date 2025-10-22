import './createPost.js';

import { Devvit, useWebView } from '@devvit/public-api';

import type {
  DevvitMessage,
  WebViewMessage,
  GameState,
  LeaderboardSnapshot,
} from './message.js';

const sanitizeName = (raw: string): string | undefined => {
  const trimmed = raw.trim();
  if (trimmed.length < 3 || trimmed.length > 16) {
    return undefined;
  }

  // Allow letters, numbers, spaces, underscores and hyphens
  const valid = trimmed.replace(/[^a-zA-Z0-9 _-]/g, '');
  if (valid.length !== trimmed.length) {
    return undefined;
  }

  return trimmed;
};

const getKeys = (postId: string) => {
  const base = `leaderboard:${postId}`;
  return {
    money: `${base}:money`,
    depth: `${base}:depth`,
    nameIndex: `${base}:name`,
    userIndex: `${base}:user`,
  };
};

const fetchLeaderboard = async (
  context: Devvit.Context,
  postId: string
): Promise<LeaderboardSnapshot> => {
  const { money, depth } = getKeys(postId);

  const [topMoney = [], topDepth = []] = await Promise.all([
    context.redis.zRange(money, 0, 9, {
      by: 'score',
      reverse: true,
    }),
    context.redis.zRange(depth, 0, 9, {
      by: 'score',
      reverse: true,
    }),
  ]);

  return {
    money: topMoney.map((entry) => ({ name: entry.member, score: entry.score })),
    depth: topDepth.map((entry) => ({ name: entry.member, score: entry.score })),
  };
};

const ensureScore = async (
  context: Devvit.Context,
  key: string,
  playerName: string,
  value: number
) => {
  const current = await context.redis.zScore(key, playerName);
  const targetScore = current !== undefined ? Math.max(current, value) : value;
  await context.redis.zAdd(key, { member: playerName, score: targetScore });
};

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

            const keys = getKeys(context.postId);
            const userNameKey = `${keys.userIndex}:${userId}`;
            const storedName = await context.redis.get(userNameKey);

            if (storedName && savedState) {
              savedState.playerName = storedName;
            }

            const leaderboard = await fetchLeaderboard(context, context.postId);

            webView.postMessage({
              type: 'initialData',
              data: {
                savedState,
                leaderboard,
                playerName: storedName,
              },
            });
            break;
          }
          case 'saveGame': {
            // Save game state to Redis
            const userId = context.userId || 'anonymous';
            const saveKey = `gameState:${context.postId}:${userId}`;
            await context.redis.set(saveKey, JSON.stringify(message.data.gameState));

            const keys = getKeys(context.postId);
            const playerName = message.data.gameState.playerName;

            if (playerName) {
              const moneyScore = Math.floor(message.data.gameState.money || 0);
              const depthScore = Math.floor(message.data.gameState.depth || 0);

              await Promise.all([
                ensureScore(context, keys.money, playerName, moneyScore),
                ensureScore(context, keys.depth, playerName, depthScore),
                context.redis.set(`${keys.userIndex}:${userId}`, playerName),
                context.redis.set(`${keys.nameIndex}:${playerName.toLowerCase()}`, userId),
              ]);
            }

            const leaderboard = await fetchLeaderboard(context, context.postId);

            webView.postMessage({
              type: 'saveConfirmed',
              data: { leaderboard },
            });

            context.ui.webView.postMessage({
              type: 'leaderboardUpdate',
              data: { leaderboard },
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
          case 'registerPlayer': {
            const userId = context.userId || 'anonymous';
            const attemptedName = sanitizeName(message.data.name);

            const keys = getKeys(context.postId);
            const userKey = `${keys.userIndex}:${userId}`;
            const existingName = await context.redis.get(userKey);

            if (!attemptedName) {
              webView.postMessage({
                type: 'registerResult',
                data: {
                  success: false,
                  error: 'Choose a name 3-16 characters long using letters, numbers, spaces, - or _.'
                },
              });
              break;
            }

            const normalized = attemptedName.toLowerCase();
            const nameKey = `${keys.nameIndex}:${normalized}`;
            const owner = await context.redis.get(nameKey);

            if (existingName && existingName.toLowerCase() !== normalized) {
              webView.postMessage({
                type: 'registerResult',
                data: {
                  success: false,
                  error: `You are already registered as ${existingName}.`,
                },
              });
              break;
            }

            if (owner && owner !== userId) {
              webView.postMessage({
                type: 'registerResult',
                data: {
                  success: false,
                  error: 'That name is already claimed. Pick another one.',
                },
              });
              break;
            }

            await Promise.all([
              context.redis.set(userKey, attemptedName),
              context.redis.set(nameKey, userId),
              context.redis.zAdd(keys.money, { member: attemptedName, score: 0 }),
              context.redis.zAdd(keys.depth, { member: attemptedName, score: 0 }),
            ]);

            const leaderboard = await fetchLeaderboard(context, context.postId);

            webView.postMessage({
              type: 'registerResult',
              data: {
                success: true,
                playerName: attemptedName,
                leaderboard,
              },
            });

            context.ui.webView.postMessage({
              type: 'leaderboardUpdate',
              data: { leaderboard },
            });

            break;
          }
          case 'requestLeaderboard': {
            const leaderboard = await fetchLeaderboard(context, context.postId);
            webView.postMessage({
              type: 'leaderboardUpdate',
              data: { leaderboard },
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
