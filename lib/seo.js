const DEFAULT_OG_IMAGE = 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&dpr=1';

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';
}

export function buildMetadata({ title, description, path = '/', image = DEFAULT_OG_IMAGE, keywords = [] }) {
  const siteUrl = getSiteUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const pageUrl = `${siteUrl}${normalizedPath === '/' ? '' : normalizedPath}`;

  const metadata = {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };

  if (keywords.length > 0) {
    metadata.keywords = keywords;
  }

  return metadata;
}

export const seoConstants = {
  DEFAULT_OG_IMAGE,
};
