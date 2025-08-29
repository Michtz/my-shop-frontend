'use client';

import React, { FC } from 'react';
import { Container } from '@/components/system/Container';
import { useAuth } from '@/hooks/AuthHook';
import Login from '@/components/section/user/Login';
import AdminProductsContainer from '@/components/section/admin/product/AdminProductsContainer';
import AdminBlogContainer from '@/components/section/admin/blog/AdminBlogContainer';
import AdminOverview from '@/components/section/admin/AdminOverview';

interface AdminContainerProps {
  view: 'overview' | 'login' | 'products' | 'blog';
}

const AdminContainer: FC<AdminContainerProps> = ({ view }) => {
  const { userInformation } = useAuth();
  if (!userInformation) view = 'login';
  return (
    <Container padding={false} alignItems={'center'} flow={'column'}>
      <AdminContent view={view} />
    </Container>
  );
};

const AdminContent: React.FC<AdminContainerProps> = ({
  view,
}): React.ReactElement => {
  const getCurrentView = (): React.ReactElement => {
    switch (view) {
      case 'login':
        return <Login goTo={null} />;
      case 'overview':
        return <AdminOverview />;
      case 'products':
        return <AdminProductsContainer />;
      case 'blog':
        return <AdminBlogContainer />;
      default:
        return <></>;
    }
  };
  return <Container justifyContent={'center'}>{getCurrentView()}</Container>;
};

export default AdminContainer;
