'use client';

import React, { useState, useEffect } from 'react';
import BlogCard from './BlogCard';
import BlogPagination from './BlogPagination';
import BlogSearch from './BlogSearch';
import BlogTagList from './BlogTagList';
import LoadingSpinner from '@/components/system/LoadingSpinner';
import { IBlogPost } from '@/types/blog.types';
import { getPublishedPosts, getAllTags } from '@/requests/blog.request';
import { Logger } from '@/utils/Logger.class';
import styles from '@/styles/blog/BlogList.module.scss';

interface BlogListProps {
  initialPosts?: IBlogPost[];
  initialTags?: string[];
  selectedTag?: string;
  showSearch?: boolean;
  showTagFilter?: boolean;
  pageSize?: number;
}

const BlogList: React.FC<BlogListProps> = ({
  initialPosts = [],
  initialTags = [],
  selectedTag,
  showSearch = true,
  showTagFilter = true,
  pageSize = 10,
}) => {
  const [posts, setPosts] = useState<IBlogPost[]>(initialPosts);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState(selectedTag || '');

  useEffect(() => {
    loadPosts();
    if (showTagFilter && tags.length === 0) {
      loadTags();
    }
  }, [currentPage, activeTag, searchQuery]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await getPublishedPosts(
        currentPage,
        pageSize,
        activeTag,
        searchQuery,
      );

      if (response.success && response.data) {
        setPosts(response.data.posts);
        setTotalPages(response.data.pagination.totalPages);
        setTotalPosts(response.data.pagination.totalPosts);
      }
    } catch (error) {
      Logger.error('Failed to load blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const response = await getAllTags();
      if (response.success && response.data) {
        setTags(response.data);
      }
    } catch (error) {
      Logger.error('Failed to load blog tags:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleTagSelect = (tag: string) => {
    setActiveTag(tag === activeTag ? '' : tag);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setActiveTag('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  if (loading && posts.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.blogList}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Blog</h1>
          <p className={styles.subtitle}>
            {totalPosts} {totalPosts === 1 ? 'post' : 'posts'} found
            {activeTag && ` in "${activeTag}"`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {(activeTag || searchQuery) && (
          <button onClick={clearFilters} className={styles.clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      <div className={styles.filters}>
        {/*  {showSearch && (*/}
        {/*    <BlogSearch */}
        {/*      onSearch={handleSearch}*/}
        {/*      initialQuery={searchQuery}*/}
        {/*    />*/}
        {/*  )}*/}
        {/*  */}
        {showTagFilter && tags.length > 0 && (
          <BlogTagList
            tags={tags}
            selectedTag={activeTag}
            onTagSelect={handleTagSelect}
          />
        )}
      </div>

      {posts.length === 0 ? (
        <div className={styles.noPosts}>
          <h3>No posts found</h3>
          <p>
            {searchQuery || activeTag
              ? 'Try adjusting your search criteria or clearing filters.'
              : 'No blog posts have been published yet.'}
          </p>
        </div>
      ) : (
        <>
          <div className={styles.postsGrid}>
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {loading && posts.length > 0 && (
        <div className={styles.loadingOverlay}>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default BlogList;
