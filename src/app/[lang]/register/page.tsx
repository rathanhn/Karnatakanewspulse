// src/app/register/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithRedirect, getRedirectResult, User } from 'firebase/auth';
import { createUserProfile } from '@/lib/data';

export default function RegisterPage({ params }: { params: { lang: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const lang = params.lang;

  const handleSuccessfulLogin = async (user: User) => {
    // Check if a user profile already exists. This can happen with social logins.
    // For this app, we'll create one if it doesn't exist.
    await createUserProfile(user.uid, {
        displayName: user.displayName || `${firstName} ${lastName}`.trim(),
        email: user.email!,
        photoURL: user.photoURL,
    });
    
    toast({
        title: 'Success!',
        description: `Welcome ${user.displayName || firstName}!`,
    });
    router.push(`/${lang}/home`);
  };

  useEffect(() => {
    const checkRedirect = async () => {
      setIsGoogleLoading(true);
      try {
        const result = await getRedirectResult(auth);
        if (result) {
            await handleSuccessfulLogin(result.user);
        }
      } catch (error: any) {
        toast({
          title: 'Google Sign-up Failed',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsGoogleLoading(false);
      }
    };
    checkRedirect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newName = `${firstName} ${lastName}`.trim();
      await updateProfile(userCredential.user, {
        displayName: newName
      });
      
      // We need to reload to get the updated profile, or pass it directly
      const updatedUser = { ...userCredential.user, displayName: newName };
      await handleSuccessfulLogin(updatedUser);

    } catch (error: any) {
        toast({
            title: 'Registration Failed',
            description: error.message,
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <UserPlus className="w-6 h-6" />
            <span>Sign Up</span>
          </CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" placeholder="Max" required value={firstName} onChange={e => setFirstName(e.target.value)} disabled={isLoading || isGoogleLoading} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" placeholder="Robinson" required value={lastName} onChange={e => setLastName(e.target.value)} disabled={isLoading || isGoogleLoading} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading || isGoogleLoading}/>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                {isLoading ? 'Creating Account...' : 'Create an account'}
              </Button>
              <Button variant="outline" className="w-full" type="button" onClick={handleGoogleLogin} disabled={isLoading || isGoogleLoading}>
                 {isGoogleLoading ? 'Redirecting to Google...' : 'Sign up with Google'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href={`/${lang}/login`} className="underline">
              Sign in
            </Link>
          </div>
           <div className="mt-4 text-center text-sm">
            <Link href={`/${lang}/home`} className="underline">
              &larr; Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
