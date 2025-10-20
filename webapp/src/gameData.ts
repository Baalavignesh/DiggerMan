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

// Ore definitions with rarity and value
export const ORES: { [key: string]: Ore } = {
  // Basic Tier
  dirt: { id: 'dirt', name: 'Dirt', rarity: 'basic', value: 1, spawnChance: 0.95 },
  sandstone: { id: 'sandstone', name: 'Sandstone', rarity: 'basic', value: 2, spawnChance: 0.7 },

  // Common Tier
  stone: { id: 'stone', name: 'Stone', rarity: 'common', value: 10, spawnChance: 0.4 },
  gold: { id: 'gold', name: 'Gold', rarity: 'common', value: 25, spawnChance: 0.3 },

  // Uncommon Tier
  emerald: { id: 'emerald', name: 'Emerald', rarity: 'uncommon', value: 75, spawnChance: 0.25 },
  amethyst: { id: 'amethyst', name: 'Amethyst', rarity: 'uncommon', value: 100, spawnChance: 0.2 },

  // Rare Tier
  sapphire: { id: 'sapphire', name: 'Sapphire', rarity: 'rare', value: 250, spawnChance: 0.15 },
  ruby: { id: 'ruby', name: 'Ruby', rarity: 'rare', value: 400, spawnChance: 0.12 },
  diamond: { id: 'diamond', name: 'Diamond', rarity: 'rare', value: 750, spawnChance: 0.1 },

  // Epic Tier
  deep_stone: { id: 'deep_stone', name: 'Deep Stone', rarity: 'epic', value: 1500, spawnChance: 0.15 },
  deep_silver: { id: 'deep_silver', name: 'Deep Silver', rarity: 'epic', value: 2500, spawnChance: 0.5 },
  deep_gold: { id: 'deep_gold', name: 'Deep Gold', rarity: 'epic', value: 5000, spawnChance: 0.7 },
  obsidian: { id: 'obsidian', name: 'Obsidian', rarity: 'epic', value: 7500, spawnChance: 0.8 },
  deep_ruby: { id: 'deep_ruby', name: 'Deep Ruby', rarity: 'epic', value: 10000, spawnChance: 0.7 },

  // Legendary Tier
  magma: { id: 'magma', name: 'Magma', rarity: 'legendary', value: 25000, spawnChance: 0.6 },
  deep_diamond: { id: 'deep_diamond', name: 'Deep Diamond', rarity: 'legendary', value: 50000, spawnChance: 0.5 },

  // Mythic Tier
  infected_gold: { id: 'infected_gold', name: 'Infected Gold', rarity: 'mythic', value: 100000, spawnChance: 0.4 },
  deep_radioactive: { id: 'deep_radioactive', name: 'Deep Radioactive', rarity: 'mythic', value: 250000, spawnChance: 0.3 },
};

export const TOOLS: Tool[] = [
  { id: 'dirt_pickaxe', name: 'Dirt Pickaxe', cost: 0, bonusMultiplier: 1, oreId: 'dirt' },
  { id: 'sandstone_pickaxe', name: 'Sandstone Pickaxe', cost: 50, bonusMultiplier: 1.5, oreId: 'sandstone' },
  { id: 'stone_pickaxe', name: 'Stone Pickaxe', cost: 500, bonusMultiplier: 2, oreId: 'stone' },
  { id: 'gold_pickaxe', name: 'Gold Pickaxe', cost: 5000, bonusMultiplier: 3, oreId: 'gold' },
  { id: 'emerald_pickaxe', name: 'Emerald Pickaxe', cost: 50000, bonusMultiplier: 5, oreId: 'emerald' },
  { id: 'amethyst_pickaxe', name: 'Amethyst Pickaxe', cost: 500000, bonusMultiplier: 10, oreId: 'amethyst' },
  { id: 'sapphire_pickaxe', name: 'Sapphire Pickaxe', cost: 5000000, bonusMultiplier: 20, oreId: 'sapphire' },
  { id: 'ruby_pickaxe', name: 'Ruby Pickaxe', cost: 50000000, bonusMultiplier: 50, oreId: 'ruby' },
  { id: 'diamond_pickaxe', name: 'Diamond Pickaxe', cost: 500000000, bonusMultiplier: 100, oreId: 'diamond' },
  { id: 'obsidian_pickaxe', name: 'Obsidian Pickaxe', cost: 5000000000, bonusMultiplier: 250, oreId: 'obsidian' },
];

export const AUTO_DIGGERS: AutoDigger[] = [
  { id: 'helper_mole', name: 'Helper Mole', baseCost: 50, depthPerSecond: 0.05 },
  { id: 'worm_brigade', name: 'Worm Brigade', baseCost: 500, depthPerSecond: 0.2 },
  { id: 'steam_drill', name: 'Steam Drill', baseCost: 5000, depthPerSecond: 0.8 },
  { id: 'robotic_digger', name: 'Robotic Digger', baseCost: 50000, depthPerSecond: 4 },
  { id: 'excavator_bot', name: 'Excavator Bot', baseCost: 500000, depthPerSecond: 20 },
  { id: 'drilling_rig', name: 'Drilling Rig', baseCost: 5000000, depthPerSecond: 100 },
  { id: 'nuclear_tunneler', name: 'Nuclear Tunneler', baseCost: 50000000, depthPerSecond: 500 },
  { id: 'tectonic_disruptor', name: 'Tectonic Disruptor', baseCost: 500000000, depthPerSecond: 2500 },
  { id: 'core_melter', name: 'Core Melter', baseCost: 5000000000, depthPerSecond: 12500 },
  { id: 'dimensional_drill', name: 'Dimensional Drill', baseCost: 50000000000, depthPerSecond: 62500 },
];

export const BIOMES: Biome[] = [
  { id: 1, name: 'Surface', minDepth: 0, maxDepth: 100, backgroundColor: '#8B7355', ores: ['dirt', 'sandstone'] },
  { id: 2, name: 'Shallow Mines', minDepth: 100, maxDepth: 250, backgroundColor: '#696969', ores: ['stone', 'gold'] },
  { id: 3, name: 'Underground', minDepth: 250, maxDepth: 500, backgroundColor: '#556B2F', ores: ['stone', 'emerald'] },
  { id: 4, name: 'Crystal Caves', minDepth: 500, maxDepth: 1000, backgroundColor: '#9370DB', ores: ['stone', 'amethyst'] },
  { id: 5, name: 'Gem Layer', minDepth: 1000, maxDepth: 2000, backgroundColor: '#4169E1', ores: ['stone', 'sapphire'] },
  { id: 6, name: 'Deep Caves', minDepth: 2000, maxDepth: 4000, backgroundColor: '#8B0000', ores: ['stone', 'ruby'] },
  { id: 7, name: 'Diamond Depths', minDepth: 4000, maxDepth: 8000, backgroundColor: '#00CED1', ores: ['stone', 'diamond'] },
  { id: 8, name: 'Volcanic Zone', minDepth: 8000, maxDepth: 15000, backgroundColor: '#FF4500', ores: ['deep_stone', 'obsidian'] },
  { id: 9, name: 'Ancient Depths', minDepth: 15000, maxDepth: 25000, backgroundColor: '#DAA520', ores: ['deep_stone', 'deep_gold'] },
  { id: 10, name: 'Crimson Caverns', minDepth: 25000, maxDepth: 40000, backgroundColor: '#DC143C', ores: ['deep_stone', 'deep_ruby'] },
  { id: 11, name: 'Molten Core', minDepth: 40000, maxDepth: 60000, backgroundColor: '#FF6347', ores: ['deep_stone', 'magma'] },
  { id: 12, name: 'Crystal Core', minDepth: 60000, maxDepth: 100000, backgroundColor: '#00FFFF', ores: ['deep_stone', 'deep_diamond'] },
  { id: 13, name: 'Corrupted Zone', minDepth: 100000, maxDepth: 150000, backgroundColor: '#9ACD32', ores: ['deep_stone', 'infected_gold'] },
  { id: 14, name: 'Radioactive Abyss', minDepth: 150000, maxDepth: Infinity, backgroundColor: '#00FF00', ores: ['deep_stone', 'deep_radioactive'] },
];

export function getBiome(depth: number): Biome {
  for (const biome of BIOMES) {
    if (depth >= biome.minDepth && depth < biome.maxDepth) {
      return biome;
    }
  }
  return BIOMES[BIOMES.length - 1];
}

export function getAutoDiggerCost(autoDigger: AutoDigger, currentCount: number): number {
  return Math.floor(autoDigger.baseCost * Math.pow(1.15, currentCount));
}
