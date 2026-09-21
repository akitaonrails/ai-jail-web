# Brief: translate catalogs for the ai-jail site

You translate the English message catalogs in `/mnt/data/Projects/ai-jail-web/src/i18n/locales/en/` into ONE target language, writing files with the same names and the same JSON structure under `src/i18n/locales/<locale>/`. The site explains ai-jail, an open source OS sandbox for AI coding agents (bubblewrap, Landlock and seccomp on Linux, sandbox-exec on macOS), to software developers who have never heard of it and may not know what a sandbox is. Read `docs/design-system.md` (section "Writing") for the voice: short, plain, direct, honest, no hype.

## Non-negotiable mechanics
- Same keys, same nesting, same array lengths as English. Never add, remove, rename or reorder keys. Translate values only.
- `{placeholders}` stay exactly as written (`{version}`, `{date}`), placed where the target grammar wants them.
- HTML tags and their attributes stay exactly as written (`<code>`, `<strong>`, `<a class="link" href="/configure/#secrets">`; never change an href). Translate the text between tags. Everything inside `<code>...</code>` stays byte-for-byte identical.
- Do NOT translate: shell commands, flags, env vars, file and directory names (`~/.ssh`, `.ai-jail`, `.env`), config keys, URLs, version numbers, product and project names (ai-jail, ai-memory, Claude Code, Codex, Gemini CLI, OpenCode, Docker, Flatpak, Firejail, Homebrew, Nix, GitHub, Netlify...), kernel and tech names (bubblewrap, bwrap, Landlock, seccomp, sandbox-exec, Seatbelt, AppArmor, tmpfs, PTY, MCP, API, TOML, SSH, GPU, X11, Wayland, WSL2, mise), people's names.
- In code blocks (`code` values and terminal mocks) only the lines that start with `#` are comments and get translated. Commands and their output stay as they are.
- Valid UTF-8 JSON. Escape double quotes inside values. Use the target language's real typography (accents, punctuation), never ASCII approximations.
- After each file, run `cd /mnt/data/Projects/ai-jail-web && node scripts/check-i18n.mjs <locale>` and fix every ERROR. "identical to English" warnings are fine when the string is a name or a command.

## Quality bar: this must read as if written by a native-speaking developer, not translated
- Translate meaning, not words. Restructure sentences freely. If a literal rendering sounds stiff, rewrite it the way a local senior engineer would say it to a colleague.
- Keep it as short as the English. Headlines must stay headlines: punchy, no longer than the English by more than about 30%, because they sit in fixed layouts. Button labels stay two to four words.
- Keep the honesty: where English says the project is behind or has a limit, say it just as plainly.
- The English avoids AI-writing tells, and so must you, in the target language's own equivalents: no dashes used as connectors (em dash, en dash, or the Japanese ―), no "not X but Y" constructions for emphasis, no closing one-liners that restate the point, no rows of dramatic fragments, no forced groups of three, no hype adjectives (the local equivalents of seamless, robust, powerful, unlock, effortless, revolutionary), no sentences that comment on the documentation instead of stating the fact. Go straight to the point, always.
- Developer vocabulary: use the term local developers actually use at work. When the community uses the English word, keep the English word (see the glossary). Never invent a purist translation nobody says.
- Consistency: one English term maps to one target term across every file. Follow the glossary below. If you must decide a term the glossary lacks, write it down in `docs/i18n/glossary-<locale>.md` (create the file, a simple two-column table) so the next translator reuses it.
- SEO strings (`meta.title`, `meta.description`): use the words people in that language actually type into a search engine. Titles under 60 characters, descriptions 140 to 160 characters (for Japanese: titles under 30 full-width characters, descriptions 80 to 110).

## Glossary
The central metaphor is a JAIL with BARS around the agent. Keep it, in the word a local developer would find natural and a little playful, never legalistic.

| English | pt-br | es | he | ja | ko |
|---|---|---|---|---|---|
| sandbox | sandbox | sandbox | sandbox (ארגז חול) first time, then sandbox | サンドボックス | 샌드박스 |
| jail / the jail | jaula (a jaula) | jaula | כלא | ジェイル (檻 where the image matters) | 감옥 (jail) |
| behind bars | atrás das grades | tras las rejas | מאחורי סורגים | 檻の中に | 철창 안에 |
| bars | grades | rejas / barrotes | סורגים | 格子 | 창살 |
| wall | muro / parede | muro | חומה | 壁 | 벽 |
| AI coding agent | agente de código com IA (short: agente) | agente de programación con IA (short: agente) | סוכן קוד מבוסס AI (short: סוכן) | AIコーディングエージェント (short: エージェント) | AI 코딩 에이전트 (short: 에이전트) |
| harness | harness | harness | harness | ハーネス | 하네스 |
| out of reach | fora de alcance | fuera de alcance | מחוץ להישג יד | 手が届かない | 닿을 수 없음 |
| inside the jail | dentro da jaula | dentro de la jaula | בתוך הכלא | ジェイルの中 | 감옥 안 |
| off until you ask | desligado até você pedir | apagado hasta que lo pidas | כבוי עד שתבקשו | 指定するまで無効 | 요청하기 전까지 꺼짐 |
| opt-in | opt-in (você liga) | opt-in (lo activas tú) | opt-in (בהפעלה יזומה) | オプトイン | 옵트인 |
| home directory | diretório home (short: home) | directorio home (short: home) | תיקיית הבית | ホームディレクトリ | 홈 디렉터리 |
| project directory | diretório do projeto | directorio del proyecto | תיקיית הפרויקט | プロジェクトディレクトリ | 프로젝트 디렉터리 |
| credentials | credenciais | credenciales | פרטי גישה (credentials) | 認証情報 | 자격 증명 |
| SSH keys | chaves SSH | claves SSH | מפתחות SSH | SSH鍵 | SSH 키 |
| token / API key | token / chave de API | token / clave de API | טוקן / מפתח API | トークン / APIキー | 토큰 / API 키 |
| environment variables | variáveis de ambiente | variables de entorno | משתני סביבה | 環境変数 | 환경 변수 |
| allowlist / blocklist | allowlist / blocklist | lista de permitidos / lista de bloqueo | רשימת היתרים / רשימת חסימה | 許可リスト / ブロックリスト | 허용 목록 / 차단 목록 |
| namespace | namespace | namespace | namespace | 名前空間 | 네임스페이스 |
| system call | chamada de sistema (syscall) | llamada al sistema (syscall) | קריאת מערכת (syscall) | システムコール | 시스템 콜 |
| kernel | kernel | kernel | קרנל | カーネル | 커널 |
| mount | montar / montagem | montar / montaje | עיגון (mount) | マウント | 마운트 |
| read-only / read-write | somente leitura / leitura e escrita | solo lectura / lectura y escritura | לקריאה בלבד / קריאה וכתיבה | 読み取り専用 / 読み書き可能 | 읽기 전용 / 읽기·쓰기 |
| resource limits | limites de recursos | límites de recursos | מגבלות משאבים | リソース制限 | 리소스 제한 |
| threat model | modelo de ameaças | modelo de amenazas | מודל איומים | 脅威モデル | 위협 모델 |
| prompt injection | prompt injection | inyección de prompts (prompt injection) | הזרקת פרומפט (prompt injection) | プロンプトインジェクション | 프롬프트 인젝션 |
| permission prompt | pedido de permissão | solicitud de permiso | בקשת אישור | 許可プロンプト | 권한 확인 프롬프트 |
| built-in sandbox | sandbox embutido | sandbox integrado | sandbox מובנה | 組み込みサンドボックス | 내장 샌드박스 |
| lockdown | lockdown | lockdown | lockdown | ロックダウン | 락다운 |
| mask (a file) | mascarar | enmascarar | מיסוך / למסך | マスクする | 마스킹 |
| fails closed | falha fechando (recusa iniciar) | falla en cerrado (se niega a arrancar) | נכשל סגור (מסרב לעלות) | フェイルクローズ (起動を拒否) | 페일 클로즈 (시작 거부) |
| disposable VM | VM descartável | VM desechable | מכונה וירטואלית חד-פעמית | 使い捨てのVM | 일회용 VM |
| unattended | sem supervisão | sin supervisión | ללא השגחה | 無人で / 放置実行 | 무인 실행 |
| toolchain | toolchain | toolchain (herramientas) | toolchain | ツールチェーン | 툴체인 |
| daemon | daemon | daemon (demonio) | daemon | デーモン | 데몬 |
| open source | open source | código abierto (open source) | קוד פתוח | オープンソース | 오픈 소스 |
| vulnerability | vulnerabilidade | vulnerabilidad | פגיעות | 脆弱性 | 취약점 |
| audit | auditoria | auditoría | ביקורת (audit) | 監査 | 감사 |
| release | release (fem.: a release) | versión | גרסה | リリース | 릴리스 |
| install / configure | instalar / configurar | instalar / configurar | התקנה / הגדרה | インストール / 設定 | 설치 / 설정 |
| Do I need it? (nav) | Preciso disso? | ¿Lo necesito? | האם אני צריך את זה? | 自分に必要？ | 나에게 필요할까? |
| How it works (nav) | Como funciona | Cómo funciona | איך זה עובד | 仕組み | 작동 방식 |

Register: pt-br uses "você", informal and direct, Brazilian developer vocabulary. es is neutral Latin American/peninsular-compatible, "tú". he addresses the reader in plural ("אתם") to stay gender neutral. ja uses です/ます polite form, no honorific excess. ko uses 합니다/해요 polite form consistently (pick 합니다체 for body, short noun-ending headlines).
