
/**
 * @fileOverview This file defines a Genkit flow for providing strategic drop suggestions.
 * Note: 'use server' is removed for static build compatibility.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const FruitSchema = z.object({
  id: z.string().describe('Unique identifier for the fruit.'),
  type: z.string().describe('The type of fruit (e.g., "cherry", "grape", "orange", "watermelon").'),
  x: z.number().describe('The x-coordinate of the fruit in the game arena.'),
  y: z.number().describe('The y-coordinate of the fruit in the game arena.'),
  radius: z.number().describe('The radius of the fruit.'),
});

const StrategicDropSuggestionInputSchema = z.object({
  currentFruits: z.array(FruitSchema).describe('An array describing all fruits currently in the game arena.'),
  nextFruitType: z.string().describe('The type of fruit that is about to be dropped next.'),
  arenaWidth: z.number().describe('The total width of the game arena.'),
  availableDropXRange: z.object({
    min: z.number().describe('The minimum x-coordinate where a fruit can be dropped.'),
    max: z.number().describe('The maximum x-coordinate where a fruit can be dropped.'),
  }).describe('The valid horizontal range for dropping the next fruit.'),
});
export type StrategicDropSuggestionInput = z.infer<typeof StrategicDropSuggestionInputSchema>;

// Output Schema
const StrategicDropSuggestionOutputSchema = z.object({
  suggestedDropX: z.number().describe('The recommended horizontal x-coordinate for dropping the next fruit.'),
  reasoning: z.string().describe('An explanation of why this specific drop location was chosen.'),
});
export type StrategicDropSuggestionOutput = z.infer<typeof StrategicDropSuggestionOutputSchema>;

// Prompt definition
const strategicDropSuggestionPrompt = ai.definePrompt({
  name: 'strategicDropSuggestionPrompt',
  input: {schema: StrategicDropSuggestionInputSchema},
  output: {schema: StrategicDropSuggestionOutputSchema},
  prompt: `You are an expert player of "Pulp Drop"...`,
});

// Flow definition
const strategicDropSuggestionFlow = ai.defineFlow(
  {
    name: 'strategicDropSuggestionFlow',
    inputSchema: StrategicDropSuggestionInputSchema,
    outputSchema: StrategicDropSuggestionOutputSchema,
  },
  async (input) => {
    const {output} = await strategicDropSuggestionPrompt(input);
    if (!output) {
      throw new Error('Failed to get a strategic drop suggestion from the AI.');
    }
    const clampedX = Math.max(input.availableDropXRange.min, Math.min(input.availableDropXRange.max, output.suggestedDropX));
    return {
      ...output,
      suggestedDropX: clampedX,
    };
  }
);

// Wrapper function
export async function strategicDropSuggestion(input: StrategicDropSuggestionInput): Promise<StrategicDropSuggestionOutput> {
  return strategicDropSuggestionFlow(input);
}
