
'use server';

/**
 * @fileOverview AI-powered code fix suggestion flow.
 *
 * - suggestFix - A function that suggests automated fixes for code errors, displayed as inline diffs.
 * - SuggestFixInput - The input type for the suggestFix function.
 * - SuggestFixOutput - The return type for the suggestFix function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFixInputSchema = z.object({
  code: z.string().describe('The code snippet with the error.'),
  error: z.string().describe('The error message or stack trace.'),
  language: z.string().describe('The programming language of the code.'),
});
export type SuggestFixInput = z.infer<typeof SuggestFixInputSchema>;

const SuggestFixOutputSchema = z.object({
  diff: z.string().describe('The inline diff of the suggested fix.'),
  explanation: z.string().describe('The explanation of the fix.'),
});
export type SuggestFixOutput = z.infer<typeof SuggestFixOutputSchema>;

export async function suggestFix(input: SuggestFixInput): Promise<SuggestFixOutput> {
  return suggestFixFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFixPrompt',
  input: {schema: SuggestFixInputSchema},
  output: {schema: SuggestFixOutputSchema},
  prompt: `You are an AI code assistant that suggests fixes for code errors.

  Given the following code and error message, generate an inline diff that fixes the error.
  Also, provide a brief explanation of the fix.

  Language: {{{language}}}
  Code:
  \`\`\`{{{language}}}
  {{{code}}}
  \`\`\`
  Error:
  {{{error}}}
  Diff:
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const suggestFixFlow = ai.defineFlow(
  {
    name: 'suggestFixFlow',
    inputSchema: SuggestFixInputSchema,
    outputSchema: SuggestFixOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
