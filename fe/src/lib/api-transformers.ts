/**
 * Transform API responses to match frontend data structures
 */

import { APIVehicle, APIPost, APICustomerReview } from '@/types/api';
import { Vehicle } from '@/data/vehicles';
import { Article } from '@/data/articles';

/**
 * Transform API Vehicle to Frontend Vehicle format
 */
export function transformAPIVehicle(apiVehicle: APIVehicle): Partial<Vehicle> {
  return {
    id: apiVehicle.slug,
    name: apiVehicle.title,
    type: apiVehicle.type,
    typeName: getVehicleTypeName(apiVehicle.type),
    isBestSeller: apiVehicle.is_best_seller,
    basePrice: parseFloat(apiVehicle.base_price),
    tagline: apiVehicle.tagline,
    description: apiVehicle.description || '',
    images: [apiVehicle.image_url],
    // Note: colors and versions would need separate API calls or be included in response
    colors: [],
    versions: [],
  };
}

/**
 * Transform API Post to Frontend Article format
 */
export function transformAPIPost(apiPost: APIPost): Partial<Article> {
  return {
    id: apiPost.slug,
    title: apiPost.title,
    category: getCategoryName(apiPost.category?.name),
    date: formatDate(apiPost.published_at),
    image: apiPost.featured_image_url || '/assets/placeholder.png',
    content: apiPost.excerpt || extractExcerpt(apiPost.content),
    body: parseContentToBlocks(apiPost.content),
  };
}

/**
 * Get vehicle type display name
 */
function getVehicleTypeName(type: string): string {
  const typeMap: Record<string, string> = {
    'suv': 'SUV',
    'pickup': 'Bán tải',
    'commercial': 'Thương mại',
  };
  return typeMap[type] || type;
}

/**
 * Map API category to frontend category
 */
function getCategoryName(apiCategory?: string): "Xe Ford" | "Khuyến Mãi" | "Tin tức" {
  if (!apiCategory) return "Tin tức";
  
  const lowerCategory = apiCategory.toLowerCase();
  if (lowerCategory.includes('ford') || lowerCategory.includes('xe')) {
    return "Xe Ford";
  }
  if (lowerCategory.includes('khuyến mãi') || lowerCategory.includes('promotion')) {
    return "Khuyến Mãi";
  }
  return "Tin tức";
}

/**
 * Format date string
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  
  return `${day} ${monthNames[month - 1]}, ${year}`;
}

/**
 * Extract excerpt from HTML content
 */
function extractExcerpt(htmlContent: string, maxLength: number = 200): string {
  // Remove HTML tags
  const textContent = htmlContent.replace(/<[^>]*>/g, ' ').trim();
  
  // Truncate to maxLength
  if (textContent.length <= maxLength) {
    return textContent;
  }
  
  return textContent.substring(0, maxLength) + '...';
}

/**
 * Parse HTML content into article content blocks
 * This is a simplified parser - you may want to use a library like html-react-parser
 */
function parseContentToBlocks(htmlContent: string): any[] {
  const blocks: any[] = [];
  
  // Simple regex-based parsing (consider using a proper HTML parser for production)
  const paragraphs = htmlContent.match(/<p>(.*?)<\/p>/g);
  const headings = htmlContent.match(/<h[2-3]>(.*?)<\/h[2-3]>/g);
  const lists = htmlContent.match(/<ul>(.*?)<\/ul>/g);
  const images = htmlContent.match(/<img[^>]+src="([^">]+)"/g);
  
  // Add paragraphs
  if (paragraphs) {
    paragraphs.forEach(p => {
      const text = p.replace(/<\/?p>/g, '').trim();
      if (text) {
        blocks.push({
          type: 'paragraph',
          value: text,
        });
      }
    });
  }
  
  // Add headings
  if (headings) {
    headings.forEach(h => {
      const text = h.replace(/<\/?h[2-3]>/g, '').trim();
      if (text) {
        blocks.push({
          type: 'heading',
          value: text,
        });
      }
    });
  }
  
  // Add lists
  if (lists) {
    lists.forEach(ul => {
      const items = ul.match(/<li>(.*?)<\/li>/g);
      if (items) {
        const listItems = items.map(item => item.replace(/<\/?li>/g, '').trim());
        blocks.push({
          type: 'list',
          value: listItems,
        });
      }
    });
  }
  
  // Add images
  if (images) {
    images.forEach(img => {
      const srcMatch = img.match(/src="([^">]+)"/);
      if (srcMatch && srcMatch[1]) {
        blocks.push({
          type: 'image',
          value: srcMatch[1],
        });
      }
    });
  }
  
  return blocks;
}

/**
 * Transform API Customer Review to frontend testimonial format
 */
export function transformAPIReview(apiReview: APICustomerReview): any {
  return {
    name: apiReview.customer_name,
    role: apiReview.customer_role || 'Khách hàng',
    avatarText: getInitials(apiReview.customer_name),
    stars: apiReview.rating,
    comment: apiReview.comment,
  };
}

/**
 * Get initials from name
 */
function getInitials(name: string): string {
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/**
 * Format price for display
 */
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(numPrice);
}
