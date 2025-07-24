'use client';

import { useState, useEffect } from 'react';
import { IBlogPost, CreateBlogPostRequest, UpdateBlogPostRequest, BlogPostStatus } from '@/types/blog.types';
import { 
  getAllPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost, 
  publishPost, 
  unpublishPost, 
  archivePost 
} from '@/requests/blog.request';
import { Logger } from '@/utils/Logger.class';

export const useAdminBlogPosts = () => {
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    limit: 10,
  });

  const loadPosts = async (
    page?: number,
    limit?: number,
    status?: string,
    search?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllPosts(page, limit, status, search);
      
      if (response.success && response.data) {
        setPosts(response.data.posts);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to load posts');
      }
    } catch (err) {
      Logger.error('Failed to load admin posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const refetch = (
    page?: number,
    limit?: number,
    status?: string,
    search?: string
  ) => {
    loadPosts(page, limit, status, search);
  };

  return {
    posts,
    loading,
    error,
    pagination,
    refetch,
  };
};

export const useAdminBlogPost = (id?: string) => {
  const [post, setPost] = useState<IBlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPost = async (postId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getPostById(postId);
      
      if (response.success && response.data) {
        const blogPost = Array.isArray(response.data) ? response.data[0] : response.data;
        setPost(blogPost);
      } else {
        setError('Post not found');
      }
    } catch (err) {
      Logger.error('Failed to load admin post:', err);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadPost(id);
    }
  }, [id]);

  return {
    post,
    loading,
    error,
    refetch: () => id && loadPost(id),
  };
};

export const useBlogPostActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBlogPost = async (
    postData: CreateBlogPostRequest,
    imageFile?: File
  ): Promise<IBlogPost | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await createPost(postData, imageFile);
      
      if (response.success && response.data) {
        const newPost = Array.isArray(response.data) ? response.data[0] : response.data;
        return newPost;
      } else {
        setError('Failed to create post');
        return null;
      }
    } catch (err) {
      Logger.error('Failed to create post:', err);
      setError('Failed to create post');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateBlogPost = async (
    id: string,
    postData: UpdateBlogPostRequest,
    imageFile?: File
  ): Promise<IBlogPost | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await updatePost(id, postData, imageFile);
      
      if (response.success && response.data) {
        const updatedPost = Array.isArray(response.data) ? response.data[0] : response.data;
        return updatedPost;
      } else {
        setError('Failed to update post');
        return null;
      }
    } catch (err) {
      Logger.error('Failed to update post:', err);
      setError('Failed to update post');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteBlogPost = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await deletePost(id);
      
      if (response.success) {
        return true;
      } else {
        setError('Failed to delete post');
        return false;
      }
    } catch (err) {
      Logger.error('Failed to delete post:', err);
      setError('Failed to delete post');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changePostStatus = async (
    id: string,
    status: BlogPostStatus
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      switch (status) {
        case 'published':
          response = await publishPost(id);
          break;
        case 'draft':
          response = await unpublishPost(id);
          break;
        case 'archived':
          response = await archivePost(id);
          break;
        default:
          throw new Error('Invalid status');
      }
      
      if (response.success) {
        return true;
      } else {
        setError('Failed to change post status');
        return false;
      }
    } catch (err) {
      Logger.error('Failed to change post status:', err);
      setError('Failed to change post status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    changePostStatus,
  };
};