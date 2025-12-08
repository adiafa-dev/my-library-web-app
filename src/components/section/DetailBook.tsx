import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '@/api/axiosInstance';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Review, BookDetailType } from '@/types/books.types';
import AutoBreadcrumbs from '../ui/auto-breadcrumbs';
import RelatedBooks from './RelatedBooks';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import { useCart } from '@/context/cart.context';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

const DetailBook = () => {
  const { addToCart, cart } = useCart();
  const { id } = useParams();
  const bookId = Number(id);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  // Fetch Book Detail
  const bookQuery = useQuery<BookDetailType>({
    queryKey: ['book-detail', bookId],
    queryFn: async () => {
      const res = await axios.get(`/api/books/${bookId}`);
      return res.data?.data as BookDetailType;
    },
    enabled: !!bookId,
  });

  // Borrow Mutation
  // const borrowMutation = useMutation<
  //   { success: boolean; message: string; data?: unknown },
  //   AxiosError<ApiErrorResponse>,
  //   { bookId: number; days: number }
  // >({
  //   mutationFn: (payload) =>
  //     axios.post('/api/loans', payload).then((res) => res.data),

  //   onSuccess: (res) => toast.success(res.message ?? 'Borrow Success!'),

  //   onError: (err) =>
  //     toast.error(err.response?.data?.message || 'Borrow failed'),
  // });

  if (bookQuery.isLoading) return <p className='p-10'>Loading book...</p>;
  if (!bookQuery.data) return <p className='p-10'>Book not found.</p>;

  const book = bookQuery.data;
  const reviews = book.Review ?? [];
  const isOutOfStock = (book.availableCopies ?? 0) <= 0;

  return (
    <div className='custom-container pt-0 pb-5 md:py-10'>
      <AutoBreadcrumbs
        lastLabel={book.title}
        middleLabel={book.Category?.name}
        middleLink={`/categories/${book.Category?.id}`}
      />

      {/* TOP SECTION */}
      <div className='flex flex-col md:flex-row gap-10 mb-6 md:mb-16'>
        <div className='flex w-full md:w-1/3 items-center justify-center'>
          <img
            src={
              book.coverImage || 'https://placehold.co/350x500?text=No+Cover'
            }
            alt={book.title}
            className='w-2/3 md:w-full object-contain border-8 border-neutral-200 rounded-md shadow-sm'
          />
        </div>

        {/* RIGHT SECTION */}
        <div className='flex-1 space-y-4'>
          <span className='px-2 py-1 text-sm font-bold border border-neutral-300 rounded-sm bg-neutral-100'>
            {book.Category?.name}
          </span>

          <h1 className='md:text-3xl text-2xl font-bold py-2 mb-0'>
            {book.title}
          </h1>
          <p className='md:text-md text-sm text-neutral-700 font-semibold'>
            {book.Author?.name}
          </p>

          {/* Stats */}
          <div className='flex gap-6 pt-3 mb-6'>
            <div>
              <p className='md:text-2xl text-lg font-bold'>
                {book.availableCopies}
              </p>
              <p className='class="text-sm md:text-md"'>Available Copies</p>
            </div>

            <div className='px-5 border-x border-neutral-300'>
              <p className='md:text-2xl text-lg font-bold flex items-center gap-1'>
                <Star className='w-5 h-5 text-yellow-400 fill-yellow-400' />
                {book.rating.toFixed(1)}
              </p>
              <p className='text-sm md:text-md'>Rating</p>
            </div>

            <div>
              <p className='md:text-2xl text-lg font-bold'>
                {book.reviewCount}
              </p>
              <p className='text-sm md:text-md'>Reviews</p>
            </div>
          </div>

          {/* Description */}
          <div className='pt-4 border-t'>
            <h3 className='text-xl font-bold mb-2'>Description</h3>
            <p className='text-sm md:text-md leading-relaxed'>
              {book.description}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className='flex gap-4 pt-4 items-center'>
            {/* ADD TO CART */}
            <Button
              variant='secondary'
              className='md:px-10 px-6 border'
              disabled={isOutOfStock}
              onClick={() => {
                if (!user) {
                  toast.error('Please login first!');
                  return navigate('/login');
                }

                if (isOutOfStock) {
                  toast.error('This book is currently out of stock!');
                  return;
                }

                addToCart(book.id);
              }}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>

            {/* BORROW BOOK */}
            <Button
              className='md:px-10 px-6'
              disabled={isOutOfStock}
              onClick={() => {
                if (!user) {
                  toast.error('Please login first!');
                  return navigate('/login');
                }

                if (isOutOfStock) {
                  toast.error('This book is currently out of stock!');
                  return;
                }

                // Ambil semua bookId dari cart
                const cartItemIds = cart?.items?.map((i) => i.bookId) ?? [];

                // Gabungkan + hapus duplikat
                const allIds = [...new Set([book.id, ...cartItemIds])];

                // Kirim semuanya ke checkout
                navigate(`/checkout?ids=${allIds.join(',')}`);
              }}
            >
              {isOutOfStock ? 'Unavailable' : 'Borrow Book'}
            </Button>

            {/* SHARE BUTTON */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: document.title,
                    text: 'Check out this book!',
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('URL Copied!');
                }
              }}
              className='cursor-pointer group flex justify-center items-center size-10 rounded-full border border-neutral-300 hover:border-primary-400 p-2'
            >
              <Icon
                icon='ic:outline-share'
                width={28}
                className='group-hover:text-primary-400'
              />
            </button>
          </div>
        </div>
      </div>

      {/* REVIEW SECTION */}
      <div className='pt-6 md:pt-16 border-t border-neutral-300'>
        <h2 className='text-2xl md:text-4xl font-bold'>Review</h2>

        <div className='flex items-center gap-2 mt-2'>
          <Star className='w-5 h-5 text-yellow-400 fill-yellow-400' />
          <p className='font-bold text-md md:text-xl'>
            {book.rating.toFixed(1)} ({book.reviewCount} Reviews)
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-6 mt-6'>
          {reviews.map((review: Review) => (
            <div
              key={review.id}
              className='p-5 border rounded-xl shadow-sm hover:shadow-md transition'
            >
              <div className='flex items-center gap-3'>
                <img
                  src='/assets/images/user-avatar.png'
                  className='w-14 h-14 rounded-full'
                />
                <div className='flex flex-col'>
                  <p className='font-bold text-sm md:text-lg'>
                    {review.User?.name}
                  </p>
                  <p className='text-sm md:text-md'>
                    {new Date(review.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-1 mt-2'>
                {Array.from({ length: review.star }).map((_, i) => (
                  <Star
                    key={i}
                    className='w-4 h-4 text-yellow-400 fill-yellow-400'
                  />
                ))}
              </div>

              <p className='text-sm md:text-md mt-2 font-semibold'>
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RELATED BOOKS */}
      <RelatedBooks
        categoryId={book.Category?.id ?? 0}
        currentBookId={book.id}
      />
    </div>
  );
};

export default DetailBook;
