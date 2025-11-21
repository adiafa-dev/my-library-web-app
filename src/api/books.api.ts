import apiInstance from '@/api/axiosInstance';
import { Book } from '@/types/books.types';

export const getBooks = async (): Promise<Book[]> => {
  const res = await apiInstance.get('/api/books');
  return res.data.data;
};
