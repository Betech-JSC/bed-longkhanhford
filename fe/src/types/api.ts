/**
 * TypeScript interfaces for Laravel API responses
 * These match the backend data structure
 */

/**
 * Generic API Response wrapper
 */
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Vehicle related types
 */
export interface APIVehicle {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  tagline: string;
  description?: string;
  image_url: string;
  type: "suv" | "pickup" | "commercial";
  base_price: string;  // Backend returns as string
  is_best_seller: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  // Translations and versions will be included in detail view
  translations?: APIVehicleTranslation[];
  versions?: APIVehicleVersion[];
  colors?: APIVehicleColor[];
}

export interface APIVehicleTranslation {
  id: number;
  vehicle_id: number;
  locale: string;
  title: string;
  slug: string;
  tagline?: string;
  description?: string;
  content?: string;
}

export interface APIVehicleVersion {
  id: number;
  vehicle_id: number;
  version_name: string;
  price: string;
  is_active: boolean;
  sort_order: number;
  specs?: APIVehicleSpec;
}

export interface APIVehicleSpec {
  engine?: string;
  power?: string;
  torque?: string;
  transmission?: string;
  drivetrain?: string;
  dimensions?: string;
  clearance?: string;
  fuel_economy?: string;
}

export interface APIVehicleColor {
  id: number;
  vehicle_id: number;
  color_name: string;
  color_hex: string;
  image_url?: string;
}

export interface APIVehicleCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  vehicle_count?: number;
}

/**
 * Banner types
 */
export interface APIBanner {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  link_url?: string;
  button_text?: string;
  position: string;
  is_active: boolean;
  sort_order: number;
}

/**
 * Customer Review types
 */
export interface APICustomerReview {
  id: number;
  customer_name: string;
  customer_role?: string;
  customer_avatar?: string;
  rating: number;
  comment: string;
  vehicle_id?: number;
  is_featured: boolean;
  created_at: string;
}

/**
 * Sales Consultant types
 */
export interface APISalesConsultant {
  id: number;
  name: string;
  slug: string;
  position: string;
  phone: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  specialties?: string[];
  is_active: boolean;
}

/**
 * Partner types
 */
export interface APIPartner {
  id: number;
  name: string;
  logo_url: string;
  website_url?: string;
  description?: string;
  sort_order: number;
}

/**
 * Product types (Accessories)
 */
export interface APIProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  sale_price?: string;
  image_url: string;
  category_id: number;
  description?: string;
  is_featured: boolean;
  stock_quantity?: number;
}

export interface APIBrand {
  id: number;
  slug: string;
  url: Record<string, string>;
  title: string;
  image?: {
    url?: string | null;
    alt?: string;
  };
}

export interface APIAccessory {
  id: number;
  title: string;
  slug: string;
  code: string;
  categories: { id: number; title: string }[];
  category_name: string;
  brand?: APIBrand | null;
  price: string; // decimal from backend
  description?: string;
  image?: { url: string | null; alt?: string };
  images?: { url: string | null; alt?: string }[];
  fit_vehicles?: string[];
  features?: string[];
  compatibility_text?: string;
  safety_text?: string;
  product_desc_text?: string;
}

/**
 * Post/News types
 */
export interface APIPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image_url?: string;
  category_id: number;
  author_id?: number;
  published_at: string;
  views_count?: number;
  tags?: APITag[];
  category?: APIPostCategory;
}

export interface APIPostCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface APITag {
  id: number;
  name: string;
  slug: string;
}

/**
 * Service types
 */
export interface APIService {
  id: number;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  icon_url?: string;
  image_url?: string;
  price?: string;
  duration?: string;
  is_featured: boolean;
}

/**
 * Job types
 */
export interface APIJob {
  id: number;
  title: string;
  slug: string;
  working_position?: string;
  work_address?: string;
  working_time?: string;
  description?: string;
  content?: string;
  quantity: number;
  expected_time?: string;
  published_at: string;
  status: 'ACTIVE' | 'INACTIVE';
}

/**
 * Agency types
 */
export interface APIAgency {
  id: number;
  name: string;
  slug: string;
  type: 'SHOWROOM' | 'SERVICE' | 'BOTH';
  full_address: string;
  phones: string[];  // JSON array
  info?: {
    email?: string;
    working_time?: string;
    [key: string]: any;
  };
  map_embed_url?: string;
  image_url?: string;
  is_active: boolean;
}

/**
 * Helper type to convert API types to frontend types
 */
export type VehicleFromAPI = Omit<APIVehicle, 'base_price'> & {
  basePrice: number;
  isBestSeller: boolean;
};
