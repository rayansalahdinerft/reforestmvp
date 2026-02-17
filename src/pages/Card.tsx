import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowDownUp, CreditCard, ShieldCheck, ArrowRight, Banknote, TrendingUp } from 'lucide-react';
import leafIcon from '@/assets/leaf-icon.png';

const Card = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section — Phantom-inspired bold layout */}
      <section className="relative overflow-hidden">
        {/* Background glow blobs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/3 blur-[80px] pointer-events-none" />

        <div className="max-w-lg mx-auto px-6 pt-16 pb-8 text-center relative z-10">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-6 animate-fade-in">
            Coming Soon
          </p>

          <h1 className="text-4xl sm:text-5xl font-bold leading-[1.08] tracking-tight mb-5 animate-hero-reveal">
            Crypto becomes
            <br />
            <span className="gradient-text">simple.</span>
          </h1>

          <p className="text-muted-foreground text-base max-w-xs mx-auto mb-10 animate-glow-reveal">
            Buy, sell, and pay — in an instant.
          </p>
        </div>

        {/* Card visual — glass style like Phantom */}
        <div className="max-w-sm mx-auto px-6 pb-12 relative z-10">
          <div className="animate-hero-reveal" style={{ animationDelay: '0.2s' }}>
            <div className="relative aspect-[1.586/1] rounded-2xl overflow-hidden animate-float"
                 style={{
                   background: 'linear-gradient(135deg, hsl(0 0% 8%), hsl(0 0% 5%))',
                   boxShadow: '0 20px 60px -15px hsl(142 76% 52% / 0.15), 0 0 0 1px hsl(0 0% 14%), inset 0 1px 0 0 hsl(0 0% 18%)',
                 }}>
              {/* Subtle shimmer overlay */}
              <div className="absolute inset-0 opacity-[0.03]"
                   style={{
                     background: 'linear-gradient(135deg, transparent 30%, hsl(142 76% 52% / 0.3) 50%, transparent 70%)',
                   }} />

              {/* Logo top-left */}
              <div className="absolute top-5 left-5 flex items-center gap-1.5">
                <img src={leafIcon} alt="" className="w-7 h-7 rounded-lg" />
              </div>

              {/* Card name bottom-left */}
              <div className="absolute bottom-5 left-5">
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-foreground/40">
                  Reforest Card
                </span>
              </div>

              {/* Subtle decorative line */}
              <div className="absolute bottom-5 right-5">
                <div className="w-10 h-7 rounded border border-foreground/10 flex items-center justify-center">
                  <div className="w-6 h-4 rounded-sm border border-foreground/8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Balance teaser — Phantom style */}
        <div className="max-w-sm mx-auto px-6 pb-6 relative z-10">
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="glass-subtle rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Balance</p>
                <p className="text-xl font-bold tabular-nums">$0.00</p>
              </div>
              <div className="text-primary/60 text-xs font-medium flex items-center gap-1">
                Coming soon
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section — Phantom glass cards style */}
      <section className="max-w-sm mx-auto px-6 pb-8 relative z-10">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Upcoming Features
        </h2>

        <div className="space-y-3">
          {/* Fiat Wallet */}
          <FeatureCard
            icon={<Wallet className="w-5 h-5 text-primary" />}
            title="Fiat Wallet"
            subtitle="Deposit, withdraw, track in real time"
            delay="0.55s"
          />

          {/* Buy Crypto */}
          <FeatureCard
            icon={<TrendingUp className="w-5 h-5 text-primary" />}
            title="1‑Click Crypto Buy"
            subtitle="Instant purchase from your fiat wallet"
            delay="0.6s"
          />

          {/* Sell Crypto */}
          <FeatureCard
            icon={<Banknote className="w-5 h-5 text-primary" />}
            title="1‑Click Crypto Sell"
            subtitle="Convert to fiat in seconds"
            delay="0.65s"
          />

          {/* Reforest Card */}
          <FeatureCard
            icon={<CreditCard className="w-5 h-5 text-primary" />}
            title="Reforest Card"
            subtitle="Spend your crypto in real life"
            delay="0.7s"
            highlight
          />
        </div>
      </section>

      {/* KYC + CTA */}
      <section className="max-w-sm mx-auto px-6 pb-20 relative z-10">
        <div className="flex items-center gap-2 text-muted-foreground/50 text-[11px] mb-6 justify-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <ShieldCheck className="w-3.5 h-3.5 text-primary/30" />
          <span>Identity verification (KYC) will be required.</span>
        </div>

        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.85s' }}>
          <Button variant="connect" size="lg" className="rounded-xl px-10 w-full max-w-xs">
            Learn more
          </Button>
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
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  delay: string;
  highlight?: boolean;
}) => (
  <div
    className={`glass-subtle rounded-2xl p-4 flex items-center gap-4 hover:bg-secondary/60 transition-all duration-300 cursor-default animate-fade-in ${
      highlight ? 'border-primary/20' : ''
    }`}
    style={{ animationDelay: delay }}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
      highlight ? 'bg-primary/15' : 'bg-secondary'
    }`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
    <ArrowRight className="w-4 h-4 text-muted-foreground/30 ml-auto shrink-0" />
  </div>
);

export default Card;
