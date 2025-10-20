import { Suspense } from 'react';
import AuthPageClient from './_client-auth-page';

export const dynamic = 'force-dynamic'; // évite le prérendu statique
export const revalidate = 0;            // pas de cache build

export default function Page() {
  return (
    <Suspense>
      <AuthPageClient />
    </Suspense>
  );
}
