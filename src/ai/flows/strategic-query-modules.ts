// src/ai/flows/strategic-query-modules.ts
'use server';

/**
 * @fileOverview A flow for generating strategic query modules targeting specific OSINT objectives.
 *
 * - generateStrategicQueries - A function that generates strategic queries based on a given module and context.
 * - StrategicQueryInput - The input type for the generateStrategicQueries function.
 * - StrategicQueryOutput - The return type for the generateStrategicQueries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StrategicQueryInputSchema = z.object({
  objective: z
    .string()
    .describe('The specific OSINT objective (e.g., digital footprint mapping, vulnerability probing).'),
  context: z
    .string()
    .describe('Additional context or keywords related to the investigation.'),
});
export type StrategicQueryInput = z.infer<typeof StrategicQueryInputSchema>;

const StrategicQueryOutputSchema = z.object({
  queries: z.array(z.string()).describe('An array of generated search queries.'),
});
export type StrategicQueryOutput = z.infer<typeof StrategicQueryOutputSchema>;

export async function generateStrategicQueries(
  input: StrategicQueryInput
): Promise<StrategicQueryOutput> {
  return strategicQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'strategicQueryPrompt',
  input: {schema: StrategicQueryInputSchema},
  output: {schema: StrategicQueryOutputSchema},
  prompt: `You are an expert in Open Source Intelligence (OSINT) and search engine optimization.  Your task is to generate a set of search queries tailored to a specific OSINT objective, incorporating relevant keywords and search operators.

Objective: {{{objective}}}
Context: {{{context}}}

Based on the objective and context provided, generate a diverse set of search queries that would be effective in gathering relevant information.  Consider different search engines (Google, Yandex) and search verticals (web, images, news, files). Suggest dorks which would be appropriate.

Ensure the queries are specific, targeted, and likely to yield valuable results.

Output the queries as a JSON array of strings.
`,
});

const strategicQueryFlow = ai.defineFlow(
  {
    name: 'strategicQueryFlow',
    inputSchema: StrategicQueryInputSchema,
    outputSchema: StrategicQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
