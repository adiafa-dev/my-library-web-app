import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '@/api/axiosInstance';
import AuthorHeader from '@/components/section/AuthorHeader';
import BookList from '@/components/section/BookList';
import { BookDetailType, Author } from '@/types/books.types';

export default function AuthorList() {
  const { id } = useParams();
  const authorId = Number(id);

  // Fetch author manually from list
  const authorQuery = useQuery({
    queryKey: ['author-detail', authorId],
    queryFn: async () => {
      const res = await axios.get('/api/authors');
      const authors = res.data.data.authors as Author[];

      const author = authors.find((a) => a.id === authorId);

      return author ?? null; // <– NOT undefined
    },
  });

  // Fetch books by author
  const booksQuery = useQuery({
    queryKey: ['author-books', authorId],
    queryFn: async () => {
      const res = await axios.get(`/api/authors/${authorId}/books`);
      return res.data.data.books as BookDetailType[];
    },
  });

  if (authorQuery.isLoading || booksQuery.isLoading)
    return <p className='p-10'>Loading...</p>;

  const author = authorQuery.data;
  const books = booksQuery.data ?? [];

  if (!author) return <p className='p-10'>Author not found.</p>;

  return (
    <div className='custom-container py-10 md:pb-29.5'>
      <AuthorHeader author={author} totalBooks={books.length} />

      <h2 className='text-2xl font-bold mt-10 mb-5'>Book List</h2>

      <BookList books={books} />
    </div>
  );
}
