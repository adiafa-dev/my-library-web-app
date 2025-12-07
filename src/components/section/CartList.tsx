import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

import { useCart } from '@/context/cart.context';
import useBookDetails from '@/hooks/useBookDetails';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, refetch } = useCart();
  const rawItems = cart?.items;

  const items = useMemo(() => rawItems ?? [], [rawItems]);

  // Extract all bookIds from cart items
  const bookIds = useMemo(() => items.map((i) => i.bookId), [items]);

  // Fetch book detail for each item
  const { booksMap, isLoading: booksLoading } = useBookDetails(bookIds);

  // ============================
  // SELECTION WITHOUT useEffect
  // ============================
  // Using Set instead of array
  const [selectedSet, setSelectedSet] = useState<Set<number>>(new Set());

  const toggleSelect = (id: number) => {
    setSelectedSet((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const selectAll = () => {
    setSelectedSet(new Set(items.map((i) => i.id)));
  };

  const unselectAll = () => {
    setSelectedSet(new Set());
  };

  const handleSelectAllToggle = () => {
    if (selectedSet.size === items.length) unselectAll();
    else selectAll();
  };

  const selected = [...selectedSet];

  // ============================
  // Event Handlers
  // ============================
  const handleRemove = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
      toast.success('Removed from cart');
      refetch();
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleBorrow = () => {
    if (selected.length === 0) {
      toast.error('Please select at least one item.');
      return;
    }

    toast.success('Borrow request created!');
  };

  // ============================
  // Render
  // ============================
  return (
    <div className='custom-container py-10 min-h-screen'>
      <h1 className='text-3xl font-bold mb-6'>My Cart</h1>

      <div className='flex flex-col md:flex-row gap-8'>
        {/* LEFT */}
        <div className='flex-1'>
          {/* Select All Header */}
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <Checkbox
                checked={selectedSet.size === items.length && items.length > 0}
                onCheckedChange={handleSelectAllToggle}
              />
              <span className='font-semibold text-sm'>Select All</span>
            </div>

            <Button
              variant='ghost'
              disabled={items.length === 0}
              onClick={() => {
                clearCart().then(() => {
                  toast.success('Cart cleared');
                  refetch();
                  unselectAll();
                });
              }}
            >
              Clear Cart
            </Button>
          </div>

          {/* Cart Items */}
          <div className='bg-white rounded-xl shadow-sm divide-y'>
            {items.length === 0 && (
              <div className='p-8 text-center text-neutral-500'>
                Your cart is empty.
              </div>
            )}

            {items.map((item) => {
              const book = booksMap[item.bookId];

              return (
                <div key={item.id} className='p-4 flex gap-4 items-start'>
                  {/* Checkbox */}
                  <Checkbox
                    checked={selectedSet.has(item.id)}
                    onCheckedChange={() => toggleSelect(item.id)}
                  />

                  {/* Cover */}
                  <img
                    src={
                      book?.coverImage ??
                      'https://placehold.co/80x120?text=No+Cover'
                    }
                    alt={book?.title ?? 'Book Cover'}
                    className='w-20 h-28 object-cover rounded'
                  />

                  {/* Info */}
                  <div className='flex-1'>
                    <div className='flex flex-col justify-between items-start'>
                      <p className='px-2 py-1 text-sm font-bold border border-neutral-300 rounded-sm bg-neutral-100'>
                        {book?.Category?.name}
                      </p>
                      <p className='font-bold py-1 md:text-lg text-md'>
                        {book?.title}
                      </p>
                      <p className='text-sm md:text-md  text-neutral-500'>
                        {book?.Author?.name}
                      </p>
                    </div>

                    {/* Qty Controls */}
                    <div className='flex items-center gap-4 mt-4'>
                      <button
                        className='ml-auto text-sm text-red-600 hover:underline'
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </button>

                      <p className='text-xs text-neutral-500 ml-2'>
                        {booksLoading
                          ? 'Loading...'
                          : `Stock: ${book?.stock ?? '-'}`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <aside className='md:w-80'>
          <div className='bg-white rounded-2xl p-6 shadow sticky top-20'>
            <h2 className='font-bold text-xl mb-4'>Loan Summary</h2>

            <div className='flex justify-between mb-4'>
              <span className='text-neutral-500 text-sm md:text-md font-medium'>
                Total Books
              </span>
              <span className='font-semibold text-sm md:text-md '>
                {selected.length} items
              </span>
            </div>

            <Button
              className='w-full'
              disabled={selected.length === 0}
              onClick={handleBorrow}
            >
              Borrow Selected
            </Button>

            <Button
              variant='ghost'
              className='w-full mt-3'
              onClick={() => refetch()}
            >
              Refresh Data
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
