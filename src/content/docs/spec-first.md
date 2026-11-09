---
title: 'Spec first: plan, review, build and check'
label: 'Spec first'
description: 'The Elephant-Goldfish workflow: one agent writes the spec, a fresh agent reviews it cold, builders work from it and an auditor checks the result for drift.'
order: 5
---

For a feature worth planning, switch the Agents composer to **Spec first**. Four kinds of agents take turns, and each step leaves a file you can read.

## 1. Elephant: write the spec

One agent explores the code and writes the spec in `.larvyn/specs/<slug>.md`: data model, routes and validation, policies, edge cases and tests. It writes no code, and asks you in its terminal about whatever is unclear.

## 2. Goldfish: review it cold

A new agent with no memory reads the spec against the code and writes `<slug>.review.md`. Its first line is the verdict: `Verdict: READY`, `NEEDS REVISION` or `BLOCKED`. By default the reviewer is a different agent than the author.

**Revise with the Elephant** hands the review back. A spec changed after its review counts as unreviewed until the next review, and old reviews move to `.larvyn/specs/history/`.

## 3. Builders: build it

Once a review of the current version says READY, the spec goes to one or more agents. Each one works in its own worktree with a copy of the spec. Building without an approved review asks first.

## 4. Drift check

A fresh agent, by default not the builder’s, compares an attempt’s changes with the spec and writes `<slug>.drift.md`: every requirement done, done differently or missing, plus changes nobody asked for. **Send fixes** gives the report to the builder. Then merge the best attempt.

## Where the files live

Specs are local working files. Larvyn adds `/.larvyn/specs/` to the repository’s `.git/info/exclude`, and merging an attempt leaves them out of the commit. `.larvyn/project.json` stays tracked. The panel follows the agents’ writes as they happen.

## From the CLI or MCP

The same workflow runs from a terminal or as MCP tools, so an agent can drive it too:

```sh
larvyn specs draft "team invitations"
larvyn specs review team-invitations
larvyn specs build team-invitations --agents claude,codex
larvyn specs drift <builder-id>
```

See [Specs](/docs/cli/#specs) in the command reference.
