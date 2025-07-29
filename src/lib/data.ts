// src/lib/data.ts
import { z } from 'zod';

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
  timestamp: z.coerce.date(),
  source: z.string(),
  district: z.string(),
  category: z.enum(newsCategories),
  'data-ai-hint': z.string().optional(),
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

// This is a temporary, in-memory store for user-submitted articles.
// In a real application, this would be a database like Firestore.
export const userSubmittedNews: NewsArticle[] = [];

export const addUserNews = (article: Omit<NewsArticle, 'id' | 'timestamp' | 'source' | 'category' | 'url'>) => {
    const newArticle: NewsArticle = {
        ...article,
        id: `user-${new Date().toISOString()}`,
        timestamp: new Date(),
        source: 'User Submitted',
        category: 'User Submitted',
        url: '#', // User-submitted articles don't have an external source URL
    };
    userSubmittedNews.unshift(newArticle); // Add to the beginning of the array
    return newArticle;
}
