import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import style from '@/styles/system/SideNav.module.scss';
import Link from '@/components/system/Link';
import { useAuth } from '@/hooks/AuthHook';
import CartIcon from '@/components/icons/CartIcon';
import ProfileIcon from '@/components/icons/ProfileIcon';
import Logo from '@/components/icons/Logo';
import { Params } from 'next/dist/server/request/params';

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { userSessionData } = useAuth();
  const params: Params = useParams();

  const handleUserClick = () => {
    if (!!userSessionData) router.replace('/profile');
    if (!userSessionData) router.replace('/login');
    onClose();
  };

  const handleLinkClick = () => {
    onClose();
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(/^\/[a-z]{2}/, `/${language}`);
    router.push(newPath);
    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop/Overlay */}
      <div
        className={`${style.backdrop} ${isOpen ? style.backdropVisible : ''}`}
        onClick={onClose}
      />

      {/* Side Navigation */}
      <nav className={`${style.sideNav} ${isOpen ? style.sideNavOpen : ''}`}>
        <div className={style.sideNavContent}>
          {/* Navigation Links */}
          <div className={style.navSection}>
            <Logo width={250} height={30} />
            <ul className={style.navList}>
              <li className={style.navItem}>
                <Link href="/" onClick={handleLinkClick}>
                  {t('nav.home')}
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/about" onClick={handleLinkClick}>
                  {t('nav.about')}
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/blog" onClick={handleLinkClick}>
                  {t('nav.blog')}
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/public" onClick={handleLinkClick}>
                  {t('nav.knowledge')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Links */}
          <div className={style.navSection}>
            <h3 className={style.sectionTitle}>{t('sideNav.service')}</h3>
            <ul className={style.navList}>
              <li className={style.navItem}>
                <Link href="/service/contact" onClick={handleLinkClick}>
                  {t('sideNav.contact')}
                </Link>
              </li>
              <li className={style.navItem}>
                <Link
                  href="/service/customer-service"
                  onClick={handleLinkClick}
                >
                  {t('sideNav.customerService')}
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/service/faq" onClick={handleLinkClick}>
                  {t('sideNav.faq')}
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/service/size-guide" onClick={handleLinkClick}>
                  {t('sideNav.sizeGuide')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className={style.navSection}>
            <h3 className={style.sectionTitle}>{t('sideNav.legal')}</h3>
            <ul className={style.navList}>
              <li className={style.navItem}>
                <Link href="/legal/imprint" onClick={handleLinkClick}>
                  {t('sideNav.imprint')}
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/legal/privacy" onClick={handleLinkClick}>
                  {t('sideNav.privacy')}
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/legal/terms" onClick={handleLinkClick}>
                  {t('sideNav.terms')}
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/legal/shipping" onClick={handleLinkClick}>
                  {t('sideNav.shipping')}
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/legal/returns" onClick={handleLinkClick}>
                  {t('sideNav.returns')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Language Selection */}
          <div className={style.navSection}>
            <h3 className={style.sectionTitle}>{t('sideNav.language')}</h3>
            <ul className={style.navList}>
              <li className={style.navItem}>
                <span
                  className={params.locale === 'de' ? style.activeLanguage : ''}
                  onClick={() => handleLanguageChange('de')}
                >
                  Deutsch
                </span>
              </li>
              <li className={style.navItem}>
                <span
                  className={params.locale === 'en' ? style.activeLanguage : ''}
                  onClick={() => handleLanguageChange('en')}
                >
                  English
                </span>
              </li>
              <li
                style={{ textDecorationStyle: 'solid' }}
                className={style.navItem}
              >
                <span
                  className={params.locale === 'fr' ? style.activeLanguage : ''}
                  onClick={() => handleLanguageChange('fr')}
                >
                  Français
                </span>
              </li>
            </ul>
          </div>

          {/* Action Icons */}
          <div className={style.actionSection}>
            <div
              className={style.actionItem}
              onClick={() => {
                router.replace('/cart');
                onClose();
              }}
            >
              <CartIcon width={24} height={24} />
              <span>{t('sideNav.cart')}</span>
            </div>
            <div className={style.actionItem} onClick={handleUserClick}>
              <ProfileIcon width={24} height={24} />
              <span>
                {userSessionData ? t('sideNav.profile') : t('sideNav.login')}
              </span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SideNav;
