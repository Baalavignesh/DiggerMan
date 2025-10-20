import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { postToDevvit, onDevvitMessage } from './devvitMessaging';
import type { DevvitMessage, GameState } from '../../src/message';
import { TOOLS, AUTO_DIGGERS, ORES, BIOMES, getBiome, getAutoDiggerCost } from './gameData';
import type { Tool, AutoDigger } from './gameData';
import Character from './Character';
import Modal from './Modal';

// Preload sounds and music for instant playback (no delay)
let miningSound: HTMLAudioElement | null = null;
let selectSound: HTMLAudioElement | null = null;
let backgroundMusic: HTMLAudioElement | null = null;

// Initialize sounds after DOM is ready
if (typeof window !== 'undefined') {
  try {
    miningSound = new Audio('/sounds/mining.mp3');
    miningSound.volume = 0.5;
    miningSound.preload = 'auto';
    miningSound.load(); // Force preload

    selectSound = new Audio('/sounds/clicksound.mp3');
    selectSound.volume = 0.3;
    selectSound.preload = 'auto';
    selectSound.load(); // Force preload

    backgroundMusic = new Audio('/sounds/music.mp3');
    backgroundMusic.volume = 0.2;
    backgroundMusic.loop = true;
    backgroundMusic.preload = 'auto';
    backgroundMusic.load(); // Force preload
  } catch (err) {
    console.error('Failed to initialize sounds:', err);
  }
}

// Sound effect utility - plays instantly
const playSound = (audio: HTMLAudioElement | null) => {
  if (!audio) return;

  try {
    // Clone the audio for overlapping sounds
    const soundClone = audio.cloneNode() as HTMLAudioElement;
    soundClone.volume = audio.volume;
    soundClone.play().catch(err => console.log('Sound play failed:', err));
  } catch (err) {
    console.log('Sound playback failed:', err);
  }
};

interface AppState extends GameState {
  money: number;
  depth: number;
  currentTool: string;
  autoDiggers: { [key: string]: number };
  oreInventory: { [key: string]: number };
  lastSaveTime: number;
  discoveredOres: Set<string>;
  discoveredTools: Set<string>;
  discoveredDiggers: Set<string>;
  discoveredBiomes: Set<number>;
}

// Format large numbers for display
function formatNumber(num: number): string {
  if (num < 1000) return Math.floor(num).toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num < 1000000000000000) return (num / 1000000000000).toFixed(1) + 'T';
  return (num / 1000000000000000).toFixed(1) + 'Q';
}

// Format decimal numbers (for auto-digger speeds)
function formatDecimal(num: number): string {
  if (num < 1) return num.toFixed(2);
  if (num < 10) return num.toFixed(1);
  if (num < 1000) return Math.floor(num).toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num < 1000000000000000) return (num / 1000000000000).toFixed(1) + 'T';
  return (num / 1000000000000000).toFixed(1) + 'Q';
}

// Convert ore name to filename format
function getOreImagePath(oreName: string, variant: number): string {
  // Convert from snake_case to Title Case
  const titleCase = oreName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return `/ores/${titleCase}${variant}.png`;
}

// Randomly select an ore from the current biome
function getRandomOre(biomeOres: string[]): string {
  const availableOres = biomeOres.map(oreId => ORES[oreId]);

  // Weighted random selection based on spawn chance
  const totalWeight = availableOres.reduce((sum, ore) => sum + ore.spawnChance, 0);
  let random = Math.random() * totalWeight;

  for (const ore of availableOres) {
    random -= ore.spawnChance;
    if (random <= 0) {
      return ore.id;
    }
  }

  return biomeOres[0]; // Fallback
}

function App() {
  const [ready, setReady] = useState(false);
  const [gameState, setGameState] = useState<AppState>({
    money: 0,
    depth: 0,
    currentTool: 'dirt_pickaxe',
    autoDiggers: {},
    oreInventory: {},
    lastSaveTime: Date.now(),
    discoveredOres: new Set<string>(['dirt']), // Start with dirt discovered
    discoveredTools: new Set<string>(['dirt_pickaxe']), // Start with dirt pickaxe discovered
    discoveredDiggers: new Set<string>(),
    discoveredBiomes: new Set<number>([1]), // Start with Surface biome discovered
  });

  const [showOreChart, setShowOreChart] = useState(false);
  const [showBiomeChart, setShowBiomeChart] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [shopTab, setShopTab] = useState<'tools' | 'diggers'>('tools');

  // Audio control states
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sound effect helpers
  const playMiningSound = useCallback(() => {
    if (soundEnabled) {
      playSound(miningSound);
    }
  }, [soundEnabled]);

  const playSelectSound = useCallback(() => {
    if (soundEnabled) {
      playSound(selectSound);
    }
  }, [soundEnabled]);
  const [isSmashing, setIsSmashing] = useState(false);
  const [currentOreId, setCurrentOreId] = useState<string>('dirt');
  const [currentOreVariant, setCurrentOreVariant] = useState<number>(1);
  const [upcomingOres, setUpcomingOres] = useState<Array<{ id: string; variant: number }>>([]);
  const [sparkParticles, setSparkParticles] = useState<Array<{ id: string; variant: number; x: number; y: number; key: number }>>([]);
  const [fallingOres, setFallingOres] = useState<Array<{ id: string; variant: number; x: number; delay: number; duration: number; key: number }>>([]);

  // Auto-digger states: { diggerId: { currentOre, upcomingOres, isSmashing } }
  const [autoDiggerStates, setAutoDiggerStates] = useState<{
    [diggerId: string]: {
      currentOre: { id: string; variant: number };
      upcomingOres: Array<{ id: string; variant: number }>;
      isSmashing: boolean;
    };
  }>({});

  const lastTickRef = useRef<number>(Date.now());
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sparkKeyRef = useRef<number>(0);
  const fallingOreKeyRef = useRef<number>(0);

  // Get current tool data
  const currentTool = TOOLS.find((t) => t.id === gameState.currentTool) || TOOLS[0];

  // Get current biome
  const currentBiome = getBiome(gameState.depth);

  // Reset game function
  const handleResetGame = useCallback(() => {
    if (!confirm('Are you sure you want to reset your game? This will delete all progress!')) {
      return;
    }

    const isStandalone = window.self === window.top;

    if (isStandalone) {
      // Clear localStorage
      localStorage.removeItem('theDiggerSave');
      // Reload page
      window.location.reload();
    } else {
      // Send reset message to Devvit
      postToDevvit({ type: 'resetGame' });
    }
  }, []);

  // Generate static background ores (memoized - only runs once)
  const backgroundOres = useMemo(() => {
    const oreTypes = ['stone', 'gold', 'emerald', 'ruby', 'diamond', 'deep_stone'];
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      ore: oreTypes[Math.floor(Math.random() * oreTypes.length)],
      variant: Math.floor(Math.random() * 3) + 4, // Variants 4-6 for background
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 30 + Math.random() * 20, // 30-50px
    }));
  }, []);

  // Calculate total auto-digger production
  const totalDepthProduction = useMemo(() => {
    return AUTO_DIGGERS.reduce((total, digger) => {
      const count = gameState.autoDiggers[digger.id] || 0;
      return total + digger.depthPerSecond * count;
    }, 0);
  }, [gameState.autoDiggers]);

  // Set initial ore when ready and start music
  useEffect(() => {
    if (ready) {
      const biome = getBiome(gameState.depth);
      const initialOre = getRandomOre(biome.ores);
      setCurrentOreId(initialOre);
      setCurrentOreVariant(Math.floor(Math.random() * 3) + 1); // Random variant 1-3 (large)

      // Generate upcoming ores
      const ores: Array<{ id: string; variant: number }> = [];
      for (let i = 0; i < 5; i++) {
        ores.push({
          id: getRandomOre(biome.ores),
          variant: Math.floor(Math.random() * 3) + 1,
        });
      }
      setUpcomingOres(ores);

      // Start background music
      if (backgroundMusic && musicEnabled) {
        backgroundMusic.play().catch(err => console.log('Music autoplay blocked:', err));
      }
    }
  }, [ready]);

  // Handle music toggle
  useEffect(() => {
    if (backgroundMusic) {
      if (musicEnabled) {
        backgroundMusic.play().catch(err => console.log('Music play failed:', err));
      } else {
        backgroundMusic.pause();
      }
    }
  }, [musicEnabled]);

  // Create falling ore effect (shared function) - DEFINED FIRST
  const createFallingOres = useCallback((oreId: string) => {
    const fallingCount = Math.floor(Math.random() * 2) + 1; // 1-2 falling ores per action
    const newFallingOres: Array<{ id: string; variant: number; x: number; delay: number; duration: number; key: number }> = [];

    for (let i = 0; i < fallingCount; i++) {
      const variant = Math.floor(Math.random() * 6) + 1; // Variants 1-6 (all variants)
      const x = Math.random() * 100; // Random x position (0-100%)
      const delay = Math.random() * 1.5; // Random delay 0-1.5s
      const duration = 6 + Math.random() * 3; // Duration 6-9s (much slower)
      const key = fallingOreKeyRef.current++;

      newFallingOres.push({ id: oreId, variant, x, delay, duration, key });
    }

    setFallingOres((prev) => [...prev, ...newFallingOres]);

    // Remove falling ores after animation completes
    setTimeout(() => {
      setFallingOres((current) => current.filter((ore) => !newFallingOres.find((n) => n.key === ore.key)));
    }, 11000); // 11 seconds to account for max duration (9s) + delay (1.5s) + buffer
  }, []);

  // Handle ore click - triggers smash animation
  const handleOreClick = useCallback(() => {
    if (isSmashing) return; // Prevent clicking while animating

    const ore = ORES[currentOreId];
    const bonusMoney = Math.floor(ore.value * currentTool.bonusMultiplier);

    playMiningSound(); // Play mining sound instantly
    setIsSmashing(true);

    // Create spark particles
    const sparkCount = Math.floor(Math.random() * 3) + 3; // 3-5 sparks
    const newSparks: Array<{ id: string; variant: number; x: number; y: number; key: number }> = [];

    for (let i = 0; i < sparkCount; i++) {
      const variant = Math.floor(Math.random() * 3) + 4; // Variants 4, 5, or 6
      const angle = (Math.PI * 2 * i) / sparkCount; // Spread evenly in circle
      const distance = 60 + Math.random() * 40; // Random distance 60-100px
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const key = sparkKeyRef.current++;

      newSparks.push({ id: currentOreId, variant, x, y, key });
    }

    setSparkParticles((prev) => [...prev, ...newSparks]);

    // Remove sparks after animation completes (0.6 seconds)
    setTimeout(() => {
      setSparkParticles((prev) => prev.filter((spark) => !newSparks.find((n) => n.key === spark.key)));
    }, 600);

    // Trigger falling ore effect
    createFallingOres(currentOreId);

    // Collect the ore immediately and mark as discovered
    setGameState((prev) => {
      const newDiscoveredOres = new Set(prev.discoveredOres);
      newDiscoveredOres.add(currentOreId);

      return {
        ...prev,
        depth: prev.depth + 1, // Each click = 1ft depth
        money: prev.money + bonusMoney,
        oreInventory: {
          ...prev.oreInventory,
          [currentOreId]: (prev.oreInventory[currentOreId] || 0) + 1,
        },
        discoveredOres: newDiscoveredOres,
      };
    });

    // Move to next ore from the upcoming queue immediately
    setUpcomingOres((prev) => {
      const [nextOre, ...remaining] = prev;
      if (nextOre) {
        setCurrentOreId(nextOre.id);
        setCurrentOreVariant(nextOre.variant);
      }

      // Generate a new ore to add to the end of the queue
      const biome = getBiome(gameState.depth);
      const newOre = {
        id: getRandomOre(biome.ores),
        variant: Math.floor(Math.random() * 3) + 1,
      };

      return [...remaining, newOre];
    });

    // Allow next click after a very short delay (50ms) for instant feel
    setTimeout(() => {
      setIsSmashing(false);
    }, 50);
  }, [isSmashing, currentOreId, currentTool, gameState.depth, createFallingOres, playMiningSound]);

  // Handle smash animation complete - now just a placeholder for the Character component
  const handleSmashComplete = useCallback(() => {
    // Animation complete - nothing to do here since ore collection happens in handleOreClick
  }, []);

  // Buy tool upgrade
  const buyTool = useCallback(
    (tool: Tool) => {
      const currentToolIndex = TOOLS.findIndex((t) => t.id === gameState.currentTool);
      const newToolIndex = TOOLS.findIndex((t) => t.id === tool.id);

      // Can't buy a tool that's older/weaker than current
      if (newToolIndex <= currentToolIndex) {
        return;
      }

      if (gameState.money >= tool.cost) {
        playSelectSound(); // Play sound on purchase
        setGameState((prev) => {
          const newDiscoveredTools = new Set(prev.discoveredTools);
          newDiscoveredTools.add(tool.id);

          const newState = {
            ...prev,
            money: prev.money - tool.cost,
            currentTool: tool.id,
            discoveredTools: newDiscoveredTools,
          };
          // Immediately save to localStorage
          if (window.self === window.top) {
            localStorage.setItem('theDiggerSave', JSON.stringify({
              ...newState,
              lastSaveTime: Date.now(),
              // Convert Sets to arrays for JSON serialization
              discoveredOres: Array.from(newState.discoveredOres),
              discoveredTools: Array.from(newState.discoveredTools),
              discoveredDiggers: Array.from(newState.discoveredDiggers),
              discoveredBiomes: Array.from(newState.discoveredBiomes),
            }));
          }
          return newState;
        });
      }
    },
    [gameState.money, gameState.currentTool, playSelectSound]
  );

  // Buy auto-digger
  const buyAutoDigger = useCallback(
    (digger: AutoDigger) => {
      const currentCount = gameState.autoDiggers[digger.id] || 0;
      const cost = getAutoDiggerCost(digger, currentCount);

      if (gameState.money >= cost) {
        playSelectSound(); // Play sound on purchase
        setGameState((prev) => {
          const newDiscoveredDiggers = new Set(prev.discoveredDiggers);
          newDiscoveredDiggers.add(digger.id);

          return {
            ...prev,
            money: prev.money - cost,
            autoDiggers: {
              ...prev.autoDiggers,
              [digger.id]: currentCount + 1,
            },
            discoveredDiggers: newDiscoveredDiggers,
          };
        });
      }
    },
    [gameState.money, gameState.autoDiggers, playSelectSound]
  );

  // Auto-production tick (60fps) - just updates depth
  useEffect(() => {
    if (totalDepthProduction <= 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastTickRef.current) / 1000; // Convert to seconds
      lastTickRef.current = now;

      setGameState((prev) => ({
        ...prev,
        depth: prev.depth + totalDepthProduction * deltaTime,
      }));
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(interval);
  }, [totalDepthProduction]);

  // Initialize auto-digger states when purchased
  useEffect(() => {
    if (!ready) return;

    const biome = getBiome(gameState.depth);

    // Get list of owned auto-diggers
    const ownedDiggers = Object.keys(gameState.autoDiggers).filter(
      (diggerId) => gameState.autoDiggers[diggerId] > 0
    );

    // Initialize new diggers
    setAutoDiggerStates((prev) => {
      const newStates = { ...prev };

      // Add new diggers
      ownedDiggers.forEach((diggerId) => {
        if (!newStates[diggerId]) {
          newStates[diggerId] = {
            currentOre: {
              id: getRandomOre(biome.ores),
              variant: Math.floor(Math.random() * 3) + 1,
            },
            upcomingOres: Array.from({ length: 5 }, () => ({
              id: getRandomOre(biome.ores),
              variant: Math.floor(Math.random() * 3) + 1,
            })),
            isSmashing: false,
          };
        }
      });

      // Remove diggers that are no longer owned
      Object.keys(newStates).forEach((diggerId) => {
        if (!ownedDiggers.includes(diggerId)) {
          delete newStates[diggerId];
        }
      });

      return newStates;
    });
  }, [gameState.autoDiggers, ready]);

  // Track biome changes and update auto-digger ores
  const prevBiomeRef = useRef<number>(0);
  useEffect(() => {
    const currentBiomeId = getBiome(gameState.depth).id;

    // Mark biome as discovered
    setGameState((prev) => {
      const newDiscoveredBiomes = new Set(prev.discoveredBiomes);
      newDiscoveredBiomes.add(currentBiomeId);
      return { ...prev, discoveredBiomes: newDiscoveredBiomes };
    });

    // If biome changed, update all auto-digger ores
    if (prevBiomeRef.current !== 0 && prevBiomeRef.current !== currentBiomeId) {
      const newBiome = getBiome(gameState.depth);

      setAutoDiggerStates((prev) => {
        const newStates = { ...prev };

        // Update all existing diggers with new biome ores
        Object.keys(newStates).forEach((diggerId) => {
          newStates[diggerId] = {
            ...newStates[diggerId],
            currentOre: {
              id: getRandomOre(newBiome.ores),
              variant: Math.floor(Math.random() * 3) + 1,
            },
            upcomingOres: Array.from({ length: 5 }, () => ({
              id: getRandomOre(newBiome.ores),
              variant: Math.floor(Math.random() * 3) + 1,
            })),
          };
        });

        return newStates;
      });
    }

    prevBiomeRef.current = currentBiomeId;
  }, [gameState.depth]);

  // Auto-mining logic for each digger - continuous mining
  useEffect(() => {
    const intervals: { [diggerId: string]: NodeJS.Timeout } = {};
    const ownedDiggers = Object.keys(gameState.autoDiggers).filter(
      (diggerId) => gameState.autoDiggers[diggerId] > 0
    );

    ownedDiggers.forEach((diggerId) => {
      const digger = AUTO_DIGGERS.find((d) => d.id === diggerId);
      const count = gameState.autoDiggers[diggerId] || 0;

      if (!digger || count === 0) return;

      // Base mining interval: 1 second per ore
      const baseInterval = 1000;
      // Speed increases with count (more copies = faster mining)
      const mineInterval = Math.max(100, baseInterval / count);

      const interval = setInterval(() => {

        // Start smashing animation
        setAutoDiggerStates((prev) => {
          if (!prev[diggerId] || prev[diggerId].isSmashing) {
            return prev;
          }

          return {
            ...prev,
            [diggerId]: { ...prev[diggerId], isSmashing: true },
          };
        });

        // After animation, collect and spawn new ore
        setTimeout(() => {
          setAutoDiggerStates((prev) => {
            if (!prev[diggerId]) return prev;

            const ore = ORES[prev[diggerId].currentOre.id];
            const currentOreId = prev[diggerId].currentOre.id;

            // Trigger falling ore effect for auto-digger
            createFallingOres(currentOreId);

            // Collect money and ore
            setGameState((prevState) => {
              const newDiscoveredOres = new Set(prevState.discoveredOres);
              newDiscoveredOres.add(currentOreId);

              return {
                ...prevState,
                money: prevState.money + ore.value,
                oreInventory: {
                  ...prevState.oreInventory,
                  [currentOreId]: (prevState.oreInventory[currentOreId] || 0) + 1,
                },
                discoveredOres: newDiscoveredOres,
              };
            });

            // Move to next ore
            const [nextOre, ...remaining] = prev[diggerId].upcomingOres;
            const biome = getBiome(gameState.depth);
            const newOre = {
              id: getRandomOre(biome.ores),
              variant: Math.floor(Math.random() * 3) + 1,
            };

            return {
              ...prev,
              [diggerId]: {
                currentOre: nextOre,
                upcomingOres: [...remaining, newOre],
                isSmashing: false,
              },
            };
          });
        }, 200);
      }, mineInterval);

      intervals[diggerId] = interval;
    });

    return () => {
      Object.values(intervals).forEach((interval) => clearInterval(interval));
    };
  }, [gameState.autoDiggers, createFallingOres]);

  // Auto-save every 5 seconds
  useEffect(() => {
    if (ready) {
      const isStandalone = window.self === window.top;

      saveIntervalRef.current = setInterval(() => {
        const saveData = {
          ...gameState,
          lastSaveTime: Date.now(),
          // Convert Sets to arrays for JSON serialization
          discoveredOres: Array.from(gameState.discoveredOres),
          discoveredTools: Array.from(gameState.discoveredTools),
          discoveredDiggers: Array.from(gameState.discoveredDiggers),
          discoveredBiomes: Array.from(gameState.discoveredBiomes),
        };

        if (isStandalone) {
          localStorage.setItem('theDiggerSave', JSON.stringify(saveData));
        } else {
          postToDevvit({
            type: 'saveGame',
            data: {
              gameState: saveData,
            },
          });
        }
      }, 5000);

      return () => {
        if (saveIntervalRef.current) {
          clearInterval(saveIntervalRef.current);
        }
      };
    }
  }, [ready, gameState]);

  // Initial setup and message handling
  useEffect(() => {
    const isStandalone = window.self === window.top;

    const defaultState: AppState = {
      money: 0,
      depth: 0,
      currentTool: 'dirt_pickaxe',
      autoDiggers: {},
      oreInventory: {},
      lastSaveTime: Date.now(),
      discoveredOres: new Set<string>(['dirt']),
      discoveredTools: new Set<string>(['dirt_pickaxe']),
      discoveredDiggers: new Set<string>(),
      discoveredBiomes: new Set<number>([1]),
    };

    if (isStandalone) {
      const savedData = localStorage.getItem('theDiggerSave');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          // Merge parsed data with default state to ensure all properties exist
          setGameState({
            ...defaultState,
            ...parsed,
            currentTool: parsed.currentTool || 'dirt_pickaxe',
            autoDiggers: parsed.autoDiggers || {},
            oreInventory: parsed.oreInventory || {},
            // Convert arrays back to Sets
            discoveredOres: new Set(parsed.discoveredOres || ['dirt']),
            discoveredTools: new Set(parsed.discoveredTools || ['dirt_pickaxe']),
            discoveredDiggers: new Set(parsed.discoveredDiggers || []),
            discoveredBiomes: new Set(parsed.discoveredBiomes || [1]),
          });
        } catch (e) {
          console.error('Failed to parse saved data:', e);
        }
      }
      setReady(true);
      return;
    }

    const cleanup = onDevvitMessage((event) => {
      const message: DevvitMessage = event.data.message;

      switch (message.type) {
        case 'initialData':
          if (message.data.savedState) {
            // Merge saved state with default state to ensure all properties exist
            setGameState({
              ...defaultState,
              ...message.data.savedState,
              autoDiggers: message.data.savedState.autoDiggers || {},
              oreInventory: message.data.savedState.oreInventory || {},
              // Convert arrays back to Sets
              discoveredOres: new Set(message.data.savedState.discoveredOres || ['dirt']),
              discoveredTools: new Set(message.data.savedState.discoveredTools || ['dirt_pickaxe']),
              discoveredDiggers: new Set(message.data.savedState.discoveredDiggers || []),
              discoveredBiomes: new Set(message.data.savedState.discoveredBiomes || [1]),
            });
          }
          setReady(true);
          break;
        case 'error':
          console.error('Error from Devvit:', message.data.message);
          break;
        case 'saveConfirmed':
          break;
        case 'resetConfirmed':
          // Reload the page to reset the game
          window.location.reload();
          break;
      }
    });

    postToDevvit({ type: 'webViewReady' });

    return cleanup;
  }, []);

  if (!ready) {
    return (
      <div className="app loading">
        <h1>TheDigger</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="game-box" style={{ backgroundColor: currentBiome.backgroundColor }}>
        {/* Falling ores background inside game box */}
        <div className="falling-ores-container">
          {fallingOres.map((ore) => (
            <img
              key={ore.key}
              src={getOreImagePath(ore.id, ore.variant)}
              alt="falling ore"
              className="falling-ore"
              style={{
                left: `${ore.x}%`,
                animationDelay: `${ore.delay}s`,
                animationDuration: `${ore.duration}s`,
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ))}
        </div>

      <div className="game-header">
        <h1 className="game-title"><i className="fas fa-hammer"></i> THE DIGGER <i className="fas fa-hammer"></i></h1>
        <div className="stats">
          <div className="stat">
            <span className="stat-label"><i className="fas fa-arrow-down"></i> Depth:</span>
            <span className="stat-value">{formatNumber(Math.floor(gameState.depth))} ft</span>
          </div>
          <div className="stat biome">
            <span className="stat-label"><i className="fas fa-mountain"></i> Biome:</span>
            <span className="stat-value">{currentBiome.name}</span>
          </div>
          <button className="pixel-btn shop-btn" onClick={() => { playSelectSound(); setShowShop(true); }}>
            <i className="fas fa-shopping-cart"></i> SHOP
          </button>
          <button className="pixel-btn ore-chart-btn" onClick={() => { playSelectSound(); setShowOreChart(!showOreChart); }}>
            <i className="fas fa-chart-bar"></i> ORES
          </button>
          <button className="pixel-btn biome-chart-btn" onClick={() => { playSelectSound(); setShowBiomeChart(!showBiomeChart); }}>
            <i className="fas fa-mountain"></i> BIOMES
          </button>
          <button
            className={`pixel-btn audio-btn ${musicEnabled ? 'enabled' : 'disabled'}`}
            onClick={() => { playSelectSound(); setMusicEnabled(!musicEnabled); }}
            title={musicEnabled ? 'Disable Music' : 'Enable Music'}
          >
            <i className={`fas fa-${musicEnabled ? 'music' : 'volume-mute'}`}></i>
          </button>
          <button
            className={`pixel-btn audio-btn ${soundEnabled ? 'enabled' : 'disabled'}`}
            onClick={() => {
              if (soundEnabled) playSound(selectSound); // Play sound before disabling
              setSoundEnabled(!soundEnabled);
            }}
            title={soundEnabled ? 'Disable Sounds' : 'Enable Sounds'}
          >
            <i className={`fas fa-${soundEnabled ? 'volume-up' : 'volume-off'}`}></i>
          </button>
          <button className="pixel-btn reset-btn" onClick={() => { playSelectSound(); handleResetGame(); }} title="Reset game progress">
            <i className="fas fa-redo"></i> RESET
          </button>
        </div>
      </div>

      {/* Big Money Display */}
      <div className="depth-display">
        <div className="depth-label">MONEY EARNED</div>
        <div className="depth-value">
          <span className="depth-number">${formatNumber(gameState.money)}</span>
        </div>
      </div>

      <Modal
        isOpen={showOreChart}
        onClose={() => { playSelectSound(); setShowOreChart(false); }}
        title="ORE VALUES"
        icon="fas fa-gem"
        className="ore-chart-modal"
      >
        <div className="ore-list">
          {Object.values(ORES).map((ore) => {
            const isDiscovered = gameState.discoveredOres.has(ore.id);
            return (
              <div key={ore.id} className={`ore-item rarity-${ore.rarity} ${!isDiscovered ? 'locked' : ''}`}>
                <img
                  src={isDiscovered ? getOreImagePath(ore.id, 1) : '/ores/Unknown.png'}
                  alt={isDiscovered ? ore.name : '???'}
                  className="ore-icon"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="ore-name">{isDiscovered ? ore.name : '???'}</span>
                <span className="ore-value">{isDiscovered ? `$${formatNumber(ore.value)}` : '???'}</span>
                <span className="ore-count">
                  ({gameState.oreInventory[ore.id] || 0} collected)
                </span>
              </div>
            );
          })}
        </div>
      </Modal>

      <Modal
        isOpen={showBiomeChart}
        onClose={() => { playSelectSound(); setShowBiomeChart(false); }}
        title="BIOMES"
        icon="fas fa-mountain"
        className="biome-chart-modal"
      >
        <div className="biome-list">
          {BIOMES.map((biome) => {
            const isDiscovered = gameState.discoveredBiomes.has(biome.id);
            return (
              <div key={biome.id} className={`biome-item ${!isDiscovered ? 'locked' : ''}`}>
                <div
                  className="biome-color"
                  style={{ backgroundColor: isDiscovered ? biome.backgroundColor : '#333' }}
                />
                <div className="biome-info">
                  <span className="biome-name">{isDiscovered ? biome.name : '???'}</span>
                  <span className="biome-depth">
                    {isDiscovered ? `${formatNumber(biome.minDepth)}ft - ${biome.maxDepth === Infinity ? '∞' : formatNumber(biome.maxDepth) + 'ft'}` : '???'}
                  </span>
                </div>
                <span className="biome-status">
                  {isDiscovered ? (currentBiome.id === biome.id ? '📍 Current' : '✓ Discovered') : '🔒 Locked'}
                </span>
              </div>
            );
          })}
        </div>
      </Modal>

      <div className="game-content">
        {/* Static background ore decorations */}
        <div className="background-ores">
          {backgroundOres.map((bgOre) => (
            <img
              key={bgOre.id}
              src={getOreImagePath(bgOre.ore, bgOre.variant)}
              alt="background ore"
              className="background-ore"
              style={{
                left: `${bgOre.x}%`,
                top: `${bgOre.y}%`,
                width: `${bgOre.size}px`,
                height: `${bgOre.size}px`,
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ))}
        </div>

        <div className="dig-area">
          {/* Center Manual Mining Column */}
          <div className="manual-mining-column">
            <div className="mining-scene">
              <div className="character-container">
                <Character isSmashing={isSmashing} onSmashComplete={handleSmashComplete} />
              </div>

              <div className="ore-container" onClick={handleOreClick}>
                <div className="ore-wrapper">
                  <img
                    src={getOreImagePath(currentOreId, currentOreVariant)}
                    alt={ORES[currentOreId]?.name || 'Ore'}
                    className="current-ore"
                    style={{ cursor: isSmashing ? 'default' : 'pointer' }}
                    onError={(e) => {
                      console.error(`Failed to load ore: ${getOreImagePath(currentOreId, currentOreVariant)}`);
                    }}
                  />
                  {/* Spark particles */}
                  {sparkParticles.map((spark) => (
                    <img
                      key={spark.key}
                      src={getOreImagePath(spark.id, spark.variant)}
                      alt="spark"
                      className="ore-spark"
                      style={{
                        '--spark-x': `${spark.x}px`,
                        '--spark-y': `${spark.y}px`,
                      } as React.CSSProperties}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ))}
                </div>
                <div className="ore-label">{ORES[currentOreId]?.name || 'Unknown'}</div>
              </div>

              {/* Upcoming ores stack */}
              <div className="upcoming-ores">
                {upcomingOres.map((ore, index) => (
                  <img
                    key={index}
                    src={getOreImagePath(ore.id, ore.variant)}
                    alt={ORES[ore.id]?.name || 'Ore'}
                    className="upcoming-ore"
                    style={{ zIndex: 5 - index }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Popup Modal */}
      <Modal
        isOpen={showShop}
        onClose={() => { playSelectSound(); setShowShop(false); }}
        title="SHOP"
        icon="fas fa-store"
        className="shop-modal"
      >
        {/* Shop Tabs */}
        <div className="shop-tabs">
              <button
                className={`shop-tab ${shopTab === 'tools' ? 'active' : ''}`}
                onClick={() => { playSelectSound(); setShopTab('tools'); }}
              >
                <i className="fas fa-hammer"></i>
                <span>TOOLS</span>
              </button>
              <button
                className={`shop-tab ${shopTab === 'diggers' ? 'active' : ''}`}
                onClick={() => { playSelectSound(); setShopTab('diggers'); }}
              >
                <i className="fas fa-robot"></i>
                <span>AUTO-DIGGERS</span>
              </button>
            </div>

            <div className="modal-body">
              {shopTab === 'tools' && (
                <div className="shop-section">
                <div className="shop-items">
                  {TOOLS.map((tool, index) => {
                    const currentToolIndex = TOOLS.findIndex((t) => t.id === gameState.currentTool);
                    const isOlderTool = index < currentToolIndex;
                    const isCurrentTool = gameState.currentTool === tool.id;
                    const canAfford = gameState.money >= tool.cost;
                    // Show next tool if current or previous tool is discovered
                    const shouldShow = index === 0 || gameState.discoveredTools.has(TOOLS[index - 1].id);

                    return (
                      <button
                        key={tool.id}
                        className={`tool-item ${canAfford && !isOlderTool && !isCurrentTool && shouldShow ? 'affordable' : 'expensive'} ${!shouldShow ? 'locked' : ''} ${isCurrentTool ? 'owned' : ''} ${isOlderTool ? 'obsolete' : ''}`}
                        onClick={() => shouldShow && buyTool(tool)}
                        disabled={isCurrentTool || isOlderTool || !canAfford || !shouldShow}
                        title={shouldShow ? `${tool.bonusMultiplier}x Money Bonus` : '???'}
                      >
                        <div className="tool-image-container">
                          <img
                            src={shouldShow ? getOreImagePath(tool.oreId, 1) : '/ores/Unknown.png'}
                            alt={shouldShow ? (ORES[tool.oreId]?.name || 'Ore') : '???'}
                            className={`tool-image ${!shouldShow ? 'locked-image' : ''}`}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          {!shouldShow && <div className="tool-locked-overlay">?</div>}
                        </div>
                        <div className="tool-info">
                          <div className="tool-name">
                            {shouldShow ? tool.name : '???'}
                          </div>
                          <div className="tool-stats">
                            {shouldShow ? `${tool.bonusMultiplier}x Money Bonus` : '???'}
                          </div>
                          <div className="tool-cost">
                            {!shouldShow ? '???' : isCurrentTool ? 'EQUIPPED' : isOlderTool ? 'OBSOLETE' : `$${formatNumber(tool.cost)}`}
                          </div>
                        </div>
                        <div className="tool-status">
                          {isCurrentTool ? '✓' : ''}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              )}

              {shopTab === 'diggers' && (
                <div className="shop-section">
                <div className="shop-items">
                  {AUTO_DIGGERS.map((digger, index) => {
                    const count = gameState.autoDiggers[digger.id] || 0;
                    const cost = getAutoDiggerCost(digger, count);
                    const canAfford = gameState.money >= cost;
                    // Show next digger if current or previous digger is discovered
                    const shouldShow = index === 0 || gameState.discoveredDiggers.has(AUTO_DIGGERS[index - 1].id);
                    const diggerImagePath = `/auto-diggers/${digger.name}.png`;

                    return (
                      <button
                        key={digger.id}
                        className={`digger-item ${canAfford && shouldShow ? 'affordable' : 'expensive'} ${!shouldShow ? 'locked' : ''} ${count > 0 ? 'owned' : ''}`}
                        onClick={() => shouldShow && buyAutoDigger(digger)}
                        disabled={!canAfford || !shouldShow}
                        title={shouldShow ? `+${formatDecimal(digger.depthPerSecond)}ft/s per digger` : '???'}
                      >
                        <div className="digger-image-container">
                          <img
                            src={diggerImagePath}
                            alt={shouldShow ? digger.name : '???'}
                            className={`digger-image ${!shouldShow ? 'locked-image' : ''}`}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          {!shouldShow && <div className="digger-locked-overlay">?</div>}
                        </div>
                        <div className="digger-info">
                          <div className="digger-name">
                            {shouldShow ? digger.name : '???'}
                          </div>
                          <div className="digger-stats">
                            +{shouldShow ? formatDecimal(digger.depthPerSecond) : '???'}ft/s
                          </div>
                          <div className="digger-cost">
                            {shouldShow ? `$${formatNumber(cost)}` : '???'}
                          </div>
                        </div>
                        <div className="digger-count">
                          {count > 0 && shouldShow ? count : ''}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              )}
        </div>
      </Modal>
      </div>
    </div>
  );
}

export default App;
