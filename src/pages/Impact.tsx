import Header from "@/components/Header";
import NewsTicker from "@/components/NewsTicker";
import { useTreeCounter } from "@/hooks/useTreeCounter";
import { TreePine, DollarSign, Users, Calendar, TrendingUp, Leaf } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

// Mock historical data for chart - in production would come from database
const generateMockData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    
    const monthlyTrees = Math.floor(Math.random() * 500 + 200) * (12 - i);
    const monthlyDonations = monthlyTrees * 2.5;
    
    data.push({
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear(),
      trees: monthlyTrees,
      donations: monthlyDonations,
    });
  }
  
  return data;
};

const Impact = () => {
  const { stats, loading } = useTreeCounter();
  const chartData = generateMockData();

  // Calculate impact metrics
  const TREE_COST_USD = 2.5;
  const treesPlanted = stats.totalDonationsUsd / TREE_COST_USD;
  const co2Absorbed = treesPlanted * 22; // ~22kg CO2 per tree per year
  const oxygenProduced = treesPlanted * 100; // ~100kg O2 per tree per year

  const impactCards = [
    {
      icon: TreePine,
      value: Math.floor(treesPlanted).toLocaleString(),
      label: 'Trees Planted',
      description: 'Based on $2.50 per tree',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: DollarSign,
      value: `$${stats.totalDonationsUsd.toLocaleString()}`,
      label: 'Total Donated',
      description: '40% of all fees collected',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Users,
      value: stats.totalSwaps.toLocaleString(),
      label: 'Swaps Completed',
      description: 'Each swap plants trees',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Leaf,
      value: `${Math.floor(co2Absorbed).toLocaleString()} kg`,
      label: 'CO₂ Absorbed/Year',
      description: 'Environmental impact estimate',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <Header />
      <NewsTicker />

      <main className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Your <span className="text-primary">Impact</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Every swap you make contributes to global reforestation. See the difference we're making together.
          </p>
        </div>

        {/* Impact Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 animate-slide-up">
          {impactCards.map((card, index) => (
            <div
              key={card.label}
              className="swap-card p-6"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-2xl ${card.bgColor} flex items-center justify-center mb-4`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {loading ? '...' : card.value}
              </p>
              <p className="text-sm font-semibold text-foreground mb-1">{card.label}</p>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Trees Planted Over Time */}
          <div className="swap-card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <TreePine className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Trees Planted Over Time</h3>
                <p className="text-xs text-muted-foreground">Monthly cumulative growth</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="treesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(152 76% 45%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(152 76% 45%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow-card)'
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="trees"
                    stroke="hsl(152 76% 45%)"
                    strokeWidth={2}
                    fill="url(#treesGradient)"
                    name="Trees"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donations Over Time */}
          <div className="swap-card p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Donations Over Time</h3>
                <p className="text-xs text-muted-foreground">Monthly contribution totals</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                    }}
                    formatter={(value: number) => [`$${value.toFixed(0)}`, 'Donated']}
                  />
                  <Line
                    type="monotone"
                    dataKey="donations"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                    name="Donations"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="swap-card p-8 text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-2xl font-bold text-foreground mb-4">🌍 Environmental Impact</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Our reforestation efforts contribute to carbon capture, oxygen production, and biodiversity restoration.
            Every tree makes a difference in the fight against climate change.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="px-6 py-3 rounded-2xl bg-green-500/10 border border-green-500/20">
              <p className="text-2xl font-bold text-green-500">{Math.floor(co2Absorbed).toLocaleString()} kg</p>
              <p className="text-xs text-muted-foreground">CO₂ absorbed annually</p>
            </div>
            <div className="px-6 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-2xl font-bold text-blue-500">{Math.floor(oxygenProduced).toLocaleString()} kg</p>
              <p className="text-xs text-muted-foreground">O₂ produced annually</p>
            </div>
            <div className="px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20">
              <p className="text-2xl font-bold text-primary">{Math.floor(treesPlanted / 10)} ha</p>
              <p className="text-xs text-muted-foreground">Forest restored (est.)</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Impact;
