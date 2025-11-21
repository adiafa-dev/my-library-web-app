// /src/hooks/useMe.ts
import { useQuery } from '@tanstack/react-query';
import axios from '@/api/axiosInstance';
import { MeResponse } from '@/types/user.types';

export const useMe = () => {
  return useQuery<MeResponse>({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await axios.get('/api/me');
      return res.data.data as MeResponse;
    },
  });
};
