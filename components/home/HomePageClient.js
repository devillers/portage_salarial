'use client';

/* eslint-disable react/no-unescaped-entities */

import Link from 'next/link';
import Image from 'next/image';
import ClientIcon from '../ClientIcon';
import PageWrapper from '../layout/PageWrapper';
import { useTranslation } from '../providers/LanguageProvider';

export default function HomePageClient() {
  const { content: home } = useTranslation('home');
  const hero = home.hero ?? {};
  const features = home.features ?? {};
  const services = home.services ?? {};
  const stats = home.stats ?? {};
  const testimonials = home.testimonials ?? {};
  const cta = home.cta ?? {};

  return (
    <PageWrapper mainClassName="space-y-24 bg-neutral-50 pt-0 md:pt-0 pb-24 md:pb-32">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden rounded-none text-white sm:rounded-3xl sm:mx-6 sm:mt-12">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg"
            alt={hero.backgroundAlt || 'Chalet de montagne de luxe entouré de neige'}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-10">
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
            {hero.title}
            <span className="block text-primary-200">{hero.highlight}</span>
          </h1>

          <p
            className="mx-auto mb-10 max-w-2xl text-lg text-white/90 md:text-xl"
            style={{ animationDelay: '0.2s' }}
          >
            {hero.description}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/portfolio"
              className="flex items-center justify-center rounded-full bg-primary-700 px-8 py-4 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-primary-800 hover:shadow-2xl"
            >
              {hero.primaryCta}
              <ClientIcon name="ArrowRight" className="ml-2 h-5 w-5" />
            </Link>

            <Link
              href="/contact"
              className="rounded-full border border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20"
            >
              {hero.secondaryCta}
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 transform animate-bounce sm:block">
          <div className="flex h-12 w-7 items-center justify-center rounded-full border-2 border-white/50">
            <div className="mt-2 h-3 w-1 rounded-full bg-white/50"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 shadow-sm sm:rounded-3xl sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              {features.title}
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              {features.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.items?.map((feature, index) => {
              return (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl border border-neutral-200 hover:border-primary-200 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                    <ClientIcon name={feature.icon} className="h-8 w-8 text-primary-700" />
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900 mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="bg-neutral-50 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              {services.title}
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              {services.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.items?.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.imageAlt ?? service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    {service.description}
                  </p>
                  <Link
                    href="/services"
                    className="text-primary-700 font-semibold hover:text-primary-800 transition-colors duration-200 flex items-center"
                  >
                    {services.learnMore}
                    <ClientIcon name="ArrowRight" className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="px-8 py-4 bg-primary-700 text-white rounded-full font-semibold hover:bg-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center"
            >
              {services.cta}
              <ClientIcon name="ArrowRight" className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-0 bg-primary-800 py-20 text-white shadow-xl sm:mx-6 sm:rounded-3xl sm:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {stats.title}
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              {stats.description}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.items?.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-primary-200">
                  {stat.value}
                </div>
                <p className="text-primary-100">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20 sm:rounded-3xl sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              {testimonials.title}
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              {testimonials.description}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.items?.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-3xl border border-neutral-200 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-primary-100">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                    <p className="text-sm text-neutral-500">{testimonial.role}</p>
                  </div>
                </div>

                <p className="text-lg text-neutral-600 leading-relaxed">
                  “{testimonial.quote}”
                </p>

                <div className="mt-6 flex items-center gap-1 text-primary-500">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <ClientIcon
                      key={starIndex}
                      name={starIndex < testimonial.rating ? 'Star' : 'Star'}
                      className={`h-5 w-5 ${starIndex < testimonial.rating ? 'text-primary-500' : 'text-neutral-300'}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-900 py-20 text-white sm:mx-6 sm:rounded-3xl sm:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {cta.title}
          </h2>
          <p className="text-xl text-primary-100 mb-10">
            {cta.description}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-full bg-white px-8 py-4 font-semibold text-primary-900 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-primary-100"
            >
              {cta.primaryCta}
            </Link>
            <Link
              href="/portfolio"
              className="rounded-full border border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20"
            >
              {cta.secondaryCta}
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
