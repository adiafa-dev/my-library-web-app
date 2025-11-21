import { useQuery } from '@tanstack/react-query';
import axios from '@/api/axiosInstance';
import { Card, CardContent } from '@/components/ui/card';
import { Author, BookType } from '@/types/books.types';
import { Skeleton } from '../ui/skeleton';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const PopularAuthors = () => {
  const authorsQuery = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const res = await axios.get('/api/authors');
      return res.data.data.authors as Author[];
    },
  });

  const booksQuery = useQuery({
    queryKey: ['books-all'],
    queryFn: async () => {
      const res = await axios.get('/api/books?limit=50');
      return res.data.data.books as BookType[];
    },
  });

  const authors = authorsQuery.data || [];
  const books = booksQuery.data || [];

  // Count books per authorId
  const countMap: Record<number, number> = {};

  books.forEach((book) => {
    if (book.authorId) {
      countMap[book.authorId] = (countMap[book.authorId] || 0) + 1;
    }
  });

  // SORT AUTHORS by book count (descending)
  const sortedAuthors = [...authors].sort((a, b) => {
    const countA = countMap[a.id] || 0;
    const countB = countMap[b.id] || 0;
    return countB - countA; // terbesar → terkecil
  });

  const isLoading = authorsQuery.isLoading || booksQuery.isLoading;

  return (
    <section className='w-full '>
      <div className='custom-container md:mt-12 md:pb-29 pb-4'>
        <h2 className='text-2xl md:text-4xl font-bold mb-6 md:mb-10 pt-6 md:pt-12 border-t-neutral-300 border-t'>
          Popular Authors
        </h2>

        {/* SKELETON LOADING */}
        {isLoading ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card
                key={i}
                className='rounded-lg p-4 flex flex-row items-center gap-4 shadow-sm'
              >
                <Skeleton className='w-14 h-14 rounded-full' />
                <div className='flex flex-col gap-2 flex-1'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-4 w-20' />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
            {sortedAuthors.map((author) => {
              const bookCount = countMap[author.id] || 0;

              return (
                <Link key={author.id} to={`/authors/${author.id}/books`}>
                  <Card className='rounded-lg p-4 flex flex-row items-center gap-4 shadow-md shadow-neutral-400/25 border-neutral-100 border transition'>
                    {/* Avatar */}
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${author.name}`}
                      alt={author.name}
                      className='w-15 h-15 md:w-20 md:h-20 rounded-full object-cover'
                    />

                    <CardContent className='p-0'>
                      <h3 className='font-bold text-md md:text-lg'>
                        {author.name}
                      </h3>

                      <div className='flex items-center gap-2 text-sm text-neutral-600 mt-1'>
                        <Icon
                          icon='material-symbols:book'
                          width={24}
                          className='text-primary-300'
                        />
                        <span className='text-sm md:text-md font-medium text-neutral-950'>
                          {bookCount} books
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularAuthors;
