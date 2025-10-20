/* eslint-disable react/no-unescaped-entities */

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
    const response = await fetch(`${siteUrl}/api/chalets/${slug}`, {
      next: { revalidate }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching chalet:', error);
    return null;
  }
}

function normalizeImages(images) {
  if (!images) {
    return [];
  }

  if (Array.isArray(images)) {
    return images.filter(image => image && image.url);
  }

  const normalized = [];

  if (images.hero?.url) {
    normalized.push(images.hero);
  }

  if (Array.isArray(images.gallery)) {
    normalized.push(...images.gallery.filter(image => image && image.url));
  }

  Object.entries(images).forEach(([key, value]) => {
    if (key === 'hero' || key === 'gallery') {
      return;
    }

    if (!value) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(item => {
        if (item?.url) {
          normalized.push(item);
        }
      });
      return;
    }

    if (typeof value === 'object' && value.url) {
      normalized.push(value);
    }
  });

  return normalized;
}

function getHeroImage(images) {
  if (!images) {
    return null;
  }

  if (Array.isArray(images)) {
    return images.find(image => image?.isHero) || images.find(image => image?.url) || null;
  }

  if (images.hero?.url) {
    return images.hero;
  }

  if (Array.isArray(images.gallery)) {
    const heroFromGallery = images.gallery.find(image => image?.isHero) || images.gallery.find(image => image?.url);
    if (heroFromGallery) {
      return heroFromGallery;
    }
  }

  const normalized = normalizeImages(images);
  return normalized.length > 0 ? normalized[0] : null;
}

export async function generateMetadata(props) {
  const { params } = await props;
  const { slug } = params;

  const chalet = await getChalet(slug);

  if (!chalet) {
    return {
      title: 'Chalet non trouvé',
    };
  }

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
    : [
        {
          url: seoConstants.DEFAULT_OG_IMAGE,
          alt: metaTitle,
          width: 1200,
          height: 630,
        },
      ];

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: pagePath,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      url: pageUrl,
      images: openGraphImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [openGraphImages[0]?.url ?? seoConstants.DEFAULT_OG_IMAGE],
    },
  };
}

export default async function ChaletPage(props) {
  const { params } = await props;
  const { slug } = params;

  const chalet = await getChalet(slug);

  if (!chalet) {
    notFound();
  }

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
          return name
            ? {
                '@type': 'LocationFeatureSpecification',
                name,
              }
            : null;
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
  };

  if (imageUrls.length > 0) {
    accommodationSchema.image = imageUrls;
  }

  if (chalet.location) {
    accommodationSchema.address = {
      '@type': 'PostalAddress',
      streetAddress: chalet.location.address,
      addressLocality: chalet.location.city,
      postalCode: chalet.location.postalCode,
      addressCountry: chalet.location.country,
    };

    if (chalet.location.coordinates) {
      accommodationSchema.geo = {
        '@type': 'GeoCoordinates',
        latitude: chalet.location.coordinates.latitude,
        longitude: chalet.location.coordinates.longitude,
      };
    }
  }

  if (chalet.pricing?.basePrice) {
    accommodationSchema.priceRange = `€${Number(chalet.pricing.basePrice).toFixed(0)} par nuit`;
  }

  if (chalet.specifications) {
    accommodationSchema.numberOfRooms = chalet.specifications.bedrooms;
    accommodationSchema.numberOfBedrooms = chalet.specifications.bedrooms;
    accommodationSchema.numberOfBathroomsTotal = chalet.specifications.bathrooms;

    if (chalet.specifications.maxGuests) {
      accommodationSchema.occupancy = {
        '@type': 'QuantitativeValue',
        maxValue: chalet.specifications.maxGuests,
        unitCode: 'C62',
      };
    }
  }

  if (amenityFeatures.length > 0) {
    accommodationSchema.amenityFeature = amenityFeatures;
  }

  if (chalet.contact?.phone || chalet.contact?.email) {
    accommodationSchema.contactPoint = {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: chalet.contact.phone,
      email: chalet.contact.email,
    };
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Portfolio',
        item: `${siteUrl}/portfolio`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: chalet.title,
        item: pageUrl,
      },
    ],
  };

  const structuredData = [accommodationSchema, breadcrumbSchema];

  return (
    <div className="min-h-screen bg-white">
      <script
        key="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 text-primary-800 hover:text-primary-900">
              <ClientIcon name="Mountain" className="h-6 w-6" />
              <span className="font-bold">Chalet Manager</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              <a href="#overview" className="text-neutral-600 hover:text-primary-700 transition-colors">
                Aperçu
              </a>
              <a href="#gallery" className="text-neutral-600 hover:text-primary-700 transition-colors">
                Galerie
              </a>
              <a href="#amenities" className="text-neutral-600 hover:text-primary-700 transition-colors">
                Équipements
              </a>
              <a href="#booking" className="text-neutral-600 hover:text-primary-700 transition-colors">
                Réserver
              </a>
              <a href="#location" className="text-neutral-600 hover:text-primary-700 transition-colors">
                Localisation
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="overview" className="relative h-screen flex items-center justify-center text-white overflow-hidden mt-16">
        {heroImage && (
          <>
            <div className="absolute inset-0 z-0">
              <Image
                src={heroImage.url}
                alt={heroImage.alt || chalet.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
          </>
        )}

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {chalet.title}
          </h1>
          
          <div className="flex items-center justify-center text-white/90 mb-6">
            <ClientIcon name="MapPin" className="h-5 w-5 mr-2" />
            <span className="text-lg">
              {chalet.location.city}, {chalet.location.country}
            </span>
          </div>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
            {chalet.shortDescription}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#booking"
              className="px-8 py-4 bg-primary-700 text-white rounded-full font-semibold hover:bg-primary-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center"
            >
              <ClientIcon name="Calendar" className="mr-2 h-5 w-5" />
              Réserver Maintenant
            </a>
            
            <a
              href="#gallery"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
            >
              Voir la Galerie
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-12 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ClientIcon name="Bed" className="h-6 w-6 text-primary-700" />
              </div>
              <div className="text-2xl font-bold text-neutral-900">
                {chalet.specifications?.bedrooms || 0}
              </div>
              <div className="text-sm text-neutral-600">Chambres</div>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ClientIcon name="Bath" className="h-6 w-6 text-primary-700" />
              </div>
              <div className="text-2xl font-bold text-neutral-900">
                {chalet.specifications?.bathrooms || 0}
              </div>
              <div className="text-sm text-neutral-600">Salles de bain</div>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ClientIcon name="Users" className="h-6 w-6 text-primary-700" />
              </div>
              <div className="text-2xl font-bold text-neutral-900">
                {chalet.specifications?.maxGuests || 0}
              </div>
              <div className="text-sm text-neutral-600">Personnes</div>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ClientIcon name="Euro" className="h-6 w-6 text-primary-700" />
              </div>
              <div className="text-2xl font-bold text-neutral-900">
                {chalet.pricing?.basePrice || 0}€
              </div>
              <div className="text-sm text-neutral-600">Par nuit</div>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            À Propos de ce Chalet
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed">
            {descriptionParagraphs.length > 0 ? (
              descriptionParagraphs.map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="mb-4">Description à venir.</p>
            )}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">
            Galerie Photos
          </h2>
          
          <ChaletGallery images={galleryImages} />
        </div>
      </section>

      {/* Amenities */}
      <section id="amenities" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">
            Équipements & Services
          </h2>
          
          {chalet.amenities && chalet.amenities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chalet.amenities.map((amenity, index) => {
                const amenityLabel = getAmenityLabel(amenity);
                if (!amenityLabel) {
                  return null;
                }

                const amenityDescription = typeof amenity?.description === 'string' ? amenity.description : '';
                const amenityIcon = typeof amenity?.icon === 'string' && amenity.icon.trim() ? amenity.icon : 'Check';

                return (
                  <div key={index} className="flex items-center p-4 bg-white rounded-lg border border-neutral-200">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                      <ClientIcon name={amenityIcon} className="h-5 w-5 text-primary-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">
                        {amenityLabel}
                      </h3>
                      {amenityDescription && (
                        <p className="text-sm text-neutral-600">
                          {amenityDescription}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <ClientIcon name="Home" className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600">
                Les équipements seront bientôt disponibles
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">
            Réservation
          </h2>
          
          <ChaletBooking chalet={chalet} />
        </div>
      </section>

      {/* Location */}
      <section id="location" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">
            Localisation
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">
                {chalet.location.address}
              </h3>
              <p className="text-neutral-600 mb-6">
                {chalet.location.city}, {chalet.location.country}
                {chalet.location.postalCode && ` ${chalet.location.postalCode}`}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <ClientIcon name="MapPin" className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="text-neutral-700">
                    Coordonnées: {chalet.location.coordinates.latitude.toFixed(4)}, {chalet.location.coordinates.longitude.toFixed(4)}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <ClientIcon name="Navigation" className="h-5 w-5 text-primary-600 mr-3" />
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${chalet.location.coordinates.latitude},${chalet.location.coordinates.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-700 hover:text-primary-800 font-medium"
                  >
                    Obtenir l'itinéraire
                  </a>
                </div>
              </div>
            </div>
            
            <div className="h-96 rounded-2xl overflow-hidden shadow-lg">
              <ChaletMap 
                coordinates={chalet.location.coordinates}
                title={chalet.title}
                address={chalet.location.address}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-primary-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">
            Des Questions ?
          </h2>
          
          <p className="text-xl text-primary-100 mb-8">
            Notre équipe est là pour vous aider à planifier votre séjour parfait
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-primary-800 rounded-full font-semibold hover:bg-neutral-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
            >
              <ClientIcon name="Mail" className="mr-2 h-5 w-5" />
              Nous Contacter
            </Link>
            
            <a
              href="tel:+33123456789"
              className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-primary-800 transition-all duration-300 flex items-center justify-center"
            >
              <ClientIcon name="Phone" className="mr-2 h-5 w-5" />
              Appeler Maintenant
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}