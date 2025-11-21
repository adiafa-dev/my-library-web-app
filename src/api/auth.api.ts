import apiInstance from '@/api/axiosInstance';
import { LoginResponse, RegisterResponse } from '@/types/auth.types';

export const loginApi = async (data: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  const res = await apiInstance.post('/api/auth/login', data);

  const pay = res.data.data;

  return {
    token: pay.token,
    user: {
      id: pay.user.id,
      name: pay.user.name,
      email: pay.user.email,
    },
  };
};

export const registerApi = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> => {
  const res = await apiInstance.post('/api/auth/register', data);

  const pay = res.data.data;

  // Register backend biasanya TIDAK mengirim token
  const token = pay.token ?? '';

  // Register backend mungkin TIDAK punya pay.user
  const user = pay.user ?? pay;

  return {
    token,
    user: {
      id: user.id,
      name: user.name ?? '',
      email: user.email,
    },
  };
};
