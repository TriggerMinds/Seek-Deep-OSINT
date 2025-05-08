// use server'
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating optimized search queries (dorks) tailored to specific platforms like Google and Yandex.
 *
 * - generateOptimizedQueries - A function that generates optimized search queries based on the user's input.
 * - GenerateOptimizedQueriesInput - The input type for the generateOptimizedQueries function.
 * - GenerateOptimizedQueriesOutput - The output type for the generateOptimizedQueries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOptimizedQueriesInputSchema = z.object({
  query: z.string().describe('The user-provided search query.'),
});
export type GenerateOptimizedQueriesInput = z.infer<typeof GenerateOptimizedQueriesInputSchema>;

const GenerateOptimizedQueriesOutputSchema = z.object({
  googleQueries: z.array(z.string()).describe('Optimized search queries for Google.'),
  yandexQueries: z.array(z.string()).describe('Optimized search queries for Yandex.'),
});
export type GenerateOptimizedQueriesOutput = z.infer<typeof GenerateOptimizedQueriesOutputSchema>;

export async function generateOptimizedQueries(input: GenerateOptimizedQueriesInput): Promise<GenerateOptimizedQueriesOutput> {
  return generateOptimizedQueriesFlow(input);
}

const generateOptimizedQueriesPrompt = ai.definePrompt({
  name: 'generateOptimizedQueriesPrompt',
  input: {schema: GenerateOptimizedQueriesInputSchema},
  output: {schema: GenerateOptimizedQueriesOutputSchema},
  prompt: `You are an expert in generating advanced search queries (dorks) for various search engines.

  Based on the user's initial query, generate optimized search queries tailored to Google and Yandex.
  Consider platform-specific syntax, operators, and search verticals (e.g., Google Images/News/Scholar, Yandex.Images/.Maps/.Public).

  User Query: {{{query}}}

  Output should be a JSON object containing two arrays:
  - googleQueries: An array of optimized search queries for Google.
  - yandexQueries: An array of optimized search queries for Yandex.
  `,
});

const generateOptimizedQueriesFlow = ai.defineFlow(
  {
    name: 'generateOptimizedQueriesFlow',
    inputSchema: GenerateOptimizedQueriesInputSchema,
    outputSchema: GenerateOptimizedQueriesOutputSchema,
  },
  async input => {
    const {output} = await generateOptimizedQueriesPrompt(input);
    return output!;
  }
);
