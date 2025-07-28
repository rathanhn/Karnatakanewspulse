
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
  district: z.string().describe('The district in Karnataka for which to generate news. If the district is "Karnataka", generate diverse news from across the entire state.'),
  category: z.enum(newsCategories).describe('The category of news to generate. If the category is "Trending", generate top news stories across all other categories.'),
});
export type GenerateNewsInput = z.infer<typeof GenerateNewsInputSchema>;

const sourceEnum = z.enum(['DailyHunt', 'Facebook', 'X', 'YouTube']);

const GeneratedNewsArticleSchema = z.object({
  source: sourceEnum.describe("The social media source of the news (e.g., 'X', 'YouTube')."),
  headline: z.string().describe('A compelling, realistic headline for the news article, in Kannada.'),
  content: z.string().describe('The full content of the news article (2-3 paragraphs), in Kannada.'),
  url: z.string().describe('A realistic, plausible URL for the news source (e.g., a YouTube or X.com link).'),
  'data-ai-hint': z.string().describe('A 1-2 word hint for generating a relevant image (e.g., "political rally", "cricket match").'),
  embedUrl: z.string().optional().describe("If the source is YouTube, a valid YouTube embed URL. Otherwise, this should be omitted."),
  district: z.string().optional().describe("The specific district this news is about. This is required if the input district is 'Karnataka'"),
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
  prompt: `You are an expert Kannada news aggregator. Your primary role is to scan social media (X, Facebook, YouTube) and major Kannada news channels (e.g., TV9 Kannada, Public TV, Suvarna News, Prajavani, Udayavani) to find and report on real, verifiable, and recent events.

  **Crucial Instructions:**
  1.  **District-Specific News ONLY**: If a specific 'district' is provided (e.g., 'Chikkaballapur'), you MUST find and generate news that has actually occurred in that specific district. Do not provide state-level news or news from other districts. If you cannot find any verifiable news for the selected district and category, you MUST return an empty array for 'articles'. This is a strict requirement.
  2.  **State-Wide News**: If the 'district' is 'Karnataka', you must generate a diverse set of news articles from various districts across the state. For each article in this case, you MUST populate the 'district' field with the correct district name.
  3.  **No Invented News**: You must not invent news. All articles must be based on credible, recent events. The headlines and content must be in the Kannada language.
  4.  **Trending News**: If the 'category' is 'Trending', generate the most talked-about news from the last 24 hours for the specified location, covering a mix of relevant topics.
  5.  **Output Format**: Generate 4 diverse articles. For each, provide a realistic headline, detailed content (2-3 paragraphs), a plausible source URL, and a 2-word hint for image generation. If the source is YouTube, you MUST provide a valid YouTube embed URL.
  6.  **Adherence to Schema**: Ensure the output strictly follows the provided JSON schema. Do not add extra fields or deviate from the specified structure.`,
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
