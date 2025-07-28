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
  prompt: `You are a news generation service for Karnataka, India. Your task is to generate 4 diverse, realistic, and recent news articles in Kannada. You MUST base your articles on verifiable information from well-known Kannada news channels and content creators.

  Instructions:
  1.  Source your information from popular and trusted Kannada news sources like TV9 Kannada, Public TV, Suvarna News, Prajavani, Udayavani, or other respected Kannada content creators. Do not invent news.
  2.  The news MUST be for the specified 'district' and 'category'. The headlines and content MUST be in the Kannada language.
  3.  Crucially, if the input 'district' is a specific district (e.g., 'Mysuru'), all generated news content MUST be directly related to verifiable events, people, or places within that specific district. Do not generate generic state-level news for a specific district request.
  4.  If the input 'district' is 'Karnataka', you must generate news from a variety of different districts across the state and you MUST populate the 'district' field in each generated article object with the correct district name.
  5.  If the category is 'Trending', please generate the most important and talked-about news stories from the last 24 hours, covering a mix of topics like politics, sports, and local events.
  6.  Generate a variety of news items from different plausible social media sources (X, Facebook, YouTube, DailyHunt).
  7.  For each article, create a realistic headline, detailed content (2-3 paragraphs), a valid-looking source URL, and a 2-word hint for image generation.
  8.  If the source is YouTube, you MUST provide a valid YouTube embed URL in the 'embedUrl' field. For other sources, omit it.
  9.  The content should be engaging and reflect recent, believable events for the specified location and topic.
  10. Ensure the output strictly follows the provided JSON schema. Do not add any extra fields.`,
});

const generateNewsFlow = ai.defineFlow(
  {
    name: 'generateNewsFlow',
    inputSchema: GenerateNewsInputSchema,
    outputSchema: GenerateNewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Safeguard: Ensure district is populated correctly
    if (output) {
        output.articles.forEach(article => {
            if (input.district !== 'Karnataka') {
                article.district = input.district;
            }
        });
    }
    return output!;
  }
);
