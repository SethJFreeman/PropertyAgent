import OpenAI from 'openai';
import { CHAT_SYSTEM_PROMPT, FACT_SYSTEM_PROMPT } from './prompts.js';
import type { Action, Fact } from './types.js';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embed(text: string): Promise<number[]> {
  const res = await client.embeddings.create({ model: 'text-embedding-3-small', input: text });
  return res.data[0].embedding;
}

export async function chat(text: string, facts: Fact[]): Promise<{ assistant_reply: string; action: Action }> {
  const context = facts.map(f => `- [Unit ${f.unit ?? ''}][${f.category}] ${f.summary}`).join('\n');
  const messages = [
    { role: 'system', content: CHAT_SYSTEM_PROMPT + (context ? `\n\nContext:\n${context}` : '') },
    { role: 'user', content: text }
  ];
  const resp = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    response_format: { type: 'json_object' }
  });
  const content = resp.choices[0].message?.content ?? '{}';
  return JSON.parse(content);
}

export async function extractFacts(conversation: string): Promise<Fact[]> {
  const messages = [
    { role: 'system', content: FACT_SYSTEM_PROMPT },
    { role: 'user', content: conversation }
  ];
  const resp = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    response_format: { type: 'json_object' }
  });
  const content = resp.choices[0].message?.content ?? '{"facts":[]}' ;
  const json = JSON.parse(content);
  return json.facts || [];
}
