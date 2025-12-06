import { useMemo } from 'react';
import axios from '@/api/axiosInstance';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BookDetailType } from '@/types/books.types';

export default function useBookDetails(bookIds: number[]) {
  const qc = useQueryClient();

  const ids = useMemo(
    () => Array.from(new Set(bookIds.filter(Boolean))).map(Number),
    [bookIds]
  );

  const idsKey = ids.join(',');

  const query = useQuery<BookDetailType[], Error>({
    queryKey: ['books', idsKey],
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,

    queryFn: async () => {
      // --- attempt batch fetch ---
      try {
        const batchRes = await axios.get('/api/books', {
          params: { ids: ids.join(',') },
        });

        const data = batchRes.data?.data;

        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.books)) return data.books;
      } catch {
        /* fallback to single fetches */
      }

      // --- fallback fetch per ID ---
      const results = await Promise.all(
        ids.map(async (id) => {
          const res = await axios.get(`/api/books/${id}`);
          return res.data?.data as BookDetailType;
        })
      );

      return results;
    },
  });

  // Prefill single-book cache
  if (query.data) {
    query.data.forEach((b) => {
      qc.setQueryData(['book', String(b.id)], b);
    });
  }

  // Convert array → map for easier lookup
  const booksMap =
    query.data?.reduce<Record<number, BookDetailType>>((acc, b) => {
      acc[b.id] = b;
      return acc;
    }, {}) ?? {};

  return {
    booksMap,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
