// Assigns a species to each repository and evolves it with the experience it earned.
// The tunable numbers live in config.mjs.
import { createHash } from 'node:crypto';
import { TIERS, FALLBACK_LEVEL } from './config.mjs';

const hash = (s) => Number.parseInt(createHash('sha256').update(s).digest('hex').slice(0, 12), 16);

export function makeDex(db) {
  const childrenOf = (id) => db.species.filter((s) => s.from === id && s.evo);
  const threshold = (s) =>
    db.curves[s.growthRateId][Math.min(s.evo.minLevel ?? FALLBACK_LEVEL[s.evo.trigger] ?? 30, 100)] ?? Infinity;

  // Only base forms that evolve are used. Sorting by catch rate splits them evenly across tiers.
  const bases = db.species
    .filter((s) => !s.from && !s.legendary && !s.mythical && childrenOf(s.id).length)
    .sort((a, b) => b.captureRate - a.captureRate); // common first, rare last
  const size = Math.ceil(bases.length / TIERS.length);
  const poolOf = (i) =>
    bases.slice(Math.max(0, bases.length - (i + 1) * size), Math.max(0, bases.length - i * size));

  const used = new Set();
  /** Repository name to base form. The same repository always maps to the same species. */
  const assign = (full, stars) => {
    const i = TIERS.findIndex((t) => stars >= t.minStars);
    const pool = poolOf(i);
    const start = hash(full) % pool.length;
    for (let k = 0; k < pool.length; k++) {
      const sp = pool[(start + k) % pool.length];
      if (!used.has(sp.id)) { used.add(sp.id); return { sp, tier: TIERS[i].label }; }
    }
    return { sp: pool[start], tier: TIERS[i].label };
  };

  /** Holds a species so no other repository draws it. */
  const reserve = (id) => used.add(id);

  /** Walks the evolution line as far as the experience allows, returning every stage passed. */
  const grow = (base, exp) => {
    const line = [base];
    for (let cur = base, g = 0; g < 5; g++) {
      const ready = childrenOf(cur.id)
        .map((s) => ({ s, need: threshold(s) }))
        .filter((x) => exp >= x.need)
        .sort((a, b) => a.need - b.need);
      if (!ready.length) break;
      cur = ready[0].s;
      line.push(cur);
    }
    return line;
  };

  /** Level for a given amount of experience on that species' curve. */
  const levelOf = (sp, exp) => {
    const curve = db.curves[sp.growthRateId] ?? {};
    let lv = 1;
    for (let l = 1; l <= 100; l++) if (exp >= (curve[l] ?? Infinity)) lv = l;
    return lv;
  };

  return { assign, grow, reserve, levelOf, childrenOf, threshold, baseCount: bases.length };
}
