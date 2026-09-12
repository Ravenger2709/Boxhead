export interface SubExplosion {
  x: number;
  z: number;
  delay: number;
  damage: number;
  radius: number;
}

/**
 * Creates delayed secondary sub-explosions in an expanding ring for BigBang / BiggerBang.
 *
 * - BigBang: 1 expanding ring of 6 sub-explosions at ~65% radius after 0.10s delay.
 * - BiggerBang: 2 concentric expanding rings:
 *     Ring 1: 6 sub-explosions at 50% radius after 0.08s delay.
 *     Ring 2: 8 sub-explosions at 90% radius after 0.16s delay.
 */
export function createExplosionRing(
  centerX: number,
  centerZ: number,
  baseDamage: number,
  baseRadius: number,
  isBiggerBang: boolean
): SubExplosion[] {
  const explosions: SubExplosion[] = [];

  if (isBiggerBang) {
    // Ring 1: Inner ring expanding outward
    const ring1Count = 6;
    const ring1Dist = baseRadius * 0.5;
    const ring1Delay = 0.08;
    const ring1Damage = Math.round(baseDamage * 0.4);
    const ring1Radius = baseRadius * 0.45;

    for (let i = 0; i < ring1Count; i++) {
      const angle = (i * 2 * Math.PI) / ring1Count;
      explosions.push({
        x: centerX + Math.cos(angle) * ring1Dist,
        z: centerZ + Math.sin(angle) * ring1Dist,
        delay: ring1Delay,
        damage: ring1Damage,
        radius: ring1Radius,
      });
    }

    // Ring 2: Outer expanding ring
    const ring2Count = 8;
    const ring2Dist = baseRadius * 0.9;
    const ring2Delay = 0.16;
    const ring2Damage = Math.round(baseDamage * 0.35);
    const ring2Radius = baseRadius * 0.45;

    for (let i = 0; i < ring2Count; i++) {
      const angle = (i * 2 * Math.PI) / ring2Count + Math.PI / ring2Count;
      explosions.push({
        x: centerX + Math.cos(angle) * ring2Dist,
        z: centerZ + Math.sin(angle) * ring2Dist,
        delay: ring2Delay,
        damage: ring2Damage,
        radius: ring2Radius,
      });
    }
  } else {
    // BigBang: Single expanding ring
    const count = 6;
    const dist = baseRadius * 0.65;
    const delay = 0.10;
    const subDamage = Math.round(baseDamage * 0.45);
    const subRadius = baseRadius * 0.5;

    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count;
      explosions.push({
        x: centerX + Math.cos(angle) * dist,
        z: centerZ + Math.sin(angle) * dist,
        delay,
        damage: subDamage,
        radius: subRadius,
      });
    }
  }

  return explosions;
}
