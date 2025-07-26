import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import style from '@/styles/system/SideNav.module.scss';
import Link from '@/components/system/Link';
import { useAuth } from '@/hooks/AuthHook';
import CartIcon from '@/components/icons/CartIcon';
import ProfileIcon from '@/components/icons/ProfileIcon';
import Logo from '@/components/icons/Logo';

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { userSessionData } = useAuth();

  const handleUserClick = () => {
    if (!!userSessionData) router.replace('/profile');
    if (!userSessionData) router.replace('/login');
    onClose();
  };

  const handleLinkClick = () => {
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
                  Home
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/about" onClick={handleLinkClick}>
                  Über uns
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/blog" onClick={handleLinkClick}>
                  Blog
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/public" onClick={handleLinkClick}>
                  Wissen
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Links */}
          <div className={style.navSection}>
            <h3 className={style.sectionTitle}>Service</h3>
            <ul className={style.navList}>
              <li className={style.navItem}>
                <Link href="/service/contact" onClick={handleLinkClick}>
                  Kontakt
                </Link>
              </li>
              <li className={style.navItem}>
                <Link
                  href="/service/customer-service"
                  onClick={handleLinkClick}
                >
                  Kundenservice
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/service/faq" onClick={handleLinkClick}>
                  FAQ
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/service/size-guide" onClick={handleLinkClick}>
                  Größenratgeber
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className={style.navSection}>
            <h3 className={style.sectionTitle}>Rechtliches</h3>
            <ul className={style.navList}>
              <li className={style.navItem}>
                <Link href="/legal/imprint" onClick={handleLinkClick}>
                  Impressum
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/legal/privacy" onClick={handleLinkClick}>
                  Datenschutz
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/legal/terms" onClick={handleLinkClick}>
                  AGB
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/legal/shipping" onClick={handleLinkClick}>
                  Versand
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/legal/returns" onClick={handleLinkClick}>
                  Widerrufsrecht
                </Link>
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
              <span>Warenkorb</span>
            </div>
            <div className={style.actionItem} onClick={handleUserClick}>
              <ProfileIcon width={24} height={24} />
              <span>{userSessionData ? 'Profil' : 'Anmelden'}</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SideNav;
