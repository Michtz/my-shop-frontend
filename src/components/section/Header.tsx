import * as React from 'react';
import { useRouter } from 'next/navigation';
import MaterialIcon from '@/components/system/MaterialIcon';

import style from '@/styles/Header.module.scss';
import Link from '@/components/system/Link';
import Button from '@/components/system/Button';

const ResponsiveAppBar = () => {
  const router = useRouter();
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

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <header className={style.header}>
        <div className={style.leftNavContainer}>
          <span className={style.logo} onClick={() => router.replace('/')}>
            Logo
          </span>
          <ul className={style.navItemContainer}>
            <li className={style.navItem}>
              <Link href={'/'}>Über uns</Link>
            </li>
            <li className={style.navItem}>
              <Link href={'/'}>Blog</Link>
            </li>
            <li className={style.navItem}>
              <Link href={'/'}>Wissen</Link>
            </li>
          </ul>
        </div>
        <span className={style.rightNavContainer}>
          <Button
            appearance={'icon'}
            variant={'ghost'}
            icon={'shopping_cart'}
            onClick={() => router.replace('/cart')}
          />
          <span>Avatar</span>
        </span>
      </header>
    </>
  );
};
export default ResponsiveAppBar;
