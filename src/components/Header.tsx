import * as React from 'react';
import { useRouter } from 'next/navigation';
import logo from '@/assets/myShopLogo.png';

import style from '@/styles/Header.module.scss';
import Link from '@/components/system/Link';
import Button from '@/components/system/Button';
import { useAuth } from '@/hooks/AuthHook';
import Image from 'next/image';

const ResponsiveAppBar = () => {
  const router = useRouter();
  const { userSessionData } = useAuth();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

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
      <header className={style.header}>
        <div className={style.leftNavContainer}>
          <span className={style.logo} onClick={() => router.replace('/')}>
            <Image src={logo} alt={'logo'} height={60} />
          </span>
          <ul className={style.navItemContainer}>
            <li className={style.navItem}>
              <Link href={'/public'}>Über uns</Link>
            </li>
            <li className={style.navItem}>
              <Link href={'/public'}>Blog</Link>
            </li>
            <li className={style.navItem}>
              <Link href={'/public'}>Wissen</Link>
            </li>
          </ul>
        </div>
        <span className={style.rightNavContainer}>
          <Button
            appearance={'icon'}
            size={'big'}
            variant={'ghost'}
            icon={'shopping_cart'}
            onClick={() => router.replace('/cart')}
          />
          <span>
            <Button
              appearance={'icon'}
              size={'big'}
              variant={'ghost'}
              icon={'account_circle'}
              onClick={handleUserClick}
            />
          </span>
        </span>
      </header>
    </>
  );
};
export default ResponsiveAppBar;
