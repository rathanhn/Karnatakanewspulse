// src/ai/flows/filter-news-by-category.ts
'use server';
/**
 * @fileOverview A Genkit flow to filter a list of news articles to ensure they are relevant to a specific category.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { newsCategories } from '@/lib/data';

const AuthorSchema = z.object({
    uid: z.string(),
    displayName: z.string().nullable(),
    photoURL: z.string().url().nullable(),
});

const NewsArticleSchema = z.object({
  id: z.string(),
  headline: z.string(),
  content: z.string().nullable(),
  url: z.string(),
  imageUrl: z.string().nullable(),
  embedUrl: z.string().optional(),
  timestamp: z.any(),
  source: z.string(),
  district: z.string(),
  category: z.enum(newsCategories),
  'data-ai-hint': z.string().optional(),
  userId: z.string().optional(),
  author: AuthorSchema.optional(),
});

const FilterNewsByCategoryInputSchema = z.object({
  articles: z.array(NewsArticleSchema),
  category: z.enum(newsCategories),
});

const FilterNewsByCategoryOutputSchema = z.object({
  articles: z.array(NewsArticleSchema),
});

export type FilterNewsByCategoryInput = z.infer<typeof FilterNewsByCategoryInputSchema>;
export type FilterNewsByCategoryOutput = z.infer<typeof FilterNewsByCategoryOutputSchema>;

export async function filterNewsByCategory(input: FilterNewsByCategoryInput): Promise<FilterNewsByCategoryOutput> {
  return filterNewsByCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'filterNewsByCategoryPrompt',
  input: { schema: FilterNewsByCategoryInputSchema },
  output: { schema: FilterNewsByCategoryOutputSchema },
  prompt: `You are a news curator. Your task is to filter a list of news articles and return ONLY the ones that are verifiably and directly related to the specified category: {{{category}}}.

Analyze the headline and content of each article carefully. Do not include articles that only mention the category in a passing or irrelevant context.

Here is the list of articles to filter:
{{#each articles}}
---
Article ID: {{id}}
Headline: {{headline}}
Content: {{content}}
---
{{/each}}

Return a JSON object containing a key "articles" with an array of the full article objects that are relevant to {{{category}}}.
If no articles are relevant, return an empty "articles" array.
`,
});

const filterNewsByCategoryFlow = ai.defineFlow(
  {
    name: 'filterNewsByCategoryFlow',
    inputSchema: FilterNewsByCategoryInputSchema,
    outputSchema: FilterNewsByCategoryOutputSchema,
  },
  async (input) => {
    // If these general categories are selected, no AI filtering is needed.
    if (input.category === 'Trending' || input.category === 'General' || input.category === 'User Submitted') {
        return { articles: input.articles };
    }
    
    // The prompt can be complex; send articles in chunks to avoid hitting input limits and improve reliability.
    const articleChunks: typeof input.articles[] = [];
    for (let i = 0; i < input.articles.length; i += 5) {
        articleChunks.push(input.articles.slice(i, i + 5));
    }

    const filteredChunks = await Promise.all(
        articleChunks.map(async (chunk) => {
            const { output } = await prompt({ articles: chunk, category: input.category });
            return output?.articles || [];
        })
    );

    const filteredArticles = filteredChunks.flat();

    // The model can sometimes return articles that were not in the input (hallucination).
    // This final check ensures we only return articles that were part of the original request.
    const originalArticleMap = new Map(input.articles.map(a => [a.id, a]));
    const trulyFilteredArticles = filteredArticles.filter(filteredArticle => 
        originalArticleMap.has(filteredArticle.id)
    ).map(filteredArticle => {
        // Re-attach the original full article data and assign the correct category
        const originalArticle = originalArticleMap.get(filteredArticle.id)!;
        return {
            ...originalArticle,
            category: input.category
        };
    });

    return { articles: trulyFilteredArticles };
  }
);
