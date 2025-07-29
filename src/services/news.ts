// src/services/news.ts
'use server';

import { NewsArticle, Category } from '@/lib/data';

interface FetchNewsOptions {
  district: string;
  category: Category;
}

// Maps our internal category names to the ones NewsData.io uses.
const categoryMapping: Record<Category, string | null> = {
    Trending: null, // No equivalent, so we search all categories.
    General: 'other',
    Politics: 'politics',
    Sports: 'sports',
    Crime: 'crime',
    Technology: 'technology',
    Business: 'business',
    Entertainment: 'entertainment',
};

/**
 * Fetches news from the NewsData.io API.
 */
export async function fetchNewsFromAPI({ district, category }: FetchNewsOptions): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error('NewsData.io API key is not configured.');
  }

  // Construct the query. We search for the district name and "Karnataka".
  // This helps to narrow down the results to our region of interest.
  const query = `${district === 'Karnataka' ? 'Karnataka' : district + ' Karnataka'}`;
  
  const apiCategory = categoryMapping[category];
  
  // Build the API URL.
  let url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(query)}&language=kn,en`;

  if (apiCategory) {
      url += `&category=${apiCategory}`;
  }


  console.log("Fetching news from URL:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorBody = await response.json();
      console.error('NewsData.io API Error:', errorBody);
      throw new Error(`API request failed with status ${response.status}: ${errorBody.results?.message || response.statusText}`);
    }

    const data = await response.json();

    if (data.status === 'success' && data.results) {
      // Map the API response to our internal NewsArticle format.
      const articles: NewsArticle[] = data.results.map((item: any): NewsArticle => ({
        id: item.article_id,
        headline: item.title,
        content: item.content || item.description || null,
        url: item.link,
        imageUrl: item.image_url,
        embedUrl: item.video_url, // NewsData.io provides 'video_url'
        timestamp: new Date(item.pubDate),
        source: item.source_id || 'Unknown Source',
        district: district, // We assign the queried district.
        category: category,
        'data-ai-hint': item.keywords ? item.keywords.join(' ') : item.title.split(' ').slice(0, 2).join(' '),
      }));
      return articles;
    } else {
      console.warn('No results found or API error:', data);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch news from NewsData.io:', error);
    throw error;
  }
}
