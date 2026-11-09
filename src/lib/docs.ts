import { getCollection, type CollectionEntry } from 'astro:content';

export type Doc = CollectionEntry<'docs'>;

/** The docs in sidebar order. */
export async function getDocs(): Promise<Doc[]> {
  return (await getCollection('docs')).sort((a, b) => a.data.order - b.data.order);
}

export const docSlug = (doc: Doc) => (doc.id === 'index' ? undefined : doc.id);
export const docUrl = (doc: Doc) => (doc.id === 'index' ? '/docs/' : `/docs/${doc.id}/`);
