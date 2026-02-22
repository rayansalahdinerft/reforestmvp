import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface SwapSuccessConfettiProps {
  trigger: boolean;
}

const SwapSuccessConfetti = ({ trigger }: SwapSuccessConfettiProps) => {
  useEffect(() => {
    if (!trigger) return;

    // Green/nature themed confetti burst
    const colors = ['#22c55e', '#4ade80', '#16a34a', '#86efac', '#a3e635', '#166534'];

    // First burst - center
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6, x: 0.5 },
      colors,
      shapes: ['circle', 'square'],
      gravity: 0.8,
      scalar: 1.2,
      ticks: 120,
    });

    // Second burst - slightly delayed, wider
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.5, x: 0.4 },
        colors,
        shapes: ['circle'],
        gravity: 0.6,
        scalar: 0.9,
        ticks: 100,
      });
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.5, x: 0.6 },
        colors,
        shapes: ['circle'],
        gravity: 0.6,
        scalar: 0.9,
        ticks: 100,
      });
    }, 200);
  }, [trigger]);

  return null;
};

export default SwapSuccessConfetti;
