import { useEffect, useMemo, useState } from 'react';
import pandaIdle from '@/assets/mascot/panda-idle.png';
import pandaPeek from '@/assets/mascot/panda-peek-eyes.png';

const phrases = [
  "J'ai rien vu 👀",
  'Promis je regarde pas 🤫',
  'Secret bien gardé 🔒',
  'Oups… juste un petit œil 😅',
];

type BalanceMascotProps = {
  isHidden: boolean;
};

const BalanceMascot = ({ isHidden }: BalanceMascotProps) => {
  const [showBubble, setShowBubble] = useState(false);

  const randomPhrase = useMemo(
    () => phrases[Math.floor(Math.random() * phrases.length)],
    [isHidden]
  );

  useEffect(() => {
    let bubbleTimer: ReturnType<typeof setTimeout> | null = null;

    if (isHidden) {
      setShowBubble(true);
      bubbleTimer = setTimeout(() => setShowBubble(false), 3500);
    } else {
      setShowBubble(false);
    }

    return () => {
      if (bubbleTimer) clearTimeout(bubbleTimer);
    };
  }, [isHidden]);

  return (
    <>
      {/* Speech bubble */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 bottom-[100px] z-30 transition-all duration-500 pointer-events-none ${
          showBubble ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-75'
        }`}
      >
        <div className="relative bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl px-3 py-1.5 shadow-lg">
          <p className="text-[10px] font-medium text-foreground whitespace-nowrap">{randomPhrase}</p>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card/95 border-b border-r border-border/50 rotate-45" />
        </div>
      </div>

      {/* Mascot image - fixed position, no movement */}
      <div className="absolute -right-2 -bottom-2 z-20 pointer-events-none w-[90px] h-[90px]">
        <img
          src={isHidden ? pandaPeek : pandaIdle}
          alt="Mascotte ReforestWallet"
          className="w-full h-full object-contain transition-opacity duration-300"
          draggable={false}
        />
      </div>
    </>
  );
};

export default BalanceMascot;
