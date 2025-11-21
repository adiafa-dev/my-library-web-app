import { useQuery } from '@tanstack/react-query';
import axios from '@/api/axiosInstance';
import { Category } from '@/types/books.types';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { Icon } from '@iconify/react';

type Props = {
  selectedCategory: number | null;
  selectedRating: number | null;
  onCategoryChange: (id: number | null) => void;
  onRatingChange: (rating: number | null) => void;
};

export default function CategoryFilter({
  selectedCategory,
  selectedRating,
  onCategoryChange,
  onRatingChange,
}: Props) {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/api/categories');
      return res.data.data.categories as Category[];
    },
  });

  if (isLoading) return <p>Loading filter...</p>;

  // Filter Section
  const FilterForm = (
    <div className='p-4'>
      <h3 className='text-lg font-bold mb-4'>FILTER</h3>

      {/* Category */}
      <div>
        <p className='font-semibold mb-2'>Category</p>
        <div className='space-y-2'>
          {data?.map((cat) => (
            <label key={cat.id} className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={selectedCategory === cat.id}
                onChange={() =>
                  onCategoryChange(selectedCategory === cat.id ? null : cat.id)
                }
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className='mt-6'>
        <p className='font-semibold mb-2'>Rating</p>
        <div className='space-y-2'>
          {[5, 4, 3, 2, 1].map((star) => (
            <label
              key={star}
              className='flex items-center gap-2 cursor-pointer'
            >
              <input
                type='checkbox'
                checked={selectedRating === star}
                onChange={() =>
                  onRatingChange(selectedRating === star ? null : star)
                }
              />
              <span className='flex justify-center gap-2'>
                <Star className='w-5 h-5 text-yellow-400 fill-yellow-400' />{' '}
                {star}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className='hidden md:block w-64 border rounded-lg h-fit bg-white'>
        {FilterForm}
      </div>

      {/* MOBILE BUTTON (SHEET) */}
      <div className='md:hidden w-full'>
        <Sheet open={open} onOpenChange={setOpen}>
          <div className='border border-neutral-50 shadow-lg/40 shadow-neutral-300 p-4 rounded-lg bg-white flex justify-between items-center'>
            <h3 className='font-bold text-lg'>FILTER</h3>

            <SheetTrigger>
              <Icon
                icon='material-symbols:filter-list'
                width={24}
                className='cursor-pointer'
              />
            </SheetTrigger>
          </div>

          <SheetContent side='bottom' className='h-[80%] overflow-y-auto'>
            {FilterForm}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
