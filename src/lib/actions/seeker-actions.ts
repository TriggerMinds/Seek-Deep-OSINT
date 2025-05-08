"use server";

import { analyzeUserInput, type AnalyzeUserInputInput, type AnalyzeUserInputOutput } from "@/ai/flows/analyze-user-input";
import { generateOptimizedQueries, type GenerateOptimizedQueriesInput, type GenerateOptimizedQueriesOutput } from "@/ai/flows/generate-optimized-queries";
import { suggestRelatedTerms, type SuggestRelatedTermsInput, type SuggestRelatedTermsOutput } from "@/ai/flows/suggest-related-terms";
import { generateStrategicQueries, type StrategicQueryInput, type StrategicQueryOutput } from "@/ai/flows/strategic-query-modules";

export interface CombinedQueryAnalysisResult {
  analysis: AnalyzeUserInputOutput;
  optimizedQueries: GenerateOptimizedQueriesOutput;
}

export async function performIntelligentAnalysisAndQueryGeneration(
  userInput: string
): Promise<CombinedQueryAnalysisResult> {
  try {
    const analysisInput: AnalyzeUserInputInput = { input: userInput };
    const analysisResult = await analyzeUserInput(analysisInput);

    // Use a primary piece of information from analysis for query generation,
    // e.g., the first query suggestion or combined information needs.
    // This logic can be refined based on desired behavior.
    const queryForOptimization = analysisResult.querySuggestions?.[0] || analysisResult.informationNeeds || userInput;
    
    const optimizationInput: GenerateOptimizedQueriesInput = { query: queryForOptimization };
    const optimizedQueriesResult = await generateOptimizedQueries(optimizationInput);

    return {
      analysis: analysisResult,
      optimizedQueries: optimizedQueriesResult,
    };
  } catch (error) {
    console.error("Error in performIntelligentAnalysisAndQueryGeneration:", error);
    // Consider returning a structured error or re-throwing a custom error
    throw new Error("Failed to perform intelligent analysis and query generation.");
  }
}

export async function performSuggestRelatedTerms(
  searchTerm: string
): Promise<SuggestRelatedTermsOutput> {
  try {
    const input: SuggestRelatedTermsInput = { searchTerm };
    const result = await suggestRelatedTerms(input);
    return result;
  } catch (error) {
    console.error("Error in performSuggestRelatedTerms:", error);
    throw new Error("Failed to suggest related terms.");
  }
}

export async function performGenerateStrategicQueries(
  objective: string,
  context: string
): Promise<StrategicQueryOutput> {
  try {
    const input: StrategicQueryInput = { objective, context };
    const result = await generateStrategicQueries(input);
    return result;
  } catch (error) {
    console.error("Error in performGenerateStrategicQueries:", error);
    throw new Error("Failed to generate strategic queries.");
  }
}
