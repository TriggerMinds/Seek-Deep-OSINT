// src/ai/flows/analyze-user-input.ts
'use server';

/**
 * @fileOverview Analyzes user input to extract key entities, concepts, and information needs.
 *
 * - analyzeUserInput - A function that handles the user input analysis process.
 * - AnalyzeUserInputInput - The input type for the analyzeUserInput function.
 * - AnalyzeUserInputOutput - The return type for the analyzeUserInput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserInputInputSchema = z.object({
  input: z
    .string()
    .describe(
      'The user input, which can be a natural language query, URL, or structured data.'
    ),
});
export type AnalyzeUserInputInput = z.infer<typeof AnalyzeUserInputInputSchema>;

const AnalyzeUserInputOutputSchema = z.object({
  entities: z.array(z.string()).describe('Key entities identified in the input.'),
  concepts: z.array(z.string()).describe('Key concepts identified in the input.'),
  informationNeeds: z
    .string()
    .describe('The identified information needs of the user.'),
  querySuggestions: z
    .array(z.string())
    .describe('Suggested search queries based on the analysis.'),
});
export type AnalyzeUserInputOutput = z.infer<typeof AnalyzeUserInputOutputSchema>;

export async function analyzeUserInput(input: AnalyzeUserInputInput): Promise<AnalyzeUserInputOutput> {
  return analyzeUserInputFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUserInputPrompt',
  input: {schema: AnalyzeUserInputInputSchema},
  output: {schema: AnalyzeUserInputOutputSchema},
  prompt: `You are an expert in analyzing user input to extract key entities, concepts, and information needs.

  Given the following user input, please identify the key entities, concepts, and information needs.
  Also, suggest some search queries that the user can use to find the information they need.

  User Input: {{{input}}}

  Please provide the output in JSON format.
  `,
});

const analyzeUserInputFlow = ai.defineFlow(
  {
    name: 'analyzeUserInputFlow',
    inputSchema: AnalyzeUserInputInputSchema,
    outputSchema: AnalyzeUserInputOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
