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
    console.warn('GNews API key is not configured. Skipping fetch from GNews.');
    return [];
  }
  
  const categoryParam = category.toLowerCase() === 'trending' ? 'general' : category.toLowerCase();
  const url = `https://gnews.io/api/v4/top-headlines?country=in&lang=en&q=${encodeURIComponent(query)}&category=${categoryParam}&apikey=${apiKey}`;
  console.log(`[LOG] Fetching from GNews: ${url.replace(apiKey, 'REDACTED')}`);

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
    const data = await response.json();
    console.log(`[LOG] GNews raw response status: ${response.status}`);

    if (!response.ok) {
        console.error("[LOG] GNews API Error Response:", data);
        throw new Error(`GNews API Error: ${data.errors?.join(', ') || response.statusText}`);
    }
    
    console.log(`[LOG] GNews raw data received:`, data);

    const articles = (data.articles || []).map((item: any): NewsArticle => ({
      id: item.url,
      headline: item.title,
      content: item.content || item.description,
      url: item.url,
      imageUrl: item.image,
      timestamp: new Date(item.publishedAt),
      source: item.source.name,
      district: "API Sourced", // Placeholder, will be replaced
      category: category as Category,
      'data-ai-hint': item.title.split(' ').slice(0, 2).join(' '),
    }));
    console.log(`[LOG] Mapped ${articles.length} articles from GNews.`);
    return articles;

  } catch (error) {
    console.error('[LOG] Failed to fetch from GNews:', error);
    return [];
  }
}

// --- NewsData.io API Fetcher (for specific district/keyword searches) ---
async function fetchFromNewsDataIO(query: string): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) {
    console.warn('NewsData.io API key is not configured. Skipping fetch from NewsData.io.');
    return [];
  }
  
  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=in&language=en&q=${encodeURIComponent(query)}`;
  console.log(`[LOG] Fetching from NewsData.io: ${url.replace(apiKey, 'REDACTED')}`);

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    const data = await response.json();
    console.log(`[LOG] NewsData.io raw response status: ${response.status}`);

    if (!response.ok) {
        console.error("[LOG] NewsData.io API Error Response:", data);
        throw new Error(`NewsData.io Error: ${data.results?.message || response.statusText}`);
    }

    console.log(`[LOG] NewsData.io raw data received:`, data);

    const articles = (data.results || []).map((item: any): NewsArticle => ({
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

    console.log(`[LOG] Mapped ${articles.length} articles from NewsData.io.`);
    return articles;

  } catch (error) {
    console.error('[LOG] Failed to fetch from NewsData.io:', error);
    return [];
  }
}

// --- Main Exported Function ---
export async function fetchNewsFromAPI({ district, category = 'Trending', limit: queryLimit }: FetchNewsOptions): Promise<NewsArticle[]> {
  
  console.log(`[LOG] fetchNewsFromAPI called with: district="${district}", category="${category}", limit=${queryLimit}`);
  
  // Always fetch user-submitted news for the given district
  const userArticles = await fetchUserSubmittedNews({ district, limit: queryLimit });

  // If the category is 'User Submitted', we only return those articles.
  if (category === 'User Submitted') {
      console.log(`[LOG] Category is "User Submitted", returning ${userArticles.length} articles.`);
      return userArticles;
  }
  
  let apiArticles: NewsArticle[] = [];
  
  // Construct the query for the APIs
  const queryParts = [];
  if (district !== 'Karnataka') {
      queryParts.push(district);
  }
  if (category !== 'Trending' && category !== 'General') {
       queryParts.push(category);
  }
  let query = queryParts.join(' ');

  // If query is still empty (e.g., "All Karnataka" and "Trending"), use a broad term.
  if (!query) {
      query = 'Karnataka';
  }
  
  console.log(`[LOG] Constructed API query: "${query}"`);

  // Use different APIs based on what is being requested
  if (category === 'Trending' || category === 'General') {
      console.log(`[LOG] Using GNews for broad category: ${category}`);
      apiArticles = await fetchFromGNews(query, category);
  } else {
      console.log(`[LOG] Using NewsData.io for specific query: "${query}"`);
      apiArticles = await fetchFromNewsDataIO(query);
  }
  
  // Assign the selected district to the fetched articles for consistency
  apiArticles = apiArticles.map(article => ({ ...article, district }));

  if (queryLimit) {
    apiArticles = apiArticles.slice(0, queryLimit);
    console.log(`[LOG] Sliced API articles to limit: ${queryLimit}. Count: ${apiArticles.length}`);
  }
  
  // Combine user-submitted articles with API articles
  const allArticles = [...userArticles, ...apiArticles];
  
  // Sort all articles by date, newest first
  const sortedArticles = allArticles.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  console.log(`[LOG] Returning a total of ${sortedArticles.length} sorted articles.`);
  return sortedArticles;
}