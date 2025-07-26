// src/ai/flows/refine-search-suggestions.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for refining search suggestions based on an initial search query.
 *
 * - refineSearchSuggestions - A function that takes an initial search query and returns refined search suggestions.
 * - RefineSearchSuggestionsInput - The input type for the refineSearchSuggestions function.
 * - RefineSearchSuggestionsOutput - The output type for the refineSearchSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineSearchSuggestionsInputSchema = z.object({
  initialQuery: z
    .string()
    .describe('The initial search query entered by the user.'),
  searchResults: z
    .string()
    .describe("The search results, as a string, from the initial query."),
});
export type RefineSearchSuggestionsInput = z.infer<
  typeof RefineSearchSuggestionsInputSchema
>;

const RefineSearchSuggestionsOutputSchema = z.object({
  summary: z.string().describe('A summary of the search results.'),
  suggestions: z
    .array(z.string())
    .describe(
      'An array of suggested keywords or phrases to refine the search.'
    ),
});
export type RefineSearchSuggestionsOutput = z.infer<
  typeof RefineSearchSuggestionsOutputSchema
>;

export async function refineSearchSuggestions(
  input: RefineSearchSuggestionsInput
): Promise<RefineSearchSuggestionsOutput> {
  return refineSearchSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineSearchSuggestionsPrompt',
  input: {schema: RefineSearchSuggestionsInputSchema},
  output: {schema: RefineSearchSuggestionsOutputSchema},
  prompt: `You are an AI assistant helping users refine their search queries to find more relevant information.

  The user's initial query was: {{{initialQuery}}}
  Here are the initial search results: {{{searchResults}}}

  Please provide a concise summary of the search results and suggest 3-5 related keywords or phrases that the user could use to refine their search.  Format the suggestions as a JSON array of strings.

  Summary:
  
  Suggestions:`, 
});

const refineSearchSuggestionsFlow = ai.defineFlow(
  {
    name: 'refineSearchSuggestionsFlow',
    inputSchema: RefineSearchSuggestionsInputSchema,
    outputSchema: RefineSearchSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
