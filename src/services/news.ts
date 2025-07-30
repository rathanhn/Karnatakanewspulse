// src/services/news.ts
'use server';

import { NewsArticle, Category, fetchUserSubmittedNews } from '@/lib/data';

interface FetchNewsOptions {
  district: string;
  category?: Category;
  limit?: number;
}

// --- GNews API Fetcher (for broad categories) ---
async function fetchFromGNews(query: string, category: string): Promise<NewsArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    console.warn('GNews API key is not configured. Skipping fetch.');
    return [];
  }
  
  const categoryParam = category.toLowerCase() === 'trending' ? 'general' : category.toLowerCase();
  let url = `https://gnews.io/api/v4/top-headlines?country=in&lang=en&q=${encodeURIComponent(query)}&category=${categoryParam}&apikey=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
    if (!response.ok) {
        const errorData = await response.json();
        console.error("GNews API Error:", errorData);
        throw new Error(errorData.errors.join(', '));
    }
    const data = await response.json();
    
    return (data.articles || []).map((item: any): NewsArticle => ({
      id: item.url,
      headline: item.title,
      content: item.content || item.description,
      url: item.url,
      imageUrl: item.image,
      timestamp: new Date(item.publishedAt),
      source: item.source.name,
      district: "API Sourced", // Placeholder
      category: category as Category,
      'data-ai-hint': item.title.split(' ').slice(0, 2).join(' '),
    }));

  } catch (error) {
    console.error('Failed to fetch from GNews:', error);
    return [];
  }
}

// --- NewsData.io API Fetcher (for specific district/keyword searches) ---
async function fetchFromNewsDataIO(query: string): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) {
    console.warn('NewsData.io API key is not configured. Skipping fetch.');
    return [];
  }
  
  let url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=in&language=en&q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) {
        const errorData = await response.json();
        console.error("NewsData.io API Error:", errorData);
        throw new Error(errorData.results?.message || "NewsData.io request failed");
    }
    const data = await response.json();

    return (data.results || []).map((item: any): NewsArticle => ({
      id: item.link,
      headline: item.title,
      content: item.content || item.description,
      url: item.link,
      imageUrl: item.image_url,
      timestamp: new Date(item.pubDate),
      source: item.source_id || 'Unknown Source',
      district: item.country?.includes('India') ? 'API Sourced' : item.country, // Placeholder
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
  
  // Always fetch user-submitted news for the given district
  const userArticles = await fetchUserSubmittedNews({ district, limit: queryLimit });

  // If the category is 'User Submitted', we only return those articles.
  if (category === 'User Submitted') {
      return userArticles;
  }
  
  let apiArticles: NewsArticle[] = [];
  
  // Construct the query for the APIs
  let query = (district === 'Karnataka' ? '' : district) + ' ' + (category === 'Trending' ? '' : category);
  query = query.trim();
  if (!query) query = 'Karnataka'; // Fallback query for broad searches
  
  // Use different APIs based on what is being requested
  if (category === 'Trending' || category === 'General') {
      apiArticles = await fetchFromGNews(query, category);
  } else {
      // For more specific queries, NewsData.io is better
      apiArticles = await fetchFromNewsDataIO(query);
  }
  
  // Assign the selected district to the fetched articles for consistency
  apiArticles = apiArticles.map(article => ({ ...article, district }));

  if (queryLimit) {
    apiArticles = apiArticles.slice(0, queryLimit);
  }
  
  // Combine user-submitted articles with API articles
  const allArticles = [...userArticles, ...apiArticles];
  
  // Sort all articles by date, newest first
  return allArticles.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
