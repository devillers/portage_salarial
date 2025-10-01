import Link from 'next/link';
import { Mountain, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigation = {
    services: [
      { name: 'Rental Management', href: '/services#rental' },
      { name: 'Concierge Services', href: '/services#concierge' },
      { name: 'Maintenance', href: '/services#maintenance' },
      { name: 'Tax Administration', href: '/services#tax' },
      { name: 'Séminaires & Événements', href: '/seminaires-evenements' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Portfolio', href: '/portfolio' },
      { name: 'Portage Salarial', href: '/portage-salarial' },
      { name: 'Séminaires', href: '/seminaires-evenements' },
      { name: 'Contact', href: '/contact' },
      { name: 'Admin Login', href: '/admin' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Legal Notice', href: '/legal' },
    ],
    social: [
      { name: 'Facebook', href: '#', icon: Facebook },
      { name: 'Twitter', href: '#', icon: Twitter },
      { name: 'Instagram', href: '#', icon: Instagram },
      { name: 'LinkedIn', href: '#', icon: Linkedin },
    ],
  };

  return (
    <footer className="bg-neutral-900 text-neutral-500 text-[12px] font-light">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <Mountain className="h-8 w-8 text-primary-600" />
              <span className="text-lg uppercase text-neutral-100 font-thin mb-6">Chalet Manager</span>
            </Link>
            
            <p className="text-neutral-600 mb-6 leading-relaxed">
              Professional chalet management services for luxury mountain properties. 
              We handle everything from guest relations to maintenance, maximizing your investment.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-600 flex-shrink-0" />
                <a 
                  href="mailto:contact@chaletmanager.com" 
                  className="text-neutral-600 hover:text-white transition-colors"
                >
                  contact@chaletmanager.com
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-600 flex-shrink-0" />
                <a 
                  href="tel:+33123456789" 
                  className="text-neutral-600 hover:text-white transition-colors"
                >
                  +33 1 23 45 67 89
                </a>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-600">
                  Chamonix-Mont-Blanc<br />
                  Haute-Savoie, France
                </span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg uppercase  text-neutral-100 font-thin mb-6">Our Services</h3>
            <ul className="space-y-3">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-neutral-600 hover:text-white transition-colors duration-200 block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg uppercase  text-neutral-100 font-thin mb-6">Company</h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-neutral-600 hover:text-white transition-colors duration-200 block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h3 className="text-lg uppercase text-neutral-100 font-thin mb-6">Stay Connected</h3>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <p className="text-neutral-600 text-sm mb-3">
                Subscribe to our newsletter for updates and special offers.
              </p>
              <form className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-neutral-600"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary-700 text-white rounded-lg font-medium hover:bg-primary-800 transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-sm text-neutral-600 mb-3">Follow us</p>
              <div className="flex space-x-3">
                {navigation.social.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="p-2 bg-neutral-800 rounded-lg hover:bg-primary-700 transition-colors duration-200 group"
                      aria-label={item.name}
                    >
                      <IconComponent className="h-5 w-5 text-neutral-600 group-hover:text-white" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-[11px] text-neutral-600 uppercase">
              © {currentYear} Chalet Manager. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[11px] text-neutral-600 uppercase hover:text-white transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}