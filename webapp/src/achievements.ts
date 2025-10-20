// Achievement system for TheDigger

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'depth' | 'money' | 'mining' | 'tools' | 'diggers' | 'ores' | 'biomes' | 'special';
  requirement: {
    type: 'depth' | 'money' | 'clicks' | 'oreCount' | 'specificOre' | 'tool' | 'digger' | 'biome' | 'totalOres' | 'diggerCount';
    value: number | string;
  };
  icon: string; // FontAwesome icon class
}

export const ACHIEVEMENTS: Achievement[] = [
  // Depth Achievements (10)
  { id: 'depth_100', name: 'Surface Explorer', description: 'Reach 100 feet depth', category: 'depth', requirement: { type: 'depth', value: 100 }, icon: 'fa-arrow-down' },
  { id: 'depth_500', name: 'Going Deeper', description: 'Reach 500 feet depth', category: 'depth', requirement: { type: 'depth', value: 500 }, icon: 'fa-arrow-down' },
  { id: 'depth_1k', name: 'Underground Explorer', description: 'Reach 1,000 feet depth', category: 'depth', requirement: { type: 'depth', value: 1000 }, icon: 'fa-arrow-down' },
  { id: 'depth_5k', name: 'Deep Diver', description: 'Reach 5,000 feet depth', category: 'depth', requirement: { type: 'depth', value: 5000 }, icon: 'fa-arrow-down' },
  { id: 'depth_10k', name: 'Cave Master', description: 'Reach 10,000 feet depth', category: 'depth', requirement: { type: 'depth', value: 10000 }, icon: 'fa-arrow-down' },
  { id: 'depth_50k', name: 'Abyss Walker', description: 'Reach 50,000 feet depth', category: 'depth', requirement: { type: 'depth', value: 50000 }, icon: 'fa-arrow-down' },
  { id: 'depth_100k', name: 'Deep Earth Pioneer', description: 'Reach 100,000 feet depth', category: 'depth', requirement: { type: 'depth', value: 100000 }, icon: 'fa-arrow-down' },
  { id: 'depth_1m', name: 'Million Feet Club', description: 'Reach 1,000,000 feet depth', category: 'depth', requirement: { type: 'depth', value: 1000000 }, icon: 'fa-trophy' },
  { id: 'depth_10m', name: 'Core Seeker', description: 'Reach 10,000,000 feet depth', category: 'depth', requirement: { type: 'depth', value: 10000000 }, icon: 'fa-trophy' },
  { id: 'depth_1b', name: 'Dimension Breaker', description: 'Reach 1,000,000,000 feet depth', category: 'depth', requirement: { type: 'depth', value: 1000000000 }, icon: 'fa-crown' },

  // Money Achievements (15)
  { id: 'money_100', name: 'First Earnings', description: 'Earn $100', category: 'money', requirement: { type: 'money', value: 100 }, icon: 'fa-coins' },
  { id: 'money_1k', name: 'Thousand Club', description: 'Earn $1,000', category: 'money', requirement: { type: 'money', value: 1000 }, icon: 'fa-coins' },
  { id: 'money_10k', name: 'Rich Digger', description: 'Earn $10,000', category: 'money', requirement: { type: 'money', value: 10000 }, icon: 'fa-coins' },
  { id: 'money_100k', name: 'Fortune Seeker', description: 'Earn $100,000', category: 'money', requirement: { type: 'money', value: 100000 }, icon: 'fa-coins' },
  { id: 'money_1m', name: 'Millionaire', description: 'Earn $1,000,000', category: 'money', requirement: { type: 'money', value: 1000000 }, icon: 'fa-dollar-sign' },
  { id: 'money_10m', name: 'Tycoon', description: 'Earn $10,000,000', category: 'money', requirement: { type: 'money', value: 10000000 }, icon: 'fa-dollar-sign' },
  { id: 'money_100m', name: 'Mogul', description: 'Earn $100,000,000', category: 'money', requirement: { type: 'money', value: 100000000 }, icon: 'fa-dollar-sign' },
  { id: 'money_1b', name: 'Billionaire', description: 'Earn $1,000,000,000', category: 'money', requirement: { type: 'money', value: 1000000000 }, icon: 'fa-gem' },
  { id: 'money_10b', name: 'Wealth Beyond Measure', description: 'Earn $10,000,000,000', category: 'money', requirement: { type: 'money', value: 10000000000 }, icon: 'fa-gem' },
  { id: 'money_100b', name: 'Infinite Riches', description: 'Earn $100,000,000,000', category: 'money', requirement: { type: 'money', value: 100000000000 }, icon: 'fa-crown' },
  { id: 'money_1t', name: 'Trillionaire', description: 'Earn $1,000,000,000,000', category: 'money', requirement: { type: 'money', value: 1000000000000 }, icon: 'fa-crown' },
  { id: 'money_10t', name: 'Economic Overlord', description: 'Earn $10,000,000,000,000', category: 'money', requirement: { type: 'money', value: 10000000000000 }, icon: 'fa-crown' },
  { id: 'money_100t', name: 'Master of Wealth', description: 'Earn $100,000,000,000,000', category: 'money', requirement: { type: 'money', value: 100000000000000 }, icon: 'fa-star' },
  { id: 'money_1q', name: 'Quadrillionaire', description: 'Earn $1,000,000,000,000,000', category: 'money', requirement: { type: 'money', value: 1000000000000000 }, icon: 'fa-star' },
  { id: 'money_beyond', name: 'Beyond Comprehension', description: 'Earn more money than can be displayed', category: 'money', requirement: { type: 'money', value: 1000000000000000000 }, icon: 'fa-infinity' },

  // Mining (Clicks) Achievements (10)
  { id: 'clicks_10', name: 'First Swing', description: 'Mine 10 ores', category: 'mining', requirement: { type: 'clicks', value: 10 }, icon: 'fa-hammer' },
  { id: 'clicks_100', name: 'Dedicated Miner', description: 'Mine 100 ores', category: 'mining', requirement: { type: 'clicks', value: 100 }, icon: 'fa-hammer' },
  { id: 'clicks_500', name: 'Hard Worker', description: 'Mine 500 ores', category: 'mining', requirement: { type: 'clicks', value: 500 }, icon: 'fa-hammer' },
  { id: 'clicks_1k', name: 'Tireless Digger', description: 'Mine 1,000 ores', category: 'mining', requirement: { type: 'clicks', value: 1000 }, icon: 'fa-hammer' },
  { id: 'clicks_5k', name: 'Mining Machine', description: 'Mine 5,000 ores', category: 'mining', requirement: { type: 'clicks', value: 5000 }, icon: 'fa-gavel' },
  { id: 'clicks_10k', name: 'Click Master', description: 'Mine 10,000 ores', category: 'mining', requirement: { type: 'clicks', value: 10000 }, icon: 'fa-gavel' },
  { id: 'clicks_50k', name: 'Unstoppable Force', description: 'Mine 50,000 ores', category: 'mining', requirement: { type: 'clicks', value: 50000 }, icon: 'fa-bolt' },
  { id: 'clicks_100k', name: 'Century of Clicks', description: 'Mine 100,000 ores', category: 'mining', requirement: { type: 'clicks', value: 100000 }, icon: 'fa-bolt' },
  { id: 'clicks_500k', name: 'Legendary Miner', description: 'Mine 500,000 ores', category: 'mining', requirement: { type: 'clicks', value: 500000 }, icon: 'fa-trophy' },
  { id: 'clicks_1m', name: 'Million Click Club', description: 'Mine 1,000,000 ores', category: 'mining', requirement: { type: 'clicks', value: 1000000 }, icon: 'fa-crown' },

  // Tool Achievements (10)
  { id: 'tool_sandstone', name: 'Better Tools', description: 'Unlock Sandstone Pickaxe', category: 'tools', requirement: { type: 'tool', value: 'sandstone_pickaxe' }, icon: 'fa-tools' },
  { id: 'tool_stone', name: 'Stone Age', description: 'Unlock Stone Pickaxe', category: 'tools', requirement: { type: 'tool', value: 'stone_pickaxe' }, icon: 'fa-tools' },
  { id: 'tool_gold', name: 'Golden Touch', description: 'Unlock Gold Pickaxe', category: 'tools', requirement: { type: 'tool', value: 'gold_pickaxe' }, icon: 'fa-tools' },
  { id: 'tool_emerald', name: 'Precious Tools', description: 'Unlock Emerald Pickaxe', category: 'tools', requirement: { type: 'tool', value: 'emerald_pickaxe' }, icon: 'fa-gem' },
  { id: 'tool_amethyst', name: 'Crystal Miner', description: 'Unlock Amethyst Pickaxe', category: 'tools', requirement: { type: 'tool', value: 'amethyst_pickaxe' }, icon: 'fa-gem' },
  { id: 'tool_sapphire', name: 'Blue Brilliance', description: 'Unlock Sapphire Pickaxe', category: 'tools', requirement: { type: 'tool', value: 'sapphire_pickaxe' }, icon: 'fa-gem' },
  { id: 'tool_ruby', name: 'Red Riches', description: 'Unlock Ruby Pickaxe', category: 'tools', requirement: { type: 'tool', value: 'ruby_pickaxe' }, icon: 'fa-gem' },
  { id: 'tool_diamond', name: 'Diamond Standard', description: 'Unlock Diamond Pickaxe', category: 'tools', requirement: { type: 'tool', value: 'diamond_pickaxe' }, icon: 'fa-diamond' },
  { id: 'tool_obsidian', name: 'Volcanic Power', description: 'Unlock Obsidian Pickaxe', category: 'tools', requirement: { type: 'tool', value: 'obsidian_pickaxe' }, icon: 'fa-fire' },
  { id: 'tool_master', name: 'Tool Master', description: 'Unlock all tools', category: 'tools', requirement: { type: 'tool', value: 'obsidian_pickaxe' }, icon: 'fa-crown' },

  // Auto-Digger Achievements (10)
  { id: 'digger_first', name: 'Automation Begins', description: 'Purchase your first auto-digger', category: 'diggers', requirement: { type: 'digger', value: 'helper_mole' }, icon: 'fa-robot' },
  { id: 'digger_worm', name: 'Worm Army', description: 'Unlock Worm Brigade', category: 'diggers', requirement: { type: 'digger', value: 'worm_brigade' }, icon: 'fa-robot' },
  { id: 'digger_steam', name: 'Industrial Revolution', description: 'Unlock Steam Drill', category: 'diggers', requirement: { type: 'digger', value: 'steam_drill' }, icon: 'fa-cog' },
  { id: 'digger_robotic', name: 'Rise of the Machines', description: 'Unlock Robotic Digger', category: 'diggers', requirement: { type: 'digger', value: 'robotic_digger' }, icon: 'fa-robot' },
  { id: 'digger_excavator', name: 'Heavy Machinery', description: 'Unlock Excavator Bot', category: 'diggers', requirement: { type: 'digger', value: 'excavator_bot' }, icon: 'fa-robot' },
  { id: 'digger_rig', name: 'Drilling Deep', description: 'Unlock Drilling Rig', category: 'diggers', requirement: { type: 'digger', value: 'drilling_rig' }, icon: 'fa-industry' },
  { id: 'digger_nuclear', name: 'Nuclear Age', description: 'Unlock Nuclear Tunneler', category: 'diggers', requirement: { type: 'digger', value: 'nuclear_tunneler' }, icon: 'fa-radiation' },
  { id: 'digger_tectonic', name: 'Earth Shaker', description: 'Unlock Tectonic Disruptor', category: 'diggers', requirement: { type: 'digger', value: 'tectonic_disruptor' }, icon: 'fa-skull' },
  { id: 'digger_core', name: 'Core Breaker', description: 'Unlock Core Melter', category: 'diggers', requirement: { type: 'digger', value: 'core_melter' }, icon: 'fa-fire' },
  { id: 'digger_dimensional', name: 'Reality Bender', description: 'Unlock Dimensional Drill', category: 'diggers', requirement: { type: 'digger', value: 'dimensional_drill' }, icon: 'fa-portal' },

  // Digger Count Achievements (5)
  { id: 'diggers_10', name: 'Small Fleet', description: 'Own 10 total auto-diggers', category: 'diggers', requirement: { type: 'diggerCount', value: 10 }, icon: 'fa-users' },
  { id: 'diggers_50', name: 'Army of Machines', description: 'Own 50 total auto-diggers', category: 'diggers', requirement: { type: 'diggerCount', value: 50 }, icon: 'fa-users' },
  { id: 'diggers_100', name: 'Century of Automation', description: 'Own 100 total auto-diggers', category: 'diggers', requirement: { type: 'diggerCount', value: 100 }, icon: 'fa-users' },
  { id: 'diggers_500', name: 'Industrial Empire', description: 'Own 500 total auto-diggers', category: 'diggers', requirement: { type: 'diggerCount', value: 500 }, icon: 'fa-crown' },
  { id: 'diggers_1000', name: 'Automation Overlord', description: 'Own 1,000 total auto-diggers', category: 'diggers', requirement: { type: 'diggerCount', value: 1000 }, icon: 'fa-star' },

  // Ore Collection Achievements (10)
  { id: 'ore_gold_10', name: 'Gold Rush', description: 'Collect 10 Gold ores', category: 'ores', requirement: { type: 'specificOre', value: 'gold:10' }, icon: 'fa-coins' },
  { id: 'ore_emerald_10', name: 'Emerald Collector', description: 'Collect 10 Emerald ores', category: 'ores', requirement: { type: 'specificOre', value: 'emerald:10' }, icon: 'fa-gem' },
  { id: 'ore_diamond_10', name: 'Diamond Hunter', description: 'Collect 10 Diamond ores', category: 'ores', requirement: { type: 'specificOre', value: 'diamond:10' }, icon: 'fa-diamond' },
  { id: 'ore_obsidian_10', name: 'Volcanic Harvest', description: 'Collect 10 Obsidian ores', category: 'ores', requirement: { type: 'specificOre', value: 'obsidian:10' }, icon: 'fa-fire' },
  { id: 'ore_magma_10', name: 'Magma Collector', description: 'Collect 10 Magma ores', category: 'ores', requirement: { type: 'specificOre', value: 'magma:10' }, icon: 'fa-fire' },
  { id: 'ore_radioactive_1', name: 'Radioactive Discovery', description: 'Collect 1 Deep Radioactive ore', category: 'ores', requirement: { type: 'specificOre', value: 'deep_radioactive:1' }, icon: 'fa-radiation' },
  { id: 'ore_total_100', name: 'Ore Hoarder', description: 'Collect 100 total ores', category: 'ores', requirement: { type: 'totalOres', value: 100 }, icon: 'fa-box' },
  { id: 'ore_total_1k', name: 'Ore Stockpile', description: 'Collect 1,000 total ores', category: 'ores', requirement: { type: 'totalOres', value: 1000 }, icon: 'fa-box' },
  { id: 'ore_total_10k', name: 'Ore Warehouse', description: 'Collect 10,000 total ores', category: 'ores', requirement: { type: 'totalOres', value: 10000 }, icon: 'fa-warehouse' },
  { id: 'ore_all', name: 'Master Collector', description: 'Discover all ore types', category: 'ores', requirement: { type: 'oreCount', value: 18 }, icon: 'fa-crown' },

  // Biome Achievements (14)
  { id: 'biome_2', name: 'Underground Arrival', description: 'Reach Shallow Mines', category: 'biomes', requirement: { type: 'biome', value: 2 }, icon: 'fa-mountain' },
  { id: 'biome_3', name: 'Deep Explorer', description: 'Reach Underground', category: 'biomes', requirement: { type: 'biome', value: 3 }, icon: 'fa-mountain' },
  { id: 'biome_4', name: 'Crystal Gazer', description: 'Reach Crystal Caves', category: 'biomes', requirement: { type: 'biome', value: 4 }, icon: 'fa-gem' },
  { id: 'biome_5', name: 'Gem Seeker', description: 'Reach Gem Layer', category: 'biomes', requirement: { type: 'biome', value: 5 }, icon: 'fa-gem' },
  { id: 'biome_6', name: 'Deep Diver', description: 'Reach Deep Caves', category: 'biomes', requirement: { type: 'biome', value: 6 }, icon: 'fa-mountain' },
  { id: 'biome_7', name: 'Diamond Hunter', description: 'Reach Diamond Depths', category: 'biomes', requirement: { type: 'biome', value: 7 }, icon: 'fa-diamond' },
  { id: 'biome_8', name: 'Volcano Walker', description: 'Reach Volcanic Zone', category: 'biomes', requirement: { type: 'biome', value: 8 }, icon: 'fa-fire' },
  { id: 'biome_9', name: 'Ancient Explorer', description: 'Reach Ancient Depths', category: 'biomes', requirement: { type: 'biome', value: 9 }, icon: 'fa-scroll' },
  { id: 'biome_10', name: 'Crimson Wanderer', description: 'Reach Crimson Caverns', category: 'biomes', requirement: { type: 'biome', value: 10 }, icon: 'fa-droplet' },
  { id: 'biome_11', name: 'Core Explorer', description: 'Reach Molten Core', category: 'biomes', requirement: { type: 'biome', value: 11 }, icon: 'fa-fire-flame-curved' },
  { id: 'biome_12', name: 'Crystal Core Master', description: 'Reach Crystal Core', category: 'biomes', requirement: { type: 'biome', value: 12 }, icon: 'fa-snowflake' },
  { id: 'biome_13', name: 'Corruption Survivor', description: 'Reach Corrupted Zone', category: 'biomes', requirement: { type: 'biome', value: 13 }, icon: 'fa-skull-crossbones' },
  { id: 'biome_14', name: 'Abyss Conqueror', description: 'Reach Radioactive Abyss', category: 'biomes', requirement: { type: 'biome', value: 14 }, icon: 'fa-radiation' },
  { id: 'biome_all', name: 'World Explorer', description: 'Discover all biomes', category: 'biomes', requirement: { type: 'biome', value: 14 }, icon: 'fa-globe' },

  // Special/Hidden Achievements (6)
  { id: 'special_reset', name: 'Fresh Start', description: 'Reset your game progress', category: 'special', requirement: { type: 'depth', value: -1 }, icon: 'fa-redo' },
  { id: 'special_idle_1h', name: 'Idle Tycoon', description: 'Let auto-diggers work for 1 hour', category: 'special', requirement: { type: 'depth', value: -2 }, icon: 'fa-clock' },
  { id: 'special_no_click_1k', name: 'Automation Master', description: 'Reach 1,000 feet using only auto-diggers', category: 'special', requirement: { type: 'depth', value: -3 }, icon: 'fa-magic' },
  { id: 'special_music_off', name: 'Silent Digger', description: 'Turn off music', category: 'special', requirement: { type: 'depth', value: -4 }, icon: 'fa-volume-mute' },
  { id: 'special_sound_off', name: 'Quiet Worker', description: 'Turn off sound effects', category: 'special', requirement: { type: 'depth', value: -5 }, icon: 'fa-volume-off' },
  { id: 'special_speed_demon', name: 'Speed Demon', description: 'Mine 100 ores in 30 seconds', category: 'special', requirement: { type: 'depth', value: -6 }, icon: 'fa-bolt' },
];

// Helper function to check if achievement is unlocked
export function checkAchievement(achievement: Achievement, gameData: {
  depth: number;
  money: number;
  totalClicks: number;
  currentTool: string;
  oreInventory: { [key: string]: number };
  autoDiggers: { [key: string]: number };
  discoveredOres: Set<string>;
  discoveredBiomes: Set<number>;
}): boolean {
  const { requirement } = achievement;

  switch (requirement.type) {
    case 'depth':
      if (typeof requirement.value === 'number' && requirement.value > 0) {
        return gameData.depth >= requirement.value;
      }
      return false;

    case 'money':
      if (typeof requirement.value === 'number') {
        return gameData.money >= requirement.value;
      }
      return false;

    case 'clicks':
      if (typeof requirement.value === 'number') {
        return gameData.totalClicks >= requirement.value;
      }
      return false;

    case 'tool':
      if (typeof requirement.value === 'string') {
        return gameData.currentTool === requirement.value ||
               TOOLS_ORDER.indexOf(gameData.currentTool) >= TOOLS_ORDER.indexOf(requirement.value);
      }
      return false;

    case 'digger':
      if (typeof requirement.value === 'string') {
        return (gameData.autoDiggers[requirement.value] || 0) > 0;
      }
      return false;

    case 'diggerCount':
      if (typeof requirement.value === 'number') {
        const totalDiggers = Object.values(gameData.autoDiggers).reduce((sum, count) => sum + count, 0);
        return totalDiggers >= requirement.value;
      }
      return false;

    case 'specificOre':
      if (typeof requirement.value === 'string') {
        const [oreId, countStr] = requirement.value.split(':');
        const requiredCount = parseInt(countStr);
        return (gameData.oreInventory[oreId] || 0) >= requiredCount;
      }
      return false;

    case 'totalOres':
      if (typeof requirement.value === 'number') {
        const totalOres = Object.values(gameData.oreInventory).reduce((sum, count) => sum + count, 0);
        return totalOres >= requirement.value;
      }
      return false;

    case 'oreCount':
      if (typeof requirement.value === 'number') {
        return gameData.discoveredOres.size >= requirement.value;
      }
      return false;

    case 'biome':
      if (typeof requirement.value === 'number') {
        return gameData.discoveredBiomes.has(requirement.value);
      }
      return false;

    default:
      return false;
  }
}

// Tool order for achievement checking
const TOOLS_ORDER = [
  'dirt_pickaxe',
  'sandstone_pickaxe',
  'stone_pickaxe',
  'gold_pickaxe',
  'emerald_pickaxe',
  'amethyst_pickaxe',
  'sapphire_pickaxe',
  'ruby_pickaxe',
  'diamond_pickaxe',
  'obsidian_pickaxe',
];
