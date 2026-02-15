import { useState, useEffect } from 'react';
import { Trophy, TreePine, Edit2, Check, X, Crown, Medal, Award } from 'lucide-react';
import { useAppKitAccount } from '@reown/appkit/react';
import Header from '@/components/Header';
import FloatingLeaves from '@/components/impact/FloatingLeaves';
import AvatarPicker from '@/components/AvatarPicker';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { resolveAvatarUrl } from '@/utils/avatarResolver';

import explorerAvatar from "@/assets/levels/explorer.png";
import seedAvatar from "@/assets/levels/seed.png";
import sproutAvatar from "@/assets/levels/sprout.png";
import rootsAvatar from "@/assets/levels/roots.png";
import canopyAvatar from "@/assets/levels/canopy.png";
import forestAvatar from "@/assets/levels/forest.png";
import legendAvatar from "@/assets/levels/legend.png";
import infinityAvatar from "@/assets/levels/infinity.png";

const LEVELS = [
  { level: 1, label: "Explorer", avatar: explorerAvatar, target: 1 },
  { level: 2, label: "Seed", avatar: seedAvatar, target: 100 },
  { level: 3, label: "Sprout", avatar: sproutAvatar, target: 1_000 },
  { level: 4, label: "Roots", avatar: rootsAvatar, target: 10_000 },
  { level: 5, label: "Canopy", avatar: canopyAvatar, target: 100_000 },
  { level: 6, label: "Forest", avatar: forestAvatar, target: 1_000_000 },
  { level: 7, label: "Legend", avatar: legendAvatar, target: 10_000_000 },
  { level: 8, label: "Infinity", avatar: infinityAvatar, target: 100_000_000 },
];

const getLevelFallback = (trees: number) => {
  const achieved = [...LEVELS].reverse().find((l) => trees >= l.target);
  return achieved?.avatar ?? explorerAvatar;
};

const getAvatar = (trees: number, avatarUrl?: string | null) => {
  const fallback = getLevelFallback(trees);
  return resolveAvatarUrl(avatarUrl, fallback);
};

interface LeaderboardEntry {
  wallet_address: string;
  display_name: string | null;
  total_trees: number;
  total_donations_usd: number;
  total_swaps: number;
  avatar_url: string | null;
}

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
  if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
  return <span className="text-sm font-bold text-muted-foreground w-5 text-center">#{rank}</span>;
};

const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const { address, isConnected } = useAppKitAccount();

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('wallet_stats')
      .select('wallet_address, display_name, total_trees, total_donations_usd, total_swaps, avatar_url')
      .gt('total_trees', 0)
      .order('total_trees', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Leaderboard fetch error:', error);
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const myEntry = entries.find(
    (e) => e.wallet_address.toLowerCase() === address?.toLowerCase()
  );
  const myRank = entries.findIndex(
    (e) => e.wallet_address.toLowerCase() === address?.toLowerCase()
  ) + 1;

  const handleSaveName = async () => {
    if (!address) return;
    setSavingName(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-display-name', {
        body: { walletAddress: address.toLowerCase(), displayName: newName },
      });
      if (error) throw error;
      toast.success('Pseudo updated! 🌱');
      setEditingName(false);
      fetchLeaderboard();
    } catch (err) {
      toast.error('Failed to update pseudo');
      console.error(err);
    }
    setSavingName(false);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingLeaves />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[300px] -right-[200px] w-[800px] h-[800px] bg-primary/8 rounded-full blur-[150px] animate-float" />
        <div className="absolute -bottom-[200px] -left-[200px] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <Header />

      <main className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-12 relative z-10">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Community Leaderboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Top <span className="text-primary">Tree Planters</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Every swap counts. See who's making the biggest impact. 🌍
          </p>
        </div>

        {/* My rank card */}
        {isConnected && myEntry && (
          <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/20 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AvatarPicker
                  currentAvatar={getAvatar(myEntry.total_trees, myEntry.avatar_url)}
                  walletAddress={address!}
                  onAvatarChanged={fetchLeaderboard}
                />
                <div>
                  <div className="flex items-center gap-2">
                    {editingName ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="Enter pseudo..."
                          maxLength={20}
                          className="px-2 py-1 text-sm bg-secondary rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary w-32"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveName}
                          disabled={savingName}
                          className="p-1 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingName(false)}
                          className="p-1 rounded-lg bg-secondary text-muted-foreground hover:bg-secondary/80 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-semibold text-foreground">
                          {myEntry.display_name || formatAddress(address!)}
                        </span>
                        <button
                          onClick={() => {
                            setNewName(myEntry.display_name || '');
                            setEditingName(true);
                          }}
                          className="p-1 rounded-lg hover:bg-secondary transition-colors"
                        >
                          <Edit2 className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">Your rank: #{myRank}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-primary">{myEntry.total_trees.toFixed(1)}</span>
                <p className="text-[10px] text-muted-foreground">trees planted</p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard table */}
        <div className="rounded-2xl border border-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
          {/* Header */}
          <div className="grid grid-cols-[50px_1fr_100px_80px] sm:grid-cols-[60px_1fr_120px_100px] gap-2 px-4 py-3 bg-secondary/30 border-b border-border/50">
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase">Rank</span>
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase">Wallet</span>
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase text-right">Trees 🌳</span>
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase text-right">Donated</span>
          </div>

          {loading ? (
            <div className="px-4 py-12 text-center">
              <div className="w-8 h-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">Loading leaderboard...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <TreePine className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No trees planted yet. Be the first! 🌱</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {entries.map((entry, i) => {
                const rank = i + 1;
                const isMe = entry.wallet_address.toLowerCase() === address?.toLowerCase();
                return (
                  <div
                    key={entry.wallet_address}
                    className={`grid grid-cols-[50px_1fr_100px_80px] sm:grid-cols-[60px_1fr_120px_100px] gap-2 px-4 py-3 items-center transition-colors ${
                      isMe
                        ? 'bg-primary/5 border-l-2 border-l-primary'
                        : rank <= 3
                        ? 'bg-secondary/10'
                        : 'hover:bg-secondary/20'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <RankIcon rank={rank} />
                    </div>
                    <div className="min-w-0 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-border/50 shrink-0">
                        <img src={getAvatar(entry.total_trees, entry.avatar_url)} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${isMe ? 'text-primary' : 'text-foreground'}`}>
                          {entry.display_name || formatAddress(entry.wallet_address)}
                        </p>
                        {entry.display_name && (
                          <p className="text-[10px] text-muted-foreground truncate">
                            {formatAddress(entry.wallet_address)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${rank <= 3 ? 'text-primary' : 'text-foreground'}`}>
                        {entry.total_trees.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">
                        ${entry.total_donations_usd.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] sm:text-xs text-muted-foreground mt-6">
          Rankings update in real-time after each swap. Plant trees by swapping on ReforestWallet. 🌿
        </p>
      </main>
    </div>
  );
};

export default Leaderboard;
