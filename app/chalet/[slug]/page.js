
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ClientIcon from '../../../components/ClientIcon';
import ChaletBooking from '../../../components/chalet/ChaletBooking';
import ChaletMap from '../../../components/chalet/ChaletMap';
import ChaletGallery from '../../../components/chalet/ChaletGallery';
import { getSiteUrl, seoConstants } from '../../../lib/seo';

export const revalidate = 3600;

function getAmenityLabel(amenity) {
  if (!amenity) return '';
  if (typeof amenity === 'string') return amenity;
  if (typeof amenity?.name === 'string') return amenity.name;
  if (typeof amenity?.description === 'string') return amenity.description;
  return '';
}

async function getChalet(slug) {
  const siteUrl = getSiteUrl();
  try {
    const response = await fetch(`${siteUrl}/api/chalets/${slug}`, { next: { revalidate } });
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching chalet:', error);
    return null;
  }
}

function normalizeImages(images) {
  if (!images) return [];
  if (Array.isArray(images)) return images.filter(image => image && image.url);
  const normalized = [];
  if (images.hero?.url) normalized.push(images.hero);
  if (Array.isArray(images.gallery)) normalized.push(...images.gallery.filter(image => image && image.url));
  Object.entries(images).forEach(([key, value]) => {
    if (key === 'hero' || key === 'gallery' || !value) return;
    if (Array.isArray(value)) {
      value.forEach(item => item?.url && normalized.push(item));
      return;
    }
    if (typeof value === 'object' && value.url) normalized.push(value);
  });
  return normalized;
}

function getHeroImage(images) {
  if (!images) return null;
  if (Array.isArray(images)) return images.find(i => i?.isHero) || images.find(i => i?.url) || null;
  if (images.hero?.url) return images.hero;
  if (Array.isArray(images.gallery)) {
    const heroFromGallery = images.gallery.find(i => i?.isHero) || images.gallery.find(i => i?.url);
    if (heroFromGallery) return heroFromGallery;
  }
  const normalized = normalizeImages(images);
  return normalized.length > 0 ? normalized[0] : null;
}

export async function generateMetadata(props) {
  const { slug } = await props.params;
  const chalet = await getChalet(slug);
  if (!chalet) return { title: 'Chalet non trouvé' };

  const siteUrl = getSiteUrl();
  const pagePath = `/chalet/${slug}`;
  const pageUrl = `${siteUrl}${pagePath}`;
  const normalizedImages = normalizeImages(chalet.images);
  const metaTitle = chalet.seo?.metaTitle || `${chalet.title} | Chalet Manager`;
  const metaDescription = chalet.seo?.metaDescription || chalet.shortDescription || chalet.description;
  const keywords = Array.isArray(chalet.seo?.keywords) ? chalet.seo.keywords : [];

  const openGraphImages = normalizedImages.length > 0
    ? normalizedImages.map(image => ({
        url: image.url,
        alt: image.alt || chalet.title,
        width: image.width || 1200,
        height: image.height || 800,
      }))
    : [{ url: seoConstants.DEFAULT_OG_IMAGE, alt: metaTitle, width: 1200, height: 630 }];

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: { canonical: pagePath },
    openGraph: { title: metaTitle, description: metaDescription, type: 'article', url: pageUrl, images: openGraphImages },
    twitter: { card: 'summary_large_image', title: metaTitle, description: metaDescription, images: [openGraphImages[0]?.url ?? seoConstants.DEFAULT_OG_IMAGE] },
  };
}

export default async function ChaletPage(props) {
  const { slug } = await props.params;
  const chalet = await getChalet(slug);
  if (!chalet) notFound();

  const heroImage = getHeroImage(chalet.images);
  const galleryImages = normalizeImages(chalet.images);
  const descriptionParagraphs = typeof chalet.description === 'string'
    ? chalet.description.split('\n').filter(Boolean)
    : [];
  const metaDescription = chalet.shortDescription || descriptionParagraphs.join(' ') || '';
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/chalet/${slug}`;
  const amenityFeatures = Array.isArray(chalet.amenities)
    ? chalet.amenities
        .map(amenity => {
          const name = getAmenityLabel(amenity);
          return name ? { '@type': 'LocationFeatureSpecification', name } : null;
        })
        .filter(Boolean)
    : [];

  const imageUrls = galleryImages.map(image => image.url).filter(Boolean);

  const accommodationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    name: chalet.title,
    description: metaDescription,
    url: pageUrl,
    ...(imageUrls.length > 0 ? { image: imageUrls } : {}),
    ...(chalet.location
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: chalet.location.address,
            addressLocality: chalet.location.city,
            postalCode: chalet.location.postalCode,
            addressCountry: chalet.location.country,
          },
          ...(chalet.location.coordinates
            ? {
                geo: {
                  '@type': 'GeoCoordinates',
                  latitude: chalet.location.coordinates.latitude,
                  longitude: chalet.location.coordinates.longitude,
                },
              }
            : {}),
        }
      : {}),
    ...(chalet.pricing?.basePrice
      ? { priceRange: `€${Number(chalet.pricing.basePrice).toFixed(0)} par nuit` }
      : {}),
    ...(chalet.specifications
      ? {
          numberOfRooms: chalet.specifications.bedrooms,
          numberOfBedrooms: chalet.specifications.bedrooms,
          numberOfBathroomsTotal: chalet.specifications.bathrooms,
          ...(chalet.specifications.maxGuests
            ? {
                occupancy: { '@type': 'QuantitativeValue', maxValue: chalet.specifications.maxGuests, unitCode: 'C62' },
              }
            : {}),
        }
      : {}),
    ...(amenityFeatures.length > 0 ? { amenityFeature: amenityFeatures } : {}),
    ...(chalet.contact?.phone || chalet.contact?.email
      ? { contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', telephone: chalet.contact.phone, email: chalet.contact.email } }
      : {}),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Portfolio', item: `${siteUrl}/portfolio` },
      { '@type': 'ListItem', position: 3, name: chalet.title, item: pageUrl },
    ],
  };

  const structuredData = [accommodationSchema, breadcrumbSchema];

  return (
    <div className="min-h-screen bg-white">
      <script key="structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* HEADER minimal, transparent sur le hero */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white drop-shadow">
              <ClientIcon name="Mountain" className="h-6 w-6" />
              <span className="font-semibold">Chalet Manager</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-white/95">
              <a href="#overview" className="hover:opacity-80">Aperçu</a>
              <a href="#gallery" className="hover:opacity-80">Galerie</a>
              <a href="#amenities" className="hover:opacity-80">Équipements</a>
              <a href="#location" className="hover:opacity-80">Autour</a>
              <a href="#booking" className="hover:opacity-80">Réserver</a>
            </nav>
          </div>
        </div>
      </header>

      {/* HERO immersif */}
      <section id="overview" className="relative h-[92vh] min-h-[640px] overflow-hidden">
        {heroImage && (
          <>
            <Image
              src={heroImage.url}
              alt={heroImage.alt || chalet.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/20" />
          </>
        )}

        {/* Titre + localisation */}
        <div className="absolute inset-x-0 bottom-40 sm:bottom-44">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow mb-3">
              {chalet.title}
            </h1>
            <div className="flex items-center gap-2 text-white/90">
              <ClientIcon name="MapPin" className="h-5 w-5" />
              <span className="text-lg">
                {chalet.location?.city}{chalet.location?.country ? `, ${chalet.location.country}` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Résumé en badges sur le hero */}
        <div className="absolute inset-x-0 bottom-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="backdrop-blur bg-white/15 text-white rounded-xl px-4 py-3 flex items-center gap-3">
                <ClientIcon name="Bed" className="h-5 w-5" />
                <div className="text-sm">
                  <div className="font-semibold">{chalet.specifications?.bedrooms || 0}</div>
                  <div className="opacity-90">Chambres</div>
                </div>
              </div>
              <div className="backdrop-blur bg-white/15 text-white rounded-xl px-4 py-3 flex items-center gap-3">
                <ClientIcon name="Bath" className="h-5 w-5" />
                <div className="text-sm">
                  <div className="font-semibold">{chalet.specifications?.bathrooms || 0}</div>
                  <div className="opacity-90">Salles de bain</div>
                </div>
              </div>
              <div className="backdrop-blur bg-white/15 text-white rounded-xl px-4 py-3 flex items-center gap-3">
                <ClientIcon name="Users" className="h-5 w-5" />
                <div className="text-sm">
                  <div className="font-semibold">{chalet.specifications?.maxGuests || 0}</div>
                  <div className="opacity-90">Personnes</div>
                </div>
              </div>
              <div className="backdrop-blur bg-white/15 text-white rounded-xl px-4 py-3 flex items-center gap-3">
                <ClientIcon name="Euro" className="h-5 w-5" />
                <div className="text-sm">
                  <div className="font-semibold">
                    {chalet.pricing?.basePrice ? `${chalet.pricing.basePrice}€` : 'Tarif sur demande'}
                  </div>
                  <div className="opacity-90">Par nuit</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicateur scroll */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 text-white/80">
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Barre d’ancrage sticky sous le hero */}
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-6 h-12 text-sm">
            <a href="#intro" className="text-neutral-700 hover:text-neutral-900">Présentation</a>
            <a href="#gallery" className="text-neutral-700 hover:text-neutral-900">Galerie</a>
            <a href="#amenities" className="text-neutral-700 hover:text-neutral-900">Équipements</a>
            <a href="#location" className="text-neutral-700 hover:text-neutral-900">Autour</a>
            <a href="#booking" className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 text-white hover:bg-black">
              <ClientIcon name="Calendar" className="h-4 w-4" />
              Réserver
            </a>
          </nav>
        </div>
      </div>

      {/* Présentation courte + lire la suite */}
      <section id="intro" className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {chalet.shortDescription && (
            <p className="text-lg text-neutral-800 leading-relaxed mb-4">
              {chalet.shortDescription}
            </p>
          )}
          {descriptionParagraphs.length > 0 ? (
            <details className="group">
              <summary className="list-none cursor-pointer flex items-center gap-2 text-neutral-900 font-semibold">
                <span className="underline decoration-neutral-300 group-open:hidden">Lire la suite</span>
                <span className="hidden group-open:inline">Fermer</span>
              </summary>
              <div className="prose prose-neutral max-w-none mt-4">
                {descriptionParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </details>
          ) : (
            <p className="text-neutral-600">Description à venir.</p>
          )}
        </div>
      </section>

      {/* Galerie (large) */}
      <section id="gallery" className="py-16 sm:py-20 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-8 text-center">Galerie Photos</h2>
          <ChaletGallery images={galleryImages} />
        </div>
      </section>

      {/* Équipements & Services (cartes compactes) */}
      <section id="amenities" className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-8 text-center">Équipements & Services</h2>
          {chalet.amenities && chalet.amenities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {chalet.amenities.map((amenity, index) => {
                const amenityLabel = getAmenityLabel(amenity);
                if (!amenityLabel) return null;
                const amenityDescription = typeof amenity?.description === 'string' ? amenity.description : '';
                const amenityIcon = typeof amenity?.icon === 'string' && amenity.icon.trim() ? amenity.icon : 'Check';
                return (
                  <div key={index} className="p-4 rounded-xl border border-neutral-200 bg-white flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                      <ClientIcon name={amenityIcon} className="h-5 w-5 text-neutral-800" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 leading-snug">{amenityLabel}</h3>
                      {amenityDescription && <p className="text-sm text-neutral-600 mt-1">{amenityDescription}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <ClientIcon name="Home" className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600">Les équipements seront bientôt disponibles</p>
            </div>
          )}
        </div>
      </section>

      {/* Localisation / Autour du bien */}
      <section id="location" className="py-16 sm:py-20 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-8 text-center">Autour du bien</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{chalet.location?.address}</h3>
              <p className="text-neutral-700 mb-6">
                {chalet.location?.city}{chalet.location?.country ? `, ${chalet.location.country}` : ''}
                {chalet.location?.postalCode ? ` ${chalet.location.postalCode}` : ''}
              </p>
              {chalet.location?.coordinates && (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <ClientIcon name="MapPin" className="h-5 w-5 text-neutral-800 mr-3" />
                    <span className="text-neutral-800">
                      Coordonnées: {chalet.location.coordinates.latitude.toFixed(4)}, {chalet.location.coordinates.longitude.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ClientIcon name="Navigation" className="h-5 w-5 text-neutral-800 mr-3" />
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${chalet.location.coordinates.latitude},${chalet.location.coordinates.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-900 underline underline-offset-4"
                    >
                      Obtenir l'itinéraire
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="h-96 rounded-2xl overflow-hidden shadow">
              <ChaletMap
                coordinates={chalet.location?.coordinates}
                title={chalet.title}
                address={chalet.location?.address}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Réservation (CTA section) */}
      <section id="booking" className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-8 text-center">Réservation</h2>
          <ChaletBooking chalet={chalet} />
        </div>
      </section>

      {/* Bandeau contact final */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Des questions ?</h2>
          <p className="text-white/80 mb-8">Notre équipe est là pour vous aider à planifier votre séjour parfait.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-white text-neutral-900 font-semibold hover:bg-neutral-100 inline-flex items-center justify-center"
            >
              <ClientIcon name="Mail" className="mr-2 h-5 w-5" />
              Nous contacter
            </Link>
            <a
              href="tel:+33123456789"
              className="px-6 py-3 rounded-full border border-white/70 text-white hover:bg-white hover:text-neutral-900 inline-flex items-center justify-center"
            >
              <ClientIcon name="Phone" className="mr-2 h-5 w-5" />
              Appeler maintenant
            </a>
          </div>
        </div>
      </section>

      {/* CTA mobile sticky (ancre vers réservation) */}
      <a
        href="#booking"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 md:hidden px-5 py-3 rounded-full bg-neutral-900 text-white font-semibold shadow-lg"
      >
        Réserver
      </a>
    </div>
  );
}