'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing word hints in the Word Connect game.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WordHintInputSchema = z.object({
  letters: z.array(z.string()).describe('The 5 letters available on the board.'),
  foundWords: z.array(z.string()).describe('Words already found by the player.'),
  allValidWords: z.array(z.string()).describe('All possible valid words for this level.'),
});
export type WordHintInput = z.infer<typeof WordHintInputSchema>;

const WordHintOutputSchema = z.object({
  hintWord: z.string().describe('A word the user has NOT found yet.'),
  reasoning: z.string().describe('Encouragement or a small clue about the word.'),
});
export type WordHintOutput = z.infer<typeof WordHintOutputSchema>;

const wordHintPrompt = ai.definePrompt({
  name: 'wordHintPrompt',
  input: {schema: WordHintInputSchema},
  output: {schema: WordHintOutputSchema},
  prompt: `You are a Word Game Expert. 
The player has these letters: {{{json letters}}}.
They have already found: {{{json foundWords}}}.
The remaining valid words are: {{{json allValidWords}}}.

Pick ONE word from the valid words that has NOT been found yet. 
Provide a helpful but cryptic hint for it. Do not just give the word away in the reasoning.
`,
});

const wordHintFlow = ai.defineFlow(
  {
    name: 'wordHintFlow',
    inputSchema: WordHintInputSchema,
    outputSchema: WordHintOutputSchema,
  },
  async (input) => {
    // Filter out words already found
    const remaining = input.allValidWords.filter(w => !input.foundWords.includes(w));
    if (remaining.length === 0) return { hintWord: '', reasoning: 'You found them all!' };

    const {output} = await wordHintPrompt(input);
    if (!output) throw new Error('AI analysis failed.');
    return output;
  }
);

export async function getWordHint(input: WordHintInput): Promise<WordHintOutput> {
  return wordHintFlow(input);
}
