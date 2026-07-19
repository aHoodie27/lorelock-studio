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
  const result = demoValidation('Mara projects a blue route map from her left glove while Kestrel scans with red light.');
  assert.equal(result.verdict, 'approved');
});
