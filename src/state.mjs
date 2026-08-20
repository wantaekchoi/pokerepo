// 상태는 누적이다. 저장소를 지워도 도감과 레벨은 남는다 — 실제 포켓몬 규칙과 같다.

export function emptyState(login) {
  return { login, repos: {}, dex: {}, trainer: { grassExp: 0 }, updatedAt: null };
}

/**
 * 이번에 관측한 저장소들을 상태에 합친다.
 * 경험치는 최대값만 기억하므로, 저장소가 사라져도 레벨이 내려가지 않는다.
 */
export function merge(state, observed) {
  for (const o of observed) {
    const prev = state.repos[o.upstream] ?? { exp: 0, caught: false };
    state.repos[o.upstream] = {
      exp: Math.max(prev.exp, o.exp),
      caught: prev.caught || o.caught,
      species: prev.species ?? o.speciesId, // 한 번 정해진 종은 안 바뀐다
      stars: o.stars,
      alive: true,
    };
  }
  // 이번에 안 보인 저장소는 정지 상태로 둔다. 지우지 않는다.
  for (const [name, r] of Object.entries(state.repos)) {
    if (!observed.some((o) => o.upstream === name)) r.alive = false;
  }
  return state;
}

/** 도감은 한 번 등록되면 안 지워진다. */
export function record(state, speciesId, caught) {
  const cell = (state.dex[speciesId] ??= { seen: true, caught: false });
  cell.caught ||= caught;
}
