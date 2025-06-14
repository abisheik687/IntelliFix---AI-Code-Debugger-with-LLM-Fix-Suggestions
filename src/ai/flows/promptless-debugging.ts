// src/ai/flows/promptless-debugging.ts
'use server';

/**
 * @fileOverview Implements the promptless debugging flow.
 *
 * - promptlessDebugging - A function that accepts code and attempts to fix it automatically.
 * - PromptlessDebuggingInput - The input type for the promptlessDebugging function.
 * - PromptlessDebuggingOutput - The return type for the promptlessDebugging function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PromptlessDebuggingInputSchema = z.object({
  code: z.string().describe('The code to debug.'),
  language: z.string().describe('The programming language of the code.'),
  error: z.string().optional().describe('The error message, if any.'),
});

export type PromptlessDebuggingInput = z.infer<typeof PromptlessDebuggingInputSchema>;

const PromptlessDebuggingOutputSchema = z.object({
  fixedCode: z.string().describe('The automatically fixed code, if successful.'),
  explanation: z.string().describe('An explanation of the fix.'),
});

export type PromptlessDebuggingOutput = z.infer<typeof PromptlessDebuggingOutputSchema>;

export async function promptlessDebugging(input: PromptlessDebuggingInput): Promise<PromptlessDebuggingOutput> {
  return promptlessDebuggingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'promptlessDebuggingPrompt',
  input: {schema: PromptlessDebuggingInputSchema},
  output: {schema: PromptlessDebuggingOutputSchema},
  prompt: `You are an AI code debugger. You will receive code, the language it is written in, and optionally an error message.
Your task is to fix the code and provide an explanation of the fix.

Here is the code:
\`\`\`{{{language}}}
{{{code}}}
\`\`\`

{{#if error}}
Here is the error message:
{{{error}}}
{{/if}}

Provide the fixed code and an explanation of the changes.

Fixed Code:
Explanation:`, // Ensure the LLM outputs the fixed code and explanation
});

const promptlessDebuggingFlow = ai.defineFlow(
  {
    name: 'promptlessDebuggingFlow',
    inputSchema: PromptlessDebuggingInputSchema,
    outputSchema: PromptlessDebuggingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      fixedCode: output?.fixedCode || 'No fix available.',
      explanation: output?.explanation || 'No explanation available.',
    };
  }
);
