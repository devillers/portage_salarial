import { getSiteUrl } from '../lib/seo';

export const revalidate = 3600;

async function fetchChaletEntries() {
  const siteUrl = getSiteUrl();

  try {
    const response = await fetch(`${siteUrl}/api/chalets`, {
      next: { revalidate },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    if (!data?.success || !Array.isArray(data.data)) {
      return [];
    }

    return data.data
      .filter((chalet) => chalet?.slug)
      .map((chalet) => ({
        url: `${siteUrl}/chalet/${chalet.slug}`,
        lastModified: chalet.updatedAt ? new Date(chalet.updatedAt) : undefined,
      }));
  } catch (error) {
    console.error('Failed to build chalet sitemap entries:', error);
    return [];
  }
}

export default async function sitemap() {
  const siteUrl = getSiteUrl();
  const staticRoutes = [
    '',
    '/services',
    '/portfolio',
    '/portage-salarial',
    '/seminaires-evenements',
    '/contact',
    '/cgv-locataires',
    '/cgv-proprietaires',
  ].map((path) => ({
    url: `${siteUrl}${path || '/'}`,
    lastModified: new Date(),
  }));

  const chaletRoutes = await fetchChaletEntries();

  return [...staticRoutes, ...chaletRoutes];
}
