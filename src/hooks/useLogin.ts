import { useMutation } from '@tanstack/react-query';
import { loginApi } from '@/api/auth.api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { LoginResponse } from '@/types/auth.types';

export default function useLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation<LoginResponse, Error, { email: string; password: string }>(
    {
      mutationFn: loginApi,
      onSuccess: (data) => {
        dispatch(setCredentials(data));
        localStorage.setItem('token', data.token);
        const role = data.user.role;

        if (role === 'ADMIN') {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      },
    }
  );
}
