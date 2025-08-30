
"use client";

import { Home, ClipboardList, Bot, Filter, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MainView } from '@/app/page';
import { Button } from '../ui/button';

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

const CenterNavItem: React.FC<NavItemProps> = ({ view, icon: Icon, label, isActive, onNavigate }) => {
    return (
        <div className="relative flex justify-center">
            <Button
                variant="default"
                onClick={() => onNavigate(view)}
                className={cn(
                    "absolute -top-6 flex flex-col items-center justify-center space-y-1 h-16 w-16 rounded-full shadow-lg transition-transform hover:scale-105",
                    isActive ? "bg-primary text-primary-foreground" : "bg-primary/90 text-primary-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
            >
                <Icon className="h-7 w-7" />
                <span className="text-xs font-bold tracking-tight">{label}</span>
            </Button>
        </div>
    );
}

interface AppFooterProps {
    activeView: MainView;
    onNavigate: (view: MainView) => void;
}

export function AppFooter({ activeView, onNavigate }: AppFooterProps) {

  const navItemsLeft: { view: MainView; icon: React.ElementType; label: string; }[] = [
    { view: "home", icon: Home, label: "Home" },
    { view: "orders", icon: ClipboardList, label: "Orders" },
  ];

  const navItemsRight: { view: MainView; icon: React.ElementType; label: string; }[] = [
    { view: "screener", icon: Filter, label: "Screener" },
    { view: "community", icon: Users, label: "Community" },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border rounded-t-2xl shadow-lg">
      <nav className="mx-auto flex h-14 items-stretch justify-around">
        {navItemsLeft.map((item) => (
          <NavItem key={item.label} {...item} isActive={activeView === item.view} onNavigate={onNavigate} />
        ))}
         <CenterNavItem 
            view="simbot"
            icon={Bot}
            label="Simbot"
            isActive={activeView === "simbot"}
            onNavigate={onNavigate}
        />
        {navItemsRight.map((item) => (
          <NavItem key={item.label} {...item} isActive={activeView === item.view} onNavigate={onNavigate} />
        ))}
      </nav>
    </footer>
  );
}
