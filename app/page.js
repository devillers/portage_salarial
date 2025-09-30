import Link from 'next/link';
import Image from 'next/image';
import ClientIcon from '../components/ClientIcon';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export const metadata = {
  title: 'Premium Chalet Management Services | Chalet Manager',
  description: 'Transform your chalet into a profitable venture with our comprehensive management services. From guest relations to maintenance, we handle everything.',
};

export default function HomePage() {
  const features = [
    {
      icon: 'Users',
      title: 'Guest Relations',
      description: 'Professional concierge services ensuring exceptional guest experiences from arrival to departure.'
    },
    {
      icon: 'Award',
      title: 'Premium Service',
      description: 'White-glove service standards with attention to every detail for discerning property owners.'
    },
    {
      icon: 'TrendingUp',
      title: 'Revenue Optimization',
      description: 'Strategic pricing and marketing to maximize your rental income throughout all seasons.'
    }
  ];

  const services = [
    {
      title: 'Rental Management',
      description: 'Complete rental management including booking coordination, guest communication, and revenue optimization.',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'
    },
    {
      title: 'Concierge Services',
      description: 'Premium concierge services providing guests with local recommendations, activity bookings, and personalized assistance.',
      image: 'https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg'
    },
    {
      title: 'Maintenance & Care',
      description: 'Proactive maintenance and care ensuring your property remains in pristine condition year-round.',
      image: 'https://images.pexels.com/photos/1454804/pexels-photo-1454804.jpeg'
    }
  ];

  const testimonials = [
    {
      name: 'Marie Dubois',
      location: 'Courchevel',
      rating: 5,
      text: 'Exceptional service! They transformed our chalet management completely. Revenue increased by 40% in the first year while maintaining the highest quality standards.'
    },
    {
      name: 'James Wilson',
      location: 'Chamonix',
      rating: 5,
      text: 'Professional, reliable, and truly care about maximizing our investment. The concierge services are outstanding - guests consistently praise the experience.'
    },
    {
      name: 'Sophie Laurent',
      location: 'Val d\'Isère',
      rating: 5,
      text: 'Working through portage salarial gives us complete peace of mind. All administrative tasks are handled professionally while we maintain full autonomy.'
    }
  ];

  const stats = [
    { number: '150+', label: 'Chalets Managed' },
    { number: '5000+', label: 'Happy Guests' },
    { number: '98%', label: 'Satisfaction Rate' },
    { number: '45%', label: 'Avg. Revenue Increase' }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg"
            alt="Luxury mountain chalet in snowy landscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
            Premium Chalet
            <span className="block text-primary-300">Management</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
            Transform your mountain property into a profitable venture with our comprehensive management services
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.4s'}}>
            <Link
              href="/portfolio"
              className="px-8 py-4 bg-primary-700 text-white rounded-full font-semibold hover:bg-primary-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center"
            >
              View Portfolio
              <ClientIcon name="ArrowRight" className="ml-2 h-5 w-5" />
            </Link>
            
            <Link
              href="/contact"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose Our Management Services?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              We provide comprehensive chalet management that maximizes your investment while ensuring exceptional guest experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
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
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Our Core Services
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              From rental management to concierge services, we handle every aspect of your chalet operation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
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
                    Learn More
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
              View All Services
              <ClientIcon name="ArrowRight" className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Proven Results
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Our track record speaks for itself - we deliver exceptional results for property owners across the Alps
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-primary-200">
                  {stat.number}
                </div>
                <div className="text-primary-100 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Discover why property owners trust us with their most valuable investments
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-neutral-50 p-8 rounded-2xl border border-neutral-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <ClientIcon key={i} name="Star" className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-neutral-700 mb-6 italic">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="border-t border-neutral-200 pt-4">
                  <div className="font-semibold text-neutral-900">
                    {testimonial.name}
                  </div>
                  <div className="text-neutral-500 text-sm">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-700 to-primary-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Maximize Your Chalet Investment?
          </h2>
          
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            Join over 150 property owners who trust us with their chalet management. 
            Get started today and see the difference professional management makes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-primary-800 rounded-full font-semibold hover:bg-neutral-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
            >
              <ClientIcon name="Mail" className="mr-2 h-5 w-5" />
              Get Free Consultation
            </Link>
            
            <a
              href="tel:+33123456789"
              className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-primary-800 transition-all duration-300 flex items-center justify-center"
            >
              <ClientIcon name="Phone" className="mr-2 h-5 w-5" />
              Call Now
            </a>
          </div>

          <div className="flex items-center justify-center space-x-6 text-primary-200">
            <div className="flex items-center">
              <ClientIcon name="CheckCircle" className="h-5 w-5 mr-2" />
              No Setup Fees
            </div>
            <div className="flex items-center">
              <ClientIcon name="CheckCircle" className="h-5 w-5 mr-2" />
              Free Consultation
            </div>
            <div className="flex items-center">
              <ClientIcon name="CheckCircle" className="h-5 w-5 mr-2" />
              Quick Setup
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}