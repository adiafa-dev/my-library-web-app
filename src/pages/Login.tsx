import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';
import useLogin from '@/hooks/useLogin';
import IconText from '@/components/ui/icon-text';

// ---- ZOD SCHEMA ----
const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginSchema = z.infer<typeof loginSchema>;

const Login = () => {
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    try {
      setApiError('');

      const result = await loginMutation.mutateAsync(values);

      if (result.user.role === 'ADMIN') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }

      setTimeout(() => {
        loginMutation.reset();
      }, 0);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const apiErr = err as {
          response?: { data?: { message?: string } };
        };

        setApiError(apiErr.response?.data?.message ?? 'Login failed');
      } else {
        setApiError('Login failed');
      }
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
            Login
          </h1>
          <p className='text-sm md:text-md text-neutral-700 mb-5 font-semibold'>
            Sign in to manage your library account.
          </p>

          {apiError && (
            <p className='text-red-600 text-sm font-medium'>{apiError}</p>
          )}

          {/* EMAIL */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>

                <Input placeholder='Email...' {...field} />

                <FormMessage />
              </FormItem>
            )}
          />

          {/* PASSWORD */}
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>

                <PasswordInput placeholder='Password...' {...field} />

                <FormMessage />
              </FormItem>
            )}
          />

          {/* BUTTON */}
          <Button
            type='submit'
            className='w-full text-white'
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Loading...' : 'Login'}
          </Button>

          <p className='text-sm md:text-md font-semibold text-center'>
            Don&apos;t have an account?{' '}
            <Link
              className='font-bold hover:underline text-primary-300'
              to='/register'
            >
              Register
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default Login;
