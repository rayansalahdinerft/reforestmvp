import Header from '@/components/Header';
import MobileBottomNav from '@/components/MobileBottomNav';

const NavTest = () => {
  return (
    <div className="min-h-[100dvh] bg-background">
      <Header />
      <div className="p-6 text-muted-foreground">Desktop header + mobile bottom nav preview</div>
      <MobileBottomNav />
    </div>
  );
};

export default NavTest;
