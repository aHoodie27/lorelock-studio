import type { ProductionPlan, ValidationResult } from '../shared/contracts.js';

export const demoCanon = `
PROJECT: The Glass Meridian
MARA VENN: Deep-space salvage courier in her early thirties. Warm brown skin, long silver braid, amber visor, charcoal pressure suit with copper seam lines, compact oxygen pack, and a triangular blue beacon key mounted on her left glove. She carries no weapon.
KESTREL-9: White spherical survey drone with three folding fins and three red lens clusters. It has no face, limbs, or organic eyes. Kestrel-9 scans with red light and never projects the route map.
LOCATION: The Meridian, a drowned orbital greenhouse. Fractured glass arches, vines drifting in zero gravity, shallow water spheres, and teal emergency strips define the space.
WORLD RULE: Signal colors have fixed owners. The triangular route map is blue and can originate only from Mara's beacon key. Kestrel-9 emits red scan light only. The reflected stranger may appear only as a silhouette in glass, never physically beside Mara.
VISUAL RULE: Cinematic vertical science-fiction framing, restrained teal-copper-blue palette, no dialogue baked into generated art.
`.trim();

export const demoScene = `
Mara reaches the greenhouse core and raises her left glove. The beacon key unfolds a blue triangular route map over the flooded floor. Kestrel-9 drifts behind her, painting the vines with a thin red scan. In the fractured glass ahead, Mara notices the reflected silhouette of a second traveler standing where no one is present. She does not turn. The map points toward a sealed airlock beneath the water.
`.trim();

export const demoPlan: ProductionPlan = {
  projectTitle: 'The Glass Meridian',
  logline: 'A lone salvage courier follows a signal through a drowned orbital greenhouse while an impossible reflection watches her.',
  canon: [
    {
      name: 'Mara Venn',
      kind: 'character',
      lockedFacts: [
        'Warm brown skin, long silver braid, and amber visor',
        'Charcoal pressure suit with copper seam lines and compact oxygen pack',
        'Triangular blue beacon key mounted on her left glove',
        'Carries no weapon',
      ],
    },
    {
      name: 'Kestrel-9',
      kind: 'character',
      lockedFacts: [
        'White spherical survey drone with three folding fins',
        'Three red lens clusters and no organic face or limbs',
        'Emits red scan light only and never projects the route map',
      ],
    },
    {
      name: 'The Meridian greenhouse',
      kind: 'location',
      lockedFacts: ['Fractured glass arches', 'Zero-gravity vines and floating water spheres', 'Teal emergency strips'],
    },
    {
      name: 'Signal ownership',
      kind: 'rule',
      lockedFacts: [
        'Blue triangular route map originates only from Mara\'s beacon key',
        'Kestrel-9 scan light is always red',
        'The stranger exists only as a reflected silhouette in glass',
      ],
    },
  ],
  shots: [
    {
      id: 'SHOT-01',
      beat: 'Mara enters the drowned greenhouse core beneath fractured glass arches.',
      framing: 'Low vertical wide shot with Mara foregrounded against floating vines and water spheres.',
      mustShow: ['Silver braid', 'Amber visor', 'Charcoal pressure suit', 'Teal emergency strips'],
      mustAvoid: ['A weapon', 'Bright daylight', 'Kestrel-9 with a humanoid body'],
      continuityRisk: 'medium',
    },
    {
      id: 'SHOT-02',
      beat: 'Mara raises her left glove and reveals the route toward the submerged airlock.',
      framing: 'Centered vertical medium shot with the projection cutting across the flooded floor.',
      mustShow: ['Beacon key on Mara\'s left glove', 'Blue triangular route map', 'Submerged airlock', 'Copper suit seams'],
      mustAvoid: ['Blue light originating from Kestrel-9', 'Beacon on the right hand', 'Any weapon'],
      continuityRisk: 'high',
    },
    {
      id: 'SHOT-03',
      beat: 'Kestrel-9 scans the vines while the impossible traveler appears only in fractured glass.',
      framing: 'Over-shoulder composition: Mara and drone are physical; the stranger is confined to the reflection.',
      mustShow: ['Kestrel-9 red scan light', 'White spherical drone body', 'Stranger silhouette only in glass', 'Mara facing forward'],
      mustAvoid: ['Physical stranger beside Mara', 'Blue drone scan', 'Mara turning around'],
      continuityRisk: 'high',
    },
  ],
  riskSummary: 'The central continuity risk is signal and presence ownership: the blue map belongs only to Mara\'s left-glove key, the red scan belongs only to Kestrel-9, and the stranger can exist only as a reflection.',
};

export function demoValidation(candidateDescription: string): ValidationResult {
  const normalized = candidateDescription.toLowerCase();
  const hasDrift =
    /kestrel.{0,55}(blue|route map|projects the map)|blue.{0,35}(from|around|on).{0,20}kestrel|mara.{0,50}(right glove|right hand|laser sword|gun|weapon|black hair|white suit|white coat)|stranger.{0,35}(beside|behind|next to) mara/.test(
      normalized,
    );

  if (hasDrift) {
    return {
      verdict: 'rejected',
      continuityScore: 42,
      summary: 'The composition is readable, but it breaks locked signal ownership, character identity, or the reflection-only story rule.',
      checks: [
        { label: 'Character identity', status: 'warn', evidence: 'Mara is present, but at least one locked visual fact has drifted.' },
        { label: 'Signal ownership', status: 'fail', evidence: 'The blue route map belongs to Mara\'s left-glove beacon; Kestrel-9 emits red scan light only.' },
        { label: 'Location continuity', status: 'pass', evidence: 'The drowned greenhouse remains readable.' },
        { label: 'Story beat', status: 'fail', evidence: 'The stranger must remain confined to the glass reflection, and Mara carries no weapon.' },
      ],
      corrections: [
        'Move the blue triangular projection to the beacon key on Mara\'s left glove.',
        'Keep Kestrel-9 spherical and white with red lens clusters and red scan light only.',
        'Remove all weapons and place the stranger only inside the fractured-glass reflection.',
      ],
      approvedPrompt: 'Vertical cinematic science-fiction panel inside the drowned Meridian greenhouse. Mara Venn, warm brown skin, long silver braid, amber visor, and charcoal pressure suit with copper seams, raises her left glove as its triangular beacon key projects a blue route map toward a submerged airlock. Kestrel-9, a white spherical three-finned drone, scans the vines with red light only. A second traveler appears solely as a silhouette reflected in fractured glass; no weapons and no dialogue overlays.',
      evidenceId: 'LL-DEMO-REJECT-001',
    };
  }

  return {
    verdict: 'approved',
    continuityScore: 94,
    summary: 'The candidate preserves character identity, signal ownership, environment, and the reflection-only story beat.',
    checks: [
      { label: 'Character identity', status: 'pass', evidence: 'Mara\'s braid, visor, suit, beacon placement, and unarmed silhouette match the locked profile.' },
      { label: 'Signal ownership', status: 'pass', evidence: 'The blue route map comes from Mara\'s left glove while Kestrel-9 uses red scan light.' },
      { label: 'Location continuity', status: 'pass', evidence: 'Fractured glass, drifting vines, floating water, and teal emergency light remain present.' },
      { label: 'Story beat', status: 'pass', evidence: 'The stranger appears only in reflection while Mara faces forward.' },
    ],
    corrections: [],
    approvedPrompt: 'Approved as described. Preserve the signal colors, reflection-only stranger, and dialogue-free composition.',
    evidenceId: 'LL-DEMO-APPROVE-001',
  };
}
