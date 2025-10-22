// /* eslint-disable react/no-unescaped-entities */

// import { notFound } from 'next/navigation';
// import Image from 'next/image';
// import Link from 'next/link';
// import ClientIcon from '../../../components/ClientIcon';
// import ChaletBooking from '../../../components/chalet/ChaletBooking';
// import ChaletMap from '../../../components/chalet/ChaletMap';
// import ChaletGallery from '../../../components/chalet/ChaletGallery';
// import { getSiteUrl, seoConstants } from '../../../lib/seo';

// export const revalidate = 3600;

// function getAmenityLabel(amenity) {
//   if (!amenity) return '';
//   if (typeof amenity === 'string') return amenity;
//   if (typeof amenity?.name === 'string') return amenity.name;
//   if (typeof amenity?.description === 'string') return amenity.description;
//   return '';
// }

// async function getChalet(slug) {
//   const siteUrl = getSiteUrl();

//   try {
//     const response = await fetch(`${siteUrl}/api/chalets/${slug}`, {
//       next: { revalidate }
//     });

//     if (!response.ok) {
//       return null;
//     }

//     const data = await response.json();
//     return data.success ? data.data : null;
//   } catch (error) {
//     console.error('Error fetching chalet:', error);
//     return null;
//   }
// }

// function normalizeImages(images) {
//   if (!images) {
//     return [];
//   }

//   if (Array.isArray(images)) {
//     return images.filter(image => image && image.url);
//   }

//   const normalized = [];

//   if (images.hero?.url) {
//     normalized.push(images.hero);
//   }

//   if (Array.isArray(images.gallery)) {
//     normalized.push(...images.gallery.filter(image => image && image.url));
//   }

//   Object.entries(images).forEach(([key, value]) => {
//     if (key === 'hero' || key === 'gallery') {
//       return;
//     }

//     if (!value) {
//       return;
//     }

//     if (Array.isArray(value)) {
//       value.forEach(item => {
//         if (item?.url) {
//           normalized.push(item);
//         }
//       });
//       return;
//     }

//     if (typeof value === 'object' && value.url) {
//       normalized.push(value);
//     }
//   });

//   return normalized;
// }

// function getHeroImage(images) {
//   if (!images) {
//     return null;
//   }

//   if (Array.isArray(images)) {
//     return images.find(image => image?.isHero) || images.find(image => image?.url) || null;
//   }

//   if (images.hero?.url) {
//     return images.hero;
//   }

//   if (Array.isArray(images.gallery)) {
//     const heroFromGallery = images.gallery.find(image => image?.isHero) || images.gallery.find(image => image?.url);
//     if (heroFromGallery) {
//       return heroFromGallery;
//     }
//   }

//   const normalized = normalizeImages(images);
//   return normalized.length > 0 ? normalized[0] : null;
// }

// export async function generateMetadata(props) {
//   const { slug } = await props.params;

//   const chalet = await getChalet(slug);

//   if (!chalet) {
//     return {
//       title: 'Chalet non trouvé',
//     };
//   }

//   const siteUrl = getSiteUrl();
//   const pagePath = `/chalet/${slug}`;
//   const pageUrl = `${siteUrl}${pagePath}`;
//   const normalizedImages = normalizeImages(chalet.images);
//   const metaTitle = chalet.seo?.metaTitle || `${chalet.title} | Chalet Manager`;
//   const metaDescription = chalet.seo?.metaDescription || chalet.shortDescription || chalet.description;
//   const keywords = Array.isArray(chalet.seo?.keywords) ? chalet.seo.keywords : [];

//   const openGraphImages = normalizedImages.length > 0
//     ? normalizedImages.map(image => ({
//         url: image.url,
//         alt: image.alt || chalet.title,
//         width: image.width || 1200,
//         height: image.height || 800,
//       }))
//     : [
//         {
//           url: seoConstants.DEFAULT_OG_IMAGE,
//           alt: metaTitle,
//           width: 1200,
//           height: 630,
//         },
//       ];

//   return {
//     title: metaTitle,
//     description: metaDescription,
//     keywords: keywords.length > 0 ? keywords : undefined,
//     alternates: {
//       canonical: pagePath,
//     },
//     openGraph: {
//       title: metaTitle,
//       description: metaDescription,
//       type: 'article',
//       url: pageUrl,
//       images: openGraphImages,
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: metaTitle,
//       description: metaDescription,
//       images: [openGraphImages[0]?.url ?? seoConstants.DEFAULT_OG_IMAGE],
//     },
//   };
// }

// export default async function ChaletPage(props) {
//   const { slug } = await props.params;

//   const chalet = await getChalet(slug);

//   if (!chalet) {
//     notFound();
//   }

//   const heroImage = getHeroImage(chalet.images);
//   const galleryImages = normalizeImages(chalet.images);
//   const descriptionParagraphs = typeof chalet.description === 'string'
//     ? chalet.description.split('\n').filter(Boolean)
//     : [];
//   const metaDescription = chalet.shortDescription || descriptionParagraphs.join(' ') || '';
//   const siteUrl = getSiteUrl();
//   const pageUrl = `${siteUrl}/chalet/${slug}`;
//   const amenityFeatures = Array.isArray(chalet.amenities)
//     ? chalet.amenities
//         .map(amenity => {
//           const name = getAmenityLabel(amenity);
//           return name
//             ? {
//                 '@type': 'LocationFeatureSpecification',
//                 name,
//               }
//             : null;
//         })
//         .filter(Boolean)
//     : [];

//   const imageUrls = galleryImages.map(image => image.url).filter(Boolean);
//   const accommodationSchema = {
//     '@context': 'https://schema.org',
//     '@type': 'Accommodation',
//     name: chalet.title,
//     description: metaDescription,
//     url: pageUrl,
//   };

//   if (imageUrls.length > 0) {
//     accommodationSchema.image = imageUrls;
//   }

//   if (chalet.location) {
//     accommodationSchema.address = {
//       '@type': 'PostalAddress',
//       streetAddress: chalet.location.address,
//       addressLocality: chalet.location.city,
//       postalCode: chalet.location.postalCode,
//       addressCountry: chalet.location.country,
//     };

//     if (chalet.location.coordinates) {
//       accommodationSchema.geo = {
//         '@type': 'GeoCoordinates',
//         latitude: chalet.location.coordinates.latitude,
//         longitude: chalet.location.coordinates.longitude,
//       };
//     }
//   }

//   if (chalet.pricing?.basePrice) {
//     accommodationSchema.priceRange = `€${Number(chalet.pricing.basePrice).toFixed(0)} par nuit`;
//   }

//   if (chalet.specifications) {
//     accommodationSchema.numberOfRooms = chalet.specifications.bedrooms;
//     accommodationSchema.numberOfBedrooms = chalet.specifications.bedrooms;
//     accommodationSchema.numberOfBathroomsTotal = chalet.specifications.bathrooms;

//     if (chalet.specifications.maxGuests) {
//       accommodationSchema.occupancy = {
//         '@type': 'QuantitativeValue',
//         maxValue: chalet.specifications.maxGuests,
//         unitCode: 'C62',
//       };
//     }
//   }

//   if (amenityFeatures.length > 0) {
//     accommodationSchema.amenityFeature = amenityFeatures;
//   }

//   if (chalet.contact?.phone || chalet.contact?.email) {
//     accommodationSchema.contactPoint = {
//       '@type': 'ContactPoint',
//       contactType: 'customer service',
//       telephone: chalet.contact.phone,
//       email: chalet.contact.email,
//     };
//   }

//   const breadcrumbSchema = {
//     '@context': 'https://schema.org',
//     '@type': 'BreadcrumbList',
//     itemListElement: [
//       {
//         '@type': 'ListItem',
//         position: 1,
//         name: 'Accueil',
//         item: siteUrl,
//       },
//       {
//         '@type': 'ListItem',
//         position: 2,
//         name: 'Portfolio',
//         item: `${siteUrl}/portfolio`,
//       },
//       {
//         '@type': 'ListItem',
//         position: 3,
//         name: chalet.title,
//         item: pageUrl,
//       },
//     ],
//   };

//   const structuredData = [accommodationSchema, breadcrumbSchema];

//   return (
//     <div className="min-h-screen bg-white">
//       <script
//         key="structured-data"
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
//       />
//       {/* Navigation */}
//       <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <Link href="/" className="flex items-center space-x-2 text-primary-800 hover:text-primary-900">
//               <ClientIcon name="Mountain" className="h-6 w-6" />
//               <span className="font-bold">Chalet Manager</span>
//             </Link>
            
//             <div className="flex items-center space-x-6">
//               <a href="#overview" className="text-neutral-600 hover:text-primary-700 transition-colors">
//                 Aperçu
//               </a>
//               <a href="#gallery" className="text-neutral-600 hover:text-primary-700 transition-colors">
//                 Galerie
//               </a>
//               <a href="#amenities" className="text-neutral-600 hover:text-primary-700 transition-colors">
//                 Équipements
//               </a>
//               <a href="#booking" className="text-neutral-600 hover:text-primary-700 transition-colors">
//                 Réserver
//               </a>
//               <a href="#location" className="text-neutral-600 hover:text-primary-700 transition-colors">
//                 Localisation
//               </a>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section id="overview" className="relative h-screen flex items-center justify-center text-white overflow-hidden mt-16">
//         {heroImage && (
//           <>
//             <div className="absolute inset-0 z-0">
//               <Image
//                 src={heroImage.url}
//                 alt={heroImage.alt || chalet.title}
//                 fill
//                 className="object-cover"
//                 priority
//               />
//               <div className="absolute inset-0 bg-black/30"></div>
//             </div>
//           </>
//         )}

//         <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h1 className="text-4xl md:text-6xl font-bold mb-6">
//             {chalet.title}
//           </h1>
          
//           <div className="flex items-center justify-center text-white/90 mb-6">
//             <ClientIcon name="MapPin" className="h-5 w-5 mr-2" />
//             <span className="text-lg">
//               {chalet.location.city}, {chalet.location.country}
//             </span>
//           </div>
          
//           <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
//             {chalet.shortDescription}
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <a
//               href="#booking"
//               className="px-8 py-4 bg-primary-700 text-white rounded-full font-semibold hover:bg-primary-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center"
//             >
//               <ClientIcon name="Calendar" className="mr-2 h-5 w-5" />
//               Réserver Maintenant
//             </a>
            
//             <a
//               href="#gallery"
//               className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
//             >
//               Voir la Galerie
//             </a>
//           </div>
//         </div>

//         {/* Scroll Indicator */}
//         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
//           <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
//             <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
//           </div>
//         </div>
//       </section>

//       {/* Quick Info */}
//       <section className="py-12 bg-white border-b border-neutral-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//             <div>
//               <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <ClientIcon name="Bed" className="h-6 w-6 text-primary-700" />
//               </div>
//               <div className="text-2xl font-bold text-neutral-900">
//                 {chalet.specifications?.bedrooms || 0}
//               </div>
//               <div className="text-sm text-neutral-600">Chambres</div>
//             </div>
            
//             <div>
//               <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <ClientIcon name="Bath" className="h-6 w-6 text-primary-700" />
//               </div>
//               <div className="text-2xl font-bold text-neutral-900">
//                 {chalet.specifications?.bathrooms || 0}
//               </div>
//               <div className="text-sm text-neutral-600">Salles de bain</div>
//             </div>
            
//             <div>
//               <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <ClientIcon name="Users" className="h-6 w-6 text-primary-700" />
//               </div>
//               <div className="text-2xl font-bold text-neutral-900">
//                 {chalet.specifications?.maxGuests || 0}
//               </div>
//               <div className="text-sm text-neutral-600">Personnes</div>
//             </div>
            
//             <div>
//               <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <ClientIcon name="Euro" className="h-6 w-6 text-primary-700" />
//               </div>
//               <div className="text-2xl font-bold text-neutral-900">
//                 {chalet.pricing?.basePrice || 0}€
//               </div>
//               <div className="text-sm text-neutral-600">Par nuit</div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Description */}
//       <section className="py-20 bg-neutral-50">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
//             À Propos de ce Chalet
//           </h2>
          
//           <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed">
//             {descriptionParagraphs.length > 0 ? (
//               descriptionParagraphs.map((paragraph, index) => (
//                 <p key={index} className="mb-4">
//                   {paragraph}
//                 </p>
//               ))
//             ) : (
//               <p className="mb-4">Description à venir.</p>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Gallery */}
//       <section id="gallery" className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">
//             Galerie Photos
//           </h2>
          
//           <ChaletGallery images={galleryImages} />
//         </div>
//       </section>

//       {/* Amenities */}
//       <section id="amenities" className="py-20 bg-neutral-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">
//             Équipements & Services
//           </h2>
          
//           {chalet.amenities && chalet.amenities.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {chalet.amenities.map((amenity, index) => {
//                 const amenityLabel = getAmenityLabel(amenity);
//                 if (!amenityLabel) {
//                   return null;
//                 }

//                 const amenityDescription = typeof amenity?.description === 'string' ? amenity.description : '';
//                 const amenityIcon = typeof amenity?.icon === 'string' && amenity.icon.trim() ? amenity.icon : 'Check';

//                 return (
//                   <div key={index} className="flex items-center p-4 bg-white rounded-lg border border-neutral-200">
//                     <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
//                       <ClientIcon name={amenityIcon} className="h-5 w-5 text-primary-700" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-neutral-900">
//                         {amenityLabel}
//                       </h3>
//                       {amenityDescription && (
//                         <p className="text-sm text-neutral-600">
//                           {amenityDescription}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <ClientIcon name="Home" className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
//               <p className="text-neutral-600">
//                 Les équipements seront bientôt disponibles
//               </p>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Booking Section */}
//       <section id="booking" className="py-20 bg-white">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">
//             Réservation
//           </h2>
          
//           <ChaletBooking chalet={chalet} />
//         </div>
//       </section>

//       {/* Location */}
//       <section id="location" className="py-20 bg-neutral-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">
//             Localisation
//           </h2>
          
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <h3 className="text-xl font-bold text-neutral-900 mb-4">
//                 {chalet.location.address}
//               </h3>
//               <p className="text-neutral-600 mb-6">
//                 {chalet.location.city}, {chalet.location.country}
//                 {chalet.location.postalCode && ` ${chalet.location.postalCode}`}
//               </p>
              
//               <div className="space-y-4">
//                 <div className="flex items-center">
//                   <ClientIcon name="MapPin" className="h-5 w-5 text-primary-600 mr-3" />
//                   <span className="text-neutral-700">
//                     Coordonnées: {chalet.location.coordinates.latitude.toFixed(4)}, {chalet.location.coordinates.longitude.toFixed(4)}
//                   </span>
//                 </div>
                
//                 <div className="flex items-center">
//                   <ClientIcon name="Navigation" className="h-5 w-5 text-primary-600 mr-3" />
//                   <a
//                     href={`https://www.google.com/maps/dir/?api=1&destination=${chalet.location.coordinates.latitude},${chalet.location.coordinates.longitude}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-primary-700 hover:text-primary-800 font-medium"
//                   >
//                     Obtenir l'itinéraire
//                   </a>
//                 </div>
//               </div>
//             </div>
            
//             <div className="h-96 rounded-2xl overflow-hidden shadow-lg">
//               <ChaletMap 
//                 coordinates={chalet.location.coordinates}
//                 title={chalet.title}
//                 address={chalet.location.address}
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Contact */}
//       <section className="py-20 bg-primary-800 text-white">
//         <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold mb-6">
//             Des Questions ?
//           </h2>
          
//           <p className="text-xl text-primary-100 mb-8">
//             Notre équipe est là pour vous aider à planifier votre séjour parfait
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link
//               href="/contact"
//               className="px-8 py-4 bg-white text-primary-800 rounded-full font-semibold hover:bg-neutral-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
//             >
//               <ClientIcon name="Mail" className="mr-2 h-5 w-5" />
//               Nous Contacter
//             </Link>
            
//             <a
//               href="tel:+33123456789"
//               className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-primary-800 transition-all duration-300 flex items-center justify-center"
//             >
//               <ClientIcon name="Phone" className="mr-2 h-5 w-5" />
//               Appeler Maintenant
//             </a>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }



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