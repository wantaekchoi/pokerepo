// 기여를 읽어 상태를 갱신하고 카드를 다시 그린다.
// 저장소마다 종이 하나 배정되고, 그 저장소에 쌓인 커밋이 그 종의 경험치가 된다.
import { readFile, writeFile } from 'node:fs/promises';
import { makeDex } from '../src/dex.mjs';
import { EXP, spriteUrl } from '../src/config.mjs';
import { myRepos, mergedRepos, repoStars, myCommits, grassDays } from '../src/sources.mjs';
import { emptyState, merge, record } from '../src/state.mjs';

const login = process.env.POKEREPO_LOGIN || process.env.GITHUB_REPOSITORY_OWNER;
if (!login) throw new Error('POKEREPO_LOGIN 이 필요하다.');
const statePath = process.env.POKEREPO_STATE || 'trainer.json';
const readmePath = process.env.POKEREPO_README || 'README.md';
const partySize = Number(process.env.POKEREPO_PARTY || 6);

const db = JSON.parse(await readFile(new URL('../data/species.json', import.meta.url), 'utf8'));
const dex = makeDex(db);
const byId = new Map(db.species.map((s) => [s.id, s]));

let state;
try { state = JSON.parse(await readFile(statePath, 'utf8')); } catch { state = null; }
state = { ...emptyState(login), ...(state ?? {}) };
state.repos ??= {};
state.dex ??= {};
state.trainer ??= { grassExp: 0 };

// 이미 종이 정해진 저장소는 그 종을 다시 쓰고, 새 저장소만 새로 뽑는다.
for (const r of Object.values(state.repos)) if (r.species) dex.reserve(r.species);

const merged = await mergedRepos(login);
const seen = new Map();
for (const r of await myRepos(login)) seen.set(r.upstream, { caught: !r.isFork || merged.has(r.upstream), fork: r.isFork });
for (const up of merged.keys()) if (!seen.has(up)) seen.set(up, { caught: true, fork: true });

const observed = [];
for (const [upstream, info] of seen) {
  const known = state.repos[upstream];
  const stars = known?.stars ?? (await repoStars(upstream));
  const speciesId = known?.species ?? dex.assign(upstream, stars).sp.id;
  const commits = await myCommits(upstream, login);
  const mine = upstream.startsWith(`${login}/`);
  const merges = merged.get(upstream) ?? 0;
  const exp = commits * EXP.commit + merges * (mine ? EXP.mergeOwn : EXP.mergeExternal);
  observed.push({ upstream, stars, speciesId, caught: info.caught, exp, commits, merges });
}
merge(state, observed);
state.trainer.grassExp = Object.values(await grassDays(login)).reduce((a, lv) => a + (EXP.grassLevel[lv] ?? 0), 0);

// 경험치만큼 진화시키고, 거쳐온 단계를 모두 도감에 넣는다.
const party = [];
for (const [upstream, r] of Object.entries(state.repos)) {
  const line = dex.grow(byId.get(r.species), r.exp);
  for (const s of line) record(state, s.id, r.caught);
  const top = line.at(-1);
  const level = dex.levelOf(top, r.exp);
  r.level = level;
  r.mon = top.id;
  party.push({ ...r, upstream, mon: top, level, stage: line.length });
}
party.sort((a, b) => b.level - a.level || b.exp - a.exp);

state.updatedAt = new Date().toISOString().slice(0, 10);
await writeFile(statePath, JSON.stringify(state, null, 2) + '\n');
// 도감 페이지가 같은 폴더에서 읽을 수 있게 복사해 둔다(있을 때만).
try { await writeFile('docs/trainer.json', JSON.stringify(state)); } catch {}

const cells = Object.values(state.dex);
const caught = cells.filter((c) => c.caught).length;
const cap = (n) => n.replace(/(^|-)([a-z])/g, (_, a, b) => a + b.toUpperCase());
const card = [
  '<table><tr>',
  ...party.slice(0, partySize).map((p) =>
    `<td align="center" width="110"><img src="${spriteUrl(p.mon)}" width="72" alt="${p.mon.name}"><br>` +
    `<b>${cap(p.mon.name)}</b><br><sub>Lv.${p.level}${p.alive ? '' : ' · 정지'}</sub><br>` +
    `<sub><a href="https://github.com/${p.upstream}">${p.upstream.split('/')[1]}</a></sub></td>`
  ),
  '</tr></table>',
  '',
  `**도감 ${caught}/${cells.length}** 잡음 · 저장소 ${party.length}곳 · 기여 ${Object.keys(state.repos).length}건 · ${state.updatedAt}`,
].join('\n');

const START = '<!-- POKEREPO:START -->', END = '<!-- POKEREPO:END -->';
try {
  const md = await readFile(readmePath, 'utf8');
  if (md.includes(START) && md.includes(END)) {
    const next = md.slice(0, md.indexOf(START) + START.length) + '\n' + card + '\n' + md.slice(md.indexOf(END));
    if (next !== md) await writeFile(readmePath, next);
    console.log(`README 갱신: ${readmePath}`);
  } else {
    console.log(`README 에 ${START} / ${END} 표시가 없어 건너뛴다.`);
  }
} catch { console.log(`README 없음: ${readmePath}`); }

console.log(`파티 ${party.slice(0, partySize).map((p) => `${p.mon.name} Lv.${p.level}`).join(', ')}`);
console.log(`도감 ${caught}/${cells.length} · 저장소 ${party.length}`);
