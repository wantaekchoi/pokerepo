// 기본값은 여기 있지만, 쓰는 사람은 파일을 고치지 않는다.
// 워크플로에서 환경변수(=Action 입력)로 덮어쓴다.

const num = (k, d) => Number(process.env[k] ?? d);
const list = (k, d) => (process.env[k] ?? d).split(',').map((x) => x.trim());

/** 기여 한 건이 주는 경험치. */
export const EXP = {
  commit: num('POKEGRIND_EXP_COMMIT', 400),
  grassLevel: list('POKEGRIND_EXP_GRASS', '0,100,250,450,700').map(Number),
};

/** 상류 저장소 규모 → 희귀도. "별수:이름" 을 쉼표로 잇는다. 몇 단계든 된다. */
export const TIERS = list('POKEGRIND_TIERS', '10000:희귀,1000:준희귀,100:보통,0:흔함')
  .map((t) => {
    const [minStars, label] = t.split(':');
    return { minStars: Number(minStars), label };
  })
  .sort((a, b) => b.minStars - a.minStars);

/** 레벨 조건이 없는 진화(돌·통신교환 등)에 줄 기본 레벨. */
export const FALLBACK_LEVEL = { trade: 20, 'use-item': 25, other: 30 };

/**
 * 스프라이트 주소. PokeAPI 가 준 것 중에서 고르고, 없으면 다음 것으로 넘어간다.
 * (애니메이션은 5세대까지만 있어서 그 뒤 세대는 자동으로 공식 일러스트가 된다.)
 */
export function spriteUrl(species) {
  const want = process.env.POKEGRIND_SPRITE || 'animated';
  const order = [want, 'animated', 'artwork', 'home', 'front'];
  for (const k of order) if (species.sprites?.[k]) return species.sprites[k];
  return null;
}
