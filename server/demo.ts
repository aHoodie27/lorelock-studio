import type { ProductionPlan, ValidationResult } from '../shared/contracts.js';

export const demoCanon = `
PROJECT: The Glass Meridian
PREMISE: The failing colony Orison has six weeks of food left after a blight destroyed its crops. Its only viable seed archive is sealed inside the Meridian, an abandoned orbital greenhouse that will break apart in forty-three minutes.
STORY GOAL: Mara has accepted one final salvage run: recover the seed archive and return it to Orison before the station falls out of orbit. If she fails, the colony cannot survive the next growing cycle.
MARA VENN: Deep-space salvage courier in her early thirties. Warm brown skin, long silver braid, amber visor, charcoal pressure suit with copper seam lines, compact oxygen pack, and a triangular blue beacon key mounted on her left glove. She carries no weapon.
KESTREL-9: White spherical survey drone with three folding fins and three red lens clusters. It has no face, limbs, or organic eyes. Kestrel-9 scans with red light and never projects the route map.
LOCATION: The Meridian, a drowned orbital greenhouse. Fractured glass arches, vines drifting in zero gravity, shallow water spheres, and teal emergency strips define the space.
BEACON KEY: Mara's key contains the rescue authorization that can decrypt the greenhouse route and unlock the submerged seed-vault airlock. Its triangular route map is always blue and can originate only from the key on her left glove.
REFLECTION RULE: An unknown traveler appears in the Meridian's glass as a silent reflected silhouette, although no physical person occupies the matching space. The reflection can gesture, but cannot speak or leave the glass.
SIGNAL RULE: Signal colors have fixed owners. Mara's beacon key emits the blue route map. Kestrel-9 emits red scan light only.
VISUAL RULE: Cinematic vertical science-fiction framing, restrained teal-copper-blue palette, no dialogue baked into generated art.
`.trim();

export const demoScene = `
With eighteen minutes left before the Meridian breaks orbit, Mara enters the flooded greenhouse core to reach Orison's seed archive. The direct corridor is crushed beneath a fallen glass arch, so Kestrel-9 sweeps the vines and wreckage with a thin red scan.

Mara raises her left glove. Her beacon key decrypts the old rescue grid and unfolds a blue triangular route map across the flooded floor. The only remaining path leads to the seed-vault airlock beneath the water.

In the fractured glass ahead, the impossible reflection of a second traveler raises one arm and points above the mapped route. Mara does not turn; the space behind her is empty. Kestrel-9's red scan follows the gesture and reveals a cracked ceiling brace poised to collapse. Mara redirects the blue route around the hazard. The reflection vanishes as the beacon key unlocks the submerged airlock, clearing Mara's path to the seed archive.
`.trim();

export const demoPlan: ProductionPlan = {
  projectTitle: 'The Glass Meridian',
  logline: 'A salvage courier racing to recover her colony\'s last seed archive must trust an impossible reflection inside a dying orbital greenhouse.',
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
      lockedFacts: ['Abandoned orbital greenhouse breaking apart in forty-three minutes', 'Fractured glass arches', 'Zero-gravity vines and floating water spheres', 'Teal emergency strips'],
    },
    {
      name: 'Seed archive mission',
      kind: 'object',
      lockedFacts: [
        'Orison\'s crops have failed and the colony has six weeks of food left',
        'The viable seed archive is behind a submerged airlock',
        'Mara\'s beacon key carries the authorization that unlocks the airlock',
      ],
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
      beat: 'With eighteen minutes left, Mara enters the drowned greenhouse core and finds the direct route to Orison\'s seed archive blocked by a fallen arch.',
      framing: 'Low vertical wide shot with Mara foregrounded against floating vines and water spheres.',
      mustShow: ['Silver braid', 'Amber visor', 'Charcoal pressure suit', 'Fallen glass arch blocking the corridor', 'Teal emergency strips'],
      mustAvoid: ['A weapon', 'Bright daylight', 'Kestrel-9 with a humanoid body'],
      continuityRisk: 'medium',
    },
    {
      id: 'SHOT-02',
      beat: 'Because the direct corridor is blocked, Mara uses her left-glove beacon key to decrypt a route toward the submerged seed-vault airlock.',
      framing: 'Vertical medium close-up favoring Mara\'s raised left glove and the flooded floor below.',
      mustShow: ['Beacon key on Mara\'s left glove', 'Blue triangular route map bending around the fallen arch', 'Submerged seed-vault airlock', 'Copper suit seams'],
      mustAvoid: ['Blue light originating from Kestrel-9', 'Beacon on the right hand', 'Any weapon'],
      continuityRisk: 'high',
    },
    {
      id: 'SHOT-03',
      beat: 'The reflection points out a collapsing ceiling brace; Kestrel-9 confirms the danger in red, and Mara reroutes before unlocking the submerged airlock.',
      framing: 'Over-shoulder composition: Mara and drone are physical; the stranger is confined to the reflection.',
      mustShow: ['Kestrel-9 red scan on the cracked brace', 'White spherical drone body', 'Stranger pointing only inside the glass', 'Mara facing forward', 'Blue route bending away from danger'],
      mustAvoid: ['Physical stranger beside Mara', 'Blue drone scan', 'Mara turning around'],
      continuityRisk: 'high',
    },
  ],
  riskSummary: 'The story depends on clear cause and effect as well as visual ownership: the blocked corridor causes Mara to use the blue map, the reflection reveals the hidden hazard, Kestrel-9 confirms it in red, and Mara reroutes to unlock the seed-vault airlock.',
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
      approvedPrompt: 'Vertical cinematic science-fiction panel inside the dying Meridian greenhouse. Mara Venn, warm brown skin, long silver braid, amber visor, and charcoal pressure suit with copper seams, raises her left glove as its triangular beacon key projects a blue route around a fallen glass arch toward the submerged seed-vault airlock. Kestrel-9, a white spherical three-finned drone, scans with red light only. No weapons and no dialogue overlays.',
      evidenceId: 'LL-DEMO-REJECT-001',
    };
  }

  const requiredFacts = [
    { label: 'Mara Venn', present: /mara/.test(normalized), correction: 'Place Mara Venn in the selected shot.' },
    { label: 'left-glove beacon', present: /left (glove|hand)/.test(normalized) && /beacon/.test(normalized), correction: 'Mount the beacon key on Mara\'s left glove.' },
    { label: 'blue route map', present: /blue/.test(normalized) && /(route|map)/.test(normalized), correction: 'Show the beacon projecting a blue triangular route map.' },
    { label: 'seed-vault destination', present: /(seed.?vault|seed archive)/.test(normalized) && /airlock/.test(normalized), correction: 'Make the submerged seed-vault airlock the route destination.' },
    { label: 'Kestrel red scan', present: /kestrel/.test(normalized) && /red/.test(normalized) && /scan/.test(normalized), correction: 'Keep Kestrel-9 behind Mara, scanning hazards in red.' },
  ];
  const missingFacts = requiredFacts.filter((fact) => !fact.present);

  if (missingFacts.length) {
    return {
      verdict: 'revise',
      continuityScore: 68,
      summary: 'The candidate does not contradict canon, but it omits required visual evidence for the selected story beat.',
      checks: [
        { label: 'Character identity', status: requiredFacts[0].present ? 'pass' : 'warn', evidence: requiredFacts[0].present ? 'Mara is present.' : 'Mara is not clearly identified.' },
        { label: 'Signal ownership', status: requiredFacts[1].present && requiredFacts[2].present && requiredFacts[4].present ? 'pass' : 'warn', evidence: 'The selected shot must visibly separate Mara\'s blue left-glove map from Kestrel-9\'s red scan.' },
        { label: 'Location continuity', status: 'pass', evidence: 'No conflicting location detail is present.' },
        { label: 'Story beat', status: requiredFacts[3].present ? 'pass' : 'warn', evidence: 'The route must visibly lead toward the submerged seed-vault airlock so the image advances Mara\'s mission.' },
      ],
      corrections: missingFacts.map((fact) => fact.correction),
      approvedPrompt: 'Vertical cinematic medium close-up in the dying Meridian greenhouse. Mara raises the blue beacon key on her left glove, projecting a route around a fallen glass arch toward the submerged seed-vault airlock. Kestrel-9 scans the hazard in red behind her. Preserve Mara\'s locked appearance, keep her unarmed, and add no dialogue overlays.',
      evidenceId: 'LL-DEMO-REVISE-001',
    };
  }

  return {
    verdict: 'approved',
    continuityScore: 94,
    summary: 'The candidate preserves character identity, signal ownership, environment, and the mission\'s route-to-seed-vault story beat.',
    checks: [
      { label: 'Character identity', status: 'pass', evidence: 'Mara\'s braid, visor, suit, beacon placement, and unarmed silhouette match the locked profile.' },
      { label: 'Signal ownership', status: 'pass', evidence: 'The blue route map comes from Mara\'s left glove while Kestrel-9 uses red scan light.' },
      { label: 'Location continuity', status: 'pass', evidence: 'Fractured glass, drifting vines, floating water, and teal emergency light remain present.' },
      { label: 'Story beat', status: 'pass', evidence: 'Mara uses the beacon map to reach the submerged seed-vault airlock while Kestrel scans for hazards.' },
    ],
    corrections: [],
    approvedPrompt: 'Approved as described. Preserve the mission context, signal ownership, submerged seed-vault destination, and dialogue-free composition.',
    evidenceId: 'LL-DEMO-APPROVE-001',
  };
}
