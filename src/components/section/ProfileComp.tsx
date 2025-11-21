import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/api/axiosInstance';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { MeResponse } from '@/types/user.types';
import { Input } from '../ui/input';
import { useSearchParams } from 'react-router-dom';

export default function ProfileComp() {
  const [searchParams] = useSearchParams();

  const tabFromUrl = (searchParams.get('tab') ?? 'profile') as
    | 'profile'
    | 'borrowed'
    | 'reviews';

  const [activeTab, setActiveTab] = useState<
    'profile' | 'borrowed' | 'reviews'
  >(tabFromUrl);

  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const queryClient = useQueryClient();

  // GET /api/me
  const { data, isLoading } = useQuery<MeResponse>({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await axios.get('/api/me');
      return res.data.data as MeResponse;
    },
  });

  // PATCH /api/me
  const updateMutation = useMutation({
    mutationFn: async (payload: { name: string }) => {
      return axios.patch('/api/me', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setIsEditing(false);
    },
  });

  if (isLoading || !data) return <p className='p-10'>Loading...</p>;

  const { profile } = data;

  return (
    <div className='custom-container py-10'>
      <div className='w-full md:w-1/2'>
        {/* Tabs */}
        <div className='flex gap-3 border rounded-lg w-full px-3 py-1 bg-neutral-100'>
          {(['profile', 'borrowed', 'reviews'] as const).map((tab) => (
            <Button
              key={tab}
              variant='secondary'
              onClick={() => {
                setActiveTab(tab);
                const params = new URLSearchParams();
                params.set('tab', tab);
                window.history.replaceState(null, '', `?${params.toString()}`);
              }}
              className={cn(
                'px-5 rounded-lg text-sm font-semibold transition h-10',
                activeTab === tab
                  ? 'bg-white shadow-sm font-bold'
                  : 'text-neutral-500 hover:bg-white/70'
              )}
            >
              {tab === 'profile'
                ? 'Profile'
                : tab === 'borrowed'
                ? 'Borrowed List'
                : 'Reviews'}
            </Button>
          ))}
        </div>

        <div className='mt-10'>
          {activeTab === 'profile' && (
            <>
              <h1 className='text-3xl font-bold mb-8'>Profile</h1>
              <div className='w-full border rounded-lg shadow p-6'>
                {/* Avatar */}
                <div className='flex mb-4'>
                  <img
                    src='/assets/images/user-avatar.png'
                    className='w-20 h-20 rounded-full object-cover border'
                  />
                </div>

                {/* User info */}
                <div className='space-y-4 text-sm'>
                  {/* Name */}
                  <div className='flex justify-between items-center'>
                    <span className='font-semibold text-neutral-600'>Name</span>

                    {isEditing ? (
                      <Input
                        type='text'
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className='border px-2 py-1 rounded-md w-1/2'
                      />
                    ) : (
                      <span className='font-semibold'>{profile.name}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div className='flex justify-between'>
                    <span className='font-semibold text-neutral-600'>
                      Email
                    </span>
                    <span className='font-semibold'>{profile.email}</span>
                  </div>

                  {/* Fake field */}
                  <div className='flex justify-between'>
                    <span className='font-semibold text-neutral-600'>
                      Nomor Handphone
                    </span>
                    <span className='font-semibold'>081234567890</span>
                  </div>
                </div>

                {/* Update / Save Button */}
                {!isEditing ? (
                  <Button
                    className='w-full mt-6 py-3 rounded-full'
                    onClick={() => {
                      setIsEditing(true);
                      setNameInput(profile.name);
                    }}
                  >
                    Update Profile
                  </Button>
                ) : (
                  <Button
                    className='w-full mt-6 py-3 rounded-full'
                    disabled={updateMutation.isPending}
                    onClick={() => updateMutation.mutate({ name: nameInput })}
                  >
                    {updateMutation.isPending ? 'Saving...' : 'Save Profile'}
                  </Button>
                )}
              </div>
            </>
          )}

          {activeTab === 'borrowed' && (
            <>
              <h1 className='text-3xl font-bold mb-8'>Borrowed Lists</h1>
              <p className='text-neutral-600 text-center mt-10'>
                No borrowed books yet
              </p>
            </>
          )}

          {activeTab === 'reviews' && (
            <>
              <h1 className='text-3xl font-bold mb-8'>Reviews</h1>
              <p className='text-neutral-600 text-center mt-10'>
                No reviews yet
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
