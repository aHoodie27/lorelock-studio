import { z } from 'zod';

export const canonEntitySchema = z.object({
  name: z.string(),
  kind: z.enum(['character', 'location', 'ability', 'object', 'rule']),
  lockedFacts: z.array(z.string()),
});

export const shotSchema = z.object({
  id: z.string(),
  beat: z.string(),
  framing: z.string(),
  mustShow: z.array(z.string()),
  mustAvoid: z.array(z.string()),
  continuityRisk: z.enum(['low', 'medium', 'high']),
});

export const productionPlanSchema = z.object({
  projectTitle: z.string(),
  logline: z.string(),
  canon: z.array(canonEntitySchema),
  shots: z.array(shotSchema).min(1).max(6),
  riskSummary: z.string(),
});

export const continuityCheckSchema = z.object({
  label: z.string(),
  status: z.enum(['pass', 'warn', 'fail']),
  evidence: z.string(),
});

export const validationResultSchema = z.object({
  verdict: z.enum(['approved', 'revise', 'rejected']),
  continuityScore: z.number().min(0).max(100),
  summary: z.string(),
  checks: z.array(continuityCheckSchema),
  corrections: z.array(z.string()),
  approvedPrompt: z.string(),
  evidenceId: z.string(),
});

export const planRequestSchema = z.object({
  canonText: z.string().min(40).max(60_000),
  sceneText: z.string().min(20).max(20_000),
});

export const validateRequestSchema = z.object({
  plan: productionPlanSchema,
  shotId: z.string(),
  candidateDescription: z.string().min(10).max(10_000),
  imageDataUrl: z.string().startsWith('data:image/').max(8_000_000).optional(),
});

export type ProductionPlan = z.infer<typeof productionPlanSchema>;
export type ValidationResult = z.infer<typeof validationResultSchema>;
