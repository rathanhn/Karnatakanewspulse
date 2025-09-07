// src/services/news.ts
'use server';

import { NewsArticle, Category, fetchUserSubmittedNewsWithAuthors } from '@/lib/data';
import { mockApiNews } from '@/lib/mock-data';

interface FetchNewsOptions {
  district: string;
  category?: Category;
  limit?: number;
}


// --- Mock News Fetcher ---
async function fetchFromMockAPI(district: string, category: Category, queryLimit?: number): Promise<NewsArticle[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let results = mockApiNews.filter(article => {
    const categoryMatch = category === 'Trending' || category === 'General' || article.category === category;
    const districtMatch = district === 'Karnataka' || article.district === district;
    return categoryMatch && districtMatch;
  });

  if (queryLimit) {
    results = results.slice(0, queryLimit);
  }

  return results.map(article => ({ ...article, district }));
}


// --- Main Exported Function ---
export async function fetchNewsFromAPI({ district, category = 'Trending', limit: queryLimit }: FetchNewsOptions): Promise<NewsArticle[]> {

  if (category === 'User Submitted') {
      return fetchUserSubmittedNewsWithAuthors({ district, limit: queryLimit });
  }
  
  let apiArticles: NewsArticle[] = [];
  
  apiArticles = await fetchFromMockAPI(district, category, queryLimit);
  
  const sortedArticles = apiArticles.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return sortedArticles;
}
