import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function PasswordInput(props: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className='relative'>
      <Input
        type={show ? 'text' : 'password'}
        {...props}
        className={`pr-10 ${props.className || ''}`}
      />
      <button
        type='button'
        onClick={() => setShow(!show)}
        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
      >
        {show ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
    </div>
  );
}
