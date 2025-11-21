import { useMutation } from '@tanstack/react-query';
import { registerApi } from '@/api/auth.api';
import { RegisterResponse } from '@/types/auth.types';

export default function useRegister() {
  return useMutation<
    RegisterResponse,
    Error,
    {
      name: string;
      email: string;
      password: string;
    }
  >({
    mutationFn: registerApi,
  });
}
