import assert from 'node:assert/strict';
import test from 'node:test';
import { productionPlanSchema, validationResultSchema } from '../shared/contracts.js';
import { demoPlan, demoValidation } from './demo.js';

test('demo plan satisfies the production contract', () => {
  assert.equal(productionPlanSchema.safeParse(demoPlan).success, true);
});

test('demo validator rejects trait ownership drift', () => {
  const result = demoValidation('Roca glows with a tiger aura and rushes Seth with a sword.');
  assert.equal(validationResultSchema.safeParse(result).success, true);
  assert.equal(result.verdict, 'rejected');
});

test('demo validator approves canon-safe candidates', () => {
  const result = demoValidation('Roca stays calm and unlit while Seth passes with Tiger and Hare energy attached only to Seth.');
  assert.equal(result.verdict, 'approved');
});
