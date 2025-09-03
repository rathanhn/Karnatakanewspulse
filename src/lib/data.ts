// src/lib/data.ts
import { z } from 'zod';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, deleteDoc, doc, Timestamp, updateDoc, getDoc, setDoc, writeBatch, limit, QueryConstraint,getCountFromServer } from "firebase/firestore";


export type Source = string;
export const newsCategories = ['Trending', 'General', 'Politics', 'Sports', 'Crime', 'Technology', 'Business', 'Entertainment', 'User Submitted'] as const;
export type Category = (typeof newsCategories)[number];

export const UserProfileSchema = z.object({
    uid: z.string(),
    displayName: z.string().nullable(),
    email: z.string(),
    photoURL: z.string().url().nullable(),
    preferredDistrict: z.string().optional(),
    preferredCategory: z.enum(newsCategories).optional(),
    notifications: z.boolean().optional().default(true),
    isAdmin: z.boolean().optional().default(false), // Admin role
});

export type UserProfile = z.infer<typeof UserProfileSchema>;


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


// --- Firestore Functions for User Profiles ---

export const createUserProfile = async (uid: string, data: Omit<UserProfile, 'uid' | 'isAdmin'>) => {
    try {
        const userDocRef = doc(db, 'users', uid);
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) {
            await setDoc(userDocRef, {
                uid,
                ...data,
                displayName: data.displayName || 'Anonymous',
                photoURL: data.photoURL || null,
                isAdmin: false, // Ensure new users are not admins
            });
        }
    } catch(error) {
        console.error("Error creating user profile: ", error);
        // We don't throw here to not block the login flow
    }
}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
        const userDocRef = doc(db, 'users', uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw new Error("Could not fetch user profile.");
    }
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    try {
        const userDocRef = doc(db, 'users', uid);
        // Prevent users from making themselves admin
        const { isAdmin, ...updatableData } = data;
        await updateDoc(userDocRef, updatableData);
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw new Error("Could not update user profile.");
    }
};


// --- Firestore Functions for User Submitted News ---

interface AddUserNewsData {
    headline: string;
    content: string;
    district: string;
    userId: string;
    imageUrl?: string | null;
    category: Category;
}

export const addUserNews = async (articleData: AddUserNewsData) => {
    try {
        const docRef = await addDoc(collection(db, "news"), {
            ...articleData,
            timestamp: serverTimestamp(),
            source: 'User Submitted',
            url: '#', // User-submitted articles don't have an external source URL
        });
        // Construct a URL for the new post
        const newUrl = `${window.location.origin}/news/post/${docRef.id}`;
        await updateDoc(docRef, { url: newUrl });

        return { ...articleData, id: docRef.id, timestamp: new Date(), url: newUrl };
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Could not submit news article.");
    }
};

export const getNewsArticleById = async (id: string): Promise<NewsArticle | null> => {
    try {
        const docRef = doc(db, "news", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const timestamp = data.timestamp as Timestamp;
            return {
                ...data,
                id: docSnap.id,
                timestamp: timestamp ? timestamp.toDate() : new Date(),
            } as NewsArticle;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching document: ", error);
        throw new Error("Could not fetch news article.");
    }
};

export const updateUserNews = async (id: string, data: Partial<AddUserNewsData>) => {
    try {
        const docRef = doc(db, "news", id);
        await updateDoc(docRef, {
            ...data,
            timestamp: serverTimestamp() // Optionally update timestamp on edit
        });
    } catch (error) {
        console.error("Error updating document: ", error);
        throw new Error("Could not update news article.");
    }
};

export const getUserNewsFromFirestore = async (userId: string): Promise<NewsArticle[]> => {
    try {
        const q = query(collection(db, "news"), where("userId", "==", userId), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const articles = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const timestamp = data.timestamp as Timestamp;
            return {
                ...data,
                id: doc.id,
                timestamp: timestamp ? timestamp.toDate() : new Date(),
            } as NewsArticle;
        });
        return articles;
    } catch (e) {
         if (e instanceof Error && e.message.includes("The query requires an index")) {
            console.warn("Firestore index not found. Fetching without sorting. Please create the required index in the Firebase console.");
            const qWithoutSort = query(collection(db, "news"), where("userId", "==", userId));
            const querySnapshot = await getDocs(qWithoutSort);
            const articles = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const timestamp = data.timestamp as Timestamp;
                return {
                    ...data,
                    id: doc.id,
                    timestamp: timestamp ? timestamp.toDate() : new Date(),
                } as NewsArticle;
            });
            // Manual sort in JS as a fallback
            return articles.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }
        console.error("Error fetching user news:", e);
        throw e;
    }
}

export const fetchUserSubmittedNews = async ({ district, limit: queryLimit, excludeUserId }: { district: string; limit?: number, excludeUserId?: string | null }): Promise<NewsArticle[]> => {
    try {
        const constraints: QueryConstraint[] = [
            where("source", "==", "User Submitted"),
            orderBy("timestamp", "desc")
        ];

        if (district !== 'Karnataka') {
            constraints.push(where("district", "==", district));
        }

        if (excludeUserId) {
            constraints.push(where("userId", "!=", excludeUserId));
        }

        if (queryLimit) {
            constraints.push(limit(queryLimit));
        }

        const q = query(collection(db, "news"), ...constraints);
        const querySnapshot = await getDocs(q);
        const articles = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const timestamp = data.timestamp as Timestamp;
            return {
                ...data,
                id: doc.id,
                timestamp: timestamp ? timestamp.toDate() : new Date(),
            } as NewsArticle;
        });
        return articles;
    } catch (e) {
        if (e instanceof Error && e.message.includes("The query requires an index")) {
             console.warn("Firestore index not found for user news query. Please create the required index in the Firebase console.");
        } else {
            console.error("Error fetching user submitted news:", e);
        }
        return [];
    }
};

export const deleteUserNews = async (postId: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, "news", postId));
    } catch (e) {
        console.error("Error deleting document: ", e);
        throw new Error("Could not delete post.");
    }
}

export const deleteAllUserPosts = async (userId: string): Promise<void> => {
    try {
        // Find all posts by the user
        const q = query(collection(db, "news"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        
        // Create a batch to delete all documents
        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });
        
        // Commit the batch
        await batch.commit();
    } catch (e) {
        console.error("Error deleting all user posts: ", e);
        throw new Error("Could not delete all posts.");
    }
};

// --- Admin Functions ---

export const getAdminDashboardStats = async (): Promise<{ totalArticles: number; totalUsers: number }> => {
    try {
        const newsCollection = collection(db, 'news');
        const usersCollection = collection(db, 'users');
        
        const newsSnapshot = await getCountFromServer(newsCollection);
        const usersSnapshot = await getCountFromServer(usersCollection);

        return {
            totalArticles: newsSnapshot.data().count,
            totalUsers: usersSnapshot.data().count,
        };
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        throw new Error("Could not fetch admin dashboard stats.");
    }
};
