
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { KarnatakaMapIcon } from '@/components/icons';
import { Menu, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export default function Dashboard() {
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = () => {
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    router.push('/');
  };

  return (
    <div className="bg-background min-h-screen font-body text-foreground">
      <header className="py-6 border-b border-border/50">
        <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <KarnatakaMapIcon className="w-10 h-10 waving-flag" />
                    <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
                        Karnataka News Pulse
                    </h1>
                </div>
              <p className="text-muted-foreground font-headline text-lg text-center md:text-left">Your real-time district-wise news hub</p>
            </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center pt-8">
            <h2 className="text-2xl font-headline">Dashboard is clear.</h2>
        </div>
      </div>
    </div>
  );
}
