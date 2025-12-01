export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export type RegisterResponse = LoginResponse;
