import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Globe, Moon, Bell, BellRing, Shield } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('EUR');
  const [language, setLanguage] = useState('English');
  const [darkMode, setDarkMode] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(false);
  const [txConfirmations, setTxConfirmations] = useState(true);
  const [hideBalance, setHideBalance] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="pt-[max(0.75rem,env(safe-area-inset-top))]" />

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
      </div>

      <div className="px-4 pb-24 space-y-6 mt-2">
        {/* Display */}
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Display</p>
          <div className="rounded-2xl bg-card border border-border overflow-hidden divide-y divide-border">
            {/* Currency */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">Currency</span>
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-secondary text-foreground text-sm font-medium px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                  <Globe className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">Language</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-secondary text-foreground text-sm font-medium px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Français">Français</option>
                <option value="Español">Español</option>
              </select>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                  <Moon className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">Dark Theme</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative w-12 h-7 rounded-full transition-colors ${darkMode ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-foreground transition-transform ${darkMode ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Notifications</p>
          <div className="rounded-2xl bg-card border border-border overflow-hidden divide-y divide-border">
            {/* Price Alerts */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                  <Bell className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">Price Alerts</span>
              </div>
              <button
                onClick={() => setPriceAlerts(!priceAlerts)}
                className={`relative w-12 h-7 rounded-full transition-colors ${priceAlerts ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-foreground transition-transform ${priceAlerts ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'}`} />
              </button>
            </div>

            {/* TX Confirmations */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                  <BellRing className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">TX Confirmations</span>
              </div>
              <button
                onClick={() => setTxConfirmations(!txConfirmations)}
                className={`relative w-12 h-7 rounded-full transition-colors ${txConfirmations ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-foreground transition-transform ${txConfirmations ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Security</p>
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                  <Shield className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">Hide Balance by Default</span>
              </div>
              <button
                onClick={() => setHideBalance(!hideBalance)}
                className={`relative w-12 h-7 rounded-full transition-colors ${hideBalance ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-foreground transition-transform ${hideBalance ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
