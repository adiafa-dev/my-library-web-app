import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import axios from '@/api/axiosInstance';

import { useCart } from '@/context/cart.context';
import useBookDetails from '@/hooks/useBookDetails';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { refetch: refetchCart } = useCart();

  // ===========================
  // GET URL PARAMS
  // ===========================
  const params = new URLSearchParams(location.search);
  const fromDetailBookId = params.get('bookId');
  const cartParamIds = params.get('ids'); // "1,4,9"

  const parsedCartIds = cartParamIds
    ? cartParamIds.split(',').map((n) => Number(n.trim()))
    : [];

  const detailBookId = fromDetailBookId ? Number(fromDetailBookId) : null;

  // ===========================
  // COMBINE SELECTED BOOK IDS
  // ===========================
  const combinedBookIds = useMemo(() => {
    const set = new Set<number>();

    // If coming from detail book
    if (detailBookId) set.add(detailBookId);

    // If coming from cart
    parsedCartIds.forEach((id) => set.add(id));

    return Array.from(set);
  }, [detailBookId, parsedCartIds]);

  // ===========================
  // LOAD BOOK DETAILS
  // ===========================
  const { booksMap, isLoading: booksLoading } = useBookDetails(combinedBookIds);

  const books = combinedBookIds
    .map((id) => booksMap[id])
    .filter((b) => b !== undefined);

  // ===========================
  // AGREEMENTS
  // ===========================
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [agreeReturn, setAgreeReturn] = useState(false);

  const canBorrow =
    books.length > 0 && agreePolicy && agreeReturn && !booksLoading;

  // ===========================
  // BORROW MULTIPLE
  // ===========================
  const handleBorrow = async () => {
    if (!canBorrow) {
      toast.error('Please complete all requirements.');
      return;
    }

    try {
      for (const book of books) {
        await axios.post('/api/loans', {
          bookId: book.id,
          days: 7,
        });
      }

      toast.success('All books successfully borrowed!');
      await refetchCart();

      navigate('/profile?tab=borrowed', { replace: true });
    } catch {
      toast.error('Borrow failed. Please try again.');
    }
  };

  // ===========================
  // RENDER
  // ===========================
  return (
    <div className='custom-container py-10 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6'>Checkout</h1>

      {/* ===========================
          BOOK LIST
      ============================ */}
      <div className='bg-white rounded-xl shadow p-6 mb-8'>
        <h2 className='font-bold text-xl mb-4'>Selected Books</h2>

        {booksLoading && <p>Loading books...</p>}

        {!booksLoading && books.length === 0 && (
          <p className='text-neutral-500'>No books selected.</p>
        )}

        {!booksLoading &&
          books.map((book) => (
            <div
              key={book.id}
              className='flex items-start gap-4 py-4 border-b last:border-none'
            >
              <img
                src={
                  book.coverImage ?? 'https://placehold.co/80x120?text=No+Cover'
                }
                className='w-20 h-28 object-cover rounded'
              />

              <div className='flex-1'>
                <p className='px-2 py-1 text-sm font-bold border rounded-sm bg-neutral-100 inline-block'>
                  {book.Category?.name}
                </p>
                <p className='font-bold text-lg'>{book.title}</p>
                <p className='text-sm text-neutral-600'>{book.Author?.name}</p>
              </div>
            </div>
          ))}
      </div>

      {/* ===========================
          AGREEMENT
      ============================ */}
      <div className='bg-white rounded-xl shadow p-6 mb-8'>
        <h2 className='font-bold text-xl mb-4'>Borrow Requirements</h2>

        <div className='flex items-center gap-3 mb-3'>
          <Checkbox
            checked={agreePolicy}
            onCheckedChange={(checked) => setAgreePolicy(Boolean(checked))}
          />
          <p className='text-sm font-semibold'>
            I agree to the library borrowing policies.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Checkbox
            checked={agreeReturn}
            onCheckedChange={(checked) => setAgreeReturn(Boolean(checked))}
          />
          <p className='text-sm font-semibold'>
            I will return the book within 7 days.
          </p>
        </div>
      </div>

      {/* ===========================
          ACTION BUTTON
      ============================ */}
      <Button
        className='w-full py-3 text-lg'
        disabled={!canBorrow}
        onClick={handleBorrow}
      >
        Borrow Now ({books.length} Book{books.length > 1 ? 's' : ''})
      </Button>
    </div>
  );
}
