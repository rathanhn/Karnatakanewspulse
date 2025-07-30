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
  url: z.string(),
  imageUrl: z.string().nullable(),
  embedUrl: z.string().optional(),
  timestamp: z.any(),
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
  prompt: `You are a news curator for Karnataka, India. Your task is to filter a list of news articles and return ONLY the ones that are verifiably and directly related to the specified district: {{{district}}}.

Do not include news that is about the state of Karnataka in general, or about other districts, unless the event described has a direct and significant impact on {{{district}}}. Analyze the headline and content of each article carefully.

Here is the list of articles to filter:
{{#each articles}}
---
Article ID: {{id}}
Headline: {{headline}}
Content: {{content}}
---
{{/each}}

Return a JSON object containing a key "articles" with an array of the full article objects that are relevant to {{{district}}}.
If no articles are relevant, return an empty "articles" array.
`,
});

const filterNewsFlow = ai.defineFlow(
  {
    name: 'filterNewsFlow',
    inputSchema: FilterNewsInputSchema,
    outputSchema: FilterNewsOutputSchema,
  },
  async (input) => {
    // If "All Karnataka" is selected, no need to filter by a specific district for API news. Return all.
    if (input.district === 'Karnataka') {
        return { articles: input.articles };
    }
    
    // The prompt is complex; send articles in chunks to avoid hitting input limits and improve reliability.
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

    // The model can sometimes return articles that were not in the input (hallucination).
    // This final check ensures we only return articles that were part of the original request.
    const originalArticleMap = new Map(input.articles.map(a => [a.id, a]));
    const trulyFilteredArticles = filteredArticles.filter(filteredArticle => 
        originalArticleMap.has(filteredArticle.id)
    ).map(filteredArticle => ({
        ...originalArticleMap.get(filteredArticle.id)!,
        district: input.district // Assign the correct district to the filtered articles.
    }));

    return { articles: trulyFilteredArticles };
  }
);
