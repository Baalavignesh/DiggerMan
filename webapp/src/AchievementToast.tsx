import React, { useEffect, useState } from 'react';
import { Achievement } from './achievements';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 400); // Wait for fade out animation
  };

  if (!achievement) return null;

  return (
    <div className={`achievement-toast ${isVisible ? 'show' : ''}`}>
      <div className="toast-icon">
        <i className={`fas ${achievement.icon}`}></i>
      </div>
      <div className="toast-content">
        <div className="toast-title">🏆 ACHIEVEMENT UNLOCKED!</div>
        <div className="toast-achievement-name">{achievement.name}</div>
        <div className="toast-achievement-desc">{achievement.description}</div>
      </div>
      <button className="toast-close" onClick={handleClose} aria-label="Close">
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default AchievementToast;
