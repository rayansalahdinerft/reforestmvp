import { useEffect, useMemo, useState } from 'react';

type MascotPhase = 'idle' | 'cover' | 'peek';

type BalanceMascotProps = {
  isHidden: boolean;
};

const phrases = [
  "J'ai rien vu 👀",
  'Promis je regarde pas 🤫',
  'Secret bien gardé 🔒',
  'Oups… juste un petit oeil 😅',
];

const BalanceMascot = ({ isHidden }: BalanceMascotProps) => {
  const [phase, setPhase] = useState<MascotPhase>('idle');
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState(phrases[0]);

  const randomPhrase = useMemo(
    () => phrases[Math.floor(Math.random() * phrases.length)],
    [isHidden]
  );

  useEffect(() => {
    let coverTimer: ReturnType<typeof setTimeout> | null = null;
    let bubbleTimer: ReturnType<typeof setTimeout> | null = null;

    if (isHidden) {
      setPhase('cover');
      setBubbleText(randomPhrase);
      coverTimer = setTimeout(() => {
        setPhase('peek');
        setShowBubble(true);
      }, 550);

      bubbleTimer = setTimeout(() => {
        setShowBubble(false);
      }, 3800);
    } else {
      setPhase('idle');
      setShowBubble(false);
    }

    return () => {
      if (coverTimer) clearTimeout(coverTimer);
      if (bubbleTimer) clearTimeout(bubbleTimer);
    };
  }, [isHidden, randomPhrase]);

  return (
    <>
      <div
        className={`absolute z-20 pointer-events-none transition-all duration-700 ease-in-out ${
          phase === 'idle'
            ? 'w-[84px] h-[84px] -right-1 -bottom-1'
            : 'w-[102px] h-[102px] left-1/2 -translate-x-1/2 bottom-4'
        }`}
      >
        <div
          className={`relative w-full h-full ${
            phase === 'idle' ? 'animate-roam' : 'animate-guard'
          }`}
        >
          <div className="absolute inset-x-2 bottom-1 h-3 rounded-full bg-primary/30 blur-sm" />

          <div className="absolute left-1/2 -translate-x-1/2 top-2 w-[78%] h-[74%] rounded-full bg-primary border border-primary/50 shadow-lg">
            <div className="absolute -top-2 left-2 w-5 h-5 rounded-full bg-foreground" />
            <div className="absolute -top-2 right-2 w-5 h-5 rounded-full bg-foreground" />

            <div className="absolute top-[40%] left-[30%] w-2.5 h-2.5 rounded-full bg-foreground" />
            <div
              className={`absolute top-[40%] right-[30%] w-2.5 h-2.5 rounded-full bg-foreground transition-opacity duration-300 ${
                phase === 'cover' ? 'opacity-0' : 'opacity-100'
              }`}
            />

            <div
              className={`absolute top-[37%] right-[26%] w-5 h-5 rounded-full border border-border bg-background transition-all duration-300 ${
                phase === 'peek' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            >
              <div className="absolute top-[6px] left-[8px] w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
            </div>

            <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 w-7 h-5 rounded-full bg-muted border border-border" />
            <div className="absolute bottom-[27%] left-1/2 -translate-x-1/2 text-[10px] leading-none text-foreground/80">◡</div>

            <div
              className={`absolute left-[12%] bottom-[18%] w-6 h-6 rounded-full bg-foreground transition-all duration-500 ${
                phase === 'idle'
                  ? 'translate-y-1 rotate-0'
                  : phase === 'cover'
                    ? '-translate-y-5 translate-x-2 rotate-[-10deg]'
                    : '-translate-y-5 translate-x-1 rotate-[-14deg]'
              }`}
            />
            <div
              className={`absolute right-[12%] bottom-[18%] w-6 h-6 rounded-full bg-foreground transition-all duration-500 ${
                phase === 'idle'
                  ? 'translate-y-1 rotate-0'
                  : phase === 'cover'
                    ? '-translate-y-5 -translate-x-2 rotate-[10deg]'
                    : '-translate-y-6 translate-x-2 rotate-[20deg]'
              }`}
            />
          </div>
        </div>
      </div>

      <div
        className={`absolute left-1/2 -translate-x-1/2 bottom-[112px] z-30 transition-all duration-500 pointer-events-none ${
          showBubble ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-75'
        }`}
      >
        <div className="relative bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl px-3 py-1.5 shadow-lg">
          <p className="text-[10px] font-medium text-foreground whitespace-nowrap">{bubbleText}</p>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card/95 border-b border-r border-border/50 rotate-45" />
        </div>
      </div>
    </>
  );
};

export default BalanceMascot;
