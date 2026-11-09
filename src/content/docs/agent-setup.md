---
title: 'Teach your agents about Larvyn'
label: 'Agent setup'
description: 'Set up agents installs a larvyn skill and a session-start hook in Claude Code and Codex, so agents use Larvyn’s dev stack, tests and logs without being told.'
order: 3
---

An agent doesn’t know the `larvyn` command exists until something tells it. **Set up agents** does that once, for every agent you have installed.

## Set it up

Open **Settings → Agents know Larvyn** and click **Set up agents**. Or, from a terminal:

```sh
larvyn agents setup --dry-run   # list the changes first
larvyn agents setup
```

It installs two things:

- **A `larvyn` skill**, in Claude Code (`~/.claude/skills`, or `CLAUDE_CONFIG_DIR`) and in `~/.agents/skills` for Codex and other agents that read it. It explains the commands and when to use them: start the dev stack in Larvyn and wait until it is ready instead of starting servers by hand, run the tests with `larvyn test`, read the log’s errors and hand separate tasks to other agents.
- **A session-start hook**, in Claude Code’s `settings.json` and Codex’s `hooks.json` (`CODEX_HOME`). When an agent starts in a Larvyn terminal, the hook tells it the project, the worktree and branch, the local URL and what the dev stack runs. Anywhere else it prints nothing.

Codex asks you once to review the new hook (`/hooks`).

## What it touches

- **Only agents you have installed.** Nothing is created for an agent you don’t use.
- **Your settings keep everything else.** Other hooks, key order and formatting stay as they were, and the previous version is saved next to the file as a `.larvyn-backup`.
- **Preview first.** **Preview** in Settings, or `--dry-run`, shows every file it would change before anything is written.
- **Safe to run again**, after an update for example.

## Remove it

**Remove** in Settings, or:

```sh
larvyn agents remove
```

It takes out only what Larvyn added.

## Prefer MCP?

The skill teaches the shell commands. If your agent works better with tools, add the [MCP server](/docs/mcp/) too: the two work side by side.
