
"use client";

import Link from 'next/link';
import { Home, ClipboardList, Bot, Filter, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { MainView } from '@/app/page';
import { Button } from '../ui/button';
import { SimbotInputBar } from '../simbot/SimbotInputBar';
import { useAuth } from '@/contexts/AuthContext';

interface NavItemProps {
  view: MainView;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onNavigate: (view: MainView) => void;
}

const NavItem: React.FC<NavItemProps> = ({ view, icon: Icon, label, isActive, onNavigate }) => {
  
  return (
    <Button
      variant="ghost"
      onClick={() => onNavigate(view)}
      className={cn(
        "flex flex-col items-center justify-center space-y-1 p-2 rounded-md transition-colors w-1/5 h-full",
        isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
};

interface AppFooterProps {
    activeView: MainView;
    onNavigate: (view: MainView) => void;
    onNavigateRequest: (asset: any, details?: any) => void;
}

export function AppFooter({ activeView, onNavigate, onNavigateRequest }: AppFooterProps) {
  const { user } = useAuth();
  const isRealMode = user?.id === 'REAL456';

  const navItems: { view: MainView; icon: React.ElementType; label: string; }[] = [
    { view: "home", icon: Home, label: "Home" },
    { view: "orders", icon: ClipboardList, label: "Orders" },
    { view: "screener", icon: Filter, label: "Screener" },
    { view: "community", icon: Users, label: "Community" },
    { view: "simbot", icon: Bot, label: "Simbot" },
  ];
  
  const showSimbotBar = activeView !== 'simbot';

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border rounded-t-2xl shadow-lg">
      {showSimbotBar && (
        <div className="border-b p-2">
            <SimbotInputBar onNavigateRequest={onNavigateRequest} />
        </div>
      )}
      <nav className="mx-auto flex h-14 items-stretch justify-around">
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} isActive={activeView === item.view} onNavigate={onNavigate} />
        ))}
      </nav>
    </footer>
  );
}
