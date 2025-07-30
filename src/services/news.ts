// src/services/news.ts
'use server';

import { NewsArticle, Category, karnatakaDistricts } from '@/lib/data';
import { filterNewsByDistrict } from '@/ai/flows/filter-news-by-district';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp, limit } from "firebase/firestore";

interface FetchNewsOptions {
  district: string;
  category?: Category;
  limit?: number;
  sources?: 'api' | 'user' | 'all';
}

async function fetchFromNewsAPI({ query: queryParam }: { query: string }): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.warn('NewsAPI.org API key is not configured. Skipping fetch.');
    return [];
  }
  
  if (!queryParam) {
    console.warn('NewsAPI.org /everything endpoint requires a query. Skipping fetch.');
    return [];
  }

  const endpoint = 'everything';
  const url = `https://newsapi.org/v2/${endpoint}?q=${encodeURIComponent(queryParam)}&apiKey=${apiKey}&language=en&sortBy=publishedAt`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
    if (!response.ok) {
      const errorBody = await response.json();
      console.error('NewsAPI.org API Error:', errorBody);
      throw new Error(`NewsAPI request failed with status ${response.status}: ${errorBody.message || 'Unknown error'}`);
    }
    const data = await response.json();
    if (data.status === 'ok' && data.articles) {
      return data.articles.map((item: any): NewsArticle => ({
        id: item.url, // Use URL as a unique ID
        headline: item.title,
        content: item.description || item.content,
        url: item.url,
        imageUrl: item.urlToImage,
        embedUrl: undefined, // NewsAPI doesn't provide embed URLs
        timestamp: new Date(item.publishedAt),
        source: item.source.name || 'Unknown Source',
        district: 'api-sourced', // Placeholder, AI will filter
        category: 'General', // Assign a default category, can be refined
        'data-ai-hint': item.title.split(' ').slice(0, 2).join(' '),
      }));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch from NewsAPI.org:', error);
    // Return empty array on failure to prevent app crash
    return [];
  }
}

export async function fetchUserSubmittedNews({ district, limit: queryLimit }: { district: string, limit?: number }): Promise<NewsArticle[]> {
    try {
        const newsCollection = collection(db, "news");
        
        let q;
        if (district === 'Karnataka' || !karnatakaDistricts.includes(district)) {
           // For "All Karnataka", fetch all user-submitted news without district filter
           q = query(newsCollection, 
               orderBy("timestamp", "desc")
           );
        } else {
           // For a specific district, filter by that district
           q = query(newsCollection, 
               where("district", "==", district), 
               orderBy("timestamp", "desc")
           );
        }

        if(queryLimit) {
            q = query(q, limit(queryLimit));
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


export async function fetchNewsFromAPI({ district, category = 'Trending', limit: queryLimit, sources = 'all' }: FetchNewsOptions): Promise<NewsArticle[]> {
  
  let userArticles: NewsArticle[] = [];
  let apiArticles: NewsArticle[] = [];
  
  if (sources === 'all' || sources === 'user') {
     userArticles = await fetchUserSubmittedNews({ district, limit: queryLimit });
  }

  // If the user specifically wants only user-submitted news, return that.
  if (category === 'User Submitted') {
      return userArticles;
  }
  
  if (sources === 'all' || sources === 'api') {
      // Construct a broad query for the API. AI will do the fine-grained filtering.
      const query = `${district === 'Karnataka' ? 'Karnataka' : district} India ${category !== 'Trending' ? category : ''}`.trim();
      
      const rawApiArticles = await fetchFromNewsAPI({ query });

      if (rawApiArticles.length > 0) {
          try {
              // The AI flow will filter articles and assign the correct district.
              const filteredResult = await filterNewsByDistrict({ articles: rawApiArticles, district });
              apiArticles = filteredResult.articles;
          } catch (error) {
              console.error("AI filtering failed. Returning unfiltered API results as a fallback.", error);
              // Fallback to returning all API articles if AI fails
              apiArticles = rawApiArticles.map(a => ({...a, district}));
          }
      }
      
      if (queryLimit) {
        apiArticles = apiArticles.slice(0, queryLimit);
      }
  }
  
  const allArticles = [...userArticles, ...apiArticles];
  
  // Sort all combined articles by timestamp, descending.
  return allArticles.sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}
