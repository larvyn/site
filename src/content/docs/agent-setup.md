---
title: 'Teach your agents about Larvyn'
label: 'Agent setup'
description: 'One click installs the larvyn skill, hook and MCP server in Claude Code, Codex, Cursor, Gemini CLI, Windsurf and OpenCode, so agents use Larvyn without being told.'
order: 3
---

An agent doesn’t know Larvyn exists until something tells it. **Set up agents** does that once, for every agent you have installed: the `larvyn` skill, the session-start hook and the [MCP server](/docs/mcp/), in one step.

## Set it up

Open **Settings → Agents know Larvyn** and click **Set up agents**. Or, from a Larvyn terminal:

```sh
larvyn agents setup --dry-run   # list the changes first
larvyn agents setup
```

Then restart the agents that were already running, so they load it.

## What each agent gets

| Agent | Skill | Session hook | MCP server |
| --- | --- | --- | --- |
| Claude Code | `~/.claude/skills/larvyn` | `~/.claude/settings.json` | `~/.claude.json` |
| Codex | `~/.agents/skills/larvyn` | `~/.codex/hooks.json` | `~/.codex/config.toml` |
| Cursor | `~/.agents/skills/larvyn` * | | `~/.cursor/mcp.json` |
| Gemini CLI | `~/.agents/skills/larvyn` * | | `~/.gemini/settings.json` |
| Windsurf | `~/.agents/skills/larvyn` * | | `~/.codeium/windsurf/mcp_config.json` |
| OpenCode | `~/.agents/skills/larvyn` * | | `~/.config/opencode/opencode.json` |

\* The shared skills folder, for agents that read it. If yours keeps skills somewhere else, see [Any other agent](#any-other-agent). `CLAUDE_CONFIG_DIR`, `CODEX_HOME` and `XDG_CONFIG_HOME` are followed when you set them.

- **The skill** explains the `larvyn` commands and when to use them: start the dev stack in Larvyn and wait until it is ready instead of starting servers by hand, run the tests with `larvyn test`, read the log’s errors and hand separate tasks to other agents. `~/.agents/skills` is the shared folder that Codex and a growing list of other agents read skills from.
- **The session-start hook** tells an agent started in a Larvyn terminal its project, worktree and branch, the local URL and what the dev stack runs. Anywhere else it prints nothing. Codex asks you once to review the new hook (`/hooks`).
- **The MCP server** is registered with the full path of the `larvyn` binary, so it works in agents started outside Larvyn too, from a project’s folder or one of its worktrees, while the app runs.

## What it touches

- **Only agents you have installed.** An agent whose config folder isn’t there is skipped, and nothing is created for it.
- **Your settings keep everything else.** Other servers, hooks, key order and formatting stay as they were, and the previous version is saved next to the file as a `.larvyn-backup`.
- **What isn’t Larvyn’s is left alone.** A skill or MCP server called `larvyn` that you wrote yourself is never replaced. An OpenCode `opencode.jsonc` isn’t edited either, since its comments would be lost: add the server by hand, as in [MCP server](/docs/mcp/#by-hand).
- **Preview first.** **Preview** in Settings, or `--dry-run`, shows every file it would change before anything is written.
- **Safe to run again**, after an update for example. If Larvyn’s folder moves, the paths follow.

## Any other agent

An agent that isn’t in the table can still use Larvyn:

1. **The skill.** `larvyn agents skill` prints it. Save it where your agent reads skills:

   ```sh
   mkdir -p ~/.my-agent/skills/larvyn
   larvyn agents skill > ~/.my-agent/skills/larvyn/SKILL.md
   ```

   Agents that don’t read skills can take it as instructions too: it is plain Markdown.

2. **The MCP server.** Add `larvyn mcp` as a local (stdio) server. See [MCP server](/docs/mcp/#by-hand) for the path to use.

## Remove it

**Remove** in Settings, or:

```sh
larvyn agents remove
```

It takes out only what Larvyn added: the skills, the hooks and the MCP servers.
