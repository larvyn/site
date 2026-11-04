// The plugin marketplace, read from the registry at build time. The site is
// rebuilt on a schedule (see .github/workflows/deploy.yml), so a new listing
// shows up within a few hours.
export const REGISTRY = 'https://github.com/larvyn/plugins';
const INDEX = 'https://raw.githubusercontent.com/larvyn/plugins/main/plugins.json';
export const STARTER = 'https://github.com/larvyn/plugin-examples/tree/main/plugin-starter';

export interface Listing {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  larvyn: string;
  permissions: string[];
  network: string[];
  repo: string;
  download: string;
  sha256: string;
  size: number;
  icon?: string;
}

// Kept in step with internal/plugins/manifest.go in larvyn/larvyn.
export const PERMISSIONS: Record<string, { label: string; sensitive: boolean }> = {
  'project.read': { label: "Read the project's name, path and stack", sensitive: false },
  'project.env.read': { label: "Read the project's .env, including secrets", sensitive: true },
  'terminal.run': { label: 'Run commands in a terminal', sensitive: true },
  'artisan.run': { label: 'Run Artisan commands', sensitive: true },
  'stack.control': { label: "Start and stop the project's services", sensitive: false },
  'ui.notify': { label: 'Show notifications', sensitive: false },
  storage: { label: 'Keep its own settings and data', sensitive: false },
  network: { label: 'Connect to the internet', sensitive: true },
  'project.env.keys': { label: 'Read and change some .env values', sensitive: true },
};

let cached: Promise<Listing[]> | undefined;

/** The listed plugins, sorted by name. The build fails if the registry can't be read. */
export function getPlugins(): Promise<Listing[]> {
  cached ??= fetch(INDEX).then(async (res) => {
    if (!res.ok) throw new Error(`${INDEX} answered ${res.status}`);
    const index = (await res.json()) as { apiVersion: number; plugins: Listing[] };
    if (index.apiVersion !== 1) throw new Error(`plugins.json is apiVersion ${index.apiVersion}`);
    // Only inline SVGs: the page must not load images from elsewhere.
    for (const p of index.plugins) if (!p.icon?.startsWith('data:image/svg+xml;base64,')) delete p.icon;
    return index.plugins.sort((a, b) => a.name.localeCompare(b.name));
  });
  return cached;
}

export const pluginUrl = (p: Listing) => `/plugins/${p.id}/`;

/** "12 KB" */
export const size = (bytes: number) => (bytes < 1 << 20 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1 << 20)).toFixed(1)} MB`);
