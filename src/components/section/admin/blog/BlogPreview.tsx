'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import BlogPost from '@/components/section/blog/BlogPost';
import { IBlogPost } from '@/types/blog.types';
import styles from '@/styles/admin/blog/BlogPreview.module.scss';

interface BlogPreviewProps {
  post: IBlogPost;
  onBack: () => void;
  onEdit: () => void;
}

const BlogPreview: React.FC<BlogPreviewProps> = ({ post, onBack, onEdit }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.blogPreview}>
      <div className={styles.previewHeader}>
        <div className={styles.previewInfo}>
          <h2>{t('admin.preview', 'Preview')}</h2>
          <p className={styles.previewNote}>
            {t(
              'admin.previewNote',
              'This is how your post will appear to readers',
            )}
          </p>
        </div>

        <div className={styles.previewActions}>
          <button onClick={onEdit} className={styles.editButton}>
            {t('admin.backToEdit', 'Back to Edit')}
          </button>
          <button onClick={onBack} className={styles.backButton}>
            {t('common.back', 'Back')}
          </button>
        </div>
      </div>

      <div className={styles.previewContent}>
        <BlogPost post={post} />
      </div>
    </div>
  );
};

export default BlogPreview;
