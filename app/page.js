import HomePageClient from '../components/home/HomePageClient';
import { buildMetadata } from '../lib/seo';

export const metadata = buildMetadata({
  title: 'Premium Chalet Management Services | Chalet Manager',
  description:
    'Transform your chalet into a profitable venture with our comprehensive management services. From guest relations to maintenance, we handle everything.',
  path: '/',
  keywords: [
    'gestion chalet',
    'location chalet',
    'conciergerie montagne',
    'chalet de luxe',
  ],
});

export default function HomePage() {
  return <HomePageClient />;
}
