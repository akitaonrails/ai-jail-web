# Built-in protections of AI coding agents (research, 2026-09-21)

Sources are official docs/repos fetched 2026-09-21. `UNVERIFIED` = not confirmed in a primary source.

Source keys:
- [CC-SB] https://code.claude.com/docs/en/sandboxing
- [CC-ENV] https://code.claude.com/docs/en/sandbox-environments
- [CC-PM] https://code.claude.com/docs/en/permission-modes
- [CX-SEC] https://developers.openai.com/codex/agent-approvals-security (308 -> https://learn.chatgpt.com/docs/agent-approvals-security)
- [CX-SB] https://developers.openai.com/codex/concepts/sandboxing (308 -> https://learn.chatgpt.com/docs/sandboxing)
- [CX-LNX] https://github.com/openai/codex/blob/main/codex-rs/linux-sandbox/README.md
- [CX-CORE] https://github.com/openai/codex/blob/main/codex-rs/core/README.md
- [GEM] https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/sandbox.md (rendered: https://geminicli.com/docs/cli/sandbox/)
- [OC] https://opencode.ai/docs/permissions/

## 1. Claude Code

**Permission modes** [CC-PM]: `default` (Manual; only reads run unprompted), `acceptEdits` (reads, edits, common fs commands like `mkdir/mv/cp`), `plan` (reads; edits blocked until plan approved), `auto` (everything runs, a second model "classifier" reviews actions instead of the user), `dontAsk` (anything that would prompt is denied; for CI), `bypassPermissions` = `--dangerously-skip-permissions` (everything, protected-path checks skipped; docs say "isolated containers and VMs only"; refuses to start as root on Linux/macOS). Auto mode is the built-in starting mode on Pro/Max/Team plans in terminal/VS Code; Enterprise, API key, Bedrock/Vertex/Foundry, `-p` and the SDK start in `default`. Docs state the classifier "is a per-action control, not an isolation boundary" [CC-ENV].

**Built-in sandbox ("sandboxed Bash tool", `/sandbox`)** [CC-SB]:
- Opt-in: enabled via `/sandbox` or `sandbox.enabled: true`; not described as on by default. If dependencies are missing it warns and runs commands unsandboxed unless `sandbox.failIfUnavailable: true`.
- Primitives: macOS Seatbelt; Linux/WSL2 bubblewrap + `socat` (proxy relay); optional seccomp filter (from `@anthropic-ai/sandbox-runtime`) only adds Unix-domain-socket blocking. No Landlock mentioned. Native Windows and WSL1 unsupported.
- Scope: "applies only to Bash, PowerShell, and Monitor commands and their child processes". Read/Edit/Write "use the permission system directly rather than running through the sandbox". "MCP servers and command hooks are separate processes that run unconstrained on the host" [CC-ENV]. The `claude` process itself is not sandboxed. User `!` shell commands run outside the sandbox (with exceptions).
- Filesystem defaults: write = cwd, `--add-dir` dirs, session temp dir. Read = "the entire computer, except certain denied directories. Note that this default still allows reading credential files such as `~/.aws/credentials` and `~/.ssh/`". "There is no built-in credential deny list." Opt-in fixes: `denyRead`/`allowRead`, `sandbox.credentials` (deny or mask files/env vars), `permissions.blockReadsOutsideWorkingDirectories`.
- Env vars: "sandboxed Bash commands inherit the parent process environment by default, including any credentials set there."
- Protected paths inside writable dirs (non-overridable): `.claude` settings/skills/agents/commands/hooks, `.mcp.json`, shell rc files, `.gitconfig`, `.git/hooks`, `.git/config`, `.vscode`, `.idea`, most of `~/.claude`.
- Network: proxy outside the sandbox; no domains pre-allowed; first use of a domain prompts (or per-command host lists reviewed by the classifier in auto mode); `allowedDomains`/`deniedDomains`, `strictAllowlist`, managed `allowManagedDomainsOnly`. Credential masking can inject real secrets at the proxy (needs experimental `tlsTerminate`).
- Escape hatches: model may retry with `dangerouslyDisableSandbox` (goes through normal permission flow; classifier decides in auto mode); disable with `allowUnsandboxedCommands: false` ("Strict sandbox mode"). `excludedCommands` always run outside. `sandbox.filesystem.disabled` drops the fs layer entirely (not settable from project settings).
- Documented limitations: "not a complete isolation boundary"; proxy decides on client-supplied hostname without TLS inspection, so domain fronting can bypass the allowlist and broad domains (`github.com`) enable exfiltration; `allowUnixSockets` (e.g. docker.sock) = host access; `enableWeakerNestedSandbox` "considerably weakens security"; macOS `allowAppleEvents` removes code-exec isolation. The Bash sandbox alone "is not sufficient for fully unattended runs" [CC-ENV].
- Note for fairness: Anthropic also ships a whole-process wrapper, `@anthropic-ai/sandbox-runtime` (`npx @anthropic-ai/sandbox-runtime claude`), "beta research preview", same Seatbelt/bubblewrap, covers file tools, MCP servers and hooks; on Linux its deny list is built once at launch and does not cover files created later [CC-ENV].

## 2. OpenAI Codex CLI

- Sandbox modes: `read-only`, `workspace-write` (default), `danger-full-access` [CX-SB]. `--dangerously-bypass-approvals-and-sandbox` / `--yolo` = no sandbox, no approvals [CX-SEC].
- Approval policies [CX-SEC]: `on-request` (asks to leave the sandbox: edits outside workspace, network), `never`, `granular` (per-category: sandbox, execpolicy rules, MCP prompts, etc.), optional `approvals_reviewer = "auto_review"` (reviewer agent). `untrusted` is retired as a policy; per-project `trust_level = "untrusted"` remains. `on-failure`: UNVERIFIED (not in current page).
- Primitives: macOS `sandbox-exec`/Seatbelt; Linux/WSL2 "`bwrap` plus `seccomp` by default" with `PR_SET_NO_NEW_PRIVS`, `--unshare-user/pid/net`; legacy Landlock path is now rejected for filesystem-restricted policies [CX-SEC][CX-LNX]. Native Windows: own sandbox with `unelevated` (restricted-token) or `elevated` backends [CX-SEC][CX-CORE]. WSL1 unsupported since 0.115.
- Scope: the sandbox applies to spawned commands ("those commands inherit the same sandbox boundaries") [CX-SB]; the `codex` process itself is not sandboxed (it must reach the model API). Whether local stdio MCP servers run inside the sandbox: UNVERIFIED. The docs do say the network proxy "does not filter web search, app or connector tool calls, MCP server connections, browser or Computer Use activity" [CX-SEC].
- Reads: on Linux "the filesystem is read-only by default via `--ro-bind / /`" [CX-LNX], i.e. the whole disk, `~/.ssh` included, is readable by default. Restricted-read/split policies with `none` (deny) entries and unreadable globs exist but are opt-in [CX-LNX][CX-CORE]. Exact macOS default read scope: UNVERIFIED (assumed equivalent).
- Writes: workspace (+ configured roots); `.git`, `.agents`, `.codex` under writable roots are recursively read-only [CX-SEC].
- Network: off by default in `workspace-write`; `sandbox_workspace_write.network_access = true` enables it; optional `features.network_proxy` adds per-domain allow/deny rules [CX-SEC].
- Limitations: in Docker the sandbox "may not work if the host or container configuration blocks the namespace, setuid `bwrap`, or `seccomp` operations"; docs then recommend `danger-full-access` inside the container [CX-SEC].

## 3. Gemini CLI and OpenCode

- Gemini CLI [GEM]: sandbox must be enabled (`-s`, `GEMINI_SANDBOX=...`, or `tools.sandbox`); "off by default" is implied by this, not stated verbatim. Backends: macOS Seatbelt (`sandbox-exec`), Docker/Podman, gVisor `runsc`, LXC/LXD (experimental), Windows native (`icacls` Low Mandatory Level; changes persist). Default Seatbelt profile `permissive-open`: "confines writes to the project directory while allowing broad file reads and network"; stricter profiles (`restrictive-*`, `strict-*`, `*-proxied`) are opt-in. Can sandbox the entire CLI process, or use tool-level sandboxing (`security.toolSandboxing`) for shell/write tools only.
- OpenCode [OC]: permission rules only (`allow`/`ask`/`deny`); "Most permissions default to `allow`"; `external_directory` and `doom_loop` default to `ask`; `.env` reads denied. No OS-level sandbox is documented. Absence in other OpenCode pages: UNVERIFIED.

## 4. What this implies (neutral)

Gaps a whole-process wrapper (ai-jail) addresses:
- The harness process itself, its in-process file tools, MCP servers and hooks run on the host under Claude Code's Bash sandbox [CC-ENV]; Codex's sandbox likewise wraps spawned commands, not `codex` [CX-SB].
- Default reads: both Claude Code and Codex (Linux) leave `$HOME` credentials readable unless the user adds deny rules [CC-SB][CX-LNX]. Gemini's default profile also allows broad reads [GEM].
- Environment variables are inherited by sandboxed commands by default in Claude Code [CC-SB].
- Model-initiated escape hatches (`dangerouslyDisableSandbox`, `excludedCommands`, approval escalation) exist inside the agent; an outer jail cannot be lifted by the agent.
- Sandboxes are opt-in (Claude Code, Gemini) or absent (OpenCode); Claude Code silently degrades to unsandboxed if deps are missing unless configured otherwise [CC-SB].
- One policy for every agent, instead of per-agent configs.

Things the built-ins do that ai-jail does not:
- Per-domain network allowlists with prompts (Claude Code proxy; Codex `network_proxy`); ai-jail is all-or-nothing, off by default. Caveat: Claude Code documents domain-fronting bypass [CC-SB].
- Credential masking/injection at the proxy (Claude Code) [CC-SB].
- Per-command approval UX, classifier/auto-review, plan mode, managed org policy.
- Semantic protected paths (`.git/hooks`, `.claude`, `.codex`) inside the writable workspace.
- Native Windows (Codex, Gemini) [CX-SEC][GEM]; WSL2 (Claude Code).
- Anthropic's own `sandbox-runtime` is a direct whole-process alternative on Linux/macOS [CC-ENV].
- The agent needs network to reach its model API, so a whole-process jail with network off cannot run a cloud-model agent; built-ins keep the harness online while commands are offline.
