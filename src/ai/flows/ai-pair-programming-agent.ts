// src/ai/flows/ai-pair-programming-agent.ts
'use server';

/**
 * @fileOverview An AI pair programming agent that auto-comments code, provides predictive typing, and remembers coding style and prompt context.
 *
 * - aiPairProgrammingAgent - A function that handles the AI pair programming process.
 * - AIPairProgrammingAgentInput - The input type for the aiPairProgrammingAgent function.
 * - AIPairProgrammingAgentOutput - The return type for the aiPairProgrammingAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPairProgrammingAgentInputSchema = z.object({
  code: z.string().describe('The code to be commented or assisted with.'),
  language: z.string().describe('The programming language of the code.'),
  tone: z.string().describe('The desired tone for the comments (e.g., friendly, professional, sarcastic).').optional(),
  promptContext: z.string().describe('The context of the current prompt or coding task.').optional(),
});

export type AIPairProgrammingAgentInput = z.infer<typeof AIPairProgrammingAgentInputSchema>;

const AIPairProgrammingAgentOutputSchema = z.object({
  commentedCode: z.string().describe('The code with auto-generated comments.'),
  predictiveTypingSuggestions: z.array(z.string()).describe('Suggestions for predictive typing based on the code and context.'),
});

export type AIPairProgrammingAgentOutput = z.infer<typeof AIPairProgrammingAgentOutputSchema>;

export async function aiPairProgrammingAgent(input: AIPairProgrammingAgentInput): Promise<AIPairProgrammingAgentOutput> {
  return aiPairProgrammingAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPairProgrammingAgentPrompt',
  input: {schema: AIPairProgrammingAgentInputSchema},
  output: {schema: AIPairProgrammingAgentOutputSchema},
  prompt: `You are an AI pair programming agent that helps developers write better code.

You will receive code, its programming language, the desired tone for comments, and the context of the current prompt or coding task.
Based on this information, you will auto-comment the code, and provide predictive typing suggestions.

Language: {{{language}}}
Tone: {{{tone}}}
Context: {{{promptContext}}}

Code:
{{{code}}}`,
});

const aiPairProgrammingAgentFlow = ai.defineFlow(
  {
    name: 'aiPairProgrammingAgentFlow',
    inputSchema: AIPairProgrammingAgentInputSchema,
    outputSchema: AIPairProgrammingAgentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
