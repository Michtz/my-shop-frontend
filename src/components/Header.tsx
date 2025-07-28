import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';

import style from '@/styles/Header.module.scss';
import Link from '@/components/system/Link';
import { useAuth } from '@/hooks/AuthHook';
import CartIcon from '@/components/icons/CartIcon';
import ProfileIcon from '@/components/icons/ProfileIcon';
import Logo from '@/components/icons/Logo';
import HamburgerIcon from '@/components/icons/HamburgerIcon';
import SideNav from '@/components/system/SideNav';
import TranslateIcon from '@/components/icons/TranslateIcon';

const ResponsiveAppBar = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const { userSessionData } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    // Simuliere Ladezeit (kannst du durch echte Daten-Loading ersetzen)
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Kurz warten, dann Content einblenden
      setTimeout(() => {
        setShowContent(true);
      }, 300);
    }, 2000); // 2 Sekunden Ladezeit

    return () => clearTimeout(timer);
  }, []);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const closeSideNav = () => {
    setIsSideNavOpen(false);
  };

  const handleUserClick = () => {
    console.log(userSessionData);
    if (!!userSessionData) router.replace('/profile');
    if (!userSessionData) router.replace('/login');
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language).then(() => {
      const currentPath = window.location.pathname;
      const newPath = currentPath.replace(/^\/[a-z]{2}/, `/${language}`);
      router.push(newPath);
    });
    setIsLanguageDropdownOpen(false);
  };

  const languages = [
    { code: 'de', name: 'Deutsch' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Loading Overlay */}
      <div
        className={`${style.loadingOverlay} ${!isLoading ? style.hidden : ''}`}
      >
        <div className={style.loadingLogo}>
          <Logo width={660} height={225} />
        </div>
      </div>

      {/* Actual Header */}
      <header
        className={`${style.header} ${isLoading ? style.headerHidden : style.headerVisible}`}
      >
        <div
          className={`${style.leftNavContainer} ${showContent ? style.fadeIn : style.fadeOut}`}
        >
          <div className={style.hamburgerMenu}>
            <HamburgerIcon
              isOpen={isSideNavOpen}
              onClick={toggleSideNav}
              width={24}
              height={24}
            />
          </div>

          <ul className={style.navItemContainer}>
            <li className={style.navItem}>
              <Link href={'/about'}>{t('nav.about')}</Link>
            </li>
            <li className={style.navItem}>
              <Link href={'/blog'}>{t('nav.blog')}</Link>
            </li>
            <li className={style.navItem}>
              <Link href={'/'}>{t('nav.sale')}</Link>
            </li>
          </ul>
        </div>

        <span
          className={`${style.logo} ${!isLoading ? style.logoSmall : ''}`}
          onClick={() => router.replace('/')}
        >
          <Logo className={style.headerLogo} />
        </span>

        <span
          className={`${style.rightNavContainer} ${showContent ? style.fadeIn : style.fadeOut}`}
        >
          <div className={style.cartIcon}>
            <CartIcon onClick={() => router.replace('/cart')} />
          </div>
          <div className={style.cartIcon}>
            <ProfileIcon onClick={handleUserClick} />
          </div>
          <ul className={style.translationIcon}>
            <li
              className={`${style.navItem} ${style.languageDropdown}`}
              ref={languageDropdownRef}
            >
              <span
                onClick={toggleLanguageDropdown}
                className={style.languageToggle}
              >
                <TranslateIcon />
              </span>
              {isLanguageDropdownOpen && (
                <div className={style.dropdownMenu}>
                  {languages.map((lang) => (
                    <span
                      key={lang.code}
                      className={`${style.dropdownItem} ${params.locale === lang.code ? style.activeLanguage : ''}`}
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      {lang.name}
                    </span>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </span>
      </header>

      <SideNav isOpen={isSideNavOpen} onClose={closeSideNav} />
    </>
  );
};

export default ResponsiveAppBar;
