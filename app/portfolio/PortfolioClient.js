'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import ClientIcon from '../../components/ClientIcon';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export default function PortfolioClient() {
  const [chalets, setChalets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/chalets', { cache: 'no-store' });
        const data = await res.json();
        if (data?.success && Array.isArray(data.data)) {
          setChalets(data.data);
        } else {
          setChalets([]);
        }
      } catch (e) {
        console.error('Error fetching chalets:', e);
        setChalets([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredChalets = useMemo(() => {
    return (chalets || [])
      .filter((chalet) => {
        const title = chalet?.title ?? '';
        const city = chalet?.location?.city ?? '';
        const basePrice = Number(chalet?.pricing?.basePrice ?? 0);

        const matchesSearch =
          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          city.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesLocation = !locationFilter || city === locationFilter;

        const matchesPrice =
          !priceFilter ||
          (priceFilter === 'low' && basePrice < 200) ||
          (priceFilter === 'medium' && basePrice >= 200 && basePrice < 500) ||
          (priceFilter === 'high' && basePrice >= 500);

        return matchesSearch && matchesLocation && matchesPrice;
      })
      .sort((a, b) => {
        const pa = Number(a?.pricing?.basePrice ?? 0);
        const pb = Number(b?.pricing?.basePrice ?? 0);
        switch (sortBy) {
          case 'price-low':
            return pa - pb;
          case 'price-high':
            return pb - pa;
          case 'name':
            return (a?.title ?? '').localeCompare(b?.title ?? '');
          case 'featured':
          default:
            // booleans sort: true = 1, false = 0
            return Number(b?.featured ?? 0) - Number(a?.featured ?? 0);
        }
      });
  }, [chalets, searchTerm, locationFilter, priceFilter, sortBy]);

  const locations = useMemo(() => {
    const set = new Set(
      (chalets || [])
        .map((c) => c?.location?.city)
        .filter(Boolean)
    );
    return [...set];
  }, [chalets]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-700" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center text-white overflow-hidden mt-16 md:mt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg"
            alt="Portfolio de chalets de luxe dans les Alpes"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Notre Portfolio</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Découvrez nos chalets gérés dans les plus belles stations des Alpes
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <ClientIcon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher un chalet ou une destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Toutes les destinations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Tous les prix</option>
                <option value="low">Moins de 200€/nuit</option>
                <option value="medium">200€ - 500€/nuit</option>
                <option value="high">Plus de 500€/nuit</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="featured">Mis en avant</option>
                <option value="name">Nom A-Z</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredChalets.length === 0 ? (
            <div className="text-center py-16">
              <ClientIcon name="Home" className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Aucun chalet trouvé</h3>
              <p className="text-neutral-600">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {filteredChalets.length} Chalet{filteredChalets.length > 1 ? 's' : ''} Disponible{filteredChalets.length > 1 ? 's' : ''}
                </h2>
                <p className="text-xl text-neutral-600">
                  Propriétés de luxe avec services complets de gestion
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredChalets.map((chalet) => (
                  <ChaletCard key={chalet?._id ?? chalet?.slug} chalet={chalet} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function getThumbnailImage(chalet) {
  const images = chalet?.images;

  if (!images) {
    return null;
  }

  // Array of images coming directly from the API
  if (Array.isArray(images)) {
    return images.find((img) => img?.isHero) || images[0] || null;
  }

  // Mongoose schema stores images as { hero: {}, gallery: [] }
  if (images.hero?.url) {
    return images.hero;
  }

  if (Array.isArray(images.gallery) && images.gallery.length > 0) {
    return images.gallery[0];
  }

  // Fallback in case another keyed object structure is received
  const firstImageWithUrl = Object.values(images).find((value) => {
    if (!value) return false;

    if (Array.isArray(value)) {
      return value.some((item) => item?.url);
    }

    return typeof value === 'object' && value.url;
  });

  if (!firstImageWithUrl) {
    return null;
  }

  if (Array.isArray(firstImageWithUrl)) {
    return firstImageWithUrl.find((item) => item?.url) || null;
  }

  return firstImageWithUrl;
}

function ChaletCard({ chalet }) {
  const heroImage = getThumbnailImage(chalet);
  const heroAlt = heroImage?.alt || chalet?.title || 'Chalet';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        {heroImage?.url ? (
          <Image
            src={heroImage.url}
            alt={heroAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
            <ClientIcon name="Home" className="h-16 w-16 text-neutral-400" />
          </div>
        )}

        {chalet?.featured ? (
          <div className="absolute top-4 left-4 bg-primary-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Coup de cœur
          </div>
        ) : null}

        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-neutral-900">
          €{Number(chalet?.pricing?.basePrice ?? 0)}/nuit
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-700 transition-colors">
            {chalet?.title ?? 'Chalet'}
          </h3>
          <div className="flex items-center text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <ClientIcon key={i} name="Star" className="h-4 w-4 fill-current" />
            ))}
          </div>
        </div>

        <div className="flex items-center text-neutral-600 mb-3">
          <ClientIcon name="MapPin" className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {(chalet?.location?.city ?? '—')}, {(chalet?.location?.country ?? '')}
          </span>
        </div>

        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
          {chalet?.shortDescription || chalet?.description || ''}
        </p>

        {/* Specifications */}
        <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4">
          <div className="flex items-center">
            <ClientIcon name="Bed" className="h-4 w-4 mr-1" />
            <span>{Number(chalet?.specifications?.bedrooms ?? 0)} ch.</span>
          </div>
          <div className="flex items-center">
            <ClientIcon name="Bath" className="h-4 w-4 mr-1" />
            <span>{Number(chalet?.specifications?.bathrooms ?? 0)} sdb</span>
          </div>
          <div className="flex items-center">
            <ClientIcon name="Users" className="h-4 w-4 mr-1" />
            <span>{Number(chalet?.specifications?.maxGuests ?? 0)} pers.</span>
          </div>
        </div>

        {/* Amenities Preview */}
        {Array.isArray(chalet?.amenities) && chalet.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {chalet.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
              >
                {amenity?.name ?? amenity}
              </span>
            ))}
            {chalet.amenities.length > 3 && (
              <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                +{chalet.amenities.length - 3} autres
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/chalet/${chalet?.slug ?? ''}`}
            className="flex-1 px-4 py-2 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors text-center"
          >
            Voir le chalet
          </Link>

          {chalet?.contact?.website && (
            <a
              href={chalet.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-primary-700 text-primary-700 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center"
            >
              <ClientIcon name="ExternalLink" className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
