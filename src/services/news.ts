// src/services/news.ts
'use server';

import { NewsArticle, Category, userSubmittedNews } from '@/lib/data';
import { filterNewsByDistrict } from '@/ai/flows/filter-news-by-district';

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
    'User Submitted': null, // No mapping for user submitted
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
    'User Submitted': null, // No mapping for user submitted
};

const isPaidPlanMessage = (text: string | null): boolean => {
    if (!text) return false;
    return text.toLowerCase().includes('only available in paid plans');
}

async function fetchFromNewsDataIO({ district, category, query }: { district: string, category: Category, query: string }): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.warn('NewsData.io API key is not configured. Skipping fetch.');
    return [];
  }

  const apiCategory = newsDataCategoryMapping[category];
  // Use qInTitle to comply with potential free plan limitations
  let url = `https://newsdata.io/api/1/news?apikey=${apiKey}&qInTitle=${encodeURIComponent(query)}&language=kn,en`;
  if (apiCategory) {
      url += `&category=${apiCategory}`;
  }

  try {
    const response = await fetch(url, { cache: 'no-store' }); // Disable cache to get latest news
    if (!response.ok) {
      const errorBody = await response.json();
      console.error('NewsData.io API Error:', errorBody);
      // Don't throw, just return empty array so other APIs can still work
      return [];
    }
    const data = await response.json();
    if (data.status === 'success' && data.results) {
      return data.results.map((item: any): NewsArticle => {
        const content = item.content || item.description;
        return {
            id: item.article_id,
            headline: item.title,
            content: isPaidPlanMessage(content) ? null : content,
            url: item.link,
            imageUrl: item.image_url,
            embedUrl: item.video_url,
            timestamp: new Date(item.pubDate),
            source: item.source_id || 'Unknown Source',
            district: district, // Tentative district
            category: category,
            'data-ai-hint': item.keywords ? item.keywords.join(' ') : item.title.split(' ').slice(0, 2).join(' '),
        }
      });
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch from NewsData.io:', error);
    return [];
  }
}

async function fetchFromGNews({ district, category, query }: { district: string, category: Category, query: string }): Promise<NewsArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    console.warn('GNews API key is not configured. Skipping fetch.');
    return [];
  }

  const apiCategory = gNewsCategoryMapping[category];
  let url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&apikey=${apiKey}&lang=en&country=in&max=10`;
  
  if (apiCategory) {
      url += `&topic=${apiCategory}`;
  }

  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      const errorBody = await response.json();
      console.error('GNews API Error:', errorBody);
      return [];
    }
    const data = await response.json();
    if (data.articles) {
      return data.articles.map((item: any): NewsArticle => {
        const content = item.content || item.description;
        return {
            id: item.url,
            headline: item.title,
            content: isPaidPlanMessage(content) ? null : content,
            url: item.url,
            imageUrl: item.image,
            timestamp: new Date(item.publishedAt),
            source: item.source.name || 'Unknown Source',
            district: district, // Tentative district
            category: category,
            'data-ai-hint': item.title.split(' ').slice(0, 2).join(' '),
        }
      });
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch from GNews:', error);
    return [];
  }
}

/**
 * Fetches news, de-duplicates, and then uses AI to filter for relevance.
 */
export async function fetchNewsFromAPI({ district, category }: FetchNewsOptions): Promise<NewsArticle[]> {
  const query = `${district === 'Karnataka' ? 'Karnataka' : district + ' news'}`;

  // Fetch from both APIs in parallel if category is not "User Submitted"
  let combinedArticles: NewsArticle[] = [];

  if(category === 'User Submitted') {
      combinedArticles = [...userSubmittedNews];
  } else {
    const [newsDataArticles, gNewsArticles] = await Promise.all([
      fetchFromNewsDataIO({ district, category, query }),
      fetchFromGNews({ district, category, query }),
    ]);
    combinedArticles = [...newsDataArticles, ...gNewsArticles, ...userSubmittedNews];
  }


  // De-duplicate articles based on URL
  const uniqueArticlesMap = new Map<string, NewsArticle>();
  for (const article of combinedArticles) {
    if (article.url && !uniqueArticlesMap.has(article.url)) {
      uniqueArticlesMap.set(article.url, article);
    }
  }
  
  const uniqueArticles = Array.from(uniqueArticlesMap.values());
  
  if (uniqueArticles.length === 0) {
      return [];
  }

  // Use AI to filter and ensure relevance to the district
  try {
    const filteredResult = await filterNewsByDistrict({ articles: uniqueArticles, district });
    
    // Sort by timestamp descending
    const sortedArticles = filteredResult.articles.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return sortedArticles;

  } catch (error) {
    console.error("AI filtering failed. Returning unfiltered results.", error);
    // Fallback to returning unfiltered (but de-duplicated) articles if AI fails
    const sortedArticles = uniqueArticles.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return sortedArticles;
  }
}
