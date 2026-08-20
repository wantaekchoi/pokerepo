// 저장소를 종에 배정하고, 경험치만큼 진화시킨다. 규칙 상수는 config.mjs 에 있다.
import { createHash } from 'node:crypto';
import { TIERS, FALLBACK_LEVEL } from './config.mjs';

const hash = (s) => Number.parseInt(createHash('sha256').update(s).digest('hex').slice(0, 12), 16);

export function makeDex(db) {
  const childrenOf = (id) => db.species.filter((s) => s.from === id && s.evo);
  const threshold = (s) =>
    db.curves[s.growthRateId][Math.min(s.evo.minLevel ?? FALLBACK_LEVEL[s.evo.trigger] ?? 30, 100)] ?? Infinity;

  // 진화하는 기본형만 쓴다. 포획률 순으로 줄 세워 티어 수만큼 고르게 나눈다.
  const bases = db.species
    .filter((s) => !s.from && !s.legendary && !s.mythical && childrenOf(s.id).length)
    .sort((a, b) => b.captureRate - a.captureRate); // 흔한 것 → 희귀한 것
  const size = Math.ceil(bases.length / TIERS.length);
  const poolOf = (i) =>
    bases.slice(Math.max(0, bases.length - (i + 1) * size), Math.max(0, bases.length - i * size));

  const used = new Set();
  /** 저장소 이름 → 기본형. 같은 저장소는 언제나 같은 종이 된다. */
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

  /** 경험치만큼 계보를 따라 진화시키고, 거쳐온 단계를 모두 돌려준다. */
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

  /** 이미 어떤 저장소가 쓰고 있는 종은 다시 뽑히지 않게 잡아둔다. */
  const reserve = (id) => used.add(id);

  /** 곡선 위에서 누적 경험치에 해당하는 레벨. */
  const levelOf = (sp, exp) => {
    const curve = db.curves[sp.growthRateId] ?? {};
    let lv = 1;
    for (let l = 1; l <= 100; l++) if (exp >= (curve[l] ?? Infinity)) lv = l;
    return lv;
  };

  return { assign, grow, reserve, levelOf, childrenOf, threshold, baseCount: bases.length };
}
