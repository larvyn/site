---
title: 'Larvyn docs'
label: 'Overview'
description: 'How to drive Larvyn from a terminal or an AI agent: the larvyn command, the MCP server, the agent skill and hook, and shared project settings.'
order: 0
---

Larvyn is a desktop app, and most of it needs no documentation: add a folder and it finds the rest. These pages cover the parts you drive by hand or that your agents drive for you.

## For agents

Every terminal Larvyn opens has a `larvyn` command on its PATH. An agent running there can see what you see in the app and use the same tools: start the dev stack and wait until it is ready, run the tests and read the failures, read the log’s errors, query the database, and start other agents and wait for their result.

- **[The `larvyn` command](/docs/cli/)**: every command, its options and its exit codes.
- **[MCP server](/docs/mcp/)**: the same commands as MCP tools, for Claude Code, Codex, Cursor and any other MCP client.
- **[Agent setup](/docs/agent-setup/)**: a `larvyn` skill and a session-start hook, so agents use all this without being told.
- **[Spec first](/docs/spec-first/)**: plan a feature with one agent, review it with a fresh one, then build.

## For your team

- **[Project settings](/docs/project-json/)**: `.larvyn/project.json`, committed with the code: shared commands, extra dev-stack items, required plugins and the setup every agent worktree runs.

## Try it

In any Larvyn terminal:

```sh
larvyn context
larvyn help
```

`larvyn context` shows the project, the folder, the branch, whether it is an agent’s worktree, the local URL and what the dev stack is running. `larvyn help` lists every command.

Don’t have Larvyn yet? [Install it with one command](/#install). It is free, with no account.
