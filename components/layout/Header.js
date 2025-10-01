'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Mountain } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Séminaires', href: '/seminaires-evenements' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/contact' }
  ];

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className={`flex items-center space-x-2 transition-colors duration-200 ${
              isScrolled ? 'text-primary-800' : 'text-white'
            } hover:text-primary-600`}
          >
            <Mountain className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">
              Chalet Manager
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 relative group ${
                  isActive(item.href)
                    ? isScrolled 
                      ? 'text-primary-700' 
                      : 'text-white'
                    : isScrolled 
                      ? 'text-neutral-600 hover:text-primary-700' 
                      : 'text-white/90 hover:text-white'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 transform scale-x-100 transition-transform duration-200" />
                )}
                {!isActive(item.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth"
              className={`text-sm font-medium transition-colors duration-200 ${
                isScrolled
                  ? 'text-neutral-600 hover:text-primary-700'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                isScrolled
                  ? 'bg-primary-700 text-white hover:bg-primary-800 shadow-md hover:shadow-lg'
                  : 'bg-white text-primary-800 hover:bg-neutral-100 shadow-lg hover:shadow-xl'
              }`}
            >
              Sign up
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className={`md:hidden inline-flex items-center justify-center p-2 rounded-lg transition-colors duration-200 ${
              isScrolled 
                ? 'text-neutral-600 hover:text-primary-700' 
                : 'text-white hover:text-white/90'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <nav className="py-4 space-y-2 bg-white/95 backdrop-blur-sm rounded-lg mt-2 shadow-lg">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-3 text-base font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-neutral-600 hover:text-primary-700 hover:bg-neutral-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-4 pt-4 space-y-3 border-t border-neutral-100">
              <Link
                href="/auth"
                className="block w-full px-4 py-3 text-center text-neutral-600 font-medium rounded-full border border-neutral-200 hover:text-primary-700 hover:border-primary-200 transition-colors duration-200"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="block w-full px-6 py-3 text-center bg-primary-700 text-white rounded-full font-medium hover:bg-primary-800 transition-colors duration-200"
              >
                Sign up
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}