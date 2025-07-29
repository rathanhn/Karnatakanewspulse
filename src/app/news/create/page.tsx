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
import { karnatakaDistricts, addUserNews } from '@/lib/data';
import { ArrowLeft, Send, Upload, Loader2, CheckCircle } from 'lucide-react';
import { KarnatakaMapIcon } from '@/components/icons';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function CreateNewsPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [headline, setHeadline] = useState('');
    const [content, setContent] = useState('');
    const [district, setDistrict] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Cloudinary state
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState('');


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
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setUploadedUrl(null); // Reset on new file selection
        }
    };
    
    const handleUpload = async () => {
        if (!file) {
             toast({ title: 'No file selected', description: 'Please select an image to upload.', variant: 'destructive'});
            return;
        }
        setUploading(true);

        // =================================================================
        // IMPORTANT: SECURE UPLOAD LOGIC
        // =================================================================
        // In a production app, you should NOT upload directly from the client
        // using your API secret. Instead, this should be a call to YOUR OWN
        // backend API endpoint.
        //
        // Your backend would:
        // 1. Receive the file or a request to upload.
        // 2. Use the Cloudinary Node.js SDK (or other server-side SDK).
        // 3. Securely sign the request with your API_SECRET.
        // 4. Upload the file to Cloudinary.
        // 5. Return the secure URL to the client.
        //
        // The code below is a CLIENT-SIDE ONLY example for prototyping and
        // WILL EXPOSE YOUR CREDENTIALS if not configured properly.
        // =================================================================

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'YOUR_UNSIGNED_UPLOAD_PRESET'); // IMPORTANT: Create an UNSIGNED upload preset in Cloudinary settings

        try {
            // Replace this with a fetch to YOUR backend endpoint
            // For example: const response = await fetch('/api/upload', { method: 'POST', body: formData });
            
            // This is a placeholder and will not work without a backend or an UNSIGNED preset.
            // Using an unsigned preset is less secure but can work for prototyping.
            toast({
                title: "Image Upload (Placeholder)",
                description: "This is where you would call your secure backend to upload the image.",
                variant: 'default',
            });
            // SIMULATING A SUCCESSFUL UPLOAD FOR UI PURPOSES
            // In a real app, you would get this URL from your backend's response.
            const simulatedUrl = URL.createObjectURL(file);
            setUploadedUrl(simulatedUrl);
             toast({ title: "Upload Successful!", description: "Image is ready to be submitted with your post." });


        } catch (error) {
            console.error('Upload error:', error);
            toast({ title: 'Upload Failed', description: 'Could not upload the image.', variant: 'destructive'});
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!headline || !content || !district || !user) {
            toast({
                title: 'Missing fields',
                description: 'Please fill out all fields and ensure you are logged in.',
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
                userId: user.uid,
                imageUrl: uploadedUrl // Pass the uploaded image URL
            });

            toast({
                title: 'News Submitted!',
                description: 'Thank you for your contribution. Your news is now live.',
            });
            
            router.push('/dashboard/my-posts');
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
                    <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-bold text-primary font-headline">
                        <KarnatakaMapIcon className="w-10 h-10" />
                        <h1>Karnataka News Pulse</h1>
                    </Link>
                    <Button asChild variant="ghost">
                        <Link href="/dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
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
                                <Label htmlFor="thumbnail">Thumbnail</Label>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="file-upload" className="flex-grow">
                                        <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={uploading || isSubmitting} />
                                        <Button type="button" variant="outline" className="w-full" asChild>
                                             <span className='truncate w-full'>
                                                {fileName ? fileName : "Select an image..."}
                                             </span>
                                        </Button>
                                    </Label>
                                    <Button type="button" onClick={handleUpload} disabled={!file || uploading || !!uploadedUrl}>
                                        {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
                                        <span>{uploadedUrl ? "Uploaded" : "Upload"}</span>
                                    </Button>
                                </div>
                                {uploadedUrl && <div className='text-sm text-green-500 flex items-center gap-2'><CheckCircle className='w-4 h-4'/> Image is ready.</div>}
                                <p className="text-xs text-muted-foreground">For security, image uploads must be handled by a backend service.</p>
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