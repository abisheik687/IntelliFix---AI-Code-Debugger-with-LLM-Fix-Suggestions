import { config } from 'dotenv';
config();

import '@/ai/flows/explain-error.ts';
import '@/ai/flows/intent-detection.ts';
import '@/ai/flows/suggest-fix.ts';
import '@/ai/flows/promptless-debugging.ts';
import '@/ai/flows/unit-test-generator.ts';
import '@/ai/flows/ai-pair-programming-agent.ts';