import { useState, useEffect } from 'react';
import { Shield, Users, ArrowLeftRight, TreePine, TrendingUp, Activity, Lock, ChevronDown, RefreshCw, LogOut, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const AdminGate = ({ children }: { children: (dynamicUserId: string) => React.ReactNode }) => {
  const { user, sdkHasLoaded, setShowAuthFlow } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  const dynamicUserId = (user as any)?.userId ?? (user as any)?.id ?? '';

  useEffect(() => {
    if (!sdkHasLoaded) return;

    if (!isLoggedIn || !dynamicUserId) {
      setChecking(false);
      return;
    }

    const verify = async () => {
      try {
        const { data } = await supabase.functions.invoke('admin-stats', {
          body: { dynamicUserId }
        });
        if (data?.error) {
          toast.error('Accès refusé — vous n\'êtes pas admin');
          setAuthorized(false);
        } else {
          setAuthorized(true);
        }
      } catch {
        toast.error('Erreur de vérification');
      }
      setChecking(false);
    };
    verify();
  }, [sdkHasLoaded, isLoggedIn, dynamicUserId]);

  if (!sdkHasLoaded || checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn || !dynamicUserId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Accès Restreint</h1>
          <p className="text-sm text-muted-foreground">Connectez-vous avec votre compte ReforestWallet pour accéder au dashboard admin.</p>
          <button
            onClick={() => setShowAuthFlow(true)}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Se connecter
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Accès Refusé</h1>
          <p className="text-sm text-muted-foreground">Votre compte n'a pas les permissions admin requises.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-xl bg-secondary text-foreground font-semibold text-sm hover:bg-secondary/80 transition-colors"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return <>{children(dynamicUserId)}</>;
};

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const StatCard = ({ icon: Icon, label, value, sub, color = 'primary' }: any) => (
  <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-1">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className={`w-4 h-4 text-${color}`} />
      <span className="text-xs font-medium">{label}</span>
    </div>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
  </div>
);

const AdminDashboard = ({ dynamicUserId }: { dynamicUserId: string }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-stats', {
        body: { dynamicUserId }
      });
      if (error || data?.error) {
        toast.error(data?.error || 'Erreur');
        if (data?.error === 'Unauthorized') {
          localStorage.removeItem('admin_dynamic_id');
          navigate(0);
        }
        return;
      }
      setStats(data);
    } catch (err) {
      toast.error('Erreur de chargement');
    }
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_dynamic_id');
    navigate(0);
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
    { id: 'users', label: 'Inscriptions', icon: Users },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'impact', label: 'Impact', icon: TreePine },
    { id: 'security', label: 'Sécurité', icon: Lock },
  ];

  const funnelData = [
    { name: 'Inscrits', value: stats.funnel.totalSignups },
    { name: 'Onboarding OK', value: stats.funnel.onboardingCompleted },
    { name: 'Wallet créé', value: stats.funnel.withWallet },
    { name: '1er swap', value: stats.funnel.withSwap },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="font-bold text-foreground">ReforestWallet Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchStats} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <RefreshCw className={`w-4 h-4 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border/50 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={Users} label="Total Inscrits" value={stats.overview.totalUsers} sub={`+${stats.overview.registrationsToday} aujourd'hui`} />
              <StatCard icon={Activity} label="Utilisateurs actifs" value={stats.overview.activeUsers} />
              <StatCard icon={ArrowLeftRight} label="Total Swaps" value={stats.overview.totalSwaps} sub={`+${stats.overview.swapsToday} aujourd'hui`} />
              <StatCard icon={TreePine} label="Arbres plantés" value={stats.overview.totalTreesPlanted.toFixed(1)} color="green-500" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Registration trend */}
              <div className="p-4 rounded-2xl bg-card border border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-3">Inscriptions (30 jours)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={stats.trends.dailyRegistrations}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v: string) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Swap trend */}
              <div className="p-4 rounded-2xl bg-card border border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-3">Swaps (30 jours)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={stats.trends.dailySwaps}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v: string) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="rgba(59,130,246,0.2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Funnel */}
            <div className="p-4 rounded-2xl bg-card border border-border/50">
              <h3 className="text-sm font-semibold text-foreground mb-3">Funnel d'activation</h3>
              <div className="flex items-end gap-2 h-32">
                {funnelData.map((step, i) => {
                  const maxVal = Math.max(...funnelData.map(d => d.value), 1);
                  const height = (step.value / maxVal) * 100;
                  return (
                    <div key={step.name} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-bold text-foreground">{step.value}</span>
                      <div
                        className="w-full rounded-t-lg transition-all"
                        style={{
                          height: `${Math.max(height, 5)}%`,
                          backgroundColor: COLORS[i],
                          opacity: 0.8 + (i * 0.05),
                        }}
                      />
                      <span className="text-[10px] text-muted-foreground text-center leading-tight">{step.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* USERS */}
        {activeTab === 'users' && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <StatCard icon={Users} label="Aujourd'hui" value={stats.overview.registrationsToday} />
              <StatCard icon={Users} label="7 jours" value={stats.overview.registrationsWeek} />
              <StatCard icon={Users} label="30 jours" value={stats.overview.registrationsMonth} />
            </div>

            <div className="rounded-2xl border border-border/50 overflow-hidden bg-card">
              <div className="px-4 py-3 border-b border-border/50">
                <h3 className="text-sm font-semibold text-foreground">Derniers inscrits</h3>
              </div>
              <div className="divide-y divide-border/30">
                {stats.recentProfiles.map((p: any) => (
                  <div key={p.id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.pseudo}</p>
                      <p className="text-[10px] text-muted-foreground">{p.first_name} · {p.email || 'No email'}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <StatCard icon={ArrowLeftRight} label="Aujourd'hui" value={stats.overview.swapsToday} />
              <StatCard icon={ArrowLeftRight} label="7 jours" value={stats.overview.swapsWeek} />
              <StatCard icon={ArrowLeftRight} label="30 jours" value={stats.overview.swapsMonth} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* By type */}
              <div className="p-4 rounded-2xl bg-card border border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-3">Par type</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={Object.entries(stats.swapsByType).map(([name, value]) => ({ name, value }))}
                      dataKey="value"
                      cx="50%" cy="50%"
                      outerRadius={70}
                      label={({ name, value }: any) => `${name} (${value})`}
                    >
                      {Object.entries(stats.swapsByType).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top tokens */}
              <div className="p-4 rounded-2xl bg-card border border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-3">Top Tokens</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stats.topTokens} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="token" type="category" tick={{ fontSize: 9 }} width={60} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* IMPACT */}
        {activeTab === 'impact' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={TreePine} label="Arbres plantés" value={stats.overview.totalTreesPlanted.toFixed(1)} color="green-500" />
              <StatCard icon={TrendingUp} label="Donations (USD)" value={`$${stats.overview.totalDonationsUsd.toFixed(2)}`} />
            </div>

            {/* Leaderboard */}
            <div className="rounded-2xl border border-border/50 overflow-hidden bg-card">
              <div className="px-4 py-3 border-b border-border/50">
                <h3 className="text-sm font-semibold text-foreground">Top Contributeurs</h3>
              </div>
              <div className="divide-y divide-border/30">
                {stats.leaderboard.map((entry: any, i: number) => (
                  <div key={entry.id} className="px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground w-6">#{i + 1}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {entry.display_name || `${entry.wallet_address.slice(0, 8)}...`}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{entry.total_swaps} swaps</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{Number(entry.total_trees).toFixed(1)} 🌳</p>
                      <p className="text-[10px] text-muted-foreground">${Number(entry.total_donations_usd).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* SECURITY */}
        {activeTab === 'security' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={Lock} label="Events de sécurité" value={stats.securityEvents.length} />
              <StatCard icon={Users} label="Total Wallets" value={stats.overview.totalWallets} />
            </div>

            <div className="rounded-2xl border border-border/50 overflow-hidden bg-card">
              <div className="px-4 py-3 border-b border-border/50">
                <h3 className="text-sm font-semibold text-foreground">Derniers événements de sécurité</h3>
              </div>
              <div className="divide-y divide-border/30 max-h-96 overflow-y-auto">
                {stats.securityEvents.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">Aucun événement</div>
                ) : (
                  stats.securityEvents.map((evt: any) => (
                    <div key={evt.id} className="px-4 py-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-foreground">{evt.event_type}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(evt.created_at).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{evt.device || 'Unknown device'} · {evt.ip_address || 'No IP'}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

const Admin = () => {
  return (
    <AdminGate>
      {(dynamicUserId) => <AdminDashboard dynamicUserId={dynamicUserId} />}
    </AdminGate>
  );
};

export default Admin;
