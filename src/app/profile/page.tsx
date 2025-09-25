
"use client";

import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ChevronRight, User, ShieldCheck, Banknote, Users, UserX, Lock, Wallet, LifeBuoy, FileText, Star, Gift, Info, Briefcase, ChevronDown, Palette, Languages, AudioLines, Repeat, Download, Award } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface ProfileItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
  onClick?: () => void;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ icon: Icon, title, description, badge, onClick }) => (
  <button onClick={onClick} className="w-full text-left p-4 hover:bg-muted/50 transition-colors flex items-center">
    <Icon className="h-6 w-6 mr-4 text-primary" />
    <div className="flex-grow">
      <div className="flex items-center gap-2">
        <p className="font-semibold text-foreground">{title}</p>
        {badge && <Badge variant="default" className="bg-green-500 hover:bg-green-600">{badge}</Badge>}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <ChevronRight className="h-5 w-5 text-muted-foreground" />
  </button>
);

const ExpandableProfileItem: React.FC<ProfileItemProps & {children: React.ReactNode}> = ({ icon: Icon, title, description, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div>
            <button onClick={() => setIsExpanded(!isExpanded)} className="w-full text-left p-4 hover:bg-muted/50 transition-colors flex items-center">
                <Icon className="h-6 w-6 mr-4 text-primary" />
                <div className="flex-grow">
                <p className="font-semibold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform duration-200", isExpanded && "rotate-180")} />
            </button>
            {isExpanded && (
                <div className="bg-muted/30 px-4 py-3 animate-accordion-down">
                    {children}
                </div>
            )}
        </div>
    )
}


export default function ProfilePage() {
  const { user, logout, theme, setTheme, language, setLanguage } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const isRealMode = user?.id === 'REAL456';
  
  const [platformCurrency, setPlatformCurrency] = useState('INR');
  const [simbotVoice, setSimbotVoice] = useState('indian_man');
  const [professionalTag, setProfessionalTag] = useState('');
  const [identificationNumber, setIdentificationNumber] = useState('');
  
  const themeOptions = [
      { value: 'blue', label: 'Blue' },
      { value: 'cyan', label: 'Cyan' },
      { value: 'light-green', label: 'Light Green' },
      { value: 'dark-green', label: 'Dark Green' },
      { value: 'pink', label: 'Pink' },
      { value: 'red', label: 'Red' },
      { value: 'orange', label: 'Orange' },
      { value: 'yellow', label: 'Yellow' },
      { value: 'gold', label: 'Gold' },
      { value: 'brown', label: 'Brown' },
      { value: 'violet', label: 'Violet' },
      { value: 'purple', label: 'Purple' },
      { value: 'skin', label: 'Skin' },
  ];

  const languageOptions = [
      { value: 'english', label: 'English' },
      { value: 'hindi', label: 'Hindi' },
      { value: 'sanskrit', label: 'Sanskrit' },
      { value: 'gujarati', label: 'Gujarati' },
      { value: 'marathi', label: 'Marathi' },
      { value: 'bengali', label: 'Bengali' },
      { value: 'tamil', label: 'Tamil' },
      { value: 'telugu', label: 'Telugu' },
      { value: 'kannada', label: 'Kannada' },
      { value: 'malayalam', label: 'Malayalam' },
      { value: 'urdu', label: 'Urdu' },
  ];

  const simbotVoiceOptions = [
    { value: 'indian_man', label: 'Indian Man' },
    { value: 'indian_woman', label: 'Indian Woman' },
    { value: 'american_man', label: 'American Man' },
    { value: 'american_woman', label: 'American Woman' },
    { value: 'africa_man', label: 'African Man' },
    { value: 'africa_woman', label: 'African Woman' },
    { value: 'east_asia_man', label: 'East Asian Man' },
    { value: 'east_asian_woman', label: 'East Asian Woman' },
    { value: 'dog', label: 'Dog' },
    { value: 'cat', label: 'Cat' },
    { value: 'baby', label: 'Baby' },
  ];

  const professionalTagOptions = [
      { value: 'research_analyst', label: 'Research Analyst' },
      { value: 'investment_advisor', label: 'Investment Advisor' },
      { value: 'retirement_advisor', label: 'Retirement Advisor' },
      { value: 'portfolio_manager', label: 'Portfolio Manager' },
      { value: 'fund_manager', label: 'Fund Manager' },
  ];
  
  const profileItems: (ProfileItemProps & {component?: React.ReactNode})[] = [
    {
      icon: User,
      title: "Profile",
      description: "Add or change information about you",
      onClick: () => router.push('/profile/details'),
    },
    {
      icon: ShieldCheck,
      title: "KYC Verification",
      description: "Your KYC has been successfully verified",
      badge: "ACTIVE",
    },
    {
      icon: Banknote,
      title: "Account Details",
      description: "Add or Change your bank account details",
      onClick: () => router.push('/profile/account-details'),
    },
    {
      icon: Users,
      title: "Nominee Details",
      description: "Add recipients of your funds in case of your demise",
      onClick: () => router.push('/profile/nominee-details'),
    },
    {
      icon: UserX,
      title: "Account Management",
      description: "Delete or disable your account",
      onClick: () => alert('Navigate to Account Management Page'),
    },
    {
      icon: Lock,
      title: "Security and Privacy",
      description: "Manage your account security and data privacy settings",
      onClick: () => router.push('/profile/security'),
    },
    {
      icon: Wallet,
      title: "Portfolio Based Currency",
      description: "Select your preferred currency for portfolio view",
      component: (
         <ExpandableProfileItem icon={Wallet} title="Portfolio Based Currency" description="Select your preferred currency for portfolio view">
            <RadioGroup value={platformCurrency} onValueChange={setPlatformCurrency} className="space-y-2">
                 <div className="flex items-center space-x-2">
                    <RadioGroupItem value="INR" id="currency-inr" />
                    <Label htmlFor="currency-inr" className="font-normal">INR</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <RadioGroupItem value="USDT" id="currency-usdt" />
                    <Label htmlFor="currency-usdt" className="font-normal">USDT</Label>
                </div>
            </RadioGroup>
        </ExpandableProfileItem>
      )
    },
    {
        icon: Repeat,
        title: "Wallet Management",
        description: "Add, remove, or view your wallets",
        onClick: () => router.push('/profile/wallets'),
    },
    {
      icon: LifeBuoy,
      title: "Support",
      description: "Get help and support from our team",
      onClick: () => router.push('/support'),
    },
    {
      icon: FileText,
      title: "Fee Structure",
      description: "View the fee structure for all services",
      onClick: () => router.push('/profile/fee-structure'),
    },
    {
      icon: Star,
      title: "Feedback",
      description: "Share your feedback and suggestions with us",
      onClick: () => router.push('/profile/feedback'),
    },
    {
      icon: Gift,
      title: "Refer and Earn",
      description: "Refer your friends and earn rewards",
      onClick: () => router.push('/profile/refer-and-earn'),
    },
    {
      icon: Info,
      title: "About SIM",
      description: "Know more about our company and mission",
      onClick: () => alert('Navigate to About Us Page'),
    },
    {
      icon: Briefcase,
      title: "Join Us",
      description: "Explore career opportunities with us",
      onClick: () => alert('Navigate to Careers Page'),
    },
    {
        icon: Award,
        title: "Professional Tag",
        description: "Identify yourself as a finance professional",
        component: (
            <ExpandableProfileItem icon={Award} title="Professional Tag" description="Identify yourself as a finance professional">
                <RadioGroup value={professionalTag} onValueChange={setProfessionalTag} className="space-y-2">
                    {professionalTagOptions.map((tagOption) => (
                        <div key={tagOption.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={tagOption.value} id={`tag-${tagOption.value}`} />
                            <Label htmlFor={`tag-${tagOption.value}`} className="font-normal">{tagOption.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
                {professionalTag && (
                    <div className="mt-4 space-y-2 pt-4 border-t">
                        <Label htmlFor="id-number" className="font-semibold">SEBI Registration Number</Label>
                        <Input 
                            id="id-number" 
                            value={identificationNumber} 
                            onChange={(e) => setIdentificationNumber(e.target.value)} 
                            placeholder="Enter your registration ID" 
                        />
                        <Button 
                            size="sm" 
                            className="mt-2" 
                            onClick={() => {
                                toast({ title: "Professional tag saved!" });
                            }}
                        >
                            Save
                        </Button>
                    </div>
                )}
            </ExpandableProfileItem>
        )
    },
    {
        icon: Palette,
        title: "Platform Colour",
        description: "Choose your preferred color theme",
        component: (
            <ExpandableProfileItem icon={Palette} title="Platform Colour" description="Choose your preferred color theme">
                <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-2 gap-2">
                     {themeOptions.map((themeOption) => (
                        <div key={themeOption.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={themeOption.value} id={`color-${themeOption.value}`} />
                            <Label htmlFor={`color-${themeOption.value}`} className="font-normal">{themeOption.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </ExpandableProfileItem>
        )
    },
    {
        icon: AudioLines,
        title: "SIMBOT Voice",
        description: "Choose your preferred voice for the assistant",
        component: (
            <ExpandableProfileItem icon={AudioLines} title="SIMBOT Voice" description="Choose your preferred voice for the assistant">
                <RadioGroup value={simbotVoice} onValueChange={setSimbotVoice} className="grid grid-cols-2 gap-2">
                     {simbotVoiceOptions.map((voiceOption) => (
                        <div key={voiceOption.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={voiceOption.value} id={`voice-${voiceOption.value}`} />
                            <Label htmlFor={`voice-${voiceOption.value}`} className="font-normal">{voiceOption.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </ExpandableProfileItem>
        )
    },
    {
        icon: Languages,
        title: "Platform Language",
        description: "Select your display language",
        component: (
            <ExpandableProfileItem icon={Languages} title="Platform Language" description="Select your display language">
                <RadioGroup value={language} onValueChange={setLanguage} className="grid grid-cols-2 gap-2">
                    {languageOptions.map((langOption) => (
                        <div key={langOption.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={langOption.value} id={`lang-${langOption.value}`} />
                            <Label htmlFor={`lang-${langOption.value}`} className="font-normal">{langOption.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </ExpandableProfileItem>
        )
    }
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader 
            isRealMode={isRealMode} 
        />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
          <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader className="items-center text-center pb-4">
              <Avatar className="h-24 w-24 mb-3 border-2 border-primary p-1">
                <AvatarImage 
                  src={`https://placehold.co/112x112.png?text=${user?.email?.[0].toUpperCase()}`} 
                  alt={user?.email || "User avatar"}
                  data-ai-hint="profile avatar" 
                />
                <AvatarFallback className="text-3xl">
                  {user?.email?.[0].toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl font-headline">{user?.name || "Your Name"}</CardTitle>
              <CardDescription className="flex items-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                {user?.email || "your.email@example.com"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-t">
                {profileItems.map((item, index) => (
                   <React.Fragment key={item.title}>
                     {item.component ? item.component : <ProfileItem {...item} />}
                    {index < profileItems.length - 1 && <div className="border-b mx-4"></div>}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <Button onClick={logout} variant="outline" className="w-full">
                Logout
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
