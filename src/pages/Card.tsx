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
      'Withdraw to your bank account with no fees',
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
              className="relative aspect-[1.586/1] rounded-[20px] overflow-hidden"
              style={{
                transform: 'perspective(800px) rotateY(-8deg) rotateX(4deg) rotate(-3deg)',
                background: 'linear-gradient(135deg, hsl(280 40% 82%), hsl(200 50% 85%) 25%, hsl(320 30% 88%) 45%, hsl(160 40% 82%) 65%, hsl(270 35% 85%) 85%, hsl(200 45% 80%))',
                boxShadow: '0 30px 60px -15px hsl(0 0% 0% / 0.5), 0 0 0 1px hsl(0 0% 90% / 0.2), inset 0 1px 0 0 hsl(0 0% 100% / 0.3)',
              }}
            >
              {/* Holographic shimmer overlay */}
              <div className="absolute inset-0 opacity-30"
                   style={{
                     background: 'linear-gradient(135deg, transparent 15%, hsl(0 0% 100% / 0.5) 35%, transparent 50%, hsl(180 60% 90% / 0.3) 65%, transparent 80%)',
                   }} />
              <div className="absolute inset-0 opacity-20"
                   style={{
                     background: 'radial-gradient(ellipse at 60% 40%, hsl(280 50% 90% / 0.5), transparent 60%), radial-gradient(ellipse at 30% 70%, hsl(160 50% 85% / 0.4), transparent 50%)',
                   }} />

              {/* Leaf logo */}
              <div className="absolute top-5 left-5">
                <img src={leafIcon} alt="" className="w-8 h-8 rounded-lg" style={{ filter: 'grayscale(0.6) brightness(0.5) contrast(1)', opacity: 0.55 }} />
              </div>

              {/* DEBIT + VISA bottom-right */}
              <div className="absolute bottom-4 right-5 text-right">
                <p className="text-[8px] font-semibold tracking-[0.15em] uppercase" style={{ color: 'hsl(260 20% 35%)' }}>DEBIT</p>
                <svg width="50" height="16" viewBox="0 0 50 16"><text x="0" y="14" fontFamily="Arial,sans-serif" fontWeight="bold" fontStyle="italic" fontSize="16" fill="hsl(260,20%,30%)" letterSpacing="1">VISA</text></svg>
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
