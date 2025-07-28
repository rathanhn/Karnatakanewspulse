// src/lib/data.ts
import { GeneratedNewsArticle } from "@/ai/flows/generate-news";

export type Source = 'DailyHunt' | 'Facebook' | 'X' | 'YouTube';
export type Category = 'General' | 'Politics' | 'Sports' | 'Crime' | 'Technology' | 'Business' | 'Entertainment' | 'Trending';

export const newsCategories: (Category)[] = ['Trending', 'General', 'Politics', 'Sports', 'Crime', 'Technology', 'Business', 'Entertainment'];

export type NewsArticle = GeneratedNewsArticle & {
  id: string;
  timestamp: Date;
  category: Category;
};


export const karnatakaDistricts: string[] = [
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
];

// Mock data is no longer used for displaying news, but kept for type reference.
export const mockNewsData: NewsArticle[] = [];
