// src/ai/flows/generate-news.ts
'use server';
/**
 * @fileOverview A Genkit flow for generating real-time news articles.
 *
 * - generateNews - A function that generates news articles based on a district and category.
 * - GenerateNewsInput - The input type for the generateNews function.
 * - GeneratedNewsArticle - The type for a single generated news article.
 * - GenerateNewsOutput - The return type for the generateNews function, which is an array of articles.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { newsCategories, Source } from '@/lib/data';

const GenerateNewsInputSchema = z.object({
  district: z.string().describe('The district in Karnataka for which to generate news.'),
  category: z.enum(newsCategories).describe('The category of news to generate. If the category is "Trending", generate top news stories across all other categories.'),
});
export type GenerateNewsInput = z.infer<typeof GenerateNewsInputSchema>;

const sourceEnum = z.enum(['DailyHunt', 'Facebook', 'X', 'YouTube']);

const GeneratedNewsArticleSchema = z.object({
  source: sourceEnum.describe("The social media source of the news (e.g., 'X', 'YouTube')."),
  headline: z.string().describe('A compelling, realistic headline for the news article, in English.'),
  content: z.string().describe('The full content of the news article (2-3 paragraphs), in English.'),
  url: z.string().describe('A realistic, plausible URL for the news source (e.g., a YouTube or X.com link).'),
  'data-ai-hint': z.string().describe('A 1-2 word hint for generating a relevant image (e.g., "political rally", "cricket match").'),
  embedUrl: z.string().optional().describe("If the source is YouTube, a valid YouTube embed URL. Otherwise, this should be omitted."),
});
export type GeneratedNewsArticle = z.infer<typeof GeneratedNewsArticleSchema>;

const GenerateNewsOutputSchema = z.object({
    articles: z.array(GeneratedNewsArticleSchema),
});
export type GenerateNewsOutput = z.infer<typeof GenerateNewsOutputSchema>;


export async function generateNews(
  input: GenerateNewsInput
): Promise<GenerateNewsOutput> {
  return generateNewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNewsPrompt',
  input: {schema: GenerateNewsInputSchema},
  output: {schema: GenerateNewsOutputSchema},
  prompt: `You are a news generation service for Karnataka, India. Your task is to generate 4 diverse, realistic, and recent news articles in English.

  Instructions:
  1.  The news must be for the district of {{{district}}} and the category of {{{category}}}. It is crucial that the generated news content is directly related to events, people, or places within this specific district.
  2.  If the category is 'Trending', please generate the most important and talked-about news stories from the last 24 hours for that district, covering a mix of topics like politics, sports, and local events.
  3.  Generate a variety of news items from different plausible social media sources (X, Facebook, YouTube, DailyHunt).
  4.  For each article, create a realistic headline, detailed content (2-3 paragraphs), a valid-looking source URL, and a 2-word hint for image generation.
  5.  If the source is YouTube, you MUST provide a valid YouTube embed URL in the 'embedUrl' field. For other sources, omit it.
  6.  The content should be engaging and reflect recent, believable events for the specified location and topic.
  7.  Ensure the output strictly follows the provided JSON schema. Do not add any extra fields.`,
});

const generateNewsFlow = ai.defineFlow(
  {
    name: 'generateNewsFlow',
    inputSchema: GenerateNewsInputSchema,
    outputSchema: GenerateNewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
