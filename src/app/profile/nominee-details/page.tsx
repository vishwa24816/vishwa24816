
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, CalendarIcon } from 'lucide-react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from "date-fns";

export default function NomineeDetailsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [nomineeName, setNomineeName] = useState('');
  const [dob, setDob] = useState<Date | undefined>();
  const [relationship, setRelationship] = useState('');

  const handleSave = () => {
    if (!nomineeName || !dob || !relationship) {
      toast({
        title: "Incomplete Details",
        description: "Please fill in all fields for the nominee.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Nominee Details Saved (Mock)",
      description: `${nomineeName} has been added as a nominee.`,
    });
    router.push('/profile');
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background">
        <header className="flex items-center p-4 border-b bg-background sticky top-0 z-10">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold ml-4">Add Nominee</h1>
        </header>

        <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="max-w-lg mx-auto">
            <p className="text-muted-foreground">
              Add recipients of your funds in case of your demise.
            </p>
            <p className="text-muted-foreground text-sm">
                You can add up to 2 nominees now. <Button variant="link" className="p-0 h-auto text-primary">Learn more</Button>
            </p>

            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Nominee 1</h2>
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="nominee-name">Nominee's full name</Label>
                        <Input 
                            id="nominee-name" 
                            placeholder="Nominee's full name"
                            value={nomineeName}
                            onChange={(e) => setNomineeName(e.target.value)} 
                        />
                    </div>
                     <div>
                        <Label htmlFor="nominee-dob">Nominee's DOB</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !dob && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dob ? format(dob, "PPP") : <span>Nominee's DOB</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={dob}
                                onSelect={setDob}
                                initialFocus
                                captionLayout="dropdown-buttons"
                                fromYear={1920}
                                toYear={new Date().getFullYear()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                        <Label>Nominee relationship</Label>
                        <Select onValueChange={setRelationship} value={relationship}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="spouse">Spouse</SelectItem>
                                <SelectItem value="child">Child</SelectItem>
                                <SelectItem value="parent">Parent</SelectItem>
                                <SelectItem value="sibling">Sibling</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <p className="text-sm text-muted-foreground mt-8">
                After adding first nominee, you can optionally add another nominee & specify share of funds for them.
            </p>
          </div>
        </main>
        
        <footer className="p-4 border-t sticky bottom-0 bg-background">
             <div className="max-w-lg mx-auto">
                <Button className="w-full" onClick={handleSave}>Save Nominee Details</Button>
            </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
