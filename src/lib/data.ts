// src/lib/data.ts
import { z } from 'zod';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";


export type Source = string;
export const newsCategories = ['Trending', 'General', 'Politics', 'Sports', 'Crime', 'Technology', 'Business', 'Entertainment', 'User Submitted'] as const;
export type Category = (typeof newsCategories)[number];

export const NewsArticleSchema = z.object({
  id: z.string(),
  headline: z.string(),
  content: z.string().nullable(),
  url: z.string(),
  imageUrl: z.string().nullable(),
  embedUrl: z.string().optional(),
  timestamp: z.any(), // Firestore timestamp is not a JS Date initially
  source: z.string(),
  district: z.string(),
  category: z.enum(newsCategories),
  'data-ai-hint': z.string().optional(),
  // For user-submitted posts
  userId: z.string().optional(), 
});

export type NewsArticle = z.infer<typeof NewsArticleSchema>;

export const karnatakaDistrictsTuple = [
  'Karnataka', // Added "Karnataka" to represent all districts
  'Bagalkote',
  'Ballari',
  'Belagavi',
  'Bengaluru Rural',
  'Bengaluru Urban',
  'Bidar',
  'Chamarajanagar',
  'Chikkaballapura',
  'Chikkamagaluru',
  'Chitradurga',
  'Dakshina Kannada',
  'Davanagere',
  'Dharwad',
  'Gadag',
  'Hassan',
  'Haveri',
  'Kalaburagi',
  'Kodagu',
  'Kolar',
  'Koppal',
  'Mandya',
  'Mysuru',
  'Raichur',
  'Ramanagara',
  'Shivamogga',
  'Tumakuru',
  'Udupi',
  'Uttara Kannada',
  'Vijayanagara',
  'Vijayapura',
  'Yadgir',
] as const;


export const karnatakaDistricts: string[] = [...karnatakaDistrictsTuple];


// --- Firestore Functions for User Submitted News ---

interface AddUserNewsData {
    headline: string;
    content: string;
    district: string;
    userId: string;
    imageUrl?: string | null;
}

export const addUserNews = async (articleData: AddUserNewsData) => {
    try {
        const docRef = await addDoc(collection(db, "news"), {
            ...articleData,
            timestamp: serverTimestamp(),
            source: 'User Submitted',
            category: 'User Submitted',
            url: '#', // User-submitted articles don't have an external source URL
        });
        return { ...articleData, id: docRef.id, timestamp: new Date() };
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Could not submit news article.");
    }
};

export const getUserNewsFromFirestore = async (userId: string): Promise<NewsArticle[]> => {
    try {
        // The orderBy clause was removed temporarily to prevent a crash.
        // A composite index is required in Firestore to filter by one field (userId) and order by another (timestamp).
        // The user must create this index in the Firebase console using the link from the error message.
        const q = query(collection(db, "news"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const articles = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                timestamp: data.timestamp?.toDate() || new Date(),
            } as NewsArticle;
        });
        // Once the index is created, re-add `orderBy("timestamp", "desc")` to the query
        // and remove this manual sort.
        return articles.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (e) {
        console.error("Error fetching user news:", e);
        return [];
    }
}

export const deleteUserNews = async (postId: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, "news", postId));
    } catch (e) {
        console.error("Error deleting document: ", e);
        throw new Error("Could not delete post.");
    }
}
