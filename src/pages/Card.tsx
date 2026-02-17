import { useState } from 'react';
import Header from '@/components/Header';
import { Wallet, CreditCard, ShieldCheck, ArrowRight, Banknote, ArrowLeft, X } from 'lucide-react';
import leafIcon from '@/assets/leaf-icon.png';

const featureDetails: Record<string, { title: string; description: string; points: string[] }> = {
  wallet: {
    title: 'Fiat Wallet',
    description: 'A dedicated space to manage your money like a real account.',
    points: [
      'Deposit fiat instantly',
      'Withdraw to your bank account',
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

  const detail = activeDetail ? featureDetails[activeDetail] : null;

  return (
    <div className="min-h-screen bg-background relative">
      <Header />

      {/* Detail overlay */}
      {detail && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl animate-fade-in">
          <div className="max-w-sm mx-auto px-6 pt-6">
            <button
              onClick={() => setActiveDetail(null)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>

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

            <div className="flex items-center gap-2 text-muted-foreground/40 text-[11px] mt-10 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-primary/30" />
              <span>Coming soon — KYC required.</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Glow blob */}
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

        {/* Platinum card — tilted like Phantom */}
        <div className="max-w-xs mx-auto px-6 pb-6 relative z-10">
          <div className="animate-hero-reveal" style={{ animationDelay: '0.2s' }}>
            <div
              className="relative aspect-[1.586/1] rounded-2xl overflow-hidden"
              style={{
                transform: 'perspective(800px) rotateY(-8deg) rotateX(4deg) rotate(-3deg)',
                background: 'linear-gradient(145deg, hsl(0 0% 75%), hsl(0 0% 60%) 30%, hsl(0 0% 70%) 50%, hsl(0 0% 58%) 70%, hsl(0 0% 67%))',
                boxShadow: '0 30px 60px -15px hsl(0 0% 0% / 0.5), 0 0 0 1px hsl(0 0% 78% / 0.15), inset 0 1px 0 0 hsl(0 0% 88% / 0.4), inset 0 -1px 0 0 hsl(0 0% 42% / 0.3)',
              }}
            >
              {/* Brushed metal */}
              <div className="absolute inset-0 opacity-[0.05]"
                   style={{
                     backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, hsl(0 0% 100% / 0.08) 1px, hsl(0 0% 100% / 0.08) 2px)',
                     backgroundSize: '3px 100%',
                   }} />
              {/* Shimmer */}
              <div className="absolute inset-0 opacity-25"
                   style={{
                     background: 'linear-gradient(135deg, transparent 20%, hsl(0 0% 100% / 0.5) 40%, transparent 55%)',
                   }} />

              {/* Leaf embossed */}
              <div className="absolute top-4 left-4">
                <img src={leafIcon} alt="" className="w-7 h-7 rounded-lg" style={{ filter: 'grayscale(1) brightness(0.55) contrast(1.1)', opacity: 0.45 }} />
              </div>

              {/* Chip */}
              <div className="absolute top-1/2 left-4 -translate-y-1/2">
                <div className="w-9 h-6 rounded" style={{ background: 'linear-gradient(145deg, hsl(0 0% 62%), hsl(0 0% 50%))', boxShadow: 'inset 0 1px 0 hsl(0 0% 72% / 0.5)' }}>
                  <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-[0.5px] p-[2px] opacity-25">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="rounded-[1px]" style={{ background: 'hsl(0 0% 40%)' }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Card name */}
              <div className="absolute bottom-4 left-4">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: 'hsl(0 0% 42%)' }}>
                  Reforest Card
                </span>
              </div>

              {/* VISA */}
              <div className="absolute bottom-3 right-4">
                <svg width="46" height="15" viewBox="0 0 46 15"><text x="0" y="13" fontFamily="Arial,sans-serif" fontWeight="bold" fontStyle="italic" fontSize="15" fill="hsl(0,0%,40%)" letterSpacing="1">VISA</text></svg>
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
          <FeatureCard
            icon={<Wallet className="w-5 h-5 text-primary" />}
            title="Fiat Wallet"
            subtitle="Deposit, withdraw, track"
            delay="0.55s"
            onClick={() => setActiveDetail('wallet')}
          />
          <FeatureCard
            icon={<Banknote className="w-5 h-5 text-primary" />}
            title="Buy & Sell Crypto"
            subtitle="Instantly from your wallet"
            delay="0.6s"
            onClick={() => setActiveDetail('buysell')}
          />
          <FeatureCard
            icon={<CreditCard className="w-5 h-5 text-primary" />}
            title="Reforest Card"
            subtitle="Spend crypto in real life"
            delay="0.65s"
            highlight
            onClick={() => setActiveDetail('card')}
          />
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
  icon,
  title,
  subtitle,
  delay,
  highlight,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  delay: string;
  highlight?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full glass-subtle rounded-2xl p-4 flex items-center gap-3.5 hover:bg-secondary/60 transition-all duration-300 text-left animate-fade-in ${
      highlight ? 'border-primary/20' : ''
    }`}
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
