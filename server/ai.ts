import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import {
  productionPlanSchema,
  validationResultSchema,
  type ProductionPlan,
  type ValidationResult,
} from '../shared/contracts.js';

const model = process.env.OPENAI_MODEL || 'gpt-5.6';

function client() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function createProductionPlan(canonText: string, sceneText: string): Promise<ProductionPlan> {
  const response = await client().responses.parse({
    model,
    reasoning: { effort: 'medium' },
    input: [
      {
        role: 'system',
        content: 'You are a continuity director for visual storytelling. Extract only facts supported by the supplied canon, convert the scene into 3-5 filmable shots, and make every continuity risk explicit. Never invent missing character facts. Keep shot directions concise and production-ready.',
      },
      {
        role: 'user',
        content: `CANON SOURCE\n${canonText}\n\nSCENE\n${sceneText}`,
      },
    ],
    text: {
      format: zodTextFormat(productionPlanSchema, 'production_plan'),
    },
  });

  if (!response.output_parsed) {
    throw new Error('GPT-5.6 returned no structured production plan');
  }
  return productionPlanSchema.parse(response.output_parsed);
}

export async function validateCandidate(args: {
  plan: ProductionPlan;
  shotId: string;
  candidateDescription: string;
  imageDataUrl?: string;
}): Promise<ValidationResult> {
  const shot = args.plan.shots.find((item) => item.id === args.shotId);
  if (!shot) throw new Error(`Unknown shot: ${args.shotId}`);

  const userContent: Array<
    | { type: 'input_text'; text: string }
    | { type: 'input_image'; image_url: string; detail: 'high' }
  > = [
    {
      type: 'input_text',
      text: `LOCKED CANON\n${JSON.stringify(args.plan.canon)}\n\nSHOT SPEC\n${JSON.stringify(shot)}\n\nCANDIDATE DESCRIPTION\n${args.candidateDescription}\n\nJudge only against the supplied evidence. The evidenceId must begin with LL-.`,
    },
  ];

  if (args.imageDataUrl) {
    userContent.push({ type: 'input_image', image_url: args.imageDataUrl, detail: 'high' });
  }

  const response = await client().responses.parse({
    model,
    reasoning: { effort: 'medium' },
    input: [
      {
        role: 'system',
        content: 'You are a strict but practical continuity QA director. Compare the candidate against locked canon and the selected shot. Fail material identity, ownership, wardrobe, location, or story-beat drift. Do not claim to see details that are absent. Provide a corrected production prompt that preserves the intended composition. continuityScore must be an integer from 0 to 100 (for example, use 87 rather than 0.87). Approve a text-only candidate when it explicitly satisfies every mustShow and mustAvoid constraint; do not demand invisible details beyond the supplied shot specification.',
      },
      { role: 'user', content: userContent },
    ],
    text: {
      format: zodTextFormat(validationResultSchema, 'continuity_validation'),
    },
  });

  if (!response.output_parsed) {
    throw new Error('GPT-5.6 returned no structured validation result');
  }
  return validationResultSchema.parse(response.output_parsed);
}
