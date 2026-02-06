import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { SitesResponse } from '../types/site';

export const useSites = (page: number = 1) => {
  return useQuery({
    queryKey: ['sites', page],
    queryFn: async () => {
      const response = await api.get<SitesResponse>(`/api/sites?page=${page}`);
      return response;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 5000,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
};