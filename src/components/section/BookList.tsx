import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Book, BookDetailType } from '@/types/books.types';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const gridVariants: Record<string, string> = {
  category: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
  default: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5',
};

type Props = {
  books: Array<Book | BookDetailType>;
  variant?: 'default' | 'category';
};

export default function BookList({ books, variant = 'default' }: Props) {
  return (
    <div className={`grid ${gridVariants[variant]} gap-6`}>
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
              <h3 className='font-bold truncate'>{book.title}</h3>
              <p className='text-sm text-neutral-600'>{book.author?.name}</p>

              <div className='flex items-center gap-1'>
                <Star className='w-4 h-4 text-yellow-500 fill-yellow-500' />
                <span>{book.rating}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
