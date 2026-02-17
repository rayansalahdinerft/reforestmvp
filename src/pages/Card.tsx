import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowDownUp, CreditCard, ShieldCheck } from 'lucide-react';
import cardConcept from '@/assets/reforest-card-concept.png';

const features = [
  {
    icon: Wallet,
    title: 'Fiat Wallet',
    description: 'A dedicated space to manage your money like a real account.',
    points: ['Deposit fiat', 'Withdraw to a bank account', 'Real‑time balance tracking'],
  },
  {
    icon: ArrowDownUp,
    title: '1‑Click Crypto Buy & Sell',
    description: 'Buy crypto instantly from your fiat wallet, or convert back to fiat in seconds.',
    points: ['Instant crypto purchase', 'Quick sell to fiat', 'Seamless one‑click experience'],
  },
  {
    icon: CreditCard,
    title: 'Reforest Card',
    description: 'The card that lets you spend your crypto in real life.',
    points: ['Spend crypto anywhere', 'Your wallet as a full account', 'Simple, smooth, and useful'],
  },
];

const Card = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_50%_70%,hsl(142_76%_52%/0.04),transparent)]" />

        <div className="max-w-3xl mx-auto px-6 pt-20 pb-6 text-center relative z-10">
          <p className="text-primary/70 text-xs font-semibold uppercase tracking-[0.25em] mb-8 animate-fade-in">
            Coming Soon
          </p>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6 animate-hero-reveal">
            Crypto becomes
            <br />
            <span className="gradient-text">simple.</span>
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto mb-2 animate-glow-reveal">
            Buy, sell, and pay — in an instant.
          </p>
          <p className="text-foreground/90 font-semibold text-lg sm:text-xl animate-glow-reveal">
            Reforest Card — coming soon.
          </p>
        </div>

        {/* Card concept visual — smaller, subtle */}
        <div className="max-w-lg mx-auto px-8 pb-20 relative z-10">
          <div className="animate-hero-reveal" style={{ animationDelay: '0.3s' }}>
            <img
              src={cardConcept}
              alt="Reforest Card concept"
              className="w-full rounded-2xl opacity-90 animate-float"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-12">
          Upcoming <span className="gradient-text">Features</span>
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="swap-card p-6 flex flex-col gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-bold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
              <ul className="space-y-2 mt-auto">
                {feature.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* KYC mention */}
        <div className="flex items-center justify-center gap-2 mt-12 text-muted-foreground/60 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-primary/40" />
          <span>These upcoming features will require identity verification (KYC).</span>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-8">
          <Button variant="connect" size="lg" className="rounded-xl px-8">
            Learn more
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Card;
