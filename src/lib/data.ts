

export type Source = 'DailyHunt' | 'Facebook' | 'X' | 'YouTube';
export type Category = 'General' | 'Politics' | 'Sports' | 'Crime' | 'Technology' | 'Business' | 'Entertainment';

export const newsCategories: Category[] = ['General', 'Politics', 'Sports', 'Crime', 'Technology', 'Business', 'Entertainment'];

export type NewsArticle = {
  id: string;
  district: string;
  source: Source;
  headline: string;
  content: string;
  imageUrls: string[];
  timestamp: Date;
  url: string;
  embedUrl?: string;
  category: Category;
  'data-ai-hint'?: string;
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
