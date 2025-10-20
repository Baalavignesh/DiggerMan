import React, { useState, useEffect } from 'react';

interface CharacterProps {
  isSmashing: boolean;
  onSmashComplete: () => void;
}

const Character: React.FC<CharacterProps> = ({ isSmashing, onSmashComplete }) => {
  const [frameIndex, setFrameIndex] = useState(0);

  // Animation frames for smashing (row 2: FRONT FACING - red bandana character)
  const idleFrame = { x: 0, y: 2 }; // Front facing idle
  const smashFrames = [
    { x: 5, y: 2, duration: 30 }, // Wind up
    { x: 4, y: 2, duration: 30 }, // Swing back
    { x: 3, y: 2, duration: 30 }, // Swing forward
    { x: 1, y: 2, duration: 30 }, // Impact
    { x: 0, y: 2, duration: 30 }, // Return to idle
  ];

  useEffect(() => {
    if (isSmashing) {
      setFrameIndex(0);

      const animateFrame = (index: number) => {
        if (index >= smashFrames.length) {
          onSmashComplete();
          return;
        }

        setFrameIndex(index);

        setTimeout(() => {
          animateFrame(index + 1);
        }, smashFrames[index].duration);
      };

      animateFrame(0);
    }
  }, [isSmashing]);

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
