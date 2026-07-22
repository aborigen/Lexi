'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing citation-style word hints in the Word Connect game.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WordHintInputSchema = z.object({
  letters: z.array(z.string()).describe('The letters available on the board.'),
  foundWords: z.array(z.string()).describe('Words already found by the player.'),
  allValidWords: z.array(z.string()).describe('All possible valid words for this level.'),
  lang: z.string().optional().default('en'),
});
export type WordHintInput = z.infer<typeof WordHintInputSchema>;

const WordHintOutputSchema = z.object({
  hintWord: z.string().describe('The target word that the user needs to find.'),
  citation: z.string().describe('A sentence or citation with the target word replaced by "_____".'),
});
export type WordHintOutput = z.infer<typeof WordHintOutputSchema>;

const wordHintPrompt = ai.definePrompt({
  name: 'wordHintPrompt',
  input: {schema: WordHintInputSchema},
  output: {schema: WordHintOutputSchema},
  prompt: `You are a Literary and Linguistics Expert. 
The player is playing a Word Connect game in language: {{lang}}.
Available letters: {{{json letters}}}.
Found words: {{{json foundWords}}}.
Target valid words: {{{json allValidWords}}}.

1. Pick ONE word from the valid words (preferably 5 letters long) that has NOT been found yet.
2. Generate a famous citation, a well-known proverb, or a creative and evocative sentence that naturally includes this word.
3. Replace that specific word in the citation with a blank like "_____".
4. Ensure the context makes it possible (but slightly challenging) to guess the missing word.

Output the target word and the citation with the blank.`,
});

const wordHintFlow = ai.defineFlow(
  {
    name: 'wordHintFlow',
    inputSchema: WordHintInputSchema,
    outputSchema: WordHintOutputSchema,
  },
  async (input) => {
    const remaining = input.allValidWords.filter(w => !input.foundWords.includes(w));
    if (remaining.length === 0) {
      return { 
        hintWord: '', 
        citation: input.lang === 'ru' ? 'Вы нашли все слова!' : 'You found them all!' 
      };
    }

    const {output} = await wordHintPrompt(input);
    if (!output) throw new Error('AI analysis failed.');
    return output;
  }
);

export async function getWordHint(input: WordHintInput): Promise<WordHintOutput> {
  return wordHintFlow(input);
}
