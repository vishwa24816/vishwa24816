
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Copy } from 'lucide-react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="py-3">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-base text-foreground mt-1">{value}</p>
  </div>
);

export default function ProfileDetailsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  // Mock data as per the design, to be replaced with real data from context/API
  const mockUser = {
      name: "Vishwa Lingam",
      phone: "9739911799",
      uid: "VI58908975",
      occupation: "Professional",
      annualIncome: "Upto 10 Lakhs",
      natureOfBusiness: "Broking Services / Financial Services",
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-muted/20">
        <header className="flex items-center p-4 border-b bg-background sticky top-0 z-10">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold ml-4">My Account</h1>
        </header>

        <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-3 px-1">Basic Information</h2>
            <Card>
              <CardContent className="p-4 divide-y">
                <InfoRow label="User Name" value={user?.name || mockUser.name} />
                <InfoRow label="Email" value={user?.email || "vishwalingam24816@gmail.com"} />
                <InfoRow label="Phone Number" value={mockUser.phone} />
                <div>
                  <p className="text-xs text-muted-foreground pt-3">UID Number</p>
                  <div className="flex justify-between items-center">
                    <p className="text-base text-foreground mt-1">{mockUser.uid}</p>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(mockUser.uid)}>
                      <Copy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
             <div className="flex justify-between items-center mb-3 px-1">
                <h2 className="text-lg font-semibold">Additional Information</h2>
                <Button variant="link" className="text-primary p-0 h-auto" onClick={() => alert('Edit page coming soon!')}>Edit</Button>
            </div>
            <Card>
              <CardContent className="p-4 divide-y">
                <InfoRow label="Occupation" value={mockUser.occupation} />
                <InfoRow label="Annual Income" value={mockUser.annualIncome} />
                <InfoRow label="Nature of business" value={mockUser.natureOfBusiness} />
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
