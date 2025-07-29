// src/lib/data.ts

export type Source = string; // Can be any string from NewsData.io
export type Category = 'General' | 'Politics' | 'Sports' | 'Crime' | 'Technology' | 'Business' | 'Entertainment' | 'Trending';

export const newsCategories: (Category)[] = ['Trending', 'General', 'Politics', 'Sports', 'Crime', 'Technology', 'Business', 'Entertainment'];

export interface NewsArticle {
  id: string;
  headline: string;
  content: string | null;
  url: string;
  imageUrl: string | null;
  embedUrl?: string;
  timestamp: Date;
  source: Source;
  district: string;
  category: Category;
  'data-ai-hint'?: string;
}

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
