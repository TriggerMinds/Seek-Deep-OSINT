// 'use server'
'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting semantically related alternative search terms and strategies.
 *
 * - suggestRelatedTerms - A function that suggests related search terms.
 * - SuggestRelatedTermsInput - The input type for the suggestRelatedTerms function.
 * - SuggestRelatedTermsOutput - The return type for the suggestRelatedTerms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelatedTermsInputSchema = z.object({
  searchTerm: z.string().describe('The initial search term.'),
});
export type SuggestRelatedTermsInput = z.infer<typeof SuggestRelatedTermsInputSchema>;

const SuggestRelatedTermsOutputSchema = z.object({
  relatedTerms: z.array(z.string()).describe('An array of semantically related search terms.'),
  alternativeStrategies: z
    .array(z.string())
    .describe('An array of alternative search strategies.'),
});
export type SuggestRelatedTermsOutput = z.infer<typeof SuggestRelatedTermsOutputSchema>;

export async function suggestRelatedTerms(input: SuggestRelatedTermsInput): Promise<SuggestRelatedTermsOutput> {
  return suggestRelatedTermsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelatedTermsPrompt',
  input: {schema: SuggestRelatedTermsInputSchema},
  output: {schema: SuggestRelatedTermsOutputSchema},
  prompt: `You are an expert in Open Source Intelligence (OSINT).

  Given an initial search term, suggest semantically related alternative search terms and alternative search strategies to broaden the investigation horizon and uncover less obvious information pathways.

  Initial Search Term: {{{searchTerm}}}

  Respond in the following JSON format:
  {
    "relatedTerms": ["related term 1", "related term 2", ...],
    "alternativeStrategies": ["strategy 1", "strategy 2", ...]
  }`,
});

const suggestRelatedTermsFlow = ai.defineFlow(
  {
    name: 'suggestRelatedTermsFlow',
    inputSchema: SuggestRelatedTermsInputSchema,
    outputSchema: SuggestRelatedTermsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
