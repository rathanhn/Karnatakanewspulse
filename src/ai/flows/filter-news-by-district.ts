// src/ai/flows/filter-news-by-district.ts
'use server';
/**
 * @fileOverview A Genkit flow to filter a list of news articles to ensure they are relevant to a specific district.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { NewsArticle, newsCategories, karnatakaDistricts } from '@/lib/data';

const NewsArticleSchema = z.object({
  id: z.string(),
  headline: z.string(),
  content: z.string().nullable(),
  url: z.string().url(),
  imageUrl: z.string().url().nullable(),
  embedUrl: z.string().url().optional(),
  timestamp: z.date(),
  source: z.string(),
  district: z.string(),
  category: z.enum(newsCategories),
  'data-ai-hint': z.string().optional(),
});

const FilterNewsInputSchema = z.object({
  articles: z.array(NewsArticleSchema),
  district: z.enum(karnatakaDistricts),
});

const FilterNewsOutputSchema = z.object({
  articles: z.array(NewsArticleSchema),
});

export type FilterNewsInput = z.infer<typeof FilterNewsInputSchema>;
export type FilterNewsOutput = z.infer<typeof FilterNewsOutputSchema>;

export async function filterNewsByDistrict(input: FilterNewsInput): Promise<FilterNewsOutput> {
  return filterNewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'filterNewsPrompt',
  input: { schema: FilterNewsInputSchema },
  output: { schema: FilterNewsOutputSchema },
  prompt: `You are a news curator for Karnataka. Your task is to filter a list of news articles and return ONLY the ones that are verifiably and directly related to the specified district: {{{district}}}.

Do not include news that is about Karnataka in general, or about other districts. The event described MUST have taken place in {{{district}}}.

Analyze the headline and content of each article carefully.

Here is the list of articles to filter:
{{#each articles}}
---
Article ID: {{id}}
Headline: {{headline}}
Content: {{content}}
---
{{/each}}

Return a JSON object containing a key "articles" with an array of the full article objects that are relevant to {{{district}}}.
`,
});

const filterNewsFlow = ai.defineFlow(
  {
    name: 'filterNewsFlow',
    inputSchema: FilterNewsInputSchema,
    outputSchema: FilterNewsOutputSchema,
  },
  async (input) => {
    if (input.district === 'Karnataka') {
        // If "All Karnataka" is selected, no need to filter. Return all articles.
        return { articles: input.articles };
    }
    
    // The prompt is very complex for the model, so we send the articles in chunks to avoid hitting input limits.
    const articleChunks: NewsArticle[][] = [];
    for (let i = 0; i < input.articles.length; i += 5) {
        articleChunks.push(input.articles.slice(i, i + 5));
    }

    const filteredChunks = await Promise.all(
        articleChunks.map(async (chunk) => {
            const { output } = await prompt({ articles: chunk, district: input.district });
            return output?.articles || [];
        })
    );

    const filteredArticles = filteredChunks.flat();

    // The model sometimes hallucinates and returns articles that were not in the input.
    // We must perform a final check to ensure we only return articles that were originally provided.
    const originalArticleMap = new Map(input.articles.map(a => [a.id, a]));
    const trulyFilteredArticles = filteredArticles.filter(filteredArticle => 
        originalArticleMap.has(filteredArticle.id)
    );

    return { articles: trulyFilteredArticles };
  }
);
