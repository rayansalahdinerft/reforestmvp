import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/hooks/useWallet';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PRESET_AVATARS } from '@/utils/avatarResolver';
import { ArrowRight, Check, Loader2, TreePine, User, AtSign, Camera, Wallet } from 'lucide-react';
import Logo from '@/components/Logo';

type Step = 'welcome' | 'name' | 'pseudo' | 'avatar' | 'connect' | 'complete';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, isConnected, ready, openConnect, activeWallet } = useWallet();
  const [step, setStep] = useState<Step>('welcome');
  const [firstName, setFirstName] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [pseudoError, setPseudoError] = useState('');
  const [waitingForWallet, setWaitingForWallet] = useState(false);

  const dynamicUserId = (user as any)?.userId ?? (user as any)?.id ?? '';
  const walletAddress = activeWallet?.address ?? null;

  // When user connects and we're on the connect step, auto-save
  useEffect(() => {
    if (step === 'connect' && isConnected && dynamicUserId && walletAddress) {
      setWaitingForWallet(false);
      handleComplete();
    }
  }, [step, isConnected, dynamicUserId, walletAddress]);

  const handleComplete = async () => {
    if (!dynamicUserId) {
      toast.error('Veuillez vous connecter');
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('save-onboarding', {
        body: {
          dynamicUserId,
          firstName: firstName.trim(),
          pseudo: pseudo.trim(),
          avatarUrl: `preset:${selectedAvatar}`,
          walletAddress,
        },
      });
      if (error) throw error;
      toast.success('Bienvenue sur ReforestWallet ! 🌱');
      setStep('complete');
      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      if (err?.message?.includes('pseudo')) {
        setPseudoError('Ce pseudo est déjà pris');
        setStep('pseudo');
      } else {
        toast.error('Erreur lors de la création du profil');
        console.error(err);
      }
    }
    setSaving(false);
  };

  const handleConnectStep = () => {
    setWaitingForWallet(true);
    // If in iframe, open in new tab
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      // Store onboarding data in sessionStorage so the new tab can pick it up
      sessionStorage.setItem('onboarding_data', JSON.stringify({
        firstName, pseudo, selectedAvatar,
      }));
      window.open(window.location.href, '_blank', 'noopener,noreferrer');
      toast.info('Finalisez la connexion dans le nouvel onglet');
      return;
    }
    openConnect();
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Bienvenue sur ReforestWallet</h1>
              <p className="text-muted-foreground">Créez votre compte pour sauver la planète à chaque transaction.</p>
            </div>
            <button
              onClick={() => setStep('name')}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
            >
              Commencer
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
              <h2 className="text-2xl font-bold text-foreground mb-1">Comment tu t'appelles ?</h2>
              <p className="text-sm text-muted-foreground">Pour personnaliser ton expérience</p>
            </div>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ton prénom"
              maxLength={30}
              autoFocus
              className="w-full px-4 py-3.5 rounded-2xl bg-card border border-border text-foreground text-center text-lg font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button
              onClick={() => setStep('pseudo')}
              disabled={!canProceedName}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuer
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
              <h2 className="text-2xl font-bold text-foreground mb-1">Choisis ton pseudo</h2>
              <p className="text-sm text-muted-foreground">C'est comme ça que les autres te verront</p>
            </div>
            <div>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => {
                  setPseudo(e.target.value.replace(/[^a-zA-Z0-9_.-]/g, ''));
                  setPseudoError('');
                }}
                placeholder="ton_pseudo"
                maxLength={20}
                autoFocus
                className="w-full px-4 py-3.5 rounded-2xl bg-card border border-border text-foreground text-center text-lg font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              {pseudoError && (
                <p className="text-destructive text-sm text-center mt-2">{pseudoError}</p>
              )}
              <p className="text-xs text-muted-foreground text-center mt-2">3-20 caractères, lettres, chiffres, underscores</p>
            </div>
            <button
              onClick={() => setStep('avatar')}
              disabled={!canProceedPseudo}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuer
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
              <h2 className="text-2xl font-bold text-foreground mb-1">Choisis ton avatar</h2>
              <p className="text-sm text-muted-foreground">Ton personnage préféré</p>
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
              onClick={() => setStep('connect')}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
            >
              Continuer
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step: Connect — create wallet */}
        {step === 'connect' && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <Wallet className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Crée ton ReforestWallet</h2>
              <p className="text-sm text-muted-foreground">
                Connecte-toi avec ton email pour créer ton wallet natif sécurisé par MPC. Aucune seed phrase nécessaire.
              </p>
            </div>

            {saving ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Création de ton ReforestWallet...</p>
              </div>
            ) : waitingForWallet && !walletAddress ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Initialisation du wallet MPC...</p>
              </div>
            ) : (
              <button
                onClick={handleConnectStep}
                className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
              >
                <Wallet className="w-5 h-5" />
                Créer mon ReforestWallet
              </button>
            )}

            <p className="text-xs text-center text-muted-foreground">
              Un wallet sécurisé sera automatiquement créé pour toi via email.
            </p>
          </div>
        )}

        {/* Step: Complete */}
        {step === 'complete' && (
          <div className="text-center animate-fade-in space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Bienvenue, {firstName} ! 🌱</h2>
              <p className="text-muted-foreground">Ton ReforestWallet est prêt. Chaque swap plante des arbres.</p>
              {walletAddress && (
                <p className="text-xs text-primary mt-2 font-mono">
                  {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {['welcome', 'name', 'pseudo', 'avatar', 'connect'].map((s) => (
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
