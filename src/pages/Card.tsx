import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import { Wallet, CreditCard, ShieldCheck, ArrowRight, Banknote, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import leafIcon from '@/assets/leaf-icon.png';

const featureKeys = ['wallet', 'buysell', 'card'] as const;

const featureDetails: Record<string, { title: string; description: string; points: string[] }> = {
  wallet: {
    title: 'Fiat Wallet',
    description: 'A dedicated space to manage your money like a real account.',
    points: [
      'Deposit fiat instantly',
      'Withdraw to your bank account without fees',
      'Track your balance in real time',
      'Seamless integration with crypto',
    ],
  },
  buysell: {
    title: 'Buy & Sell Crypto',
    description: 'Purchase or convert crypto instantly from your fiat wallet.',
    points: [
      'Instant crypto purchase',
      'Quick sell to fiat',
      'No hidden fees',
      'Supported tokens growing regularly',
    ],
  },
  card: {
    title: 'Reforest Card',
    description: 'The card that lets you spend your crypto in real life.',
    points: [
      'Spend crypto anywhere Visa is accepted',
      'Use your wallet as a complete account',
      'Premium metal card',
      'Simple, smooth, and useful',
    ],
  },
};

const Card = () => {
  const [activeDetail, setActiveDetail] = useState<string | null>(null);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');

  const activeIndex = activeDetail ? featureKeys.indexOf(activeDetail as any) : -1;
  const detail = activeDetail ? featureDetails[activeDetail] : null;

  const goTo = (key: string, direction: 'left' | 'right') => {
    setSlideDirection(direction);
    setActiveDetail(key);
  };

  const goPrev = () => {
    if (activeIndex > 0) goTo(featureKeys[activeIndex - 1], 'right');
  };
  const goNext = () => {
    if (activeIndex < featureKeys.length - 1) goTo(featureKeys[activeIndex + 1], 'left');
  };

  // Swipe support
  const touchStart = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0) goPrev();
      else goNext();
    }
    touchStart.current = null;
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Header />

      {/* Detail overlay with swipe */}
      {detail && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl animate-fade-in"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="max-w-sm mx-auto px-6 pt-6">
            <button
              onClick={() => setActiveDetail(null)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>

            {/* Page indicator */}
            <div className="flex items-center justify-center gap-1.5 mb-6">
              {featureKeys.map((key, i) => (
                <button
                  key={key}
                  onClick={() => goTo(key, i < activeIndex ? 'right' : 'left')}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    key === activeDetail ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/20'
                  }`}
                />
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-3">{detail.title}</h2>
            <p className="text-muted-foreground text-sm mb-8">{detail.description}</p>

            <div className="space-y-3">
              {detail.points.map((point, i) => (
                <div
                  key={point}
                  className="glass-subtle rounded-2xl p-4 flex items-center gap-3 animate-fade-in"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm">{point}</span>
                </div>
              ))}
            </div>

            {/* Nav arrows */}
            <div className="flex items-center justify-between mt-10">
              <button
                onClick={goPrev}
                disabled={activeIndex === 0}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                {activeIndex > 0 && featureDetails[featureKeys[activeIndex - 1]].title}
              </button>
              <button
                onClick={goNext}
                disabled={activeIndex === featureKeys.length - 1}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"
              >
                {activeIndex < featureKeys.length - 1 && featureDetails[featureKeys[activeIndex + 1]].title}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground/40 text-[11px] mt-8 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-primary/30" />
              <span>Coming soon — KYC required.</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/6 blur-[100px] pointer-events-none" />

        <div className="max-w-lg mx-auto px-6 pt-14 pb-4 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold leading-[1.08] tracking-tight mb-4 animate-hero-reveal">
            Crypto becomes
            <br />
            more <span className="gradient-text">simple.</span>
          </h1>

          <p className="text-muted-foreground text-sm max-w-[260px] mx-auto mb-8 animate-glow-reveal">
            All your transactions with Reforest Card.
          </p>
        </div>

        {/* Black card with white text */}
        <div className="max-w-xs mx-auto px-6 pb-6 relative z-10">
          <div className="animate-hero-reveal" style={{ animationDelay: '0.2s' }}>
            <div
              className="relative aspect-[1.586/1] rounded-[20px] overflow-hidden"
              style={{
                transform: 'perspective(800px) rotateY(-8deg) rotateX(4deg) rotate(-3deg)',
                background: 'linear-gradient(145deg, hsl(0 0% 12%), hsl(0 0% 6%) 40%, hsl(0 0% 10%) 70%, hsl(0 0% 5%))',
                boxShadow: '0 30px 60px -15px hsl(0 0% 0% / 0.7), 0 0 0 1px hsl(0 0% 20% / 0.3), inset 0 1px 0 0 hsl(0 0% 22% / 0.3)',
              }}
            >
              {/* Subtle shimmer */}
              <div className="absolute inset-0 opacity-[0.07]"
                   style={{
                     background: 'linear-gradient(135deg, transparent 25%, hsl(0 0% 100% / 0.3) 45%, transparent 55%)',
                   }} />

              {/* ReforestWallet text logo — top left */}
              <div className="absolute top-5 left-5">
                <span className="text-[11px] font-bold tracking-tight leading-none">
                  <span className="text-foreground/90">Reforest</span>
                  <span className="text-primary/90">Wallet</span>
                </span>
              </div>

              {/* Card name — bottom left */}
              <div className="absolute bottom-5 left-5">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/50">
                  Reforest Card
                </span>
              </div>

              {/* DEBIT + VISA — white — bottom right */}
              <div className="absolute bottom-4 right-5 text-right">
                <p className="text-[8px] font-semibold tracking-[0.15em] uppercase text-foreground/60">DEBIT</p>
                <svg width="50" height="16" viewBox="0 0 50 16">
                  <text x="0" y="14" fontFamily="Arial,sans-serif" fontWeight="bold" fontStyle="italic" fontSize="16" fill="white" fillOpacity="0.7" letterSpacing="1">VISA</text>
                </svg>
              </div>

              {/* Chip */}
              <div className="absolute top-1/2 left-5 -translate-y-1/2">
                <div
                  className="w-9 h-6 rounded"
                  style={{
                    background: 'linear-gradient(145deg, hsl(45 30% 55%), hsl(45 20% 40%))',
                    boxShadow: 'inset 0 1px 0 hsl(45 30% 65% / 0.5)',
                  }}
                >
                  <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-[0.5px] p-[2px] opacity-30">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="rounded-[1px]" style={{ background: 'hsl(45 20% 30%)' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Balance pill */}
        <div className="max-w-xs mx-auto px-6 pb-8 relative z-10">
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="glass-subtle rounded-full px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <img src={leafIcon} alt="" className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground leading-none">My balance</p>
                  <p className="text-sm font-bold tabular-nums leading-tight">$0.00</p>
                </div>
              </div>
              <span className="text-[10px] text-primary/50 font-medium">Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-xs mx-auto px-6 pb-8 relative z-10">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Upcoming Features
        </h2>

        <div className="space-y-2.5">
          <FeatureCard icon={<Wallet className="w-5 h-5 text-primary" />} title="Fiat Wallet" subtitle="Deposit, withdraw, track" delay="0.55s" onClick={() => goTo('wallet', 'left')} />
          <FeatureCard icon={<Banknote className="w-5 h-5 text-primary" />} title="Buy & Sell Crypto" subtitle="Instantly from your wallet" delay="0.6s" onClick={() => goTo('buysell', 'left')} />
          <FeatureCard icon={<CreditCard className="w-5 h-5 text-primary" />} title="Reforest Card" subtitle="Spend crypto in real life" delay="0.65s" highlight onClick={() => goTo('card', 'left')} />
        </div>
      </section>

      {/* KYC */}
      <section className="max-w-xs mx-auto px-6 pb-20 relative z-10">
        <div className="flex items-center gap-2 text-muted-foreground/40 text-[11px] justify-center animate-fade-in" style={{ animationDelay: '0.75s' }}>
          <ShieldCheck className="w-3.5 h-3.5 text-primary/25" />
          <span>Identity verification (KYC) will be required.</span>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({
  icon, title, subtitle, delay, highlight, onClick,
}: {
  icon: React.ReactNode; title: string; subtitle: string; delay: string; highlight?: boolean; onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full glass-subtle rounded-2xl p-4 flex items-center gap-3.5 hover:bg-secondary/60 transition-all duration-300 text-left animate-fade-in ${highlight ? 'border-primary/20' : ''}`}
    style={{ animationDelay: delay }}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${highlight ? 'bg-primary/15' : 'bg-secondary'}`}>
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-[11px] text-muted-foreground">{subtitle}</p>
    </div>
    <ArrowRight className="w-4 h-4 text-muted-foreground/30 shrink-0" />
  </button>
);

export default Card;
