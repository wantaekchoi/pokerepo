// Defaults live here, but nobody using this action edits files.
// The workflow overrides everything through environment variables (= action inputs).

const num = (k, d) => Number(process.env[k] ?? d);
const list = (k, d) => (process.env[k] ?? d).split(',').map((x) => x.trim());

/** Experience granted per contribution. */
export const EXP = {
  commit: num('POKEREPO_EXP_COMMIT', 400),
  mergeExternal: num('POKEREPO_EXP_MERGE', 1500), // a PR accepted into someone else's repository
  mergeOwn: num('POKEREPO_EXP_MERGE_OWN', 400), // a PR you merged into your own
  grassLevel: list('POKEREPO_EXP_GRASS', '0,100,250,450,700').map(Number),
};

/** Upstream stars decide rarity. Written as "stars:label"; any number of tiers works. */
export const TIERS = list('POKEREPO_TIERS', '10000:Rare,1000:Uncommon,100:Common,0:Everyday')
  .map((t) => {
    const [minStars, label] = t.split(':');
    return { minStars: Number(minStars), label };
  })
  .sort((a, b) => b.minStars - a.minStars);

/** Evolutions with no level requirement (stones, trades) get these instead. */
export const FALLBACK_LEVEL = { trade: 20, 'use-item': 25, other: 30 };

/**
 * Sprite address. Picked from what PokéAPI reported, falling through to the next set
 * when one is missing. Animated sprites stop after generation V, so later species
 * fall back to official artwork on their own.
 */
export function spriteUrl(species) {
  const want = process.env.POKEREPO_SPRITE || 'animated';
  for (const k of [want, 'animated', 'artwork', 'home', 'front']) {
    if (species.sprites?.[k]) return species.sprites[k];
  }
  return null;
}
