'use client';

import Link from 'next/link';
import { Mountain, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from '../providers/LanguageProvider';

const socialIcons = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'LinkedIn', href: '#', icon: Linkedin }
];

export default function Footer() {
  const { t } = useTranslation();
  const footerTranslations = useTranslation('footer');
  const footer = footerTranslations.content;
  const currentYear = new Date().getFullYear();
  const navigation = footer.sections ?? {};
  const contact = footer.contact ?? {};
  const newsletter = footer.newsletter ?? {};
  const brand = footer.brand ?? {};
  const bottomBar = footer.bottomBar ?? {};
  const brandName = t('navigation.brandName');
  const emailHref = contact.email ? `mailto:${contact.email}` : '#';
  const sanitizedPhone = contact.phone ? contact.phone.replace(/\s+/g, '') : '';
  const phoneHref = sanitizedPhone ? `tel:${sanitizedPhone}` : '#';
  const locationLines = contact.locationLines ?? [];

  return (
    <footer className="bg-neutral-900 text-neutral-500 text-[12px] font-light">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <Mountain className="h-8 w-8 text-primary-600" />
              <span className="text-lg uppercase text-neutral-100 font-thin mb-6">{brandName}</span>
            </Link>

            <p className="text-neutral-600 mb-6 leading-relaxed">
              {brand.description}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-600 flex-shrink-0" />
                <a
                  href={emailHref}
                  className="text-neutral-600 hover:text-white transition-colors"
                >
                  {contact.email}
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-600 flex-shrink-0" />
                <a
                  href={phoneHref}
                  className="text-neutral-600 hover:text-white transition-colors"
                >
                  {contact.phone}
                </a>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-600">
                  {locationLines.map((line, index) => (
                    <span key={line}>
                      {line}
                      {index !== locationLines.length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg uppercase  text-neutral-100 font-thin mb-6">{navigation.services?.title}</h3>
            <ul className="space-y-3">
              {navigation.services?.links?.map((item) => (
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
            <h3 className="text-lg uppercase  text-neutral-100 font-thin mb-6">{navigation.company?.title}</h3>
            <ul className="space-y-3">
              {navigation.company?.links?.map((item) => (
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
            <h3 className="text-lg uppercase text-neutral-100 font-thin mb-6">{newsletter.title}</h3>

            {/* Newsletter Signup */}
            <div className="mb-6">
              <p className="text-neutral-600 text-sm mb-3">{newsletter.description}</p>
              <form className="space-y-2">
                <input
                  type="email"
                  placeholder={newsletter.placeholder}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-neutral-600"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary-700 text-white rounded-lg font-medium hover:bg-primary-800 transition-colors duration-200"
                >
                  {newsletter.button}
                </button>
              </form>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-sm text-neutral-600 mb-3">{newsletter.followUs}</p>
              <div className="flex space-x-3">
                {socialIcons.map((item) => {
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
              © {currentYear} {brandName}. {bottomBar.copyright}
            </div>

            <div className="flex items-center space-x-6">
              {navigation.legal?.links?.map((item) => (
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