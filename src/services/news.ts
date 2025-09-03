// src/services/news.ts
'use server';

import { NewsArticle, Category, fetchUserSubmittedNews } from '@/lib/data';

interface FetchNewsOptions {
  district: string;
  category?: Category;
  limit?: number;
}

const GNEWS_API_KEY = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
const NEWSDATA_API_KEY = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;


// --- GNews API Fetcher (for broad categories) ---
async function fetchFromGNews(query: string, category: string): Promise<NewsArticle[]> {
  const categoryParam = category.toLowerCase() === 'trending' ? 'general' : category.toLowerCase();
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&apiKey=${GNEWS_API_KEY}`;
  
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
    const data = await response.json();

    if (data.status !== 'ok') {
        console.error("GNews/NewsAPI API Error Response:", data.message || response.statusText);
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
    console.error('Failed to fetch from GNews/NewsAPI:', error);
    return [];
  }
}

// --- NewsData.io API Fetcher (for specific district/keyword searches) ---
async function fetchFromNewsDataIO(query: string): Promise<NewsArticle[]> {
  const url = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&country=in&language=en&q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    const data = await response.json();

    if (data.status !== 'success') {
        console.error("NewsData.io API Error Response:", data.results?.message || response.statusText);
        return [];
    }

    return (data.results || []).map((item: any): NewsArticle => ({
      id: item.link,
      headline: item.title,
      content: item.content || item.description,
      url: item.link,
      imageUrl: item.image_url,
      timestamp: new Date(item.pubDate),
      source: item.source_id || 'Unknown Source',
      district: "API Sourced", // Placeholder, will be replaced
      category: 'General', // Default category
      'data-ai-hint': item.title.split(' ').slice(0, 2).join(' '),
    }));

  } catch (error) {
    console.error('Failed to fetch from NewsData.io:', error);
    return [];
  }
}

// --- Main Exported Function ---
export async function fetchNewsFromAPI({ district, category = 'Trending', limit: queryLimit }: FetchNewsOptions): Promise<NewsArticle[]> {
  
  if (category === 'User Submitted') {
      return fetchUserSubmittedNews({ district, limit: queryLimit });
  }
  
  let apiArticles: NewsArticle[] = [];
  
  const queryParts = [];
  if (district !== 'Karnataka') {
      queryParts.push(district);
  }
  if (category !== 'Trending' && category !== 'General') {
       queryParts.push(category);
  }
  let query = queryParts.join(' ');

  if (!query) {
      query = 'Karnataka';
  }
  
  apiArticles = await fetchFromGNews(query, category);
  
  apiArticles = apiArticles.map(article => ({ ...article, district }));

  if (queryLimit) {
    apiArticles = apiArticles.slice(0, queryLimit);
  }
  
  const sortedArticles = apiArticles.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return sortedArticles;
}
