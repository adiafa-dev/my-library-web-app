import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import useRegister from '@/hooks/useRegister';
import { AxiosError } from 'axios';
import IconText from '@/components/ui/icon-text';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name required'),
    email: z.string().email('Enter valid email'),
    phone: z.string().optional(), // tidak dikirim ke API
    password: z.string().min(6, 'Min 6 characters'),
    confirmPassword: z.string().min(6, 'Min 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password does not match',
    path: ['confirmPassword'],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

const Register = () => {
  const [apiError, setApiError] = useState('');

  const registerMutation = useRegister();
  const navigate = useNavigate();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      //phone: '',
      password: '',
      //confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterSchema) => {
    try {
      setApiError('');
      await registerMutation.mutateAsync(values);

      navigate('/login');
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const msg = axiosErr.response?.data?.message ?? 'Register failed';
      setApiError(msg);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='p-6 w-full max-w-md space-y-4'
        >
          <Link to='/'>
            {/* Logo Part */}
            <IconText>
              <IconText.Icon
                srcIcon='/assets/icons/Booky-Logo.png'
                altIcon='Booky-Logo'
                className='w-8.25'
              />
              <IconText.Text className='display-xs-bold'>Booky</IconText.Text>
            </IconText>
          </Link>

          <h1 className='text-display-xs font-bold md:text-display-sm mb-0.5 md:mb-2'>
            Register
          </h1>
          <p className='text-sm md:text-md text-neutral-700 mb-5 font-semibold'>
            Create your account to start borrowing books.
          </p>
          {apiError && <p className='text-red-600'>{apiError}</p>}

          {/* Name */}
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Your name...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Email...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone No (Tidak dikirim ke API) */}
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Handphone (optional)</FormLabel>
                <FormControl>
                  <Input placeholder='0812xxxx...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder='Password...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder='Re-type password...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            disabled={registerMutation.isPending}
            className='w-full bg-blue-600 text-white'
          >
            {registerMutation.isPending ? 'Loading...' : 'Create Account'}
          </Button>

          <p className='text-sm md:text-md font-semibold text-center'>
            Already have an account?{' '}
            <Link
              className='font-bold hover:underline text-primary-300'
              to='/login'
            >
              Login
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default Register;
