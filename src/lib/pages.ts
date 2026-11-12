// Feature and comparison pages: the footer, the sitemap and each page's "Related" links read this list.
export interface PageLink {
  path: string;
  label: string;
  icon: string;
  blurb: string;
}

export const FEATURE_PAGES: PageLink[] = [
  { path: '/agents/', label: 'Parallel AI agents', icon: 'Bot', blurb: 'Claude Code, Codex and more, each in its own git worktree.' },
  { path: '/test-runner/', label: 'Pest & PHPUnit runner', icon: 'TestTube2', blurb: 'Every failure with the exact line in your code.' },
  { path: '/log-viewer/', label: 'Laravel log viewer', icon: 'ScrollText', blurb: 'A live, parsed laravel.log with frames you can open.' },
  { path: '/database-client/', label: 'Laravel database client', icon: 'Database', blurb: 'Rows, structure and SQL through your app’s connection.' },
  { path: '/tinker/', label: 'Tinker editor', icon: 'FlaskConical', blurb: 'Run PHP in your booted app with timing and query counts.' },
  { path: '/any-project/', label: 'Any project', icon: 'FolderOpen', blurb: 'Terminals, agents and git for repos that aren’t Laravel.' },
];

export const INTEGRATION_PAGES: PageLink[] = [
  { path: '/integrations/', label: 'Integrations', icon: 'Plug', blurb: 'Flock, Herd, Laravel Boost, coding agents and your editor.' },
  { path: '/integrations/flock/', label: 'Flock integration', icon: 'Globe', blurb: 'Every app and every agent at its own .test URL.' },
];

export const COMPARE_PAGES: PageLink[] = [
  { path: '/compare/tinkerwell/', label: 'Larvyn vs Tinkerwell', icon: 'Scale', blurb: 'A PHP code runner, or a whole Laravel workbench.' },
  { path: '/compare/tableplus/', label: 'Larvyn vs TablePlus', icon: 'Scale', blurb: 'A general database client, or one that knows your app.' },
];

export const ALL_PAGES = [...FEATURE_PAGES, ...INTEGRATION_PAGES, ...COMPARE_PAGES];
