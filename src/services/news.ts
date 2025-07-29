// src/services/news.ts
'use server';

import { NewsArticle, Category } from '@/lib/data';

interface FetchNewsOptions {
  district: string;
  category: Category;
}

const newsDataCategoryMapping: Record<Category, string | null> = {
    Trending: null,
    General: 'other',
    Politics: 'politics',
    Sports: 'sports',
    Crime: 'crime',
    Technology: 'technology',
    Business: 'business',
    Entertainment: 'entertainment',
};

const gNewsCategoryMapping: Record<Category, string | null> = {
    Trending: 'general',
    General: 'general',
    Politics: 'politics',
    Sports: 'sports',
    Crime: 'nation', 
    Technology: 'technology',
    Business: 'business',
    Entertainment: 'entertainment',
};

async function fetchFromNewsDataIO({ district, category, query }: { district: string, category: Category, query: string }): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.warn('NewsData.io API key is not configured. Skipping fetch.');
    return [];
  }

  const apiCategory = newsDataCategoryMapping[category];
  let url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(query)}&language=kn,en`;
  if (apiCategory) {
      url += `&category=${apiCategory}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorBody = await response.json();
      console.error('NewsData.io API Error:', errorBody);
      throw new Error(`NewsData.io API request failed: ${errorBody.results?.message || response.statusText}`);
    }
    const data = await response.json();
    if (data.status === 'success' && data.results) {
      return data.results.map((item: any): NewsArticle => ({
        id: item.article_id,
        headline: item.title,
        content: item.content || item.description || null,
        url: item.link,
        imageUrl: item.image_url,
        embedUrl: item.video_url,
        timestamp: new Date(item.pubDate),
        source: item.source_id || 'Unknown Source',
        district: district,
        category: category,
        'data-ai-hint': item.keywords ? item.keywords.join(' ') : item.title.split(' ').slice(0, 2).join(' '),
      }));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch from NewsData.io:', error);
    return []; // Return empty array on error
  }
}

async function fetchFromGNews({ district, category, query }: { district: string, category: Category, query: string }): Promise<NewsArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    console.warn('GNews API key is not configured. Skipping fetch.');
    return [];
  }

  const apiCategory = gNewsCategoryMapping[category];
  let url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&apikey=${apiKey}&lang=en&country=in`;
  
  if (apiCategory) {
      url += `&topic=${apiCategory}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorBody = await response.json();
      console.error('GNews API Error:', errorBody);
      throw new Error(`GNews API request failed: ${errorBody.errors?.join(', ') || response.statusText}`);
    }
    const data = await response.json();
    if (data.articles) {
      return data.articles.map((item: any): NewsArticle => ({
        id: item.url, // GNews doesn't have a stable ID, use URL
        headline: item.title,
        content: item.content || item.description || null,
        url: item.url,
        imageUrl: item.image,
        timestamp: new Date(item.publishedAt),
        source: item.source.name || 'Unknown Source',
        district: district,
        category: category,
         'data-ai-hint': item.title.split(' ').slice(0, 2).join(' '),
      }));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch from GNews:', error);
    return []; // Return empty array on error
  }
}


/**
 * Fetches news from multiple APIs, combines, and de-duplicates them.
 */
export async function fetchNewsFromAPI({ district, category }: FetchNewsOptions): Promise<NewsArticle[]> {
  const query = `${district === 'Karnataka' ? 'Karnataka' : district + ' Karnataka'}`;

  // Fetch from both APIs in parallel
  const [newsDataArticles, gNewsArticles] = await Promise.all([
    fetchFromNewsDataIO({ district, category, query }),
    fetchFromGNews({ district, category, query }),
  ]);

  const combinedArticles = [...newsDataArticles, ...gNewsArticles];

  // De-duplicate articles based on URL
  const uniqueArticles = new Map<string, NewsArticle>();
  for (const article of combinedArticles) {
    if (!uniqueArticles.has(article.url)) {
      uniqueArticles.set(article.url, article);
    }
  }
  
  const articles = Array.from(uniqueArticles.values());

  // Sort by timestamp descending
  articles.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return articles;
}
