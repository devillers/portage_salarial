/* eslint-disable react/no-unescaped-entities */

import Image from 'next/image';
import Link from 'next/link';
import ClientIcon from '../../components/ClientIcon';
import PageWrapper from '../../components/layout/PageWrapper';
import { buildMetadata } from '../../lib/seo';

export const metadata = buildMetadata({
  title: 'Our Services | Chalet Manager',
  description:
    'Comprehensive chalet management services including rental management, concierge services, maintenance, tax administration, and event planning.',
  path: '/services',
  keywords: [
    'services gestion chalet',
    'conciergerie chalet',
    'maintenance chalet',
    'gestion locative montagne',
  ],
});

export default function ServicesPage() {
  const services = [
    {
      id: 'rental',
      icon: 'Home',
      title: 'Rental Management',
      description: 'Complete end-to-end rental management for maximum occupancy and revenue',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      imageAlt: "Vue intérieure lumineuse d'un chalet de montagne avec espace de vie moderne",
      features: [
        'Dynamic pricing optimization based on market conditions',
        'Professional photography and property listing creation',
        'Multi-platform distribution (Airbnb, Booking.com, direct bookings)',
        'Guest screening and booking management',
        'Automated check-in/check-out processes',
        'Revenue reporting and analytics',
        'Season-specific marketing strategies',
        'Inventory and availability management'
      ],
      benefits: [
        'Average 45% increase in rental income',
        '98% occupancy rate during peak seasons',
        'Reduced vacancy periods',
        'Professional guest communication'
      ]
    },
    {
      id: 'concierge',
      icon: 'Users',
      title: 'Concierge Services',
      description: 'Premium guest services ensuring exceptional experiences throughout their stay',
      image: 'https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg',
      imageAlt: "Service de conciergerie accueillant des clients dans un chalet de luxe",
      features: [
        'Pre-arrival planning and welcome coordination',
        'Local activity recommendations and bookings',
        'Restaurant reservations and event tickets',
        'Transportation arrangements (airport transfers, ski shuttles)',
        'Grocery shopping and pre-stocking services',
        '24/7 emergency support and assistance',
        'Ski equipment rental coordination',
        'Housekeeping and turnover services'
      ],
      benefits: [
        '5-star guest satisfaction ratings',
        'Higher guest retention and referrals',
        'Premium pricing opportunities',
        'Enhanced property reputation'
      ]
    },
    {
      id: 'maintenance',
      icon: 'Wrench',
      title: 'Maintenance & Care',
      description: 'Proactive property maintenance ensuring your chalet remains in pristine condition',
      image: 'https://images.pexels.com/photos/1454804/pexels-photo-1454804.jpeg',
      imageAlt: "Technicien effectuant la maintenance d'un chalet en bois",
      features: [
        'Regular property inspections and preventive maintenance',
        'Emergency repair services and 24/7 support',
        'Seasonal preparations (winterization, spring opening)',
        'Heating, plumbing, and electrical system maintenance',
        'Exterior maintenance (roof, gutters, landscaping)',
        'Interior upkeep and furnishing management',
        'Safety equipment checks and updates',
        'Vendor coordination and quality control'
      ],
      benefits: [
        'Reduced long-term repair costs',
        'Maintained property value',
        'Guest safety and satisfaction',
        'Peace of mind for owners'
      ]
    },
    {
      id: 'tax',
      icon: 'Calculator',
      title: 'Tax Administration',
      description: 'Professional handling of all tax obligations and administrative requirements',
      image: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg',
      imageAlt: "Expert-comptable travaillant sur la fiscalité d'un chalet",
      features: [
        'Tourist tax collection and remittance',
        'Income tax preparation and filing',
        'VAT handling for commercial properties',
        'Local permit and license management',
        'Financial record keeping and documentation',
        'Government correspondence handling',
        'Compliance monitoring and updates',
        'Professional accounting support'
      ],
      benefits: [
        '100% compliance with local regulations',
        'Optimized tax efficiency',
        'Reduced administrative burden',
        'Professional financial documentation'
      ]
    },
    {
      id: 'events',
      icon: 'Calendar',
      title: 'Event Organization',
      description: 'Professional event planning and coordination for special occasions',
      image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
      imageAlt: "Organisation d'un événement corporate dans un chalet alpin",
      features: [
        'Corporate retreat and team building coordination',
        'Wedding and celebration planning',
        'Holiday party and seasonal event organization',
        'Catering and menu planning services',
        'Entertainment and activity coordination',
        'Decoration and ambiance creation',
        'Vendor management and coordination',
        'Timeline planning and event execution'
      ],
      benefits: [
        'Memorable experiences for guests',
        'Additional revenue opportunities',
        'Enhanced property utilization',
        'Professional event execution'
      ]
    }
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Initial Consultation',
      description: 'We assess your property and discuss your goals and expectations for management services.'
    },
    {
      number: '02',
      title: 'Custom Strategy',
      description: 'Develop a tailored management plan based on your property\'s unique characteristics and market position.'
    },
    {
      number: '03',
      title: 'Service Implementation',
      description: 'Begin comprehensive management services with full setup and marketing launch.'
    },
    {
      number: '04',
      title: 'Ongoing Optimization',
      description: 'Continuous monitoring and optimization of all services to maximize performance and satisfaction.'
    }
  ];

  const whyChooseUs = [
    {
      icon: 'Award',
      title: 'Industry Expertise',
      description: '10+ years specializing in luxury chalet management across the French Alps'
    },
    {
      icon: 'TrendingUp',
      title: 'Proven Results',
      description: 'Average 45% revenue increase and 98% guest satisfaction rate'
    },
    {
      icon: 'Shield',
      title: 'Full Insurance',
      description: 'Comprehensive insurance coverage for property and liability protection'
    },
    {
      icon: 'Clock',
      title: '24/7 Support',
      description: 'Round-the-clock availability for emergencies and guest assistance'
    }
  ];

  return (
    <PageWrapper mainClassName="space-y-24 bg-neutral-50 pt-0 md:pt-6 pb-24 md:pb-32">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-neutral-900 text-white shadow-lg sm:mx-6 sm:rounded-3xl">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg"
            alt="Professional chalet management services"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/35"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-10">
          <h1 className="mb-4 text-3xl font-bold md:text-5xl">
            Comprehensive Chalet Management Services
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            From rental optimization to guest services, we handle every aspect of your chalet operation.
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="bg-white py-20 shadow-sm sm:mx-6 sm:rounded-3xl sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Our Core Services
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Each service is designed to maximize your property's potential while ensuring exceptional guest experiences
            </p>
          </div>

          <div className="space-y-20">
            {services.map((service, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={service.id}
                  id={service.id}
                  className={`flex flex-col lg:flex-row items-center gap-12 ${
                    isEven ? '' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Image */}
                  <div className="flex-1">
                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                      <Image
                        src={service.image}
                        alt={service.imageAlt || service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                        <ClientIcon name={service.icon} className="h-6 w-6 text-primary-700" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-neutral-900">
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-neutral-900 mb-4">
                        What's Included:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start">
                            <ClientIcon name="CheckCircle" className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-neutral-700 text-sm">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="bg-primary-50 p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-primary-900 mb-3">
                        Key Benefits:
                      </h4>
                      <ul className="space-y-2">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center text-primary-800">
                            <ClientIcon name="Star" className="h-4 w-4 text-primary-600 mr-2 flex-shrink-0" />
                            <span className="text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose Chalet Manager?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Our commitment to excellence and proven track record make us the preferred choice for discerning property owners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => {
              return (
                <div 
                  key={index}
                  className="text-center p-6 bg-white rounded-2xl border border-neutral-200 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientIcon name={item.icon} className="h-8 w-8 text-primary-700" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Our Process
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              A streamlined approach to get your chalet management up and running quickly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary-700 text-white rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                    {step.number}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-16 w-full h-0.5 bg-primary-200"></div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-neutral-600 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 py-20 text-white shadow-lg sm:mx-6 sm:rounded-3xl">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Chalet Management?
          </h2>
          
          <p className="text-xl text-primary-100 mb-8">
            Let our experienced team take care of everything while you enjoy the returns
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-primary-800 rounded-full font-semibold hover:bg-neutral-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
            >
              Get Free Consultation
              <ClientIcon name="ArrowRight" className="ml-2 h-5 w-5" />
            </Link>
            
            <Link
              href="/portfolio"
              className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-primary-800 transition-all duration-300"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
