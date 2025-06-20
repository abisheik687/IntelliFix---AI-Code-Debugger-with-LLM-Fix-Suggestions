// This is an autogenerated file from Firebase Studio.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for detecting the intent of errors.
 *
 * The flow classifies errors into types such as Syntax, Semantic, Logic, or API misuse.
 * This helps in gaining insights into common error patterns in the codebase.
 *
 * @interface IntentDetectionInput - Defines the input schema for the intent detection flow.
 * @interface IntentDetectionOutput - Defines the output schema for the intent detection flow.
 * @function detectErrorIntent - An async function that takes IntentDetectionInput and returns IntentDetectionOutput.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntentDetectionInputSchema = z.object({
  codeSnippet: z
    .string()
    .describe('The code snippet where the error occurred.'),
  errorTrace: z.string().describe('The error trace or message.'),
});
export type IntentDetectionInput = z.infer<typeof IntentDetectionInputSchema>;

const IntentDetectionOutputSchema = z.object({
  intent: z
    .enum(['Syntax', 'Semantic', 'Logic', 'API misuse'])
    .describe('The detected intent of the error.'),
  explanation: z
    .string()
    .describe('A brief explanation of why the error is classified as such.'),
});
export type IntentDetectionOutput = z.infer<typeof IntentDetectionOutputSchema>;

export async function detectErrorIntent(input: IntentDetectionInput): Promise<IntentDetectionOutput> {
  return detectErrorIntentFlow(input);
}

const detectErrorIntentPrompt = ai.definePrompt({
  name: 'detectErrorIntentPrompt',
  input: {schema: IntentDetectionInputSchema},
  output: {schema: IntentDetectionOutputSchema},
  prompt: `You are an expert in classifying code errors. Given the following code snippet and error trace, determine the intent of the error.

Code Snippet:
{{codeSnippet}}

Error Trace:
{{errorTrace}}

Classify the error intent as one of the following:
- Syntax: The error is due to incorrect syntax in the code.
- Semantic: The error is due to a type mismatch or incorrect use of variables.
- Logic: The error is due to a flaw in the program's logic.
- API misuse: The error is due to incorrect use of an API or library.

Explain briefly why you classified the error as such.

Ensure the output is JSON format and matches the schema.`,
});

const detectErrorIntentFlow = ai.defineFlow(
  {
    name: 'detectErrorIntentFlow',
    inputSchema: IntentDetectionInputSchema,
    outputSchema: IntentDetectionOutputSchema,
  },
  async input => {
    const {output} = await detectErrorIntentPrompt(input);
    return output!;
  }
);
