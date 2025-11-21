import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import { RootState } from '@/app/store';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user?.name);

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold'>Dashboard</h1>

      <Button
        onClick={() => {
          localStorage.removeItem('token');
          dispatch(logout());
        }}
        className='mt-4 px-4 py-2 bg-red-600 text-white rounded-lg'
      >
        {user} Logout
      </Button>
    </div>
  );
}
