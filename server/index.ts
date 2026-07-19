import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { planRequestSchema, validateRequestSchema } from '../shared/contracts.js';
import { createProductionPlan, validateCandidate } from './ai.js';
import { demoCanon, demoPlan, demoScene, demoValidation } from './demo.js';

const app = express();
const port = Number(process.env.PORT || 8787);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');

app.use(cors());
app.use(express.json({ limit: '12mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, model: process.env.OPENAI_MODEL || 'gpt-5.6', live: Boolean(process.env.OPENAI_API_KEY) });
});

app.get('/api/demo', (_req, res) => {
  res.json({ canonText: demoCanon, sceneText: demoScene, plan: demoPlan });
});

app.post('/api/plan', async (req, res) => {
  const parsed = planRequestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid request' });

  try {
    const live = Boolean(process.env.OPENAI_API_KEY);
    const plan = live
      ? await createProductionPlan(parsed.data.canonText, parsed.data.sceneText)
      : demoPlan;
    return res.json({ plan, mode: live ? 'live' : 'demo', model: process.env.OPENAI_MODEL || 'gpt-5.6' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Planning failed' });
  }
});

app.post('/api/validate', async (req, res) => {
  const parsed = validateRequestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid request' });

  try {
    const live = Boolean(process.env.OPENAI_API_KEY);
    const result = live
      ? await validateCandidate(parsed.data)
      : demoValidation(parsed.data.candidateDescription);
    return res.json({ result, mode: live ? 'live' : 'demo', model: process.env.OPENAI_MODEL || 'gpt-5.6' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Validation failed' });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distPath));
  app.get('/{*splat}', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

app.listen(port, () => {
  console.log(`LoreLock API listening on http://localhost:${port}`);
});
