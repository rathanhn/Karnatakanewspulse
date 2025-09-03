// src/app/home/profile/page.tsx
'use client';

import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { UserProfile, getUserProfile, updateUserProfile, karnatakaDistricts, newsCategories, deleteAllUserPosts, Category } from '@/lib/data';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { ArrowLeft, Moon, Sun, User as UserIcon, Bell, Trash2, LogOut, Loader2, Upload, CheckCircle } from 'lucide-react';
import { KarnatakaMapIcon } from '@/components/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function ProfilePage() {
    const router = useRouter();
    const { toast } = useToast();
    const { theme, setTheme } = useTheme();

    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    
    const [displayName, setDisplayName] = useState('');
    const [preferredDistrict, setPreferredDistrict] = useState('');
    const [preferredCategory, setPreferredCategory] = useState<Category | ''>('');
    const [notifications, setNotifications] = useState(true);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // Cloudinary state
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push('/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const fetchProfile = useCallback(async (uid: string) => {
        setIsLoading(true);
        try {
            const userProfile = await getUserProfile(uid);
            if(userProfile) {
                setProfile(userProfile);
                setDisplayName(userProfile.displayName || '');
                setPreferredDistrict(userProfile.preferredDistrict || '');
                setPreferredCategory(userProfile.preferredCategory || '');
                setNotifications(userProfile.notifications ?? true);
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to fetch your profile.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        if (user) {
            fetchProfile(user.uid);
        }
    }, [user, fetchProfile]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !auth.currentUser) return;
        setIsSaving(true);
        
        let photoURL = profile?.photoURL;
        if (uploadedUrl) {
            photoURL = uploadedUrl;
        }

        try {
            const updatedProfileData: Partial<UserProfile> = {
                displayName,
                photoURL,
                preferredDistrict,
                notifications,
            };

            // Only include preferredCategory if it has a valid value
            if (preferredCategory) {
                updatedProfileData.preferredCategory = preferredCategory;
            }

            await updateUserProfile(user.uid, updatedProfileData);

            // Also update auth profile if display name or photo changed
            if (displayName !== user.displayName || photoURL !== user.photoURL) {
                 await updateProfile(auth.currentUser, { displayName, photoURL });
            }

            toast({ title: 'Profile Updated', description: 'Your changes have been saved.' });
            fetchProfile(user.uid); // re-fetch to update UI state
        } catch (error) {
            console.error("Profile update error:", error);
            toast({ title: 'Error', description: 'Failed to update your profile.', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setUploadedUrl(null); 
        }
    };
    
    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if(data.secure_url) {
                setUploadedUrl(data.secure_url);
                toast({ title: "Upload Successful!", description: "New profile picture is ready." });
            } else {
                 throw new Error(data.error.message || 'Unknown error during upload.');
            }
        } catch (error: any) {
            toast({ title: 'Upload Failed', description: error.message, variant: 'destructive'});
        } finally {
            setUploading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!user?.email) return;
        try {
            await sendPasswordResetEmail(auth, user.email);
            toast({ title: 'Password Reset Email Sent', description: 'Check your inbox for instructions.' });
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    const handleDeleteAllPosts = async () => {
        if (!user) return;
        try {
            await deleteAllUserPosts(user.uid);
            toast({ title: 'All Posts Deleted', description: 'Your contributions have been removed.' });
        } catch (error: any) {
            toast({ title: 'Error', description: 'Failed to delete your posts.', variant: 'destructive' });
        }
    };


    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('');
    }

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading profile...</div>
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
                <div className="container mx-auto flex h-20 items-center justify-between px-4">
                    <Link href="/home" className="flex items-center gap-2 text-2xl font-bold text-primary font-headline">
                        <KarnatakaMapIcon className="w-10 h-10" />
                        <h1>Karnataka News Pulse</h1>
                    </Link>
                    <Button asChild variant="ghost">
                        <Link href="/home"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
                    </Button>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8">
                 <form onSubmit={handleProfileUpdate}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column for Profile Details */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Public Profile</CardTitle>
                                    <CardDescription>This information will be displayed on your posts.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                     <div className="flex items-center gap-6">
                                        <Avatar className="w-24 h-24 text-3xl">
                                            <AvatarImage src={uploadedUrl || profile?.photoURL || ''} />
                                            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                                        </Avatar>
                                        <div className='space-y-2 flex-grow'>
                                            <Label>Profile Picture</Label>
                                            <div className="flex items-center gap-2">
                                                 <Input id="file-upload" type="file" onChange={handleFileChange} accept="image/*" disabled={uploading || isSaving} />
                                                 <Button type="button" size="icon" onClick={handleUpload} disabled={!file || uploading || !!uploadedUrl}>
                                                    {uploading ? <Loader2 className="animate-spin" /> : (uploadedUrl ? <CheckCircle/> : <Upload/>)}
                                                 </Button>
                                            </div>
                                             <p className="text-xs text-muted-foreground">Select a new image and click upload.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="displayName">Display Name</Label>
                                        <Input id="displayName" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your public name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" value={user?.email || ''} disabled readOnly />
                                         <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Preferences</CardTitle>
                                    <CardDescription>Personalize your news feed experience.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid md:grid-cols-2 gap-6">
                                     <div className="space-y-2">
                                        <Label htmlFor="preferredDistrict">Preferred District</Label>
                                        <Select onValueChange={setPreferredDistrict} value={preferredDistrict}>
                                            <SelectTrigger><SelectValue placeholder="Select a district" /></SelectTrigger>
                                            <SelectContent>
                                                {karnatakaDistricts.map(d => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="preferredCategory">Preferred Category</Label>
                                        <Select onValueChange={(v) => setPreferredCategory(v as Category)} value={preferredCategory}>
                                            <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">None</SelectItem>
                                                {newsCategories.filter(c => c !== 'User Submitted').map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                                 <CardFooter>
                                    <Button type="submit" disabled={isSaving}>
                                        {isSaving && <Loader2 className="mr-2 animate-spin"/>}
                                        {isSaving ? 'Saving...' : 'Save All Changes'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>

                        {/* Right Column for Settings & Actions */}
                        <div className="space-y-8">
                            <Card>
                                <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="theme" className="flex items-center gap-2"><Sun className="inline-block dark:hidden" /><Moon className="hidden dark:inline-block" />Theme</Label>
                                        <Switch
                                            id="theme"
                                            checked={theme === 'dark'}
                                            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="notifications" className="flex items-center gap-2"><Bell/>Notifications</Label>
                                        <Switch
                                            id="notifications"
                                            checked={notifications}
                                            onCheckedChange={setNotifications}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                             <Card>
                                <CardHeader><CardTitle>Account Actions</CardTitle></CardHeader>
                                <CardContent className="flex flex-col gap-4">
                                    <Button variant="outline" onClick={handlePasswordReset}>Reset Password</Button>
                                    <Button variant="outline" onClick={handleLogout}><LogOut className="mr-2"/>Log Out</Button>
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                           <Button variant="destructive"><Trash2 className="mr-2"/>Delete All My Posts</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete all your posts.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDeleteAllPosts}>Yes, delete everything</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
