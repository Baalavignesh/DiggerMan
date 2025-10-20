// Game configuration and data

export interface Tool {
  id: string;
  name: string;
  cost: number;
  bonusMultiplier: number; // Multiplies ore value (e.g., 2x means double money per ore)
  oreId: string; // Which ore this tool is made from
}

export interface AutoDigger {
  id: string;
  name: string;
  baseCost: number;
  depthPerSecond: number;
}

export interface Ore {
  id: string;
  name: string;
  rarity: 'basic' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  value: number; // Money value when sold
  spawnChance: number; // 0-1, chance to spawn per dig
}

export interface Biome {
  id: number;
  name: string;
  minDepth: number;
  maxDepth: number;
  backgroundColor: string;
  ores: string[]; // Ore IDs that spawn in this biome
}

// Ore definitions - Easy early game, brutal late game
export const ORES: { [key: string]: Ore } = {
  // Basic Tier - Good values to hook players early
  dirt: { id: 'dirt', name: 'Dirt', rarity: 'basic', value: 2, spawnChance: 0.95 },
  sandstone: { id: 'sandstone', name: 'Sandstone', rarity: 'basic', value: 5, spawnChance: 0.7 },

  // Common Tier - Generous early rewards
  stone: { id: 'stone', name: 'Stone', rarity: 'common', value: 12, spawnChance: 0.5 },
  gold: { id: 'gold', name: 'Gold', rarity: 'common', value: 30, spawnChance: 0.35 },

  // Uncommon Tier - Still rewarding
  emerald: { id: 'emerald', name: 'Emerald', rarity: 'uncommon', value: 80, spawnChance: 0.3 },
  amethyst: { id: 'amethyst', name: 'Amethyst', rarity: 'uncommon', value: 120, spawnChance: 0.25 },

  // Rare Tier - Good spawn chances, decent values (mid-game starts getting harder)
  sapphire: { id: 'sapphire', name: 'Sapphire', rarity: 'rare', value: 250, spawnChance: 0.15 },
  ruby: { id: 'ruby', name: 'Ruby', rarity: 'rare', value: 400, spawnChance: 0.12 },
  diamond: { id: 'diamond', name: 'Diamond', rarity: 'rare', value: 750, spawnChance: 0.1 },

  // Epic Tier - Late game becomes brutal (lower spawn rates)
  deep_stone: { id: 'deep_stone', name: 'Deep Stone', rarity: 'epic', value: 1200, spawnChance: 0.12 },
  deep_silver: { id: 'deep_silver', name: 'Deep Silver', rarity: 'epic', value: 2000, spawnChance: 0.3 },
  deep_gold: { id: 'deep_gold', name: 'Deep Gold', rarity: 'epic', value: 4000, spawnChance: 0.35 },
  obsidian: { id: 'obsidian', name: 'Obsidian', rarity: 'epic', value: 7000, spawnChance: 0.4 },
  deep_ruby: { id: 'deep_ruby', name: 'Deep Ruby', rarity: 'epic', value: 12000, spawnChance: 0.3 },

  // Legendary Tier - Very rare, high values
  magma: { id: 'magma', name: 'Magma', rarity: 'legendary', value: 25000, spawnChance: 0.25 },
  deep_diamond: { id: 'deep_diamond', name: 'Deep Diamond', rarity: 'legendary', value: 50000, spawnChance: 0.2 },

  // Mythic Tier - Extremely rare endgame
  infected_gold: { id: 'infected_gold', name: 'Infected Gold', rarity: 'mythic', value: 100000, spawnChance: 0.15 },
  deep_radioactive: { id: 'deep_radioactive', name: 'Deep Radioactive', rarity: 'mythic', value: 200000, spawnChance: 0.1 },
};

// Tools - Easy early game (cheap first few tools), brutal mid-late game
export const TOOLS: Tool[] = [
  { id: 'dirt_pickaxe', name: 'Dirt Pickaxe', cost: 0, bonusMultiplier: 1, oreId: 'dirt' },
  { id: 'sandstone_pickaxe', name: 'Sandstone Pickaxe', cost: 50, bonusMultiplier: 1.5, oreId: 'sandstone' },
  { id: 'stone_pickaxe', name: 'Stone Pickaxe', cost: 500, bonusMultiplier: 2, oreId: 'stone' },
  { id: 'gold_pickaxe', name: 'Gold Pickaxe', cost: 5000, bonusMultiplier: 2.5, oreId: 'gold' },
  { id: 'emerald_pickaxe', name: 'Emerald Pickaxe', cost: 75000, bonusMultiplier: 3.5, oreId: 'emerald' },
  { id: 'amethyst_pickaxe', name: 'Amethyst Pickaxe', cost: 1000000, bonusMultiplier: 5, oreId: 'amethyst' },
  { id: 'sapphire_pickaxe', name: 'Sapphire Pickaxe', cost: 20000000, bonusMultiplier: 8, oreId: 'sapphire' },
  { id: 'ruby_pickaxe', name: 'Ruby Pickaxe', cost: 500000000, bonusMultiplier: 12, oreId: 'ruby' },
  { id: 'diamond_pickaxe', name: 'Diamond Pickaxe', cost: 15000000000, bonusMultiplier: 20, oreId: 'diamond' },
  { id: 'obsidian_pickaxe', name: 'Obsidian Pickaxe', cost: 500000000000, bonusMultiplier: 35, oreId: 'obsidian' },
];

// Auto-Diggers - Accessible early game, expensive mid-game, brutal late game
export const AUTO_DIGGERS: AutoDigger[] = [
  { id: 'helper_mole', name: 'Helper Mole', baseCost: 100, depthPerSecond: 0.1 },
  { id: 'worm_brigade', name: 'Worm Brigade', baseCost: 1000, depthPerSecond: 0.3 },
  { id: 'steam_drill', name: 'Steam Drill', baseCost: 15000, depthPerSecond: 0.8 },
  { id: 'robotic_digger', name: 'Robotic Digger', baseCost: 250000, depthPerSecond: 2.5 },
  { id: 'excavator_bot', name: 'Excavator Bot', baseCost: 5000000, depthPerSecond: 8 },
  { id: 'drilling_rig', name: 'Drilling Rig', baseCost: 120000000, depthPerSecond: 30 },
  { id: 'nuclear_tunneler', name: 'Nuclear Tunneler', baseCost: 3500000000, depthPerSecond: 120 },
  { id: 'tectonic_disruptor', name: 'Tectonic Disruptor', baseCost: 100000000000, depthPerSecond: 500 },
  { id: 'core_melter', name: 'Core Melter', baseCost: 3500000000000, depthPerSecond: 2000 },
  { id: 'dimensional_drill', name: 'Dimensional Drill', baseCost: 150000000000000, depthPerSecond: 8000 },
];

// Biomes - Easy early progression to hook players, exponential late game difficulty
export const BIOMES: Biome[] = [
  { id: 1, name: 'Surface', minDepth: 0, maxDepth: 200, backgroundColor: '#8B7355', ores: ['dirt', 'sandstone'] },
  { id: 2, name: 'Shallow Mines', minDepth: 200, maxDepth: 800, backgroundColor: '#696969', ores: ['stone', 'gold'] },
  { id: 3, name: 'Underground', minDepth: 800, maxDepth: 3000, backgroundColor: '#556B2F', ores: ['stone', 'emerald'] },
  { id: 4, name: 'Crystal Caves', minDepth: 3000, maxDepth: 12000, backgroundColor: '#9370DB', ores: ['stone', 'amethyst'] },
  { id: 5, name: 'Gem Layer', minDepth: 12000, maxDepth: 50000, backgroundColor: '#4169E1', ores: ['stone', 'sapphire'] },
  { id: 6, name: 'Deep Caves', minDepth: 50000, maxDepth: 200000, backgroundColor: '#8B0000', ores: ['stone', 'ruby'] },
  { id: 7, name: 'Diamond Depths', minDepth: 200000, maxDepth: 1000000, backgroundColor: '#00CED1', ores: ['stone', 'diamond'] },
  { id: 8, name: 'Volcanic Zone', minDepth: 1000000, maxDepth: 5000000, backgroundColor: '#FF4500', ores: ['deep_stone', 'obsidian'] },
  { id: 9, name: 'Ancient Depths', minDepth: 5000000, maxDepth: 25000000, backgroundColor: '#DAA520', ores: ['deep_stone', 'deep_gold'] },
  { id: 10, name: 'Crimson Caverns', minDepth: 25000000, maxDepth: 125000000, backgroundColor: '#DC143C', ores: ['deep_stone', 'deep_ruby'] },
  { id: 11, name: 'Molten Core', minDepth: 125000000, maxDepth: 600000000, backgroundColor: '#FF6347', ores: ['deep_stone', 'magma'] },
  { id: 12, name: 'Crystal Core', minDepth: 600000000, maxDepth: 3000000000, backgroundColor: '#00FFFF', ores: ['deep_stone', 'deep_diamond'] },
  { id: 13, name: 'Corrupted Zone', minDepth: 3000000000, maxDepth: 15000000000, backgroundColor: '#9ACD32', ores: ['deep_stone', 'infected_gold'] },
  { id: 14, name: 'Radioactive Abyss', minDepth: 15000000000, maxDepth: Infinity, backgroundColor: '#00FF00', ores: ['deep_stone', 'deep_radioactive'] },
];

export function getBiome(depth: number): Biome {
  for (const biome of BIOMES) {
    if (depth >= biome.minDepth && depth < biome.maxDepth) {
      return biome;
    }
  }
  return BIOMES[BIOMES.length - 1];
}

// Auto-digger cost scaling - Much steeper scaling (1.25x per purchase instead of 1.15x)
export function getAutoDiggerCost(autoDigger: AutoDigger, currentCount: number): number {
  return Math.floor(autoDigger.baseCost * Math.pow(1.25, currentCount));
}
