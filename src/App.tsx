import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { WalletProvider } from "@/providers/WalletProvider";
import { ActiveWalletProvider } from "@/contexts/ActiveWalletContext";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Impact from "./pages/Impact";
import Market from "./pages/Market";
import Leaderboard from "./pages/Leaderboard";
import Card from "./pages/Card";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Admin from "./pages/Admin";
import AIChatbot from "./components/AIChatbot";
import MobileBottomNav from "./components/MobileBottomNav";
import AuthGate from "./components/AuthGate";

const AppLayout = () => {
  const { pathname } = useLocation();
  const isOnboarding = pathname === '/onboarding';
  const isAdmin = pathname === '/admin';

  return (
    <>
      <div className={(isOnboarding || isAdmin) ? '' : 'pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-0'}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/market" element={<Market />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/card" element={<Card />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!isOnboarding && !isAdmin && <MobileBottomNav />}
      {!isOnboarding && !isAdmin && <AIChatbot />}
    </>
  );
};

const App = () => (
  <WalletProvider>
    <ActiveWalletProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthGate>
            <AppLayout />
          </AuthGate>
        </BrowserRouter>
      </TooltipProvider>
    </ActiveWalletProvider>
  </WalletProvider>
);

export default App;
