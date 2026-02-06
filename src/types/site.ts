export interface Site {
  id: string;
  name: string;
  capacity: number;
}

export interface Pagination {
  page: number;
  total: number;
  totalPages: number;
}

export interface SitesResponse {
  sites: Site[];
  pagination: Pagination;
}
