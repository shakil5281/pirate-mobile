/**
 * Blog Helper Functions
 * Utility functions for blog post processing and formatting
 */

/**
 * Format date for blog posts
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatBlogDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Strip HTML tags from string
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
export const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  const plainText = stripHtml(text);
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + '...';
};

/**
 * Get category color based on category name
 * @param {string} categoryName - Category name
 * @returns {string} Tailwind CSS class
 */
export const getCategoryColor = (categoryName) => {
  const colors = {
    'Industry Insights': 'bg-blue-100 text-blue-800 border-blue-200',
    'Travel News': 'bg-purple-100 text-purple-800 border-purple-200',
    'Blog': 'bg-gray-100 text-gray-800 border-gray-200',
    'eSIM Offer': 'bg-green-100 text-green-800 border-green-200',
    'Technology': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Data Usage': 'bg-orange-100 text-orange-800 border-orange-200',
  };
  return colors[categoryName] || 'bg-green-100 text-green-800 border-green-200';
};

/**
 * Get reading time estimate
 * @param {string} content - Post content
 * @returns {string} Reading time
 */
export const getReadingTime = (content) => {
  if (!content) return '1 min read';
  const wordsPerMinute = 200;
  const wordCount = stripHtml(content).split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
};

/**
 * Extract image URL from srcSet
 * @param {string} srcSet - Image srcSet string
 * @param {string} fallbackUrl - Fallback image URL
 * @returns {string} Image URL
 */
export const extractImageUrl = (srcSet, fallbackUrl = '') => {
  if (!srcSet) return fallbackUrl;
  const urls = srcSet.split(',').map(s => s.trim());
  const largest = urls[urls.length - 1];
  return largest ? largest.split(' ')[0] : fallbackUrl;
};

/**
 * Get author initials from name
 * @param {string} name - Author name
 * @returns {string} Initials
 */
export const getAuthorInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Filter posts by search query
 * @param {Array} posts - Array of posts
 * @param {string} query - Search query
 * @returns {Array} Filtered posts
 */
export const filterPostsBySearch = (posts, query) => {
  if (!query || !query.trim()) return posts;
  const searchLower = query.toLowerCase();
  return posts.filter(post => {
    const title = stripHtml(post.title).toLowerCase();
    const excerpt = stripHtml(post.excerpt).toLowerCase();
    return title.includes(searchLower) || excerpt.includes(searchLower);
  });
};

/**
 * Filter posts by category
 * @param {Array} posts - Array of posts
 * @param {string} category - Category name
 * @returns {Array} Filtered posts
 */
export const filterPostsByCategory = (posts, category) => {
  if (!category || category === 'All') return posts;
  return posts.filter(post => {
    const categories = post.categories?.nodes || [];
    return categories.some(cat => cat.name === category);
  });
};

/**
 * Sort posts by date
 * @param {Array} posts - Array of posts
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted posts
 */
export const sortPostsByDate = (posts, order = 'desc') => {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

