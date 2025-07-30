
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, ChevronRight, Info } from 'lucide-react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';


interface SecurityItemProps {
  title: string;
  description: string;
  status?: 'ACTIVE' | 'INACTIVE';
  onClick?: () => void;
}

const SecurityItem: React.FC<SecurityItemProps> = ({ title, description, status, onClick }) => (
    <button
      onClick={onClick}
      className="w-full text-left p-4 hover:bg-muted/50 transition-colors flex items-center border-b"
    >
        <div className="flex-grow">
            <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground text-base">{title}</p>
                {status && (
                    <Badge className={cn(
                        status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'
                    )}>
                        {status}
                    </Badge>
                )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
);


export default function SecurityPage() {
    const router = useRouter();
    const { toast } = useToast();

    const securityItems: SecurityItemProps[] = [
        {
            title: 'Reset Login PIN',
            description: 'Easily login to your account with a 6 digit security PIN',
            status: 'ACTIVE',
            onClick: () => toast({ title: 'Reset PIN flow not implemented.' }),
        },
        {
            title: 'Google Authenticator',
            description: '2-Step Verification for your account with Google Authenticator',
            status: 'INACTIVE',
            onClick: () => toast({ title: 'Google Authenticator flow not implemented.' }),
        },
        {
            title: 'Crypto Withdrawal Password',
            description: 'Added layer of security to make your crypto withdrawals safer',
            status: 'INACTIVE',
            onClick: () => toast({ title: 'Crypto password flow not implemented.' }),
        },
        {
            title: 'Verified Devices',
            description: 'Manage devices that you have accessed',
            onClick: () => toast({ title: 'Device management not implemented.' }),
        },
        {
            title: 'Backup Codes',
            description: 'Managed codes that you have accessed',
            onClick: () => toast({ title: 'Backup codes not implemented.' }),
        },
        {
            title: 'Account Activity',
            description: 'Know all your activity',
            onClick: () => toast({ title: 'Account activity not implemented.' }),
        },
    ];

    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-background">
                <header className="flex items-center p-4 border-b sticky top-0 z-10 bg-background">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <h1 className="text-xl font-bold ml-4">Security</h1>
                </header>
                <main className="flex-grow">
                    <div>
                        {securityItems.map((item) => (
                            <SecurityItem key={item.title} {...item} />
                        ))}
                    </div>

                    <div className="p-4 sm:p-6 mt-6">
                        <Alert variant="destructive" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                             <Info className="h-4 w-4 !text-yellow-600" />
                            <AlertTitle className="text-yellow-900 font-semibold">Suspicious activity?</AlertTitle>
                            <AlertDescription className="text-yellow-800">
                                Please disable your account to secure your funds.
                            </AlertDescription>
                        </Alert>
                    </div>

                </main>
                <footer className="p-4 sm:p-6 border-t bg-background">
                    <Button variant="outline" className="w-full">
                        Disable Your Account
                    </Button>
                </footer>
            </div>
        </ProtectedRoute>
    );
}

