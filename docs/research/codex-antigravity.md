# OpenAI Codex and Google Antigravity: sandbox facts for the Compare page

Reviewed 2026-09-22. Official sources only. Anything not stated in a primary source is marked UNVERIFIED.

## 1. OpenAI Codex

Codex docs moved from `developers.openai.com/codex/*` to `learn.chatgpt.com/docs/*` (308 redirects). Latest CLI release: `rust-v0.155.1`, 2026-09-18 (https://github.com/openai/codex/releases).

### 1a. Local CLI sandbox

- Modes: `read-only`, `workspace-write` (default), `danger-full-access`. `--dangerously-bypass-approvals-and-sandbox` (alias `--yolo`) = "No sandbox; no approvals (not recommended)". https://learn.chatgpt.com/docs/agent-approvals-security
- Approval policies: `on-request`, `never`, `{ granular = { sandbox_approval, rules, mcp_elicitations, request_permissions, skill_approval } }`; `untrusted` unsupported; `approvals_reviewer = "auto_review"` routes eligible prompts to a reviewer agent. https://learn.chatgpt.com/docs/config-file/config-reference
- New since mid-2026: named permission profiles (`:read-only`, `:workspace`, `:danger-full-access`, custom `[permissions.<name>]` with `read`/`write`/`deny` path rules, `:minimal`, `:workspace_roots`, `[network.domains]`). https://learn.chatgpt.com/docs/permissions
- `codex exec` defaults to read-only; `--full-auto` is deprecated. https://learn.chatgpt.com/docs/non-interactive-mode
- Primitives: macOS Seatbelt (`sandbox-exec`); Linux/WSL2 "bubblewrap and seccomp, with Landlock available for compatibility fallback paths"; native Windows `elevated` (sandbox users, firewall rules) or weaker `unelevated`. https://learn.chatgpt.com/docs/permissions
- Linux detail: "the filesystem is read-only by default via `--ro-bind / /`", `--unshare-user/pid`, `--unshare-net` when network is off, `PR_SET_NO_NEW_PRIVS` plus seccomp. So the whole disk, `~/.ssh` included, is readable unless a profile adds `deny` rules (OpenAI's own cyber config denies `**/.env*` and `**/*.pem`). https://github.com/openai/codex/tree/main/codex-rs/linux-sandbox , https://learn.chatgpt.com/docs/cyber-safety/recommended-configuration
- Scope: "The sandbox applies to spawned commands ... those commands inherit the same sandbox boundaries." https://learn.chatgpt.com/docs/sandboxing . "Permission profiles govern sandboxed commands that run on your machine"; model and auth traffic "use the client's separate HTTP and system-proxy settings". The `codex` process itself is therefore not inside the sandbox (stated by implication, not in one sentence).
- MCP: "Local and remote MCP servers use their own process or transport"; profiles and the proxy do not apply to them. Resolves the old UNVERIFIED: local stdio MCP servers are not sandboxed. https://learn.chatgpt.com/docs/permissions
- Network: off by default in `workspace-write`; `sandbox_workspace_write.network_access = true` enables it; `features.network_proxy` adds allow/deny domain rules (`*.x`, `**.x`), blocks local/private targets by default, does not filter web search, connectors, MCP, browser or Computer Use. https://learn.chatgpt.com/docs/agent-approvals-security
- Docker: sandbox may fail if the host "blocks the namespace, setuid `bwrap`, or `seccomp` operations"; docs then suggest `danger-full-access` inside the container. Same page.

### 1b. Whole-process or hosted options

- Codex cloud (chatgpt.com/codex): "isolated OpenAI-managed containers"; setup scripts have internet, "Agent internet access is off by default", optional allowlist and GET/HEAD/OPTIONS-only; secrets removed before the agent phase. https://learn.chatgpt.com/docs/environments/cloud-environment , https://learn.chatgpt.com/docs/cloud/internet-access
- Desktop: Codex is a surface of the ChatGPT desktop app on macOS, Windows and Linux (Linux preview since 2026-08-11), running local agents with the same sandbox or cloud environments. https://learn.chatgpt.com/docs/app , https://learn.chatgpt.com/docs/changelog
- No OpenAI product wraps the local `codex` process in an OS jail; the docs recommend Dev Containers for an "outer isolation boundary". https://learn.chatgpt.com/docs/agent-approvals-security

### 1c. What builtin-sandboxes.md section 2 gets wrong now

- Source URLs are stale (redirect to learn.chatgpt.com).
- "Legacy Landlock path is now rejected" is only true for split policies needing Unix-socket isolation; the docs list Landlock as a fallback.
- Missing: permission profiles with `deny` reads, `codex exec` read-only default, `--full-auto` deprecated, MCP explicitly outside the sandbox, Codex cloud facts.

## 2. Google Antigravity

- What: agent-first platform launched with Gemini 3 in November 2025 (Editor view, Manager surface, browser, Artifacts). https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/
- 2026-05-19: Antigravity 2.0 "standalone desktop application" on macOS, Linux, Windows, with Projects; Antigravity CLI (`agy`) replaces Gemini CLI, "same agent harness", described as "a powerful server-side harness"; Python SDK preview with a local agentic loop. https://antigravity.google/blog/introducing-google-antigravity-2 , https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/ , https://antigravity.google/blog/introducing-google-antigravity-sdk
- Execution: on the user's machine, "Local Mode" or "New Worktree Mode"; agents "read and write within the provided folders of a project". https://antigravity.google/docs/getting-started , https://antigravity.google/docs/features/
- Permissions: `action(target)` resources (`command`, `unsandboxed`, `read_file`, `write_file`, `read_url`, `execute_url`, `mcp`); lists Deny > Ask > Allow; presets Default (sandbox on, workspace + temp, ask outside), Request Review (sandbox off, always ask), Turbo (sandbox off, full filesystem, unrestricted); web and MCP default to Ask. https://antigravity.google/docs/permissions/
- Terminal Sandbox: only shell commands, "the agent process itself" is not named as sandboxed; escapes "run on your host with full privileges". Linux "kernel namespaces" (settings page says `nsjail`), macOS `sandbox-exec`/Seatbelt. `~/.ssh` and `.env` blocked; "anything not explicitly mounted is invisible"; no network by default; `read_url` domains become the outbound allowlist. Windows: docs say previous behavior, but changelog 2.15.1 (2026-09-19) says "File and network sandboxing on Windows are now supported" (CLI docs mention AppContainer). https://antigravity.google/docs/sandbox/ , https://antigravity.google/docs/settings/ , https://antigravity.google/changelog/ , https://antigravity.google/docs/cli/features/
- Windows policy: Request Review / Proceed in Sandbox / Always Proceed. https://antigravity.google/docs/agent-settings/
- Browser subagent: "completely separate Chrome profile", allow/deny lists. https://antigravity.google/docs/ide/browser
- CLI: `enableTerminalSandbox` default `false`, `toolPermission` default `request-review`, `--sandbox` flag; headless `agy -p` with text/json/stream-json, shell commands soft-denied, `--dangerously-skip-permissions`; "uses your cached credentials". ai-jail can wrap `agy`. https://antigravity.google/docs/cli/headless/
- UNVERIFIED: whether the model loop runs server-side for the desktop app, CLI license, how credentials are stored.

## 3. Summary

- Codex: ai-jail adds one boundary around the `codex` binary, MCP servers and its own network, with hidden `~/.ssh` by default.
- Codex already does: per-command kernel sandbox on three OSes, domain proxy, reviewer agent, hosted containers.
- Antigravity: ai-jail adds isolation for the agent process, MCP tools, browser and unsandboxed escapes.
- Antigravity already does: default-on command sandbox (macOS/Linux) hiding `~/.ssh`, `read_url`-driven allowlist, Deny/Ask/Allow rules.
- Neither sandboxes the agent process itself; both let commands escape by approval.
- Both are wrappable: `codex exec` and `agy -p` run headless.
