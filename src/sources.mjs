// Where contributions are read. GitHub REST only — no CLI, no packages.
// A new kind of contribution means one more function here.

const API = 'https://api.github.com';
const token = () => process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

async function api(path) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'pokerepo' };
  if (token()) headers.Authorization = `Bearer ${token()}`;
  const r = await fetch(`${API}${path}`, { headers });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`${path} → ${r.status} ${await r.text()}`);
  return r.json();
}

const repoCache = new Map();
/** Repository detail. Stars and the fork parent both come from here. */
export async function repoInfo(full) {
  if (!repoCache.has(full)) repoCache.set(full, await api(`/repos/${full}`));
  return repoCache.get(full);
}

/** Your public repositories. Forks resolve to their upstream. */
export async function myRepos(login) {
  const out = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await api(`/users/${login}/repos?per_page=100&page=${page}&type=owner`);
    if (!batch?.length) break;
    for (const r of batch) {
      if (r.private) continue;
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

/** Merged pull requests per repository. These survive deleting the fork. */
export async function mergedRepos(login) {
  const out = new Map();
  const q = encodeURIComponent(`author:${login} type:pr is:merged`);
  for (let page = 1; page <= 10; page++) {
    const r = await api(`/search/issues?q=${q}&per_page=100&page=${page}`);
    for (const it of r?.items ?? []) {
      const full = it.repository_url.split('/repos/')[1];
      out.set(full, (out.get(full) ?? 0) + 1);
    }
    if ((r?.items ?? []).length < 100) break;
  }
  return out;
}

export const repoStars = async (full) => (await repoInfo(full))?.stargazers_count ?? 0;

/** Your commits that actually landed there. For forks this reads upstream, so only accepted work counts. */
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

/** Contribution calendar. Public, unauthenticated, one year of daily levels. */
export async function grassDays(login) {
  const html = await (await fetch(`https://github.com/users/${login}/contributions`)).text();
  const days = {};
  for (const m of html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g)) {
    const lv = Number(m[2]);
    if (lv > 0) days[m[1]] = lv;
  }
  return days;
}
