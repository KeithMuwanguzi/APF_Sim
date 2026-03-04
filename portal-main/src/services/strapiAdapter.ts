/**
 * Strapi Response Adapter
 * Transforms Strapi's nested response structure to flat objects expected by frontend
 */
import { CMS_BASE_URL } from '../config/api';

// Generic Strapi response types
interface StrapiMedia {
  data: {
    id: number;
    attributes: {
      url: string;
      alternativeText?: string;
      width?: number;
      height?: number;
    };
  } | null;
}

interface StrapiRelation<T = any> {
  data: {
    id: number;
    attributes: T;
  } | null;
}

interface StrapiResponse<T> {
  data: Array<{
    id: number;
    attributes: T;
  }>;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiSingleResponse<T> {
  data: {
    id: number;
    attributes: T;
  } | null;
  meta?: any;
}

/**
 * Extract media URL from Strapi media object
 */
export const extractMediaUrl = (media: StrapiMedia | undefined, baseUrl: string = CMS_BASE_URL): string => {
  if (!media?.data?.attributes?.url) return '';
  const url = media.data.attributes.url;
  // If URL is relative, prepend base URL
  return url.startsWith('http') ? url : `${baseUrl}${url}`;
};

/**
 * Extract relation data from Strapi relation object
 */
export const extractRelation = <T>(relation: StrapiRelation<T> | undefined): T | null => {
  return relation?.data?.attributes || null;
};

/**
 * Adapt Strapi collection response to flat array
 */
export const adaptStrapiCollection = <T>(response: StrapiResponse<any>): T[] => {
  if (!response?.data) return [];
  
  return response.data.map((item) => ({
    id: item.id,
    ...item.attributes,
  })) as T[];
};

/**
 * Adapt Strapi single type response to flat object
 */
export const adaptStrapiSingle = <T>(response: StrapiSingleResponse<any>): T | null => {
  if (!response?.data) return null;
  
  return {
    id: response.data.id,
    ...response.data.attributes,
  } as T;
};

/**
 * Build Strapi query string with population
 */
export const buildStrapiQuery = (params: {
  populate?: string | string[] | object;
  filters?: object;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}): string => {
  const queryParams = new URLSearchParams();

  // Handle populate
  if (params.populate) {
    if (typeof params.populate === 'string') {
      queryParams.append('populate', params.populate);
    } else if (Array.isArray(params.populate)) {
      params.populate.forEach((field) => {
        queryParams.append('populate', field);
      });
    } else {
      // Deep populate object
      Object.entries(params.populate).forEach(([key, value]) => {
        queryParams.append(`populate[${key}]`, JSON.stringify(value));
      });
    }
  }

  // Handle filters
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      queryParams.append(`filters[${key}]`, String(value));
    });
  }

  // Handle sort
  if (params.sort) {
    const sortArray = Array.isArray(params.sort) ? params.sort : [params.sort];
    sortArray.forEach((sortField) => {
      queryParams.append('sort', sortField);
    });
  }

  // Handle pagination
  if (params.pagination) {
    if (params.pagination.page) {
      queryParams.append('pagination[page]', String(params.pagination.page));
    }
    if (params.pagination.pageSize) {
      queryParams.append('pagination[pageSize]', String(params.pagination.pageSize));
    }
  }

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};
