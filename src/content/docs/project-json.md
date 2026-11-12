---
title: 'Shared project settings: .larvyn/project.json'
label: 'Project settings'
description: 'Commit .larvyn/project.json to share commands, dev-stack items, required plugins and agent worktree setup steps with everyone who opens the repository.'
order: 4
---

Some setup belongs to the whole team: the commands everyone runs, and what a fresh agent worktree needs before it can run a test. A `.larvyn/project.json` committed with the code gives everyone who opens the repository in Larvyn the same setup.

```json
{
  "apiVersion": 1,
  "commands": [
    { "id": "fresh", "title": "Fresh database with demo data", "run": "php artisan migrate:fresh --seed" },
    { "id": "lint", "title": "Fix code style", "run": "vendor/bin/pint" }
  ],
  "stack": [
    { "key": "stripe", "title": "Stripe webhooks", "argv": ["stripe", "listen", "--forward-to", "localhost:8000/stripe/webhook"] }
  ],
  "plugins": ["larvyn.mailpit", { "id": "larvyn.horizon", "version": ">=1.0.0" }],
  "worktree": {
    "setup": ["composer install --no-interaction", "php artisan migrate --force"]
  }
}
```

## Fields

| Field | What it does |
| --- | --- |
| `apiVersion` | Always `1`. |
| `commands` | Commands with an `id`, a `title` and the shell line to `run`. They show up in Ctrl K and in the **Commands** card of the Overview, and run in a project terminal as written. |
| `stack` | Extra long-running processes for the dev stack, next to the built-in ones: a `key`, a `title` and the `argv` to run. |
| `plugins` | The plugins the project needs, as `"publisher.name"` or `{ "id": …, "version": ">=1.2.0" }`. If one is missing, off or the wrong version, the Overview says so and opens it in the Marketplace. |
| `worktree.setup` | Commands run one after another in every new agent worktree, in the agent’s own terminal, before the agent starts. |

## Your commands, or the team’s

In the **Commands** card, the people icon moves a command between “only me” and the team’s file. Larvyn creates the file if there is none, and keeps everything else in it as it was.

## Agent worktrees

Without `worktree.setup`, a new worktree has no `vendor/` and an agent spends its first minutes running `composer install`. With it, the worktree is ready before the agent starts. If a step fails, the agent doesn’t start, and **Relaunch** starts it without the setup.

## When the file changes

Larvyn picks up changes on its own, after a `git pull` or a branch switch. A wrong entry is skipped and listed. A file that doesn’t parse keeps the last version that loaded, and the Doctor shows why.
