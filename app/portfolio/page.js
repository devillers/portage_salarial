import { buildMetadata, getSiteUrl } from '../../lib/seo';
import PortfolioClient from './PortfolioClient';

export const metadata = buildMetadata({
  title: 'Portfolio | Chalet Manager',
  description:
    'Découvrez notre portfolio de chalets gérés dans les Alpes. Propriétés de luxe avec services complets de gestion locative et conciergerie.',
  path: '/portfolio',
  keywords: [
    'portfolio chalets',
    'chalet de luxe',
    'location montagne',
    'gestion locative alpes',
  ],
});

export const revalidate = 3600;

async function getChalets() {
  const siteUrl = getSiteUrl();

  try {
    const response = await fetch(`${siteUrl}/api/chalets`, {
      next: { revalidate },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    if (data?.success && Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error('Failed to fetch chalets for portfolio:', error);
    return [];
  }
}

export default async function Page() {
  const chalets = await getChalets();
  return <PortfolioClient initialChalets={chalets} />;
}
