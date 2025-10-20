import React, { useState, useEffect } from 'react';

interface CharacterProps {
  isSmashing: boolean;
  onSmashComplete: () => void;
}

const Character: React.FC<CharacterProps> = ({ isSmashing, onSmashComplete }) => {
  const [frameIndex, setFrameIndex] = useState(0);

  // Animation frames for smashing (row 2: FRONT FACING - red bandana character)
  const idleFrame = { x: 0, y: 2 }; // Front facing idle

  // Slower animation for mobile, faster for desktop
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const frameDuration = isMobile ? 50 : 20; // 50ms for mobile, 20ms for desktop

  const smashFrames = [
    { x: 5, y: 2, duration: frameDuration }, // Wind up
    { x: 4, y: 2, duration: frameDuration }, // Swing back
    { x: 3, y: 2, duration: frameDuration }, // Swing forward
    { x: 1, y: 2, duration: frameDuration }, // Impact
    { x: 0, y: 2, duration: frameDuration }, // Return to idle
  ];

  useEffect(() => {
    if (!isSmashing) return;

    setFrameIndex(0);
    let timeoutIds: NodeJS.Timeout[] = [];

    const animateFrame = (index: number) => {
      if (index >= smashFrames.length) {
        onSmashComplete();
        return;
      }

      setFrameIndex(index);

      const timeoutId = setTimeout(() => {
        animateFrame(index + 1);
      }, smashFrames[index].duration);

      timeoutIds.push(timeoutId);
    };

    animateFrame(0);

    // Cleanup: cancel all pending timeouts if component unmounts or effect re-runs
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [isSmashing, onSmashComplete]);

  const currentFrame = isSmashing ? smashFrames[frameIndex] || idleFrame : idleFrame;

  // Each sprite is 128x128 in the source, scaled to 384x384 (3x) for display
  const spriteSize = 128;
  const scale = 3;
  const backgroundX = currentFrame.x * spriteSize * scale;
  const backgroundY = currentFrame.y * spriteSize * scale;

  return (
    <div
      className="character-sprite"
      style={{
        backgroundImage: 'url(/smash-tools/pickaxe.png)',
        backgroundPosition: `-${backgroundX}px -${backgroundY}px`,
      }}
    />
  );
};

export default Character;
