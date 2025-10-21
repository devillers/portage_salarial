// app/contact/page.js

import ContactPageClient from './ContactPageClient';
import { buildMetadata } from '../../lib/seo';

export const metadata = buildMetadata({
  title: 'Contact | Chalet Manager',
  description:
    'Contactez notre équipe pour la gestion de chalets, l\'organisation de séminaires ou toute demande de partenariat dans les Alpes.',
  path: '/contact',
  keywords: [
    'contact chalet manager',
    'gestion chalet contact',
    'conciergerie alpes contact',
    'evenement chalet contact',
  ],
});

export default function ContactPage() {
  return <ContactPageClient />;
}
