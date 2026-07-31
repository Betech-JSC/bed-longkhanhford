/**
 * API utility for fetching data from Laravel backend.
 * 
 * Caching Strategy (On-Demand ISR):
 * - All GET requests use `force-cache` with tags by default (server-side).
 * - When admin updates CMS → Laravel calls /api/revalidate → purges tags → fresh data.
 * - Client-side fetches (from "use client" pages) bypass server cache naturally.
 * - Mutations (POST/PUT/DELETE) always use `no-store`.
 */

function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname.includes('longkhanhford')) {
      return 'https://cms.longkhanhford.betech-digital.com/api';
    }
    return `${window.location.origin}/api`;
  }
  return 'https://cms.longkhanhford.betech-digital.com/api';
}

/**
 * Generic fetch wrapper with tag-based caching and error handling.
 * 
 * @param endpoint - API endpoint path (e.g. '/vehicles')
 * @param options  - Standard RequestInit options
 * @param tags     - Next.js cache tags for on-demand revalidation
 */
async function fetchAPI<T = any>(
  endpoint: string,
  options?: RequestInit & { next?: { tags?: string[]; revalidate?: number } },
  tags?: string[]
): Promise<T> {
  const url = `${getApiBaseUrl()}${endpoint}`;
  const isGet = !options?.method || options.method.toUpperCase() === 'GET';
  const isServer = typeof window === 'undefined';

  const fetchOptions: RequestInit & { next?: { tags?: string[]; revalidate?: number } } = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options?.headers,
    },
    ...options,
  };

  // Apply caching strategy
  if (isGet && !options?.cache && !options?.next) {
    if (process.env.NODE_ENV === 'development') {
      // Development mode: bypass cache so updates from CMS sync immediately
      fetchOptions.cache = 'no-store';
    } else if (isServer && tags && tags.length > 0) {
      // Server-side: use force-cache with tags for on-demand revalidation
      fetchOptions.cache = 'force-cache';
      fetchOptions.next = { tags };
    } else if (isServer) {
      // Server-side without tags: short ISR revalidation as fallback
      fetchOptions.next = { revalidate: 60 };
    }
    // Client-side: no special cache config (browser handles it)
  }

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      };
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    if (error && error.status) {
      throw error;
    }
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

import { cache } from 'react';

/**
 * Vehicles API
 */
export const vehiclesAPI = {
  getAll: (params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI<any>(`/vehicles${query}`, undefined, ['vehicles']);
  },

  getFeatured: () => fetchAPI('/vehicles/featured', undefined, ['vehicles', 'homepage']),

  getBestSellers: (params?: Record<string, any>) => fetchAPI('/vehicles/featured', undefined, ['vehicles', 'homepage']),

  getBySlug: cache((slug: string) => fetchAPI<any>(`/vehicles/${slug}`, undefined, ['vehicles', `vehicle-${slug}`])),

  getCategories: () => fetchAPI('/vehicles/categories', undefined, ['vehicles']),

  updateLayout: (slug: string, layoutBlocks: any[]) => fetchAPI<any>(`/vehicles/${slug}/layout`, {
    method: 'PUT',
    body: JSON.stringify({ layout_blocks: layoutBlocks }),
  }),
};

/**
 * Used Vehicles API
 */
export const usedVehiclesAPI = {
  getAll: (params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI<any>(`/used-vehicles${query}`, undefined, ['used-vehicles']);
  },

  getBySlug: (slug: string) => fetchAPI<any>(`/used-vehicles/${slug}`, undefined, ['used-vehicles']),
};

/**
 * Banners API
 */
export const bannersAPI = {
  getAll: () => fetchAPI('/vehicles/banners', undefined, ['banners', 'homepage']),
};

/**
 * Customer Reviews API
 */
export const reviewsAPI = {
  getAll: () => fetchAPI('/vehicles/reviews', undefined, ['reviews', 'homepage']),
};

/**
 * Sales Consultants API
 */
export const consultantsAPI = {
  getAll: () => fetchAPI('/vehicles/consultants', undefined, ['consultants']),
  getBySlug: (slug: string) => fetchAPI(`/vehicles/consultants/${slug}`, undefined, ['consultants']),
};

/**
 * Partners API
 */
export const partnersAPI = {
  getAll: () => fetchAPI('/vehicles/partners', undefined, ['partners', 'homepage']),
};

/**
 * Products API
 */
export const productsAPI = {
  getAll: () => fetchAPI('/products', undefined, ['products']),
  getFlashSale: () => fetchAPI('/product-sale', undefined, ['products']),
};

/**
 * Accessories API
 */
export const accessoriesAPI = {
  getAll: (params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI<any>(`/accessories${query}`, undefined, ['accessories']);
  },
  getBySlug: (slug: string) => fetchAPI<any>(`/accessories/${slug}`, undefined, ['accessories']),
  getCategories: () => fetchAPI<any>('/accessories/categories', undefined, ['accessories']),
};

/**
 * Posts/News API
 */
export const postsAPI = {
  getAll: (params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI(`/posts${query}`, undefined, ['posts']);
  },
  getBySlug: (slug: string) => fetchAPI(`/posts/${slug}`, undefined, ['posts']),
};

/**
 * Policies API
 */
export const policiesAPI = {
  getAll: (params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI<any>(`/policies${query}`, undefined, ['policies']);
  },
  getBySlug: (slug: string, params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI<any>(`/policies/${slug}${query}`, undefined, ['policies']);
  },
};

/**
 * Services API
 */
export const servicesAPI = {
  getAll: () => fetchAPI('/services', undefined, ['services']),
  getBySlug: (slug: string) => fetchAPI(`/services/${slug}`, undefined, ['services']),
};

/**
 * Jobs API
 */
export const jobsAPI = {
  getAll: () => fetchAPI('/jobs', undefined, ['jobs']),
  getBySlug: (slug: string) => fetchAPI(`/jobs/${slug}`, undefined, ['jobs']),
};

/**
 * Agencies API
 */
export const agenciesAPI = {
  getAll: () => fetchAPI('/agencies', undefined, ['agencies']),
  getBySlug: (slug: string) => fetchAPI(`/agencies/${slug}`, undefined, ['agencies']),
};

/**
 * Settings API
 */
export const settingsAPI = {
  getInstallmentRates: () => fetchAPI<{ success: boolean; data: { rate_year_1: number; rate_subsequent: number } }>('/settings/installment', undefined, ['settings']),
  getGeneral: () => fetchAPI<{
    success: boolean;
    data: {
      inject_head: string;
      inject_body_start: string;
      inject_body_end: string;
      general_company_address: string;
      general_company_phone: string;
      general_company_hotline: string;
      general_company_tax_code: string;
      general_company_working_hours: string;
      general_company_copyright: string;
      about_team_images?: any[];
    };
  }>('/settings/general', undefined, ['settings']),
};

/**
 * Regions API
 */
export const regionsAPI = {
  getProvinces: () => fetchAPI<{ success: boolean; data: { id: string; name: string }[] }>('/regions/provinces', undefined, ['regions']),
};

export const registrationFeesAPI = {
  getAll: () => fetchAPI<{ success: boolean; data: any[] }>('/regions/registration-fees', undefined, ['regions']),
};

/**
 * Contacts API (mutations — no cache)
 */
export const contactsAPI = {
  submit: (payload: {
    contact: {
      type: 'CONTACT_FORM' | 'ADVISE_FORM' | 'APPLY_FORM' | 'TEST_DRIVE_SURVEY' | 'SERVICE_SURVEY' | 'SERVICE_BOOKING' | 'REPAIR_QUOTE_FORM' | 'NEW_CAR_QUOTE_FORM';
      data: Record<string, any>;
    };
  }) => fetchAPI<{ success: boolean; data: any; message?: string }>('/contacts', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
};

/**
 * Maintenance API
 */
export const maintenanceAPI = {
  getSchedules: () => fetchAPI<any>('/maintenance-schedules', undefined, ['maintenance']),
};

/**
 * Customer Handovers API (Tri ân khách hàng)
 */
export const customerHandoversAPI = {
  getAll: () => fetchAPI<{ success: boolean; data: any[] }>('/customer-handovers', undefined, ['handovers', 'homepage']),
};

/**
 * Media API for uploads (mutations — no cache)
 */
export const mediaAPI = {
  upload: async (file: File): Promise<{ success: boolean; path: string; url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${getApiBaseUrl()}/upload`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      };
    }

    return response.json();
  }
};
