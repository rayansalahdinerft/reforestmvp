import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/hooks/useWallet';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PRESET_AVATARS } from '@/utils/avatarResolver';
import { ArrowRight, Check, Loader2, TreePine, AtSign, Camera, Lock, Eye, EyeOff } from 'lucide-react';
import Logo from '@/components/Logo';

type Step = 'welcome' | 'pseudo' | 'avatar' | 'password' | 'connect' | 'complete';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, isConnected, ready, openConnect, activeWallet } = useWallet();
  const [step, setStep] = useState<Step>('welcome');
  const [pseudo, setPseudo] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<number>(0);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pseudoError, setPseudoError] = useState('');

  const privyUserId = (user as any)?.id ?? '';
  const privyEmail = (user as any)?.email?.address ?? (user as any)?.google?.email ?? null;
  const walletAddress = activeWallet?.address ?? null;

  useEffect(() => {
    if (step === 'connect' && isConnected && privyUserId && walletAddress) {
      handleComplete();
    }
  }, [step, isConnected, privyUserId, walletAddress]);

  const handleComplete = async () => {
    if (!privyUserId) {
      toast.error('Please connect first');
      return;
    }
    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('save-onboarding', {
        body: {
          dynamicUserId: privyUserId,
          firstName: pseudo.trim(),
          lastName: '',
          pseudo: pseudo.trim(),
          email: privyEmail,
          dateOfBirth: null,
          avatarUrl: `preset:${selectedAvatar}`,
          walletAddress,
          password,
        },
      });
      if (error) throw error;
      toast.success('Welcome to ReforestWallet! 🌱');
      setStep('complete');
      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      const rawMessage = err?.message || '';
      const contextMessage = err?.context?.error || '';
      const fullMessage = `${rawMessage} ${contextMessage}`.toLowerCase();

      if (fullMessage.includes('pseudo') || fullMessage.includes('username')) {
        setPseudoError('This username is already taken');
        setStep('pseudo');
      } else {
        toast.error('Error creating profile');
        console.error(err);
      }
    }
    setSaving(false);
  };

  const canProceedPseudo = pseudo.trim().length >= 3 && pseudo.trim().length <= 20;
  const canProceedPassword = password.length >= 6 && password === confirmPassword;

  const allSteps: Step[] = ['welcome', 'pseudo', 'avatar', 'password', 'connect'];

  const iconBox = "w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 sm:mb-4";
  const iconClass = "w-6 h-6 sm:w-7 sm:h-7 text-primary";
  const heading = "text-xl sm:text-2xl font-bold text-foreground mb-1";
  const subtitle = "text-xs sm:text-sm text-muted-foreground";
  const inputClass = "w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-card border border-border text-foreground text-center text-base sm:text-lg font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";
  const btnPrimary = "w-full py-3 sm:py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98]";
  const btnDisabled = "disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-4 py-6 sm:py-0 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-[200px] -right-[150px] sm:-top-[300px] sm:-right-[200px] w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-primary/8 rounded-full blur-[100px] sm:blur-[150px]" />
        <div className="absolute -bottom-[150px] -left-[150px] sm:-bottom-[200px] sm:-left-[200px] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-primary/5 rounded-full blur-[80px] sm:blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-5 sm:mb-8">
          <Logo />
        </div>

        {/* Welcome */}
        {step === 'welcome' && (
          <div className="text-center animate-fade-in space-y-4 sm:space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <TreePine className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Welcome to ReforestWallet</h1>
              <p className="text-sm sm:text-base text-muted-foreground px-2">Create your account and save the planet with every transaction.</p>
            </div>
            <button onClick={() => setStep('pseudo')} className={btnPrimary}>
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Pseudo */}
        {step === 'pseudo' && (
          <div className="animate-fade-in space-y-4 sm:space-y-6">
            <div className="text-center">
              <div className={iconBox}><AtSign className={iconClass} /></div>
              <h2 className={heading}>Choose your username</h2>
              <p className={subtitle}>This is how others will see you</p>
            </div>
            <div>
              <input type="text" value={pseudo} onChange={(e) => { setPseudo(e.target.value.replace(/[^a-zA-Z0-9_.-]/g, '')); setPseudoError(''); }} placeholder="your_username" maxLength={20} autoFocus className={inputClass} />
              {pseudoError && <p className="text-destructive text-xs sm:text-sm text-center mt-2">{pseudoError}</p>}
              <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-1.5">3-20 characters, letters, numbers, underscores</p>
            </div>
            <button onClick={() => setStep('avatar')} disabled={!canProceedPseudo} className={`${btnPrimary} ${btnDisabled}`}>
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Avatar */}
        {step === 'avatar' && (
          <div className="animate-fade-in space-y-4 sm:space-y-6">
            <div className="text-center">
              <div className={iconBox}><Camera className={iconClass} /></div>
              <h2 className={heading}>Pick your avatar</h2>
              <p className={subtitle}>Your favorite character</p>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {PRESET_AVATARS.map((av, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedAvatar(i)}
                  className={`aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all active:scale-95 ${
                    selectedAvatar === i
                      ? 'border-primary shadow-[0_0_12px_hsl(var(--primary)/0.4)] scale-105'
                      : 'border-transparent'
                  }`}
                >
                  <img src={av} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
            <button onClick={() => setStep('password')} className={btnPrimary}>
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Password */}
        {step === 'password' && (
          <div className="animate-fade-in space-y-4 sm:space-y-6">
            <div className="text-center">
              <div className={iconBox}><Lock className={iconClass} /></div>
              <h2 className={heading}>Secure your wallet</h2>
              <p className={subtitle}>Create a password to protect your account</p>
            </div>
            <div className="space-y-2.5 sm:space-y-3">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min 6 characters)"
                  autoFocus
                  className={`${inputClass} pr-12`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1">
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
              <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className={inputClass} />
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-destructive text-xs text-center">Passwords don't match</p>
              )}
            </div>
            <button onClick={() => setStep('connect')} disabled={!canProceedPassword} className={`${btnPrimary} ${btnDisabled}`}>
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Connect */}
        {step === 'connect' && (
          <div className="animate-fade-in space-y-4 sm:space-y-6">
            <div className="text-center">
              <div className={iconBox}><TreePine className={iconClass} /></div>
              <h2 className={heading}>Create your ReforestWallet</h2>
              <p className={subtitle}>Sign in to create your secure wallet — email, social, passkeys or external wallet.</p>
            </div>
            {saving ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-primary" />
                <p className="text-xs sm:text-sm text-muted-foreground">Creating your ReforestWallet...</p>
              </div>
            ) : (
              <button onClick={openConnect} className={btnPrimary}>
                Connect Wallet <ArrowRight className="w-5 h-5" />
              </button>
            )}
            <p className="text-[10px] sm:text-xs text-center text-muted-foreground">
              Email, Google, Apple, Passkeys, MetaMask, WalletConnect & more.
            </p>
          </div>
        )}

        {/* Complete */}
        {step === 'complete' && (
          <div className="text-center animate-fade-in space-y-4 sm:space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Check className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Welcome, {pseudo}! 🌱</h2>
              <p className="text-sm text-muted-foreground">Your ReforestWallet is ready. Every swap plants trees.</p>
              {walletAddress && (
                <p className="text-[10px] sm:text-xs text-primary mt-2 font-mono">
                  {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
          {allSteps.map((s) => (
            <div
              key={s}
              className={`h-1.5 sm:h-2 rounded-full transition-all ${
                s === step ? 'bg-primary w-5 sm:w-6' : 'bg-muted-foreground/30 w-1.5 sm:w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
