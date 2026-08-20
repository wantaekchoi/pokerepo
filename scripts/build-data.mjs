// PokeAPI GraphQL에서 전 세대 종·진화·경험치표를 받아 data/species.json 으로 굳힌다.
// 세대 수를 박지 않는다. 새 세대가 나오면 다시 돌리기만 하면 된다.
import { writeFile } from 'node:fs/promises';

const EP = 'https://beta.pokeapi.co/graphql/v1beta';
const ask = async (query) => {
  const r = await fetch(EP, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) });
  const { data, errors } = await r.json();
  if (errors) throw new Error(JSON.stringify(errors));
  return data;
};

const data = await ask(`{
  species: pokemon_v2_pokemonspecies(order_by:{id:asc}) {
    id name capture_rate is_legendary is_mythical is_baby generation_id
    evolution_chain_id evolves_from_species_id
    pokemon_v2_growthrate { id name }
  }
  evolution: pokemon_v2_pokemonevolution {
    evolved_species_id min_level min_happiness time_of_day
    pokemon_v2_evolutiontrigger { name }
    pokemon_v2_item { name }
  }
  exp: pokemon_v2_experience(order_by:{level:asc}) { level experience growth_rate_id }
  forms: pokemon_v2_pokemon(where:{is_default:{_eq:true}}) {
    pokemon_species_id
    pokemon_v2_pokemonsprites { sprites }
  }
}`);

// 스프라이트 주소는 PokeAPI 가 직접 준다. 저장소 목록을 훑지도, 주소를 조립하지도 않는다.
const dig = (o, ...path) => path.reduce((a, k) => (a && typeof a === 'object' ? a[k] : undefined), o);
const sprites = {};
for (const f of data.forms) {
  let s = f.pokemon_v2_pokemonsprites[0]?.sprites;
  if (typeof s === 'string') s = JSON.parse(s);
  sprites[f.pokemon_species_id] = {
    animated: dig(s, 'versions', 'generation-v', 'black-white', 'animated', 'front_default') ?? null,
    artwork: dig(s, 'other', 'official-artwork', 'front_default') ?? null,
    home: dig(s, 'other', 'home', 'front_default') ?? null,
    front: dig(s, 'front_default') ?? null,
  };
}

const curves = {};
for (const e of data.exp) (curves[e.growth_rate_id] ??= {})[e.level] = e.experience;

const evo = {};
for (const e of data.evolution) {
  evo[e.evolved_species_id] = {
    trigger: e.pokemon_v2_evolutiontrigger?.name ?? 'other',
    minLevel: e.min_level ?? null,
    minHappiness: e.min_happiness ?? null,
    timeOfDay: e.time_of_day || null,
    item: e.pokemon_v2_item?.name ?? null,
  };
}

const species = data.species.map((s) => ({
  id: s.id, name: s.name, captureRate: s.capture_rate,
  growthRateId: s.pokemon_v2_growthrate.id, growthRate: s.pokemon_v2_growthrate.name,
  chainId: s.evolution_chain_id, from: s.evolves_from_species_id ?? null, gen: s.generation_id,
  legendary: s.is_legendary, mythical: s.is_mythical, baby: s.is_baby,
  sprites: sprites[s.id] ?? {},
  evo: evo[s.id] ?? null,
}));

await writeFile(new URL('../data/species.json', import.meta.url),
  JSON.stringify({ source: 'PokeAPI GraphQL (BSD-3-Clause data)', builtFrom: species.length, curves, species }));
// 도감 화면이 쓸 가벼운 목록. 격자에 필요한 것만 담는다.
await writeFile(new URL('../docs/dex.json', import.meta.url), JSON.stringify(
  species.map((s) => [s.id, s.name, s.sprites.animated ?? s.sprites.artwork ?? s.sprites.front ?? null])
));

console.log(`종 ${species.length} (최대 id ${Math.max(...species.map((s) => s.id))}) · 진화조건 ${Object.keys(evo).length} · 애니메이션 ${species.filter((s) => s.sprites.animated).length} · 일러스트 ${species.filter((s) => s.sprites.artwork).length}`);
