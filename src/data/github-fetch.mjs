// Fetches the release list the download page shows. Used at build time (src/data/github.ts) and by
// `npm run snapshot:github`. Set GITHUB_TOKEN to lift the 60 req/h anonymous limit.
export const REPO = 'akitaonrails/ai-jail';

async function gh(path) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'aijail.io-build' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com${path}`, { headers, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

export async function fetchGithub() {
  const [repo, releases] = await Promise.all([gh(`/repos/${REPO}`), gh(`/repos/${REPO}/releases?per_page=12`)]);
  return {
    fetchedAt: new Date().toISOString(),
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    // Release notes are the project's own markdown (releases/vX.Y.Z.md in the repository), one per tag.
    releases: releases
      .filter((r) => !r.draft)
      .map((r) => ({
        tag: r.tag_name, name: r.name || r.tag_name, date: r.published_at, url: r.html_url, prerelease: r.prerelease,
        body: r.body ?? '',
        assets: r.assets.map((a) => ({ name: a.name, url: a.browser_download_url, size: a.size, downloads: a.download_count })),
      })),
  };
}
