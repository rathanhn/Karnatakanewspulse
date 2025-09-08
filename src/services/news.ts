// src/services/news.ts
'use server';

import { NewsArticle, Category, fetchUserSubmittedNewsWithAuthors } from '@/lib/data';
import { mockApiNews } from '@/lib/mock-data';
import { filterNewsByDistrict } from '@/ai/flows/filter-news-by-district';
import { filterNewsByCategory } from '@/ai/flows/filter-news-by-category';

interface FetchNewsOptions {
  district: string;
  category?: Category;
  limit?: number;
}


// --- Mock News Fetcher ---
async function fetchFromMockAPI(district: string, category: Category, queryLimit?: number): Promise<NewsArticle[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let results = mockApiNews;

  if (category && category !== 'Trending' && category !== 'General') {
    results = results.filter(article => article.category === category);
  }

  // District filtering is less strict for mock data, more for demonstration.
  // The AI filter will handle the precise filtering later.
  if (district !== 'Karnataka') {
     results = results.filter(article => article.district === district);
  }
  
  if (queryLimit) {
    results = results.slice(0, queryLimit);
  }

  return results.map(article => ({ ...article }));
}

// --- MediaStack API Fetcher ---
async function fetchFromMediaStack(district: string, category: Category, queryLimit?: number): Promise<NewsArticle[]> {
    const apiKey = process.env.MEDIASTACK_API_KEY;
    if (!apiKey || apiKey === 'your_mediastack_api_key') {
        console.warn("MediaStack API key not found or is default. Skipping fetch.");
        return [];
    }

    const keywords = district === 'Karnataka' ? 'Karnataka' : `${district} Karnataka`;
    const languages = 'en'; // MediaStack has limited support for other languages
    const limit = queryLimit || 25;
    
    // MediaStack uses different category slugs
    const mediaStackCategory = category.toLowerCase() === 'trending' ? 'general' : category.toLowerCase();

    const url = `http://api.mediastack.com/v1/news?access_key=${apiKey}&keywords=${encodeURIComponent(keywords)}&languages=${languages}&limit=${limit}&categories=${mediaStackCategory}&sort=published_desc`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorBody = await response.json();
            console.error("MediaStack API Error:", errorBody);
            return [];
        }
        const data = await response.json();

        return data.data.filter((item: any) => item.title && item.url).map((item: any): NewsArticle => ({
            id: `mediastack-${item.url}`,
            headline: item.title,
            content: item.description,
            url: item.url,
            imageUrl: item.image,
            timestamp: new Date(item.published_at),
            source: item.source,
            district: district, // Assign the queried district
            category: item.category.charAt(0).toUpperCase() + item.category.slice(1) as Category,
            'data-ai-hint': item.title.split(' ').slice(0, 2).join(' '),
        }));

    } catch (error) {
        console.error("Failed to fetch from MediaStack:", error);
        return [];
    }
}

// --- GNews API Fetcher ---
async function fetchFromGNews(district: string, category: Category, queryLimit?: number): Promise<NewsArticle[]> {
    const apiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
    if (!apiKey || apiKey === 'your_gnews_api_key') {
        console.warn("GNews API key not found or is default. Skipping fetch.");
        return [];
    }
    
    const q = district === 'Karnataka' ? 'Karnataka' : `${district} Karnataka`;
    const lang = 'en';
    const limit = queryLimit || 10; // GNews limit is smaller
    
    let topic: string = '';
    if (category && category !== 'Trending' && category !== 'General' && category !== 'User Submitted') {
        topic = category.toLowerCase();
    }
    
    const topicQuery = topic ? `&topic=${topic}` : '';

    const url = `https://gnews.io/api/v4/top-headlines?q=${encodeURIComponent(q)}&lang=${lang}&max=${limit}${topicQuery}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
         if (!response.ok) {
            const errorBody = await response.json();
            console.error("GNews API Error:", errorBody);
            return [];
        }
        const data = await response.json();
        
        return data.articles.filter((item: any) => item.title && item.url).map((item: any): NewsArticle => ({
            id: `gnews-${item.url}`,
            headline: item.title,
            content: item.description,
            url: item.url,
            imageUrl: item.image,
            timestamp: new Date(item.publishedAt),
            source: item.source.name,
            district: district,
            category: category || 'General', // GNews doesn't return category in this endpoint
            'data-ai-hint': item.title.split(' ').slice(0, 2).join(' '),
        }));
    } catch (error) {
        console.error("Failed to fetch from GNews:", error);
        return [];
    }
}

// --- NewsAPI.org Fetcher ---
async function fetchFromNewsAPI(district: string, category: Category, queryLimit?: number): Promise<NewsArticle[]> {
    const apiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY; // Using GNews key for NewsAPI as well, assuming it's the intended provider
    if (!apiKey || apiKey === 'your_gnews_api_key' || apiKey === 'your_newsapi_api_key') {
        console.warn("NewsAPI.org key not found or is default. Skipping fetch.");
        return [];
    }

    const q = district === 'Karnataka' ? 'Karnataka' : `"${district}" AND "Karnataka"`;
    const language = 'en';
    const pageSize = queryLimit || 20;

    let categoryQuery = '';
    if (category && category !== 'Trending' && category !== 'User Submitted' && category !== 'General') {
      categoryQuery = `&category=${category.toLowerCase()}`;
    }

    const url = `https://newsapi.org/v2/top-headlines?q=${encodeURIComponent(q)}&language=${language}&pageSize=${pageSize}${categoryQuery}&apiKey=${apiKey}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorBody = await response.json();
            console.error("NewsAPI.org API Error:", errorBody);
            return [];
        }
        const data = await response.json();

        return data.articles.filter((item: any) => item.title && item.url).map((item: any): NewsArticle => ({
            id: `newsapi-${item.url}`,
            headline: item.title,
            content: item.description,
            url: item.url,
            imageUrl: item.urlToImage,
            timestamp: new Date(item.publishedAt),
            source: item.source.name,
            district: district,
            category: category || 'General',
            'data-ai-hint': item.title.split(' ').slice(0, 2).join(' '),
        }));

    } catch (error) {
        console.error("Failed to fetch from NewsAPI.org:", error);
        return [];
    }
}


// --- Main Exported Function ---
export async function fetchNewsFromAPI({ district, category = 'Trending', limit: queryLimit }: FetchNewsOptions): Promise<NewsArticle[]> {

  if (category === 'User Submitted') {
      return fetchUserSubmittedNewsWithAuthors({ district, limit: queryLimit });
  }
  
  // Fetch from all sources in parallel
  const [mockArticles, mediaStackArticles, gnewsArticles, newsApiArticles] = await Promise.all([
    fetchFromMockAPI(district, category, queryLimit),
    fetchFromMediaStack(district, category, queryLimit),
    fetchFromGNews(district, category, queryLimit),
    fetchFromNewsAPI(district, category, queryLimit),
  ]);

  const combinedArticles = [...mockArticles, ...mediaStackArticles, ...gnewsArticles, ...newsApiArticles];

  // Remove duplicates based on URL
  const uniqueArticles = Array.from(new Map(combinedArticles.map(item => [item.url, item])).values());
  
  let articlesToReturn = uniqueArticles;

  // AI-based filtering for District if a specific one is selected
  if (district !== 'Karnataka' && articlesToReturn.length > 0) {
      try {
          const { articles: filteredArticles } = await filterNewsByDistrict({ articles: articlesToReturn, district: district as any });
          articlesToReturn = filteredArticles;
      } catch (e) {
          console.error("AI district filtering failed, returning unfiltered results:", e);
      }
  }

  // AI-based filtering for Category if a specific one is selected
  if (category !== 'Trending' && category !== 'General' && articlesToReturn.length > 0) {
    try {
        const { articles: filteredArticles } = await filterNewsByCategory({ articles: articlesToReturn, category: category as any });
        articlesToReturn = filteredArticles;
    } catch (e) {
        console.error("AI category filtering failed, returning unfiltered results:", e);
    }
  }
  
  // Sort the final list by timestamp in descending order
  const sortedArticles = articlesToReturn.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return sortedArticles;
}
