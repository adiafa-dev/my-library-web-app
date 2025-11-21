import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '@/api/axiosInstance';
import CategoryFilter from '@/components/section/CategoryFIlter';
import BookList from '@/components/section/BookList';
import { BookType } from '@/types/books.types';
import { Button } from '../ui/button';

export default function CategoryList() {
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['books', categoryId, rating, page],
    queryFn: async () => {
      const res = await axios.get('/api/books', {
        params: {
          page,
          limit: 20,
          categoryId: categoryId ?? undefined,
          rating: rating ?? undefined, // ← FIX DI SINI
        },
      });

      return res.data.data;
    },
    placeholderData: (prev) => prev,
  });

  // Frontend filter rating (ini karena API nya ga provide filter untuk rating)
  const filteredBooks = (data?.books || []).filter((book: BookType) => {
    if (rating && book.rating < rating) return false;
    return true;
  });

  const pagination = data?.pagination;

  return (
    <div className='custom-container py-10 '>
      <h1 className='text-3xl font-bold mb-8'>Book List</h1>

      <div className='flex flex-col md:flex-row gap-8'>
        {/* FILTER */}
        <CategoryFilter
          selectedCategory={categoryId}
          selectedRating={rating}
          onCategoryChange={setCategoryId}
          onRatingChange={setRating}
        />

        {/* BOOK LIST */}
        <div className='flex-1'>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <BookList books={filteredBooks} variant='category' />

              {pagination?.page < pagination?.totalPages && (
                <div className='flex justify-center mt-6'>
                  <Button
                    onClick={() => setPage((p) => p + 1)}
                    className='px-6 py-2 rounded-md border hover:bg-neutral-100'
                  >
                    {isFetching ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
