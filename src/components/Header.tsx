import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import style from '@/styles/Header.module.scss';
import Link from '@/components/system/Link';
import Button from '@/components/system/Button';
import { useAuth } from '@/hooks/AuthHook';
import CartIcon from '@/components/icons/CartIcon';
import ProfileIcon from '@/components/icons/ProfileIcon';
import Logo from '@/components/icons/Logo';

const ResponsiveAppBar = () => {
  const router = useRouter();
  const { userSessionData } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

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

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleUserClick = () => {
    console.log(userSessionData);
    if (!!userSessionData) router.replace('/profile');
    if (!userSessionData) router.replace('/login');
  };

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
          <ul className={style.navItemContainer}>
            <li className={style.navItem}>
              <Link href={'/about'}>Über uns</Link>
            </li>
            <li className={style.navItem}>
              <Link href={'/blog'}>Blog</Link>
            </li>
            <li className={style.navItem}>
              <Link href={'/public'}>Wissen</Link>
            </li>
          </ul>
        </div>

        <span
          className={`${style.logo} ${!isLoading ? style.logoSmall : ''}`}
          onClick={() => router.replace('/')}
        >
          <Logo />
        </span>

        <span
          className={`${style.rightNavContainer} ${showContent ? style.fadeIn : style.fadeOut}`}
        >
          <div className={style.cartIcon}>
            <CartIcon onClick={() => router.replace('/cart')} />
          </div>
          <ProfileIcon onClick={handleUserClick} />
        </span>
      </header>
    </>
  );
};

export default ResponsiveAppBar;
