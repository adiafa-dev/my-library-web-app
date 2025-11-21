import { useQuery } from '@tanstack/react-query';
import axios from '@/api/axiosInstance';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Book } from '@/types/books.types';

type RelatedBooksProps = {
  categoryId: number;
  currentBookId: number;
};

export default function RelatedBooks({
  categoryId,
  currentBookId,
}: RelatedBooksProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['related-books', categoryId],
    queryFn: async () => {
      const res = await axios.get(
        `/api/books?categoryId=${categoryId}&limit=10`
      );
      return res.data.data.books as Book[];
    },
  });

  const books = (data || []).filter((b: Book) => b.id !== currentBookId);

  return (
    <section className='w-full py-6 md:pt-16 border-t border-neutral-300 mt-6 md:mt-16'>
      <div className=' '>
        <h2 className='text-xl md:text-3xl font-bold mb-6'>Related Books</h2>

        {isLoading ? (
          <p>Loading related books...</p>
        ) : books.length === 0 ? (
          <p>No related books found.</p>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
            {books.map((book) => (
              <Link to={`/books/${book.id}`} key={book.id}>
                <Card className='rounded-lg overflow-hidden shadow-md hover:shadow-lg transition border border-neutral-200'>
                  <CardHeader className='p-0'>
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
                      <Star className='w-4 h-4 text-[#FFAB0D]' fill='#FFAB0D' />
                      <span>{book.rating}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
