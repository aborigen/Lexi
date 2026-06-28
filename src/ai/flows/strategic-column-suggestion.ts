
'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing strategic column suggestions in the Columns game.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GridCellSchema = z.number().nullable();
const GridSchema = z.array(z.array(GridCellSchema));

const StrategicColumnSuggestionInputSchema = z.object({
  grid: GridSchema.describe('The current game grid where null is empty and numbers represent gem IDs.'),
  currentStack: z.array(z.number()).describe('The colors (IDs) of the three gems currently falling, from top to bottom.'),
  gridWidth: z.number(),
  gridHeight: z.number(),
});
export type StrategicColumnSuggestionInput = z.infer<typeof StrategicColumnSuggestionInputSchema>;

const StrategicColumnSuggestionOutputSchema = z.object({
  suggestedColumn: z.number().describe('The recommended column (0 to gridWidth-1) for the current stack.'),
  cycleCount: z.number().describe('How many times to cycle the gems (0, 1, or 2) for the best result.'),
  reasoning: z.string().describe('Explanation for the move.'),
});
export type StrategicColumnSuggestionOutput = z.infer<typeof StrategicColumnSuggestionOutputSchema>;

const strategicColumnSuggestionPrompt = ai.definePrompt({
  name: 'strategicColumnSuggestionPrompt',
  input: {schema: StrategicColumnSuggestionInputSchema},
  output: {schema: StrategicColumnSuggestionOutputSchema},
  prompt: `You are a Grandmaster at "Columns", a match-3 puzzle game. 
A stack of 3 gems is falling. You can move the stack left/right and cycle the 3 gems internally.
Match 3 or more gems horizontally, vertically, or diagonally.

Current Stack (Top to Bottom): {{{json currentStack}}}
Grid State (Row by Row):
{{{json grid}}}

Analyze the grid to find columns where placing this stack would create an immediate match or set up a powerful cascade. 
Suggest the best column (0-indexed) and how many cycles to perform.
`,
});

const strategicColumnSuggestionFlow = ai.defineFlow(
  {
    name: 'strategicColumnSuggestionFlow',
    inputSchema: StrategicColumnSuggestionInputSchema,
    outputSchema: StrategicColumnSuggestionOutputSchema,
  },
  async (input) => {
    const {output} = await strategicColumnSuggestionPrompt(input);
    if (!output) throw new Error('AI analysis failed.');
    return output;
  }
);

export async function strategicColumnSuggestion(input: StrategicColumnSuggestionInput): Promise<StrategicColumnSuggestionOutput> {
  return strategicColumnSuggestionFlow(input);
}
