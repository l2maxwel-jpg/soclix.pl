import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mic2, Globe, Moon, Sun, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'be', name: 'Беларуская', flag: '🇧🇾' },
];

const Navbar = ({ darkMode, setDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const langMenuRef = useRef(null);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const navLinks = [
    { name: t('nav.myStreams'), path: '/streams' },
    { name: t('nav.pricing'), path: '/pricing' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setLangMenuOpen(false);
  };

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
              <Mic2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-emerald-500">SOCLIX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-emerald-500 ${
                  isActive(link.path)
                    ? 'text-emerald-500'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative" ref={langMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-2"
              >
                <span className="text-lg">{currentLang.flag}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </Button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        i18n.language === lang.code
                          ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-3 px-4 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg ${
                  isActive(link.path)
                    ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile Language Selector */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="px-4 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Language
              </p>
              <div className="grid grid-cols-2 gap-2 px-4">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      i18n.language === lang.code
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span className="truncate">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
