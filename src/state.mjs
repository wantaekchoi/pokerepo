// State accumulates. Deleting a repository stops a species; it never erases one.
// That mirrors the games, where the Dex keeps every entry and levels never drop.

export function emptyState(login) {
  return { login, repos: {}, dex: {}, trainer: { grassExp: 0 }, updatedAt: null };
}

/**
 * Fold this run's observations into the stored state.
 * Only the highest experience is kept, so a vanished repository cannot lower a level.
 */
export function merge(state, observed) {
  for (const o of observed) {
    const prev = state.repos[o.upstream] ?? { exp: 0, caught: false };
    state.repos[o.upstream] = {
      exp: Math.max(prev.exp, o.exp),
      caught: prev.caught || o.caught,
      species: prev.species ?? o.speciesId, // once assigned, a repository keeps its species
      stars: o.stars,
      commits: o.commits ?? prev.commits ?? 0,
      merges: Math.max(prev.merges ?? 0, o.merges ?? 0),
      alive: true,
    };
  }
  // Repositories that did not show up this run are parked, not dropped.
  for (const [name, r] of Object.entries(state.repos)) {
    if (!observed.some((o) => o.upstream === name)) r.alive = false;
  }
  return state;
}

/** Once an entry is in the Dex it stays. */
export function record(state, speciesId, caught) {
  const cell = (state.dex[speciesId] ??= { seen: true, caught: false });
  cell.caught ||= caught;
}
