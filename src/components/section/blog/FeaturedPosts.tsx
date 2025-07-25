'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IBlogPost } from '@/types/blog.types';
import { getFeaturedPosts } from '@/requests/blog.request';
import { formatDate } from '@/functions/common';
import { Logger } from '@/utils/Logger.class';
import LoadingSpinner from '@/components/system/LoadingSpinner';
import styles from '@/styles/blog/FeaturedPosts.module.scss';

interface FeaturedPostsProps {
  limit?: number;
  showImages?: boolean;
  title?: string;
  className?: string;
}

const FeaturedPosts: React.FC<FeaturedPostsProps> = ({
  limit = 3,
  showImages = true,
  title = 'Featured Posts',
  className = '',
}) => {
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFeaturedPosts();
  }, [limit]);

  const loadFeaturedPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getFeaturedPosts(limit);
      
      if (response.success && response.data) {
        const postsArray = Array.isArray(response.data) ? response.data : [response.data];
        setPosts(postsArray);
      } else {
        setError('Failed to load featured posts');
      }
    } catch (err) {
      Logger.error('Failed to load featured posts:', err);
      setError('Failed to load featured posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${styles.featuredPosts} ${className}`}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.loading}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || posts.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.featuredPosts} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <Link href="/blog" className={styles.viewAll}>
          View All →
        </Link>
      </div>
      
      <div className={styles.postsList}>
        {posts.map((post, index) => (
          <article key={post._id} className={styles.featuredPost}>
            {showImages && post.featured_image && (
              <div className={styles.imageContainer}>
                <Link href={`/blog/${post.slug}`}>
                  <img 
                    src={post.featured_image} 
                    alt={post.title}
                    className={styles.postImage}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </Link>
              </div>
            )}
            
            <div className={styles.content}>
              <div className={styles.meta}>
                <span className={styles.date}>
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span className={styles.separator}>•</span>
                    <Link 
                      href={`/blog/tag/${encodeURIComponent(post.tags[0])}`}
                      className={styles.primaryTag}
                    >
                      {post.tags[0]}
                    </Link>
                  </>
                )}
              </div>
              
              <h4 className={styles.postTitle}>
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h4>
              
              <p className={styles.excerpt}>{post.excerpt}</p>
              
              <div className={styles.author}>
                <span>By {post.author.name}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      <div className={styles.footer}>
        <Link href="/blog" className={styles.viewAllButton}>
          View All Posts
        </Link>
      </div>
    </div>
  );
};

export default FeaturedPosts;