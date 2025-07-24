'use client';

import React from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { IBlogPost } from '@/types/blog.types';
import { formatDate } from '@/functions/common';
import BlogSEO from './BlogSEO';
import styles from '@/styles/blog/BlogPost.module.scss';
import 'highlight.js/styles/github.css';

interface BlogPostProps {
  post: IBlogPost;
  relatedPosts?: IBlogPost[];
}

const BlogPost: React.FC<BlogPostProps> = ({ post, relatedPosts = [] }) => {
  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);

    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'reddit':
        shareUrl = `https://reddit.com/submit?url=${url}&title=${title}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <>
      <BlogSEO post={post} />
      
      <article className={styles.blogPost}>
        <div className={styles.breadcrumb}>
          <Link href="/blog">Blog</Link>
          <span className={styles.separator}>›</span>
          {post.tags && post.tags.length > 0 && (
            <>
              <Link href={`/blog/tag/${encodeURIComponent(post.tags[0])}`}>
                {post.tags[0]}
              </Link>
              <span className={styles.separator}>›</span>
            </>
          )}
          <span className={styles.current}>{post.title}</span>
        </div>

        <header className={styles.header}>
          {post.featured_image && (
            <div className={styles.featuredImageContainer}>
              <img 
                src={post.featured_image} 
                alt={post.title}
                className={styles.featuredImage}
              />
            </div>
          )}
          
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{post.title}</h1>
            
            <div className={styles.meta}>
              <div className={styles.author}>
                <span>By {`${post.author_id.firstName} ${post.author_id.lastName}`}</span>
              </div>
              <div className={styles.date}>
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              </div>
              <div className={styles.readTime}>
                <span>{Math.ceil(post.content.length / 1000)} min read</span>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className={styles.tags}>
                {post.tags.map((tag) => (
                  <Link 
                    key={tag} 
                    href={`/blog/tag/${encodeURIComponent(tag)}`}
                    className={styles.tag}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.postContent}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
              components={{
                // Custom link component to handle internal links
                a: ({ href, children, ...props }) => {
                  if (href?.startsWith('/')) {
                    return <Link href={href} {...props}>{children}</Link>;
                  }
                  return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
                },
                // Style code blocks
                code: ({ className, children, ...props }) => {
                  return (
                    <code className={`${className || ''} ${styles.inlineCode}`} {...props}>
                      {children}
                    </code>
                  );
                },
                // Style pre blocks (code blocks)
                pre: ({ children, ...props }) => {
                  return (
                    <pre className={styles.codeBlock} {...props}>
                      {children}
                    </pre>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.shareSection}>
            <h4>Share this post</h4>
            <div className={styles.shareButtons}>
              <button 
                onClick={() => handleShare('twitter')}
                className={`${styles.shareButton} ${styles.twitter}`}
                aria-label="Share on Twitter"
              >
                Twitter
              </button>
              <button 
                onClick={() => handleShare('facebook')}
                className={`${styles.shareButton} ${styles.facebook}`}
                aria-label="Share on Facebook"
              >
                Facebook
              </button>
              <button 
                onClick={() => handleShare('linkedin')}
                className={`${styles.shareButton} ${styles.linkedin}`}
                aria-label="Share on LinkedIn"
              >
                LinkedIn
              </button>
              <button 
                onClick={() => handleShare('reddit')}
                className={`${styles.shareButton} ${styles.reddit}`}
                aria-label="Share on Reddit"
              >
                Reddit
              </button>
            </div>
          </div>

          <div className={styles.authorSection}>
            <h4>About the Author</h4>
            <div className={styles.authorInfo}>
              <div className={styles.authorDetails}>
                <h5>{`${post.author_id.firstName} ${post.author_id.lastName}`}</h5>
                <p>Author bio would go here if available in the backend.</p>
              </div>
            </div>
          </div>
        </footer>
      </article>

      {relatedPosts && relatedPosts.length > 0 && (
        <section className={styles.relatedPosts}>
          <h3>Related Posts</h3>
          <div className={styles.relatedGrid}>
            {relatedPosts.map((relatedPost) => (
              <div key={relatedPost._id} className={styles.relatedCard}>
                {relatedPost.featured_image && (
                  <div className={styles.relatedImage}>
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <img 
                        src={relatedPost.featured_image} 
                        alt={relatedPost.title}
                        loading="lazy"
                      />
                    </Link>
                  </div>
                )}
                <div className={styles.relatedContent}>
                  <h4>
                    <Link href={`/blog/${relatedPost.slug}`}>
                      {relatedPost.title}
                    </Link>
                  </h4>
                  <p className={styles.relatedExcerpt}>{relatedPost.excerpt}</p>
                  <div className={styles.relatedMeta}>
                    {formatDate(relatedPost.publishedAt || relatedPost.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default BlogPost;