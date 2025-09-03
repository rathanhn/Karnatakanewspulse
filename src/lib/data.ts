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

const AuthorSchema = z.object({
    uid: z.string(),
    displayName: z.string().nullable(),
    photoURL: z.string().url().nullable(),
});

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
  author: AuthorSchema.optional(), // Embed author details
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
        // Use set with merge:true to create or update the document.
        await setDoc(userDocRef, updatableData, { merge: true });
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

export const fetchUserSubmittedNews = async ({ district, limit: queryLimit }: { district: string; limit?: number }): Promise<NewsArticle[]> => {
    const processSnapshot = (querySnapshot: any) => {
        const articles = querySnapshot.docs.map((doc: any) => {
            const data = doc.data();
            const timestamp = data.timestamp as Timestamp;
            return {
                ...data,
                id: doc.id,
                timestamp: timestamp ? timestamp.toDate() : new Date(),
            } as NewsArticle;
        });
        return articles;
    }
    
    try {
        const constraints: QueryConstraint[] = [
            where("source", "==", "User Submitted"),
            orderBy("timestamp", "desc")
        ];

        if (district !== 'Karnataka') {
            constraints.push(where("district", "==", district));
        }

        if (queryLimit) {
            constraints.push(limit(queryLimit));
        }

        const q = query(collection(db, "news"), ...constraints);
        const querySnapshot = await getDocs(q);
        return processSnapshot(querySnapshot);

    } catch (e) {
        if (e instanceof Error && e.message.includes("The query requires an index")) {
             console.warn("Firestore index not found for user news query. Please create the required index in the Firebase console. Fetching without sort order as a fallback.");
            // Fallback query without the orderBy clause
            const constraints: QueryConstraint[] = [where("source", "==", "User Submitted")];
             if (district !== 'Karnataka') {
                constraints.push(where("district", "==", district));
            }
            if (queryLimit) {
                constraints.push(limit(queryLimit));
            }
            const fallbackQuery = query(collection(db, "news"), ...constraints);
            const querySnapshot = await getDocs(fallbackQuery);
            const articles = processSnapshot(querySnapshot);
            // Manual sort as a final fallback.
            return articles.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        } else {
            console.error("Error fetching user submitted news:", e);
        }
        return [];
    }
};

export const fetchUserSubmittedNewsWithAuthors = async ({ district, limit: queryLimit }: { district: string; limit?: number }): Promise<NewsArticle[]> => {
    const news = await fetchUserSubmittedNews({ district, limit: queryLimit });
    
    // Create a unique set of author IDs to fetch
    const authorIds = [...new Set(news.map(n => n.userId).filter(Boolean))];

    if (authorIds.length === 0) {
        return news;
    }

    // Fetch all author profiles in a single batch (more efficient)
    const authorProfiles = new Map<string, UserProfile>();
    // Firestore 'in' query can take at most 30 elements
    const subqueries = [];
    for (let i = 0; i < authorIds.length; i += 30) {
      const subquery = getDocs(query(collection(db, 'users'), where('uid', 'in', authorIds.slice(i, i + 30))));
      subqueries.push(subquery);
    }

    const subquerySnapshots = await Promise.all(subqueries);

    for (const subquerySnapshot of subquerySnapshots) {
      for (const doc of subquerySnapshot.docs) {
        const profile = doc.data() as UserProfile;
        authorProfiles.set(profile.uid, profile);
      }
    }


    // Map author profiles back to news articles
    return news.map(article => {
        if (article.userId) {
            const author = authorProfiles.get(article.userId);
            return {
                ...article,
                author: author ? {
                    uid: author.uid,
                    displayName: author.displayName,
                    photoURL: author.photoURL
                } : undefined
            };
        }
        return article;
    });
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
