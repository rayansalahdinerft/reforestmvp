import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Wallet, CreditCard, ShieldCheck, ArrowRight, Banknote } from 'lucide-react';
import leafIcon from '@/assets/leaf-icon.png';

const Card = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        <div className="max-w-lg mx-auto px-6 pt-16 pb-8 text-center relative z-10">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-6 animate-fade-in">
            Coming Soon
          </p>

          <h1 className="text-4xl sm:text-5xl font-bold leading-[1.08] tracking-tight mb-5 animate-hero-reveal">
            Crypto becomes
            <br />
            more <span className="gradient-text">simple.</span>
          </h1>

          <p className="text-muted-foreground text-base max-w-xs mx-auto mb-10 animate-glow-reveal">
            All your transactions with Reforest Card.
          </p>
        </div>

        {/* Platinum metal card */}
        <div className="max-w-sm mx-auto px-6 pb-12 relative z-10">
          <div className="animate-hero-reveal" style={{ animationDelay: '0.2s' }}>
            <div
              className="relative aspect-[1.586/1] rounded-2xl overflow-hidden animate-float"
              style={{
                background: 'linear-gradient(145deg, hsl(0 0% 72%), hsl(0 0% 58%) 30%, hsl(0 0% 68%) 50%, hsl(0 0% 55%) 70%, hsl(0 0% 65%))',
                boxShadow: '0 25px 60px -15px hsl(0 0% 0% / 0.6), 0 0 0 1px hsl(0 0% 75% / 0.2), inset 0 1px 0 0 hsl(0 0% 85% / 0.4), inset 0 -1px 0 0 hsl(0 0% 40% / 0.3)',
              }}
            >
              {/* Brushed metal texture */}
              <div className="absolute inset-0 opacity-[0.06]"
                   style={{
                     backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, hsl(0 0% 100% / 0.1) 1px, hsl(0 0% 100% / 0.1) 2px)',
                     backgroundSize: '3px 100%',
                   }} />

              {/* Shimmer highlight */}
              <div className="absolute inset-0 opacity-20"
                   style={{
                     background: 'linear-gradient(135deg, transparent 25%, hsl(0 0% 100% / 0.4) 45%, transparent 55%)',
                   }} />

              {/* Leaf logo — embossed silver */}
              <div className="absolute top-5 left-5">
                <img
                  src={leafIcon}
                  alt=""
                  className="w-8 h-8 rounded-lg"
                  style={{
                    filter: 'grayscale(1) brightness(0.6) contrast(1.1)',
                    opacity: 0.5,
                  }}
                />
              </div>

              {/* Card name — embossed */}
              <div className="absolute bottom-5 left-5">
                <span
                  className="text-[11px] font-bold tracking-[0.2em] uppercase"
                  style={{ color: 'hsl(0 0% 40%)' }}
                >
                  Reforest Card
                </span>
              </div>

              {/* VISA logo bottom-right */}
              <div className="absolute bottom-4 right-5">
                <svg width="50" height="16" viewBox="0 0 50 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="0" y="14" fontFamily="Arial, sans-serif" fontWeight="bold" fontStyle="italic" fontSize="16" fill="hsl(0,0%,38%)" letterSpacing="1">VISA</text>
                </svg>
              </div>

              {/* Chip */}
              <div className="absolute top-1/2 left-5 -translate-y-1/2">
                <div
                  className="w-10 h-7 rounded"
                  style={{
                    background: 'linear-gradient(145deg, hsl(0 0% 60%), hsl(0 0% 48%))',
                    boxShadow: 'inset 0 1px 0 hsl(0 0% 70% / 0.5), inset 0 -1px 0 hsl(0 0% 35% / 0.5)',
                  }}
                >
                  {/* Chip lines */}
                  <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-[0.5px] p-[3px] opacity-30">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="rounded-[1px]" style={{ background: 'hsl(0 0% 40%)' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Balance teaser */}
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

      {/* Features */}
      <section className="max-w-sm mx-auto px-6 pb-8 relative z-10">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Upcoming Features
        </h2>

        <div className="space-y-3">
          <FeatureCard
            icon={<Wallet className="w-5 h-5 text-primary" />}
            title="Fiat Wallet"
            subtitle="Deposit, withdraw, track in real time"
            delay="0.55s"
          />
          <FeatureCard
            icon={<Banknote className="w-5 h-5 text-primary" />}
            title="Buy & Sell Crypto"
            subtitle="Instantly from your fiat wallet"
            delay="0.6s"
          />
          <FeatureCard
            icon={<CreditCard className="w-5 h-5 text-primary" />}
            title="Reforest Card"
            subtitle="Spend your crypto in real life"
            delay="0.65s"
            highlight
          />
        </div>
      </section>

      {/* KYC + CTA */}
      <section className="max-w-sm mx-auto px-6 pb-20 relative z-10">
        <div className="flex items-center gap-2 text-muted-foreground/50 text-[11px] mb-6 justify-center animate-fade-in" style={{ animationDelay: '0.75s' }}>
          <ShieldCheck className="w-3.5 h-3.5 text-primary/30" />
          <span>Identity verification (KYC) will be required.</span>
        </div>
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <Button variant="connect" size="lg" className="rounded-xl px-10 w-full max-w-xs">
            Learn more
            <ArrowRight className="w-4 h-4 ml-1" />
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
    className={`glass-subtle rounded-2xl p-4 flex items-center gap-4 hover:bg-secondary/60 transition-all duration-300 cursor-pointer animate-fade-in ${
      highlight ? 'border-primary/20' : ''
    }`}
    style={{ animationDelay: delay }}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
      highlight ? 'bg-primary/15' : 'bg-secondary'
    }`}>
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
    <ArrowRight className="w-4 h-4 text-muted-foreground/40 hover:text-primary/60 transition-colors shrink-0" />
  </div>
);

export default Card;
