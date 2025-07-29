// src/services/news.ts
'use server';

import { NewsArticle, Category } from '@/lib/data';
import { filterNewsByDistrict } from '@/ai/flows/filter-news-by-district';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";

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

async function fetchFromNewsDataIO({ district, category, query: queryParam }: { district: string, category: Category, query: string }): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.warn('NewsData.io API key is not configured. Skipping fetch.');
    return [];
  }

  const apiCategory = newsDataCategoryMapping[category];
  // Use qInTitle to comply with potential free plan limitations
  let url = `https://newsdata.io/api/1/news?apikey=${apiKey}&qInTitle=${encodeURIComponent(queryParam)}&language=kn,en`;
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

async function fetchFromGNews({ district, category, query: queryParam }: { district: string, category: Category, query: string }): Promise<NewsArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    console.warn('GNews API key is not configured. Skipping fetch.');
    return [];
  }

  const apiCategory = gNewsCategoryMapping[category];
  let url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(queryParam)}&apikey=${apiKey}&lang=en&country=in&max=10`;
  
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

export async function fetchUserSubmittedNews({ district }: { district: string }): Promise<NewsArticle[]> {
    try {
        const newsCollection = collection(db, "news");
        
        let q;
        if (district === 'Karnataka') {
           q = query(newsCollection, 
               orderBy("timestamp", "desc")
           );
        } else {
           q = query(newsCollection, 
               where("district", "==", district), 
               orderBy("timestamp", "desc")
           );
        }
       
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            const timestamp = data.timestamp as Timestamp;
            return {
                ...data,
                id: doc.id,
                timestamp: timestamp ? timestamp.toDate() : new Date(),
            } as NewsArticle;
        });
    } catch (error) {
        console.error("Error fetching user submitted news from Firestore:", error);
        return [];
    }
}


/**
 * Fetches news from external APIs and combines it with user-submitted news.
 */
export async function fetchNewsFromAPI({ district, category }: FetchNewsOptions): Promise<NewsArticle[]> {
  // 1. Fetch user-submitted news from Firestore. This happens for all categories.
  const userArticles = await fetchUserSubmittedNews({ district });

  // 2. If the category is "User Submitted", we only return those articles.
  if (category === 'User Submitted') {
      return userArticles;
  }

  // 3. Fetch from external APIs for other categories.
  const query = `${district === 'Karnataka' ? 'Karnataka' : district + ' news'}`;
  
  const [newsDataArticles, gNewsArticles] = await Promise.all([
    fetchFromNewsDataIO({ district, category, query }),
    fetchFromGNews({ district, category, query }),
  ]);
  const combinedApiArticles = [...newsDataArticles, ...gNewsArticles];

  // De-duplicate API articles based on URL
  const uniqueArticlesMap = new Map<string, NewsArticle>();
  for (const article of combinedApiArticles) {
    if (article.url && !uniqueArticlesMap.has(article.url)) {
      uniqueArticlesMap.set(article.url, article);
    }
  }
  let uniqueApiArticles = Array.from(uniqueArticlesMap.values());

  // Use AI to filter and ensure relevance to the district if there are articles.
  if (uniqueApiArticles.length > 0 && district !== 'Karnataka') {
      try {
          const filteredResult = await filterNewsByDistrict({ articles: uniqueApiArticles, district });
          uniqueApiArticles = filteredResult.articles;
      } catch (error) {
          console.error("AI filtering failed. Returning unfiltered results for APIs.", error);
      }
  }
  
  // 4. Combine user news and API news, then sort.
  // User articles are always first, followed by API articles sorted by date.
  const allArticles = [...userArticles, ...uniqueApiArticles];
  
  return allArticles.sort((a, b) => {
    // Prioritize User Submitted
    if (a.source === 'User Submitted' && b.source !== 'User Submitted') return -1;
    if (a.source !== 'User Submitted' && b.source === 'User Submitted') return 1;

    // If both are user submitted or both are not, sort by timestamp
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}
