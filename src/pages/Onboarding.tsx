import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/hooks/useWallet';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PRESET_AVATARS } from '@/utils/avatarResolver';
import { ArrowRight, Check, Loader2, TreePine, User, AtSign, Camera } from 'lucide-react';
import Logo from '@/components/Logo';

type Step = 'welcome' | 'name' | 'pseudo' | 'avatar' | 'complete';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, isConnected } = useWallet();
  const [step, setStep] = useState<Step>('welcome');
  const [firstName, setFirstName] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [pseudoError, setPseudoError] = useState('');

  const dynamicUserId = (user as any)?.userId ?? (user as any)?.id ?? '';

  const handleComplete = async () => {
    if (!dynamicUserId) {
      toast.error('Please connect your account first');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.functions.invoke('save-onboarding', {
        body: {
          dynamicUserId,
          firstName: firstName.trim(),
          pseudo: pseudo.trim(),
          avatarUrl: `preset:${selectedAvatar}`,
        },
      });
      if (error) throw error;
      toast.success('Welcome to ReforestWallet! 🌱');
      navigate('/');
    } catch (err: any) {
      if (err?.message?.includes('pseudo')) {
        setPseudoError('This pseudo is already taken');
        setStep('pseudo');
      } else {
        toast.error('Failed to save profile');
        console.error(err);
      }
    }
    setSaving(false);
  };

  const canProceedName = firstName.trim().length >= 2;
  const canProceedPseudo = pseudo.trim().length >= 3 && pseudo.trim().length <= 20;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-[300px] -right-[200px] w-[800px] h-[800px] bg-primary/8 rounded-full blur-[150px]" />
        <div className="absolute -bottom-[200px] -left-[200px] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* Step: Welcome */}
        {step === 'welcome' && (
          <div className="text-center animate-fade-in space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <TreePine className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to ReforestWallet</h1>
              <p className="text-muted-foreground">Create your account to start saving the planet with every transaction.</p>
            </div>
            <button
              onClick={() => setStep('name')}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step: First Name */}
        {step === 'name' && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <User className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-1">What's your name?</h2>
              <p className="text-sm text-muted-foreground">This helps personalize your experience</p>
            </div>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Your first name"
              maxLength={30}
              autoFocus
              className="w-full px-4 py-3.5 rounded-2xl bg-card border border-border text-foreground text-center text-lg font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button
              onClick={() => setStep('pseudo')}
              disabled={!canProceedName}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step: Pseudo */}
        {step === 'pseudo' && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <AtSign className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Choose your pseudo</h2>
              <p className="text-sm text-muted-foreground">This is how others will see you</p>
            </div>
            <div>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => {
                  setPseudo(e.target.value.replace(/[^a-zA-Z0-9_.-]/g, ''));
                  setPseudoError('');
                }}
                placeholder="your_pseudo"
                maxLength={20}
                autoFocus
                className="w-full px-4 py-3.5 rounded-2xl bg-card border border-border text-foreground text-center text-lg font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              {pseudoError && (
                <p className="text-destructive text-sm text-center mt-2">{pseudoError}</p>
              )}
              <p className="text-xs text-muted-foreground text-center mt-2">3-20 characters, letters, numbers, underscores</p>
            </div>
            <button
              onClick={() => setStep('avatar')}
              disabled={!canProceedPseudo}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step: Avatar */}
        {step === 'avatar' && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <Camera className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Pick your avatar</h2>
              <p className="text-sm text-muted-foreground">Choose your favorite character</p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {PRESET_AVATARS.map((av, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedAvatar(i)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:scale-105 ${
                    selectedAvatar === i
                      ? 'border-primary shadow-[0_0_16px_hsl(var(--primary)/0.4)] scale-105'
                      : 'border-transparent hover:border-primary/30'
                  }`}
                >
                  <img src={av} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <button
              onClick={handleComplete}
              disabled={saving}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-40"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating your wallet...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Create my ReforestWallet
                </>
              )}
            </button>
          </div>
        )}

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {['welcome', 'name', 'pseudo', 'avatar'].map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-all ${
                s === step ? 'bg-primary w-6' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
