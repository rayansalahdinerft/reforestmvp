import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowDownUp, CreditCard, ShieldCheck } from 'lucide-react';
import cardConcept from '@/assets/reforest-card-concept.png';

const features = [
  {
    icon: Wallet,
    title: 'Fiat Wallet',
    description: 'A dedicated space to manage your money like a real account.',
    points: ['Deposit fiat', 'Withdraw to a bank account', 'Track balance in real time'],
  },
  {
    icon: ArrowDownUp,
    title: '1‑Click Crypto Buy & Sell',
    description: 'Purchase crypto instantly or convert to fiat in seconds.',
    points: ['Buy crypto from your fiat wallet', 'Sell crypto with easy withdrawal', 'Seamless one‑click experience'],
  },
  {
    icon: CreditCard,
    title: 'Reforest Card',
    description: 'A new card to spend your crypto in real life.',
    points: ['Spend crypto anywhere', 'Use your wallet like a complete account', 'Simple, smooth, and useful'],
  },
];

const Card = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_60%,hsl(142_76%_52%/0.08),transparent)]" />

        <div className="max-w-4xl mx-auto px-6 pt-16 pb-8 text-center relative z-10">
          <p className="text-primary/80 text-sm font-semibold uppercase tracking-widest mb-6 animate-fade-in">
            Coming Soon
          </p>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 animate-hero-reveal">
            Your crypto finally
            <br />
            becomes <span className="gradient-text">useful.</span>
          </h1>

          <p className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto mb-4 animate-glow-reveal">
            Buy, sell, and spend — all in one gesture.
          </p>
          <p className="text-foreground font-semibold text-xl sm:text-2xl animate-glow-reveal">
            Reforest Card — coming soon.
          </p>
        </div>

        {/* Card concept visual */}
        <div className="max-w-3xl mx-auto px-6 pb-16 relative z-10">
          <div className="animate-hero-reveal" style={{ animationDelay: '0.3s' }}>
            <img
              src={cardConcept}
              alt="Reforest Card concept"
              className="w-full rounded-2xl animate-float"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
          Upcoming <span className="gradient-text">Features</span>
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="swap-card p-6 flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
              <ul className="space-y-2 mt-auto">
                {feature.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* KYC mention */}
        <div className="flex items-center justify-center gap-2 mt-10 text-muted-foreground text-sm">
          <ShieldCheck className="w-4 h-4 text-primary/60" />
          <span>These upcoming features will require identity verification (KYC).</span>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <Button variant="connect" size="lg" className="rounded-xl px-8">
            Learn more
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Card;
