import { Author } from '@/types/books.types';
import { Icon } from '@iconify/react';

type Props = { author: Author; totalBooks: number };

export default function AuthorHeader({ author, totalBooks }: Props) {
  return (
    <div className='p-6 rounded-xl bg-white shadow-sm flex gap-4 items-center'>
      <img
        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${author.name}`}
        alt={author.name}
        className='w-16 h-16 rounded-full'
      />

      <div>
        <h3 className='font-bold text-md md:text-lg'>{author.name}</h3>
        <div className='flex items-center gap-2 text-sm text-neutral-600 mt-1'>
          <Icon
            icon='material-symbols:book'
            width={24}
            className='text-primary-300'
          />
          <span className='text-sm md:text-md font-medium text-neutral-950'>
            {totalBooks} books
          </span>
        </div>
      </div>
    </div>
  );
}
