import type { ProductionPlan, ValidationResult } from '../shared/contracts.js';

export const demoCanon = `
PROJECT: Blood Helix: Type Zero
ROCA JEAN: 18-year-old Helix University freshman. Dark skin, shoulder-length dreadlocks tied back, brown eyes, connected beard and mustache, cross earrings, athletic muscular build, controlled expression. Wears a fitted dark Helix tech tracksuit. He has no active trait in Episode 1; his early combat style is calm, economical, and reactive Zero Point Combat.
SETH WOLFBLOOD: Ranked freshman rival. Tanned skin, slicked-back brown hair, green eyes, explosive athletic build, aggressive stance. Wears a sleeveless dark combat jacket with a fur collar, tiger-orange/gold piping, and hare-white/silver trim. His visible trait manifestations are Tiger strength and Hare agility; those traits belong to Seth, never Roca.
LOCATION: Helix University sparring ring. Circular black platform, crimson boundary light, tiered student seating.
WORLD RULE: Traits have specific owners. Aura color and animal silhouettes cannot migrate between characters. No modern firearms or medieval weapons.
VISUAL RULE: Vertical manga framing, cinematic black-and-crimson palette, no dialogue baked into generated art.
`.trim();

export const demoScene = `
Seth activates Tiger pressure and Hare speed at the same time. The watching students recoil. Roca stays planted at center ring, silent and unreadable. Seth vanishes forward, but Roca turns his shoulder at the last instant and lets the attack pass. Professor Vale realizes Roca is reading intent rather than matching raw speed.
`.trim();

export const demoPlan: ProductionPlan = {
  projectTitle: 'Blood Helix: Type Zero',
  logline: 'A supposedly powerless freshman survives a dual-trait assault by reading intent instead of chasing speed.',
  canon: [
    {
      name: 'Roca Jean',
      kind: 'character',
      lockedFacts: [
        '18-year-old Helix University freshman',
        'Dark skin, shoulder-length dreadlocks tied back, brown eyes, connected beard and mustache, cross earrings',
        'Fitted dark Helix tech tracksuit and controlled expression',
        'No Tiger or Hare aura ownership',
      ],
    },
    {
      name: 'Seth Wolfblood',
      kind: 'character',
      lockedFacts: [
        'Tanned skin, slicked-back brown hair, and green eyes',
        'Aggressive forward stance',
        'Owns both Tiger pressure and Hare speed manifestations',
      ],
    },
    {
      name: 'Helix sparring ring',
      kind: 'location',
      lockedFacts: ['Circular black platform', 'Crimson boundary light', 'Tiered student seating'],
    },
    {
      name: 'Trait ownership',
      kind: 'rule',
      lockedFacts: ['Animal silhouettes and aura signatures never migrate between characters'],
    },
  ],
  shots: [
    {
      id: 'SHOT-01',
      beat: 'Seth stacks Tiger pressure with Hare speed as the room recoils.',
      framing: 'Low-angle vertical medium-wide shot, Seth foreground and students compressed behind him.',
      mustShow: ['Tiger pressure around Seth', 'Hare-speed silhouette behind Seth', 'Green eyes', 'Crimson ring boundary'],
      mustAvoid: ['Any aura on Roca', 'Dialogue text in the art', 'A weapon'],
      continuityRisk: 'high',
    },
    {
      id: 'SHOT-02',
      beat: 'Roca remains still while Seth disappears into motion.',
      framing: 'Centered vertical full-body shot of Roca with motion tearing around the negative space.',
      mustShow: ['Roca planted at center ring', 'Controlled expression', 'Dark Helix tech tracksuit', 'Tied-back dreadlocks and cross earrings'],
      mustAvoid: ['Roca glowing', 'Short straight hair', 'Fearful pose'],
      continuityRisk: 'high',
    },
    {
      id: 'SHOT-03',
      beat: 'Roca rotates one shoulder and lets the strike miss by inches.',
      framing: 'Tight kinetic profile with Seth streaking past and the near-miss readable in silhouette.',
      mustShow: ['Economical shoulder turn', 'Seth moving past Roca', 'Clear spatial near-miss'],
      mustAvoid: ['Roca outrunning Seth', 'A counterattack', 'Trait aura transferred to Roca'],
      continuityRisk: 'medium',
    },
  ],
  riskSummary: 'The central continuity risk is aura ownership: Tiger and Hare manifestations must remain exclusively attached to Seth while Roca wins through restraint and perception.',
};

export function demoValidation(candidateDescription: string): ValidationResult {
  const normalized = candidateDescription.toLowerCase();
  const hasDrift =
    /roca (glows|has|with|surrounded|activates).{0,45}(tiger|hare|aura)|(tiger|hare).{0,30}(around|on|attached to) roca|short straight hair|blue uniform|sword|gun/.test(
      normalized,
    );

  if (hasDrift) {
    return {
      verdict: 'rejected',
      continuityScore: 42,
      summary: 'The composition is readable, but the candidate transfers Seth’s trait language to Roca or breaks locked character continuity.',
      checks: [
        { label: 'Character identity', status: 'warn', evidence: 'Roca is recognizable, but at least one locked visual fact has drifted.' },
        { label: 'Trait ownership', status: 'fail', evidence: 'Tiger/Hare energy belongs to Seth; the candidate assigns it to Roca.' },
        { label: 'Location continuity', status: 'pass', evidence: 'The circular sparring ring and crimson boundary remain readable.' },
        { label: 'Story beat', status: 'fail', evidence: 'Roca should evade through timing, not activate or overpower a trait.' },
      ],
      corrections: [
        'Remove all animal silhouettes and visible aura from Roca.',
        'Keep Roca planted with a controlled expression and economical shoulder movement.',
        'Attach Tiger pressure and Hare motion language exclusively to Seth.',
      ],
      approvedPrompt: 'Vertical cinematic manga panel in the Helix sparring ring. Roca Jean, dark skin, tied-back shoulder-length dreadlocks, connected beard, cross earrings, and a fitted dark Helix tech tracksuit, stays unlit and calm at center frame. Seth Wolfblood streaks past with Tiger pressure and a Hare-speed afterimage attached only to Seth. Roca turns one shoulder by inches; no counterattack, no dialogue, no weapons.',
      evidenceId: 'LL-DEMO-REJECT-001',
    };
  }

  return {
    verdict: 'approved',
    continuityScore: 94,
    summary: 'The candidate preserves character identity, trait ownership, environment, and the intended near-miss story beat.',
    checks: [
      { label: 'Character identity', status: 'pass', evidence: 'Roca’s hair, uniform, posture, and expression match the locked profile.' },
      { label: 'Trait ownership', status: 'pass', evidence: 'Tiger and Hare manifestations remain attached to Seth.' },
      { label: 'Location continuity', status: 'pass', evidence: 'The black circular platform and crimson boundary are present.' },
      { label: 'Story beat', status: 'pass', evidence: 'Roca evades economically without counterattacking or matching Seth’s speed.' },
    ],
    corrections: [],
    approvedPrompt: 'Approved as described. Preserve the current composition and keep generated art free of dialogue overlays.',
    evidenceId: 'LL-DEMO-APPROVE-001',
  };
}
