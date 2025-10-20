import React from 'react';
import { ACHIEVEMENTS, checkAchievement, Achievement } from './achievements';
import Modal from './Modal';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: {
    depth: number;
    money: number;
    totalClicks: number;
    currentTool: string;
    oreInventory: { [key: string]: number };
    autoDiggers: { [key: string]: number };
    discoveredOres: Set<string>;
    discoveredBiomes: Set<number>;
  };
  unlockedAchievements: Set<string>;
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  gameState,
  unlockedAchievements
}) => {
  // Group achievements by category
  const categories = {
    depth: ACHIEVEMENTS.filter(a => a.category === 'depth'),
    money: ACHIEVEMENTS.filter(a => a.category === 'money'),
    mining: ACHIEVEMENTS.filter(a => a.category === 'mining'),
    tools: ACHIEVEMENTS.filter(a => a.category === 'tools'),
    diggers: ACHIEVEMENTS.filter(a => a.category === 'diggers'),
    ores: ACHIEVEMENTS.filter(a => a.category === 'ores'),
    biomes: ACHIEVEMENTS.filter(a => a.category === 'biomes'),
    special: ACHIEVEMENTS.filter(a => a.category === 'special'),
  };

  const categoryNames = {
    depth: 'Depth',
    money: 'Money',
    mining: 'Mining',
    tools: 'Tools',
    diggers: 'Auto-Diggers',
    ores: 'Ores',
    biomes: 'Biomes',
    special: 'Special',
  };

  const totalUnlocked = unlockedAchievements.size;
  const totalAchievements = ACHIEVEMENTS.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`ACHIEVEMENTS (${totalUnlocked}/${totalAchievements})`}
      icon="fa-trophy"
      className="achievements-modal"
    >
      <div className="achievements-container">
        {Object.entries(categories).map(([categoryKey, achievements]) => {
          const unlocked = achievements.filter(a => unlockedAchievements.has(a.id)).length;
          return (
            <div key={categoryKey} className="achievement-category">
              <h3 className="category-title">
                {categoryNames[categoryKey as keyof typeof categoryNames]} ({unlocked}/{achievements.length})
              </h3>
              <div className="achievement-list">
                {achievements.map(achievement => {
                  const isUnlocked = unlockedAchievements.has(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className={`achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`}
                    >
                      <div className="achievement-icon">
                        <i className={`fas ${achievement.icon}`}></i>
                      </div>
                      <div className="achievement-details">
                        <div className="achievement-name">
                          {isUnlocked ? achievement.name : '???'}
                        </div>
                        <div className="achievement-description">
                          {isUnlocked ? achievement.description : 'Hidden achievement'}
                        </div>
                      </div>
                      <div className="achievement-status">
                        {isUnlocked ? '✓' : '🔒'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default AchievementsModal;
