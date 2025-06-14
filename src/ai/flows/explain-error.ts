'use server';

/**
 * @fileOverview Explains a code error given a code snippet and error trace.
 *
 * - explainError - A function that takes code and an error trace, and returns an explanation of the error, its root cause, and links to documentation.
 * - ExplainErrorInput - The input type for the explainError function.
 * - ExplainErrorOutput - The return type for the explainError function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainErrorInputSchema = z.object({
  codeSnippet: z
    .string()
    .describe('The code snippet that contains the error.'),
  errorTrace: z
    .string()
    .describe('The error trace generated when running the code snippet.'),
});
export type ExplainErrorInput = z.infer<typeof ExplainErrorInputSchema>;

const ExplainErrorOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the error.'),
  rootCause: z.string().describe('The root cause of the error.'),
  documentationLinks: z
    .array(z.string().url())
    .describe('Links to relevant documentation that can help resolve the error.'),
});
export type ExplainErrorOutput = z.infer<typeof ExplainErrorOutputSchema>;

export async function explainError(input: ExplainErrorInput): Promise<ExplainErrorOutput> {
  return explainErrorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainErrorPrompt',
  input: {schema: ExplainErrorInputSchema},
  output: {schema: ExplainErrorOutputSchema},
  prompt: `You are an AI assistant that helps explain code errors.

  Given the following code snippet and error trace, explain the error, its root cause, and provide links to relevant documentation.

  Code Snippet:
  ```
  {{{codeSnippet}}}
  ```

  Error Trace:
  ```
  {{{errorTrace}}}
  ````,
});

const explainErrorFlow = ai.defineFlow(
  {
    name: 'explainErrorFlow',
    inputSchema: ExplainErrorInputSchema,
    outputSchema: ExplainErrorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
