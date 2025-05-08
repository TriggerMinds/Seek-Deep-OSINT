
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
    if (!userInput || userInput.trim() === "") {
      // More specific error for empty input if desired, or let the flow handle it
      // For now, this check helps avoid unnecessary API calls with clearly invalid input.
      throw new Error("Invalid input: User input cannot be empty.");
    }
    const analysisInput: AnalyzeUserInputInput = { input: userInput };
    const analysisResult = await analyzeUserInput(analysisInput);

    const queryForOptimization = analysisResult.querySuggestions?.[0] || analysisResult.informationNeeds || userInput;
    
    const optimizationInput: GenerateOptimizedQueriesInput = { query: queryForOptimization };
    const optimizedQueriesResult = await generateOptimizedQueries(optimizationInput);

    return {
      analysis: analysisResult,
      optimizedQueries: optimizedQueriesResult,
    };
  } catch (error) {
    console.error("Error in performIntelligentAnalysisAndQueryGeneration:", error);
    if (error instanceof Error && error.message.toLowerCase().includes("invalid input")) {
        throw error; // Re-throw specific "invalid input" errors
    }
    throw new Error(`Failed to perform intelligent analysis and query generation: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function performSuggestRelatedTerms(
  searchTerm: string
): Promise<SuggestRelatedTermsOutput> {
  try {
    if (!searchTerm || searchTerm.trim() === "") {
      throw new Error("Invalid input: Search term cannot be empty.");
    }
    const input: SuggestRelatedTermsInput = { searchTerm };
    const result = await suggestRelatedTerms(input);
    return result;
  } catch (error) {
    console.error("Error in performSuggestRelatedTerms:", error);
     if (error instanceof Error && error.message.toLowerCase().includes("invalid input")) {
        throw error;
    }
    throw new Error(`Failed to suggest related terms: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function performGenerateStrategicQueries(
  objective: string,
  context: string
): Promise<StrategicQueryOutput> {
  try {
    if (!objective || !context || objective.trim() === "" || context.trim() === "") {
        throw new Error("Invalid input: Objective and context cannot be empty.");
    }
    const input: StrategicQueryInput = { objective, context };
    const result = await generateStrategicQueries(input);
    return result;
  } catch (error) {
    console.error("Error in performGenerateStrategicQueries:", error);
    if (error instanceof Error && error.message.toLowerCase().includes("invalid input")) {
        throw error;
    }
    throw new Error(`Failed to generate strategic queries: ${error instanceof Error ? error.message : String(error)}`);
  }
}
