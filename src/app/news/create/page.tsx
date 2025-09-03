// src/app/news/create/page.tsx
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { karnatakaDistricts, addUserNews, newsCategories, Category } from '@/lib/data';
import { ArrowLeft, Send, Upload, Loader2, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { KarnatakaMapIcon } from '@/components/icons';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Image from 'next/image';

const userSelectableCategories = newsCategories.filter(c => c !== 'Trending' && c !== 'User Submitted');

export default function CreateNewsPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [headline, setHeadline] = useState('');
    const [content, setContent] = useState('');
    const [district, setDistrict] = useState('');
    const [category, setCategory] = useState<Category | ''>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setUploadedUrl(null);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setFile(null);
            setPreviewUrl(null);
        }
    };
    
    const handleUpload = async () => {
        if (!file) {
             toast({ title: 'No file selected', description: 'Please select an image to upload.', variant: 'destructive'});
            return;
        }
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
                toast({ title: "Upload Successful!", description: "Image is ready to be submitted with your post." });
            } else {
                 throw new Error(data.error.message || 'Unknown error during upload.');
            }

        } catch (error: any) {
            console.error('Upload error:', error);
            toast({ title: 'Upload Failed', description: error.message || 'Could not upload the image.', variant: 'destructive'});
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!headline || !content || !district || !category || !user) {
            toast({
                title: 'Missing fields',
                description: 'Please fill out all fields, including category.',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            await addUserNews({
                headline,
                content,
                district,
                category,
                userId: user.uid,
                imageUrl: uploadedUrl
            });

            toast({
                title: 'News Submitted!',
                description: 'Thank you for your contribution. Your news is now live.',
            });
            
            router.push('/home/my-posts');
        } catch (error) {
            toast({
                title: 'Submission Failed',
                description: 'Could not submit your post. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
                <div className="container mx-auto flex h-20 items-center justify-between px-4">
                    <Link href="/home" className="flex items-center gap-2 text-2xl font-bold text-primary font-headline">
                        <KarnatakaMapIcon className="w-10 h-10" />
                        <h1>Karnataka News Pulse</h1>
                    </Link>
                    <Button asChild variant="ghost">
                        <Link href="/home">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </header>
            <main className="container mx-auto p-4 md:p-8 flex justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline">Create a News Post</CardTitle>
                        <CardDescription>Share a local news story with the community.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="headline">Headline</Label>
                                <Input
                                    id="headline"
                                    value={headline}
                                    onChange={(e) => setHeadline(e.target.value)}
                                    placeholder="Enter a catchy headline"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="district">District</Label>
                                    <Select onValueChange={setDistrict} value={district} required disabled={isSubmitting}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select the relevant district" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {karnatakaDistricts.filter(d => d !== 'Karnataka').map(d => (
                                                <SelectItem key={d} value={d}>{d}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select onValueChange={(value) => setCategory(value as Category)} value={category} required disabled={isSubmitting}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a news category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {userSelectableCategories.map(c => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write the full news story here..."
                                    required
                                    rows={10}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Thumbnail Image (Optional)</Label>
                                {previewUrl && (
                                     <div className="relative w-full h-48 rounded-md overflow-hidden border">
                                        <Image src={previewUrl} alt="Image preview" layout="fill" objectFit="cover" />
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Input id="file-upload" type="file" className="flex-grow" onChange={handleFileChange} accept="image/*" disabled={uploading || isSubmitting} />
                                    <Button type="button" size="icon" onClick={handleUpload} disabled={!file || uploading || !!uploadedUrl}>
                                        {uploading ? <Loader2 className="animate-spin" /> : (uploadedUrl ? <CheckCircle/> : <Upload/>)}
                                    </Button>
                                </div>
                                {uploadedUrl && <div className='text-sm text-green-500 flex items-center gap-2'><CheckCircle className='w-4 h-4'/> Image uploaded and ready.</div>}
                                 <p className="text-xs text-muted-foreground">
                                    For security, an unsigned upload preset must be configured in your Cloudinary account.
                                </p>
                            </div>
                           
                            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || uploading}>
                                <Send className="mr-2"/>
                                {isSubmitting ? 'Publishing...' : 'Publish News'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
