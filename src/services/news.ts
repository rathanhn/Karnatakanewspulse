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


const newsApiCategoryMapping: Record<Category, string | null> = {
    Trending: 'general',
    General: 'general',
    Politics: 'general', // newsapi.org doesn't have a specific politics category, use general
    Sports: 'sports',
    Crime: 'general', // Use general for crime
    Technology: 'technology',
    Business: 'business',
    Entertainment: 'entertainment',
    'User Submitted': null,
};


async function fetchFromNewsAPI({ district, category, query: queryParam }: { district: string, category: Category, query: string }): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.warn('NewsAPI.org API key is not configured. Skipping fetch.');
    return [];
  }
  
  const apiCategory = newsApiCategoryMapping[category];
  
  // Use top-headlines for categories and everything for general search
  const endpoint = apiCategory ? 'top-headlines' : 'everything';
  
  let url = `https://newsapi.org/v2/${endpoint}?q=${encodeURIComponent(queryParam)}&apiKey=${apiKey}&language=en`;
  
  if (endpoint === 'top-headlines' && apiCategory) {
    url += `&category=${apiCategory}&country=in`;
  }

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
    if (!response.ok) {
      const errorBody = await response.json();
      console.error('NewsAPI.org API Error:', errorBody);
      throw new Error(`NewsAPI request failed with status ${response.status}: ${errorBody.message}`);
    }
    const data = await response.json();
    if (data.status === 'ok' && data.articles) {
      return data.articles.map((item: any): NewsArticle => ({
        id: item.url, // Use URL as a unique ID
        headline: item.title,
        content: item.description,
        url: item.url,
        imageUrl: item.urlToImage,
        embedUrl: undefined, // NewsAPI doesn't provide embed URLs
        timestamp: new Date(item.publishedAt),
        source: item.source.name || 'Unknown Source',
        district: district, // Tentative district
        category: category,
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
        // When 'All Karnataka' is selected, fetch all user posts. Otherwise, filter by district.
        if (district === 'Karnataka' || !karnatakaDistricts.includes(district)) {
           q = query(newsCollection, 
               orderBy("timestamp", "desc")
           );
        } else {
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


/**
 * Fetches news from external APIs and combines it with user-submitted news.
 */
export async function fetchNewsFromAPI({ district, category = 'Trending', limit: queryLimit, sources = 'all' }: FetchNewsOptions): Promise<NewsArticle[]> {
  
  let userArticles: NewsArticle[] = [];
  let apiArticles: NewsArticle[] = [];
  
  if (sources === 'all' || sources === 'user') {
     userArticles = await fetchUserSubmittedNews({ district, limit: queryLimit });
  }

  // If the user specifically asks for user-submitted news, return only that.
  if (category === 'User Submitted') {
      return userArticles;
  }
  
  if (sources === 'all' || sources === 'api') {
      const query = `${district === 'Karnataka' ? 'Karnataka India' : district} news`;
      
      apiArticles = await fetchFromNewsAPI({ district, category, query });

      // Only filter with AI if a specific district is selected.
      if (apiArticles.length > 0 && district !== 'Karnataka') {
          try {
              const filteredResult = await filterNewsByDistrict({ articles: apiArticles, district });
              apiArticles = filteredResult.articles;
          } catch (error) {
              console.error("AI filtering failed. Returning unfiltered results for APIs.", error);
          }
      }
      if (queryLimit) {
        apiArticles = apiArticles.slice(0, queryLimit);
      }
  }
  
  // Combine and sort: User Submitted news first, then all news by date.
  const allArticles = [...userArticles, ...apiArticles];
  
  return allArticles.sort((a, b) => {
    // This custom sort can be removed if you want pure chronological order after combining.
    const aIsUser = a.source === 'User Submitted';
    const bIsUser = b.source === 'User Submitted';

    if (aIsUser && !bIsUser) return -1;
    if (!aIsUser && bIsUser) return 1;

    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}