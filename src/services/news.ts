// src/services/news.ts
'use server';

import { NewsArticle, Category, fetchUserSubmittedNews } from '@/lib/data';

interface FetchNewsOptions {
  district: string;
  category?: Category;
  limit?: number;
}

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;


// --- NewsAPI.org Fetcher ---
async function fetchFromNewsAPI(query: string, category: string): Promise<NewsArticle[]> {
  const categoryParam = category.toLowerCase() === 'trending' ? '' : `&category=${category.toLowerCase()}`;
  let url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
  
  // NewsAPI requires a query for /everything, so if there's no query, we use top-headlines for general news
  if (!query) {
      url = `https://newsapi.org/v2/top-headlines?country=in${categoryParam}&apiKey=${NEWS_API_KEY}`;
  }
  
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
    const data = await response.json();

    if (data.status !== 'ok') {
        console.error("NewsAPI Error Response:", data.message || response.statusText);
        // Provide a more specific error message if the key is invalid
        if (data.code === 'apiKeyInvalid') {
            throw new Error('The provided News API key is invalid or has expired.');
        }
        return [];
    }
    
    return (data.articles || []).map((item: any): NewsArticle => ({
      id: item.url,
      headline: item.title,
      content: item.content || item.description,
      url: item.url,
      imageUrl: item.urlToImage,
      timestamp: new Date(item.publishedAt),
      source: item.source.name,
      district: "API Sourced", // Placeholder, will be replaced
      category: category as Category,
      'data-ai-hint': item.title.split(' ').slice(0, 2).join(' '),
    }));

  } catch (error) {
    console.error('Failed to fetch from NewsAPI:', error);
    // Re-throw the specific error for the caller to handle
    if (error instanceof Error) {
        throw error;
    }
    return [];
  }
}


// --- Main Exported Function ---
export async function fetchNewsFromAPI({ district, category = 'Trending', limit: queryLimit }: FetchNewsOptions): Promise<NewsArticle[]> {
  
  if (!NEWS_API_KEY) {
    const errorMessage = "News API key (NEXT_PUBLIC_NEWS_API_KEY) is not configured in environment variables.";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (category === 'User Submitted') {
      return fetchUserSubmittedNews({ district, limit: queryLimit });
  }
  
  let apiArticles: NewsArticle[] = [];
  
  const queryParts = [];
  if (district !== 'Karnataka') {
      queryParts.push(district);
  }
   // Add category to the query only if it's not a general one, to get more specific results
  if (category !== 'Trending' && category !== 'General' && category) {
       queryParts.push(category);
  }
  let query = queryParts.join(' AND ');
  
  apiArticles = await fetchFromNewsAPI(query, category);
  
  apiArticles = apiArticles.map(article => ({ ...article, district }));

  if (queryLimit) {
    apiArticles = apiArticles.slice(0, queryLimit);
  }
  
  const sortedArticles = apiArticles.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return sortedArticles;
}
