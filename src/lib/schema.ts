// Structured data (schema.org) shared by the home page and the feature pages.
import { RELEASES, RELEASES_REPO } from './links';

const SITE = 'https://larvyn.dev';

export const organization = {
  '@type': 'Organization',
  '@id': `${SITE}/#org`,
  name: 'Larvyn',
  url: `${SITE}/`,
  logo: `${SITE}/favicon.svg`,
  sameAs: [`https://github.com/larvyn`, `https://github.com/${RELEASES_REPO}`],
};

export function softwareApplication(version?: string) {
  return {
    '@type': 'SoftwareApplication',
    '@id': `${SITE}/#app`,
    name: 'Larvyn',
    description:
      'A free desktop app for Laravel: persistent terminals, parallel AI coding agents in git worktrees, and Artisan, routes, models, database, Tinker, tests, queues and logs in one native window. Terminals, agents and git also work in projects that are not Laravel.',
    url: `${SITE}/`,
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Laravel development tool',
    operatingSystem: 'Windows 10, Windows 11, macOS 12+, Linux',
    ...(version && version !== 'beta' ? { softwareVersion: version.replace(/^v/, '') } : {}),
    downloadUrl: RELEASES,
    installUrl: `${SITE}/#install`,
    fileSize: '12MB',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@id': `${SITE}/#org` },
    image: `${SITE}/og.png`,
  };
}

export function breadcrumbs(items: [name: string, path: string][]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [['Larvyn', '/'] as const, ...items].map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: new URL(path, SITE).href,
    })),
  };
}

/** Wraps nodes in one @graph document. */
export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
