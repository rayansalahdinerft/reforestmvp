import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from '@/hooks/useWallet';

export const useOnboarding = () => {
  const { user, isConnected, ready } = useWallet();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const dynamicUserId = (user as any)?.userId ?? (user as any)?.id ?? null;

  useEffect(() => {
    if (!ready) return;

    if (!isConnected || !dynamicUserId) {
      setOnboardingCompleted(null);
      setLoading(false);
      return;
    }

    const checkOnboarding = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('dynamic_user_id', dynamicUserId)
          .maybeSingle();

        if (data && data.onboarding_completed) {
          setOnboardingCompleted(true);
          setProfile(data);
        } else {
          setOnboardingCompleted(false);
        }
      } catch (err) {
        console.error('Error checking onboarding:', err);
        setOnboardingCompleted(false);
      }
      setLoading(false);
    };

    checkOnboarding();
  }, [dynamicUserId, isConnected, ready]);

  return { onboardingCompleted, loading, profile, dynamicUserId };
};
