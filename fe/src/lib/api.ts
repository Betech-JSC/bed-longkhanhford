/**
 * API utility for fetching data from Laravel backend
 * Base URL should be configured via environment variable
 */

function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }
  return 'http://localhost:8000/api';
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${getApiBaseUrl()}${endpoint}`;
  const isGet = !options?.method || options.method.toUpperCase() === 'GET';
  
  // Use 60-second ISR revalidation for GET requests unless explicit cache option provided
  const fetchOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options?.headers,
    },
    ...options,
  };

  if (isGet && !options?.cache && !options?.next) {
    (fetchOptions as any).next = { revalidate: 60 };
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
  // Get all vehicles
  getAll: (params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI<any>(`/vehicles${query}`);
  },
  
  // Get featured vehicles
  getFeatured: () => fetchAPI('/vehicles/featured'),
  
  // Get best sellers
  getBestSellers: (params?: Record<string, any>) => fetchAPI('/vehicles/featured'),
  
  // Get vehicle by slug (deduplicated per request via React cache)
  getBySlug: cache((slug: string) => fetchAPI<any>(`/vehicles/${slug}`)),
  
  // Get vehicle categories
  getCategories: () => fetchAPI('/vehicles/categories'),

  // Update layout blocks
  updateLayout: (slug: string, layoutBlocks: any[]) => fetchAPI<any>(`/vehicles/${slug}/layout`, {
    method: 'PUT',
    body: JSON.stringify({ layout_blocks: layoutBlocks }),
  }),
};

/**
 * Used Vehicles API
 */
export const usedVehiclesAPI = {
  // Get all used vehicles
  getAll: (params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI<any>(`/used-vehicles${query}`);
  },
  
  // Get used vehicle by slug
  getBySlug: (slug: string) => fetchAPI<any>(`/used-vehicles/${slug}`),
};

/**
 * Banners API
 */
export const bannersAPI = {
  getAll: () => fetchAPI('/vehicles/banners'),
};

/**
 * Customer Reviews API
 */
export const reviewsAPI = {
  getAll: () => fetchAPI('/vehicles/reviews'),
};

/**
 * Sales Consultants API
 */
export const consultantsAPI = {
  getAll: () => fetchAPI('/vehicles/consultants'),
  getBySlug: (slug: string) => fetchAPI(`/vehicles/consultants/${slug}`),
};

/**
 * Partners API
 */
export const partnersAPI = {
  getAll: () => fetchAPI('/vehicles/partners'),
};

/**
 * Products API
 */
export const productsAPI = {
  getAll: () => fetchAPI('/products'),
  getFlashSale: () => fetchAPI('/product-sale'),
};

/**
 * Accessories API
 */
export const accessoriesAPI = {
  getAll: (params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI<any>(`/accessories${query}`);
  },
  getBySlug: (slug: string) => fetchAPI<any>(`/accessories/${slug}`),
  getCategories: () => fetchAPI<any>('/accessories/categories'),
};

/**
 * Posts/News API (assuming there's a posts endpoint)
 */
export const postsAPI = {
  getAll: (params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI(`/posts${query}`);
  },
  getBySlug: (slug: string) => fetchAPI(`/posts/${slug}`),
};

/**
 * Policies API
 */
export const policiesAPI = {
  getAll: (params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI<any>(`/policies${query}`);
  },
  getBySlug: (slug: string, params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI<any>(`/policies/${slug}${query}`);
  },
};

/**
 * Services API (assuming there's a services endpoint)
 */
export const servicesAPI = {
  getAll: () => fetchAPI('/services'),
  getBySlug: (slug: string) => fetchAPI(`/services/${slug}`),
};

/**
 * Jobs API (assuming there's a jobs endpoint)
 */
export const jobsAPI = {
  getAll: () => fetchAPI('/jobs'),
  getBySlug: (slug: string) => fetchAPI(`/jobs/${slug}`),
};

/**
 * Agencies API (assuming there's an agencies endpoint)
 */
export const agenciesAPI = {
  getAll: () => fetchAPI('/agencies'),
  getBySlug: (slug: string) => fetchAPI(`/agencies/${slug}`),
};

/**
 * Settings API
 */
export const settingsAPI = {
  getInstallmentRates: () => fetchAPI<{ success: boolean; data: { rate_year_1: number; rate_subsequent: number } }>('/settings/installment'),
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
  }>('/settings/general'),
};

/**
 * Regions API
 */
export const regionsAPI = {
  getProvinces: () => fetchAPI<{ success: boolean; data: { id: string; name: string }[] }>('/regions/provinces'),
};

export const registrationFeesAPI = {
  getAll: () => fetchAPI<{ success: boolean; data: any[] }>('/regions/registration-fees'),
};

/**
 * Contacts API
 */
export const contactsAPI = {
  submit: (payload: {
    contact: {
      type: 'CONTACT_FORM' | 'ADVISE_FORM' | 'APPLY_FORM' | 'TEST_DRIVE_SURVEY' | 'SERVICE_SURVEY' | 'SERVICE_BOOKING';
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
  getSchedules: () => fetchAPI<any>('/maintenance-schedules'),
};

/**
 * Customer Handovers API (Tri ân khách hàng)
 */
export const customerHandoversAPI = {
  getAll: () => fetchAPI<{ success: boolean; data: any[] }>('/customer-handovers'),
};

/**
 * Media API for uploads
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
