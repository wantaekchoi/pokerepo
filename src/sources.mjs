// 기여를 긁어오는 곳. GitHub REST 만 쓴다(외부 CLI·패키지 없음).
// 새 종류(리뷰·이슈 등)가 생기면 여기에 함수를 하나 더한다.

const API = 'https://api.github.com';
const token = () => process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

async function api(path) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'pokegrind' };
  if (token()) headers.Authorization = `Bearer ${token()}`;
  const r = await fetch(`${API}${path}`, { headers });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`${path} → ${r.status} ${await r.text()}`);
  return r.json();
}

const repoCache = new Map();
/** 저장소 상세. 별 수와 포크 원본이 여기 들어 있다. */
export async function repoInfo(full) {
  if (!repoCache.has(full)) repoCache.set(full, await api(`/repos/${full}`));
  return repoCache.get(full);
}

/** 내 공개 저장소. 포크는 상류를 가리킨다. */
export async function myRepos(login) {
  const out = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await api(`/users/${login}/repos?per_page=100&page=${page}&type=owner`);
    if (!batch?.length) break;
    for (const r of batch) {
      if (r.private || r.archived === undefined) continue;
      let upstream = r.full_name;
      if (r.fork) {
        const detail = await repoInfo(r.full_name);
        if (detail?.parent) upstream = detail.parent.full_name;
      } else {
        repoCache.set(r.full_name, r);
      }
      out.push({ upstream, isFork: r.fork });
    }
    if (batch.length < 100) break;
  }
  return out;
}

/** 머지된 PR이 있는 저장소들. 포크를 지웠어도 여기 남는다. */
export async function mergedRepos(login) {
  const out = new Set();
  const q = encodeURIComponent(`author:${login} type:pr is:merged`);
  for (let page = 1; page <= 10; page++) {
    const r = await api(`/search/issues?q=${q}&per_page=100&page=${page}`);
    for (const it of r?.items ?? []) out.add(it.repository_url.split('/repos/')[1]);
    if ((r?.items ?? []).length < 100) break;
  }
  return out;
}

export const repoStars = async (full) => (await repoInfo(full))?.stargazers_count ?? 0;

/** 그 저장소에 실제로 남은 내 커밋 수. 포크는 상류를 보므로 '받아들여진 것'만 센다. */
export async function myCommits(full, login, maxPages = 5) {
  let n = 0;
  for (let page = 1; page <= maxPages; page++) {
    const batch = await api(`/repos/${full}/commits?author=${login}&per_page=100&page=${page}`);
    if (!batch?.length) break;
    n += batch.length;
    if (batch.length < 100) break;
  }
  return n;
}

/** 잔디: 인증 없이 최근 1년치 날짜별 강도(data-level)를 준다. */
export async function grassDays(login) {
  const html = await (await fetch(`https://github.com/users/${login}/contributions`)).text();
  const days = {};
  for (const m of html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g)) {
    const lv = Number(m[2]);
    if (lv > 0) days[m[1]] = lv;
  }
  return days;
}
