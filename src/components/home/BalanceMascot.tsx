import { useState, useEffect, useMemo } from 'react';
import mascotImg from '@/assets/mascot/panda-roux.png';

const phrases = [
  "J'ai rien vu 👀",
  'Promis je regarde pas 🤫',
  'Secret bien gardé 🔒',
  'Oups… juste un petit œil 😅',
];

type BalanceMascotProps = { isHidden: boolean };

const BalanceMascot = ({ isHidden }: BalanceMascotProps) => {
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState(phrases[0]);
  const randomPhrase = useMemo(() => phrases[Math.floor(Math.random() * phrases.length)], [isHidden]);

  useEffect(() => {
    let t1: ReturnType<typeof setTimeout> | null = null;
    let t2: ReturnType<typeof setTimeout> | null = null;
    if (isHidden) {
      setBubbleText(randomPhrase);
      t1 = setTimeout(() => setShowBubble(true), 600);
      t2 = setTimeout(() => setShowBubble(false), 3800);
    } else {
      setShowBubble(false);
    }
    return () => { if (t1) clearTimeout(t1); if (t2) clearTimeout(t2); };
  }, [isHidden, randomPhrase]);

  return (
    <>
      {/* Mascot image */}
      <div className="absolute right-2 -bottom-2 z-20 pointer-events-none w-[80px] h-[80px]">
        <div className="relative w-full h-full">
          <img
            src={mascotImg}
            alt="Mascotte Panda Roux"
            className={`w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(34,255,102,0.3)] transition-transform duration-500 ${isHidden ? 'scale-105' : 'scale-100'}`}
          />
          {/* Paws covering eyes overlay */}
          <div
            className={`absolute inset-0 flex items-start justify-center pt-[18px] transition-all duration-500 ${
              isHidden ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Left paw */}
            <div
              className={`w-[22px] h-[18px] rounded-full bg-[#1a3d14] border border-[#22ff66]/40 shadow-[0_0_8px_rgba(34,255,102,0.3)] transition-all duration-500 ${
                isHidden ? 'translate-x-[2px] translate-y-0' : '-translate-x-4 -translate-y-3'
              }`}
            />
            {/* Right paw */}
            <div
              className={`w-[22px] h-[18px] rounded-full bg-[#1a3d14] border border-[#22ff66]/40 shadow-[0_0_8px_rgba(34,255,102,0.3)] transition-all duration-500 ${
                isHidden ? '-translate-x-[2px] translate-y-0' : 'translate-x-4 -translate-y-3'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Speech bubble */}
      <div
        className={`absolute right-[12px] bottom-[82px] z-30 transition-all duration-500 pointer-events-none ${
          showBubble ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-75'
        }`}
      >
        <div className="relative bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl px-3 py-1.5 shadow-lg">
          <p className="text-[10px] font-medium text-foreground whitespace-nowrap">{bubbleText}</p>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-card/95 border-b border-r border-border/50 rotate-45" />
        </div>
      </div>
    </>
  );
};

export default BalanceMascot;
