---
title: 'Larvyn MCP server'
label: 'MCP server'
description: 'larvyn mcp serves the larvyn commands as MCP tools for Claude Code, Codex, Cursor, Gemini CLI, Windsurf, OpenCode and any client. Set up agents adds it.'
order: 2
---

For agents that prefer MCP over a shell, `larvyn mcp` serves every [`larvyn` command](/docs/cli/) as an MCP tool, on stdin and stdout. The tools are the commands with an underscore: `terminal read` is `terminal_read`, `agents wait` is `agents_wait`, and so on.

## Add it to your agent

**Settings → Agents know Larvyn → Set up agents**, or `larvyn agents setup` in a Larvyn terminal, adds the server to every agent you have installed: Claude Code, Codex, Cursor, Gemini CLI, Windsurf and OpenCode. It writes the full path of the `larvyn` binary, so the server also works in agents started outside Larvyn. [Agent setup](/docs/agent-setup/) lists the files it changes, and `larvyn agents remove` takes the server out again.

Restart the agents that were already running, so they load it.

## By hand

For another MCP client, or to add it yourself, the server is the `larvyn` binary run with `mcp`, over stdio. Inside a Larvyn terminal, `larvyn` is on the PATH. Anywhere else, use the full path of the binary, in the `bin` folder of Larvyn’s state folder:

- Linux: `~/.config/larvyn/bin/larvyn`
- macOS: `~/Library/Application Support/larvyn/bin/larvyn`
- Windows: `%APPDATA%\larvyn\bin\larvyn.exe`

**Claude Code**

```sh
claude mcp add --scope user larvyn -- larvyn mcp
```

**Codex**

```sh
codex mcp add larvyn -- larvyn mcp
```

**Cursor, Windsurf, Gemini CLI and other clients with an `mcpServers` file**:

```json
{
  "mcpServers": {
    "larvyn": { "command": "larvyn", "args": ["mcp"] }
  }
}
```

**OpenCode**

```sh
opencode mcp add --global larvyn -- larvyn mcp
```

Or in `opencode.json` / `opencode.jsonc`. OpenCode 2 keeps servers under `mcp.servers`; OpenCode 1 keeps them right under `mcp`, without `servers`:

```json
{
  "mcp": {
    "servers": {
      "larvyn": { "type": "local", "command": ["larvyn", "mcp"] }
    }
  }
}
```

Outside Larvyn’s terminals the server works from a project’s folder or one of its worktrees, and its tools need the app running.

## Tools

Tools that only read are marked with `readOnlyHint`, so clients can run them without asking. A long `agents_wait` or `stack_wait` doesn’t block the other calls.

| Tool | Reads only | What it does |
| --- | --- | --- |
| `context` | yes | Project, worktree, branch, local URL and dev stack. |
| `version` | yes | Larvyn’s version. |
| `ports` | yes | The ports the project’s terminals and services listen on, with their URL. |
| `terminal_list` | yes | The project’s terminals. |
| `terminal_read` | yes | A terminal’s last lines, or what its screen shows. |
| `terminal_search` | yes | Matching lines of a terminal’s whole output. |
| `terminal_write` | | Types text into a terminal. |
| `terminal_open` | | Opens a terminal running a command or a shell. |
| `terminal_close` | | Closes a terminal the caller opened. |
| `stack_list` | yes | The dev stack and what runs. |
| `stack_wait` | yes | Waits until a stack item is ready. |
| `stack_start`, `stack_stop`, `stack_restart` | | Starts, stops or restarts a stack item, optionally waiting until it is ready. |
| `artisan` | | Runs an Artisan command that finishes. |
| `test` | | Runs the tests in a terminal Larvyn shows and returns the failures. |
| `logs_errors` | yes | The latest errors in the Laravel log. |
| `models` | yes | Eloquent models with table, relationships, fillable, casts and row count. |
| `db_tables`, `db_table` | yes | Tables with row counts; one table’s columns, indexes and foreign keys. |
| `db_query` | yes | A query that reads, in a read-only transaction that is rolled back. |
| `agents_kinds`, `agents_list`, `agents_status` | yes | The agents Larvyn can start, the project’s agents, one agent’s status and screen. |
| `agents_wait` | yes | Waits for one or several agents to be done or need attention. |
| `agents_start`, `agents_send` | | Starts an agent in a new worktree; sends it a follow-up. |
| `lock_list` | yes | The locks held in the project. |
| `lock_acquire`, `lock_release` | | Takes turns on what agents share, such as the database. |
| `specs_list`, `specs_show` | yes | Specs and their reviews. |
| `specs_draft`, `specs_review`, `specs_revise`, `specs_build`, `specs_drift`, `specs_fix` | | The [Spec first](/docs/spec-first/) workflow. |
| `agents_skill` | yes | The `larvyn` skill, to save where an agent reads skills. |
| `agents_setup`, `agents_remove` | | Installs or removes the `larvyn` skill, session hook and MCP server. |

Each tool’s parameters are the command’s options, with the same names and defaults. Your client shows them, or see the [command reference](/docs/cli/).

## Security

`larvyn mcp` talks to the app through a socket only your user can open, with a token that changes at every start. It never opens a port, so a web page in your browser can’t reach it. Agents get the permissions you set in Larvyn: an agent started by another agent uses your current permission setting, and agents can start agents at most two levels below the ones you start.
