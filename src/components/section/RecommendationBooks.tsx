import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '@/api/axiosInstance';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Book } from '@/types/books.types';
import { Link } from 'react-router-dom';

export default function RecommendationSection() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['books', page],
    queryFn: async () => {
      const res = await axios.get(`/api/books/recommend?by=rating&limit=10`);
      return res.data.data;
    },
    placeholderData: (prev) => prev,
  });

  const books: Book[] = data?.books || [];
  const pagination = data?.pagination;

  return (
    <section className='w-full md:py-12 py-6'>
      <div className='custom-container'>
        <h2 className='text-2xl md:text-4xl font-bold mb-5 md:mb-10'>
          Recommendation
        </h2>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
              {books.map((book) => (
                <Link to={`/books/${book.id}`} key={book.id}>
                  <Card className='rounded-lg overflow-hidden shadow-md hover:shadow-lg transition shadow-neutral-400/25'>
                    <CardHeader className='p-0 gap-0'>
                      <img
                        src={
                          book.coverImage ??
                          'https://placehold.co/300x450?text=No+Cover'
                        }
                        alt={book.title}
                        className='w-full h-84 object-cover'
                      />
                    </CardHeader>

                    <CardContent className='p-4 space-y-1'>
                      <h3 className='font-bold text-sm md:text-lg truncate'>
                        {book.title}
                      </h3>
                      <p className='text-sm md:text-md text-neutral-700'>
                        {book.author?.name}
                      </p>

                      <div className='flex items-center text-sm md:text-md font-semibold gap-1 pt-1'>
                        <Star
                          className='w-4 h-4 text-[#FFAB0D]'
                          fill='#FFAB0D'
                        />
                        <span>{book.rating}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {pagination?.page < pagination?.totalPages && (
              <div className='flex justify-center mt-6'>
                <Button
                  variant='outline'
                  disabled={isFetching}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  {isFetching ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
