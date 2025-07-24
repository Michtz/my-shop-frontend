'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/system/Container';
import { useTranslation } from 'react-i18next';
import styles from '@/styles/admin/AdminMain.module.scss';

const AdminMainContainer: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const adminSections = [
    {
      title: t('admin.productManagement', 'Product Management'),
      description: 'Manage your product catalog, inventory, and pricing',
      href: '/admin/products',
      icon: '📦',
    },
    {
      title: t('admin.blogManagement', 'Blog Management'),
      description: 'Create and manage blog posts, articles, and content',
      href: '/admin/blog',
      icon: '📝',
    },
  ];

  return (
    <Container flow="column" alignItems="center">
      <div className={styles.adminMain}>
        <div className={styles.header}>
          <h1>{t('admin.adminPanel', 'Admin Panel')}</h1>
          <p className={styles.subtitle}>
            {t('admin.adminDescription', 'Manage your store content and settings')}
          </p>
        </div>

        <div className={styles.sectionsGrid}>
          {adminSections.map((section) => (
            <div
              key={section.href}
              className={styles.sectionCard}
              onClick={() => router.push(section.href)}
            >
              <div className={styles.sectionIcon}>{section.icon}</div>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              <p className={styles.sectionDescription}>{section.description}</p>
              <div className={styles.sectionArrow}>→</div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default AdminMainContainer;