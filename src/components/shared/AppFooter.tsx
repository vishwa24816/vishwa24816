
"use client";

import Link from 'next/link';
import { Home, ClipboardList, Bot, Filter, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const isPlaceholderAction = href.startsWith("#"); 

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isPlaceholderAction) {
      e.preventDefault();
      alert(`${label} feature coming soon!`);
    }
  };

  return (
    <Link
      href={href}
      onClick={isPlaceholderAction ? handleClick : undefined}
      className={cn(
        "flex flex-col items-center justify-center space-y-1 p-2 rounded-md transition-colors w-1/5 h-full",
        isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="h-6 w-6" />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
};

export function AppFooter() {
  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/orders", icon: ClipboardList, label: "Orders" },
    { href: "/simbot", icon: Bot, label: "Simbot" },
    { href: "#screener", icon: Filter, label: "Screener" },
    { href: "/community", icon: Users, label: "Community" }, 
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border rounded-t-2xl shadow-lg">
      <nav className="mx-auto flex h-16 items-stretch justify-around">
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>
    </footer>
  );
}
