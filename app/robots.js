import { getSiteUrl } from '../lib/seo';

export default function robots() {
  const siteUrl = getSiteUrl();
  const host = siteUrl.replace(/^https?:\/\//, '');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/tenant'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host,
  };
}
