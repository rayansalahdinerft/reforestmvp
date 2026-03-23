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
      {/* Mascot — blended into the card's dark green gradient */}
      <div className="absolute right-0 bottom-0 z-20 pointer-events-none w-[90px] h-[90px]">
        <div className="relative w-full h-full">
          {/* Soft radial glow matching the dark background */}
          <div
            className="absolute inset-0 rounded-full blur-lg opacity-50"
            style={{ background: 'radial-gradient(circle, #0d1a0d 20%, transparent 70%)' }}
          />
          <img
            src={mascotImg}
            alt="Mascotte Panda Roux"
            className={`relative w-full h-full object-contain transition-transform duration-500 ${isHidden ? 'scale-[1.08]' : 'scale-100'}`}
            style={{
              filter: 'drop-shadow(0 2px 8px rgba(34,255,102,0.15))',
              mixBlendMode: 'normal',
            }}
          />
          {/* Paws covering eyes — animated */}
          <div
            className={`absolute inset-0 flex items-start justify-center transition-all duration-500 ${
              isHidden ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ paddingTop: '22%' }}
          >
            <div
              className={`w-[20px] h-[14px] rounded-[50%] transition-all duration-500 ${
                isHidden ? 'translate-x-[1px] translate-y-0' : '-translate-x-3 -translate-y-2'
              }`}
              style={{ background: 'linear-gradient(135deg, #0d1a0d, #1a2e1a)', boxShadow: '0 0 6px rgba(34,255,102,0.15), inset 0 1px 2px rgba(255,255,255,0.05)' }}
            />
            <div
              className={`w-[20px] h-[14px] rounded-[50%] transition-all duration-500 ${
                isHidden ? '-translate-x-[1px] translate-y-0' : 'translate-x-3 -translate-y-2'
              }`}
              style={{ background: 'linear-gradient(135deg, #0d1a0d, #1a2e1a)', boxShadow: '0 0 6px rgba(34,255,102,0.15), inset 0 1px 2px rgba(255,255,255,0.05)' }}
            />
          </div>
        </div>
      </div>

      {/* Speech bubble */}
      <div
        className={`absolute right-[8px] bottom-[80px] z-30 transition-all duration-500 pointer-events-none ${
          showBubble ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-75'
        }`}
      >
        <div
          className="relative rounded-2xl px-3 py-1.5 shadow-lg border border-primary/20"
          style={{ background: 'linear-gradient(135deg, rgba(15,43,10,0.95), rgba(26,61,20,0.95))', backdropFilter: 'blur(8px)' }}
        >
          <p className="text-[10px] font-medium text-foreground whitespace-nowrap">{bubbleText}</p>
          <div
            className="absolute -bottom-1.5 right-6 w-3 h-3 rotate-45 border-b border-r border-primary/20"
            style={{ background: 'rgba(26,61,20,0.95)' }}
          />
        </div>
      </div>
    </>
  );
};

export default BalanceMascot;
