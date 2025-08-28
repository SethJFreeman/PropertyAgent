import express from 'express';
import { run } from './db.js';
import { searchFacts, upsertFacts } from './rag.js';
import { chat, extractFacts } from './openai.js';
import type { ChatRequest } from './types.js';

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true });
});

router.get('/facts/search', async (req, res) => {
  const { property_id, q } = req.query as any;
  if (!property_id || !q) return res.status(400).json({ error: 'Missing property_id or q' });
  try {
    const facts = await searchFacts(property_id, q);
    res.json({ facts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

router.post('/chat', async (req, res) => {
  const { thread_id, text, tech_id, property_id } = req.body as ChatRequest;
  if (!thread_id || !text || !tech_id || !property_id) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    await run(
      'INSERT INTO messages(thread_id, role, text, tech_id, property_id) VALUES (?, "user", ?, ?, ?)',
      [thread_id, text, tech_id, property_id]
    );

    const contextFacts = await searchFacts(property_id, text);
    const { assistant_reply, action } = await chat(text, contextFacts);

    await run(
      'INSERT INTO messages(thread_id, role, text, tech_id, property_id) VALUES (?, "assistant", ?, ?, ?)',
      [thread_id, assistant_reply, tech_id, property_id]
    );

    const conversation = `user: ${text}\nassistant: ${assistant_reply}`;
    const extracted = await extractFacts(conversation);
    const facts_added = await upsertFacts(property_id, extracted);

    res.json({ assistant_reply, action, facts_added });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

export default router;
