import { embed } from './openai.js';
import { all, run } from './db.js';
import type { Fact } from './types.js';

export function cosine(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  if (normA === 0 || normB === 0) return 0;
  return dot / (normA * normB);
}

export async function searchFacts(property_id: string, query: string, k = 10): Promise<Fact[]> {
  const qEmbedding = await embed(query);
  const rows = await all<any>('SELECT * FROM facts WHERE property_id = ?', [property_id]);
  const scored = rows.map((r: any) => {
    const emb = JSON.parse(r.embedding);
    const score = cosine(qEmbedding, emb);
    return { id: r.id, property_id: r.property_id, unit: r.unit, category: r.category, summary: r.summary, score } as Fact;
  });
  scored.sort((a, b) => (b.score! - a.score!));
  return scored.slice(0, k);
}

export async function upsertFacts(property_id: string, facts: Fact[]): Promise<Fact[]> {
  const added: Fact[] = [];
  for (const f of facts) {
    const emb = await embed(f.summary);
    await run('INSERT INTO facts(property_id, unit, category, summary, embedding) VALUES (?,?,?,?,?)', [property_id, f.unit, f.category, f.summary, JSON.stringify(emb)]);
    added.push({ property_id, unit: f.unit ?? null, category: f.category, summary: f.summary });
  }
  return added;
}
