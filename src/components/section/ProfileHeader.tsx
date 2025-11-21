// /src/components/section/ProfileHeader.tsx

import { MeResponse } from '@/types/user.types';

type Props = {
  profile: MeResponse['profile'];
  loanStats: MeResponse['loanStats'];
  reviewsCount: number;
};

export default function ProfileHeader({
  profile,
  loanStats,
  reviewsCount,
}: Props) {
  return (
    <div className='w-full bg-white p-5 rounded-xl shadow'>
      <div className='flex items-center gap-4'>
        <img
          src='/assets/images/user-avatar.png'
          alt='avatar'
          className='h-14 w-14 rounded-full'
        />

        <div>
          <h2 className='text-xl font-bold'>{profile.name}</h2>
          <p className='text-sm text-neutral-600'>{profile.email}</p>
        </div>
      </div>

      <div className='grid grid-cols-3 text-center mt-6'>
        <div>
          <p className='font-bold text-lg'>{loanStats.borrowed}</p>
          <p className='text-sm text-neutral-600'>Borrowed</p>
        </div>

        <div>
          <p className='font-bold text-lg'>{reviewsCount}</p>
          <p className='text-sm text-neutral-600'>Reviews</p>
        </div>

        <div>
          <p className='font-bold text-lg'>{loanStats.late}</p>
          <p className='text-sm text-neutral-600'>Late</p>
        </div>
      </div>
    </div>
  );
}
