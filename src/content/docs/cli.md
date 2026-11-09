---
title: 'The larvyn command'
label: 'larvyn command'
description: 'Every larvyn command: context, terminals, the dev stack, artisan, tests, logs, models and database, agents, locks and specs, with options and exit codes.'
order: 1
---

Every terminal Larvyn opens has the `larvyn` command first on its PATH, and knows which terminal and folder it runs in. It talks to the running app, so what it prints is what the app shows.

```sh
larvyn help              # every command
larvyn help agents start # one command, with its options
larvyn context --json    # any command, as JSON
```

## How it works

- **Required values come first, options after.** `larvyn test --filter LoginTest`, `larvyn agents start "add a CSV export" --title "CSV export"`. A unique start of an id is enough wherever a command takes a terminal or agent id.
- **`--json` works on every command**, for scripts and agents that prefer to parse.
- **The exit code tells the result.** A command that fails, a test run with failures and a wait that ends without the item being ready exit non-zero, so an agent knows without reading the output.
- **It acts on the folder it is called from.** `artisan`, `test` and `logs` run in the caller’s folder, so an agent in its worktree sees its own copy of the app and leaves your main checkout alone. The dev stack is the project’s: it runs in the main folder, as in the sidebar.
- **Outside Larvyn’s terminals** it works from a project’s folder or one of its worktrees, while the app runs. The binary lives in the `bin` folder of Larvyn’s state folder: `~/.config/larvyn/bin` on Linux, `~/Library/Application Support/larvyn/bin` on macOS and `%APPDATA%\larvyn\bin` on Windows.

## Where you are

| Command | What it does |
| --- | --- |
| `larvyn context` | Project, folder, branch, whether it is an agent’s worktree, local URL and what the dev stack runs. |
| `larvyn ports` | The TCP ports the project’s terminals and services listen on, with their URL: which port Vite or a dev server an agent started got. |
| `larvyn version` | Larvyn’s version. |

## Terminals

| Command | What it does |
| --- | --- |
| `larvyn terminal list` | The project’s terminals. |
| `larvyn terminal read <id>` | A terminal’s last lines as plain text. `--lines 50`, `--all` for the whole scrollback, `--screen` for what the screen shows now. |
| `larvyn terminal search <id> "error"` | Lines of a terminal’s whole output that match, with line numbers. `--context 2` for lines around each match, `--limit`. Case is ignored unless the pattern has a capital. |
| `larvyn terminal write <id> "php artisan migrate" --enter` | Types text into a terminal, and presses enter with `--enter`. |
| `larvyn terminal open --command "npm run build"` | Opens a terminal in the project, running a command or a shell. `--cwd`, `--title`. |
| `larvyn terminal close <id>` | Closes a terminal. Only the ones the caller opened. |

Agent UIs place text with cursor moves, so their raw output is scrambled. For an agent’s terminal, `terminal read` shows its screen, drawn by a terminal emulator.

## Dev stack

| Command | What it does |
| --- | --- |
| `larvyn stack list` | The dev stack (HTTP server, Vite, queue, Horizon, scheduler…) and what runs. |
| `larvyn stack start vite --wait` | Starts an item, and with `--wait` returns only when it is ready. `--timeout` in seconds, 60 by default. |
| `larvyn stack wait serve` | Waits until an item is ready: its port answers (`--port 8000`) or a line of its output matches (`--line '<regexp>'`). By default the HTTP server’s port, or Vite’s “ready in”. |
| `larvyn stack stop <key>` | Stops an item. |
| `larvyn stack restart <key> --wait` | Restarts an item. |

If an item crashes while you wait, you get its exit code and last lines straight away, and the command exits 1.

## Laravel

| Command | What it does |
| --- | --- |
| `larvyn artisan migrate --force` | Runs an Artisan command that finishes, and exits with its code. Commands that never finish, like `serve` or `queue:work`, are refused and point to `stack` instead. |
| `larvyn test --filter LoginTest` | Runs the tests in a terminal Larvyn shows, then prints a summary and each failure with its `file:line`. `--parallel`, `--timeout` (1800 seconds by default). Exits 1 when anything fails. |
| `larvyn logs errors --since 1h` | The latest errors in `storage/logs`. `--limit` (10 by default), `--trace` for each error’s first stack frames. |

## Models and database

They read the database through the app’s own connection, as the Database view does.

| Command | What it does |
| --- | --- |
| `larvyn models --name Order` | Eloquent models with their table, relationships, fillable, casts and row count. |
| `larvyn db tables` | Tables with their row counts. |
| `larvyn db table orders` | A table’s columns, indexes and foreign keys. |
| `larvyn db query "select * from orders where total > 100"` | Runs a query that reads (`select`, `with`, `show`, `describe`, `explain`) and prints its rows. `--limit` (100 by default, 1000 at most). |

`db query` runs in a read-only transaction that is rolled back, so it can’t change anything.

## Agents

| Command | What it does |
| --- | --- |
| `larvyn agents kinds` | The agents Larvyn can start and whether each is installed. |
| `larvyn agents list` | The project’s agents with their status. `--all` for every project. |
| `larvyn agents start "make the failing checkout test pass"` | Starts an agent in a new worktree from the caller’s branch, like the **Launch** button: the project’s setup steps run first, and your permission settings apply. `--agent codex`, `--base <branch>`, `--title`, `--here` to work in the caller’s folder. |
| `larvyn agents send <id> "also add a test"` | Types a follow-up into an agent and presses enter. |
| `larvyn agents status <id>` | Its status and screen now. |
| `larvyn agents wait <id>` | Waits until the agent is done or needs someone, then prints its screen as its report. |
| `larvyn agents wait <a>,<b>` | Waits for all of them, but returns as soon as one needs attention. `--any` returns when the first one is done. |

`agents wait` exits **0** when the agent is done, **2** when it needs attention (a question, a permission prompt) and **1** on a timeout (1800 seconds by default) or a crash. It also returns early on prompts that don’t ring the terminal bell, such as “do you trust this folder?”, so a waiting agent is never mistaken for a finished one. Answer with `larvyn terminal write <id> …`.

Agents can start agents at most two levels below the ones you start, so a chain of helpers can’t grow without limit.

## Locks

When several agents share one database or one branch, a lock makes them take turns.

```sh
larvyn lock acquire db --note "migrating"
php artisan migrate
larvyn lock release db
```

| Command | What it does |
| --- | --- |
| `larvyn lock acquire <name>` | Takes a lock such as `db`, `migrations` or `main`, waiting while another terminal holds it (`--wait`, 300 seconds by default, or `--nowait`). Exits 1 if it is still held after the wait. Taking a lock you hold again renews it. `--ttl` (600 seconds by default), `--note`. |
| `larvyn lock release <name>` | Releases a lock you hold. |
| `larvyn lock list` | The locks held in the project. `--all` for every project. |

A lock also ends when its `--ttl` passes or when the terminal that took it closes.

## Specs

The [Spec first](/docs/spec-first/) workflow, from a terminal.

| Command | What it does |
| --- | --- |
| `larvyn specs list` | The project’s specs with their review status. |
| `larvyn specs show <slug>` | A spec, or with `--review` its latest review. |
| `larvyn specs draft "team invitations"` | Starts an Elephant that explores the code and writes the spec, writing no code. |
| `larvyn specs review <slug>` | Starts a Goldfish, a fresh agent, that reviews the spec cold and writes its verdict. `--focus`. |
| `larvyn specs revise <slug>` | Hands the latest review back to the Elephant. |
| `larvyn specs build <slug> --agents claude,codex` | Starts builders, each in its own worktree. Needs a READY review of the current version, unless `--force`. `--notes`. |
| `larvyn specs drift <id>` | Starts an auditor that compares a builder’s changes with its spec. |
| `larvyn specs fix <id>` | Sends a builder its drift report. |

## Agent setup

| Command | What it does |
| --- | --- |
| `larvyn agents setup` | Installs the `larvyn` skill and session hook in Claude Code and Codex. `--dry-run` lists the changes. See [Agent setup](/docs/agent-setup/). |
| `larvyn agents remove` | Takes out only what Larvyn added. |

## The API underneath

Every command is a method of a local API. `larvyn api list` lists them, and `larvyn api call <method> '<json>'` calls one with JSON params:

```sh
larvyn api call stack.start '{"key": "vite", "wait": true}'
```

The API is a socket only your user can open, with a token that changes at every start. It is never an HTTP server, so a web page open in your browser can’t reach it. The same methods are served as [MCP tools](/docs/mcp/).
