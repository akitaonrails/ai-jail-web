# Brief: proofreading pass of 2026-10-15

Two isolated persona reviews of the live site (a skeptical engineer who auto-approves prompts and has never heard of ai-jail; a non-engineer manager of eight developers) produced the findings below. This brief turns them into changes. Facts come from the ai-jail clone at `~/Projects/ai-jail` (v2.9.0): `README.md` ("Network", "Toolchains", "Host loopback services", "Agent state", "Environment policy", "SSH" sections) and `docs/SECURITY.md`. Writing rules: `docs/design-system.md`, section "Writing". Every visible string lives in `src/i18n/locales/en/<page>.json`; structure in `src/pages/[...locale]/<page>.astro`.

## Facts the site must get right

- Default network on Linux with toolchains on (the default): the known agent's own API host (two for Codex) plus the package registries, and that list includes `github.com`, `codeload.github.com` and `objects.githubusercontent.com`. So `git clone` and `git pull` over HTTPS from GitHub work by default on Linux. Pushing still needs credentials: `--github` (the gh token as `GH_TOKEN`) or `--ssh` for SSH keys; read the README's SSH and `--github` sections for what `--ssh` needs on the network side (SSH is not HTTP, so check whether the filtered proxy carries it or `--network` is needed; say exactly what the README says, nothing more).
- On macOS: the agent's own API host is allowed by default; the registry default is Linux only. So on macOS `npm install` and similar need `--allow-host` for the registry or `--network`.
- "The network is off by default" is wrong wording. Say: closed, except the agent's own API host and, on Linux, the package registries.
- A localhost service (database, local MCP server, editor socket): `--forward-port PORT` on Linux; on macOS `--network`.
- MCP servers started by the agent run inside the jail; environment variables are cut to an allowlist, so a server that reads `GITHUB_TOKEN` or `DATABASE_URL` from the environment gets nothing unless passed with `--env NAME` or `--env-from-file`; a remote MCP server over HTTP needs its host in `--allow-host`.
- What a blocked thing looks like inside: a file outside the project is simply not there ("No such file"); a host outside the list cannot be reached (the connection fails); `--audit-log` records denied requests; `ai-jail bash` lets a person look around. Do not invent error messages; describe the effect.
- Windows: not supported; WSL2 with the Linux backend.
- One maintainer, two published source audits (one by an AI model), no third-party firm. ai-jail only ever removes access from a run; a bug in it means the agent may see more than intended, never more than it would see without ai-jail. Check that claim against SECURITY.md before writing it; if SECURITY.md lists a case where ai-jail adds reach (for example a forwarded port or a mounted login), word it as "nothing you did not turn on".

## Changes, by page

### Site-wide
1. Say "a known agent's own API host (two for Codex)" and the five agent names once, on Install (step 03), and elsewhere say "its own API host" with a link to `/install/#first` where the context needs it. Remove the repetition wherever it appears as a parenthetical aside in a sentence that is not about hosts.
2. Each detail page gets a one-line audience note under the lede, rendered by `PageHero` from a new key `hero.audience` in that page's catalog (the component change is done by the main session; you add the keys). Examples: Why: "For whoever decides, and for whoever types." How it works: "For the engineer who wants to know what is enforced. The first paragraph and the first picture are enough for everyone else." Install, Configure, Download: "For the person at the keyboard." Compare: "For someone choosing between tools. The six situations at the top answer most questions." Security: "For the person who signs off, then for the security engineer."
3. Pick one term for the tokens in a developer's shell and define it once on Home and once on Why: "shell secrets (the tokens and passwords a terminal keeps in environment variables)". Use "shell secrets" afterwards.
4. First use on Home and Why of: agent, sandbox, kernel, SSH key, MCP server, hooks, flag, VM. One short clause each, no glossary page.

### Home (`home.json`, `index.astro`)
5. Hero lede: after "so it can read everything you can", add one sentence of consequence: the keys to your servers, your cloud account, every other project on the disk.
6. Add the poisoned-page drawing (`<Diagram name="why-injection">`, labels exist) right after the hero as a short section with a two-sentence lede and a link to Why. Its alt and caption go in `home.json` (new keys).
7. Scene step 5: replace "A cloud agent starts logged in, because ai-jail mounts its login by default" with the five agents starting logged in and reaching their own API.
8. Replace the "Several kernel layers, one small binary" section (title, lede, three cards) with one paragraph and the link to How it works. Keep the three "Inside / Out of reach / Off until you ask" columns but shorten each item to one line. Keep the ai-memory callout, two sentences at most.
9. Add the sentence "A prompt asks a person, and a person can be rushed or fooled. A sandbox asks the kernel, which gives the same answer every time." to the "wall" section lede (it is on Compare today; keep it there too).
10. Home FAQ "Which agents does it support?" must list the same agents as the Install table.

### Do I need it? (`why.json`, `why.astro`)
11. Reorder: "How it goes wrong" (the three cards and the drawing) before "Everything your user account can open". Move the section markup; keys stay.
12. Each bullet of the inventory ends in what it lets an agent do (browser profiles: act as you on every site you are logged in to).
13. "the network is off" in `wrong` becomes the correct default (fact above).
14. New section after "What it costs you": "What changes on day one". A plain list without flags in the sentence openers: installs on Linux work; on macOS add the registry or the network; a local database or MCP server needs one port forwarded (Linux) or the network (macOS); pushing to GitHub needs your token or your SSH key switched on; Docker, the screen and the clipboard need a switch; Windows means WSL2. Then one terminal block with the exact lines.
15. New short section "For the person who approves this" (a `Callout` on the rose plate, before the FAQ): the exposure in company terms (server keys, cloud credentials with production access, other clients' code under NDA, browser sessions), what the tool does (fences each run to one project, by default), what it costs (one word in front of the command, a one-time install, a few switches per project), what to ask the team (install it, run every agent through it, keep the permission prompts on, report what they had to open), what it does not cover (hostile code: a disposable VM). Five to seven short lines.

### Install (`install.json`, `install.astro`)
16. macOS card under "What your system needs": add that package registries are not reachable by default on macOS, with the switch.
17. New section after "What you will see inside": "When the jail blocks something" (fact above: what it looks like, `--allow-host`, `--forward-port`, `--env`, `--audit-log`, `ai-jail bash`).
18. Repeat the day-one list from Why as a `FeatureGrid` of four cells (installs, local services, git push, MCP servers), each with the exact flag in a `<code>`.
19. Per-agent table: keep, but order it Claude Code, Codex, Gemini, OpenCode first; no other change.

### How it works (`how.json`, `how-it-works.astro`)
20. Move "Three ways to the network" before "The layers, from the outside in".
21. Rewrite the `TIOCSTI` sentence as "and TIOCSTI, a call that can type keystrokes into your terminal"; drop the 32-bit comparison detail.

### Compare (`compare.json`, `compare.astro`)
22. "In short" stays first; make each of the six situations one line.
23. Move "Keep the prompts, but do not count on a sandbox inside a sandbox" directly after "Where the wall is".
24. Group the nono/zerobox cards and the OpenShell table under one heading "For evaluators: other wrappers and platforms" with a one-line lede; shorten each card to its first two sentences.
25. Fix `table.rows.6.cells.3` and every `github.com` example so they agree with the Linux default (github.com already reachable with toolchains on).

### Configure (`configure.json`)
26. Every `allow_hosts = ["github.com"]` example: change the example host to one that is not in the default list (for example `api.example.com` for an internal API), or state next to it that github.com is already reachable on Linux. Keep the recipe for pushing (`--github`/`--ssh`) correct per the facts.
27. The sentence about `forward_ports` belonging under `[commands.<name>]` appears three times; keep it once (in the recipe) and shorten the other two to a link to the recipe.

### Security (`security.json`, `security.astro`)
28. Split "What stays at risk" into two lists with their own headings: "What this means for your data" (secrets inside the project unless masked; an allowed host is trusted whole; `--network` lets anything readable be sent; the agent's own login is inside; host-side git; masks hide from the sandbox only) and "For the security engineer" (the rest). Keys may move; keep the texts.
29. "How the project is checked": after the one-maintainer and no-third-party-audit lines, add one sentence of interpretation (fact above, checked against SECURITY.md).
30. `switches.rows.0` (`--network`): the default is the agent's own API host and, on Linux, the registries.

### Download (`download.astro`)
31. Only the latest release open; older ones collapsed. Code only, done by the main session.

Then: humanizer pass (`/home/akitaonrails/.claude/skills/humanizer/SKILL.md`), `node scripts/check-i18n.mjs` (expect STALE in five locales), `npx astro check`, `npx astro build`.
