import assert from 'node:assert/strict';
import test from 'node:test';
import { productionPlanSchema, validationResultSchema } from '../shared/contracts.js';
import { demoPlan, demoValidation } from './demo.js';

test('demo plan satisfies the production contract', () => {
  assert.equal(productionPlanSchema.safeParse(demoPlan).success, true);
});

test('demo validator rejects signal ownership drift', () => {
  const result = demoValidation('Kestrel projects the blue route map while Mara carries a laser sword.');
  assert.equal(validationResultSchema.safeParse(result).success, true);
  assert.equal(result.verdict, 'rejected');
});

test('demo validator approves canon-safe candidates', () => {
  const result = demoValidation('Mara projects a blue route map from the beacon on her left glove toward the submerged seed-vault airlock while Kestrel scans the blocked corridor with red light.');
  assert.equal(result.verdict, 'approved');
});

test('demo validator requests revision when the shot omits story-critical evidence', () => {
  const result = demoValidation('Mara stands quietly inside a dark greenhouse.');
  assert.equal(validationResultSchema.safeParse(result).success, true);
  assert.equal(result.verdict, 'revise');
  assert.match(result.summary, /omits required visual evidence/i);
});
